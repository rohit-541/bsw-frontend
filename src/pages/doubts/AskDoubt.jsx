import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const AskDoubt = () => {
  const [heading, setHeading] = useState('');
  const [course, setCourse] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null); // For the image file
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timer, setTimer] = useState(3); // Timer for redirection
  const navigate = useNavigate(); // Hook to handle redirection

  // If the user is not logged in, show message and redirect to login
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if (!authData) {
      setErrorMessage('Please login to ask doubt');
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        navigate('/login');
      }, 3000); // Redirect after 3 seconds

      return () => clearInterval(interval); // Clean up interval on component unmount
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the user data from localStorage
    const authData = JSON.parse(localStorage.getItem('authData'));

    if (!authData) {
      setErrorMessage('Please login to ask doubt');
      return;
    }

    const { token, user } = authData;
    const userId = user.id;

    // Create FormData to send the data as multipart/form-data
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('heading', heading);
    formData.append('course', course);
    formData.append('text', text);
    if (image) {
      formData.append('image', image); // Add the image if selected
    }

    // Send POST request to the backend
    try {
      const response = await fetch(`${config.baseURL}/doubts/`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData, // Send the formData instead of JSON
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Doubt Submitted. Redirecting...');
        setErrorMessage('');
        setTimeout(() => {
          navigate('/doubt'); // Redirect after 3 seconds
        }, 3000); // 3 seconds timer before redirect
      } else {
        setErrorMessage(result.message || 'Something went wrong!');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Failed to submit the doubt.');
      setSuccessMessage('');
    }
  };

  // Check if user is logged in or not
  const authData = JSON.parse(localStorage.getItem('authData'));

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Ask a Doubt</h1>

        {/* If the user is not logged in */}
        {!authData ? (
          <>
            <div className="mb-4 text-center">
              <p className="text-lg text-gray-700">Please login to ask a doubt</p>
              <p className="text-md text-gray-500 mt-2">Redirecting in {timer}...</p>
            </div>
          </>
        ) : (
          // If the user is logged in, show the form
          <>
            {/* Error or success message */}
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-md">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 text-green-600 rounded-md">
                {successMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Heading */}
              <div className="mb-4">
                <label htmlFor="heading" className="block text-lg font-semibold text-gray-700 mb-2">
                  Heading
                </label>
                <input
                  type="text"
                  id="heading"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Enter the heading of your doubt"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Course */}
              <div className="mb-4">
                <label htmlFor="course" className="block text-lg font-semibold text-gray-700 mb-2">
                  Course
                </label>
                <input
                  type="text"
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="Enter the course code"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Text */}
              <div className="mb-6">
                <label htmlFor="text" className="block text-lg font-semibold text-gray-700 mb-2">
                  Doubt Description
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Describe your doubt in detail"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Image */}
              <div className="mb-4">
                <label htmlFor="image" className="block text-lg font-semibold text-gray-700 mb-2">
                  Upload Image (Optional)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer hover:scale-105 transition-transform ease-in-out"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200 hover:cursor-pointer hover:scale-105"
              >
                Submit Doubt
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AskDoubt;
