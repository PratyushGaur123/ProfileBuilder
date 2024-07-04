import React, { useEffect, useState } from 'react';
import Otp from '../OTP/Otp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";
import { useUserContext } from '../../Contexts/UserContext';
// import styles from './LoginOptions.module.css';


const LoginOptions = ({ email, mailVerified, setMailVerified }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [loading, setLoading] = useState(false);
  const {handleSignInPassword , password, setPassword } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      alert('Please enter your email');
      navigate('/signin');
      return;
    }
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 4000);
  }, []);

  async function handleOTP() {
    /* 
     1) make request to the backend to send the otp
     2) setShowOptions to false
     3) setShoWOtp to true
    */

    try {
      if (!email) {
        alert('Please enter your email');
        navigate('/signin');
        return;
      }

      if (!mailVerified) {
        alert('please login using password as your mail is not verified');
        navigate('/signin');
        return;
      }

      setLoading(true);

      const response = await axios.post("http://localhost:8000/users/sign-in-otp", {
        email
      });

      if (response.status === 200) {
        alert("OTP has been sent to your registered mail");
        setLoading(false);
        setShowOptions(false);
        setShowOTP(true);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log(' 404 status code says: ', error.response.data.message);
          alert(error.response.data.message);
          navigate('/signup');
        }
        else if (error.response.status === 400) {
          alert(error.response.data.message);
          navigate('/signin');
        }
        else if (error.response.status === 403) {
          setMailVerified(false);
          alert('please login using password as your mail is not verified');
          navigate('/signin'); // please login using pass as your mail is not verified
        }
        else {
          alert(error.response.data.message);
        }
      }
      else {
        alert("Network error. Please check your internet connection.");
      }
      setLoading(false);
    }

  }

  function handlePassword(e) {
    setShowOptions(false);
    setShowPassword(true);
  }

  return (

    <>
      {loading ? (
        <>
          <h5>Please wait while we are sending the otp...</h5>
          <BeatLoader color="#4c8ee6" speedMultiplier={2} size={10} />
        </>
      ) : (
        <>
          {showOptions ? (
            <>
              <button className="w-full bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
                onClick={handleOTP}>Login With OTP</button>
              <button className="w-full bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
                onClick={handlePassword}>Login With Password</button>
            </>
          ) : null}

          {showPassword ? (

            <div className="mx-auto flex w-full items-stretch justify-between gap-10">
              <form onSubmit={handleSignInPassword}>
                <div className="flex w-full flex-col items-start justify-start gap-2">
                  <label htmlFor="password" className="text-xs text-slate-200">Password:</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter Your Password..."
                    autoComplete="false"
                    required
                    className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                  <button type="submit" className="w-full bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">Sign In</button>
                </div>
              </form>
            </div>
            

          ) : null}

          {showOTP ? <Otp type='sign-in' /> : null}
        </>
      )}
    </>

  );
}

export default LoginOptions;
/*
<button onClick={handleOTP} className={styles.optionButton}>Login with OTP</button>
            <button onClick={handlePassword} className={styles.optionButton}>Login with Password</button>
*/