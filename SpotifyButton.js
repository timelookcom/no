document.addEventListener('DOMContentLoaded', () => {
    const spotifyButton = document.getElementById('SpotifyButton');

    if (spotifyButton) {
        spotifyButton.addEventListener('click', () => {
            window.open('https://www.spotify.com', '_blank');
        });
    } else {
        console.error('Button with ID "SpotifyButton" not found.');
    }
});

