const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

const postModel = require("../post/post.model");


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

exports.removePrevPostImage = async (req, res, next) => {
    const slug = req.params.slug;
    const postImagesPath = path.join(__dirname, '..', 'public', 'images', 'posts')

    fs.readdir(postImagesPath, (err, files) => {
        if(err) throw err;

        files.forEach(file => {
            if(file.startsWith(slug)){
                fs.unlink(path.join(postImagesPath, file), (err) => {
                    if(err) {
                        console.log("Error in remove file: ", file);
                        throw err;
                    }
                })
            }
        })
    })
    next();
}
