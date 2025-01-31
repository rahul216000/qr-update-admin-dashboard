const crypto = require("crypto");

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 64 hex characters (32 bytes)
const IV_LENGTH = 12; // Recommended IV length for GCM (12 bytes)

// Encryption helper function
function encryptPassword(password) {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error(
      "Encryption key must be set in environment variables and be 64 characters (32 bytes) in hex format."
    );
  }

  const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );

  // Handle both Buffer and string input
  const input = Buffer.isBuffer(password) ? password : Buffer.from(password, "utf8");

  // Encrypt the input
  const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);
  const authTag = cipher.getAuthTag(); // Authentication tag for GCM

  return `${iv.toString("hex")}:${encrypted.toString("hex")}:${authTag.toString("hex")}`;
}

// Decryption helper function
function decryptPassword(encryptedPassword) {
  const [ivHex, encryptedText, authTagHex] = encryptedPassword.split(":");

  

  const iv = Buffer.from(ivHex, "hex"); // Convert IV from hex
  const authTag = Buffer.from(authTagHex, "hex"); // Convert auth tag from hex
  const encrypted = Buffer.from(encryptedText, "hex"); // Convert encrypted text from hex

  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error(
      "Encryption key must be set in environment variables and be 64 characters (32 bytes) in hex format."
    );
  }

  if (authTagHex.length !== 32) {
    throw new Error("Invalid authentication tag length. Possible tampering detected.");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );

  decipher.setAuthTag(authTag); // Set the authentication tag

  // Decrypt the encrypted data
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString("utf8"); // Convert the result to UTF-8 string
}

module.exports = { encryptPassword, decryptPassword };
