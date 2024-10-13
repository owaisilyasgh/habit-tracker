
document.addEventListener('DOMContentLoaded', function () {
    const settingsGear = document.getElementById('settings-gear');
    const settingsModal = document.getElementById('settings-modal');
    const closeButton = document.querySelector('.close-button');

    // Check if elements exist before adding event listeners
    if (settingsGear && settingsModal && closeButton) {
        // Open modal when 'Gear' icon is clicked
        settingsGear.addEventListener('click', () => {
            if (settingsModal) {
                settingsModal.style.display = 'flex'; // Show the modal
            }
        });

        // Close modal when 'X' button is clicked
        closeButton.addEventListener('click', () => {
            if (settingsModal) {
                settingsModal.style.display = 'none'; // Hide the modal
            }
        });

        // Optional: Close modal when clicking outside the modal content
        window.addEventListener('click', (event) => {
            if (event.target === settingsModal) {
                settingsModal.style.display = 'none'; // Hide if clicking outside modal content
            }
        });
    } else {
        console.error('Required modal elements not found.');
    }
});
