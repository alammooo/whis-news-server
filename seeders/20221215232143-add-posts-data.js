"use strict"
const fs = require("fs")
const sluggy = require("../helpers/slugify")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const data = JSON.parse(fs.readFileSync("./db/db.json", "utf-8")).posts.map(
      (el) => {
        delete el.id
        delete el.source
        delete el.name
        delete el.description
        delete el.publishedAt
        delete el.author
        delete el.url

        el.slug = sluggy(el.title)
        el.categoryId = Math.floor(Math.random() * 7 + 1)
        el.authorId = Math.floor(Math.random() * 2 + 1)
        el.createdAt = new Date()
        el.updatedAt = new Date()

        return el
      }
    )

    // console.log(data)
    await queryInterface.bulkInsert("Posts", data, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Posts", null, {})
  },
}
