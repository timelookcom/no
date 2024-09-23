document.addEventListener('DOMContentLoaded', () => {
    const youtubeButton = document.getElementById('youtubeButton');

    if (youtubeButton) {
        youtubeButton.addEventListener('click', () => {
            window.open('https://music.youtube.com', '_blank');
        });
    } else {
        console.error('Button with ID "youtubeButton" not found.');
    }
});
