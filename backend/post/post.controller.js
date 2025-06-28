const { isValidObjectId } = require("mongoose");

const postModel = require("./post.model");
const categoryModel = require("../category/category.model");
const confirmPostValidator = require("../validators/confirmPost");


const getPaginatedPosts = async (page, limit, status) => {
    let statusPosts = [];
    let statusCount = 0;

    if (status === "check") {
        statusPosts = await postModel.find({ status: 'CHECK' }).skip((page - 1) * limit).limit(limit)
        statusCount = await postModel.find({ status: 'CHECK' }).countDocuments()
    }
    else if (status === "confirm") {
        statusPosts = await postModel.find({ status: 'CONFIRM' }).populate("category", "title")
            .skip((page - 1) * limit).limit(limit)
        statusCount = await postModel.find({ status: 'CONFIRM' }).countDocuments()
    }
    else {
        statusPosts = await postModel.find({ status: 'REJECT' }).populate("category", "title")
            .skip((page - 1) * limit).limit(limit)
        statusCount = await postModel.find({ status: 'REJECT' }).countDocuments()
    }

    return { posts: statusPosts, totalPages: Math.ceil(statusCount / limit), currentPage: page }
}

exports.postsList = async (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 1;

    let paginatedPosts = [];

    if (req.url.includes("check"))
        paginatedPosts = await getPaginatedPosts(page, limit, 'check')
    else if (req.url.includes("confirm"))
        paginatedPosts = await getPaginatedPosts(page, limit, 'confirm')
    else
        paginatedPosts = await getPaginatedPosts(page, limit, 'reject')

    return res.json(paginatedPosts);
}

exports.viewPost = async (req, res) => {
    const { slug } = req.params;

    const post = await postModel.findOne({ slug });

    if (!post) {
        return res.status(404).json({ message: "Post not found!" })
    }

    res.json(post)
}

exports.confirmPost = async (req, res) => {
    const validationResult = confirmPostValidator(req.body)
    if (validationResult !== true) {
        res.status(422).json(validationResult)
    }

    const { slug } = req.params;
    const { category, studyTime, tags } = req.body;

    const categoryExist = await categoryModel.findById(category)
    if (!categoryExist) {
        return res.status(404).json({ message: "Category not found!" })
    }

    const post = await postModel.findOne({ slug })

    if (!post) {
        return res.status(404).json({ message: "Post not found!" })
    } 
    else if (post.status !== 'CHECK') {
        return res.status(409).json({ message: "This post already confirmed or rejected!" })
    }
    else if (post.isDraft) {
        return res.status(409).json({ message: "This post is a draft" })
    }

    await postModel.findOneAndUpdate({ slug }, {
        $set: { category, studyTime, confirmDate: new Date(), status: 'CONFIRM', tags }
    })

    return res.json({ message: "Post confirmed successfully" })
}

exports.rejectPost = async (req, res) => { }

exports.removePost = async (req, res) => { }