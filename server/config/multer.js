const multer = require('multer');
const { v4: uuid } = require('uuid');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const maxSize= 3 * 1024 * 1024;// 3 MB (max file size)

//storing image on disk
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images');
  },
  filename: (req, file, callback) => {
    const name = uuid();//using uuid as unique file name
    const extension = MIME_TYPES[file.mimetype];//retrieving file extension
    callback(null, name + '.' + extension);//unique file name to store on disk
  }

});

module.exports = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, callback) => {
    if (file.mimetype in MIME_TYPES) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }}).single('image');//storing an image file