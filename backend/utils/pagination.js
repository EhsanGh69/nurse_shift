const postModel = require("../post/post.model");

exports.getPaginatedPosts = async (page, limit) => {
    const posts = await postModel.find({ status: 'CONFIRM' })
    .select("-status -isDraft -createdAt -updatedAt")
    .populate("author", "username", "firstName", "lastName", "avatar")
    .populate("category", "title")
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))

    const totalCount = await postModel.find({ status: 'CONFIRM' }).countDocuments()
    return { 
        posts, 
        totalPages: Math.ceil(totalCount / Number(limit)), 
        currentPage: Number(page) 
    }
}

exports.getPaginatedSearchPosts = async (page, limit, query) => {
    const regex = new RegExp(query, 'i') // Case-insensitive

    const postsData = await postModel.aggregate([
        { $match: { status: 'CONFIRM' } },

        // Populate category
        { $lookup: { 
            from: "categories", // collection name
            localField: "category",
            foreignField: '_id',
            as: 'category'
        }},
        { $unwind: "$category" },

        // Populate author
        { $lookup: { 
            from: "users", // collection name
            localField: "author",
            foreignField: '_id',
            as: 'author'
        }},
        { $unwind: "$author" },

        // Search filters
        { $match: {
            $or: [
                { title: regex },
                { content: regex },
                { tags: regex },
                { 'category.title': regex }
            ]
        }},

        // Remove extra fields
        { $project: {
            status: 0, isDraft:0, createdAt: 0, updatedAt: 0,
            'category._id': 0, 'category.__v': 0, 
            'category.isSubCategory': 0, 'category.mainCategory': 0,
            'category.href': 0, 'author._id': 0, 'author.__v': 0,
            'author.email': 0, 'author.password': 0, 'author.isActive': 0,
            'author.isStaff': 0, 'author.isSuperuser': 0, 'author.role': 0,
            'author.dateJoined': 0, 'author.refreshToken': 0, 'author.lastLogin': 0
        }},

        // Pagination
        { $facet: {
            posts: [
                { $skip: (Number(page) - 1) * Number(limit) },
                { $limit: Number(limit) }
            ],
            totalCount: [
                { $count: 'count' }
            ]
        }}
    ])

    return { 
        posts: postsData[0].posts,
        totalCount: postsData[0].totalCount[0]?.count || 0,
        currentPage: Number(page)
    }
}