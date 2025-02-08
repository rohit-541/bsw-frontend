import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Updated import
import Navbar from '../components/navbar';
import config from '../config';
const UpdatePassword = () => {
  const [kerberosId, setKerberosId] = useState('');
  const [role, setRole] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes timer
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const navigate = useNavigate();  // Updated hook

  useEffect(() => {
    if (otpTimer > 0 && isOtpSent) {
      const timer = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpTimer, isOtpSent]);

  const handleKerberosChange = (e) => setKerberosId(e.target.value);

  const handleRoleChange = (e) => setRole(e.target.value);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if this one is filled
      if (index < 3 && value !== '') {
        document.getElementById(`otp-box-${index + 1}`).focus();
      }

      // Move to the previous input if this one is emptied
      if (index > 0 && value === '') {
        document.getElementById(`otp-box-${index - 1}`).focus();
      }
    }
  };

  const startOtpProcess = () => {
    if (!kerberosId) {
      alert('Please enter your Kerberos ID');
      return;
    }
    const endpointForOtpGeneration =
      role === 'student'
        ? `${config.baseURL}/user/verifyEmail`
        : `${config.baseURL}/mentor/forgotPassword`;

    localStorage.clear()
    fetch(endpointForOtpGeneration, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kerbros: kerberosId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsOtpSent(true);
          setOtpTimer(300); // Reset the timer
        } else {
          alert('Failed to send OTP. Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
        alert('An error occurred. Please try again.');
      });
  };

  const verifyOtp = () => {
    const otpValue = otp.join('');
    if (!kerberosId || otpValue.length !== 4) {
      alert('Please enter a valid Kerberos ID and OTP');
      return;
    }
    const endpointForOTPVerification =
      role === 'student'
        ? `${config.baseURL}/user/verifyOTP`
        : `${config.baseURL}/mentor/verifyOTP`;

    fetch(endpointForOTPVerification, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kerbros: kerberosId, otp: Number(otpValue) }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "OTP verified successfully") {
          localStorage.setItem('authToken', data.token);
          setOtpToken(data.token);
          alert('OTP verified successfully!');
        } else {
          alert('Invalid OTP. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error);
        alert('An error occurred. Please try again.');
      });
  };

  const resendOtp = () => {
    const endpointForOtpGeneration =
      role === 'student'
        ? `${config.baseURL}/user/verifyEmail`
        : `${config.baseURL}/mentor/forgotPassword`;

    fetch(endpointForOtpGeneration, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kerbros: kerberosId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsOtpSent(true);
          setOtpTimer(300); // Reset the timer
          alert('OTP resent successfully');
        } else {
          alert('Failed to resend OTP. Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Error resending OTP:', error);
        alert('An error occurred. Please try again.');
      });
  };

  const handlePasswordChange = (password, confirmPassword) => {
    if (!password || password !== confirmPassword) {
      alert('Passwords do not match or are empty');
      return;
    }

    const endpoint =
      role === 'student'
        ? `${config.baseURL}/user/setNew`
        : `${config.baseURL}/mentor/setNew`;

    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('No authentication token found. Please try again.');
      return;
    }

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Password changed successfully!');
          localStorage.clear();
          navigate('/login');  // Updated to use `navigate` instead of `history.push`
        } else {
          alert('Failed to change password. Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Error changing password:', error);
        alert('An error occurred. Please try again.');
      });
  };

  return (<>
    <Navbar />
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className="update-password bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className='text-3xl font-semibold text-center text-gray-700 mb-6'>Change Your Password</h1>
        <div className='mb-4'>
          <label className='block text-gray-600'>Kerberos ID:</label>
          <input
            type="text"
            className='w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={kerberosId}
            onChange={handleKerberosChange}
            placeholder="Enter Kerberos ID"
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-600'>Role:</label>
          <select className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={handleRoleChange} value={role}>
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>

        {!isOtpSent ? (
          <button className="w-full hover:cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none" onClick={startOtpProcess}>Send OTP</button>
        ) : (
          <div>
            <div className="flex justify-between mt-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-box-${index}`}
                  type="text"
                  value={digit}
                  maxLength="1"
                  onChange={(e) => handleOtpChange(e, index)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>
            <div className='mt-2 text-center text-gray-500'>
              {otpTimer > 0 ? (
                <span>Time remaining: {Math.floor(otpTimer / 60)}:{otpTimer % 60}</span>
              ) : (
                <span>Time is up! </span>
              )}
            </div>
            <button className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 hover:cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none" onClick={verifyOtp}>Submit OTP</button>
            {otpTimer === 0 && <button className="w-full hover:cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out py-2 mt-4 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 focus:outline-none" onClick={resendOtp}>Resend OTP</button>}
          </div>
        )}

        {otpToken && (
          <div className='mt-6'>
            <div className='mb-4'>
              <label className='block text-gray-600'>New Password:</label>
              <input type="password" id="password" className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-600'>Confirm Password:</label>
              <input type="password" id="confirm-password" className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <button className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none hover:cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out" onClick={() => handlePasswordChange(document.getElementById('password').value, document.getElementById('confirm-password').value)}>
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  </>
  );
};

export default UpdatePassword;
