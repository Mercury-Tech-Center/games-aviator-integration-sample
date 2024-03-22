const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.json());

async function encrypt(publicKey, message) {
    const bufferMessage = Buffer.from(message, 'utf8');
    const encryptedMessage = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      bufferMessage
    );
    return encryptedMessage.toString('base64');
}

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq4wrR0Gol1EpCLfqJUhL
BPx3v+VsBU3A7g8VogYNZ1jR/0yJgYRruYXWfVDVlqpPm/9xtgMWvtRxLOJoyDOY
ZFYopKmWbWc1JW/5TXiKH7JECzI+1Oc4DiQdIAOQMbBJPnEL8oHO7CW3W1GMWz/3
EBzAvZg6rfuQDd9ugfR8aoxrmjBCrgR7CO2BKisoVHAxeIEJZRg+MFCr3EkDb0Vn
t/95oF/feKJe8CwT/UL0ySO7g9A3ZXgGiuPzpGV8lTX5uhVu01rBUwJ4giOxkgjg
WYAdBBtfEPo1c6b1bmrkgfoOIXfa9mPSmIiTn3+EX378yU5GNKKWjLM5Y06XzojL
wQIDAQAB
-----END PUBLIC KEY-----
`;

let accountBalance = 100;

// მაგალითი. დავჰეშავთ მომხმარებლის ავტორიაციის ტოკენს
let userToken = "123";

app.get("/", async (req, res) => {
  let token = await encrypt(PUBLIC_KEY, userToken);
  const data = {
    iframeSrc: 'https://aviator.gs.tcenter.cloud/',
    token,
  };

  res.render("index", data);
});

app.get("/api/account/balance", (req, res) => {
  res.json({ balance: accountBalance });
});

app.get("/api/account/balance/retrieve", (req, res) => {
  res.json({ balance: accountBalance });
});

app.post("/api/account/balance/update", (req, res) => {
  res.json({ success: true, newBalance: accountBalance });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
