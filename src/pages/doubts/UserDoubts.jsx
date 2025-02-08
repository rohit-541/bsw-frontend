import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import config from '../../config';

const UserDoubts = () => {
  const [doubts, setDoubts] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null); // State to track which dropdown is expanded
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(3); // Timer state for the redirect countdown
  const navigate = useNavigate();

  useEffect(() => {
    // Get authData from localStorage
    const authData = JSON.parse(localStorage.getItem('authData'));
    
    if (!authData || !authData.token) {
      // If no authData or token, start the timer to redirect to login
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval); // Stop the timer once it reaches 0
            navigate('/login'); // Redirect to login
          }
          return prev - 1;
        });
      }, 1000);

      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    }

    const token = authData.token;

    // Make API request to fetch doubts
    fetch(`${config.baseURL}/doubts/me/`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDoubts(data.doubts);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch doubts. Please try again later.');
        setLoading(false);
      });
  }, [navigate]);

  // Handle toggling of dropdown sections
  const toggleSection = (status) => {
    setExpandedSection(expandedSection === status ? null : status); // Toggle expansion
  };

  // Handle clicking a doubt to redirect to its detail page and store it in localStorage
  const handleDoubtClick = (id, doubtData) => {
    // Store the complete doubt info in localStorage
    localStorage.setItem('selectedDoubt', JSON.stringify(doubtData));

    // Redirect to the doubt detail page
    navigate(`/doubt/${id}`);
  };

  if (loading) return( <div className="text-center text-lg"><div className="flex flex-col bg-white h-[50vh] text-center justify-center items-center">
  <div className="text-lg text-gray-700">Please login to ask a doubt</div>
  <div className="text-md text-gray-500 mt-2">Redirecting in {timer}...</div>
</div></div>);

  // Filter doubts based on status
  const pendingDoubts = doubts.filter((doubt) => doubt.status === 'Pending');
  const answeredDoubts = doubts.filter((doubt) => doubt.status === 'Answered');
  const resolvedDoubts = doubts.filter((doubt) => doubt.status === 'Resolved');

  const authData = JSON.parse(localStorage.getItem('authData'));

  return (
    <div className="w-[100vw] h-[100vh] mx-auto bg-gray-100">
      <Navbar />
      {/* Check if authData exists, if not show the login message */}
      {!authData || !authData.token ? (
        <div className="mb-4 text-center">
          <p className="text-lg text-gray-700">Please login to ask a doubt</p>
          <p className="text-md text-gray-500 mt-2">Redirecting in {timer}...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          <h2 className="text-3xl font-semibold text-center mb-6">Your Doubts</h2>

          {/* Pending Dropdown */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('Pending')}
              className="w-full hover:cursor-pointer hover:scale-105 transition-transform ease-in-out text-left px-4 py-2 bg-yellow-500 text-white rounded-md mb-4"
            >
              Pending ({pendingDoubts.length})
            </button>
            {expandedSection === 'Pending' && (
              <div className="bg-yellow-100 p-4 rounded-md shadow-lg">
                {pendingDoubts.length === 0 ? (
                  <p>No pending doubts available.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingDoubts.map((doubt) => (
                      <div
                        key={doubt.id}
                        className="hover:cursor-pointer hover:scale-105 transition-transform ease-in-out p-4 bg-white rounded-lg shadow-md"
                        onClick={() => handleDoubtClick(doubt.id, doubt)} // Add onClick handler
                      >
                        <h3 className="font-semibold">{doubt.heading}</h3>
                        <p className="text-sm text-gray-600">
                          <strong>Course:</strong> {doubt.course}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Text:</strong> {doubt.text}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Status:</strong> {doubt.status}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Answered Dropdown */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('Answered')}
              className="w-full hover:cursor-pointer hover:scale-105 transition-transform ease-in-out text-left px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
            >
              Answered ({answeredDoubts.length})
            </button>
            {expandedSection === 'Answered' && (
              <div className="bg-blue-100 p-4 rounded-md shadow-lg">
                {answeredDoubts.length === 0 ? (
                  <p>No answered doubts available.</p>
                ) : (
                  <div className="space-y-4">
                    {answeredDoubts.map((doubt) => (
                      <div
                        key={doubt.id}
                        className="hover:cursor-pointer hover:scale-105 transition-transform ease-in-out p-4 bg-white rounded-lg shadow-md"
                        onClick={() => handleDoubtClick(doubt.id, doubt)} // Add onClick handler
                      >
                        <h3 className="font-semibold">{doubt.heading}</h3>
                        <p className="text-sm text-gray-600">
                          <strong>Course:</strong> {doubt.course}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Text:</strong> {doubt.text}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Status:</strong> {doubt.status}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Resolved Dropdown */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('Resolved')}
              className="w-full hover:cursor-pointer hover:scale-105 transition-transform ease-in-out text-left px-4 py-2 bg-green-500 text-white rounded-md mb-4"
            >
              Resolved ({resolvedDoubts.length})
            </button>
            {expandedSection === 'Resolved' && (
              <div className="bg-green-100 p-4 rounded-md shadow-lg">
                {resolvedDoubts.length === 0 ? (
                  <p>No resolved doubts available.</p>
                ) : (
                  <div className="space-y-4">
                    {resolvedDoubts.map((doubt) => (
                      <div
                        key={doubt.id}
                        className="hover:cursor-pointer hover:scale-105 transition-transform ease-in-out p-4 bg-white rounded-lg shadow-md"
                        onClick={() => handleDoubtClick(doubt.id, doubt)} // Add onClick handler
                      >
                        <h3 className="font-semibold">{doubt.heading}</h3>
                        <p className="text-sm text-gray-600">
                          <strong>Course:</strong> {doubt.course}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Text:</strong> {doubt.text}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Status:</strong> {doubt.status}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDoubts;
