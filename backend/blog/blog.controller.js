const postModel = require("../post/post.model");
const categoryModel = require("../category/category.model");
const userModel = require("../user/user.model");
const { getPaginatedPosts, getPaginatedSearchPosts } = require("../utils/pagination");


exports.allPosts = async (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 1;

    const paginatedPosts = await getPaginatedPosts(page, limit)
    return res.json(paginatedPosts);
}

exports.categories = async (req, res) => {
    const allCategories = await categoryModel.find({}).lean();

    const mainCategories = allCategories.filter(cat => !cat.isSubCategory)

    const classifiedCategories = {};

    allCategories.map(cat => {
        if(cat.isSubCategory){
            mainCategories.map(mainCat => {
                classifiedCategories[mainCat.title] = []
                if(String(cat.mainCategory) === String(mainCat._id)){
                    classifiedCategories[mainCat.title].push(cat.title)
                }
            })
        }
    })    

    res.json(classifiedCategories);
}

exports.postsByCategory = async (req, res) => {
    const { href } = req.params;

    const category = await categoryModel.findOne({ href });
    if(!category) return res.status(404).json({ message: "Category not found" });

    const posts = await postModel.find({ category: category._id, status: "CONFIRM" })
    .select("-status -isDraft -createdAt -updatedAt")
    .populate("category", "title -_id");

    res.json(posts);
}

exports.postsByAuthor = async (req, res) => {
    const { username } = req.params;

    const user = await userModel.findOne({ username });
    if(!user) return res.status(404).json({ message: "User not found" });

    const posts = await postModel.find({ author: user._id, status: "CONFIRM" })
    .select("-status -isDraft -createdAt -updatedAt")
    .populate("category", "title -_id");

    res.json(posts);
}

exports.postsByTag = async (req, res) => {
    const { tag } = req.params;

    const posts = await postModel.find({ tags: { $all: [tag] } })
    .select("-status -isDraft -createdAt -updatedAt")
    .populate("category", "title -_id");

    res.json(posts);
}

exports.searchPosts = async (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 1;
    const query = req.query.query;

    const paginatedSearchPosts = await getPaginatedSearchPosts(page, limit, query)
    res.json(paginatedSearchPosts)
}


exports.postDetail = async (req, res) => {
    const { slug } = req.params;

    const post = await postModel.findOne({ slug, status: "CONFIRM" })
    .select("-status -isDraft -createdAt -updatedAt")
    .populate("author", "username firstName lastName -_id")
    .populate("category", "title -_id");

    if(!post) return res.status(404).json({ message: "Post not found" });
    
    res.json(post);
}
