const { Router } = require("express");

const blogController = require("./blog.controller");

const router = Router()

router.get('/posts', blogController.allPosts)
router.get('/posts/search', blogController.searchPosts)
router.get('/post/:slug', blogController.postDetail)
router.get('/categories', blogController.categories)
router.get('/posts/byCategory/:href', blogController.postsByCategory)
router.get('/posts/byAuthor/:username', blogController.postsByAuthor)
router.get('/posts/byTag/:tag', blogController.postsByTag)

module.exports = router