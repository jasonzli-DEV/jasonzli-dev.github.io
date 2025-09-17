class DinosaurGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.startScreen = document.getElementById('startScreen');
        
        // Game state
        this.gameState = 'start'; // 'start', 'playing', 'gameOver'
        this.gameSpeed = 6;
        this.score = 0;
        this.highScore = localStorage.getItem('dinoHighScore') || 0;
        
        // Ground
        this.groundY = this.canvas.height - 40;
        this.groundX = 0;
        
        // Dinosaur
        this.dino = {
            x: 50,
            y: this.groundY - 50,
            width: 40,
            height: 50,
            jumpHeight: 0,
            isJumping: false,
            jumpSpeed: 0,
            gravity: 1.2,
            maxJumpHeight: 100
        };
        
        // Obstacles
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.minObstacleDistance = 200;
        this.maxObstacleDistance = 400;
        
        // Clouds (background decoration)
        this.clouds = [];
        
        this.init();
    }
    
    init() {
        this.updateHighScore();
        this.createClouds();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                this.handleJump();
            }
        });
        
        this.canvas.addEventListener('click', () => {
            this.handleJump();
        });
    }
    
    handleJump() {
        if (this.gameState === 'start') {
            this.startGame();
        } else if (this.gameState === 'playing' && !this.dino.isJumping) {
            this.jump();
        } else if (this.gameState === 'gameOver') {
            this.resetGame();
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.startScreen.classList.add('hidden');
    }
    
    jump() {
        if (!this.dino.isJumping) {
            this.dino.isJumping = true;
            this.dino.jumpSpeed = -18;
        }
    }
    
    updateDinosaur() {
        if (this.dino.isJumping) {
            this.dino.jumpSpeed += this.dino.gravity;
            this.dino.y += this.dino.jumpSpeed;
            
            // Land on ground
            if (this.dino.y >= this.groundY - this.dino.height) {
                this.dino.y = this.groundY - this.dino.height;
                this.dino.isJumping = false;
                this.dino.jumpSpeed = 0;
            }
        }
    }
    
    createObstacle() {
        const obstacle = {
            x: this.canvas.width,
            y: this.groundY - 30,
            width: 20,
            height: 30,
            type: 'cactus'
        };
        this.obstacles.push(obstacle);
    }
    
    updateObstacles() {
        // Create new obstacles
        this.obstacleTimer++;
        if (this.obstacleTimer > this.minObstacleDistance + Math.random() * (this.maxObstacleDistance - this.minObstacleDistance)) {
            this.createObstacle();
            this.obstacleTimer = 0;
        }
        
        // Update existing obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.gameSpeed;
            
            // Remove off-screen obstacles
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
                this.score += 10;
            }
        }
    }
    
    createClouds() {
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: 20 + Math.random() * 50,
                width: 30 + Math.random() * 20,
                height: 15 + Math.random() * 10,
                speed: 0.5 + Math.random() * 1
            });
        }
    }
    
    updateClouds() {
        for (let cloud of this.clouds) {
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.canvas.width;
                cloud.y = 20 + Math.random() * 50;
            }
        }
    }
    
    updateGround() {
        this.groundX -= this.gameSpeed;
        if (this.groundX <= -24) {
            this.groundX = 0;
        }
    }
    
    checkCollisions() {
        for (let obstacle of this.obstacles) {
            if (this.dino.x < obstacle.x + obstacle.width &&
                this.dino.x + this.dino.width > obstacle.x &&
                this.dino.y < obstacle.y + obstacle.height &&
                this.dino.y + this.dino.height > obstacle.y) {
                this.gameOver();
                return;
            }
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.gameOverScreen.classList.remove('hidden');
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('dinoHighScore', this.highScore);
            this.updateHighScore();
        }
    }
    
    resetGame() {
        this.gameState = 'start';
        this.gameOverScreen.classList.add('hidden');
        this.startScreen.classList.remove('hidden');
        this.score = 0;
        this.gameSpeed = 6;
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.dino.y = this.groundY - this.dino.height;
        this.dino.isJumping = false;
        this.dino.jumpSpeed = 0;
    }
    
    updateScore() {
        if (this.gameState === 'playing') {
            this.score++;
            this.scoreElement.textContent = this.score.toString().padStart(5, '0');
            
            // Increase game speed gradually
            if (this.score % 100 === 0) {
                this.gameSpeed += 0.5;
            }
        }
    }
    
    updateHighScore() {
        this.highScoreElement.textContent = this.highScore.toString().padStart(5, '0');
    }
    
    drawDinosaur() {
        this.ctx.fillStyle = '#535353';
        
        // Body
        this.ctx.fillRect(this.dino.x, this.dino.y + 20, 25, 25);
        
        // Head
        this.ctx.fillRect(this.dino.x + 20, this.dino.y, 20, 20);
        
        // Eye
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.dino.x + 30, this.dino.y + 5, 3, 3);
        this.ctx.fillStyle = '#535353';
        
        // Legs (simple animation)
        const legOffset = Math.floor(Date.now() / 100) % 10 > 5 ? 2 : 0;
        this.ctx.fillRect(this.dino.x + 5, this.dino.y + 45, 3, 5);
        this.ctx.fillRect(this.dino.x + 15 + legOffset, this.dino.y + 45, 3, 5);
        
        // Tail
        this.ctx.fillRect(this.dino.x - 5, this.dino.y + 25, 8, 3);
    }
    
    drawObstacles() {
        this.ctx.fillStyle = '#535353';
        for (let obstacle of this.obstacles) {
            // Draw cactus
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // Add some details to make it look more like a cactus
            this.ctx.fillRect(obstacle.x + 5, obstacle.y - 5, 3, 8);
            this.ctx.fillRect(obstacle.x + 12, obstacle.y + 5, 3, 8);
        }
    }
    
    drawGround() {
        this.ctx.fillStyle = '#535353';
        
        // Draw ground line
        this.ctx.fillRect(0, this.groundY, this.canvas.width, 2);
        
        // Draw ground pattern (dashes)
        for (let x = this.groundX; x < this.canvas.width; x += 24) {
            this.ctx.fillRect(x, this.groundY + 5, 12, 2);
        }
    }
    
    drawClouds() {
        this.ctx.fillStyle = '#d3d3d3';
        for (let cloud of this.clouds) {
            // Simple cloud shape using rectangles
            this.ctx.fillRect(cloud.x, cloud.y, cloud.width * 0.6, cloud.height);
            this.ctx.fillRect(cloud.x + cloud.width * 0.2, cloud.y - cloud.height * 0.3, cloud.width * 0.6, cloud.height);
            this.ctx.fillRect(cloud.x + cloud.width * 0.4, cloud.y, cloud.width * 0.6, cloud.height);
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background elements
        this.drawClouds();
        this.drawGround();
        
        // Draw game elements
        this.drawDinosaur();
        this.drawObstacles();
    }
    
    update() {
        if (this.gameState === 'playing') {
            this.updateDinosaur();
            this.updateObstacles();
            this.updateGround();
            this.updateScore();
            this.checkCollisions();
        }
        
        this.updateClouds();
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new DinosaurGame();
});