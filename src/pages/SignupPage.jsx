import React from 'react';
import { Link } from "react-router-dom";
import SignupForm from '../components/SignupForm';
import loginImage from "../assets/login.png"; // Your image path
import Navbar from '../components/navbar';


export default function SignupPage() {
  return (<>
  <Navbar/>
    <div className="bg-gray-100 "> {/* Ensures the page background is gray-100 */}
      <div className="container mx-auto flex flex-col bg-gray-100 py-10 md:flex-row ">

        {/* Right Side */}
        <div className="w-[90vw] md:w-1/2 bg-white p-12 flex flex-col items-start justify-center shadow-lg rounded-lg mx-auto">
          <h2 className="text-xl font-bold text-center text-gray-800">Welcome to</h2>
          <h3 className="text-2xl text-center text-[#6358DC] mb-8 font-[1000]">BSW Doubt Portal</h3>
          <p>Enter you Kerberos ID to continue with signup :</p>
          <SignupForm />
        </div>
      </div>
    </div></>
  );
}
