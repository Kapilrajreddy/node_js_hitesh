const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const sharp = require("sharp");

// Set up multer for handling file uploads
const upload = multer({ dest: "uploads/" });

app.use("/uploads", express.static("uploads"));


// Create thumbnails directory if it doesn't exist
const thumbnailsDir = path.join(__dirname, "thumbnails");
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir);
}

// POST /api/upload: Accepts multipart/form-data requests containing images
// POST /api/upload: Accepts multipart/form-data requests containing images
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const filename = req.file.filename;
        const originalImagePath = path.join(__dirname, 'uploads', filename);
        const thumbnailFilename = `${uuidv4()}-thumbnail.jpg`;
        const thumbnailImagePath = path.join(__dirname, 'thumbnails', thumbnailFilename);

        console.log(thumbnailImagePath, "thumbnailImagePath");

        // Generate thumbnail image (100x100 pixels)
        await sharp(originalImagePath)
            .resize(100, 100)
            .toFile(thumbnailImagePath, (err) => {
                if (err) {
                    console.error('Error generating thumbnail:', err);
                    return res.status(500).json({ message: 'Error generating thumbnail' });
                }
            });

        res.status(200).json({ message: 'Image uploaded and thumbnail generated successfully' });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// GET /thumbnails/:filename: Retrieves the thumbnail image corresponding to the original image
app.get("/thumbnails/:filename", (req, res) => {
  const thumbnailFilename = req.params.filename;
  const thumbnailImagePath = path.join(thumbnailsDir, thumbnailFilename);

  // Check if the thumbnail image exists
  fs.access(thumbnailImagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }

    // Send the thumbnail image
    res.sendFile(thumbnailImagePath);
  });
});

// Set up server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
