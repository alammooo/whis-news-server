const jwt = require("jsonwebtoken")

function signToken(payload) {
  return jwt.sign(payload, "gravitational")
}

function verifyToken(token) {
  return jwt.verify(token, "gravitational")
}

module.exports = { signToken, verifyToken }
