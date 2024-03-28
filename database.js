const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the users database.");
    // Create users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        balance INTEGER,
        token TEXT
      )`);
  }
});

function getUserByToken(token) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE token = ?`, [token], (err, row) => {
      if (err) {
        reject(err.message);
      } else if (!row) {
        reject("User not found");
      } else {
        resolve(row);
      }
    });
  });
}

function cashIn(token, amount) {
  return new Promise((resolve, reject) => {
    // Update the balance by adding the winAmount to the existing balance
    db.run(
      `UPDATE users SET balance = balance + ? WHERE token = ?`,
      [amount, token],
      function (err) {
        if (err) {
          reject(err.message);
        } else {
          // If the balance was successfully updated, resolve. The `this` context contains the last ID and rows changed.
          if (this.changes > 0) {
            resolve(
              `Balance updated successfully for user with token: ${token}`
            );
          } else {
            // This case should technically never happen since we already checked if the user exists in your other function
            reject(
              "No changes made, user not found or no need to update the balance."
            );
          }
        }
      }
    );
  });
}

function cashOut(token, amount) {
  return new Promise((resolve, reject) => {
    // First, check if the user has enough balance
    db.get(
      `SELECT balance FROM users WHERE token = ?`,
      [token],
      function (err, row) {
        if (err) {
          reject(err.message);
        } else if (row && row.balance >= amount) {
          // If balance is sufficient, proceed with deduction
          db.run(
            `UPDATE users SET balance = balance - ? WHERE token = ?`,
            [amount, token],
            function (err) {
              if (err) {
                reject(err.message);
              } else {
                // If the balance was successfully updated, resolve. The `this` context contains the last ID and rows changed.
                if (this.changes > 0) {
                  resolve(
                    `Balance updated successfully for user with token: ${token}`
                  );
                } else {
                  // This case should technically never happen since we already checked if the user exists
                  reject(
                    "No changes made, user not found or no need to update the balance."
                  );
                }
              }
            }
          );
        } else {
          // If balance is insufficient, reject the promise
          reject("User does not have enough funds to withdraw.");
        }
      }
    );
  });
}

function createDummyUser(username, balance, token) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, balance, token) VALUES (?, ?, ?)`,
      [username, balance, token],
      function (err) {
        if (err) {
          reject(err.message);
        }
        resolve({ saved: true });
      }
    );
  });
}

module.exports = {
  db,
  getUserByToken,
  createDummyUser,
  cashIn,
  cashOut,
};
