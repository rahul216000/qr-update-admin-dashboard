const SibApiV3Sdk = require("sib-api-v3-sdk");

// Function to send reset password email with a link using Brevo
async function sendResetPasswordEmail(userEmail, resetLink) {
  const apiKey = process.env.BREVO_API_KEY;
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // Set the API key for authentication
  const apiClient = SibApiV3Sdk.ApiClient.instance;
  const apiKeyInstance = apiClient.authentications["api-key"];
  apiKeyInstance.apiKey = apiKey;

  // Set up the email parameters
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { email: process.env.SENDER_EMAIL }; // Your sender email address
  sendSmtpEmail.to = [{ email: userEmail }];
  sendSmtpEmail.subject = "Password Reset Request";
  sendSmtpEmail.htmlContent = `
    <p>We received a request to reset your password.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>If you didn't request a password reset, please ignore this email.</p>
  `;

  try {
    // Send the email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending reset password email with Brevo:", error);
    throw new Error("Failed to send reset password email");
  }
}

module.exports = { sendResetPasswordEmail };
