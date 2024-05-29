const jwt = require("jsonwebtoken"); // Import jsonwebtoken package
const { getUserByToken } = require("./database");

const JWT_SECRET = "HELLO THERE:)";

async function verifyToken(req, res, next) {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      throw new Error("Expected Auth Token");
    }
    const payload = jwt.verify(token, JWT_SECRET);
    console.info('USER PAYLOAD:', payload);
    const user = await getUserByToken(payload.userId);
    if (!user) {
      throw new Error("Invalid User Id");
    }
    const iat = payload.iat;
    const issueDate = new Date(iat);
    const currentDate = new Date();

    // case. validate issue date compared to current date
    const differenceInTime = currentDate.getTime() - issueDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    if (differenceInDays > 2) {
      throw new Error("Token expired");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error:", error);
    res.status(400);
    res.json({ error: "user not found" });
  }
}

module.exports = { verifyToken, JWT_SECRET };
