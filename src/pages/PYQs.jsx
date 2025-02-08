// import React, { useState } from "react";

// const PYQs = () => {
//   // State for input fields
//   const [course, setCourse] = useState("");
//   const [year, setYear] = useState("");
//   const [semester, setSemester] = useState("");

//   // State for loading, error, and fetched files
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [files, setFiles] = useState([]);

//   // Handle form submission to fetch files
//   const handleFetchFiles = async (e) => {
//     e.preventDefault();

//     if (!course || !year || !semester) {
//       alert("Please fill all fields to fetch files!");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`http://localhost:5000/api/pyqs?course=${course}&year=${year}&semester=${semester}`);

//       // Check if the response is successful
//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       // Check if the response is JSON
//       const contentType = response.headers.get("content-type");
//       if (contentType && contentType.includes("application/json")) {
//         const data = await response.json();
//         setFiles(data.files); // Store the files in state
//       } else {
//         throw new Error("Invalid response format. Expected JSON.");
//       }
//     } catch (err) {
//       setError(err.message || "Error fetching data");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div>
//       <h1>Fetch Past Year Question Papers (PYQs)</h1>

//       {/* Fetch Files Form */}
//       <form onSubmit={handleFetchFiles}>
//         <div>
//           <label htmlFor="course">Course:</label>
//           <input
//             type="text"
//             id="course"
//             value={course}
//             onChange={(e) => setCourse(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="year">Year:</label>
//           <input
//             type="text"
//             id="year"
//             value={year}
//             onChange={(e) => setYear(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="semester">Semester:</label>
//           <input
//             type="text"
//             id="semester"
//             value={semester}
//             onChange={(e) => setSemester(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" disabled={loading}>
//           {loading ? "Loading..." : "Fetch Files"}
//         </button>
//       </form>

//       {/* Error Handling */}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {/* Display Files */}
//       {files.length > 0 && (
//         <div>
//           <h2>Available Files:</h2>
//           <ul>
//             {files.map((file, index) => (
//               <li key={index}>
//                 {file.type === "pdf" ? (
//                   <a
//                     href={`/upload/${course}/${year}/${semester}/${file.name}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     {file.name}
//                   </a>
//                 ) : (
//                   <img
//                     src={`/upload/${course}/${year}/${semester}/${file.name}`}
//                     alt={file.name}
//                     style={{ width: "100px", height: "100px" }}
//                   />
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PYQs;





import React, { useState } from "react";
import Navbar from "../components/navbar";

const PYQs = () => {
    // State for input fields
    const [course, setCourse] = useState("");
    const [year, setYear] = useState("");
    const [semester, setSemester] = useState("");

    // State for loading, error, and fetched files
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);

    // Available courses
    const courses = [
        "MTL101", "MTL100", "COL100", "PYL101", "ELL101", "MCP100", "MCP101", "CML101", "APL100"
    ];

    // Handle form submission to fetch files
    const handleFetchFiles = async (e) => {
        e.preventDefault();

        if (!course || !year || !semester) {
            alert("Please fill all fields to fetch files!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:5000/api/pyqs?course=${course}&year=${year}&semester=${semester}`);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Check if the response is JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                setFiles(data.files); // Store the files in state
            } else {
                throw new Error("Invalid response format. Expected JSON.");
            }
        } catch (err) {
            setError(err.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setCourse("");
        setYear("");
        setSemester("");
        setFiles([]);
    };

    return (<><Navbar />
        <div className=" bg-[#FFF0E5] mx-auto p-8"><div className="container mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Past Year Question Papers</h1>
            <div className="container py-12 px-16 flex flex-row sm:flex-col">
                {/* Fetch Files Form */}
                <form onSubmit={handleFetchFiles} className=" flex flex-col justify-between space-y-6">
                    <div className="flex flex-row justify-between">
                        {/* Course Dropdown */}
                        <div className="w-full sm:w-[30%]">
                            <label htmlFor="course" className="text-lg font-semibold">Course:</label>
                            <select
                                id="course"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Course</option>
                                {courses.map((courseOption) => (
                                    <option key={courseOption} value={courseOption}>
                                        {courseOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Year Input */}
                        <div className="w-full sm:w-[30%]">
                            <label htmlFor="year" className=" text-lg font-semibold">Year :</label>
                            <input
                                type="text"
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                pattern="^\d{4}-\d{2}$"
                                title="Year format should be YYYY-YY"
                                placeholder="Format: 2023-24"
                                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        {/* Semester Input */}
                        <div className="w-full sm:w-[30%]">
                            <label htmlFor="semester" className="block text-lg font-semibold">Semester :</label>
                            <select
                                id="semester"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Semester</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>
                        </div>

                    </div>
                    <div className="flex justify-center">
                        {/* Apply and Reset Buttons */}
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-gray-500 mx-20 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                        >
                            Reset
                        </button>
                        <button type="submit" className="bg-blue-500 mx-20 text-white py-2 px-4 rounded-md hover:bg-blue-600" disabled={loading}>
                            {loading ? "Loading..." : "Apply"}
                        </button>

                    </div>
                </form>
            </div>

            {/* Error Handling */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            {/* Display Files */}
            {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                    {files.map((file, index) => {
                        const fileType = file.type === "pdf" ? "PDF" : "Image";
                        const fileUrl = `/upload/${course}/${year}/${semester}/${file.name}`;

                        const fileIcon =
                            fileType === "PDF" ? (
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                                    alt="PDF Icon"
                                    className="w-16 h-16 mx-auto"
                                />
                            ) : (
                                <img
                                    src={fileUrl}
                                    alt={file.name}
                                    className="w-16 h-16 object-cover mx-auto"
                                />
                            );

                        return (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
                                {/* Wrap the image or PDF icon in a download link */}
                                <a href={fileUrl} download>
                                    {fileIcon}
                                </a>
                                <h3 className="text-xl font-semibold text-center mt-4">{file.name}</h3>
                                <p className="text-center text-gray-500">{fileType}</p>
                            </div>
                        );
                    })}
                </div>
            )}

        </div> </div>
    </>);
};

export default PYQs;
