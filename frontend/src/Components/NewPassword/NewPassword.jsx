import React, { useEffect, useState } from 'react';
import styles from './NewPassword.module.css'; 
import { useUserContext } from '../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";
import axios from 'axios';

const NewPassword = ({type}) => {

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { email, setEmail } = useUserContext();
  const navigate = useNavigate();

  async function handlePasswordChange(e) {
    e.preventDefault();
    if(!newPassword || !confirmNewPassword ){
      alert("Please fill all the fields");
      return;
    }
    if( newPassword !== confirmNewPassword){
      alert("Password and Confirm Password doesn't match");
      return;
    }
    if(newPassword.length < 8 || newPassword.length > 20 || confirmNewPassword.length < 8 || confirmNewPassword.length > 20){
      alert("Password must be between 8 and 20 characters");
      return;
    }

    if(type ==='forgot-password') {
      if(!email){
        alert("Something went wrong. Please try again later");
        navigate('/signin');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.put('http://localhost:8000/users/update-forgot-password', {
          newPassword,
          email,
          confirmNewPassword
        });

        if(response.status === 200){
          alert("Password changed successfully");
          setLoading(false);
          setNewPassword('');
          setEmail('');
          setConfirmNewPassword('');
          navigate('/signin');
          return;
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            // alert('Email does not exist');
            alert(error.response.data.message);
            navigate('/signup')
          }
          else if (error.response.status === 400) {
            alert(error.response.data.message);
          }
          else{
            alert(error.response.data.message); 
          }
        }
        else{
          alert("Network error. Please check your internet connection.");
        }
        setLoading(false)
      }
    }
    else if( type === 'reset-password'){
      if(!currentPassword ){
        alert("Please enter current password");
        return;
      }
      if( currentPassword.length < 8 || currentPassword.length > 20){
        alert("Password must be between 8 and 20 characters");
        return;
      }
      setLoading(true);

      try {
        const response = await axios.put('http://localhost:8000/users/reset-password', {
          newPassword,
          currentPassword,
          confirmNewPassword
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if(response.status === 200){
          alert("Password changed successfully");
          setLoading(false);
          setNewPassword('');
          setConfirmNewPassword('');
          setCurrentPassword('');
          navigate('/');
          return;
        }
      } catch (error) {
        if(error.response){
          if(error.response.status === 400){
            alert(error.response.data.message);
          }
          else if(error.response.status === 401){
            alert(error.response.data.message);
            navigate('/signin');
          }
          else if(error.response.status === 404){
            alert(error.response.data.message);
            navigate('/signup');
          }
          else{
            alert(error.response.data.message);
          }
        }
        else{
          alert("Network error. Please check your internet connection.");
        }
        setLoading(false);
      }

    }
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Change Password</h2>
      <form className={styles.form} onSubmit={handlePasswordChange}>
       {type !=='forgot-password' ? (
         <div className={styles.field}>
         <label htmlFor="currentPassword" className={styles.label}  >Current Password:</label>
         <input
           type="password"
           id="currentPassword"
           className={styles.input}
           required
           value={currentPassword} 
           onChange={(e)=> setCurrentPassword(e.target.value)}
           placeholder='Enter your current password'
         />
       </div>
       ): null}
        <div className={styles.field}>
          <label htmlFor="newPassword" className={styles.label}  >New Password:</label>
          <input
            type="password"
            id="newPassword"
            className={styles.input}
            required
            value={newPassword} 
            onChange={(e)=> setNewPassword(e.target.value)}
            placeholder='Enter your new password'
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="confirmNewPassword" className={styles.label}  >Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            className={styles.input}
            required
            value={confirmNewPassword} 
            onChange={(e)=> setConfirmNewPassword(e.target.value)}
            placeholder='Confirm your new password'
          />
        </div>
        {loading ? <BeatLoader color="#4c8ee6" speedMultiplier={3} size={13} /> : <button type="submit" className={styles.button}>Submit</button>}
      </form>
    </div>
  );
}

export default NewPassword;
