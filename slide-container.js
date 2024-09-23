document.addEventListener('DOMContentLoaded', () => {
    const scoreContainer = document.getElementById('scoreContainer');
    const toggleScoreButton = document.getElementById('toggleScoreButton');
    const menuContainer = document.querySelector('.menu-container');
    const menuButton = document.querySelector('.menu-button');
    const closeMenuButton = document.querySelector('.close-menu-button');

    // Toggle score container visibility
    toggleScoreButton.addEventListener('click', () => {
        if (scoreContainer.classList.contains('hidden')) {
            scoreContainer.classList.remove('hidden');
            scoreContainer.classList.add('show');
            toggleScoreButton.textContent = '⇢';
        } else {
            scoreContainer.classList.add('hidden');
            scoreContainer.classList.remove('show');
            toggleScoreButton.textContent = '⇠';
        }
    });

    // Show menu
    menuButton.addEventListener('click', () => {
        menuContainer.classList.add('show');
    });

    // Hide menu
    closeMenuButton.addEventListener('click', () => {
        menuContainer.classList.remove('show');
    });

    // Function to handle closing the score container when clicking outside
    function handleClickOutside(event) {
        if (scoreContainer.classList.contains('show') &&
            !scoreContainer.contains(event.target) &&
            !toggleScoreButton.contains(event.target)) {
            scoreContainer.classList.add('hidden');
            scoreContainer.classList.remove('show');
            toggleScoreButton.textContent = '⇢';
        }
    }

    // Add event listeners for clicks and touches
    document.addEventListener('click', (event) => {
        // Close scoreContainer if clicked outside
        handleClickOutside(event);

        // Close menuContainer if clicked outside of it and not on menuButton
        if (menuContainer.classList.contains('show') &&
            !menuContainer.contains(event.target) &&
            !menuButton.contains(event.target)) {
            menuContainer.classList.remove('show');
        }
    });

    document.addEventListener('touchstart', (event) => {
        handleClickOutside(event);

        if (menuContainer.classList.contains('show') &&
            !menuContainer.contains(event.target) &&
            !menuButton.contains(event.target)) {
            menuContainer.classList.remove('show');
        }
    });

    // Prevent click events from bubbling up to the document when clicking inside the score container
    scoreContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Prevent click events from bubbling up to the document when clicking inside the menu container
    menuContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});

