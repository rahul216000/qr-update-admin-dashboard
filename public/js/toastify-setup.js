// toastify-setup.js

// Function to show toast messages
function  showToast(message, type = "success") {
  const backgroundColors = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #ff4e50, #fc913a)",
    warning: "linear-gradient(to right, #f39c12, #f1c40f)",
  };

  Toastify({
    text: message,
    duration: 3000, // Duration in ms
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    backgroundColor: backgroundColors[type] || backgroundColors.success,
    close: true, // Show close button
    onClick: function () {}, // Callback after click
  }).showToast();
}
