import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, filename);
    }
});

// File filter: only allow images and reject empty files
const fileFilter = (req, file, cb) => {
    if (!file) {
        return cb(new Error("No file provided"), false);
    }

    // Allowed extensions
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedTypes.test(ext)) {
        return cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"), false);
    }

    cb(null, true);
};

// Multer instance with limits and filter
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB max per image
    }
});
