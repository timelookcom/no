<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Website</title>
    <link rel="stylesheet" href="index.css">
    <style>
        /* Custom styles for the video and play/pause button */
        .video-container {
            border-radius: 30px;
            position: relative;
            margin: 20px auto;
            width: 80%; /* Adjust the width as needed */
            max-width: 800px; /* Maximum width of the video container */
            text-align: center;
            margin-top: 100px;
        }

        video {
            width: 100%;
            height: auto;
            display: block;
        }

        .play-button {
            position: absolute;
            bottom: 10px; /* Adjust the distance from the bottom as needed */
            left: 10px;   /* Adjust the distance from the left as needed */
            background: rgba(0, 0, 0, 0.6);
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }

        .play-button.play:before {
            content: '▶'; /* Play icon */
        }

        .play-button.pause:before {
            content: '❚❚'; /* Pause icon */
        }
        
        .play-button:hover {
            background: rgba(0, 0, 0, 0.8);
        }

        /* Styles for the new button section */
        .button-section {
            display: flex;
            justify-content: center;
            gap: 20px; /* Space between the buttons */
            margin-bottom: 20px; /* Space below the buttons */
        }

        .custom-button {
            padding: 10px 20px; /* Adjust button size */
            border: none;
            border-radius: 25px; /* Rounded corners */
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s, transform 0.3s;
        }

        .custom-button:hover {
            transform: scale(1.05); /* Slightly enlarge button on hover */
        }

        .button-blue {
            background: white;
            color: black; /* Blue background */
        }

        .button-blue:hover {
            background: rgb(231, 228, 228); /* Darker blue on hover */
        }

        .button-red {
            background: #202020;
            border: 1px solid gray;
            color: white; /* Red background */
        }

        .button-red:hover {
            background: #313131; /* Darker red on hover */
        }

        /* Navigation styles */
        header {
            background-color: #333; /* Background color of the header */
            padding: 10px 20px;
        }

        nav {
            display: flex;
            justify-content: space-between; /* Space between the menu button and header buttons */
            align-items: center;
        }

    
    </style>
</head>
<body>
    <header>
        <nav>
            <!-- Menu button moved to the very left -->
            <button class="menu-button" id="menuButton">&#9776; Menu</button>
            <div class="header-buttons">
                <button class="header-button" id="sign-in">Sign In</button>
            </div>
        </nav>
    </header>
    <main>
        <h1>GOlike</h1><h2>I like to play games and if you do this is a cool game for you</h2>

        <!-- New Buttons Section -->
        <div class="button-section">
            <button class="custom-button button-blue">Play</button>
            <button class="custom-button button-red">Download App</button>
        </div>

        <!-- Video Section -->
        <div class="video-container">
            <video id="customVideo">
                <source src="C:\Users\k153f_qqpvs8e\OneDrive\Documents/vidg.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <button class="play-button play" id="playButton"></button>
        </div>

        <div class="picture-text-container first-container">
            <div class="text-container">
                <h2 class="tying">This is some cool text that looks like it's being typed out! You can see it typing and then continue writing more as if it's a typewriter.</h2>
                <button class="header-button" id="play">Play Premium</button>
            </div>
            <img src="images/picone.jpg" alt="Small Image" class="coo-picture">
        </div>

        <div class="picture-text-container">
            <img src="images/picone.jpg" alt="Alternate Image 1" class="coo-picture">
            <div class="text-container">
                <p class="typing">More cool text with the image on the left side.</p>
                <button class="header-button" onclick="location.href='game-one.html'">Play</button>
            </div>
        </div>

        <div class="picture-text-container">
            <img src="images/picone.jpg" alt="Alternate Image 2" class="coo-picture">
            <div class="text-container">
                <p class="typing">Another set of cool text with the image on the left side!</p>
                <button class="header-button" id="action-2">Action</button>
            </div>
        </div>

        <div class="picture-text-container">
            <img src="images/picone.jpg" alt="Alternate Image 1" class="coo-picture">
            <div class="text-container">
                <p class="typing">More cool text with the image on the left side.</p>
                <button class="header-button" id="action-1">Action</button>
            </div>
        </div>

        <!-- New Containers -->
        <div class="picture-text-container">
            <img src="images/picone.jpg" alt="Additional Image 1" class="coo-picture">
            <div class="text-container">
                <p class="typing">This is some additional text for the new container. The image is placed on the left side.</p>
                <button class="header-button">Learn More</button>
            </div>
        </div>

        <div class="picture-text-container">
            <img src="images/picone.jpg" alt="Additional Image 2" class="coo-picture">
            <div class="text-container">
                <p class="typing">Here is more engaging text for another new container with the image on the left side.</p>
                <button class="header-button">Discover</button>
            </div>
        </div>

        <div class="picture-text-container">
            <img src="images/picone.jpg" alt="Additional Image 3" class="coo-picture">
            <div class="text-container">
                <p class="typing">Yet another container with exciting text and an image on the left side. Enjoy reading!</p>
                <button class="header-button">Explore</button>
            </div>
        </div>

        <div class="slideshow-wrapper">
            <div class="slideshow-container">
                <button class="nav-button prev" onclick="plusSlides(-1)">&#10094;</button>
                <div class="slides">
                    <div class="slide fade">
                        <img src="images/picone.jpg" alt="Picture 1">
                    </div>
                    <div class="slide fade">
                        <img src="images/pictwo.jpg" alt="Picture 2">
                    </div>
                    <div class="slide fade">
                        <img src="images/pic3.jpg" alt="Picture 3">
                    </div>
                </div>
                <button class="nav-button next" onclick="plusSlides(1)">&#10095;</button>
            </div>
        </div>

        <div class="picture-text-container">
            <img src="images/picone.jpg" alt="Small Image" class="cool-picture">
            <div class="text-container">
                <p class="typing">This is some cool text that looks like it's being typed out! You can see it typing and then continue writing more as if it's a typewriter.</p>
                <button class="header-button" id="download">Download</button>
            </div>
        </div>

        <h5>Play Golike!</h5>

        <div class="button-container">
            <div class="button-item">
                <img src="images/icon1.png" alt="Icon A" class="button-icon">
                <p class="button-text">Button A</p>
            </div>
            <div class="button-item">
                <img src="images/icon2.png" alt="Icon B" class="button-icon">
                <p class="button-text">Button B</p>
            </div>
            <div class="button-item">
                <img src="images/icon3.png" alt="Icon C" class="button-icon">
                <p class="button-text">Button C</p>
            </div>
            <div class="button-item">
                <img src="images/icon4.png" alt="Icon D" class="button-icon">
                <p class="button-text">Button D</p>
            </div>
        </div>
    </main>

    <script>
        // JavaScript for custom play/pause button functionality
        document.addEventListener('DOMContentLoaded', function() {
            const video = document.getElementById('customVideo');
            const playButton = document.getElementById('playButton');

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

            video.addEventListener('play', function() {
                playButton.classList.remove('play');
                playButton.classList.add('pause');
            });

            video.addEventListener('pause', function() {
                playButton.classList.remove('pause');
                playButton.classList.add('play');
            });

            playButton.addEventListener('mouseover', function() {
                if (video.paused) {
                    playButton.classList.add('hover');
                }
            });

            playButton.addEventListener('mouseout', function() {
                playButton.classList.remove('hover');
            });
        });
    </script>
    <script src="index.js"></script>
    <script src="indextyp.js"></script>
</body>
</html>
