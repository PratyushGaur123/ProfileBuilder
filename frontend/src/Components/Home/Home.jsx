import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { useUserContext } from '../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";
import NewPassword from '../NewPassword/NewPassword';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import the specific icon you want to use
import { faComment, faHeart, faBookmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { HiPaperAirplane } from "react-icons/hi2";

import axios from 'axios';

const Home = () => {

  const { user, firstName, setFirstName, lastName, setLastName, email, setEmail, setUser } = useUserContext();
  const navigate = useNavigate();
  const [readOnly, setReadOnly] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [text, setText] = useState('');
  const [posts, setPosts] = useState([]);
  // console.log(user);


  useEffect(() => {
    if(!user){
      navigate('/signin');
      return;
    }
    async function fetchPosts() {
      try {
        const res = await axios.get('http://localhost:8000/users/posts/myposts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (res.status === 200) {
          const postArray = res.data.data.posts;
          postArray.map((post) => {
            return {
              ...post,
              isLiked: false,
            }
          });
          setPosts(postArray);
          // console.log(res.data);
        }
      } catch (error) {
        console.log(error.response.data.message);

      }
    }
    fetchPosts();

  }, []);

  // function handleResetPassword() {
  //   setShowNewPassword(true);
  // }

  // function handleCancelToggle() {
  //   setShowCancel((prev) => !prev);
  //   setReadOnly((prev) => !prev);
  //   setFirstName((prev) => prev === '' ? user.firstName : '');
  //   setLastName((prev) => prev === '' ? user.lastName : '');
  //   setEmail((prev) => prev === '' ? user.email : '');
  // }

  // async function handleProfileUpdate() {
  //   console.log(user.firstName, firstName, user.lastName, lastName, user.email, email);

  //   if (user.firstName === firstName && user.lastName === lastName && user.email === email) {
  //     alert("No changes made");
  //     return;
  //   }
  //   if (firstName.length < 2 || firstName.length > 20 || lastName.length < 2 || lastName.length > 20) {
  //     alert("First name and last name must be between 2 and 20 characters");
  //     return;
  //   }
  //   if (email.length < 5 || email.length > 40) {
  //     alert("Email must be between 5 and 40 characters");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await axios.put('http://localhost:8000/users/update-profile', {
  //       firstName,
  //       lastName,
  //       email,
  //     }, {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       }
  //     });

  //     if (response.status === 200) {
  //       alert("Profile updated successfully");
  //       setLoading(false);
  //       const { user } = response.data.data;
  //       console.log(user);
  //       // setFirstName(user.firstName);
  //       // setLastName(user.lastName);
  //       // setEmail(user.email);
  //       setFirstName('');
  //       setLastName('');
  //       setEmail('');
  //       setUser(user);
  //       setShowCancel(false);
  //       setReadOnly(true);
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       if (error.response.status === 404) {
  //         alert('Email does not exist');
  //         navigate('/signup')
  //       }
  //       else if (error.response.status === 400) {
  //         alert(error.response.data.message);
  //       }
  //       else if (error.response.status === 500) {
  //         alert('Something went wrong while updating your Profile');
  //       }
  //     }
  //     else {
  //       alert("Network error. Please check your internet connection.");
  //     }
  //     setLoading(false);
  //   }
  // }

  /* {loading ? <BeatLoader color="#4c8ee6" speedMultiplier={3} size={13} />  */

  async function handlePostCreate() {
    if (!text) {
      alert("Please enter a post");
      return;
    } else {
      try {
        const res = await axios.post('http://localhost:8000/users/posts/create', {
          text,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.status === 200) {
          let post = res.data.data.post;
          // console.log(post);
          setPosts([post, ...posts]);
        }
      } catch (error) {

      }
      setText('');
    }
  }

  async function handlePostDelete(postId) {
    try {
      const res = await axios.delete(`http://localhost:8000/users/posts/delete/${postId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.status === 200) {
        let newPosts = posts.filter((post) => post._id !== postId);
        setPosts(newPosts);
      }
    } catch (error) {
      alert('Post could not be deleted');
    }
  }
  async function handlePostLike(postId) {
    if(!postId){
      return;
    }
    try {
      const res = await axios.post('http://localhost:8000/users/like', {
        likeAbleId: postId,
        type: 'Post'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if(res.status === 200){
        const postIndex = posts.findIndex((post) => post._id === postId);
        if(postIndex!== -1){
          const newPosts = [...posts];
          newPosts[postIndex].isLiked =!newPosts[postIndex].isLiked;
          setPosts(newPosts);
        }
        // setIsLiked( (isLiked) =>!isLiked);
      }

    } catch (error) {
      console.log('The post could not be liked');
    }
  }
  //bg-[#ae7aff]
  return (
    <>

      <div className="min-h-screen bg-[#121212]">

        <div className="mt-[65px] grid grid-cols-12 gap-4 pb-8 pt-0 sm:px-4 sm:pt-8 md:mt-[83px] lg:px-10">

          <aside className="hidden text-white md:col-span-4 md:block lg:col-span-3">
            <div className="sticky top-[100px] border p-4">
              <img
                className="mb-3 flex aspect-square h-16 w-16 flex-shrink-0 rounded-full object-cover"
                src="https://images.pexels.com/photos/7775642/pexels-photo-7775642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="avatar" />
              <h2>Aurora Starlight</h2>
              <p className="text-sm"><button className="hover:text-[#ae7aff]">starryaurora@gmail.com</button></p>
              <hr className="my-2 h-[1px] w-full" />
              <p className="mb-4">Night owl | Moon enthusiast | Wanderlust 🌕🌙🌎</p>
              <button
                className="inline-flex w-max items-center bg-[#f8f7fa] px-4 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">
                View Profile
              </button>
            </div>
          </aside>

          <section className="col-span-12 md:col-span-8 lg:col-span-6">

            {/* CREATE POST */}
            <div className="mb-2 flex w-full items-center justify-start border-b border-t border-white px-4 py-2 sm:mb-6 sm:border-l sm:border-r sm:shadow-[5px_5px_0px_0px_#4f4e4e]">
              <img
                className="flex aspect-square h-10 w-10 shrink-0 rounded-full object-cover"
                src="https://images.pexels.com/photos/7775642/pexels-photo-7775642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="avatar" />
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type to add something"
                className="w-full bg-transparent p-2 text-white !outline-none placeholder:text-gray-500 md:p-4" />
              <div className="flex gap-x-1 sm:gap-x-2">
                {/* <button className="flex shrink-0 items-center justify-center p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-6 text-white">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"></path>
                  </svg>
                </button> */}
                {/* <button className="flex shrink-0 items-center justify-center p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-6 text-white">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"></path>
                  </svg>
                </button> bg-[#ae7aff]*/}
                <button className="flex shrink-0 items-center justify-center bg-[#f8f7fa] p-1" type='submit' onClick={handlePostCreate}>
                <HiPaperAirplane  className='h-5 w-5' />
                </button>
              </div>
            </div>

            {/* POSTS  <FontAwesomeIcon icon="fa-solid fa-trash-can" style={{color: "#fe0b0b",}} />*/}
            {posts.map((post, index) => (
              <div className="relative mb-2 w-full last:mb-0 sm:mb-4" key={index}>
                <div className="flex border-b border-t border-white p-4 text-white sm:border-l sm:border-r">
                  <div className="h-10 w-10 shrink-0 sm:h-12 sm:w-12">
                    <img
                      src="https://images.pexels.com/photos/18264716/pexels-photo-18264716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Mystical Wanderer"
                      className="h-full w-full rounded-full object-cover" />
                  </div>
                  <div className="pl-4 pt-1 w-full">
                    <div className="mb-2 flex items-center gap-x-2">
                      <div className="w-full">
                        <h2 className="inline-block font-bold">Mystical Wanderer</h2>
                        <span className="ml-2 inline-block text-sm text-gray-400">15 minutes ago</span>
                      </div>
                      <button className="ml-auto shrink-0  text-red-500 hover:text-red-600" onClick={() => handlePostDelete(post._id)}>
                        {/* TODO: Check if user created the post and only then show the delete button */}
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className='h-5 w-5'
                        />
                      </button>
                    </div>
                    <p className="mb-4 text-sm sm:text-base"> {post.content} </p>
                    <div className="flex gap-x-4">
                      <button
                        className={`group inline-flex items-center gap-x-1 outline-none ${post.isLiked ? 'text-red-600': 'text-white hover:text-red-600 '} `} 
                        onClick={() => handlePostLike(post._id)}>
                        <FontAwesomeIcon icon={faHeart} className="h-5 w-5 " />
                      </button>
                      <button className="inline-flex items-center gap-x-1 outline-none hover:text-[#ae7aff]">
                        <FontAwesomeIcon icon={faComment} flip='horizontal' className="h-5 w-5 " />
                        <span>13</span>
                      </button>

                      <div className="ml-auto">
                        <button className="group inline-flex items-center gap-x-1 outline-none hover:text-[#ae7aff] focus:text-[#ae7aff]">
                          <FontAwesomeIcon icon={faBookmark} className="h-5 w-5 " />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}


          </section>
          <aside className="hidden text-white lg:col-span-3 lg:block">
            {/* <div className="sticky top-[100px] border p-4">
              <h2 className="mb-4 font-bold"># Trending Hashtags</h2>
              <ul className="list-disc pl-4">
                <li><button className="hover:text-[#ae7aff]">#javascript</button></li>
                <li><button className="hover:text-[#ae7aff]">#typescript</button></li>
                <li><button className="hover:text-[#ae7aff]">#java</button></li>
                <li><button className="hover:text-[#ae7aff]">#python</button></li>
                <li><button className="hover:text-[#ae7aff]">#golang</button></li>
              </ul>
            </div> */}
             <div className="sticky top-[100px] border p-4">
              <h2 className="mb-4 font-bold"># Trending Hashtags</h2>
              <ul className="list-disc pl-4">
                <li><button className="hover:text-[#ae7aff]">#javascript</button></li>
                <li><button className="hover:text-[#ae7aff]">#typescript</button></li>
                <li><button className="hover:text-[#ae7aff]">#java</button></li>
                <li><button className="hover:text-[#ae7aff]">#python</button></li>
                <li><button className="hover:text-[#ae7aff]">#golang</button></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default Home;

/* 
{showNewPassword ? <NewPassword type="reset-password" /> : (
        <>
          {user ? (
            <div className={styles.container}>
              <h2 className={styles.heading}>Profile</h2>
              <div className={styles.buttons}>
                <button className={styles.button} onClick={handleCancelToggle}> {showCancel ? 'Cancel' : 'Update Profile'} </button>
                <button className={styles.button} onClick={handleResetPassword}>Reset Password</button>
                {
                  showCancel ? (
                    loading ? (
                      <BeatLoader color="#4c8ee6" speedMultiplier={3} size={9} />
                    ) : (
                      <button className={styles.button} onClick={handleProfileUpdate}>Submit</button>
                    )
                  ) : null
                }

              </div>
              <div className={styles.profile}>
                <div className={styles.field}>
                  <label className={styles.label}>First Name:</label>
                  <input type="text" className={styles.input} value={ showCancel ? firstName : user.firstName} onChange={(e) => setFirstName(e.target.value)} readOnly={readOnly} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Last Name:</label>
                  <input type="text" className={styles.input} value={ showCancel ? lastName : user.lastName}  readOnly={readOnly} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email:</label>
                  <input type="email" className={styles.input} value={ showCancel ? email : user.email}  readOnly={readOnly} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
            </div>

          ) : (
            <div className={styles.container}>
              <h1 className={styles.heading}>Welcome to Our Platform!</h1>
              <p className={styles.description}>
                We're excited to have you join us on this journey. Our platform is designed to help you
                achieve your goals and connect with others who share your interests.
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <h2 className={styles.featureHeading}>Discover</h2>
                  <p className={styles.featureDescription}>
                    Register Your Profile, Explore Opportunities, and Find Your Match.
                  </p>
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureHeading}>Connect</h2>
                  <p className={styles.featureDescription}>
                    Connect with like-minded individuals, share your experiences, and build meaningful relationships.
                  </p>
                </div>
                <div className={styles.feature}>
                  <h2 className={styles.featureHeading}>Achieve</h2>
                  <p className={styles.featureDescription}>
                    Set goals, track your progress, and celebrate your achievements with our platform.
                  </p>
                </div>
              </div>
              <button className="p-[3px] relative">
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
    Lit up borders
  </div>
</button>
            </div>
          )}
        </>
      )}

      <button className="inline-flex items-center gap-x-1 outline-none hover:text-[#ae7aff]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="h-5 w-5">
                        <path
                          fillRule="evenodd"
                          d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                          clipRule="evenodd"></path>
                      </svg>
                      <span>13</span>
                    </button>
*/





