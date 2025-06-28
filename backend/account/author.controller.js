// const { isValidObjectId } = require("mongoose");

const postModel = require("../post/post.model");
const postImageModel = require("../post/postImage.model");
const createPostValidator = require("../validators/createPost");


exports.createPost = async (req, res) => {
    const validationResult = createPostValidator(req.body);
    if (validationResult !== true) {
        return res.status(422).json(validationResult)
    }

    const user = req.user;
    const { title, content } = req.body;

    const similarPost = await postModel.findOne({ title })
    if (similarPost) {
        return res.status(409).json({ message: "There is a post with this title" })
    }

    await postModel.create({
        title,
        content,
        author: user._id
    })

    if (user.role === 'USER') {
        user.role = 'AUTHOR'
        await user.save()
    }

    res.status(201).json({ message: "Your post created successfully!" })
}

exports.editPost = async (req, res) => {
    const { slug } = req.params

    const validationResult = createPostValidator(req.body);
    if (validationResult !== true) {
        return res.status(422).json(validationResult)
    }

    const user = req.user;
    const { title, content } = req.body;

    const similarPost = await postModel.findOne({ title })
    if (similarPost) {
        return res.status(409).json({ message: "There is a post with this title" })
    }

    const foundPost = await postModel.findOneAndUpdate({ slug, author: user._id, isDraft: true }, {
        $set: { title, content }
    })

    if (!foundPost) {
        return res.status(404).json({ message: "Post not found" })
    }

    res.json({ message: "Your post edited successfully" })
}

exports.changePostImage = async (req, res) => {
    if (!req.files)
        return res.status(400).json({ message: "No file to upload" })

    if (!req.files.cover)
        return res.status(400).json({ message: "Cover image is required" })

    const coverUrl = `/images/posts/${req.files.cover[0].filename}`;

    const contentUrls = []
    if (req.files.content)
        req.files.content.map(file => contentUrls.push(`/images/posts/${file.filename}`))

    const { slug } = req.params;
    const post = await postModel.findOne({ slug })
    if (!post)
        return res.status(404).json({ message: "Post not found" })

    const postImage = await postImageModel.findOneAndUpdate({ post: post._id }, {
        $set: {
            cover: coverUrl,
            content: contentUrls
        }
    })

    if (!postImage) {
        await postImageModel.create({
            post: post._id,
            cover: coverUrl,
            content: contentUrls
        })
    }

    res.json({ message: "Post images changed successfully" })
}

exports.removePost = async (req, res) => {
    const { slug } = req.params;
    const post = await postModel.findOneAndDelete({ author: req.user._id, slug, isDraft: true })
    if (!post)
        return res.status(404).json({ message: "Post not found" })

    res.json({ message: "Draft post removed successfully" })
}

exports.checkRequest = async (req, res) => {
    const { slug } = req.params;
    const post = await postModel.findOneAndUpdate({ author: req.user._id, slug, isDraft: true }, {
        $set: { isDraft: false }
    })
    if (!post)
        return res.status(404).json({ message: "Post not found" })

    res.json({ message: "Post sended to check successfully" })
}
