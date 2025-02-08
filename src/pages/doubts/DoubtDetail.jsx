import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/navbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import config from '../../config';

const DoubtDetail = () => {
    const { id } = useParams(); // Get the dynamic :id from the URL
    const [doubt, setDoubt] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replies, setReplies] = useState([]);
    const [authData, setAuthData] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    // State for managing the update form
    const [isEditing, setIsEditing] = useState(false);
    const [updatedHeading, setUpdatedHeading] = useState('');
    const [updatedText, setUpdatedText] = useState('');

    useEffect(() => {
        // Retrieve the stored doubt information from localStorage
        const storedDoubt = localStorage.getItem('selectedDoubt');
        const authData = JSON.parse(localStorage.getItem('authData')); // Get auth data

        if (storedDoubt) {
            const parsedDoubt = JSON.parse(storedDoubt);

            // Check if the stored doubt's ID matches the URL ID
            if (parsedDoubt.id === id) {
                setDoubt(parsedDoubt);
                setUpdatedHeading(parsedDoubt.heading);
                setUpdatedText(parsedDoubt.text);
            }
        }

        if (authData) {
            setAuthData(authData); // Set auth data (user info and token)
        }
    }, [id]);

    // Fetch replies for this doubt
    useEffect(() => {
        if (id) {
            const fetchReplies = async () => {
                try {
                    const response = await fetch(`${config.baseURL}/replies/${id}`);
                    const data = await response.json();

                    if (data.success) {
                        setReplies(data.Replies); // Store replies in state
                    } else {
                        console.error('Error fetching replies:', data.message);
                    }
                } catch (error) {
                    console.error('Error fetching replies:', error);
                }
            };

            fetchReplies();
        }
    }, [id]);

    // Handle reply submission with image
    const handleReplySubmit = async (e) => {
        e.preventDefault();

        if (replyText.trim() === '') {
            alert('Please write a reply.');
            return;
        }

        const formData = new FormData();
        formData.append('replyText', replyText);
        formData.append('doubtId', id);
        if (imageFile) formData.append('image', imageFile);

        const response = await fetch(`${config.baseURL}/replies/`, {
            method: 'POST',
            headers: {
                'Authorization': authData.token,
            },
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            alert('Reply submitted successfully!');
            setReplies([...replies, data.reply]); // Add new reply to state
            setReplyText('');
            setImageFile(null); // Reset image file after submission
        } else {
            alert('Error submitting reply.');
        }
    };

    // Handle doubt update
    const handleUpdateDoubt = async () => {
        if (!authData || !updatedHeading.trim() || !updatedText.trim()) {
            alert('Please provide both updated heading and text.');
            return;
        }

        const updatedDoubt = {
            heading: updatedHeading,
            text: updatedText,
        };

        const response = await fetch(`${config.baseURL}/doubts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authData.token,
            },
            body: JSON.stringify(updatedDoubt),
        });

        const data = await response.json();

        if (data.success) {
            alert('Doubt updated successfully!');
            setDoubt({ ...doubt, ...updatedDoubt });
            setIsEditing(false); // Close the edit form after successful update
            navigate('/allDoubts');
        } else {
            alert('Error updating doubt.');
        }
    };

    // Handle resolve doubt (mentor role)
    const handleResolveDoubt = async () => {
        if (!authData) return;

        const response = await fetch(`${config.baseURL}/doubts/resolve/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': authData.token,
            },
        });

        const data = await response.json();

        if (data.success) {
            alert('Doubt resolved successfully!');
            setDoubt({ ...doubt, status: 'Resolved' });
            navigate('/allDoubts');
        } else {
            alert('Error resolving doubt.');
        }
    };

    // Handle update image
    const handleImageUpdate = async () => {
        if (!imageFile) {
            alert('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${config.baseURL}/doubts/updateImage/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': authData.token,
            },
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            alert('Image updated successfully!');
            setDoubt({ ...doubt, imageUrl: data.imageUrl });
        } else {
            alert('Error updating image.');
        }
    };

    if (!doubt) {
        return <div>Loading...</div>;
    }

    // Check if the logged-in user is a mentor
    const isMentor = authData?.user?.role === 'Mentor';
    const isLoggedIn = authData !== null;

    // Check if the doubt is resolved (prevent replying)
    const isResolved = doubt.status === 'Resolved';

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 min-h-screen flex items-center justify-center pb-8 px-4 pt-8">
                <div className="w-full max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8 text-center">Doubt Detail</h1>

                    <div className="p-8 rounded-lg bg-white shadow-md flex flex-col lg:flex-row space-x-4">
                        {/* Doubt Details */}
                        <div className="w-full lg:w-1/2">
                            {isEditing ? (
                                <div>
                                    <h2 className="text-2xl font-bold">Update Doubt</h2>
                                    <form onSubmit={(e) => e.preventDefault()} className="mt-4">
                                        <input
                                            type="text"
                                            value={updatedHeading}
                                            onChange={(e) => setUpdatedHeading(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md mb-4"
                                            placeholder="Updated heading"
                                        />
                                        <textarea
                                            value={updatedText}
                                            onChange={(e) => setUpdatedText(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md mb-4"
                                            placeholder="Updated text"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleUpdateDoubt}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:cursor-pointer hover:scale-110 transition-transform ease-in-out"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md  hover:cursor-pointer hover:scale-110 transition-transform ease-in-out"
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-bold">{doubt.heading}</h2>
                                    <p className="mt-4 text-lg">{doubt.text}</p>
                                    <div className="mt-6">
                                        <p className="text-lg font-semibold">User: {doubt.user.name}</p>
                                        <p className="text-lg font-semibold">Course: {doubt.course.toUpperCase()}</p>
                                        <p className="text-lg font-semibold">Status: {doubt.status}</p>
                                    </div>

                                    {/* Show 'Update Doubt' button if logged-in user created the doubt */}
                                    {isLoggedIn && authData.user.id === doubt.user.id && !isResolved && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                                        >
                                            Update Doubt
                                        </button>
                                    )}

                                    {/* Show 'Resolve Doubt' button if the user is a mentor */}
                                    {isMentor && !isResolved && (
                                        <button
                                            onClick={handleResolveDoubt}
                                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
                                        >
                                            Resolve Doubt
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Image Section */}
                        {doubt.imageUrl && (
                            <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                                <a href={`${config.baseURL}/${doubt.imageUrl}`} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={`${config.baseURL}/${doubt.imageUrl}`}
                                        alt="Doubt"
                                        className="w-full h-auto rounded-md cursor-pointer"
                                    />
                                </a>
                                {/* Update image section */}
                                {isLoggedIn && authData.user.id === doubt.user.id && !isResolved && isEditing && (
                                    <div className="mt-4">
                                        <input
                                            type="file"
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                            className="block mb-4"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleImageUpdate}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                        >
                                            Update Image
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Show reply form if user is logged in and the doubt is not resolved */}
                    {isLoggedIn && !isResolved && (
                        <form onSubmit={handleReplySubmit} className="mt-8">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md"
                                placeholder="Write your reply here"
                            />
                            <input
                                type="file"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="block mt-4"
                            />
                            <button
                                type="submit"
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                Submit Reply
                            </button>
                        </form>
                    )}

                    {/* Show replies */}
                    <div className="mt-8 bg-white p-8 rounded-md">
                        <h3 className="text-xl font-bold">Replies</h3>
                        {replies.length === 0 ? (
                            <p>No replies yet.</p>
                        ) : (
                            replies.map((reply, index) => (
                                <div key={index} className="mt-4 p-4 bg-gray-200 rounded-md">
                                    <p>
                                        <strong>
                                            {reply.User?.name
                                                ? `STUDENT | ${reply.User?.name}`
                                                : <>
                                                    <Link to={`/mentor/${reply.Mentor.id}`}>
                                                        <span className="text-red-500">
                                                            MENTOR
                                                        </span> | {reply.Mentor.name}
                                                    </Link>
                                                </>}
                                        </strong>: {reply.replyText}
                                    </p>
                                    {/* Display the image in reply if available */}
                                    {reply.imageUrl && (
                                        <a href={`${config.baseURL}/${reply.imageUrl}`} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={`${config.baseURL}/${reply.imageUrl}`}
                                                alt="Reply Image"
                                                className="mt-2 max-w-[100px] h-auto rounded-md cursor-pointer"
                                            />
                                        </a>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoubtDetail;
