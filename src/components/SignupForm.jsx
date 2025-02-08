import React, { useState } from 'react';
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // For redirection
import config from '../config';

export default function SignupForm() {
    const navigate = useNavigate(); // Hook for redirection
    const baseurl = `${config.baseURL2}`;

    // State for form data and error messages
    const [id, setId] = useState('');
    const [error, setError] = useState('');

    // Handle form input change
    const handleChange = (e) => {
        setId(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.setItem('kerbrosId', id);


        // Validate Kerberos ID manually
        const regex = /^[A-Za-z]{2}\d{7}$/;
        if (!regex.test(id)) {
            setError('ID must be in the format {letter}{letter}XXXXXXX');
            return;
        }

        setError(''); // Clear any previous error

        // Prepare the data for the POST request
        const data = {
            kerbros: id,
        };

        try {
            // Send POST request to the server
            const response = await fetch(`${baseurl}/user/verifyEmail`, {
                method: "POST",
                // credentials:'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Redirect to OTP page upon successful request
                navigate("/otp");
            } else {
                // Handle error responses, e.g. show an alert or error message
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            // Handle network or other errors
            console.error("Error sending request:", error);
            alert("There was an error. Please try again later.");
        }
    };

    return (
        <div className="w-full my-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ID Input */}
                <div className="mb-6">
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                        <FaUserAlt className="inline mr-2" />
                        Kerberos ID
                    </label>
                    <input
                        type="text"
                        id="id"
                        value={id}
                        onChange={handleChange}
                        placeholder="Enter your Kerberos ID"
                        className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6358DC]-500"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-[#6358DC] text-white rounded-lg hover:cursor-pointer   transition-transform duration-300 ease-in-out focus:outline-none"
                >
                    Request OTP
                </button>
            </form>
        </div>
    );
}
