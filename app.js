const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();
const port = 3000;
const fs = require("fs");

const faker = require('@faker-js/faker').faker;

app.set("view engine", "ejs");
app.use(bodyParser.json());
const { v4: uuidv4 } = require('uuid');

const { verifyToken } = require('./middleware')

const { createDummyUser, db,  getUserByToken, cashIn, cashOut } = require('./database')

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

app.get("/", async (req, res) => {
  let dummyUser = {
    token: uuidv4(),
    username: faker.internet.displayName(),
    balance: 1000,
  }
  await createDummyUser(dummyUser.username, dummyUser.balance, dummyUser.token);
  let hash = await encrypt(PUBLIC_KEY, dummyUser.token);
  console.log('hash:', hash);
  const data = {
    iframeSrc: "https://aviator.gs.tcenter.cloud/",
    token: hash,
  };
  res.render("index", data);
});


app.get("/api/account", verifyToken, (req, res) => {
  const user = req.user;
  res.json({ balance: user.balance, username: user.username });
});

app.post("/api/balance/cash-out", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const { amount } = req.body;
    await cashOut(user.token, amount);
    const updated = await getUserByToken(user.token);
    res.json({ success: true, balance: updated.balance, username: updated.username }); 
  } catch (error) {
    console.error(error)
    res.status(400)
    res.json({ error: true })
  }
});

app.post("/api/balance/cash-in", verifyToken, async (req, res) => {
  const user = req.user;
  const { amount } = req.body;
  await cashIn(user.token, amount);
  const updated = await getUserByToken(user.token);
  res.json({ balance: updated.balance, username: updated.username });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
