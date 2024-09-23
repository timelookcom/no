document.getElementById('checkButton').addEventListener('click', function() {
    // Example check function
    function isPageLoadedCorrectly() {
        // Implement your actual page check here
        // For debugging, let's log the result of the check
        const isElementPresent = document.getElementById('importantElement') !== null;
        console.log('Is important element present:', isElementPresent);
        return isElementPresent;
    }

    const pageLoadedCorrectly = isPageLoadedCorrectly();

    if (pageLoadedCorrectly) {
        alert('Everything looks good and loaded!');
    } else {
        if (confirm('The page needs to be reloaded. Do you want to reload?')) {
            location.reload();
        }
        // If the user clicks "Cancel", nothing happens
    }
});
