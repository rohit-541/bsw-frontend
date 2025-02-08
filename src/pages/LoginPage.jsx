import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaKey } from "react-icons/fa";
import Navbar from "../components/navbar";

const LoginPage = () => {
    const { login, isLoggedIn, setIsLoggedIn } = useAuth();
    const [kerberosId, setKerberosId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [userType, setUserType] = useState("user"); // new state for selecting user type
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/profilepage');
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await login(kerberosId, password, userType); // pass userType to login function

        if (!success) {
            setError("Invalid Kerberos ID or Password");
        } else {
            setError("");
        }
    };

    return (
        <>
            <Navbar />
            <div className="w-full flex flex-col sm:flex-row min-h-screen bg-gray-100">
                <div className="w-full sm:w-1/2 flex flex-col items-center justify-center p-8">
                    <img
                        src="/src/assets/login.png"
                        alt="BSW Portal Illustration"
                        className="w-[60%] h-auto mb-6"
                    />
                    <Link to="/signup">
                        <button className="bg-[#6358DC] text-white font-bold text-sm py-3 px-40 shadow-lg hover:scale-115 hover:cursor-pointer transition-transform">
                            SIGN UP
                        </button>
                    </Link>
                </div>

                <div className="w-[90vw] mx-auto sm:w-1/2 flex items-center justify-center">
                    <div className="w-full sm:w-[80%] bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="font-bold my-2">Welcome to</h2>
                        <h1 className="font-[1000] text-3xl text-[#6358DC] mb-4">
                            BSW Doubt Portal
                        </h1>

                        {error && (
                            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                        )}

                        {/* Mentor/User Selection */}
                        <div className="flex justify-center mb-4">
                            <button
                                className={`py-2 w-[6rem] px-6 rounded-l-lg ${userType === "user" ? 'bg-[#6358DC] text-white' : 'bg-gray-200'} hover:cursor-pointer hover:scale-105 transition-transform ease-in-out`}
                                onClick={() => setUserType("user")}
                            >
                                User
                            </button>
                            <button
                                className={`py-2 w-[6rem] px-6 rounded-r-lg ${userType === "mentor" ? 'bg-[#6358DC] text-white' : 'bg-gray-200'} hover:cursor-pointer hover:scale-105 transition-transform ease-in-out`}
                                onClick={() => setUserType("mentor")}
                            >
                                Mentor
                            </button>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="mb-4 relative">
                                <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="text"
                                    value={kerberosId}
                                    onChange={(e) => setKerberosId(e.target.value)}
                                    className="w-full py-3 pl-10 pr-3 border rounded-lg hover:scale-125 transition-transform ease-in-out bg-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-[#6358DC] "
                                    placeholder="Enter Kerberos ID"
                                    required
                                />
                            </div>

                            <div className="mb-6 relative">
                                <FaKey className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full py-3 pl-10 pr-3 border rounded-lg hover:scale-125 transition-transform ease-in-out bg-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            <div className="container mb-2 text-right">
                                <Link
                                    to="/update-password"
                                    className=" font-semibold hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full bg-[#6358DC] hover:bg-[#5547c3] text-white font-bold py-3 rounded-lg shadow focus:outline-none hover:cursor-pointer hover:scale-105"
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                        <p className="text-center text-sm mt-6">
                            Don’t have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-[#6358DC] font-semibold hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
