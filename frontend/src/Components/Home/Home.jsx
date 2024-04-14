import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { useUserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";
import NewPassword from '../NewPassword/NewPassword';
import axios from 'axios';

const Home = () => {

  const { user, firstName, setFirstName, lastName, setLastName, email, setEmail, setUser} = useUserContext();
  const navigate = useNavigate();
  const [readOnly, setReadOnly] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  // console.log(user);

  function handleResetPassword() {
    setShowNewPassword(true);
  }

  function handleCancelToggle() {
    setShowCancel((prev) => !prev);
    setReadOnly((prev) => !prev);
    setFirstName((prev) => prev === '' ? user.firstName : '');
    setLastName((prev) => prev === '' ? user.lastName : '');
    setEmail((prev) => prev === '' ? user.email : '');
  }

  async function handleProfileUpdate() {
    console.log(user.firstName, firstName, user.lastName, lastName, user.email, email);
    
    if (user.firstName === firstName && user.lastName === lastName && user.email === email) {
      alert("No changes made");
      return;
    }
    if (firstName.length < 2 || firstName.length > 20 || lastName.length < 2 || lastName.length > 20) {
      alert("First name and last name must be between 2 and 20 characters");
      return;
    }
    if (email.length < 5 || email.length > 40) {
      alert("Email must be between 5 and 40 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put('http://localhost:8000/users/update-profile', {
        firstName,
        lastName,
        email,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        alert("Profile updated successfully");
        setLoading(false);
        const {user} = response.data.data;
        console.log(user);
        // setFirstName(user.firstName);
        // setLastName(user.lastName);
        // setEmail(user.email);
        setFirstName('');
        setLastName('');
        setEmail('');
        setUser(user);
        setShowCancel(false);
        setReadOnly(true);
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
        else if (error.response.status === 500) {
          alert('Something went wrong while updating your Profile');
        }
      }
      else {
        alert("Network error. Please check your internet connection.");
      }
      setLoading(false);
    }
  }


  return (

    /* {loading ? <BeatLoader color="#4c8ee6" speedMultiplier={3} size={13} />  */

    <>
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
            </div>
          )}
        </>
      )}
    </>


  );
}

export default Home;





