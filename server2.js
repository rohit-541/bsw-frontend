import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
const app = express();








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

// Middleware to parse JSON bodies
app.use(cors({
  origin: 'http://localhost:5173',  // Allow only this specific origin (your frontend)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific methods (optional)
}));

// Middleware for parsing incoming JSON data
app.use(express.json());  // To parse JSON data
app.use(express.urlencoded({ extended: true }));  // To parse URL-encoded data

// Handle the POST request to upload the file
app.post('/upload', upload.single('file'), (req, res) => {
  // Access the form fields after file upload
  const { course, year, semester, paperType } = req.body;

  if (!course || !year || !paperType || !req.file) {
    return res.status(400).send("Please fill in all fields and choose a file.");
  }

  // Now that we have the data, we can rename the file accordingly
  const ext = path.extname(req.file.originalname);
  const newFileName = ` ${course}_${year}__${semester}_${paperType}${ext}`;

  // Rename the uploaded file
  const oldPath = path.join('upload', req.file.filename);
  const newPath = path.join('upload', newFileName);

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      return res.status(500).send("Error renaming the file.");
    }
    res.send("File uploaded successfully!");
  });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});