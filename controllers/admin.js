const { comparePassword } = require("../helpers/bcrypt")
const { signToken } = require("../helpers/jwt")
const { User, Tag, Category, Post, sequelize } = require("../models")
const sluggy = require("../helpers/slugify")

class AdminController {
  static async register(req, res, next) {
    try {
      const { username, email, password, role = "admin", phoneNumber, address } = req.body

      const registerUser = await User.create({
        username,
        email,
        password,
        role,
        phoneNumber,
        address,
      })

      res.status(200).json({
        message: `Successfully register user with email : ${registerUser.email}`,
      })
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) throw { name: "userNotFound" }

      const options = {
        where: { email },
      }
      const findUser = await User.findOne(options)
      if (!findUser) {
        throw {
          name: "userNotFound",
        }
      } else {
        const comparePass = comparePassword(password, findUser.password)
        if (!comparePass) throw { name: "userNotFound" }
        else {
          const access_token = signToken(findUser.id)
          res.status(200).json({ access_token: access_token })
        }
      }
    } catch (error) {
      next(error)
    }
  }
  static async findAllPosts(req, res, next) {
    try {
      const options = {
        order: [["updatedAt", "DESC"]],
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
      const data = await Post.findAll(options)

      res.status(200).json({ data: data })
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

  static async createPost(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        let slug = ""
        const authorId = req.user.id
        const { title, content, imgUrl, categoryId, name } = req.body
        if (title) {
          slug = sluggy(title)
        }

        const createPost = await Post.create(
          {
            title,
            slug,
            content,
            imgUrl,
            categoryId,
            authorId,
          },
          { transaction: t }
        )
        const postId = createPost.id
        const tagName = name.split(",").map((el) => {
          return { postId, name: el }
        })

        await Tag.bulkCreate(tagName, { transaction: t })

        const findPost = await Post.findByPk(postId, {
          include: {
            model: Tag,
            attributes: ["name"],
          },
          transaction: t,
        })
        res.status(201).json({ data: findPost })
      })
    } catch (error) {
      next(error)
    }
  }

  static async updatePost(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const { title, content, imgUrl, categoryId, name } = req.body
        let { slug } = req.params
        if (title) slug = sluggy(title)

        const findPost = await Post.findOne({
          where: {
            slug: slug,
          },
          transaction: t,
        })
        if (!findPost) throw { name: "notFoundPost" }

        await findPost.update(
          {
            title,
            slug,
            content,
            imgUrl,
            categoryId,
          },
          { transaction: t }
        )
        const postId = findPost.id
        const tagName = name.split(",").map((el) => {
          return { postId, name: el }
        })
        await Tag.bulkCreate(tagName, {
          updateOnDuplicate: ["postId", "name"],
          transaction: t,
        })
        res.status(200).json({
          message: `Successfully update Post with name : ${findPost.title}`,
        })
      })
    } catch (error) {
      next(error)
    }
  }

  static async deletePost(req, res, next) {
    try {
      const { id } = req.params
      await sequelize.transaction(async (t) => {
        const findPost = await Post.findByPk(id, { transaction: t })
        if (!findPost) throw { name: "notFoundPost" }

        await findPost.destroy({ transaction: t })
        res.status(200).json({ message: `Succesfully delete post ${findPost.title}` })
      })
    } catch (error) {
      next(error)
    }
  }

  /* Category */
  static async findCategory(req, res, next) {
    try {
      const options = {
        order: [["updatedAt", "DESC"]],
      }
      const category = await Category.findAll(options)
      res.status(200).json({ data: category })
    } catch (error) {
      next(error)
    }
  }

  static async findCategoryById(req, res, next) {
    try {
      const { id } = req.params
      const findCategory = await Category.findByPk(id)

      res.status(200).json({ data: findCategory })
    } catch (error) {
      next(error)
    }
  }

  static async createCategory(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const { name } = req.body
        const create = await Category.create({ name }, { transaction: t })

        res.status(200).json({
          message: `Successfully created category with name : ${create.name}`,
        })
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateCategory(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const { id } = req.params
        const { name } = req.body
        const findCategory = await Category.findByPk(id, { transaction: t })
        if (!findCategory) throw { name: "notFoundCategory" }
        else {
          await findCategory.update({ name }, { transaction: t })

          res.status(200).json({
            message: `Successfully update category with name : ${findCategory.name}`,
          })
        }
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const { id } = req.params

        const findCategory = await Category.findByPk(id, { transaction: t })

        if (!findCategory) throw { name: "notFoundCategory" }
        else {
          await Post.destroy(
            { where: { categoryId: findCategory.id } },
            { transaction: t }
          )
          await findCategory.destroy({ transaction: t })

          res.status(200).json({
            message: `Successfully delete category with name : ${findCategory.name}`,
          })
        }
      })
    } catch (error) {
      
      next(error)
    }
  }
}

module.exports = AdminController
