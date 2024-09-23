document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('customVideo');
    const playButton = document.getElementById('playButton');
    const menuButton = document.getElementById('menuButton');
    const menuContainer = document.getElementById('menuContainer');
    const closeMenuButton = document.getElementById('closeMenuButton');

    // Toggle play/pause of the video
    playButton.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playButton.classList.remove('play');
            playButton.classList.add('pause');
        } else {
            video.pause();
            playButton.classList.remove('pause');
            playButton.classList.add('play');
        }
    });

    // Update button classes when video is played or paused
    video.addEventListener('play', function() {
        playButton.classList.remove('play');
        playButton.classList.add('pause');
    });

    video.addEventListener('pause', function() {
        playButton.classList.remove('pause');
        playButton.classList.add('play');
    });

    // Toggle menu visibility
    menuButton.addEventListener('click', function() {
        menuContainer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling while menu is open
    });

    // Hide menu when close button is clicked
    closeMenuButton.addEventListener('click', function() {
        menuContainer.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
});
