import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/../public/recipe/"));
  },

  filename: (req, file, cb) => {
    cb(
      null,
      "recipe" + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});


const uploader = multer({ storage }).any();

export { uploader };
