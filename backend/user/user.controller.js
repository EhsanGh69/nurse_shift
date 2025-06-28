const { isValidObjectId } = require("mongoose");

const userModel = require("./user.model");
const blockUserModel = require("./blockUser.model");


exports.getAll = async (req, res) => {
    const users = await userModel.find({})
        .select("-password -refreshToken -__v").lean();
    res.json(users)
}

exports.getOne = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(422).json({ message: "User id is not valid!" })
    }

    const user = await userModel.findById(id)
        .select("-password -refreshToken -__v").lean();

    if (!user) {
        return res.status(404).json({ message: "User not found!" })
    }

    res.json(user);
}

exports.blockUserHandler = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(422).json({ message: "User id is not valid!" })
    }

    const user = await userModel.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found!" })
    }

    const blockedUser = await blockUserModel.findOne({ user: user._id });

    if (req.url.includes("block_user")) {
        if (blockedUser) {
            return res.status(409).json({ message: "This user already blocked" })
        }

        await blockUserModel.create({ user: user._id });
        return res.status(201).json({ message: "User blocked successfully" })
    }else {
        await blockedUser.deleteOne()
        return res.json({ message: "User unblocked successfully" })
    }
}

