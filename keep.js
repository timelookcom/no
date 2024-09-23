const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GLOBAL_HIGH_SCORE = "100"; // Global high score
const lavaHeight = 20; // Height of the lava
const lavaColor = '#FF4500'; // Lava color (orange-red)
const lavaBubbleColor = '#FF6347'; // Lava bubble color (tomato)
const pipeWidth = 110;
const pipeGap = 200;
const initialPipeFrequency = 34;
const speedMultiplier = 30; 
let pipeFrequency = initialPipeFrequency;
const initialPipeSpeed = 13;
let pipeSpeed = initialPipeSpeed;
const donutSize = 20;
let backgroundColor = '#202020';
let color = 'white';
let lastTime = 0;
const bird = {
    x: canvas.width / 4,
    y: canvas.height / 2,
    width: 40,
    height: 30,
    gravity: 0.2,
    lift: -9,
    velocity: 9,
    liftAcceleration: -0.95,
    fallAcceleration: 0.53,
    maxFallSpeed: 120,
    isLifting: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false,
    invincible: false,
    invincibleEnd: 0,
    speed: 5, // Set a speed for horizontal movement
};

// Function to update the bird's position
function updateBird() {
    // Handle vertical movement
    if (bird.isLifting) {
        bird.velocity += bird.liftAcceleration;
    } else {
        bird.velocity += bird.fallAcceleration;
    }
    bird.velocity = Math.min(bird.velocity, bird.maxFallSpeed);
    bird.y += bird.velocity;

    // Handle horizontal movement
    if (bird.moveLeft) {
        bird.x -= bird.speed;
    }
    if (bird.moveRight) {
        bird.x += bird.speed;
    }

    // Optional: Keep the bird within canvas bounds
    bird.x = Math.max(0, Math.min(canvas.width - bird.width, bird.x));
}

// Example of handling key presses
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        bird.moveLeft = true;
    }
    if (event.key === 'ArrowRight') {
        bird.moveRight = true;
    }
    if (event.key === ' ') { // Space key for lift
        bird.isLifting = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        bird.moveLeft = false;
    }
    if (event.key === 'ArrowRight') {
        bird.moveRight = false;
    }
    if (event.key === ' ') { // Space key to stop lifting
        bird.isLifting = false;
    }
});



const pipes = [];
const donuts = [];
let frame = 0;
let score = 0;
let lives = 50;
let collectedDonuts = 0;
let gameOver = false;
let userHighScore = 0;
let fireworks = [];
let gamePaused = false;
let fireworksDisplayed = false;
let lavaParticles = [];
let eyeBlinkPhase = 0; // Initialize eye blink phase

async function fetchUserHighScore() {
    try {
        const storedHighScore = localStorage.getItem('userHighScore');
        userHighScore = storedHighScore ? parseInt(storedHighScore, 10) : 0;
    } catch (error) {
        console.error('Error fetching user high score:', error);
    }
}

function saveUserHighScore(score) {
    // Save the high score to localStorage
    localStorage.setItem('userHighScore', score);
}

async function updateUserHighScore(newScore) {
    try {
        // Check if the new score is higher than the stored high score
        if (newScore > userHighScore) {
            userHighScore = newScore; // Update the high score variable
            saveUserHighScore(userHighScore); // Save it to localStorage
        }
    } catch (error) {
        console.error('Error updating user high score:', error);
    }
}

// Example of how to call this function
function onGameEnd(finalScore) {
    // Call this function when the game ends, passing the final score
    updateUserHighScore(finalScore);
}

// Load the high score when the game starts
fetchUserHighScore();


function createLavaParticles() {
    lavaParticles = [];
    for (let i = 0; i < 90; i++) {
        lavaParticles.push({
            x: Math.random() * canvas.width,
            y: canvas.height - lavaHeight + Math.random() * 20,
            radius: Math.random() * 0 + 0, // Small initial radius
            speed: Math.random() * 0.5 + 0.5,
            angle: Math.random() * Math.PI * 2,
            color: lavaBubbleColor,
            alpha: Math.random() * 0.5 + 0.5,
            finished: false,
            bubbleRiseSpeed: Math.random() * 0.9 + 0.9,
            bubbleSizeChange: Math.random() * 0.1 // Very minimal size change
        });
    }
}
const numBobbles = 60; // Number of bobbles in the trail
const bobbleTrail = []; // Array to store bobble trail positions
const bobbleSpeed = 0.04; // Speed for the bobble movement

// Adjusted to smaller size for bobbles
const minBobbleRadius = 4;
const maxBobbleRadius = 4;

// Define emission points along the left side, adjusted to right side of the bird
const emissionPoints = [
    { x: 30, y: -15 },
    { x: 15, y: -10 },
    { x: 20, y: -5 },
    { x: 25, y: 0 },
    { x: 30, y: 5 },
    { x: 35, y: 10 },
    { x: 25, y: 15 },
    { x: 15, y: 20 },
    { x: 20, y: 25 }
];

let mouthAnimationPhase = 0; // Phase for animating the mouth

function initializeBobble() {
    // Initialize the bobble trail array with starting positions
    for (let i = 0; i < numBobbles; i++) {
        const emissionPoint = emissionPoints[Math.floor(Math.random() * emissionPoints.length)];
        bobbleTrail.push({
            x: bird.x - bird.width / 2 + emissionPoint.x, // Emit from one of the adjusted points
            y: bird.y + emissionPoint.y,
            radius: Math.random() * (maxBobbleRadius - minBobbleRadius) + minBobbleRadius, // Smaller radius
            color: getRandomBlueGradientColor(), // Blue gradient color for each bobble
            fizzTime: Math.random() * 304 + 30, // Random fizz time
            velocityX: Math.random() * 23 - 13, // Random horizontal velocity
            velocityY: Math.random() * 23 - 133 // Random vertical velocity, allowing for more varied movement
        });
    }
}

function getRandomBlueGradientColor() {
    // Generate a blue gradient color
    const baseColor = getRandomBlueColor();
    const lighterColor = getLighterBlueColor(baseColor);
    return { color1: baseColor, color2: lighterColor };
}

function getRandomBlueColor() {
    // Generate a random shade of blue
    const blueShades = ['#1E90FF', '#00BFFF', '#87CEFA', '#4682B4', '#ADD8E6'];
    return blueShades[Math.floor(Math.random() * blueShades.length)];
}

function getLighterBlueColor(baseColor) {
    // Make a lighter shade of the given blue color
    const color = baseColor.substring(1); // Remove #
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Increase brightness by 20% to get a lighter shade
    const lighten = (value) => Math.min(255, Math.round(value * 1.2)).toString(16).padStart(2, '0');
    
    return `#${lighten(r)}${lighten(g)}${lighten(b)}`;
}

function drawBobble() {
    // Update the position of the bobbles
    for (let i = 0; i < bobbleTrail.length; i++) {
        // Move each bobble according to its velocity
        bobbleTrail[i].x += bobbleTrail[i].velocityX * bobbleSpeed;
        bobbleTrail[i].y += bobbleTrail[i].velocityY * bobbleSpeed;

        // Apply fizz effect
        bobbleTrail[i].fizzTime -= 10;
        bobbleTrail[i].radius += Math.sin(bobbleTrail[i].fizzTime / 105) * 0.4; // Fizzing effect by altering size
        bobbleTrail[i].radius = Math.max(minBobbleRadius, bobbleTrail[i].radius); // Ensure radius does not go below minimum

        // Draw the bobble trail with gradient color and sparkle effect
        const { color1, color2 } = bobbleTrail[i].color;
        const gradient = ctx.createRadialGradient(bobbleTrail[i].x, bobbleTrail[i].y, 5, bobbleTrail[i].x, bobbleTrail[i].y, bobbleTrail[i].radius);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);

        ctx.beginPath();
        ctx.arc(bobbleTrail[i].x, bobbleTrail[i].y, bobbleTrail[i].radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add sparkle effect
        if (Math.random() < 0.1) { // 10% chance to add sparkle
            const sparkleRadius = bobbleTrail[i].radius * 0.3;
            const sparkleColor = 'white';
            ctx.beginPath();
            ctx.arc(bobbleTrail[i].x + Math.random() * 4 - 2, bobbleTrail[i].y + Math.random() * 4 - 2, sparkleRadius, 0, 2 * Math.PI);
            ctx.fillStyle = sparkleColor;
            ctx.fill();
        }
    }

    // Add a new bobble to the trail
    const newEmissionPoint = emissionPoints[Math.floor(Math.random() * emissionPoints.length)];
    bobbleTrail.unshift({
        x: bird.x - bird.width / 1.4 + newEmissionPoint.x, // Emit from one of the adjusted points
        y: bird.y + newEmissionPoint.y,
        radius: Math.random() * (maxBobbleRadius - minBobbleRadius) + minBobbleRadius,
        color: getRandomBlueGradientColor(),
        fizzTime: Math.random() * 503 + 200, // Random fizz time for new bobble
        velocityX: Math.random() * -100 - 10, // Random horizontal velocity
        velocityY: Math.random() * 20 - 10 // Random vertical velocity, allowing for more varied movement
    });

    // Remove the oldest bobble from the trail if exceeding the limit
    if (bobbleTrail.length > numBobbles) {
        bobbleTrail.pop();
    }
}


let blinkTimer = 0; // Timer to keep track of time
const blinkInterval = 5 * 1000; // 5 seconds in milliseconds
const blinkDuration = 200; // Duration of the blink in milliseconds
const blinkSpeed = 0.5; // Speed of the blink animation

function drawBird(frame) {
    const ovalWidth = Math.min(bird.width, bird.height) / 1.5; // Width of the oval
    const ovalHeight = ovalWidth / 1.5; // Height of the oval

    const eyeRadius = ovalWidth * 0.2;
    const eyeOffsetX = ovalWidth * 0.35;
    const eyeOffsetY = -ovalHeight * 0.25;

    // Create a linear gradient for the bird body from blue to light cyan
    const gradient = ctx.createLinearGradient(-ovalWidth / 2, 0, ovalWidth / 2, 0);
    gradient.addColorStop(0, '#87CEFA'); // Soft blue on the left
    gradient.addColorStop(1, '#E0FFFF'); // Light cyan on the right

    // Draw the oval
    ctx.save();
    ctx.translate(bird.x + bird.width / 20, bird.y + bird.height / 2);
    ctx.rotate(bird.velocity / 10);

    // Glow effect
    ctx.shadowColor = 'rgba(224, 255, 255, 0.8)'; // Light cyan glow
    ctx.shadowBlur = 30; // Enhanced glow effect

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, ovalWidth, ovalHeight, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Animate the Pac-Man mouth to simulate eating
    const mouthAnimationSpeed = 0.1;
    const mouthAmplitude = 0.4 * Math.PI; // How much the mouth opens and closes
    const mouthPhase = Math.sin(mouthAnimationPhase) * mouthAmplitude;

    const mouthStartAngle = 0.2 * Math.PI - mouthPhase; // Animated start angle
    const mouthEndAngle = 1.8 * Math.PI + mouthPhase; // Animated end angle
    const mouthRadius = ovalWidth / 2;

    ctx.fillStyle = gradient; // Use the same gradient for the mouth
    ctx.beginPath();
    ctx.arc(0, 0, mouthRadius, mouthStartAngle, mouthEndAngle, false); // Draw the mouth arc
    ctx.lineTo(0, 0); // Connect to the center
    ctx.closePath();
    ctx.fill();

    // Update the mouth animation phase
    mouthAnimationPhase += mouthAnimationSpeed;
    if (mouthAnimationPhase > 2 * Math.PI) {
        mouthAnimationPhase -= 2 * Math.PI;
    }

    // Draw the single eye with timed blinking effect
    const currentTime = Date.now();
    if (currentTime - blinkTimer >= blinkInterval) {
        // Start the blink animation
        eyeBlinkPhase = 0; // Reset blink phase to start a new blink
        blinkTimer = currentTime; // Reset blink timer
    }

    // Calculate the blinking effect
    const eyeBlinkAmplitude = eyeRadius * 0.2; // Amount the eye closes
    const blinkHeight = Math.abs(Math.sin(eyeBlinkPhase) * eyeBlinkAmplitude);
    const adjustedEyeRadius = eyeRadius - blinkHeight;

    // If blinking, ensure the eye closes quickly
    if (currentTime - blinkTimer < blinkDuration) {
        eyeBlinkPhase += blinkSpeed;
        if (eyeBlinkPhase > Math.PI) {
            eyeBlinkPhase = Math.PI;
        }
    } else {
        eyeBlinkPhase += blinkSpeed * 0.5; // Slower phase when not blinking
        if (eyeBlinkPhase > 2 * Math.PI) {
            eyeBlinkPhase -= 2 * Math.PI;
        }
    }

    // Draw the eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(eyeOffsetX, eyeOffsetY, eyeRadius, eyeRadius, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Draw the eye's pupil
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(eyeOffsetX, eyeOffsetY, adjustedEyeRadius * 0.5, 0, 2 * Math.PI);
    ctx.fill();

    // Add reflection to the eye
    const reflectionSize = adjustedEyeRadius * 0.1; // Adjusted size for a single reflection
    const reflectionOffsetX = eyeOffsetX + adjustedEyeRadius * 0.3;
    const reflectionOffsetY = eyeOffsetY - adjustedEyeRadius * 0.3;

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(reflectionOffsetX, reflectionOffsetY, reflectionSize, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();

    // Draw the bobble effect
    drawBobble();
}

// Initialize bobble when the script loads
initializeBobble();
function drawPipes() {
    const now = Date.now();

    pipes.forEach(pipe => {
        const isHorizontal = pipe.isHorizontal || false;

        // Create a sophisticated gradient for the pipes
        const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        gradient.addColorStop(0, '#00CFFF'); // Light Cyan
        gradient.addColorStop(0.25, '#00B2FF'); // Sky Blue
        gradient.addColorStop(0.5, '#0044FF'); // Royal Blue
        gradient.addColorStop(0.75, '#8A2BE2'); // Blue Violet
        gradient.addColorStop(1, '#FF00FF'); // Magenta

        // Create an intricate texture pattern with animated effects
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = 100;
        patternCanvas.height = 100;
        const patternCtx = patternCanvas.getContext('2d');

        // Draw a radial gradient for the base texture
        const baseGradient = patternCtx.createRadialGradient(50, 50, 10, 50, 50, 50);
        baseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        baseGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        baseGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        patternCtx.fillStyle = baseGradient;
        patternCtx.fillRect(0, 0, 100, 100);

        // Draw animated lines and shapes for additional texture
        patternCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        patternCtx.lineWidth = 5;
        const lineOffset = (now * 0.01) % 100;
        patternCtx.beginPath();
        for (let i = -50; i < 150; i += 20) {
            patternCtx.moveTo(i + lineOffset, 0);
            patternCtx.lineTo(i + lineOffset + 100, 100);
        }
        patternCtx.stroke();

        // Draw animated circles
        patternCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        patternCtx.lineWidth = 2;
        const circleOffset = (now * 0.005) % 100;
        patternCtx.beginPath();
        for (let i = 10; i < 100; i += 40) {
            patternCtx.arc(50, 50, i + circleOffset, 0, Math.PI * 2);
        }
        patternCtx.stroke();

        const pattern = ctx.createPattern(patternCanvas, 'repeat');

        ctx.save(); // Save the current context state

        if (isHorizontal) {
            // Draw horizontal pipe with pattern
            ctx.fillStyle = pattern;
            ctx.fillRect(pipe.x, pipe.y, pipeWidth, pipeHeight);

            // Add dynamic glow effect
            const glowTime = now * 0.001;
            const glowBlur = Math.sin(glowTime) * 259 + 35; // Dynamic glow blur
            ctx.shadowColor = 'rgba(0, 255, 255, 0.8)'; // Neon Cyan glow color
            ctx.shadowBlur = glowBlur;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // Draw the pipe with gradient effect
            ctx.fillStyle = gradient;
            ctx.fillRect(pipe.x, pipe.y, pipeWidth, pipeHeight);

            // Add detailed edge effects with animated highlights
            const highlightTime = now * 0.002;
            const highlightOffset = Math.sin(highlightTime) * 8;
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)'; // Yellow highlight
            ctx.lineWidth = 4;

            // Draw glowing edges along the horizontal pipe
            ctx.beginPath();
            ctx.moveTo(pipe.x + highlightOffset, pipe.y);
            ctx.lineTo(pipe.x + highlightOffset + pipeWidth, pipe.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pipe.x + highlightOffset, pipe.y + pipeHeight);
            ctx.lineTo(pipe.x + highlightOffset + pipeWidth, pipe.y + pipeHeight);
            ctx.stroke();
        } else {
            // Draw vertical pipe with pattern
            ctx.fillStyle = pattern;
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top); // Top pipe
            ctx.fillRect(pipe.x, canvas.height - pipe.bottom - lavaHeight, pipeWidth, pipe.bottom); // Bottom pipe

            // Add dynamic glow effect
            const glowTime = now * 0.001;
            const glowBlur = Math.sin(glowTime) * 25 + 35; // Dynamic glow blur
            ctx.shadowColor = 'rgba(0, 255, 255, 0.8)'; // Neon Cyan glow color
            ctx.shadowBlur = glowBlur;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // Draw the pipes with gradient effect
            ctx.fillStyle = gradient;
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top); // Top pipe
            ctx.fillRect(pipe.x, canvas.height - pipe.bottom - lavaHeight, pipeWidth, pipe.bottom); // Bottom pipe

            // Add detailed edge effects with animated highlights
            const highlightTime = now * 0.002;
            const highlightOffset = Math.sin(highlightTime) * 8;
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)'; // Yellow highlight
            ctx.lineWidth = 4;

            // Draw glowing edges along the top pipe
            ctx.beginPath();
            ctx.moveTo(pipe.x + highlightOffset, 0);
            ctx.lineTo(pipe.x + highlightOffset + pipeWidth, 0);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pipe.x + highlightOffset, pipe.top);
            ctx.lineTo(pipe.x + highlightOffset + pipeWidth, pipe.top);
            ctx.stroke();

            // Draw glowing edges along the bottom pipe
            ctx.beginPath();
            ctx.moveTo(pipe.x + highlightOffset, canvas.height - pipe.bottom - lavaHeight);
            ctx.lineTo(pipe.x + highlightOffset + pipeWidth, canvas.height - pipe.bottom - lavaHeight);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pipe.x + highlightOffset, canvas.height - pipe.bottom - lavaHeight + pipe.bottom);
            ctx.lineTo(pipe.x + highlightOffset + pipeWidth, canvas.height - pipe.bottom - lavaHeight + pipe.bottom);
            ctx.stroke();
        }

        ctx.restore(); // Restore the context to avoid affecting other drawings
    });
}



function drawDonuts() {
    ctx.fillStyle = donutColor;
    donuts.forEach(donut => {
        ctx.beginPath();
        ctx.arc(donut.x, donut.y, donutSize, 0, 2 * Math.PI); // Draw donut circle
        ctx.fill();
    });
}

function updateDonuts() {
    // Move donuts to the left
    donuts.forEach(donut => {
        donut.x -= 3; // Adjust speed as needed
    });

    // Remove donuts that have moved off the screen
    donuts = donuts.filter(donut => donut.x + donutSize > 0);
}





// Example function to add a new donut
function addDonut() {
    donuts.push({
        x: canvas.width, // Start off-screen
        y: Math.random() * (canvas.height - donutSize) + donutSize // Random Y position
    });
}

// Helper function to create a gradient for the pipes
function createPipeGradient(x, y, width, height, color1, color2) {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

function drawDonuts() {
    ctx.fillStyle = 'white';
    donuts.forEach(donut => {
        const outerRadius = donut.outerRadius; // Outer radius of the donut
        const innerRadius = donut.innerRadius; // Inner radius (hole) of the donut
        
        // Draw the outer circle of the donut
        ctx.beginPath();
        ctx.arc(donut.x, donut.y, outerRadius, 0, 2 * Math.PI); // Full circle
        ctx.fill();
        
        // Draw the inner circle (hole) of the donut
        ctx.globalCompositeOperation = 'destination-out'; // Make the hole transparent
        ctx.beginPath();
        ctx.arc(donut.x, donut.y, innerRadius, 0, 2 * Math.PI); // Full circle for the hole
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over'; // Reset to default
    });
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGradientBackground();
    drawLava(); // Draw lava before other elements
    drawBird();
    drawPipes();
    drawDonuts();
    drawFireworks();
    drawScore();
}
function gameLoop() {
    if (!gamePaused && !gameOver) {
        frame++;
        updateBird();
        updateLavaParticles();
        updatePipes();
        updateFireworks();
        draw();
        gameLoopId = requestAnimationFrame(gameLoop); // Continue the game loop
    }
}

function drawFireworks() {
    fireworks.forEach(firework => {
        ctx.fillStyle = firework.color;
        ctx.globalAlpha = firework.alpha;
        ctx.beginPath();
        ctx.arc(firework.x, firework.y, firework.radius, 0, 2 * Math.PI);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}
function drawLava() {
    // Draw the lava background with a sophisticated gradient for depth and movement
    const backgroundGradient = ctx.createLinearGradient(0, canvas.height - lavaHeight, 0, canvas.height);
    backgroundGradient.addColorStop(0, '#FF6600'); // Dark orange
    backgroundGradient.addColorStop(0.3, '#FF3300'); // Bright orange
    backgroundGradient.addColorStop(0.6, '#FF0000'); // Red
    backgroundGradient.addColorStop(1, '#990000'); // Dark red
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, canvas.height - lavaHeight, canvas.width, lavaHeight);

    lavaParticles.forEach(particle => {
        // Create a sophisticated radial gradient for each particle
        let gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
        gradient.addColorStop(0, `rgba(255, 255, 0, ${particle.alpha})`); // Bright yellow
        gradient.addColorStop(0.4, `rgba(255, 150, 0, ${particle.alpha})`); // Orange
        gradient.addColorStop(0.8, `rgba(200, 0, 0, ${particle.alpha})`); // Dark red
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fade out

        // Draw particle with gradient
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        ctx.globalAlpha = 1; // Reset global alpha to default

        // Update particle properties for a dynamic and realistic effect
        particle.y -= particle.bubbleRiseSpeed; // Move particle up
        particle.radius += particle.bubbleSizeChange; // Increase size
        particle.alpha -= 0.02; // Fade out

        // Draw particle trails with additional blending
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x - particle.radius * 0.5, particle.y + particle.radius * 0.5);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = particle.radius * 0.3;
        ctx.stroke();

        // Add sparkle and reflection effects
        if (Math.random() < 0.1) {
            ctx.beginPath();
            ctx.arc(particle.x + Math.random() * 10 - 5, particle.y + Math.random() * 10 - 5, Math.random() * 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Sparkle
            ctx.fill();
        }

        // Add a ripple effect to simulate lava movement
        const rippleFrequency = 0.01;
        const rippleAmplitude = 23;
        const rippleOffset = Math.sin(Date.now() * rippleFrequency + particle.x * rippleFrequency) * rippleAmplitude;
        ctx.beginPath();
        ctx.arc(particle.x + rippleOffset, particle.y + rippleOffset, particle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = particle.radius * 0.2;
        ctx.stroke();

        // Reset particles if they move out of view or become too small
        if (particle.y + particle.radius < canvas.height - lavaHeight || particle.alpha <= 0) {
            particle.x = Math.random() * canvas.width;
            particle.y = canvas.height - lavaHeight + Math.random() * 20;
            particle.radius = Math.random() * 6 + 4; // Reset size with variation
            particle.alpha = Math.random() * 0.5 + 0.5; // Reset alpha
            particle.bubbleRiseSpeed = Math.random() * 1.5 + 0.5; // Reset rise speed
            particle.bubbleSizeChange = Math.random() * 0.4; // Reset size change
        }
    });
}


function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Lives: ${lives}`, 20, 60);
    ctx.fillText(`Donuts Collected: ${collectedDonuts}`, 20, 90);
    ctx.fillText(`User High Score: ${userHighScore}`, 20, 120);
    ctx.fillText(`Global High Score: ${GLOBAL_HIGH_SCORE}`, 20, 150);
}



function updateBird() {
    // Handle vertical movement (up and down)
    if (bird.isLifting) {
        bird.velocity = Math.max(bird.velocity + bird.liftAcceleration, bird.lift);
    } else {
        bird.velocity += bird.gravity;
        if (bird.moveDown) bird.velocity += bird.fallAcceleration;
    }

    // Limit the maximum fall speed
    bird.velocity = Math.min(bird.velocity, bird.maxFallSpeed);
    // Update vertical position
    bird.y += bird.velocity;

    // Handle horizontal movement (left and right)
    if (bird.moveLeft) {
        bird.x -= bird.speed;
        // Prevent going off the left edge
        if (bird.x < 0) bird.x = 0;
    }
    if (bird.moveRight) {
        bird.x += bird.speed;
        // Prevent going off the right edge
        if (bird.x + bird.width > canvas.width) bird.x = canvas.width - bird.width;
    }

    // Prevent the bird from going below the lava or above the top edge
    if (bird.y + bird.height > canvas.height - lavaHeight) {
        bird.y = canvas.height - lavaHeight - bird.height;
        bird.velocity = 0;
    }
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = Math.max(bird.velocity, 0);
    }

    // Handle invincibility
    if (bird.invincible && frame > bird.invincibleEnd) {
        bird.invincible = false;
    }
}


function updatePipes() {
    if (frame % pipeFrequency === 0) {
        generateNewPipe();
        if (Math.random() < 0.1) {
            generateDonut();
        }
    }
    function updateClouds() {
        clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.width < 0) {
                cloud.x = canvas.width; // Wrap around to the right side
            }
        });
    }
    

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
        if (pipe.x + pipeWidth < 0) {
            handlePipePassed(pipe);
        }
    });

    function checkCollisions() {
        pipes.forEach(pipe => {
            // Check collision with the pipes
            if (!bird.invincible && bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
                (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom - lavaHeight)) {
                // Collision with the lava
                if (bird.y + bird.height > canvas.height - lavaHeight) {
                    handleLavaCollision();
                }
            }
        });
    
        donuts.forEach((donut, index) => {
            if (bird.x < donut.x + donutSize &&
                bird.x + bird.width > donut.x &&
                bird.y < donut.y + donutSize &&
                bird.y + bird.height > donut.y) {
                collectedDonuts++;
                donuts.splice(index, 1);
                if (collectedDonuts % 10 === 0) {
                    lives++;
                }
            }
        });
    }
    
    function handleLavaCollision() {
        lives--;
        if (lives <= 0) {
            gameOver = true;
            if (score > userHighScore) {
                updateUserHighScore(score);
            }
            fireworksDisplayed = false;
            gamePaused = true;
            showGameOverPopup(score);
        } else {
            bird.invincible = true;
            bird.invincibleEnd = frame + 10;
            bird.y = canvas.height / 200;
            bird.velocity = 0;
        }
    }
    
}

function updateFireworks() {
    fireworks.forEach(firework => {
        firework.radius += firework.expansionRate;
        firework.alpha -= firework.fadeRate;
        if (firework.alpha <= 0) {
            firework.finished = true;
        }
    });
    fireworks = fireworks.filter(firework => !firework.finished);
}

function drawGradientBackground() {

    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#050234'); // Light Sky Blue
    gradient.addColorStop(.9, '#00BFFF'); // Deep Sky Blue
    gradient.addColorStop(1, '#357763'); // Steel Blue

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}





let isGameLoopRunning = false;
function gameLoop() {
    if (isGameLoopRunning && !gamePaused && !gameOver) {
        frame++;
        updateBird();
        updatePipes();
        updateFireworks();
        updateClouds(); // Update clouds
        draw(); // Clear and redraw everything
        gameLoopId = requestAnimationFrame(gameLoop); // Continue the game loop
    }
}



// Ensure game loop starts only if it's not already running
function startGameLoop() {
    if (!isGameLoopRunning) {
        isGameLoopRunning = true;
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

function stopGameLoop() {
    isGameLoopRunning = false;
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
}


function stopGameLoop() {
    isGameLoopRunning = false;
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
}


// Stop the game loop when needed
function gameLoop() {
    if (isGameLoopRunning && !gamePaused && !gameOver) {
        frame++;
        updateBird();
        updatePipes();
        updateFireworks();
        draw();
        gameLoopId = requestAnimationFrame(gameLoop); // Continue the game loop
    }

}
function resetGame() {
    bird.x = canvas.width / 4;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    donuts.length = 0;
    score = 0;
    collectedDonuts = 0;
    lives = 5;
    backgroundColor = '#202020'; // Ensure background color is reset
    fireworks = [];
    gamePaused = false;
    fireworksDisplayed = false;
    pipeSpeed = initialPipeSpeed; // Ensure pipe speed is reset
    pipeFrequency = initialPipeFrequency; // Ensure pipe frequency is reset
    frame = 0; // Reset frame counter
    gameOver = false;
    hideAllPopups();
    createLavaParticles();
    startGameLoop(); // Ensure the game loop starts
}


function generateNewPipe() {
    const topPipeHeight = Math.random() * (canvas.height / 2);
    const bottomPipeHeight = canvas.height - topPipeHeight - pipeGap;
    pipes.push({ x: canvas.width, top: topPipeHeight, bottom: bottomPipeHeight });
}

function generateDonut() {
    donuts.push({
        x: canvas.width + donutSize + 10,
        y: Math.random() * (canvas.height - donutSize * 2 - lavaHeight) + donutSize
    });
}

function handlePipePassed(pipe) {
    pipes.shift(); // Remove the passed pipe from the array
    score++; // Increment score
    if (score % 10 === 0) {
        pipeSpeed += 0.1; // Increase pipe speed
        pipeFrequency = Math.max(pipeFrequency - 2, 50); // Decrease pipe frequency
    }
    if (score >= GLOBAL_HIGH_SCORE && !fireworksDisplayed) {
        fireworksDisplayed = true;
        gamePaused = true;
        showRecordPopup(); // Show record popup if a global high score is achieved
        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'brown', 'lime'];
        colors.forEach(color => {
            fireworks.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                radius: 0,
                expansionRate: 10,
                fadeRate: 0.02,
                color: color,
                alpha: 1,
                finished: false
            });
        });
    }
}

function checkCollisions() {
    pipes.forEach(pipe => {
        // Check collision with pipes
        if (!bird.invincible && bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom - lavaHeight)) {
            handleLavaCollision(); // Handle collision with the lava or pipe
        }
    });

    // Check if the bird hits the lava
    if (!bird.invincible && bird.y + bird.height > canvas.height - lavaHeight) {
        handleLavaCollision();
    }

    // Check if the bird falls below the bottom of the canvas
    if (!bird.invincible && bird.y + bird.height > canvas.height) {
        handleLavaCollision(); // Handle collision with the bottom of the canvas
    }

    // Check for collisions with donuts
    donuts.forEach((donut, index) => {
        if (bird.x < donut.x + donutSize &&
            bird.x + bird.width > donut.x &&
            bird.y < donut.y + donutSize &&
            bird.y + bird.height > donut.y) {
            collectedDonuts++;
            donuts.splice(index, 1);
            if (collectedDonuts % 10 === 0) {
                lives++;
            }
        }
    });
}

function handleLavaCollision() {
    if (!bird.invincible) {
        lives--; // Deduct a life
        if (lives <= 0) {
            gameOver = true; // End the game if lives are depleted
            if (score > userHighScore) {
                updateUserHighScore(score); // Update user high score if needed
            }
            fireworksDisplayed = false;
            gamePaused = true;
            showGameOverPopup(score); // Show the game over popup
        } else {
            bird.invincible = true; // Make bird temporarily invincible
            bird.invincibleEnd = frame + 150; // Set end time for invincibility
            bird.y = canvas.height / 2; // Reset bird position
            bird.velocity = 0; // Stop the bird's movement
        }
    }
}

// Ensure pipes are generated correctly
function generateNewPipe() {
    const topPipeHeight = Math.random() * (canvas.height / 2);
    const bottomPipeHeight = canvas.height - topPipeHeight - pipeGap;
    pipes.push({ x: canvas.width, top: topPipeHeight, bottom: bottomPipeHeight });
}

// Update pipes and check collisions
function updatePipes() {
    if (frame % pipeFrequency === 0) {
        generateNewPipe();
        if (Math.random() < 0.1) {
            generateDonut();
        }
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed; // Move pipes to the left
        if (pipe.x + pipeWidth < 0) {
            handlePipePassed(pipe); // Handle pipes that move out of view
        }
    });

    checkCollisions(); // Check for collisions
}

// Handle passing of pipes
function handlePipePassed(pipe) {
    pipes.shift(); // Remove the passed pipe from the array
    score++; // Increment score
    if (score % 10 === 0) {
        pipeSpeed += 0.1; // Increase pipe speed
        pipeFrequency = Math.max(pipeFrequency - 2, 50); // Decrease pipe frequency
    }
    if (score >= GLOBAL_HIGH_SCORE && !fireworksDisplayed) {
        fireworksDisplayed = true;
        gamePaused = true;
        showRecordPopup(); // Show record popup if a global high score is achieved
        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'brown', 'lime'];
        colors.forEach(color => {
            fireworks.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                radius: 0,
                expansionRate: 10,
                fadeRate: 0.02,
                color: color,
                alpha: 1,
                finished: false
            });
        });
    }
}


const recordPopup = document.getElementById('recordPopup');
const gameOverPopup = document.getElementById('gameOverPopup');
const recordOkButton = document.getElementById('recordOkButton');
const restartButton = document.getElementById('restartButton');
const pauseButton = document.getElementById('pauseButton');
const overlay = document.getElementById('overlay');



document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowUp') bird.isLifting = true;
    if (event.code === 'ArrowDown') bird.moveDown = true;
    if (event.code === 'ArrowLeft') bird.moveLeft = true; // Move left
    if (event.code === 'ArrowRight') bird.moveRight = true; // Move right
    if (event.code === 'KeyR') resetGame();
    if (event.code === 'Escape') togglePause();
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowUp') bird.isLifting = false;
    if (event.code === 'ArrowDown') bird.moveDown = false;
    if (event.code === 'ArrowLeft') bird.moveLeft = false; // Stop moving left
    if (event.code === 'ArrowRight') bird.moveRight = false; // Stop moving right
});

pauseButton.addEventListener('click', () => {
    togglePause();
});


recordOkButton.addEventListener('click', () => {
    window.location.href = 'newPage.html'; // Change 'newPage.html' to your desired URL
});

restartButton.addEventListener('click', () => {
    resetGame();
    gameLoop();
});
let gameLoopId; // Variable to store the requestAnimationFrame ID

function togglePause() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        stopGameLoop(); // Stop game loop on pause
    } else {
        startGameLoop(); // Restart game loop on unpause
    }
}


function gameLoop() {
    if (!gamePaused && !gameOver) {
        frame++;
        updateBird();
        updatePipes();
        updateFireworks();
        draw();
        gameLoopId = requestAnimationFrame(gameLoop); // Continue the game loop
    }
}


async function startGame() {
    // Load the saved high score
    await fetchUserHighScore();

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reset game variables
    gameOver = false;
    score = 0;
    lives = 5;
    collectedDonuts = 0;
    pipes.length = 0;
    donuts.length = 0;
    fireworks.length = 0;
    pipeSpeed = initialPipeSpeed;
    pipeFrequency = initialPipeFrequency;
    fireworksDisplayed = false;
    gamePaused = false;

    // Create lava particles for visual effects
    createLavaParticles();

    // Start the game loop
    requestAnimationFrame(gameLoop);
}

function showRecordPopup() {
    recordPopup.style.display = 'block';
    overlay.style.display = 'flex';
}

function hideRecordPopup() {
    recordPopup.style.display = 'none';
    overlay.style.display = 'none';
}

function showGameOverPopup(finalScore) {
    document.getElementById('finalScore').textContent = finalScore;
    gameOverPopup.style.display = 'block';
    overlay.style.display = 'flex';
}

function hideGameOverPopup() {
    gameOverPopup.style.display = 'none';
    overlay.style.display = 'none';
}

function hideAllPopups() {
    hideRecordPopup();
    hideGameOverPopup();
}

startGame();