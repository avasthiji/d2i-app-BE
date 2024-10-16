const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure uploads directory exists
const uploadDir = path.resolve(process.env.UPLOAD_DIR);

const fileUploadDir = path.resolve(process.env.UPLOAD_FILE);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(fileUploadDir)) {
  fs.mkdirSync(fileUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "userProfile") {
      cb(null, uploadDir);
    } else if (file.fieldname === "uploadFile") {     
      cb(null, fileUploadDir);
    }
  },
  filename: function (req, file, cb) {
    let filename;
    if (file.fieldname === "userProfile") {
      if (req.params.me_id) {
        filename = req.params.me_id + path.extname(file.originalname);
      } else {
        filename = req.params.users_id + path.extname(file.originalname);
      }
    } else if (file.fieldname === "uploadFile") {
      filename = file.originalname;
    }

    cb(null, filename);
  },
});

//Initialise upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, //file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  { name: "userProfile", maxCount: 1 },
  { name: "uploadFile", maxCount: 1 },
]);

// Check file type
function checkFileType(file, cb) {
  if (file.fieldname === "userProfile") {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  } else if (file.fieldname === "uploadFile") {
    return cb(null, true);
  }
}

module.exports = upload;
