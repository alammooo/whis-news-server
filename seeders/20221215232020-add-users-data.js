"use strict"
const fs = require("fs")
const { hashPassword } = require("../helpers/bcrypt")
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
    const data = JSON.parse(fs.readFileSync("./db/db.json", "utf-8")).users.map(
      (el) => {
        delete el.id
        el.password = hashPassword(el.password)
        el.createdAt = new Date()
        el.updatedAt = new Date()

        return el
      }
    )
    // console.log(data)
    await queryInterface.bulkInsert("Users", data, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {})
  },
}
