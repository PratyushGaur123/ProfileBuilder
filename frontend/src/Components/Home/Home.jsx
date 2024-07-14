import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { useUserContext } from '../../Contexts/UserContext';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";
import MoonLoader from "react-spinners/MoonLoader";
import NewPassword from '../NewPassword/NewPassword';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import maleprofile from "../../static/maleprofile.jpg";
import femaleprofile from "../../static/femaleprofile.jpg";
import useRandomUsers from '../../Hooks/useRandomUsers';

const notifications = [
  { id: 1, message: 'John Doe liked your post' },
  { id: 2, message: 'Jane Smith commented on your photo' },
  { id: 3, message: 'You have a new follower' },
  // Add more notifications as needed
];

const Home = () => {

  const { user } = useUserContext();
  const navigate = useNavigate();
  // const [readOnly, setReadOnly] = useState(true);
  // const [showNewPassword, setShowNewPassword] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [showCancel, setShowCancel] = useState(false);
  const { randomUsers } = useRandomUsers();



  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

  }, [user]);

  if (!user) {
    return <MoonLoader color="#ffffff" speedMultiplier={2} />
  }


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

  

  return (
    <>

      <div className="min-h-screen bg-[#121212]">
        <div className="mt-[65px] grid grid-cols-12 gap-4 pb-8 pt-0 sm:px-4 sm:pt-8 md:mt-[83px] lg:px-10"> 
          <aside className="hidden text-white md:col-span-4 md:block lg:col-span-3">
            <div className="sticky top-[100px] border p-4">
              <img
                className="mb-3 flex aspect-square h-16 w-16 flex-shrink-0 rounded-full object-cover"
                src={user.gender === 'Male' ? maleprofile : femaleprofile}
                alt="avatar" />
              <h2>{user.firstName + ' ' + user.lastName}</h2>
              <p className="text-sm"><button className="hover:text-[#ae7aff]"> {user.email} </button></p>
              <hr className="my-2 h-[1px] w-full" />
              <p className="mb-4">Night owl | Moon enthusiast | Wanderlust 🌕🌙🌎</p>
              <button
                className="inline-flex w-max items-center bg-[#f8f7fa] px-4 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">
                View Profile
              </button>
            </div>
          </aside>

          <Outlet/> 
         
          <aside className="hidden text-white lg:col-span-3 lg:block">
            <div className="sticky top-[100px] border p-4">
              <h2 className="mb-4 font-bold">People You May Know!</h2>
              {randomUsers.map((randomUser, index) => (
                <>
                  <div className="flex items-center space-x-4" key={index}>
                    <img
                      className="aspect-square h-16 w-16 flex-shrink-0 rounded-full object-cover"
                      src={randomUser.gender === 'Male' ? maleprofile : femaleprofile}
                      alt="avatar"
                    />
                    <h2 className="flex-grow">{randomUser.firstName + ' ' + randomUser.lastName}  </h2>
                    <button
                      className="inline-flex w-max items-center bg-[#f8f7fa] px-4 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">
                      <FontAwesomeIcon icon={faUserPlus} style={{ color: "#000000", }} />
                      {/* <FontAwesomeIcon icon={faUserMinus} style={{ color: "#e01b24", }} /> */}
                    </button>
                  </div>
                  <hr className="my-2 h-[1px] w-full" />
                </>
              ))}
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
                  <input type="text" className={styles.input} value={ showCancel ? firstName : user.firstName} onChange={(e) => setFirstName(e.target.value)} 
                  readOnly={readOnly} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Last Name:</label>
                  <input type="text" className={styles.input} value={ showCancel ? lastName : user.lastName}  readOnly={readOnly} 
                  onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email:</label>
                  <input type="email" className={styles.input} value={ showCancel ? email : user.email}  readOnly={readOnly} 
                  onChange={(e) => setEmail(e.target.value)} />
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





