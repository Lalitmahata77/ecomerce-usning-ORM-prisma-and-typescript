import path from "path";
import express, { Router, Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback, MulterError } from "multer";

const router: Router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, "uploads/"); // Save files in the "uploads" directory
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const extname = path.extname(file.originalname); // Get file extension
    cb(null, `${file.fieldname}-${Date.now()}${extname}`); // Generate unique filename
  },
});

// File filter configuration
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedFileTypes = /jpe?g|png|webp/; // Allowed file extensions
  const allowedMimeTypes = /image\/jpe?g|image\/png|image\/webp/; // Allowed MIME types

  const extname = path.extname(file.originalname).toLowerCase(); // Extract file extension
  const mimetype = file.mimetype; // Extract MIME type

  if (allowedFileTypes.test(extname) && allowedMimeTypes.test(mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only JPEG, PNG, and WEBP image formats are allowed")); // Reject file
  }
};

// Initialize Multer
const upload = multer({
  storage,
  fileFilter,
});

// Middleware for single file upload
const uploadSingleImage = upload.single("image");

// Route to handle image uploads
router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    uploadSingleImage(req, res, (err: unknown) => {
      if (err instanceof MulterError) {
        // Handle Multer errors (e.g., file size limits)
        return res.status(400).json({ message: `Multer Error: ${err.message}` });
      } else if (err instanceof Error) {
        // Handle custom file filter errors
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        // Handle case where no file was uploaded
        return res.status(400).json({ message: "No image file provided" });
      }

      // File uploaded successfully
      res.status(200).json({
        message: "Image uploaded successfully",
        image: `/${req.file.path}`,
      });
    });
  }
);

export default router;
