class DinosaurGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.startScreen = document.getElementById('startScreen');
        
        // Set up responsive canvas
        this.setupCanvas();
        
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
            maxJumpHeight: 150
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
    
    setupCanvas() {
        // Make canvas responsive
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            const containerWidth = container.clientWidth;
            const maxWidth = 1200; // Maximum canvas width
            const minWidth = 600;  // Minimum canvas width
            
            // Calculate responsive width
            let canvasWidth = Math.min(containerWidth - 40, maxWidth);
            canvasWidth = Math.max(canvasWidth, minWidth);
            
            // Maintain aspect ratio (3:1 roughly) for bigger canvas
            const canvasHeight = Math.max(300, canvasWidth / 3);
            
            this.canvas.width = canvasWidth;
            this.canvas.height = Math.min(canvasHeight, 500); // Max height 500px (increased from 300px)
            
            // Update ground position
            this.groundY = this.canvas.height - 40;
            
            // Update dinosaur position if game is reset
            if (this.dino) {
                this.dino.y = this.groundY - this.dino.height;
            }
        };
        
        // Initial resize
        resizeCanvas();
        
        // Listen for window resize
        window.addEventListener('resize', resizeCanvas);
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
            
            // Prevent jumping too high (going off screen)
            const maxJumpY = this.groundY - this.dino.height - this.dino.maxJumpHeight;
            if (this.dino.y < maxJumpY) {
                this.dino.y = maxJumpY;
                this.dino.jumpSpeed = 0; // Stop upward movement
            }
            
            // Land on ground
            if (this.dino.y >= this.groundY - this.dino.height) {
                this.dino.y = this.groundY - this.dino.height;
                this.dino.isJumping = false;
                this.dino.jumpSpeed = 0;
            }
        }
    }
    
    createObstacle() {
        // Determine available obstacle types based on score
        let obstacleTypes = ['cactus'];
        
        // Birds only start appearing after score reaches 200
        if (this.score >= 200) {
            obstacleTypes.push('bird');
        }
        
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        
        let obstacle;
        if (type === 'cactus') {
            // Vary cactus height and width for more randomness
            const width = 15 + Math.random() * 15; // 15-30px width
            const height = 25 + Math.random() * 20; // 25-45px height
            obstacle = {
                x: this.canvas.width,
                y: this.groundY - height,
                width: width,
                height: height,
                type: 'cactus'
            };
        } else {
            // Bird obstacle - flies at various heights
            const birdHeight = 15 + Math.random() * 10; // 15-25px height
            const flyHeight = 20 + Math.random() * 60; // 20-80px above ground
            obstacle = {
                x: this.canvas.width,
                y: this.groundY - this.dino.height - flyHeight,
                width: 25,
                height: birdHeight,
                type: 'bird',
                wingOffset: 0 // For wing animation
            };
        }
        this.obstacles.push(obstacle);
    }
    
    updateObstacles() {
        // Create new obstacles with more frequent timing
        this.obstacleTimer++;
        // Reduced randomness in obstacle spacing for more frequent obstacles (50-300px apart)
        const minDistance = 50 + Math.random() * 50; // 50-100px
        const maxDistance = 150 + Math.random() * 150; // 150-300px
        const nextObstacleDistance = minDistance + Math.random() * (maxDistance - minDistance);
        
        if (this.obstacleTimer > nextObstacleDistance) {
            this.createObstacle();
            this.obstacleTimer = 0;
        }
        
        // Update existing obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.gameSpeed;
            
            // Update bird wing animation
            if (this.obstacles[i].type === 'bird') {
                this.obstacles[i].wingOffset = (this.obstacles[i].wingOffset + 1) % 20;
            }
            
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
            if (obstacle.type === 'cactus') {
                // Draw cactus
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // Add some details to make it look more like a cactus
                if (obstacle.width > 20) {
                    this.ctx.fillRect(obstacle.x + 5, obstacle.y - 5, 3, 8);
                    this.ctx.fillRect(obstacle.x + obstacle.width - 8, obstacle.y + 5, 3, 8);
                }
            } else if (obstacle.type === 'bird') {
                // Draw bird body
                this.ctx.fillRect(obstacle.x + 5, obstacle.y + 5, 15, 8);
                
                // Draw bird head
                this.ctx.fillRect(obstacle.x + 18, obstacle.y + 3, 7, 6);
                
                // Draw animated wings
                const wingFlap = obstacle.wingOffset < 10 ? 2 : -2;
                this.ctx.fillRect(obstacle.x + 2, obstacle.y + 7 + wingFlap, 8, 3);
                this.ctx.fillRect(obstacle.x + 15, obstacle.y + 7 + wingFlap, 8, 3);
                
                // Draw beak
                this.ctx.fillRect(obstacle.x + 25, obstacle.y + 5, 2, 2);
            }
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