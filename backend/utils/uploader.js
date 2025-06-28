const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const multer = require("multer");

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'public', 'images', 'avatars')
        if(!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true })
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const username = req.user.username;
        const timestamp = Date.now()
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${username}_${timestamp}${ext}`);
    }
})

const postImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'public', 'images', 'posts')
        if(!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true })
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const slug = req.params.slug;
        const fieldName = file.fieldname;
        const randomStr = crypto.randomBytes(3).toString("hex");
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${slug}_${fieldName}_${randomStr}${ext}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if(!allowedTypes.includes(file.mimetype))
        return cb(new Error('File type is not valid.'), false)
    cb(null, true);
}

exports.avatarUploader = multer({ 
    storage: avatarStorage, 
    fileFilter, 
    limits: { fileSize: 200 * 1024 } 
})

exports.postImageUploader = multer({
    storage: postImageStorage,
    fileFilter,
    limits: { fieldSize: 200 * 1024 }
})
