const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure uploads directory exists
const uploadDir = path.resolve(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); //path to save uploaded images
  },
  filename: function (req, file, cb) {
    console.log(req.params);
    let filename;
    if (req.params.me_id) {
      filename = req.params.me_id + path.extname(file.originalname);
    } else {
      filename = req.params.users_id + path.extname(file.originalname);
    }

    cb(null, filename);
  },
});

//Initialise upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("userProfile");

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

module.exports = upload;
