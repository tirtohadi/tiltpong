class UI {
    constructor() {
        this.splashScreen = document.getElementById('splash-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.startGameScreen = document.getElementById('start-game-screen');
        this.aboutScreen = document.getElementById('about-screen');
        
        this.ballSpeedSlider = document.getElementById('ball-speed');
        this.ballSpeedValue = document.getElementById('ball-speed-value');
        this.aiDifficultySelect = document.getElementById('ai-difficulty');
        this.aiDifficultyGroup = document.getElementById('ai-difficulty-group');
        
        this.onePlayerBtn = document.getElementById('one-player-btn');
        this.twoPlayerBtn = document.getElementById('two-player-btn');
        this.aboutBtn = document.getElementById('about-btn');
        this.backToMenuBtn = document.getElementById('back-to-menu');
        this.backToMenuFromAboutBtn = document.getElementById('back-to-menu-btn');
        
        this.player1Score = document.getElementById('player1-score');
        this.player2Score = document.getElementById('player2-score');
        this.player2Name = document.getElementById('player2-name');
        
        this.gameInstructions = document.getElementById('game-instructions');
        
        this.winnerText = document.getElementById('winner-text');
        this.finalPlayer1Score = document.getElementById('final-player1-score');
        this.finalPlayer2Score = document.getElementById('final-player2-score');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.newGameBtn = document.getElementById('new-game-btn');
        
        this.gameMode = 'one-player';
        this.ballSpeed = 10;
        this.aiDifficulty = 'medium';
        
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Ball speed slider
        this.ballSpeedSlider.addEventListener('input', (e) => {
            this.ballSpeed = parseInt(e.target.value);
            this.ballSpeedValue.textContent = this.ballSpeed;
            // Update ball speed if game is running
            if (window.game && window.game.ball) {
                window.game.ball.setSpeed(this.ballSpeed);
            }
        });

        // AI difficulty select
        this.aiDifficultySelect.addEventListener('change', (e) => {
            this.aiDifficulty = e.target.value;
        });

        // Game mode buttons
        this.onePlayerBtn.addEventListener('click', () => {
            this.gameMode = 'one-player';
            this.updateUI();
        });

        this.twoPlayerBtn.addEventListener('click', () => {
            this.gameMode = 'two-player';
            this.updateUI();
        });

        // About button
        this.aboutBtn.addEventListener('click', () => {
            this.showAboutScreen();
        });

        // Back to menu button
        this.backToMenuBtn.addEventListener('click', () => {
            this.showSplashScreen();
        });

        // Game over buttons
        this.playAgainBtn.addEventListener('click', () => {
            this.hideGameOverScreen();
            // Trigger play again event
            this.triggerEvent('playAgain');
        });

        this.newGameBtn.addEventListener('click', () => {
            this.hideGameOverScreen();
            this.showSplashScreen();
        });

        // Back to menu from about screen
        this.backToMenuFromAboutBtn.addEventListener('click', () => {
            this.hideAboutScreen();
            this.showSplashScreen();
        });
    }

    updateUI() {
        // Show/hide AI difficulty setting based on game mode
        if (this.gameMode === 'one-player') {
            this.aiDifficultyGroup.style.display = 'flex';
            this.player2Name.textContent = 'AI';
            this.gameInstructions.textContent = 'Use W/S to move, A/D to tilt';
        } else {
            this.aiDifficultyGroup.style.display = 'none';
            this.player2Name.textContent = 'Player 2';
            this.gameInstructions.textContent = 'Player 1: W/S (move) | A/D (tilt) | Player 2: ↑↓ (move) | ←→ (tilt)';
        }

        // Update button styles
        this.onePlayerBtn.style.background = this.gameMode === 'one-player' 
            ? 'linear-gradient(45deg, #4ecdc4, #45b7d1)' 
            : 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
        
        this.twoPlayerBtn.style.background = this.gameMode === 'two-player' 
            ? 'linear-gradient(45deg, #4ecdc4, #45b7d1)' 
            : 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
    }

    showSplashScreen() {
        this.splashScreen.classList.remove('hidden');
        this.gameScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
    }

    showGameScreen() {
        this.splashScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.startGameScreen.classList.remove('hidden');
    }

    hideStartScreen() {
        this.startGameScreen.classList.add('hidden');
    }

    showGameOverScreen(winner, player1Score, player2Score) {
        this.winnerText.textContent = winner;
        this.finalPlayer1Score.textContent = player1Score;
        this.finalPlayer2Score.textContent = player2Score;
        
        this.gameOverScreen.classList.remove('hidden');
    }

    hideGameOverScreen() {
        this.gameOverScreen.classList.add('hidden');
    }

    showAboutScreen() {
        this.splashScreen.classList.add('hidden');
        this.aboutScreen.classList.remove('hidden');
    }

    hideAboutScreen() {
        this.aboutScreen.classList.add('hidden');
    }

    updateScore(player1Score, player2Score) {
        this.player1Score.textContent = player1Score;
        this.player2Score.textContent = player2Score;
    }

    getGameSettings() {
        return {
            gameMode: this.gameMode,
            ballSpeed: this.ballSpeed,
            aiDifficulty: this.aiDifficulty
        };
    }

    // Custom event system for communication with game
    triggerEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    // Method to handle window resize
    handleResize() {
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            const container = canvas.parentElement;
            const maxWidth = Math.min(800, window.innerWidth - 40);
            const maxHeight = Math.min(400, window.innerHeight - 200);
            
            const scale = Math.min(maxWidth / 800, maxHeight / 400);
            
            canvas.style.width = (800 * scale) + 'px';
            canvas.style.height = (400 * scale) + 'px';
        }
    }

    // Initialize responsive design
    initResponsive() {
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }
}
