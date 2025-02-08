// import React, { useState, useEffect } from "react";
// import { useAuth } from "/src/context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import config from "../config";

// const baseurl = `${config.baseURL2}`;

// export default function UpdateProfile() {
//   const { authData, setAuthData, setIsLoggedIn } = useAuth();
//   const navigate = useNavigate();

//   const [updatedDetails, setUpdatedDetails] = useState({
//     name: authData?.user?.name || "",
//     hostel: authData?.user?.hostel || "",
//     gender: authData?.user?.Gender || "",
//     avatar: authData?.user?.avatar || "",
//     contact: authData?.user?.contact || "", // Add contact field
//     cluster: authData?.user?.cluster || "", // Add cluster field
//   });

//   const [updateSuccess, setUpdateSuccess] = useState(false); // Track update success state
//   const [loading, setLoading] = useState(false); // Track loading state
//   const [error, setError] = useState(""); // Track error messages

//   useEffect(() => {
//     if (!authData) {
//       navigate("/login"); // Redirect to login if no user is authenticated
//     }
//   }, [authData, navigate]);

//   const updateProfile = async (e) => {
//     e.preventDefault();
//     setLoading(true); // Start loading

//     // Capitalize gender to ensure it's correctly formatted
//     const updatedDetailsWithCapitalGender = {
//       ...updatedDetails,
//       Gender: updatedDetails.gender.charAt(0).toUpperCase() + updatedDetails.gender.slice(1),
//     };

//     // Validate the cluster field (ensure it's a valid number between 1 and 4)
//     const validClusters = [1, 2, 3, 4];
//     const clusterValue = parseInt(updatedDetailsWithCapitalGender.cluster, 10);
//     if (!validClusters.includes(clusterValue)) {
//       setError("Enter Valid Cluster (1, 2, 3, or 4)");
//       setLoading(false);
//       return;
//     }

//     // Clear any existing error message
//     setError("");

//     const endpoint = authData?.user?.role === "user" ? "/user/" : "/mentor/";

//     try {
//       const response = await fetch(`${baseurl}${endpoint}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": authData?.token,
//         },
//         body: JSON.stringify({
//           ...updatedDetailsWithCapitalGender,
//           cluster: clusterValue, // Ensure cluster is a number, not a string
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Profile update failed");
//       }

//       const updatedData = await response.json();
//       setAuthData(updatedData); // Update the context with new data
//       localStorage.setItem("authData", JSON.stringify(updatedData)); // Update localStorage

//       // Show success message
//       setUpdateSuccess(true);
//       setLoading(false); // Stop loading

//       // After 3 seconds, log out from all devices
//       setTimeout(logoutFromAllDevices, 3000);
//     } catch (error) {
//       console.error("Profile Update Error:", error.message);
//       setLoading(false); // Stop loading
//     }
//   };

//   const logoutFromAllDevices = async () => {
//     const endpoint = authData?.user?.role === "user" ? "/user/logoutall" : "/mentor/logoutall";
//     try {
//       const response = await fetch(`${baseurl}${endpoint}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": authData?.token,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Logout from all devices failed");
//       }

//       // Clear user data and redirect to login after successful logout
//       setAuthData(null);
//       localStorage.removeItem("authData");
//       setIsLoggedIn(false);
//       localStorage.removeItem("isAuthenticated");
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout Error:", error.message);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedDetails((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

//         {updateSuccess && (
//           <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
//             Profile updated successfully! Please log in again.
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={updateProfile}>
//           <div className="space-y-4">
//             <div>
//               <label className="text-gray-500">Name</label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 name="name"
//                 value={updatedDetails.name || ""}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <label className="text-gray-500">Hostel</label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 name="hostel"
//                 value={updatedDetails.hostel || ""}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <label className="text-gray-500">Gender</label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 name="gender"
//                 value={updatedDetails.gender || ""}
//                 onChange={handleInputChange}
//               />
//             </div>

//             {/* Conditionally render the contact and cluster fields for mentors */}
//             {authData?.user?.role === "Mentor" && (
//               <>
//                 <div>
//                   <label className="text-gray-500">Contact</label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border rounded-lg"
//                     name="contact"
//                     value={updatedDetails.contact || ""}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-gray-500">Cluster</label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border rounded-lg"
//                     name="cluster"
//                     value={updatedDetails.cluster || ""}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { useAuth } from "/src/context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config";

const baseurl = `${config.baseURL2}`;

export default function UpdateProfile() {
  const { authData, setAuthData, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [updatedDetails, setUpdatedDetails] = useState({
    name: authData?.user?.name || "",
    hostel: authData?.user?.hostel || "",
    gender: authData?.user?.Gender || "",
    avatar: authData?.user?.avatar || "",
    contact: authData?.user?.contact || "", // Add contact field
    cluster: authData?.user?.cluster || "", // Add cluster field
  });

  const [updateSuccess, setUpdateSuccess] = useState(false); // Track update success state
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(""); // Track error messages

  useEffect(() => {
    if (!authData) {
      navigate("/login"); // Redirect to login if no user is authenticated
    }
  }, [authData, navigate]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Capitalize gender to ensure it's correctly formatted
    const updatedDetailsWithCapitalGender = {
      ...updatedDetails,
      Gender: updatedDetails.gender.charAt(0).toUpperCase() + updatedDetails.gender.slice(1),
      contact: Number(updatedDetails.contact),
    };

    // Validate the cluster field (ensure it's a valid number between 1 and 4) only for Mentors
    const validClusters = [1, 2, 3, 4];
    let clusterValue;
    if (authData?.user?.role === "Mentor") {
      clusterValue = parseInt(updatedDetailsWithCapitalGender.cluster, 10);
      if (!validClusters.includes(clusterValue)) {
        setError("Enter Valid Cluster (1, 2, 3, or 4)");
        setLoading(false);
        return;
      }
    }

    // Clear any existing error message
    setError("");

    const endpoint = authData?.user?.role === "user" ? "/user/" : "/mentor/";

    try {
      const payload = {
        ...updatedDetailsWithCapitalGender,
      };

      // Include the cluster field only for mentors
      if (authData?.user?.role === "Mentor") {
        payload.cluster = clusterValue;
      }

      const response = await fetch(`${baseurl}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authData?.token,
        },
        body: JSON.stringify(payload),
      });
      console.log(payload)


      if (!response.ok) {
        if (response.status == 401) {
          localStorage.clear()
          navigate("/login")
        }
        console.log(response)
        throw new Error("Profile update failed");

      }

      const updatedData = await response.json();
      setAuthData(updatedData); // Update the context with new data
      localStorage.setItem("authData", JSON.stringify(updatedData)); // Update localStorage

      // Show success message
      setUpdateSuccess(true);
      setLoading(false); // Stop loading

      // After 3 seconds, log out from all devices
      setTimeout(logoutFromAllDevices, 3000);
    } catch (error) {
      console.error("Profile Update Error:", error.message);
      setLoading(false); // Stop loading
    }
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
        throw new Error("Logout from all devices failed");
      }

      // Clear user data and redirect to login after successful logout
      setAuthData(null);
      localStorage.removeItem("authData");
      setIsLoggedIn(false);
      localStorage.removeItem("isAuthenticated");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

        {updateSuccess && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
            Profile updated successfully! Please log in again.
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={updateProfile}>
          <div className="space-y-4">
            <div>
              <label className="text-gray-500">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                name="name"
                value={updatedDetails.name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-gray-500">Hostel</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                name="hostel"
                value={updatedDetails.hostel || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-gray-500">Gender</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                name="gender"
                value={updatedDetails.gender || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* Conditionally render the contact and cluster fields for mentors */}
            {authData?.user?.role === "Mentor" && (
              <>
                <div>
                  <label className="text-gray-500">Contact</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    name="contact"
                    value={updatedDetails.contact || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-gray-500">Cluster</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    name="cluster"
                    value={updatedDetails.cluster || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
