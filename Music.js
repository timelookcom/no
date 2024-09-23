// List of 30 popular song URLs (replace these with actual URLs)
const songs = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-29.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-30.mp3',
];

const audio = new Audio();
audio.loop = false; // Disable looping of individual songs

const playButton = document.getElementById('play-btn');
const playButtonImg = document.getElementById('play-btn-img');

// Function to play a random song
function playRandomSong() {
    const randomIndex = Math.floor(Math.random() * songs.length);
    const selectedSong = songs[randomIndex];
    audio.src = selectedSong;

    // Ensure audio starts playing and handle errors
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
    });

    updatePlayButtonImage('pause-icon.png'); // Change to pause icon
}

// Function to update the button image
function updatePlayButtonImage(iconName) {
    playButtonImg.src = iconName;
}

// Function to handle button click
function handlePlayButtonClick() {
    if (audio.paused) {
        playRandomSong();
    } else {
        audio.pause();
        updatePlayButtonImage('play-icon.png'); // Change to play icon
    }
}

// Event listener for button click
playButton.addEventListener('click', handlePlayButtonClick);

// Event listener for when a song ends
audio.addEventListener('ended', function() {
    updatePlayButtonImage('play-icon.png'); // Change to play icon
    playRandomSong(); // Automatically play the next song
});

// Optional: Automatically start playing a song when the page loads (only if user interaction is allowed)
window.addEventListener('load', function() {
    // Intentionally left empty to avoid auto-start due to autoplay restrictions
});
