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