import React, {useState} from 'react';
import styles from './ForgotPassword.module.css'; 
import { useUserContext } from '../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";
import Otp from '../OTP/Otp';


const ForgotPassword = () => {
    const {email, setEmail} = useUserContext();
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const navigate = useNavigate();
  
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if(!email) {
            alert("Please enter a valid Email Address");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8000/users/forgot-password-otp", {
                email
            });

            if(response.status === 200){
                setLoading(false);
                setShowOTP(true);
                alert("OTP has been sent to your registered mail");
                return;
            }
            else if(response.status === 202){
                alert('Your email is not verified. Please verify your email using the link sent to your mail');
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    alert('Email does not exist');
                    navigate('/signup')
                }
                else if (error.response.status === 400) {
                    alert(error.response.data.message);
                }
            }
            else {
                alert("Network error. Please check your internet connection.");
            }
            setEmail('');
            setLoading(false);
        }
    }

  return (
    showOTP ? <Otp type='forgot-password' /> : (
        <div className={styles.container}>
      <h2 className={styles.heading}>Forgot Your Password?</h2>
      <form className={styles.form} onSubmit={handleForgotPassword}>
        <label htmlFor="email" className={styles.label}>
          Enter the email address associated with your account:
        </label>
        <input type="email" id="email" className={styles.input} required placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} />
       {loading ? <BeatLoader color="#4c8ee6" speedMultiplier={3} size={13} /> :  <button type="submit" className={styles.button}>Submit</button>}
      </form>
    </div>
    ) 
  );
}

export default ForgotPassword;
