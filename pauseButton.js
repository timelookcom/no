// List of 50 song URLs
const songs = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-24.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-25.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-26.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-27.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-28.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-29.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-30.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-31.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-32.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-33.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-34.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-35.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-36.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-37.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-38.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-39.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-40.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-41.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-42.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-43.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-44.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-45.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-46.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-47.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-48.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-49.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-50.mp3'
];

// Create a new Audio object
let audio = new Audio();
audio.loop = false; // Disable looping of individual songs

// Reference to button and its image
const playButton = document.getElementById('play-btn');
const playButtonImg = document.getElementById('play-btn-img');

// Function to play a random song
function playRandomSong() {
    // Stop current playback if necessary
    if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
    }

    // Randomly select a song URL
    const randomIndex = Math.floor(Math.random() * songs.length);
    const selectedSong = songs[randomIndex];

    // Set the audio source to the selected song
    audio.src = selectedSong;

    // Play the selected song
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
    });

    // Change the button image to show pause icon
    playButtonImg.src = 'pause-icon.png'; // Replace with your pause icon path
}

// Function to handle button click
function handlePlayButtonClick() {
    if (audio.paused) {
        playRandomSong();
    } else {
        // Pause the song
        audio.pause();

        // Change the button image to show play icon
        playButtonImg.src = 'play-icon.png'; // Replace with your play icon path
    }
}

// Event listener for button click
playButton.addEventListener('click', handlePlayButtonClick);

// Event listener for when a song ends
audio.addEventListener('ended', function() {
    // Automatically play the next song
    playRandomSong();
});

// Automatically start playing a song when the page loads, if autoplay is allowed
window.addEventListener('load', function() {
    // Attempt to autoplay (may be blocked by browser)
    playRandomSong();
});
