function errorHandler(error, req, res, next) {
  // console.log(error, "\n====================================\n")
  if (error.name === "SequelizeUniqueConstraintError") {
    res.status(400).json({ message: error.errors[0].message })
  } else if (error.name === "SequelizeValidationError") {
    const errorMessage = error.errors.map((e) => {
      return e.message
    })
    console.log(errorMessage)
    res.status(400).json({ message: errorMessage })
  } else if (error.name === "userNotFound") {
    res.status(401).json({ message: "Invalid Username/Password" })
  } else if (error.name === "notFoundPost") {
    res.status(401).json({ message: "Post is not found" })
  } else if (
    error.name === "invalidToken" ||
    error.name === "JsonWebTokenError"
  ) {
    res.status(403).json({ message: "Token is invalid!" })
  }
}

module.exports = { errorHandler }
