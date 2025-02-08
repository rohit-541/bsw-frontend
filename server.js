// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import cors from 'cors';

// const app = express();

// app.use(express.json());  // To parse JSON data
// app.use(express.urlencoded({ extended: true }));  // To parse URL-encoded data

// // Storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Ensure the upload directory exists
//     const uploadDir = path.resolve('upload');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir); // Save files in the /upload directory
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname); // Get file extension
//     const newFileName = `${Date.now()}${ext}`; // Create a unique file name using timestamp
//     cb(null, newFileName); // Save the file with the new name
//   }
// });
// const upload = multer({ storage });

// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));


// // Handle the POST request to upload the file
// app.post('/upload', upload.single('file'), (req, res) => {
//   const { course, year, semester, paperType } = req.body;

//   if (!course || !year || !semester || !paperType || !req.file) {
//     return res.status(400).send("Please fill in all fields and choose a file.");
//   }

//   // Set new file name based on the provided fields
//   const ext = path.extname(req.file.originalname);
//   const newFileName = `${course}_${year}__${semester}_${paperType}${ext}`;

//   // Define the target folder path
//   const targetDir = path.join('upload', course, year, semester);
  
//   // Ensure the target directory exists
//   if (!fs.existsSync(targetDir)) {
//     fs.mkdirSync(targetDir, { recursive: true }); // Create directories if they don't exist
//   }

//   // Define the old and new file paths
//   const oldPath = path.join('upload', req.file.filename);
//   const newPath = path.join(targetDir, newFileName);

//   // Rename and move the uploaded file
//   fs.rename(oldPath, newPath, (err) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).send("Error renaming or moving the file.");
//     }
//     res.send("File uploaded and moved successfully!");
//   });
// });

// // Start the server
// const port = 5000;
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();

app.use(express.json());  // To parse JSON data
app.use(express.urlencoded({ extended: true }));  // To parse URL-encoded data

// Storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the upload directory exists
    const uploadDir = path.resolve('upload');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); // Save files in the /upload directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const newFileName = `${Date.now()}${ext}`; // Create a unique file name using timestamp
    cb(null, newFileName); // Save the file with the new name
  }
});

const upload = multer({ storage });

// Enable CORS for front-end communication
app.use(cors({
  origin: 'http://localhost:5173',  // Change this to your front-end URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// POST route to upload a file
app.post('/upload', upload.single('file'), (req, res) => {
  const { course, year, semester, paperType } = req.body;

  if (!course || !year || !semester || !paperType || !req.file) {
    return res.status(400).send("Please fill in all fields and choose a file.");
  }

  // Set new file name based on the provided fields
  const ext = path.extname(req.file.originalname);
  const newFileName = `${course}_${year}_${semester}_${paperType}${ext}`;

  // Define the target folder path
  const targetDir = path.join('upload', course, year, semester);

  // Ensure the target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true }); // Create directories if they don't exist
  }

  // Define the old and new file paths
  const oldPath = path.join('upload', req.file.filename);
  const newPath = path.join(targetDir, newFileName);

  // Rename and move the uploaded file
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error renaming or moving the file.");
    }
    res.send("File uploaded and moved successfully!");
  });
});

// GET route to fetch files based on course, year, and semester
// GET route to fetch files based on course, year, and semester
app.get('/api/pyqs', (req, res) => {
  const { course, year, semester } = req.query;

  // Check if all required query parameters are provided
  if (!course || !year || !semester) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  // Define the path to the requested directory
  const directoryPath = path.resolve('upload', course, year, semester);

  // Check if the directory exists
  if (!fs.existsSync(directoryPath)) {
    return res.status(404).json({ error: "Directory not found" });
  }

  try {
    // Read the directory and map the files to return the file info
    const files = fs.readdirSync(directoryPath).map((file) => ({
      name: file,
      type: file.endsWith(".pdf") ? "pdf" : "image",
      path: path.join(directoryPath, file), // Include the full path of the file
    }));

    // If no files are found, return a message
    if (files.length === 0) {
      return res.status(200).json({ message: "No files found for the given course, year, and semester" });
    }

    // Return the list of files as JSON
    return res.status(200).json({ files });
  } catch (error) {
    // Handle any errors when reading the directory
    console.error(error);
    return res.status(500).json({ error: "Error reading files" });
  }
});


// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
