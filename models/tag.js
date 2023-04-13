"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsTo(models.Post, { foreignKey: "postId" })
    }
  }
  Tag.init(
    {
      name: {
        type: DataTypes.STRING,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      postId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notNull: { msg: "PostId is required" },
          notEmpty: { msg: "PostId is required" },
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Tag",
    }
  )
  return Tag
}
