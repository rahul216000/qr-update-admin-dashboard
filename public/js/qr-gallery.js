const modal = document.getElementById("qrModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
// const generateSection = document.getElementById("generate-section");
const qrTypeUpdate = document.getElementById("qr-type-update");
const inputFieldsUpdate = document.getElementById("input-fields-update");
const updateSection = document.getElementById("update-section");
const viewQr = document.getElementById("view-qr");
// const submitBtnUpdate = document.getElementById("submit-btn-update");
let qrCodeIdToUpdate; // Declare a variable to store the QR Code ID
function openModal(qrImage, qrCode) {
  // Set the image and title
  modalImage.src = qrImage;
  modalTitle.innerText = qrCode;

  // Show the modal
  modal.style.display = "block";
  viewQr.style.display = "block";

  // Hide the generate section by default
  updateSection.style.display = "none";
}

// Function to toggle generate-section inside modal
function showGenerateSection(qr) {
  modal.style.display = "block";
  updateSection.style.display = "block";
  viewQr.style.display = "none";
  qrCodeIdToUpdate = qr._id;
  document.getElementById("qr-name-update").value = qr.qrName;
  document.getElementById("bg-color-update").value = qr.backgroundColor;
  document.getElementById("dot-style-update").value = qr.dotStyle;
  document.getElementById("corner-style-update").value = qr.cornerStyle;
  document.getElementById("gradient-update").value = qr.applyGradient;
  document.getElementById("qr-dot-color-update").value = qr.qrDotColor;
  const filePath = `${window.location.protocol}//${window.location.host}/${qr.media_url}`; // Update with your file path

  // Fetch the file and store it as a Blob
  fetch(filePath)
    .then((response) => response.blob())
    .then((blob) => {
      // Store the Blob for later upload without displaying it
      const inputElement = document.getElementById("media-file-update");
      const fileName = qr.media_url;

      // Handle file path and name extraction
      const normalizedFileName = fileName
        .replace(/uploads\\/g, "uploads\\\\")
        .split("\\")
        .pop();
      // Create a new File object from the Blob
      const file = new File([blob], normalizedFileName, { type: "image/png" });

      // Create a DataTransfer object to simulate file selection
      const fileList = new DataTransfer();
      fileList.items.add(file);

      // Populate the input with the files
      inputElement.files = fileList.files; // Set the files property

      // Optional: If you want to keep track of the blob URL, you can store it
      inputElement.dataset.fileBlob = URL.createObjectURL(blob);
    })
    .catch((error) => console.error("Error fetching image:", error));
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("qrModal");
  modal.style.display = "none";
}
qrTypeUpdate.addEventListener("change", updateInputFields);

function updateInputFields() {
  inputFieldsUpdate.innerHTML = "";
  let input;

  switch (qrTypeUpdate.value) {
    case "media":
      input = createInput("file", "media-file-update", "Select Media File");
      break;
    case "text":
      input = createInput("file", "text-file-update", "Select Text File");
      break;
    case "url":
      input = createInput("text", "url-update", "Enter URL");
      break;
  }

  inputFieldsUpdate.appendChild(input);
  inputFieldsUpdate.classList.add("fade-in");
}

function createInput(type, id, labelText) {
  const div = document.createElement("div");
  div.className = "input-group";

  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = type;
  input.id = id;

  div.appendChild(label);
  div.appendChild(input);

  return div;
}

updateInputFields();
