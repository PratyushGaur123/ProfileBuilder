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
import { useUserContext } from '../../UserContext';
import axios from 'axios';
const drawerWidth = 240;


function Navbar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, setUser, setEmail, setPassword } = useUserContext();
  const [navItems, setNavItems] = useState([]);
  const navigate = useNavigate();

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

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };


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





  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar component="nav" sx={{ position: 'static' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={Link}
              to={'/'}
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, color: 'white', textDecoration: 'none' }}
            >
              PROFILE BUILDER
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>

              {user ? navItems.map((item, index) => (
                <Button key={index} onClick={item.method} sx={{ color: '#fff' }}>
                  {item.name}
                </Button>
              )) : navItems.map((item, index) => (
                <Button component={Link} key={index} to={item.link} sx={{ color: '#fff' }}>
                  {item.name}
                </Button>
              ))}

            </Box>
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>

      <Outlet />
    </>
  );
}



export default Navbar;
