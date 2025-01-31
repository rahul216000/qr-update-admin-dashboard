document.querySelectorAll(".toggle-checkbox").forEach((checkbox) => {
  checkbox.addEventListener("change", async function () {
    const userId = this.getAttribute("data-user-id");
    const isActive = this.checked;

    try {
      // Send the updated status to the backend API
      const response = await fetch("/admindashboard/toggle-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive, userId }), // Send userId and isActive as part of the request body
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user status");
      }
      const result = await response.json();
      showToast(result.message, "success");
    } catch (error) {
      console.error("Error updating user status:", error);
      showToast(response.message, "error");
    }
  });
});
