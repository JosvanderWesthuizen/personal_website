// Simple space shooter game inspired by Jesse Zhang's website
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const instructionsElement = document.getElementById('instructions');

// Load images
const shipImg = new Image();
shipImg.src = '../images/game/ship.png';
const coinImg = new Image();
coinImg.src = '../images/game/coin.png';
const fireImg = new Image();
fireImg.src = '../images/game/fire.png';

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = 350; // Match banner height
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game state
let gameStarted = false;
let score = 0;
let stars = [];
let player = {
    x: 100, // Left horizontal position
    y: canvas.height / 2, // Vertical center
    width: 90,
    height: 90,
    speed: 5,
    dx: 0,
    dy: 0
};
let collectibles = [];
let lastCollectibleTime = 0;
let fireParticles = [];
let lastFireTime = 0;

// Create starfield background
function createStars() {
    stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1
        });
    }
}
createStars();

// Draw starfield
function drawStars() {
    ctx.fillStyle = '#fff';
    stars.forEach(star => {
        ctx.globalAlpha = Math.random() * 0.5 + 0.5;
        ctx.fillRect(star.x, star.y, star.size, star.size);

        // Move stars
        star.x -= star.speed;
        if (star.x < 0) {
            star.x = canvas.width;
            star.y = Math.random() * canvas.height;
        }
    });
    ctx.globalAlpha = 1;
}

// Draw player (spaceship image)
function drawPlayer() {
    if (shipImg.complete) {
        ctx.drawImage(shipImg, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    } else {
        // Fallback while image loads
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    }
}

// Create fire particle
function createFireParticle() {
    fireParticles.push({
        x: player.x - player.width / 2, // Start from behind the ship
        y: player.y + (Math.random() - 0.5) * 20, // Slight vertical variance
        width: 45,
        height: 45,
        speed: 3,
        alpha: 1
    });
}

// Draw fire particles
function drawFireParticles() {
    fireParticles.forEach((particle, index) => {
        if (fireImg.complete) {
            ctx.globalAlpha = particle.alpha;
            ctx.drawImage(fireImg, particle.x - particle.width / 2, particle.y - particle.height / 2, particle.width, particle.height);
            ctx.globalAlpha = 1;
        }

        // Move particle left
        particle.x -= particle.speed;
        particle.alpha -= 0.02; // Fade out

        // Remove if off screen or fully faded
        if (particle.x < -50 || particle.alpha <= 0) {
            fireParticles.splice(index, 1);
        }
    });
}

// Create collectible
function createCollectible() {
    collectibles.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 80) + 40,
        width: 40,
        height: 40,
        speed: 2
    });
}

// Draw collectibles
function drawCollectibles() {
    // Iterate backwards to avoid flickering when removing items
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const collectible = collectibles[i];

        if (coinImg.complete) {
            ctx.drawImage(coinImg, collectible.x - collectible.width / 2, collectible.y - collectible.height / 2, collectible.width, collectible.height);
        } else {
            // Fallback while image loads
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(collectible.x, collectible.y, 15, 0, Math.PI * 2);
            ctx.fill();
        }

        // Move collectible
        collectible.x -= collectible.speed;

        // Check collision
        const dx = player.x - collectible.x;
        const dy = player.y - collectible.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (player.width / 2 + collectible.width / 2)) {
            collectibles.splice(i, 1);
            score += 10;
            scoreElement.textContent = `Score: ${score}`;

            // Add collect effect
            scoreElement.classList.add('collect-effect');
            setTimeout(() => {
                scoreElement.classList.remove('collect-effect');
            }, 200);
            continue;
        }

        // Remove if off screen
        if (collectible.x < -50) {
            collectibles.splice(i, 1);
        }
    }
}

// Update player position
function updatePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Boundary checking
    if (player.x < player.width / 2) player.x = player.width / 2;
    if (player.x > canvas.width - player.width / 2) player.x = canvas.width - player.width / 2;
    if (player.y < player.height / 2) player.y = player.height / 2;
    if (player.y > canvas.height - player.height / 2) player.y = canvas.height - player.height / 2;
}

// Game loop
function gameLoop(timestamp) {
    // Clear canvas with motion blur effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStars();

    if (gameStarted) {
        // Spawn fire particles continuously
        if (timestamp - lastFireTime > 250) { // Every 250ms (doubled rate)
            createFireParticle();
            lastFireTime = timestamp;
        }

        drawFireParticles();
        updatePlayer();
        drawPlayer();
        drawCollectibles();

        // Spawn collectibles
        if (timestamp - lastCollectibleTime > 1500) {
            createCollectible();
            lastCollectibleTime = timestamp;
        }
    } else {
        drawPlayer();
    }

    requestAnimationFrame(gameLoop);
}

// Keyboard controls
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    updatePlayerMovement();
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    updatePlayerMovement();
});

function updatePlayerMovement() {
    player.dx = 0;
    player.dy = 0;

    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.dx = -player.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.dx = player.speed;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) player.dy = -player.speed;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) player.dy = player.speed;
}

// Reset game function
function resetGame() {
    gameStarted = false;
    score = 0;
    scoreElement.textContent = 'Score: 0';
    collectibles = [];
    fireParticles = [];
    player.x = 100;
    player.y = canvas.height / 2;
    player.dx = 0;
    player.dy = 0;
    instructionsElement.classList.remove('hidden');
    instructionsElement.textContent = 'Click anywhere to start • Use arrow keys or WASD to move';
}

// Start game on first click, reset on subsequent clicks
document.addEventListener('click', (e) => {
    if (!gameStarted) {
        gameStarted = true;
        instructionsElement.classList.add('hidden');
    } else {
        resetGame();
    }
});

// Start game loop
requestAnimationFrame(gameLoop);
