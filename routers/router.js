const AdminController = require("../controllers/admin")
const ClientController = require("../controllers/client")
const adminAuthentication = require("../middlewares/authentication")

const router = require("express").Router()

router.post("/login", AdminController.login)
router.post("/register", AdminController.register)
router.get("/public/posts", ClientController.findAllPosts)
router.get("/public/posts/:slug", ClientController.findPostBySlug)

router.use(adminAuthentication)
router.get("/posts", AdminController.findAllPosts)
router.get("/posts/:slug", AdminController.findPostBySlug)
router.post("/posts", AdminController.createPost)
router.delete("/posts/:id", AdminController.deletePost)
router.put("/posts/:slug", AdminController.updatePost)

router.get("/categories", AdminController.findCategory)
router.get("/categories/:id", AdminController.findCategoryById)
router.post("/categories", AdminController.createCategory)
router.delete("/categories/:id", AdminController.deleteCategory)
router.put("/categories/:id", AdminController.updateCategory)

module.exports = router
