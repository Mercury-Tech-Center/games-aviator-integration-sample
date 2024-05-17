const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();
const port = 4000;
const fs = require("fs");
// const dotenv = require("dotenv");

// dotenv.config()

const faker = require("@faker-js/faker").faker;
const cookieParser = require("cookie-parser");

const ENV_FRONT_MAPPING = {
  local:"http://localhost:5173",
  dev: "https://dev.aviator.studio",
  staging: "https://staging.aviator.studio",
  prod: "",
};

app.use(cookieParser());
app.set("view engine", "ejs");
app.use(bodyParser.json());
const { v4: uuidv4 } = require("uuid");

const { verifyToken } = require("./middleware");

console.log('PROCESS ENV', process.env);

const APP_ENV = process.env["APP_ENV"];
const FRONT_URL = APP_ENV
  ? ENV_FRONT_MAPPING[APP_ENV]
  : "https://staging.aviator.studio";

console.log('FRONT_APP_URL', FRONT_URL);
const {
  createDummyUser,
  db,
  getUserByToken,
  cashIn,
  cashOut,
} = require("./database");

async function encrypt(publicKey, message) {
  try {
    const bufferMessage = Buffer.from(message, "utf8");
    const encryptedMessage = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      bufferMessage
    );
    return encryptedMessage.toString("base64");
  } catch (error) {
    console.error("Encryption failed:", error.message);
  }
}

const PUBLIC_KEY = fs.readFileSync("public.key", "utf-8");
const PROVIDER_ID = "6630bcc90465718ae3c73ae7";

// DEMONSTRATION PURPOSES ONLY!
app.get("/", async (req, res) => {
  try {
    let dummyUser = {
      token: uuidv4(),
      username: faker.internet.displayName(),
      balance: 100000,
    };
    console.log('GENERATING USER:', dummyUser.token);
    console.log('DUMMAY USER:', dummyUser.username);
    await createDummyUser(
      dummyUser.username,
      dummyUser.balance,
      dummyUser.token
    );
    let hash = await encrypt(PUBLIC_KEY, dummyUser.token);
    const data = {
      iframeSrc: "https://staging.aviator.studio",
      token: hash,
      providerId: PROVIDER_ID,
    };
    res.cookie("hash", hash, { httpOnly: true, sameSite: "lax" });
    res.cookie("providerId", PROVIDER_ID, {
      httpOnly: true,
      sameSite: "lax",
    });
    res.cookie("token", dummyUser.token);
    res.render("index", data);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.get("/api/account", verifyToken, (req, res) => {
  try {
    const user = req.user;
    res.json({ id: user.id, balance: user.balance, username: user.username });
  } catch (error) {
    res.status(500);
  }
});

app.post("/api/balance/cash-out", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const { amount } = req.body;
    await cashOut(user.token, amount);
    const updated = await getUserByToken(user.token);
    res.json({
      success: true,
      balance: updated.balance,
      username: updated.username,
      id: updated.id,
    });
  } catch (error) {
    console.error(error);
    res.status(400);
    res.json({ error: true });
  }
});

app.post("/api/balance/cash-in", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const { amount } = req.body;
    await cashIn(user.token, amount);
    const updated = await getUserByToken(user.token);
    res.json({
      balance: updated.balance,
      username: updated.username,
      id: updated.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
