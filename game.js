const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const playerWidth = 60;
const playerHeight = 60;
const arrowWidth = 10;
const arrowHeight = 30;
const enemyWidth = 60;
const enemyHeight = 60;

const playerImage = new Image();
playerImage.src = 'player.png'; // Image of the player

const enemyImage = new Image();
enemyImage.src = 'enemy.png'; // Image of the enemy

const arrowImage = new Image();
arrowImage.src = 'arrow.png'; // Image of the arrow

let playerX = canvas.width / 2 - playerWidth / 2;
const playerY = canvas.height - playerHeight - 10;

let arrows = [];
let enemies = [];
let score = 0;
let gameRunning = true;

let playerSpeed = 0;
const maxSpeed = 8; // Further increased speed for responsiveness
const acceleration = 2;
const friction = 0.85; // Reduced friction for smoother movement

function drawPlayer() {
    ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
}

function drawArrow(arrow) {
    ctx.drawImage(arrowImage, arrow.x, arrow.y, arrowWidth, arrowHeight);
}

function drawEnemy(enemy) {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemyWidth, enemyHeight);
}

function moveArrows() {
    for (let i = 0; i < arrows.length; i++) {
        arrows[i].y -= 8; // Faster arrow speed
        if (arrows[i].y < 0) {
            arrows.splice(i, 1);
        }
    }
}

function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += 3; // Keep enemy speed slightly challenging
        if (enemies[i].y > canvas.height) {
            gameRunning = false;
            alert(`Game Over! Your Score: ${score}`);
            document.location.reload();
        }
    }
}

function detectCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        for (let j = 0; j < arrows.length; j++) {
            if (
                arrows[j].x < enemies[i].x + enemyWidth &&
                arrows[j].x + arrowWidth > enemies[i].x &&
                arrows[j].y < enemies[i].y + enemyHeight &&
                arrows[j].y + arrowHeight > enemies[i].y
            ) {
                enemies.splice(i, 1);
                arrows.splice(j, 1);
                score += 10;
                return;
            }
        }
    }
}

function generateEnemy() {
    const randomX = Math.floor(Math.random() * (canvas.width - enemyWidth));
    enemies.push({ x: randomX, y: 0 });
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Score: " + score, 10, 30);
}

function updatePlayerPosition() {
    playerX += playerSpeed;
    playerSpeed *= friction; // Apply friction for smooth stopping

    // Keep player within the canvas bounds
    if (playerX < 0) playerX = 0;
    if (playerX > canvas.width - playerWidth) playerX = canvas.width - playerWidth;
}

function draw() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    moveArrows();
    arrows.forEach(drawArrow);
    moveEnemies();
    enemies.forEach(drawEnemy);
    detectCollisions();
    drawScore();

    updatePlayerPosition(); // Smooth movement update

    requestAnimationFrame(draw);
}

function shootArrow() {
    arrows.push({ x: playerX + playerWidth / 2 - arrowWidth / 2, y: playerY });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        playerSpeed = Math.max(playerSpeed - acceleration, -maxSpeed); // Accelerate left
    } else if (e.key === 'ArrowRight') {
        playerSpeed = Math.min(playerSpeed + acceleration, maxSpeed); // Accelerate right
    } else if (e.key === ' ') {
        shootArrow(); // Shoot arrow when space is pressed
    }
});

canvas.addEventListener('touchstart', function(e) {
    const touchX = e.touches[0].clientX;
    if (touchX < canvas.width / 2) {
        playerSpeed = Math.max(playerSpeed - acceleration, -maxSpeed); // Move left
    } else {
        playerSpeed = Math.min(playerSpeed + acceleration, maxSpeed); // Move right
    }
});

canvas.addEventListener('touchend', function() {
    shootArrow(); // Shoot arrow on touch release
});

setInterval(generateEnemy, 1000);
draw();
