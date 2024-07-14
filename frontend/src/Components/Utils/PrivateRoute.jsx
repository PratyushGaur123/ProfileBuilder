import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../Contexts/UserContext';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';

const PrivateRoute = () => {
  const [allow, setAllow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/signin');
      return;
    }

    async function authCheck() {
      try {
        const res = await axios.get('http://localhost:8000/users/auth-check', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.data.isValid) {
          setAllow(true);
        }
      } catch (error) {
        setAllow(false);
        navigate('/signin');
      }
    }
    authCheck();
  }, [navigate])

  return allow ? <Outlet /> : null;
}

export default PrivateRoute
