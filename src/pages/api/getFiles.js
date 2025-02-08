import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { course, year, semester } = req.query;
  if (!course || !year || !semester) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const directoryPath = path.join(process.cwd(), "upload", course, year, semester);

  if (!fs.existsSync(directoryPath)) {
    return res.status(404).json({ error: "Directory not found" });
  }

  try {
    const files = fs.readdirSync(directoryPath).map((file) => ({
      name: file,
      type: file.endsWith(".pdf") ? "pdf" : "image",
    }));
    return res.status(200).json({ files });
  } catch (error) {
    return res.status(500).json({ error: "Error reading files" });
  }
}
