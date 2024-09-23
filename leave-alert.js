// Flag to determine if the user should be prompted before leaving
let shouldPrompt = false;

// Function to handle the beforeunload event
function handleBeforeUnload(event) {
    if (shouldPrompt) {
        // Custom message (modern browsers might not display this message)
        const message = "Are you sure you want to leave this page?";

        // Set the necessary properties to show the prompt
        event.preventDefault();
        event.returnValue = message; // For modern browsers

        // For compatibility with older browsers
        return message;
    }
}

// Add event listener for the beforeunload event
window.addEventListener('beforeunload', handleBeforeUnload);

// Function to enable prompt for navigation actions
function setupPromptForNavigation() {
    // Attach event to links for navigation
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            shouldPrompt = true; // Set flag to show prompt
        });
    });

    // Attach event to forms to prompt on submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function () {
            shouldPrompt = true; // Set flag to show prompt
        });
    });

    // Optionally, handle button clicks or other interactions
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function () {
            // If the button triggers navigation, set the flag
            if (button.hasAttribute('data-navigate')) {
                shouldPrompt = true; // Set flag to show prompt
            }
        });
    });
}

// Reset flag when the page loads to ensure it only shows when needed
window.addEventListener('load', function () {
    shouldPrompt = false; // Reset flag
    setupPromptForNavigation(); // Set up prompt for navigation actions
});
