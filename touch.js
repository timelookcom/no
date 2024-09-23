let isDragging = false;
let touchStartX = 0;
let touchStartY = 0;
let releaseTime = 0;
const fallDelay = 0; // 2 seconds in milliseconds
let isPaused = false;

// Function to start dragging
function startDragging(x, y) {
    isDragging = true;
    touchStartX = x;
    touchStartY = y;
    bird.velocity = 0; // Stop vertical movement while dragging
    isPaused = true; // Pause falling
}

// Handle the start of touch or mouse interaction
function handleStart(event) {
    event.preventDefault();
    let x, y;
    if (event.touches) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } else {
        x = event.clientX;
        y = event.clientY;
    }
    
    // Check if the pointer is on the bird
    if (isTouchingBird(x, y)) {
        startDragging(x, y);
        canvas.addEventListener('touchmove', handleMove);
        canvas.addEventListener('mousemove', handleMove);
        canvas.addEventListener('touchend', handleEnd);
        canvas.addEventListener('mouseup', handleEnd);
    }
}

// Handle the end of touch or mouse interaction
function handleEnd(event) {
    event.preventDefault();
    if (!isDragging) return;
    
    isDragging = false;
    releaseTime = Date.now(); // Record the release time
    isPaused = false; // Resume falling

    canvas.removeEventListener('mousemove', handleMove);
    canvas.removeEventListener('mouseup', handleEnd);
    canvas.removeEventListener('touchmove', handleMove);
    canvas.removeEventListener('touchend', handleEnd);
}

// Smoothly update the bird's position to follow the pointer
function updateBirdPosition(x, y) {
    // Update bird position directly to follow pointer
    bird.x = x - bird.width / 4;
    bird.y = y - bird.height / 4;

    // Ensure the bird stays within canvas bounds
    bird.x = Math.max(0, Math.min(canvas.width - bird.width, bird.x));
    bird.y = Math.max(0, Math.min(canvas.height - bird.height, bird.y));
}

// Handle movement during drag
function handleMove(event) {
    event.preventDefault();
    if (!isDragging) return;

    let x, y;
    if (event.touches) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } else {
        x = event.clientX;
        y = event.clientY;
    }

    // Update bird position directly under pointer
    updateBirdPosition(x, y);
}

// Check if the touch or mouse coordinates are within the bird
function isTouchingBird(x, y) {
    return x >= bird.x && x <= bird.x + bird.width &&
           y >= bird.y && y <= bird.y + bird.height;
}

// Update function for game loop
function update() {
    if (isDragging) {
        return; // Skip falling update while dragging
    }

    // Check if enough time has passed since the release
    if (!isPaused && Date.now() - releaseTime > fallDelay) {
        bird.velocity += bird.gravity; // Resume falling
        bird.y += bird.velocity; // Update position
        bird.velocity = Math.min(bird.velocity, bird.maxFallSpeed); // Limit maximum fall speed
    }
}

// Add event listeners
canvas.addEventListener('touchstart', handleStart);
canvas.addEventListener('mousedown', handleStart);

canvas.addEventListener('touchend', handleEnd);
canvas.addEventListener('mouseup', handleEnd);

canvas.addEventListener('touchmove', handleMove);
canvas.addEventListener('mousemove', handleMove);
