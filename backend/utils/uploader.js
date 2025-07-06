const path = require("path");
const fs = require("fs");

const multer = require("multer");

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'public', 'images', 'avatars')
        if(!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true })
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const nationalCode = req.user.nationalCode;
        const timestamp = Date.now()
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${nationalCode}_${timestamp}${ext}`);
    }
})


const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if(!allowedTypes.includes(file.mimetype))
        return cb(new Error('File type is not valid'), false)
    cb(null, true);
}

exports.avatarUploader = multer({ 
    storage: avatarStorage, 
    fileFilter, 
    limits: { fileSize: 200 * 1024 } 
})
