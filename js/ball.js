class Ball {
    constructor(canvas, speed = 7) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.radius = 8;
        this.baseSpeed = speed; // Store the original speed setting
        this.speed = speed;     // Current speed (can increase during rallies)
        this.reset();
    }

    reset() {
        // Start from center with random direction
        this.resetWithDirection(null);
    }

    resetWithDirection(scoringPlayer) {
        // Reset speed to base speed when a point is scored
        if (scoringPlayer) {
            console.log(`🎯 POINT SCORED by ${scoringPlayer} - Speed: ${this.speed.toFixed(1)} → ${this.baseSpeed}`);
            console.log(`🔍 VELOCITY BEFORE RESET - dx: ${this.dx.toFixed(2)}, dy: ${this.dy.toFixed(2)}, total: ${Math.sqrt(this.dx*this.dx + this.dy*this.dy).toFixed(2)}`);
        } else {
            console.log(`🎯 GAME START - Speed: ${this.speed.toFixed(1)} → ${this.baseSpeed}`);
        }
        this.speed = this.baseSpeed;
        
        // CRITICAL: Reset velocity to zero before serve
        this.dx = 0;
        this.dy = 0;
        console.log(`🔍 VELOCITY AFTER RESET - dx: ${this.dx.toFixed(2)}, dy: ${this.dy.toFixed(2)}`);
        
        // Determine which paddle serves (the one who just scored)
        if (scoringPlayer === 'paddle1') {
            // Paddle 1 scored, so paddle 1 serves (ball starts on paddle 1)
            this.x = 30 + 15 + this.radius; // Paddle 1 x position + width + ball radius
            this.y = this.canvas.height / 2;
            this.servingPlayer = 'paddle1';
        } else if (scoringPlayer === 'paddle2') {
            // Paddle 2 scored, so paddle 2 serves (ball starts on paddle 2)
            this.x = this.canvas.width - 45 - this.radius; // Paddle 2 x position - ball radius
            this.y = this.canvas.height / 2;
            this.servingPlayer = 'paddle2';
        } else {
            // Initial serve, random player serves
            if (Math.random() < 0.5) {
                this.x = 30 + 15 + this.radius;
                this.servingPlayer = 'paddle1';
            } else {
                this.x = this.canvas.width - 45 - this.radius;
                this.servingPlayer = 'paddle2';
            }
            this.y = this.canvas.height / 2;
        }
        
        // Ball is stationary until serve (velocity already reset above)
        this.isServing = true;
        
        // Auto-serve immediately
        this.serve();
    }

    serve() {
        if (!this.isServing) return;
        
        // Random angle with some variation (reduced angle range for more predictable serves)
        const angle = (Math.random() * Math.PI / 4) - Math.PI / 8; // -22.5 to +22.5 degrees
        
        let direction;
        if (this.servingPlayer === 'paddle1') {
            // Paddle 1 serves, ball goes right (toward paddle 2)
            direction = 1;
        } else {
            // Paddle 2 serves, ball goes left (toward paddle 1)
            direction = -1;
        }
        
        // Use the current speed setting (not the accelerated speed)
        const serveSpeed = this.speed;
        console.log(`🎾 SERVE - Using speed: ${serveSpeed} (BaseSpeed: ${this.baseSpeed})`);
        this.dx = direction * serveSpeed * Math.cos(angle);
        this.dy = serveSpeed * Math.sin(angle);
        
        // Ensure minimum vertical speed proportional to serve speed
        const minVerticalSpeed = serveSpeed * 0.2; // 20% of serve speed
        if (Math.abs(this.dy) < minVerticalSpeed) {
            this.dy = this.dy > 0 ? minVerticalSpeed : -minVerticalSpeed;
        }
        
        console.log(`🎾 SERVE VELOCITY - dx: ${this.dx.toFixed(2)}, dy: ${this.dy.toFixed(2)}, total: ${Math.sqrt(this.dx*this.dx + this.dy*this.dy).toFixed(2)}`);
        
        // Record serve timestamp
        this.serveTime = Date.now();
        console.log(`⏰ SERVE TIME - ${new Date().toLocaleTimeString()}.${Date.now() % 1000}`);
        
        this.isServing = false;
    }

    update(paddle1, paddle2) {
        // If ball is serving, don't move it
        if (this.isServing) {
            // Keep ball attached to serving paddle
            if (this.servingPlayer === 'paddle1') {
                this.y = paddle1.y + paddle1.height / 2;
            } else {
                this.y = paddle2.y + paddle2.height / 2;
            }
            return null;
        }

        // Move ball
        this.x += this.dx;
        this.y += this.dy;
        
        // Log ball position every 30 frames (about every half second)
        if (!this.frameCounter) this.frameCounter = 0;
        if (!this.lastLogTime) this.lastLogTime = Date.now();
        
        this.frameCounter++;
        if (this.frameCounter % 30 === 0) {
            const currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            const now = Date.now();
            const timeSinceLastLog = now - this.lastLogTime;
            const actualFPS = Math.round(30000 / timeSinceLastLog);
            console.log(`📍 BALL POSITION - x: ${this.x.toFixed(1)}, y: ${this.y.toFixed(1)}, speed: ${currentSpeed.toFixed(2)}, actualFPS: ${actualFPS}`);
            this.lastLogTime = now;
        }

        // Wall collision (top and bottom)
        if (this.y - this.radius <= 0 || this.y + this.radius >= this.canvas.height) {
            this.dy = -this.dy;
            this.y = Math.max(this.radius, Math.min(this.canvas.height - this.radius, this.y));
        }

        // Paddle collision
        this.checkPaddleCollision(paddle1);
        this.checkPaddleCollision(paddle2);

        // Check if ball is out of bounds
        if (this.x - this.radius <= 0) {
            const outTime = Date.now();
            const duration = this.serveTime ? outTime - this.serveTime : 0;
            console.log(`🏓 BALL OUT - Paddle 2 scores! Ball at x=${this.x.toFixed(1)}`);
            console.log(`⏱️ BALL OUT TIME - ${new Date().toLocaleTimeString()}.${outTime % 1000} (Duration: ${duration}ms)`);
            return 'paddle2'; // Paddle 2 scores
        } else if (this.x + this.radius >= this.canvas.width) {
            const outTime = Date.now();
            const duration = this.serveTime ? outTime - this.serveTime : 0;
            console.log(`🏓 BALL OUT - Paddle 1 scores! Ball at x=${this.x.toFixed(1)}`);
            console.log(`⏱️ BALL OUT TIME - ${new Date().toLocaleTimeString()}.${outTime % 1000} (Duration: ${duration}ms)`);
            return 'paddle1'; // Paddle 1 scores
        }

        return null; // No score
    }

    checkPaddleCollision(paddle) {
        if (!paddle) return;

        // Check if ball is within paddle's x-range
        if (this.x + this.radius >= paddle.x && 
            this.x - this.radius <= paddle.x + paddle.width) {
            
            // Check if ball is within paddle's y-range
            if (this.y + this.radius >= paddle.y && 
                this.y - this.radius <= paddle.y + paddle.height) {
                
                // Calculate collision point on paddle (0 = top, 1 = bottom)
                const collisionPoint = (this.y - paddle.y) / paddle.height;
                
                // Reverse x direction
                this.dx = -this.dx;
                
                // Adjust x position to prevent sticking
                if (this.dx > 0) {
                    this.x = paddle.x + paddle.width + this.radius;
                } else {
                    this.x = paddle.x - this.radius;
                }
                
                // Calculate base angle from collision point
                const baseAngle = (collisionPoint - 0.5) * Math.PI / 2; // -45 to +45 degrees
                
                // Add paddle tilt effect (convert degrees to radians)
                const tiltAngle = paddle.tilt * Math.PI / 180;
                const totalAngle = baseAngle + tiltAngle;
                
                // Increase speed slightly on each hit (before calculating new direction)
                const oldSpeed = this.speed;
                this.speed = Math.min(this.speed * 1.05, 15); // Increased max speed to 15
                console.log(`🏓 PADDLE HIT - Speed: ${oldSpeed.toFixed(1)} → ${this.speed.toFixed(1)}`);
                
                // Apply the combined angle to ball direction using current speed
                this.dy = this.speed * Math.sin(totalAngle);
                
                // Ensure minimum vertical speed
                if (Math.abs(this.dy) < 1) {
                    this.dy = this.dy > 0 ? 1 : -1;
                }
                
                // Update x direction with new speed
                this.dx = this.dx > 0 ? this.speed : -this.speed;
            }
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.closePath();
        
        // Add glow effect
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    setSpeed(speed) {
        console.log(`🔧 SETSPEED - Changing speed from ${this.speed.toFixed(1)} to ${speed} (BaseSpeed was ${this.baseSpeed})`);
        console.log(`🔧 SETSPEED - Current velocity before change: dx=${this.dx.toFixed(2)}, dy=${this.dy.toFixed(2)}, total=${Math.sqrt(this.dx * this.dx + this.dy * this.dy).toFixed(2)}`);
        
        this.baseSpeed = speed; // Update the base speed setting
        this.speed = speed;     // Update current speed
        
        // Update current velocity to match new speed
        const currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        if (currentSpeed > 0) {
            this.dx = (this.dx / currentSpeed) * speed;
            this.dy = (this.dy / currentSpeed) * speed;
            console.log(`🔧 SETSPEED - Velocity updated: dx=${this.dx.toFixed(2)}, dy=${this.dy.toFixed(2)}, total=${Math.sqrt(this.dx * this.dx + this.dy * this.dy).toFixed(2)}`);
        }
        
        console.log(`🔧 SETSPEED DONE - BaseSpeed: ${this.baseSpeed}, Speed: ${this.speed}`);
    }
}
