// Simple space shooter game inspired by Jesse Zhang's website
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const instructionsElement = document.getElementById('instructions');

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
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 15,
    speed: 5,
    dx: 0,
    dy: 0
};
let collectibles = [];
let lastCollectibleTime = 0;

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

// Draw player (spaceship triangle)
function drawPlayer() {
    ctx.fillStyle = '#6366f1';
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(player.x + player.size, player.y);
    ctx.lineTo(player.x - player.size, player.y - player.size / 2);
    ctx.lineTo(player.x - player.size, player.y + player.size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// Create collectible
function createCollectible() {
    collectibles.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 40) + 20,
        size: 8,
        speed: 2
    });
}

// Draw collectibles
function drawCollectibles() {
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;

    collectibles.forEach((collectible, index) => {
        // Draw star shape
        ctx.save();
        ctx.translate(collectible.x, collectible.y);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * collectible.size;
            const y = Math.sin(angle) * collectible.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Move collectible
        collectible.x -= collectible.speed;

        // Check collision
        const dx = player.x - collectible.x;
        const dy = player.y - collectible.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.size + collectible.size) {
            collectibles.splice(index, 1);
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
            
            // Add collect effect
            scoreElement.classList.add('collect-effect');
            setTimeout(() => {
                scoreElement.classList.remove('collect-effect');
            }, 200);
        }

        // Remove if off screen
        if (collectible.x < -20) {
            collectibles.splice(index, 1);
        }
    });
}

// Update player position
function updatePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Boundary checking
    if (player.x < player.size) player.x = player.size;
    if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
    if (player.y < player.size) player.y = player.size;
    if (player.y > canvas.height - player.size) player.y = canvas.height - player.size;
}

// Game loop
function gameLoop(timestamp) {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStars();

    if (gameStarted) {
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
    player.x = canvas.width / 2;
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
