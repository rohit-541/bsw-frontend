import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import config from "../config";

export default function MentorProfilePage() {
  const { id } = useParams();  // Get the mentor ID from the URL
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const baseurl = `${config.baseURL}`;

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        // Fetch the mentor details directly from the endpoint
        const response = await fetch(`${baseurl}/mentor/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch mentor data");
        }

        const data = await response.json();
        if (data.success) {
          setMentorData(data.mentor);
        } else {
          setError("Mentor not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  // Format course to uppercase
  const formattedCourse = mentorData?.course?.toUpperCase();

  // Format kerbros ID: Extract year, branch code, and roll number
  const formattedKerbros = mentorData?.kerbros
    ? `20${mentorData?.kerbros.slice(3, 5)}${mentorData?.kerbros.slice(0, 3).toUpperCase()}${mentorData?.kerbros.slice(5)}`
    : "No ID provided";


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="relative bg-[#2b4b6e] rounded-2xl p-6 overflow-hidden">
            {/* Mentor Info */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative w-32 h-32 md:w-48 md:h-48 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={`${config.baseURL}/${mentorData.ImageUrl}`}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-4 flex-grow">
                <div>
                  <label className="text-gray-400 text-sm">NAME</label>
                  <p className="text-white text-xl font-semibold">{mentorData?.name || "No name provided"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 text-sm">CONTACT</label>
                  <p className="text-white text-xl">{mentorData?.contact || "No contact provided"}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 text-sm">COURSE</label>
                  <p className="text-white text-xl">{formattedCourse || "No course provided"}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 text-sm">HOSTEL</label>
                  <p className="text-white text-xl">{mentorData?.hostel || "No hostel provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 text-sm">Role</label>
                  <p className="font-medium">{formattedCourse+" Mentor"}</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm">EMail Address :</label>
                  <p className="font-medium">{mentorData?.email}</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm">Cluster :</label>
                  <p className="font-medium">{mentorData?.cluster}</p>
                </div>
              </div>
              {/* {isLoggedIn && authData?.user?.role == "Mentor" ?
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Cluster : {authData?.user?.cluster}</p>
                  </div>
                </div>
                : " "} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
