class PongGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ui = new UI();
        
        this.gameRunning = false;
        this.waitingForStart = false;
        this.gameMode = 'one-player';
        this.ballSpeed = 5;
        this.aiDifficulty = 'medium';
        
        this.ball = null;
        this.paddle1 = null;
        this.paddle2 = null;
        this.ai = null;
        
        this.player1Score = 0;
        this.player2Score = 0;
        this.winningScore = 11;
        
        this.setupEventListeners();
        this.ui.initResponsive();
    }

    setupEventListeners() {
        // Listen for game mode selection
        this.ui.onePlayerBtn.addEventListener('click', () => {
            this.startGame();
        });

        this.ui.twoPlayerBtn.addEventListener('click', () => {
            this.startGame();
        });

        // Listen for play again event
        document.addEventListener('playAgain', () => {
            this.resetGame();
            this.startGame();
        });
    }

    startGame() {
        const settings = this.ui.getGameSettings();
        this.gameMode = settings.gameMode;
        this.ballSpeed = settings.ballSpeed;
        this.aiDifficulty = settings.aiDifficulty;

        this.initializeGame();
        this.ui.showGameScreen();
        // Don't start the game loop yet - wait for spacebar
        this.gameRunning = false;
        this.waitingForStart = true;
        this.drawWaitingScreen();
    }

    startGameLoop() {
        this.ui.hideStartScreen();
        this.waitingForStart = false;
        
        // Start with countdown
        this.showCountdown(3, () => {
            this.gameRunning = true;
            this.gameLoop();
        });
    }

    initializeGame() {
        console.log(`[INIT] Initializing game with ball speed: ${this.ballSpeed}`);
        // Create game objects
        this.ball = new Ball(this.canvas, this.ballSpeed);
        this.paddle1 = new Paddle(this.canvas, 30, true); // Left paddle
        this.paddle2 = new Paddle(this.canvas, this.canvas.width - 45, false); // Right paddle

        // Setup AI if in one-player mode
        if (this.gameMode === 'one-player') {
            this.ai = new AI(this.paddle2, this.aiDifficulty);
        }

        // Reset scores
        this.player1Score = 0;
        this.player2Score = 0;
        this.ui.updateScore(this.player1Score, this.player2Score);

        // Reset positions
        this.ball.reset();
        this.paddle1.reset();
        this.paddle2.reset();
    }

    gameLoop() {
        if (!this.gameRunning) return;

        // Prevent multiple game loops with a stronger check
        if (this.animationId) {
            console.log(`🚨 DUPLICATE GAME LOOP DETECTED! Canceling previous loop.`);
            cancelAnimationFrame(this.animationId);
        }

        // Frame rate limiting to 60 FPS
        if (!this.lastFrameTime) this.lastFrameTime = Date.now();
        const now = Date.now();
        const deltaTime = now - this.lastFrameTime;
        
        // Only update if enough time has passed (16.67ms = 60 FPS)
        if (deltaTime >= 16.67) {
            this.update();
            this.draw();
            this.lastFrameTime = now;
        }
        
        // Store animation ID to prevent duplicates
        this.animationId = requestAnimationFrame(() => {
            this.animationId = null;
            this.gameLoop();
        });
    }

    // Draw method for waiting state
    drawWaitingScreen() {
        this.draw();
        requestAnimationFrame(() => this.drawWaitingScreen());
    }

    update() {
        // Update paddles
        this.paddle1.update();
        
        if (this.gameMode === 'one-player') {
            // AI controls paddle2
            this.ai.update(this.ball);
        } else {
            // Player 2 controls paddle2
            this.paddle2.update();
        }



        // Update ball and check for scoring
        const scoringPlayer = this.ball.update(this.paddle1, this.paddle2);
        
        if (scoringPlayer) {
            this.handleScore(scoringPlayer);
        }
    }

    handleScore(scoringPlayer) {
        if (scoringPlayer === 'paddle1') {
            this.player1Score++;
        } else {
            this.player2Score++;
        }

        this.ui.updateScore(this.player1Score, this.player2Score);

        // Check for game over
        if (this.player1Score >= this.winningScore || this.player2Score >= this.winningScore) {
            this.endGame();
        } else {
            // Start countdown for next round
            this.startCountdown(scoringPlayer);
        }
    }

    startCountdown(scoringPlayer) {
        // Pause the game during countdown
        this.gameRunning = false;
        
        // Reset paddles immediately
        this.paddle1.reset();
        this.paddle2.reset();
        
        // Reset ball with direction towards the scoring player (loser serves)
        this.ball.resetWithDirection(scoringPlayer);
        
        // Check if AI is serving (only show countdown for AI)
        // Note: scoringPlayer is who scored, so the other player serves
        const isAIServing = (this.gameMode === 'one-player' && scoringPlayer === 'paddle2');
        
        if (isAIServing) {
            // Show countdown for AI
            this.showCountdown(3, () => {
                // Resume game after countdown
                this.gameRunning = true;
                this.gameLoop();
            });
        } else {
            // No countdown for human players, resume immediately
            this.gameRunning = true;
            this.gameLoop();
        }
    }

    showCountdown(count, callback) {
        if (count > 0) {
            // Display countdown number
            this.displayCountdown(count);
            
            setTimeout(() => {
                this.showCountdown(count - 1, callback);
            }, 500);
        } else {
            // Show "START!" message
            this.displayStartMessage();
            setTimeout(() => {
                this.hideCountdown();
                callback();
            }, 500);
        }
    }

    displayCountdown(number) {
        // Clear canvas and draw countdown
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw center line
        this.drawCenterLine();
        
        // Draw paddles
        this.paddle1.draw();
        this.paddle2.draw();
        
        // Draw ball (stationary)
        this.ball.draw();
        
        // Draw countdown number
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '72px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(number.toString(), this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        // Add "GET READY!" text for initial countdown
        if (this.waitingForStart === false && number === 3) {
            this.ctx.font = '24px Arial';
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.fillText('GET READY!', this.canvas.width / 2, this.canvas.height / 2 - 40);
        }
        

    }



    displayStartMessage() {
        // Clear canvas and draw start message
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw center line
        this.drawCenterLine();
        
        // Draw paddles
        this.paddle1.draw();
        this.paddle2.draw();
        
        // Draw ball (stationary)
        this.ball.draw();
        
        // Draw "START!" message
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '72px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('START!', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    hideCountdown() {
        // Countdown is hidden by normal game drawing
    }

    endGame() {
        this.gameRunning = false;
        
        // Stop the game loop
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        let winner;
        if (this.player1Score >= this.winningScore) {
            winner = this.gameMode === 'one-player' ? 'You Win!' : 'Player 1 Wins!';
        } else {
            winner = this.gameMode === 'one-player' ? 'AI Wins!' : 'Player 2 Wins!';
        }

        this.ui.showGameOverScreen(winner, this.player1Score, this.player2Score);
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw center line
        this.drawCenterLine();

        // Draw game objects
        this.ball.draw();
        this.paddle1.draw();
        this.paddle2.draw();

        // Draw score
        this.drawScore();
    }

    drawCenterLine() {
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }

    drawScore() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        
        // Draw player 1 score
        this.ctx.fillText(this.player1Score.toString(), this.canvas.width / 4, 80);
        
        // Draw player 2 score
        this.ctx.fillText(this.player2Score.toString(), (this.canvas.width / 4) * 3, 80);
    }

    resetGame() {
        this.gameRunning = false;
        this.player1Score = 0;
        this.player2Score = 0;
        
        if (this.ball) {
            this.ball.reset();
        }
        if (this.paddle1) {
            this.paddle1.reset();
        }
        if (this.paddle2) {
            this.paddle2.reset();
        }
    }

    // Method to pause/resume game
    togglePause() {
        if (this.gameRunning) {
            this.gameRunning = false;
        } else {
            this.gameRunning = true;
            this.gameLoop();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new PongGame();
    
    // Make game accessible globally for UI updates
    window.game = game;
    
    // Add spacebar functionality for pause/resume
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            
            if (game.waitingForStart) {
                // Start the game when spacebar is pressed
                game.startGameLoop();
            } else if (game.gameRunning) {
                // Pause/resume the game when spacebar is pressed during gameplay
                game.togglePause();
            }
        }
    });
});
