import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Login from 'components/loginComponents/Login';
import SignUp from 'components/loginComponents/SignUp';
import ForgotPassword from 'components/loginComponents/ForgotPassword';
import ResetPassword from 'components/loginComponents/ResetPassword';
import Blank from 'components/loginComponents/Blank';

const LoginContainer = (props) => {

  const { 
    route, setRoute, 
    username, setUsername,
    email,
    message, setMessage,
    error, setError,
    resendEmailLink, setResendEmailLink,
    reEnterEmailForPasswordReset, setReEnterEmailForPasswordReset,
    reEnterEmailForSignup, setReEnterEmailForSignup,
    xOut,
    login,
    setLoginDropdown,
    notification, setNotification
  } = props;

  // RESEND VERIFICATION EMAIL
  function sendVerificationEmail(email, username) {
    const payload = { email, username };
    axios.post('/api/signup/resendVerification', payload)
    .then(res => {
      if (res.data.error) return setError(res.data.error);
      setRoute('/blank');
      setMessage(res.data.message);
      setResendEmailLink(false);
      // setReEnterEmailForPasswordReset(true);
    })
    .catch(err => {
      console.log('err, could not resend verification email', err.response);
    })
  };

  // TAKE USER TO RESET PASSWORD SCREEN
  function loadPasswordReset() {
    setRoute('/forgotPassword');
    setReEnterEmailForPasswordReset(false);
  };

  // TAKE USER TO SIGNUP SCREEN
  function loadSignup() {
    setRoute('/signup');
    setReEnterEmailForSignup(false);
  };

  // =============================== //
  
  return (
    <div id="login-container">

      <button onClick={() => xOut()} className="x-button">X</button>

      { message && <div className="login-message">{message}</div>}

      { (route === '/login') &&
        <Login 
          setRoute={setRoute}
          username={username}
          login={login}
          setMessage={setMessage}
          setError={setError}
          setResendEmailLink={setResendEmailLink}
          setReEnterEmailForPasswordReset={setReEnterEmailForPasswordReset}
        />
      }

      { (route === '/signup') &&
        <SignUp 
          username={username}
          setRoute={setRoute}
          setMessage={setMessage}
          setError={setError}
          setResendEmailLink={setResendEmailLink}
          setReEnterEmailForPasswordReset={setReEnterEmailForPasswordReset}
          setLoginDropdown={setLoginDropdown}
          setNotification={setNotification}
        />
      }

      { (route === '/forgotPassword') &&
        <ForgotPassword 
          setRoute={setRoute}
          setMessage={setMessage}
          setError={setError}
          setReEnterEmailForPasswordReset={setReEnterEmailForPasswordReset}
        />
      }

      { (route === '/resetPassword') &&
        <ResetPassword 
          email={email}
          setRoute={setRoute}
          setMessage={setMessage}
          setError={setError}
          login={login}
        />
      }

      { (route === '/blank') && 
        <Blank />
      }

      { error && <div className="error-message">{error}</div>}
      
      { resendEmailLink && 
        <div className="login-message">
          <button 
            onClick={() => {sendVerificationEmail(resendEmailLink.email, resendEmailLink.username)}} 
            className="click-here-button"
            >Click here 
          </button> to resend email
        </div> }

      { reEnterEmailForPasswordReset && 
        <div className="login-message">
          <button 
            onClick={() => {loadPasswordReset()}} 
            className="click-here-button" 
            >Wrong email?
          </button>
        </div> }

      { reEnterEmailForSignup && 
        <div className="login-message">
          <button 
            onClick={() => {loadSignup()}} 
            className="click-here-button" 
            >Change email
          </button>
        </div> }

    </div>
  );  
};

export default LoginContainer;
