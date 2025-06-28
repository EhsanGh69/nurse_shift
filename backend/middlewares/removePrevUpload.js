const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");


exports.removePrevAvatar = async (req, res, next) => {
    const user = req.user;
    if(user.avatar && !user.avatar.includes('gravatar.com')){
        const fileName = path.basename(user.avatar)
        const prevAvatarPath = path.join(__dirname, '..', 'public', 'images', 'avatars', fileName);
        try {
            await fsPromise.access(prevAvatarPath);
            await fsPromise.unlink(prevAvatarPath);
        } catch (error) {
            if(error.code !== 'ENOENT')
                throw error;
        }
    }
    next();
}
