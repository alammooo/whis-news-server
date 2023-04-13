const { User, Tag, Category, Post } = require("../models")

class ClientController {
  static async findAllPosts(req, res, next) {
    try {
      const options = {
        include: [
          {
            model: Tag,
            attributes: ["name"],
          },
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      }
      const findPost = await Post.findAll(options)

      res.status(200).json({ data: findPost })
    } catch (error) {
      next(error)
    }
  }

  static async findPostBySlug(req, res, next) {
    try {
      const { slug } = req.params
      const options = {
        where: { slug: slug },
        include: [
          {
            model: Tag,
            attributes: ["name"],
          },
          {
            model: Category,
            attributes: ["name"],
          },
          {
            model: User,
            attributes: ["email"],
          },
        ],
      }
      const findPost = await Post.findOne(options)
      if (!findPost) throw { name: "notFoundPost" }

      res.status(200).json({ data: findPost })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = ClientController
