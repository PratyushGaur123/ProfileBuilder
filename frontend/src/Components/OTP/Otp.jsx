import React, { useEffect, useState } from 'react';
import styles from './Otp.module.css';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../UserContext';
import axios from 'axios';
import NewPassword from '../NewPassword/NewPassword';

const Otp = ({ type }) => {

  const [otp, setOTP] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false)
  const { email,  setUser } = useUserContext();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!email || (type !== 'forgot-password' && type !== 'sign-in')) {
        console.log(email);
        console.log(type);
      alert('Something went wrong. Please try again later');
      navigate('/signin');
      return;
    }
  }, []);


  const handleOTPVerification = async (e, type)=> {
    e.preventDefault();

    console.log(type);

    if( !type){
        alert('abe type to de')
    }

    if (!otp || otp.length !== 6) {
        alert('Please enter a valid OTP');
        return;
    }

    if (type === 'forgot-password') {
        try {
            const response = await axios.post('http://localhost:8000/users/forgot-password-otp-verify', {
                otp,
                email
            });

            if (response.status === 200) {
                alert('OTP verified successfully');
                setShowNewPassword(true);
                return;
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    alert('Email does not exist');
                    navigate('/signup')
                }
                else if (error.response.status === 400) {
                    alert('Invalid credentials');
                    navigate('/signin');
                }
                else if (error.response.status === 410) {
                    alert('OTP expired');
                    navigate('/signin');
                }
                else if (error.response.status === 401) {
                    alert('Invalid OTP');
                    navigate('/signin');
                } else {
                    alert('Something went wrong. Please try again later');
                    navigate('/signin');
                }
            }
            else {
                alert("Network error. Please check your internet connection.");
            }
        }
    }

    else if (type === 'sign-in') {
        // make a request to the backend to validate the otp entered by the user.
        try {
            const response = await axios.post('http://localhost:8000/users/sign-in-otp-verify', {
                otp,
                email
            });

            if (response.status === 200) {
                alert('OTP verified successfully');
                setUser(response.data.data.user);
                localStorage.setItem("token", response.data.data.token);
                navigate('/');
                return;
            }
        } catch (error) {

            if (error.response) {
                if (error.response.status === 404) {
                    alert('Email does not exist');
                    navigate('/signup')
                }
                else if (error.response.status === 400) {
                    alert('Invalid credentials');
                    navigate('/signin');
                }
                else if (error.response.status === 410) {
                    alert('OTP expired');
                    navigate('/signin');
                }
                else if (error.response.status === 401) {
                    alert('Invalid OTP');
                    navigate('/signin');
                } else {
                    alert('Something went wrong. Please try again later');
                    navigate('/signin');
                }
            }
            else {
                alert("Network error. Please check your internet connection.");
            }
        }
    }
}

  
  return (
    showNewPassword ? <NewPassword type='forgot-password' /> : (
      <div className={styles.container}>
        <p>OTP has been sent to your registered email: {email}</p>

        <form onSubmit={(e)=>handleOTPVerification(e, type)} className={styles.form}>
          <label htmlFor="otp" className={styles.label}>Enter the OTP:</label>
          <input
            type="number"
            min={100000} // Set the minimum value to 6 digits
            max={999999} // Set the maximum value to 6 digits
            name="otp"
            id="otp"
            required
            className={styles.input}
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />

          <button type="submit" className={styles.button}>Verify</button>
        </form>
      </div>
    )
  )
}

export default Otp;
