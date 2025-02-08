import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import config from '../config';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        hostel: '',
        gender: '',
        password: '',
        confirmPassword: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Hook for redirection
    const baseurl = `${config.baseURL2}`; // Base URL for your backend

    const hostels = [
        "Kailash", "Himadri", "Sahyadri", "Girnar", "Satpura", "Udaigiri",
        "Nilgiri", "Karakoram", "Aravali", "Jwalamukhi", "Kumaon", "Shivalik",
        "Zanskar", "Vindyanchal", "Dronagiri", "Saptgiri"
    ];

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        // Clear error message if any
        setErrorMessage('');

        // Send POST request to register the user
        const data = {
            name: formData.name,
            password: formData.password,
            Gender: formData.gender,
            hostel: formData.hostel,
            avatar: 0
        };

        try {
            const response = await fetch(`${baseurl}/user/register`, {
                method: 'POST',
                // credentials : 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : localStorage.getItem('token'),
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Handle successful response
                const responseData = await response.json();
                setSuccessMessage("Registration successful! Redirecting...");
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page after successful registration
                }, 2000);
                localStorage.clear();
                
            } else {
                // Handle error response
                const errorData = await response.json();
                setErrorMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setErrorMessage('There was an error. Please try again later.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg mb-16">
            <h2 className="text-center text-2xl font-semibold mb-4">Register</h2>
            <form onSubmit={handleSubmit}>
                {/* Name Input */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6358DC] focus:border-[#6358DC]"
                        required
                    />
                </div>

                {/* Hostel Dropdown */}
                <div className="mb-4">
                    <label htmlFor="hostel" className="block text-sm font-medium text-gray-700">
                        Hostel
                    </label>
                    <select
                        id="hostel"
                        name="hostel"
                        value={formData.hostel}
                        onChange={handleInputChange}
                        className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6358DC] focus:border-[#6358DC]"
                        required
                    >
                        <option value="">Select your hostel</option>
                        {hostels.map((hostel, index) => (
                            <option key={index} value={hostel}>
                                {hostel}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Gender Radio Buttons */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Gender
                    </label>
                    <div className="flex space-x-4">
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === 'Male'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === 'Female'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Female
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Other"
                                checked={formData.gender === 'Other'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Other
                        </label>
                    </div>
                </div>

                {/* Password Input */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6358DC] focus:border-[#6358DC]"
                        required
                    />
                </div>

                {/* Confirm Password Input */}
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6358DC] focus:border-[#6358DC]"
                        required
                    />
                </div>

                {/* Error Message */}
                {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

                {/* Success Message */}
                {successMessage && <div className="text-green-500 text-sm mb-4">{successMessage}</div>}

                {/* Register Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-[#6358DC] text-white rounded-lg hover:cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out focus:outline-none"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
