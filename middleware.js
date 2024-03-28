const jwt = require("jsonwebtoken"); // Import jsonwebtoken package
const { getUserByToken } = require('./database')

async function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    const user = await getUserByToken(token);
    req.user = user;
    next();
  }
  

module.exports = { verifyToken };