const multer = require('multer');

var fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
})

var upload = multer({storage: fileStorage});

module.exports = {
    upload: upload
}