import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

const AdminPage = () => {
  const navigate = useNavigate();

  const [authData, setAuthData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timer, setTimer] = useState(3);
  const [showCreateMentorForm, setShowCreateMentorForm] = useState(false);
  const [showCreateSessionForm, setShowCreateSessionForm] = useState(false);

  const [createMentorData, setCreateMentorData] = useState({
    name: "",
    contact: "",
    kerbros: "",
    password: "",
    course: "",
    email: "",
    hostel: "",
    Gender: "",
    cluster: "" // Added cluster field
  });

  const [createSessionData, setCreateSessionData] = useState({
    course: "",
    mentorId1: "",
    mentorId2: "",
    startTime: "",
    endTime: "",
    joinLink: "",
    assets: ""
  });

  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    // Retrieve authData from localStorage and parse it
    const storedAuthData = JSON.parse(localStorage.getItem("authData"));

    if (storedAuthData && (storedAuthData.user.role === "admin" || storedAuthData.user.role === "superadmin")) {
      setAuthData(storedAuthData);
      setIsAuthenticated(true);
    } else {
      // If not authenticated or wrong role, start the timer and redirect
      setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      if (timer === 0) {
        navigate("/"); // Redirecting to home page
      }
    }
  }, [timer, navigate]);

  const handleCreateMentorSubmit = async (e) => {
    e.preventDefault();

    // Ensure the token is properly accessed from localStorage
    const token = authData?.token;

    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    // Ensure contact and cluster are numbers
    const contactNumber = Number(createMentorData.contact);
    const clusterNumber = Number(createMentorData.cluster);

    if (isNaN(contactNumber) || isNaN(clusterNumber)) {
      alert("Please provide valid numbers for Contact and Cluster.");
      return;
    }

    try {
      const response = await fetch(`${config.baseURL}/mentor/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token // Use the token here
        },
        body: JSON.stringify({
          ...createMentorData,
          contact: contactNumber, // Send contact as number
          cluster: clusterNumber // Send cluster as number
        })
      });
      console.log(token);
      console.log(createMentorData);

      if (response.ok) {
        alert("Mentor Created Successfully!");
        setCreateMentorData({
          name: "",
          contact: "",
          kerbros: "",
          password: "",
          course: "",
          email: "",
          hostel: "",
          Gender: "",
          cluster: "" // Reset cluster field
        });
      } else {
        alert("Error creating mentor.");
      }
    } catch (error) {
      console.error("Error creating mentor:", error);
    }
  };


  const fetchMentors = async () => {
    const token = authData?.token;
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${config.baseURL}/mentor/mentors/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      });

      const data = await response.json();
      if (data.success) {
        setMentors(data.mentors);
        setCourseList([...new Set(data.mentors.map((mentor) => mentor.course))]); // Unique courses
      } else {
        alert("Failed to fetch mentors.");
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMentors();
    }
  }, [isAuthenticated]);

  const handleCourseChange = (e) => {
    const course = e.target.value;
    setCreateSessionData((prevData) => ({
      ...prevData,
      course
    }));

    // Filter mentors based on the selected course
    const filtered = mentors.filter((mentor) => mentor.course === course);
    setFilteredMentors(filtered);
  };

  const handleCreateSessionSubmit = async (e) => {
    e.preventDefault();
    const token = authData?.token;

    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    // Prepare the data to send
    const sessionData = { ...createSessionData };

    // Ensure the time format is in the correct format with 'Z' for UTC
    sessionData.startTime = new Date(createSessionData.startTime).toISOString();
    sessionData.endTime = new Date(createSessionData.endTime).toISOString();

    // If no assets link is provided, remove it from the body
    if (!sessionData.assets) {
      delete sessionData.assets;
    }

    try {
      const response = await fetch(`${config.baseURL}/sessions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token, // Attach the Authorization token
        },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        alert("Session Created Successfully!");
        setCreateSessionData({
          course: "",
          mentorId1: "",
          mentorId2: "",
          startTime: "",
          endTime: "",
          joinLink: "",
          assets: ""
        });
      } else {
        alert("Error creating session.");
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleInputChange = (e, setStateFunction) => {
    const { name, value } = e.target;
    setStateFunction((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-lg font-semibold mb-4">You are not allowed to access this page</h2>
          <p>Redirecting to home page in {timer} seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

        {/* Buttons for Create Mentor and Create Session */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
            onClick={() => {
              setShowCreateMentorForm(true);
              setShowCreateSessionForm(false);
            }}
          >
            Create Mentor
          </button>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
            onClick={() => {
              setShowCreateMentorForm(false);
              setShowCreateSessionForm(true);
            }}
          >
            Create Session
          </button>
        </div>

        {/* Show Create Mentor Form */}
        {showCreateMentorForm && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Create Mentor</h2>
            <form onSubmit={handleCreateMentorSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="name"
                  value={createMentorData.name}
                  onChange={(e) => handleInputChange(e, setCreateMentorData)}
                  placeholder="Mentor Name"
                  required
                />
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="contact"
                  value={createMentorData.contact}
                  onChange={(e) => handleInputChange(e, setCreateMentorData)}
                  placeholder="Mentor Contact"
                  required
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="kerbros"
                  value={createMentorData.kerbros}
                  onChange={(e) => handleInputChange(e, setCreateMentorData)}
                  placeholder="Kerbros ID"
                  required
                />
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="password"
                  value={createMentorData.password}
                  onChange={(e) => handleInputChange(e, setCreateMentorData)}
                  placeholder="Password"
                  required
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="course"
                  value={createMentorData.course}
                  onChange={(e) => handleInputChange(e, setCreateMentorData)}
                  placeholder="Course"
                  required
                />
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="email"
                  value={createMentorData.email}
                  onChange={(e) => handleInputChange(e, setCreateMentorData)}
                  placeholder="Mentor Email"
                  required
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="hostel"
                  value={createMentorData.hostel}
                  onChange={(e) => handleInputChange(e, setCreateMentorData)}
                  placeholder="Hostel"
                  required
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="Gender"
                  value={createMentorData.Gender}
                  onChange={(e) => handleInputChange(e, setCreateMentorData)}
                  placeholder="Gender"
                  required
                />
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="cluster"
                  value={createMentorData.cluster}
                  onChange={(e) => handleInputChange(e, setCreateMentorData)}
                  placeholder="Cluster"
                  required
                />
              </div>
              <button type="submit" className="container mt-4 mx-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out">
                Create Mentor
              </button>
            </form>
          </div>
        )}

        {/* Show Create Session Form */}
        {showCreateSessionForm && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Create Session</h2>
            <form onSubmit={handleCreateSessionSubmit}>
              {/* Course Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Course</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="course"
                  value={createSessionData.course}
                  onChange={handleCourseChange}
                  required
                >
                  <option value="">Select a course</option>
                  {courseList.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mentor Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Mentor 1</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="mentorId1"
                  value={createSessionData.mentorId1}
                  onChange={(e) => handleInputChange(e, setCreateSessionData)}
                  required
                >
                  <option value="">Select a mentor</option>
                  {filteredMentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Mentor 2</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="mentorId2"
                  value={createSessionData.mentorId2}
                  onChange={(e) => handleInputChange(e, setCreateSessionData)}
                  required
                >
                  <option value="">Select a mentor</option>
                  {filteredMentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="startTime"
                  value={createSessionData.startTime}
                  onChange={(e) => handleInputChange(e, setCreateSessionData)}
                  required
                />
              </div>

              {/* End Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">End Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="endTime"
                  value={createSessionData.endTime}
                  onChange={(e) => handleInputChange(e, setCreateSessionData)}
                  required
                />
              </div>

              {/* Join Link */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Join Link</label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="joinLink"
                  value={createSessionData.joinLink}
                  onChange={(e) => handleInputChange(e, setCreateSessionData)}
                  placeholder="Enter join link"
                  required
                />
              </div>

              {/* Assets Link (Optional) */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 ">Assets Link (Optional)</label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border rounded-lg hover:cursor-pointer hover:scale-115 transition-transform duration-300 ease-in-out"
                  name="assets"
                  value={createSessionData.assets}
                  onChange={(e) => handleInputChange(e, setCreateSessionData)}
                  placeholder="Enter assets link"
                />
              </div>

              <button type="submit" className="container mx-auto mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out">
                Create Session
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
