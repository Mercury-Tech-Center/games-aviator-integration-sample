const crypto = require('crypto');

// Public key provided
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

async function encryptMessage(publicKey, message) {
  try {
    const bufferMessage = Buffer.from(message, 'utf8');
    const encryptedMessage = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      bufferMessage
    );
    console.log('Encrypted message:', encryptedMessage.toString('base64'));
    return encryptedMessage.toString('base64');
  } catch (error) {
    console.error('Encryption failed:', error.message);
  }
}

// Sample message to encrypt
const message = "Hello, World!";

encryptMessage(PUBLIC_KEY, message);