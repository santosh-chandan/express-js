import multer from "multer";
import path from "path";

// Configure storage
// cb (callback) given by multer once it process internally then give us to write own logic to custom process.

// Multer calls your functions like this internally:
// destination(req, file, cb)
// filename(req, file, cb)
// fileFilter(req, file, cb)

// req → the incoming HTTP request
// file → file object containing details about uploaded file
// (e.g., originalname, mimetype, size, etc.)
// cb → a callback function that you must call to tell Multer what to do

// The first argument (null) means no error.
// The second argument (value) is the result that Multer should use.

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
