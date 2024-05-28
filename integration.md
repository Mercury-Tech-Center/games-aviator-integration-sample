# Aviator Crash Game Integration Sample App

This is a sample Node.js application that demonstrates how to integrate an Aviator crash game on the provider side. The app is built using Express.js and includes basic user creation, token encryption, and balance management functionalities.

This is a sample Node JS application integration example that demonstrates how to integrate an Aviator crash game on the provider side. sample demonstrates basic user token encryption, account, balance management functionalities.

## Prerequisites

- Public Key
- Provider ID
- Front end application URL

Credentials are sent by game provider itself.

## Installation

Provider specific based on application environment

## Authentication (Partner Side)

Authentication flow requres provider to generate JWT token with user id and iat (issue) date and encrypt it with given public key.

```js
async function encryptMessage(publicKey, message) {
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
    console.log("Encrypted message:", encryptedMessage.toString("base64"));
    return encryptedMessage.toString("base64");
  } catch (error) {
    console.error("Encryption failed:", error.message);
  }
}
const payload = {
  // user identifier
  userId: dummyUser.token,
  // Token issue date
  iat: new Date().getTime(),
};
const jwtToken = jwt.sign(payload, JWT_SECRET);
const token = await encrypt(PUBLIC_KEY, jwtToken);
```

Example Middleware of validating incoming JWT token from game provider side.
Game provider API expects status code of 403 if authentication fails.

```js
async function verifyToken(req, res, next) {
  try {
    // 1. Game provider sends decrypted original JWT back to partner API
    const token = req.headers["authorization"];
    if (!token) {
      res.status(403);
      res.json({ error: "AUTHENTICATION_FAILED" });
      return;
    }

    // 2. Partner Validates JWT (user, expiration)
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserByToken(payload.userId);
    if (!user) {
      res.status(403);
      res.json({ error: "AUTHENTICATION_FAILED" });
      return;
    }
    const iat = payload.iat;
    const issueDate = new Date(iat);
    const currentDate = new Date();

    // case. validate issue date compared to current date
    const differenceInTime = currentDate.getTime() - issueDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    if (differenceInDays > 2) {
      res.status(403);
      res.json({ error: "AUTHENTICATION_FAILED" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error:", error);
    res.status(400);
    res.json({ error: "user not found" });
  }
}
```

## Authentication (Game provider Side)

Game provider sends decrypted (Using provider private key) JWT token using Authorization header back to partner API url. it expects partner to validate JWT including user and expiration date.

## Loading Application

Once JWT is encrypted on provider api side, we pass generated fronturl,token,providerId,language down to game front end application as query params.

```js
const data = {
  iframeSrc: FRONT_URL,
  token: hash,
  providerId: PROVIDER_ID,
  language: "GE",
};
res.render("index", data);
```

```html
<% let queryParams = '?token=' + encodeURIComponent(token) + '&providerId=' +
encodeURIComponent(providerId); %>
<iframe src="<%= iframeSrc + queryParams %>"></iframe>
```

## Endpoints

### `GET /api/account`

This endpoint retrieves the account details of the authenticated user.

**Request Headers:**

- `authorization`: <JWT Token>

**Response:**

- `id`: User ID.
- `balance`: User's balance.
- `username`: User's username.

**Status Code:**
- `200`: for normal success response
- `403`: Authentication failed
- `500`: Any other general server exception

### `POST /api/balance/cash-out`

This endpoint allows the user to cash out a specified amount from their balance.

**Request Headers:**

- `authorization`: <JWT Token>

**Request Body:**

- `amount`: The amount to cash out.

**Response:**

- `balance`: Updated user balance.
- `username`: User's username.
- `id`: User ID.

**Status Code:**
- `200`: for normal success response
- `403`: Authentication failed
- `400`: User does not have enough funds
- `500`: Any other general server exception


### `POST /api/balance/cash-in`

This endpoint allows the user to cash in a specified amount to their balance.

**Request Headers:**

- `authorization`: <JWT Token>

**Request Body:**

- `amount`: The amount to cash in.

**Response:**

- `balance`: Updated balance
- `username`: User's username.
- `id`: User ID.

**Status Code:**
- `200`: for normal success response
- `403`: Authentication failed
- `400`: User does not have enough funds
- `500`: Any other general server exception
