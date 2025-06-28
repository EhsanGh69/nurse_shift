const gravatar = require("gravatar");

const { changePasswordValidator } = require("../validators/changePassword");
const editAccountValidator = require("../validators/editAccount");

exports.changePassword = async (req, res) => { 
    const validationResult = changePasswordValidator(req.body)
    if (validationResult !== true) {
        return res.status(422).json(validationResult)
    }

    const {oldPassword, newPassword} = req.body;

    const user = req.user;

    const checkPassword = await user.verifyPassword(oldPassword);
    if(!checkPassword) {
        return res.status(401).json({ message: "Your old password is wrong" })
    }

    user.password = newPassword;
    await user.save()

    res.json({ message: "Your password changed successfully"})
}

exports.accountInfo = async (req, res) => { 
    const user = req.user;

    res.json({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
    })
}

exports.editAccount = async (req, res) => {
    const validationResult = editAccountValidator(req.body)
    if (validationResult !== true) {
        return res.status(422).json(validationResult)
    }

    const { email, firstName, lastName } = req.body;
    const user = req.user;
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    await user.save()

    res.json({ message: "Your account info edited successfully" })
 }

exports.changeAvatar = async (req, res) => {
    if(!req.file){
        return res.status(400).json({ message: "No file uploaded" })
    }

    const user = req.user;
    const avatarUrl = `/images/avatars/${req.file.filename}`
    user.avatar = avatarUrl;
    await user.save();

    return res.json({ message: "Avatar changed successfully" })
}

exports.removeAvatar = async (req, res) => {
    const user = req.user;
    user.avatar = gravatar.url(user.email, { s: '80', d: 'monsterid', r: 'g' }, true);
    await user.save();

    return res.json({ message: "Avatar removed successfully" })
}
