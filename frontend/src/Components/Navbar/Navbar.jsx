import { Link, Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import maleprofile from "../../static/maleprofile.jpg";
import femaleprofile from "../../static/femaleprofile.jpg";
import { FaFacebookMessenger } from "react-icons/fa";
import { useUserContext } from '../../Contexts/UserContext';
import axios from 'axios';


const notifications = [
  { id: 1, message: 'John Doe liked your post' },
  { id: 2, message: 'Jane Smith commented on your photo' },
  { id: 3, message: 'You have a new follower' },
  { id: 4, message: 'Anna Johnson shared your post' },
  { id: 5, message: 'Michael Brown sent you a message' },
  { id: 6, message: 'Emily Davis mentioned you in a comment' },
  { id: 7, message: 'You have a new friend request' },
  { id: 8, message: 'Sarah Wilson tagged you in a post' },
  { id: 9, message: 'David Harris liked your comment' },
  { id: 10, message: 'New event invitation from John' },
];

const friendRequests = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, setUser, setEmail, setPassword } = useUserContext();
  const [navItems, setNavItems] = useState([]);
  const navigate = useNavigate();
  const type = 'Chat';
  const [isOpenNotificaitions, setIsOpenNotifications] = useState(false);
  const [isOpenFriendRequests, setIsOpenFriendRequests] = useState(false);


  const toggleDropdown = (type) => {
    if(type === 'noty'){
      if(isOpenFriendRequests){
        setIsOpenFriendRequests(false);
      }
      setIsOpenNotifications((prev)=> !prev);
    }
    else if(type === 'friend'){
      if(isOpenNotificaitions){
        setIsOpenNotifications(false);
      }
      setIsOpenFriendRequests((prev)=>!prev)
    }
  };


  useEffect(() => {
    if (user) {
      const nav = [{ name: 'Sign Out', method: handleSignOut }];
      if (!user.verified) {
        nav.push({ name: 'Verify Email', method: handleVerifyEmail });
      }
      setNavItems(nav);
    } else {
      setNavItems([
        { name: 'Sign Up', link: '/signup' },
        { name: 'Sign In', link: '/signin' },
      ]);
    }
  }, [user]);




  const handleVerifyEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleSignOut();
      }
      const response = await axios.get('http://localhost:8000/users/send-link', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        alert('Email sent successfully');
        setNavItems([
          { name: 'Sign Out', method: handleSignOut }
        ]);
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          alert('Email does not exist');
        }
        else if (error.response.status === 400) {
          alert('Invalid credentials');
        }
        handleSignOut();
      }
      else {
        alert("Network error. Please check your internet connection.");
      }

    }

  }

  const handleSignOut = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    localStorage.removeItem('token')
    navigate('/');
  }






  return (
    <>
      {!user ? <header className="fixed top-0 z-10 mx-auto w-full max-w-full bg-[#121212] p-6 text-white lg:px-10">
        <Link to='/' className='cursor-pointer'>
          <h1 className='text-2xl'>CHATINGER</h1>
        </Link>
      </header>
        : (
          <header className="fixed top-0 z-10 mx-auto flex w-full max-w-full items-center justify-between border-b-[1px] border-b-slate-300 bg-[#121212] p-4 text-white lg:px-10">
            <Link to='/' className='cursor-pointer'>
              <h1 className="text-xl font-extrabold md:text-3xl">CHATINGER</h1>
            </Link>

            <div className="flex w-max flex-shrink-0 items-center justify-end gap-6 h-12">
              {/* <CiSearch className='h-14 w-10' /> */}
              {/* <span className='relative'>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="h-7 w-7" />
              </span> */}
              <span className='relative cursor-pointer' >
                <Link to='inbox'>
                  <FaFacebookMessenger className="h-7 w-7" />
                </Link>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1 text-sm text-white md:h-5 md:w-5 md:text-base">4</span>
              </span>

              <span className="relative">
                <button onClick={()=>toggleDropdown('noty')} className="relative focus:outline-none">
                  <FontAwesomeIcon icon={faBell} className="text-3xl" />
                  {notifications.length > 0 && (
                    <span className="absolute right-1 top-0 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-500 p-1 text-white"></span>
                  )}
                </button>

                {isOpenNotificaitions && (
                  <div className="absolute right-0 mt-2 w-64 bg-black border border-gray-700 rounded-lg shadow-lg">
                    <div className="p-4 font-bold border-b border-gray-700 text-xl text-white">Notifications</div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-600 hover:bg-gray-800 text-white">
                          {notification.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </span>

              <span className='relative cursor-pointer'>
                <button onClick={()=>toggleDropdown('friend')} className="relative focus:outline-none">
                  <FontAwesomeIcon icon={faUserGroup} style={{ color: "#ffffff", }} className='text-2xl' />
                  {friendRequests.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1 text-sm text-white md:h-5 md:w-5 md:text-base">4</span>
                  )}
                </button>

                {isOpenFriendRequests && (
                  <div className="absolute right-0 mt-2 w-64 bg-black border border-gray-700 rounded-lg shadow-lg">
                    <div className="p-4 font-bold border-t border-gray-700 text-xl text-white">Friend Requests</div>
                    <div className="max-h-64 overflow-y-auto">
                      {friendRequests.map((request) => (
                        <div key={request.id} className="p-4 border-b border-gray-600 hover:bg-gray-800 text-white flex justify-between items-center">
                          <div>{request.name}</div>
                          <div className="flex space-x-2">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">Accept</button>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Decline</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </span>


              <div className="h-11 w-11 rounded-full border-2 border-white">
                <img
                  src={user.gender === 'Male' ? maleprofile : femaleprofile}
                  alt="avatar"
                  className="h-10 w-10 rounded-full object-cover" />
              </div>


            </div>
          </header>
        )}




      <Outlet />
    </>
  );
}



export default Navbar;
