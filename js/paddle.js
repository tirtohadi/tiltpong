class Paddle {
    constructor(canvas, x, isPlayer1 = true) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 15;
        this.height = 80;
        this.x = x;
        this.y = canvas.height / 2 - this.height / 2;
        this.speed = 6;
        this.isPlayer1 = isPlayer1;
        
        // Tilt properties
        this.tilt = 0; // Current tilt angle in degrees
        this.maxTilt = 30; // Maximum tilt angle
        this.tiltSpeed = 2; // Degrees per frame
        
        // Input handling
        this.keys = {
            up: false,
            down: false,
            tiltLeft: false,
            tiltRight: false
        };
        
        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.isPlayer1) {
                // Player 1 controls (W/S for movement, A/D for tilt)
                if (e.key === 'w' || e.key === 'W') {
                    this.keys.up = true;
                    e.preventDefault();
                } else if (e.key === 's' || e.key === 'S') {
                    this.keys.down = true;
                    e.preventDefault();
                } else if (e.key === 'a' || e.key === 'A') {
                    this.keys.tiltLeft = true;
                    e.preventDefault();
                } else if (e.key === 'd' || e.key === 'D') {
                    this.keys.tiltRight = true;
                    e.preventDefault();
                }
            } else {
                // Player 2 controls (Arrow keys for movement and tilt)
                if (e.key === 'ArrowUp') {
                    this.keys.up = true;
                    e.preventDefault();
                } else if (e.key === 'ArrowDown') {
                    this.keys.down = true;
                    e.preventDefault();
                } else if (e.key === 'ArrowLeft') {
                    this.keys.tiltLeft = true;
                    e.preventDefault();
                } else if (e.key === 'ArrowRight') {
                    this.keys.tiltRight = true;
                    e.preventDefault();
                }
            }
        });

        // Add keyup event listener
        document.addEventListener('keyup', (e) => {
            if (this.isPlayer1) {
                if (e.key === 'w' || e.key === 'W') {
                    this.keys.up = false;
                } else if (e.key === 's' || e.key === 'S') {
                    this.keys.down = false;
                } else if (e.key === 'a' || e.key === 'A') {
                    this.keys.tiltLeft = false;
                } else if (e.key === 'd' || e.key === 'D') {
                    this.keys.tiltRight = false;
                }
            } else {
                if (e.key === 'ArrowUp') {
                    this.keys.up = false;
                } else if (e.key === 'ArrowDown') {
                    this.keys.down = false;
                } else if (e.key === 'ArrowLeft') {
                    this.keys.tiltLeft = false;
                } else if (e.key === 'ArrowRight') {
                    this.keys.tiltRight = false;
                }
            }
        });
    }

    update() {
        // Handle movement input
        if (this.keys.up && this.y > 0) {
            this.y -= this.speed;
        }
        if (this.keys.down && this.y + this.height < this.canvas.height) {
            this.y += this.speed;
        }
        
        // Handle tilt input
        if (this.keys.tiltLeft && this.tilt > -this.maxTilt) {
            this.tilt -= this.tiltSpeed;
        }
        if (this.keys.tiltRight && this.tilt < this.maxTilt) {
            this.tilt += this.tiltSpeed;
        }
        
        // Keep paddle within bounds
        this.y = Math.max(0, Math.min(this.canvas.height - this.height, this.y));
        
        // Keep tilt within bounds
        this.tilt = Math.max(-this.maxTilt, Math.min(this.maxTilt, this.tilt));
    }

    // Method for AI control
    aiUpdate(ball, difficulty = 'medium') {
        if (!ball) return;
        
        let targetY = ball.y - this.height / 2;
        let reactionSpeed = this.speed;
        
        // Adjust AI difficulty
        switch (difficulty) {
            case 'easy':
                reactionSpeed = this.speed * 0.6;
                // Add some randomness
                targetY += (Math.random() - 0.5) * 30;
                break;
            case 'medium':
                reactionSpeed = this.speed * 0.8;
                // Small amount of randomness
                targetY += (Math.random() - 0.5) * 15;
                break;
            case 'hard':
                reactionSpeed = this.speed * 1.0;
                // Minimal randomness
                targetY += (Math.random() - 0.5) * 5;
                break;
        }
        
        // Move towards target
        if (this.y + this.height / 2 < targetY && this.y + this.height < this.canvas.height) {
            this.y += reactionSpeed;
        } else if (this.y + this.height / 2 > targetY && this.y > 0) {
            this.y -= reactionSpeed;
        }
        
        // Keep paddle within bounds
        this.y = Math.max(0, Math.min(this.canvas.height - this.height, this.y));
    }

    draw() {
        // Save the current context state
        this.ctx.save();
        
        // Calculate center point for rotation
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // Translate to center, rotate, then translate back
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.tilt * Math.PI / 180);
        this.ctx.translate(-centerX, -centerY);
        
        // Create gradient for paddle
        const gradient = this.ctx.createLinearGradient(
            this.x, this.y, 
            this.x + this.width, this.y
        );
        
        if (this.isPlayer1) {
            gradient.addColorStop(0, '#ff6b6b');
            gradient.addColorStop(1, '#ee5a24');
        } else {
            gradient.addColorStop(0, '#4ecdc4');
            gradient.addColorStop(1, '#45b7d1');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Add glow effect
        this.ctx.shadowColor = this.isPlayer1 ? '#ff6b6b' : '#4ecdc4';
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.shadowBlur = 0;
        
        // Restore the context state
        this.ctx.restore();
    }

    reset() {
        this.y = this.canvas.height / 2 - this.height / 2;
        this.tilt = 0;
    }


}
