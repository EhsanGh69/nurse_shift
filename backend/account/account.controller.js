const userModel = require('../user/user.model');

exports.changePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    
    const user = req.user;

    const verifyOldPassword = await user.verifyPassword(oldPassword);
    if(!verifyOldPassword)
        return res.status(401).json({ message: "رمز عبور فعلی شما اشتباه وارد شده است" })

    user.password = newPassword;
    await user.save()

    res.json({ message: "Your password changed successfully" })
}

exports.editAccount = async (req, res) => {
    const { firstName, lastName, mobile } = req.body;

    const user = await userModel.findByIdAndUpdate(req.user._id, {
        firstName, lastName, mobile
    });

    if(req.file){
        user.avatar = `/images/avatars/${req.file.filename}`
        await user.save()
    }

    return res.json(user)
}

exports.removeAvatar = async (req, res) => {
    await userModel.findByIdAndUpdate(req.user._id, {
        $set: { avatar: '' }
    });

    res.json({ message: "User avatar removed successfully" })
}