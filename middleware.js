const jwt = require("jsonwebtoken"); // Import jsonwebtoken package
const { getUserByToken } = require('./database')

async function verifyToken(req, res, next) {
    try {
      const token = req.headers['authorization'];
      const user = await getUserByToken(token);
      req.user = user;
      next(); 
    } catch (error) {
      console.log('error:', error)
      res.status(400);
      res.json({ error: 'user not found' })
    }
  }
  

module.exports = { verifyToken };