import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '/src/context/AuthContext';
import { useEffect } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { authData, isLoggedIn, setAuthData, setIsLoggedIn } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [isLoggedIn]);

    const logout = () => {
        setAuthData(null); // Clear user data on logout
        localStorage.removeItem("authData"); // Remove from localStorage
        setIsLoggedIn(false);
        localStorage.removeItem("isAuthenticated")
        navigate('/home')
      };

    return (
        <nav id="navbar" className="bg-[#83c1bc] pb-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left Section */}
                    <div className="flex-1 flex flex-col items-center sm:items-start py-2">
                        <Link to="/">
                            {/* PNG Image */}
                            <img
                                src="/src/assets/bsw_logo.png" // Update this path to the correct location of your PNG file
                                alt="Logo"
                                className="w-30 mx-au h-8"
                            />

                            {/* Text */}
                            <span className="text-lg font-bold text-gray-900 mt-1">
                                Academic Mentorship
                            </span>
                        </Link>
                    </div>


                    {/* Right Section */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/doubt" className="  hover:text-white py-2 px-4 rounded-xl  hover:underline transition-all duration-300 ease-in-out focus:outline-none">
                            DOUBT
                        </Link>
                        <Link to="/schedule" className="  hover:text-white py-2 px-4 rounded-xl hover:underline transition-all duration-300 ease-in-out focus:outline-none ">
                            SCHEDULE
                        </Link>
                        <a href="http://iitdelhiforum.in" target="_blank" className="  hover:text-white py-2 px-4 rounded-xl hover:underline transition-all duration-300 ease-in-out focus:outline-none ">
                            COURSE REVIEW
                        </a>
                        <Link to="/pyqs" className="  hover:text-white py-2 px-4 rounded-xl hover:underline transition-all duration-300 ease-in-out focus:outline-none">
                            PYQS
                        </Link>
                        <a href="https://docs.google.com/forms/d/1_QZNApfKMbt6IW34kROkuoYN-hf4XRWArD_l2J0xQMw/edit" target="_blank" className="  hover:text-white py-2 px-4 rounded-xl hover:underline transition-all duration-300 ease-in-out focus:outline-none">
                            FEEDBACK
                        </a>
                        {isLoggedIn && (authData?.user?.role=="admin" ||authData?.user?.role=="superadmin")? (
                           <Link to="/admin" className="  hover:text-white py-2 px-4 rounded-xl hover:underline transition-all duration-300 ease-in-out focus:outline-none">
                           ADMIN
                       </Link>
                        ) : " "}
                        {!isLoggedIn ? (
                            <button type="submit" className="border-2 border-black px-8 py-2 rounded-3xl hover:underline transition-all duration-300 ease-in-out focus:outline-none hover:text-white hover:cursor-pointer">
                                <Link to="/login" className="py-2 px-4 rounded-xl">
                                    Login
                                </Link>
                            </button>
                        ) : (
                            <button onClick={logout} className="border-2 border-black px-8 py-2 rounded-3xl hover:underline transition-all duration-300 ease-in-out focus:outline-none hover:text-white hover:cursor-pointer">
                                Logout
                            </button>
                        )}

                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            type="button"
                            className=" hover:text-white hover:bg-black "
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/doubt" className="  hover:text-white hover:bg-black  block text-center ">
                            DOUBT
                        </Link>
                        <Link to="/schedule" className="  hover:text-white hover:bg-black  block text-center">
                            SCHEDULE
                        </Link>
                        <a target="_blank"  href="http://iitdelhiforum.in" className="  hover:text-white hover:bg-black  block text-center">
                            COURSE REVIEW
                        </a>
                        <Link to="/pyqs" className="  hover:text-white hover:bg-black  block text-center">
                            PYQS
                        </Link>
                        <Link to="https://docs.google.com/forms/d/1_QZNApfKMbt6IW34kROkuoYN-hf4XRWArD_l2J0xQMw/edit" className="  hover:text-white hover:bg-black  block text-center">
                            FEEDBACK
                        </Link>
                        {isLoggedIn && (authData?.user?.role=="admin" ||authData?.user?.role=="superadmin")? (
                           <Link to="/admin" className="  hover:text-white py-2 px-4 rounded-xl hover:underline transition-all duration-300 ease-in-out focus:outline-none">
                           ADMIN
                       </Link>
                        ) : " "}
                        {!isLoggedIn ? (
                            <button type="submit" className="container border-2 border-black px-8 py-2 rounded-3xl hover:underline transition-all duration-300 ease-in-out focus:outline-none hover:text-white hover:cursor-pointer mx-auto">
                                <Link to="/login" className="py-2 px-4 rounded-xl">
                                    Login
                                </Link>
                            </button>
                        ) : (
                            <button onClick={logout} className=" container mx-auto border-2 border-black px-8 py-2 rounded-3xl hover:underline transition-all duration-300 ease-in-out focus:outline-none hover:text-white hover:cursor-pointer">
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
