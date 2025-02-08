import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import config from '../config';
const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']); // Array to store each OTP digit
  const [kerbrosId, setKerbrosId] = useState(localStorage.getItem('kerbrosId') || ''); // Retrieve the Kerberos ID from localStorage
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [timer, setTimer] = useState(300); // 5 minutes timer
  const [isResendAvailable, setIsResendAvailable] = useState(false); // Track if the timer has finished
  const [isOtpIncorrect, setIsOtpIncorrect] = useState(false); // State to handle incorrect OTP
  const navigate = useNavigate(); // Hook for redirection
  const baseurl = `${config.baseURL2}`;

  useEffect(() => {
    let intervalId;

    // Start countdown timer
    if (timer > 0 && !isResendAvailable) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendAvailable(true); // Allow resend after timer reaches 0
    }

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [timer, isResendAvailable]);

  // Handle OTP input change for each box
  const handleOtpChange = (event, index) => {
    const value = event.target.value;
    
    if (/[^0-9]/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value;

    // If the current box is filled, focus the next one automatically
    if (value !== '' && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setOtp(newOtp);
  };

  // Handle focus for previous box when backspace is pressed
  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  // Submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    const otpValue = Number(otp.join(''));

    if (!otpValue || !kerbrosId) {
      setErrorMessage('Kerberos ID and OTP are required');
      return;
    }

    const data = {
      kerbros: kerbrosId,
      otp: otpValue,
    };

    try {
      const response = await fetch(`${baseurl}/user/verifyOTP`, {
        method: 'POST',
        // credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Handle successful response
        const responseData = await response.json();
        console.log(responseData)
        navigate('/register'); // Redirect to a success page after verification
        
        localStorage.setItem('token', responseData.token);
      } else {
        // Handle error response - Incorrect OTP
        const errorData = await response.json();
        setErrorMessage(`Error: ${errorData.message}`);
        
        // Trigger red border effect for incorrect OTP
        setIsOtpIncorrect(true);

        // Clear OTP fields and reset after 1 second
        setOtp(['', '', '', '']);  // Clear the OTP input fields
        setTimeout(() => {
          setIsOtpIncorrect(false); // Reset border color after 1 second
        }, 1000);
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setErrorMessage('There was an error verifying OTP. Please try again.');
    }
  };

  // Resend OTP or navigate to signup if the time is up
  const handleResendClick = () => {
    if (isResendAvailable) {
      // Navigate to signup page when time is up
      navigate('/signup');
    } else {
      // If time is not up, it will do nothing here (or you can trigger resend OTP API)
      console.log('Resend OTP request is not available yet.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-2xl font-semibold mb-4">OTP Verification</h2>
      <form onSubmit={handleSubmit}>
        {/* OTP Input with 4 separate boxes */}
        <div className="flex justify-center mb-4 space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              id={`otp-${index}`}
              value={digit}
              onChange={(event) => handleOtpChange(event, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              maxLength="1"
              className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6358DC] focus:border-[#6358DC] ${isOtpIncorrect ? 'border-red-500' : 'border-gray-300'}`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        {/* Only show Submit OTP button if timer is not expired */}
        {!isResendAvailable && (
          <button
            type="submit"
            className="w-full py-3 bg-[#6358DC] text-white rounded-lg hover:cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out focus:outline-none"
          >
            Submit OTP
          </button>
        )}

        {/* Display time remaining below the button, aligned to the right */}
        <div className="mt-4 text-sm text-gray-600 text-right">
          {isResendAvailable ? 'Time is up!' : `Time remaining: ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`}
        </div>
      </form>

      {/* Resend OTP button when timer expires */}
      {isResendAvailable && (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleResendClick}
            className="w-full py-3 bg-gray-500 text-white rounded-lg hover:cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out focus:outline-none"
          >
            Resend OTP
          </button>
        </div>
      )}
    </div>
  );
};

export default OtpVerification;
