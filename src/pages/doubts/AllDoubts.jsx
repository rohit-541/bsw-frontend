import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router v6 hook for navigation
import Navbar from '../../components/navbar';
import config from '../../config';

const AllDoubts = () => {
    // State to store doubts, search query, and course filter
    const [doubts, setDoubts] = useState([]);
    const [filteredDoubts, setFilteredDoubts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [courseFilter, setCourseFilter] = useState('');

    const navigate = useNavigate(); // React Router v6's useNavigate for navigation

    // Fetch data on page load
    useEffect(() => {
        const fetchDoubts = async () => {
            try {
                // Replace with actual API call
                const response = await fetch(`${config.baseURL}/doubts/doubt/all`);
                const data = await response.json();

                if (data.success) {
                    setDoubts(data.doubts);
                    setFilteredDoubts(data.doubts);
                }
            } catch (error) {
                console.error('Error fetching doubts:', error);
            }
        };

        fetchDoubts();
    }, []);

    // Filter doubts based on search query and course
    useEffect(() => {
        const filtered = doubts.filter(doubt => {
            const matchesSearch =
                doubt.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doubt.text.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCourse = courseFilter
                ? doubt.course.toLowerCase().includes(courseFilter.toLowerCase())
                : true;

            return matchesSearch && matchesCourse;
        });
        setFilteredDoubts(filtered);
    }, [searchQuery, courseFilter, doubts]);

    // Helper function to truncate text to 50 characters with ellipsis
    const truncateText = (text) => {
        return text.length > 50 ? text.substring(0, 50) + '...' : text;
    };

    // Handle clicking a doubt to redirect to its detail page and store it in localStorage
    const handleDoubtClick = (id, doubtData) => {
        // Store the complete doubt info in localStorage
        localStorage.setItem('selectedDoubt', JSON.stringify(doubtData));

        // Redirect to the doubt detail page
        navigate(`/doubt/${id}`);
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 min-h-screen flex items-center justify-center pb-8 px-4">
                <div className="w-full mt-8 max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8 text-center">All Doubts</h1>

                    {/* Search Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                        <input
                            type="text"
                            placeholder="Search doubts by heading or text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-3 w-full sm:w-1/2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Search by course"
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            className="p-3 w-full sm:w-1/2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Doubts Tiles */}
                    <div className='hidden sm:block'>
                        <div
                            className={`p-8 rounded-lg items-center justify-center text-black flex flex-col sm:flex-row`}
                        >
                            <p className="text-xl text-center w-[60%]">Doubt</p>
                            <p className="text-xl text-center w-[25%]">User</p>
                            <p className="text-xl text-center w-[15%]">Course</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {filteredDoubts.map((doubt, index) => (
                            <div
                                key={doubt.id}
                                className={`p-8 hover:cursor-pointer rounded-lg items-center justify-center text-white ${index % 2 === 0 ? 'bg-green-500' : 'bg-yellow-500'} flex flex-col sm:flex-row`}
                                onClick={() => handleDoubtClick(doubt.id, doubt)} // Add onClick handler
                            >
                                <p className="text-lg text-center sm:w-[60%]">
                                    {truncateText(doubt.heading)}<br />
                                    {truncateText(doubt.text)}
                                </p>
                                <p className="text-lg text-center sm:w-[25%]">{doubt.user.name}</p>
                                <p className="text-lg text-center sm:w-[15%]">{doubt.course.toUpperCase()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllDoubts;
