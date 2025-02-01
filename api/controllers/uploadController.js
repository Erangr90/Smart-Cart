import path from 'path';
import multer from 'multer';
import asyncHandler from "../middleware/asyncHandler.js";

// Where and how save the file
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    if (!file) {
      throw new Error("File not found");
    }
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});


// File types filter for Images
function fileFilter(req, file, cb) {
  try {
    if (!file) {
      cb(new Error("File not found"), false);
    }
    const filetypes = /jpe?g|png|webp|avif/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp|avif/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Images only!'), false);
    }

  } catch (error) {
    throw new Error(error.message);
  }

}

// Upload file object
const upload = multer({ storage, fileFilter });
// Upload single file as image function
const uploadSingleImage = upload.single('image');


// @desc    upload Image
// @route   POST  /uploadImag
// @access  Admin
const uploadImg = asyncHandler(async (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      res.status(400);
      throw new Error(err.message);
      // return res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: 'Image uploaded successfully',
      image: `/${req.file.path}`,
    });
  });
});

export {
  uploadImg
}



