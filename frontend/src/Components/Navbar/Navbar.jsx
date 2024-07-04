import { Link, Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import the specific icon you want to use
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '../../Contexts/UserContext';
import axios from 'axios';
const drawerWidth = 240;


function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setUser, setEmail, setPassword } = useUserContext();
  const user = false;
  const [navItems, setNavItems] = useState([]);
  const navigate = useNavigate();
  const type = 'Chat'


  useEffect(() => {
    if (user) {
      const nav = [{ name: 'Sign Out', method: handleSignOut }];
      if (!user.verified) {
        nav.push({ name: 'Verify Email', method: handleVerifyEmail });
        // console.log('this is nav')
        // console.log(nav, user);
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
          handleSignOut();
        }
        else if (error.response.status === 400) {
          alert('Invalid credentials');
          handleSignOut();
        }
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
              <h1 className='text-2xl'>Chatinger</h1>
            </header>
: (
  <header className="fixed top-0 z-10 mx-auto flex w-full max-w-full items-center justify-between border-b-[1px] border-b-slate-300 bg-[#121212] p-4 text-white lg:px-10">
        <h1 className="text-xl font-extrabold md:text-3xl">CHATINGER</h1>
        <div className="flex w-max flex-shrink-0 items-center justify-end gap-6">
          <span className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-8 w-8">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
            </svg>
          </span>
          <span className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-6 w-6 text-white md:h-8 md:w-8">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
            </svg>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1 text-sm text-white md:h-5 md:w-5 md:text-base">4</span>
          </span>
          <div className="h-11 w-11 rounded-full border-2 border-white">

            <img
              src="https://images.pexels.com/photos/18148932/pexels-photo-18148932/free-photo-of-bench-city-man-people.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="avatar"
              className="h-10 w-10 rounded-full object-cover" />
          </div>

          <span className='relative'>
            <FontAwesomeIcon icon={faMessage} style={{ color: "#ffffff", height: '3vh' }} />
          </span>

        </div>
      </header>
)}
     

      

      <Outlet />
    </>
  );
}



export default Navbar;
