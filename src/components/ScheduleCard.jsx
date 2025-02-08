import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import config from '../config';

export default function ScheduleCard() {
    const navigate = useNavigate();
    localStorage.removeItem('selectedDoubt');

    // For calendar 
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(null);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const calendarDays = Array.from({ length: firstDayOfMonth }, () => null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [liveSessions, setLiveSessions] = useState([]);

    useEffect(() => {
        fetch(`${config.baseURL}/sessions/upcomming/all`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setUpcomingSessions(data.sessions);
                }
            })
            .catch((error) => console.error('Error fetching upcoming sessions:', error));

        // Fetch live sessions
        fetch(`${config.baseURL}/sessions/live/all`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setLiveSessions(data.sessions);
                }
            })
            .catch((error) => console.error('Error fetching live sessions:', error));
    }, [])

    const getSessionsForDate = (date) => {
        return upcomingSessions.filter(session => {
            const sessionDate = new Date(session.startTime).getDate();
            return sessionDate === date;
        });
    };
    return (
        <div>
            {/* Schedule Section */}
            <div className="container bg-white w-[90vw] mx-auto h-auto sm:h-auto my-20 rounded-2xl flex flex-col sm:flex-row justify-center items-center text-center">
                {/* Left Section: Image */}
                <div className="w-[70%] mt-4 sm:mt-0 sm:w-[35%] flex justify-center items-center">
                    <img
                        src="/src/assets/schedule.png"
                        alt="Schedule"
                        className="w-[80%] h-auto object-contain"
                    />
                </div>

                {/* Right Section: Calendar */}
                <div className="w-full sm:w-[65%] text-left p-6 mb-3">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6">
                        Schedule
                    </h1>

                    {/* Calendar */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            {today.toLocaleString("default", { month: "long" })} {today.getFullYear()}
                        </h2>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2 text-center">
                            {/* Weekday Names */}
                            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                                <div key={index} className="font-semibold text-gray-600">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar Days */}
                            {calendarDays.map((day, index) => {
                                const sessionsForDay = getSessionsForDate(day);
                                return (
                                    <div key={index} className="flex flex-col items-center">
                                      <Link
                                        to={`/session/${sessionsForDay[0]?.id}`} // Assuming you want to navigate based on the first session's ID
                                        className={`w-full p-4 rounded-lg ${day === selectedDate
                                          ? " text-black"
                                          : day === today.getDate()
                                          ? "bg-pink-200 text-gray-700"
                                          : day
                                            ? "bg-gray-200 text-gray-700"
                                            : "bg-transparent"
                                          } hover:bg-blue-500 hover:text-white cursor-pointer`}
                                      >
                                        {day || ""}
                                        {sessionsForDay.map((session, idx) => (
                                          <div key={idx} className="text-sm block">
                                            {session.course.toUpperCase()}
                                          </div>
                                        ))}
                                      </Link>
                                    </div>
                                  );
                                  
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Session Section */}
            <div className="container bg-white w-[90vw] mx-auto h-auto sm:h-[32rem] my-20 rounded-2xl flex flex-col sm:flex-row justify-center items-center text-center">
                {/* Left Section: Image */}
                <div className="w-[70%] sm:w-[35%] flex justify-center items-center mt-4 sm:mt-0">
                    <img
                        src="/src/assets/liveSessions.png"
                        alt="Live Sessions"
                        className="w-[80%] h-auto object-contain"
                    />
                </div>

                {/* Right Section: Live Session Details */}
                <div className="w-full sm:w-[65%] text-left p-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 text-center">LIVE SESSIONS</h1>
                    <p className="mt-4 text-gray-600">
                        Details of live sessions will appear here.
                    </p>

                    {/* Live Session Tiles */}
                    <div className="mt-6 space-y-4">
                        {liveSessions && liveSessions.length > 0 ? (
                            liveSessions.map((session, index) => (
                                <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold text-gray-700">{session.course.toUpperCase()}</h2>
                                    <p className="text-sm text-gray-500">Starts: {new Date(session.startTime).toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Ends: {new Date(session.endTime).toLocaleString()}</p>
                                    <a
                                        href={session.joinLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Join Session
                                    </a>
                                </div>
                            ))
                        ) : (
                            <div>No live Sessions now</div>
                        )}

                    </div>
                </div>
            </div>

        </div>
    )
}
