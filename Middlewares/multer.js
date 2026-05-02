import multer from "multer";

const storage = multer.memoryStorage();
console.log("multer");

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  } else {
    return cb(new Error("Only image file is allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1012 * 1012 }, // maximum size of file
});

export default upload