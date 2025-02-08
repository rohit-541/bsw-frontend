import React, { useState } from "react";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [course, setCourse] = useState("");
    const [semester, setSemester] = useState("");
    const [year, setYear] = useState("");
    const [paperType, setPaperType] = useState("");
    const [securityKey, setSecurityKey] = useState("");
    const [message, setMessage] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const courses = [
        "MTL101", "MTL100", "COL100", "PYL101", "ELL101", "MCP100", "MCP101", "CML101", "APL100"
    ];

    const paperTypes = ["Minor1","Minor1-Solutions", "Minor2","Minor2-Solutions", "Major", "Major-Solutions"];

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !course || !semester || !year || !paperType) {
            setMessage("Please fill in all fields and choose a file.");
            return;
        }

        if (!/^\d{4}-\d{2}$/.test(year)) {
            setMessage("Please enter the year in the format 2023-24.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("course", course);
        formData.append("semester", semester);
        formData.append("year", year);
        formData.append("paperType", paperType);

        // Log the formData to see if it has the required fields
        console.log("FormData: ", formData);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.text();
            setMessage(data); // Show success or error message

            // Reset the form fields after successful submission
            setCourse("");
            setSemester("");
            setYear("");
            setPaperType("");
            setFile(null);
        } catch (error) {
            setMessage("Error uploading the file.");
        }
    };

    const handleAuthentication = () => {
        if (securityKey === "BSW@202425") {
            setIsAuthenticated(true);
        } else {
            setMessage("Invalid security key.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            {!isAuthenticated ? (
                <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold text-center mb-4">Enter Security Key</h2>
                    <input
                        type="password"
                        value={securityKey}
                        onChange={(e) => setSecurityKey(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mb-4"
                        placeholder="Enter security key"
                    />
                    <button
                        onClick={handleAuthentication}
                        className="w-full p-3 bg-blue-500 text-white rounded"
                    >
                        Authenticate
                    </button>
                    {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
                </div>
            ) : (
                <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                    <h2 className="text-xl font-bold text-center mb-4">Upload Question Paper</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Course</label>
                            <select
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
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

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Year</label>
                            <input
                                type="text"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="e.g. 2023-24"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Semester</label>
                            <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            >
                                <option value="">Select Semester</option>
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Paper Type</label>
                            <select
                                value={paperType}
                                onChange={(e) => setPaperType(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            >
                                <option value="">Select Paper Type</option>
                                {paperTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Choose File</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded"
                        >
                            Upload
                        </button>
                    </form>
                    {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
