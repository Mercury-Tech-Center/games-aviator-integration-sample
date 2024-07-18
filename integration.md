# Aviator Crash Game Integration Sample App

This guide provides a comprehensive example of integrating an Aviator crash game on the provider side using Node.js and Express.js. It includes basic functionalities such as user creation, token encryption, and balance management.

## Prerequisites

To integrate the Aviator crash game, you'll need the following:

- Public Key
- Provider ID
- Front-end application URL

These credentials will be provided by the game provider.

## Installation

The installation process is provider-specific and based on your application environment.

## Authentication (Partner Side)

The authentication flow requires the provider to generate a JWT token with the user ID and issue date (`iat`), and then encrypt it using the given public key.

### Sample Code

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
  userId: dummyUser.token, // User identifier
  iat: new Date().getTime(), // Token issue date
};

const jwtToken = jwt.sign(payload, JWT_SECRET);
const token = await encryptMessage(PUBLIC_KEY, jwtToken);
```

The game provider API expects a status code of 403 if authentication fails.

## Authentication (Game Provider Side)

The game provider sends the decrypted JWT token using the Authorization header back to the partner API URL. The partner is expected to validate the JWT, including the user and expiration date.

## Loading Application

Once the JWT is encrypted on the provider API side, pass the generated front URL, token, provider ID, language, gameId to the game front-end application as query parameters.

### Paramters that needs to be passed as query params down to IFRAME

```js
const data = {
  // required.
  token: hash,
  // required.
  providerId: PROVIDER_ID,
  // optional
  language: "GE",
  // optional
  currency: "GEL",
  // required.
  gameId: 1,
};

<iframe
  allow="clipboard-read; clipboard-write; fullscreen"
  src="https://<FRONT_APP_DOMAIN>?token=<>&providerId=<>&currency=<>&language=<>&gameId=<>"
></iframe>;

```

## Endpoints

### `GET /api/account`

This endpoint retrieves the account details of the authenticated user.

**Request Headers:**

- `authorization`: <JWT Token>

**Response:**

- `id`: User ID
- `balance`: User's balance
- `username`: User's username

**Status Codes:**

- `200`: Success
- `403`: Authentication failed
- `500`: Server error

### `POST /api/balance/cash-out`

This endpoint allows the user to cash out a specified amount from their balance.

**Request Headers:**

- `authorization`: <JWT Token>

**Request Body:**

- `amount`: The amount to cash out
- `gameId`: Target game
- `transactionId`: unique transaction identifier of particular cash out
- `roundId`: game round id

**Response:**

- `balance`: Updated user balance
- `username`: User's username
- `id`: User ID

**Status Codes:**

- `200`: Success
- `403`: Authentication failed
- `400`: Insufficient funds
- `500`: Server error

### `POST /api/balance/cash-in`

This endpoint allows the user to cash in a specified amount to their balance.

**Request Headers:**

- `authorization`: <JWT Token>

**Request Body:**

- `amount`: The amount to cash in
- `gameId`: Target game
- `reason`: REVERSE_FUND, WIN, FREEBET
- `roundId`: game round id
- `transactionId`: current transaction unique identifier
- `previousTransactionId`: Identifier of the previous transaction, used to reference a bet being cashed out

**Response:**

- `balance`: Updated balance
- `username`: User's username
- `id`: User ID

**Status Codes:**

- `200`: Success
- `403`: Authentication failed
- `400`: Insufficient funds
- `500`: Server error
