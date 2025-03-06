// Function to fetch data from the backend
export async function fetchData(type) {
  const response = await fetch(`./php/main.php?type=${type}`);
  return response.json();
}

// Function to show the modal
export function showModal(message, details, onConfirm) {
  const modalMessage = document.getElementById("modal-message");
  modalMessage.textContent = message;

  const modalDetails = document.getElementById("modal-details");
  modalDetails.innerHTML = details;

  const confirmButton = document.getElementById("modal-confirm");
  confirmButton.onclick = () => {
    onConfirm();
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("confirmationModal")
    );
    modal.hide();
  };

  const modal = new bootstrap.Modal(
    document.getElementById("confirmationModal")
  );
  modal.show();
}