import React, { useEffect, useState } from "react";
import { useAuth } from "/src/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import config from "../config";

export default function ProfilePage() {
  const { authData, isLoggedIn, setAuthData, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null); // For storing the selected image
  const [imagePreview, setImagePreview] = useState(null); // For previewing the selected image
  const baseurl = `${config.baseURL2}`;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create a preview of the selected image
      handleImageUpload(file); // Call the upload function directly after image selection
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      console.log("No file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("mentorId", authData?.user?.id);

    setLoading(true); // Optionally show loading spinner while uploading

    try {
      // Make the POST request to upload the image
      const response = await fetch(`${baseurl}/mentor/image`, {
        method: "POST",
        headers: {
          "Authorization": authData?.token,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAuthData((prevData) => ({
          ...prevData,
          user: { ...prevData.user, ImageUrl: data.imageUrl }, // Assuming the API returns the updated image URL
        }));

        alert("Image upload Successful. Kindly login again");
        logoutFromAllDevices();
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
    } finally {
      setLoading(false); // Stop loading when the request is complete
    }
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem("authData");
    setIsLoggedIn(false);
    localStorage.removeItem("isAuthenticated");
    navigate('/login');
  };

  const logoutFromAllDevices = async () => {
    const endpoint = authData?.user?.role === "user" ? "/user/logoutall" : "/mentor/logoutall";
    try {
      const response = await fetch(`${baseurl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authData?.token,
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setAuthData(null);
      localStorage.removeItem("authData");
      setIsLoggedIn(false);
      localStorage.removeItem("isAuthenticated");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="relative bg-[#3076c2] rounded-2xl p-6 overflow-hidden">
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative w-32 h-32 md:w-48 md:h-48 overflow-hidden flex-shrink-0">
                <img
                  src={imagePreview ||
                    (authData?.user?.ImageUrl ? `${config.baseURL}/${authData?.user?.ImageUrl}` :
                      (authData?.user?.Gender === 'Male' || authData?.user?.Gender === 'male' ?
                        "/src/assets/male.png" : "/src/assets/female.png"))
                  }
                  alt="Profile"
                  className="object-cover rounded-full w-full h-full"
                />
                {authData?.user?.role === "Mentor" && (
                  <label htmlFor="imageUpload" className="absolute top-0 right-0 p-2 bg-gray-700 bg-opacity-50 text-white rounded-full cursor-pointer">
                    <i className="fa fa-pencil-alt"></i>
                  </label>
                )}
                <input
                  type="file"
                  id="imageUpload"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="space-y-4 flex-grow">
                <div>
                  <label className="text-gray-400 text-sm">NAME</label>
                  <p className="text-white text-xl font-semibold">{authData?.user?.name || "No name provided"}</p>
                </div>
                {isLoggedIn && authData?.user?.role === "Mentor" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-gray-400 text-sm">CONTACT</label>
                      <p className="text-white text-xl">{authData?.user?.contact || "No contact provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 text-sm">COURSE</label>
                      <p className="text-white text-xl">{authData?.user?.course?.toUpperCase()}</p>
                    </div>
                  </>
                )}
                <div className="space-y-1">
                  <label className="text-gray-400 text-sm">HOSTEL</label>
                  <p className="text-white text-xl">{authData?.user?.hostel || "No hostel provided"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 text-sm">Role</label>
                  <p className="font-medium">{authData?.user?.role || "No role assigned"}</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm">Student ID</label>
                  <p className="font-medium">{authData?.user?.role === "user" ? authData?.user?.kerbrosId : authData?.user?.kerbros || "No ID provided"}</p>
                </div>
              </div>
              {isLoggedIn && authData?.user?.role === "Mentor" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Hours: {authData?.user?.hours}</p>
                  </div>
                  <div>
                    <p className="font-medium">Cluster: {authData?.user?.cluster}</p>
                  </div>
                </div>
              )}
              <div className="container flex flex-col sm:flex-row gap-8 justify-center">
                <button
                  onClick={logout}
                  className="mt-4 px-4 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>

                {/* Update Profile Button */}
                <button
                  onClick={() => navigate("/update-profile")}
                  className="mt-4 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Profile
                </button>

                {/* Logout from all devices */}
                <button
                  onClick={logoutFromAllDevices}
                  className="mt-4 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Logout from All Devices
                </button>

                {/* Update Password Button */}
                <button
                  onClick={() => navigate("/update-password")}
                  className="hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
