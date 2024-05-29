
# Aviator Crash Game Integration Sample App

This is a sample Node.js application that demonstrates how to integrate an Aviator crash game on the provider side. The app is built using Express.js and includes basic user creation, token encryption, and balance management functionalities.

## Prerequisites

- Node.js and npm installed
- A public key file (`public.key`) for encryption (Sent to provider as part of credentials)
- Environment variables set up (optional)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/aviator-crash-game-integration.git
   cd aviator-crash-game-integration
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file to set your environment variables (optional):

   ```bash
   touch .env
   ```

   Add the following content to the `.env` file. APP_ENV includes domain of Front End Aviator application that gets loaded into iframe.

   ```env
   APP_ENV=http://localhost:5173
   ```

4. Ensure you have a `public.key` file in the project directory for encryption.

## Running the Application

Start the application:

```bash
node app.js
```

The app will run on `http://localhost:4000`.

## Application Structure

- `app.js`: The main application file.
- `database.js`: Contains functions to interact with the database.
- `middleware.js`: Contains sample middleware functions, including token verification

## Endpoints

### `GET /`

This endpoint generates a dummy user, encrypts their token, and renders the main page with the necessary data. (For Demonstration purposes)

**Request:**

- `balance`: Optional query parameter to set the initial balance of the user.

**Response:**

Renders an `index` view with the following data:

- `iframeSrc`: The URL of the frontend application.
- `token`: Encrypted user token.
- `providerId`: ID of the provider.

**Cookies:**

- `hash`: Encrypted user token.
- `providerId`: Provider ID.
- `token`: Plain user token.

### `GET /api/account`

This endpoint retrieves the account details of the authenticated user.

**Request Headers:**

- `Authorization`: Bearer JWT token for user authentication.

**Response:**

- `id`: User ID.
- `balance`: User's balance.
- `username`: User's username.

### `POST /api/balance/cash-out`

This endpoint allows the user to cash out a specified amount from their balance.

**Request Headers:**

- `Authorization`: <JWT Token>

**Request Body:**

- `amount`: The amount to cash out.

**Response:**

- `success`: Indicates if the cash-out was successful.
- `balance`: Updated user balance.
- `username`: User's username.
- `id`: User ID.

**Error Response:**

- `error`: True if there was an error during the cash-out process.

### `POST /api/balance/cash-in`

This endpoint allows the user to cash in a specified amount to their balance.

**Request Headers:**

- `Authorization`: <JWT Token>

**Request Body:**

- `amount`: The amount to cash in.

**Response:**

- `balance`: Updated user balance.
- `username`: User's username.
- `id`: User ID.

## Middleware

### `verifyToken`

This middleware verifies the token provided in the request headers. It extracts the user information and attaches it to the request object.

### `delayMiddleware`

This middleware introduces a 5-second delay to simulate network latency.

## Helper Functions

### `encrypt`

Encrypts a message using the provided public key.

### `getBalance`

Retrieves the balance from the request query parameters, defaulting to 1000 if not provided.

## Example Usage

To test the application, you can use tools like Postman or curl to send requests to the endpoints. For example, to create a dummy user and render the main page, you can visit `http://localhost:4000/` in your browser.

## Conclusion

This sample app provides a basic structure for integrating an Aviator crash game on the provider side. It includes functionalities for user creation, token encryption, and balance management. You can extend and customize this app according to your specific requirements.

---

Feel free to reach out if you have any questions or need further assistance. Enjoy integrating your Aviator crash game!
