import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import config from '../config';

const SessionDetails = () => {
    const { id } = useParams(); // Get the session ID from the URL
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Fetch session details from the server
        const fetchSessionDetails = async () => {
            try {
                const response = await fetch(`${config.baseURL}/sessions/${id}`);
                const data = await response.json();
                if (data.success) {
                    setSession(data.session);
                } else {
                    alert('Error fetching session details.');
                }
            } catch (error) {
                console.error('Error fetching session details:', error);
                alert('An error occurred while fetching session details.');
            }
        };

        fetchSessionDetails();
    }, [id]);

    if (!session) {
        return <div>Loading...</div>;
    }

    const { course, startTime, endTime, joinLink, assets, mentor1, mentor2 } = session;

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 min-h-screen flex items-center justify-center pb-8 px-4">
                <div className="w-full max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8 text-center">Session Details</h1>

                    <div className="p-8 rounded-lg bg-white shadow-md space-y-6">
                        {/* Session Information */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Course: {course.toUpperCase()}</h2>
                            <p className="text-lg">Start Time: {new Date(startTime).toLocaleString()}</p>
                            <p className="text-lg">End Time: {new Date(endTime).toLocaleString()}</p>
                            <p className="text-lg">Join Link: <a href={joinLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">Click here to join</a></p>
                        </div>

                        {/* Assets Section */}
                        {assets && assets !== null && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Assets</h3>
                                {/* Render assets here */}
                                <ul className="list-disc pl-5">
                                    {assets.map((asset, index) => (
                                        <li key={index} className="text-lg">
                                            <a href={asset} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                                {asset}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Mentor Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Mentor 1 */}
                            <div className="p-6 border border-gray-300 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold">{mentor1.name}</h3>
                                <p className="text-md">{mentor1.hostel}</p>
                                <p className="text-md">{mentor1.email}</p>
                                <p className="text-md">Contact: {mentor1.contact}</p>
                                <Link to={`/mentor/${mentor1.id}`} className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">View Mentor</Link>
                            </div>

                            {/* Mentor 2 */}
                            <div className="p-6 border border-gray-300 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold">{mentor2.name}</h3>
                                <p className="text-md">{mentor2.hostel}</p>
                                <p className="text-md">{mentor2.email}</p>
                                <p className="text-md">Contact: {mentor2.contact}</p>
                                <Link to={`/mentor/${mentor2.id}`} className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">View Mentor</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SessionDetails;
