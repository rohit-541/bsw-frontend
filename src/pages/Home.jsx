import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import UserName from '/src/components/UserName.jsx';
import DoubtCards from '../components/DoubtCards';
import ScheduleCard from '../components/ScheduleCard';
import config from '../config';
import MentorCard from '../components/MentorCard';
import PersonalMentorship from '../components/PersonalMentorship';

export default function Home() {
  const navigate = useNavigate();
  localStorage.removeItem('selectedDoubt');

  // Fetch mentors data from the API
 
  return (
    <>
      <Navbar />
      <UserName />
      <div>
        <div className="w-full h-auto">
          {/* Image Section */}
          <img
            src="/src/assets/homeImage.png"
            alt="HomeImage"
            className="w-full h-auto object-cover"
          />

          {/*Schedule Section*/}
          <ScheduleCard />

          {/* Doubts Section */}
          <DoubtCards />

          <div className="mb-[4rem]"></div>


          {/* Mentors Section */}
          <MentorCard/>

          {/*Personal Mentorship Section*/}
          <PersonalMentorship/>
        </div>
      </div>
    </>
  );
}