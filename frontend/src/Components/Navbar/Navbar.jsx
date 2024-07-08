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
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
// import { FaFacebookMessenger } from "react-icons/ci";
import { FaFacebookMessenger } from "react-icons/fa";
import { useUserContext } from '../../Contexts/UserContext';
import axios from 'axios';
const drawerWidth = 240;


function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const {user, setUser, setEmail, setPassword } = useUserContext();
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
              <span className='relative'>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="h-7 w-7" />
              </span>
              <span className='relative cursor-pointer' >
                <Link to='inbox'>
                  <FaFacebookMessenger className="h-7 w-7" />
                </Link>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1 text-sm text-white md:h-5 md:w-5 md:text-base">4</span>
              </span>
              <span className="relative">
                <FontAwesomeIcon icon={faBell} className="h-7 w-7" />
                <span className="absolute right-1 top-0 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-500 p-1 text-white"></span>
              </span>
              {/* <div className="h-11 w-11 rounded-full border-2 border-white">

            <img
              src="https://images.pexels.com/photos/18148932/pexels-photo-18148932/free-photo-of-bench-city-man-people.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="avatar"
              className="h-10 w-10 rounded-full object-cover" />
          </div> */}


            </div>
          </header>
        )}




      <Outlet />
    </>
  );
}



export default Navbar;
