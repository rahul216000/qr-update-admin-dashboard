const sendLinkButton = document.getElementById("sendLinkButton");
const emailSection = document.getElementById("emailSection");
const newPasswordSection = document.getElementById("newPasswordSection");
const forgotPasswordHeadingText = document.getElementById(
  "forgotpasswordheadingtext"
);
const updatePasswordHeadingText = document.getElementById(
  "updatepasswordheadingtext"
);
const resetpasswordinfotext = document.getElementById("resetpasswordinfotext");
const emailElement = document.getElementById("forgotpasswordemail");

// Attach the function to the form's submit event
document
  .getElementById("forgotPasswordForm")
  .addEventListener("submit", handleSendResetLink);

// Attach the function to the form's submit event
document
  .getElementById("updatePasswordForm")
  .addEventListener("submit", handlePasswordReset);

async function handleSendResetLink(event) {
  event.preventDefault(); // Prevent the default form submission
  const form = event.target; // Get the form element
  const formData = new FormData(form); // Use the FormData API
  const data = Object.fromEntries(formData); // Convert FormData to an object

  // Call the registerUser function
  try {
    sendLinkButton.disabled = true; // Disable the send button
    const result = await requestPasswordReset(data); // Call the API function
    showToast(result.message, "success"); // Show success message
    sendLinkButton.disabled = false; // Disable the send button
    form.reset(); // Reset the form after successful submission
    // Redirect to login page after successful logout
    setTimeout(() => {
      window.location.href = "/";
    }, 1000); // Optional delay to let the toast show up
  } catch (error) {
    showToast(error.message || "An error occurred. Please try again.", "error"); // Show error message
    sendLinkButton.disabled = false;
  }
}

async function requestPasswordReset(data) {
  try {
    const response = await fetch("/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Send the email as part of the request body
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send reset link");
    }

    // Return the response data (e.g., success message)
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Propagate error for handling in the calling function
  }
}

// Function to handle password reset form submission
async function handlePasswordReset(event) {
  event.preventDefault(); // Prevent the default form submission

  const form = event.target; // Get the form element
  const formData = new FormData(form); // Use the FormData API
  const data = Object.fromEntries(formData); // Convert FormData to an object
  // Check for the token in the URL path or query parameter
  const urlPath = window.location.pathname;
  const token = urlPath.split("/")[2]; // If the token is in the URL path (e.g., /reset-password/:token)

  try {
    // Call the password reset API
    const result = await resetPassword(token, data);
    showToast(result.message, "success"); // Show success message
    form.reset(); // Reset the form after successful submission
    setTimeout(() => {
      window.location.href = "/";
    }, 1000); // Optional delay to let the toast show up
  } catch (error) {
    showToast(error.message || "An error occurred. Please try again.", "error"); // Show error message
  }
}

// Function to make the API call for resetting the password
async function resetPassword(token, newPassword) {
  try {
    const response = await fetch(`/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPassword), // Send the new password in the request body
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset password");
    }

    // Return the response data (e.g., success message)
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Propagate error for handling in the calling function
  }
}

// Function to verify the token on page load
async function verifyTokenOnLoad(token) {
  try {
    const response = await fetch(`/verify-token/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Token verification failed");
    }
    const { email } = await response.json();

    // Use a ternary operator to set the text content
    emailElement.textContent = email
      ? `Email: ${email}`
      : "Error: Something went wrong";

    // Optional: Change the color if it's an error
    if (!email) {
      emailElement.style.color = "red"; // Make the error visually distinct
    }
  } catch (error) {
    console.error("Error during token verification:", error);
    showToast(error.message || "An error occurred. Please try again.", "error");
    // Redirect to login page after successful logout
    setTimeout(() => {
      window.location.href = "/";
    }, 1000); // Optional delay to let the toast show up
  }
}

// Function to check the route and adjust the page content accordingly
function checkRoute() {
  const path = window.location.pathname;
  if (path.includes("/forgotpassword")) {
    const token = path.split("/").pop(); // Extract token
    if (token) {
      // If there's a token in the URL, show the new password section
      emailSection.style.display = "none"; // Hide email section
      newPasswordSection.style.display = "block"; // Show new password section
      forgotPasswordHeadingText.style.display = "none"; // Hide forget password text
      updatePasswordHeadingText.style.display = "block"; // Hide forget password text
      resetpasswordinfotext.style.display = "none"; //Reset Password info text
    } else {
      // If no token, show the email input section
      emailSection.style.display = "block";
      newPasswordSection.style.display = "none";
      updatePasswordHeadingText.style.display = "none"; // Hide forget password text
      forgotPasswordHeadingText.style.display = "show"; // Hide forget password text
      resetpasswordinfotext.style.display = "show"; //Reset Password info text
    }
  }
}

window.onload = function () {
  // Check for the token in the URL path or query parameter
  const urlPath = window.location.pathname;
  const token = urlPath.split("/")[2]; // If the token is in the URL path (e.g., /reset-password/:token)

  // OR, if the token is in the query string, use the following:
  // const urlParams = new URLSearchParams(window.location.search);
  // const token = urlParams.get('token');
  checkRoute();
  if (token) {
    // If token is found, call the verification function
    verifyTokenOnLoad(token);
  } else {
    // If no token is found, log a message or handle accordingly
    console.log("No token found in the URL");
  }
};
