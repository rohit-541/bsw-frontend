import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../config';

export default function MentorCard() {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const availableCourses = [
        "APL100", "PYL101", "MTL101", "MCP100", "CML101", "COL100", "ELL101"
    ];

    useEffect(() => {
        // Fetch mentors
        fetch(`${config.baseURL}/mentor/mentors/all`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setMentors(data.mentors);
                }
            })
            .catch((error) => console.error('Error fetching mentors:', error));

    }, []);

    // Filter mentors based on selected course (case insensitive)
    const filteredMentors = selectedCourse
        ? mentors.filter((mentor) => mentor.course.toUpperCase() === selectedCourse.toUpperCase())
        : mentors;

    const handleMentorCardClick = (mentorId) => {
        navigate(`/mentor/${mentorId}`);
    };
    return (
        <div>
            <div className="container w-full bg-white h-full mx-auto rounded-2xl p-10 relative mb-12">
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-800 mb-8">YOUR MENTORS</h1>
                <div className="w-full sm:w-[60%] mx-auto p-6 text-center">
                    <label htmlFor="courseSelect" className="text-lg font-semibold text-gray-700 mb-4">Select Course:</label>
                    <select
                        id="courseSelect"
                        className="mx-4 px-16 py-2 rounded-lg border border-gray-300 hover:cursor-pointer hover:bg-gray-400 hover:scale-110 transistion-all duration-300 ease-in-out"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">All Courses</option>
                        {availableCourses.map((course, index) => (
                            <option key={index} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col sm:flex-row">
                    {/* Left Section: Illustration and Chart */}
                    <div className="w-full sm:w-1/3 flex flex-col items-center">
                        <img src="/src/assets/mentorObjects.png" alt="Students" className="w-3/4" />
                    </div>

                    {/* Right Section: Mentor List */}
                    <div className="w-full mt-4 sm:mt-0 sm:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {filteredMentors.map((mentor, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center cursor-pointer"
                                onClick={() => handleMentorCardClick(mentor.id)}
                            >
                                <div className="w-20 h-20 bg-gray-300 rounded-full">
                                    <img
                                        src={`${config.baseURL}/${mentor.ImageUrl}`}
                                        alt={mentor.name}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                <p className="mt-2 font-semibold">{mentor.name}</p>
                                <p className="text-sm text-gray-500">{mentor.email}</p>
                                <p className="text-sm text-gray-500">{mentor.contact}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
