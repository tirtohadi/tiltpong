class AI {
    constructor(paddle, difficulty = 'medium') {
        this.paddle = paddle;
        this.difficulty = difficulty;
        this.reactionDelay = 0;
        this.maxReactionDelay = this.getReactionDelay();
    }

    getReactionDelay() {
        switch (this.difficulty) {
            case 'easy':
                return 15; // Slower reaction
            case 'medium':
                return 8;  // Medium reaction
            case 'hard':
                return 2;  // Fast reaction
            default:
                return 8;
        }
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.maxReactionDelay = this.getReactionDelay();
    }

    update(ball) {
        if (!ball || !this.paddle) return;

        // Add reaction delay based on difficulty
        this.reactionDelay++;
        if (this.reactionDelay < this.maxReactionDelay) {
            return;
        }
        this.reactionDelay = 0;

        // Predict where the ball will be when it reaches the paddle
        const predictedY = this.predictBallPosition(ball);
        
        // Add difficulty-based error
        const error = this.getDifficultyError();
        const targetY = predictedY + error;

        // Move paddle towards target
        this.movePaddle(targetY);
        
        // Handle AI tilt
        this.handleTilt(ball);
    }

    predictBallPosition(ball) {
        if (!ball || ball.dx === 0) return this.paddle.canvas.height / 2;

        // Calculate time until ball reaches paddle
        const distanceToPaddle = Math.abs(this.paddle.x - ball.x);
        const timeToPaddle = distanceToPaddle / Math.abs(ball.dx);

        // Predict ball's Y position at that time
        const predictedY = ball.y + (ball.dy * timeToPaddle);

        // Account for wall bounces
        return this.accountForWallBounces(predictedY, timeToPaddle, ball.dy);
    }

    accountForWallBounces(predictedY, timeToPaddle, ballDy) {
        const canvasHeight = this.paddle.canvas.height;
        let finalY = predictedY;
        let remainingTime = timeToPaddle;

        while (remainingTime > 0) {
            if (finalY <= 0) {
                // Ball hits top wall
                finalY = Math.abs(finalY);
                remainingTime -= Math.abs(finalY) / Math.abs(ballDy);
            } else if (finalY >= canvasHeight) {
                // Ball hits bottom wall
                finalY = 2 * canvasHeight - finalY;
                remainingTime -= (finalY - canvasHeight) / Math.abs(ballDy);
            } else {
                // Ball doesn't hit walls
                break;
            }
        }

        return Math.max(0, Math.min(canvasHeight, finalY));
    }

    getDifficultyError() {
        const baseError = 20;
        switch (this.difficulty) {
            case 'easy':
                return (Math.random() - 0.5) * baseError * 2; // More error
            case 'medium':
                return (Math.random() - 0.5) * baseError; // Medium error
            case 'hard':
                return (Math.random() - 0.5) * baseError * 0.3; // Less error
            default:
                return (Math.random() - 0.5) * baseError;
        }
    }

    movePaddle(targetY) {
        const paddleCenter = this.paddle.y + this.paddle.height / 2;
        const distance = targetY - paddleCenter;
        const moveSpeed = this.getMoveSpeed();

        if (Math.abs(distance) > 5) { // Dead zone to prevent jittering
            if (distance > 0 && this.paddle.y + this.paddle.height < this.paddle.canvas.height) {
                this.paddle.y += moveSpeed;
            } else if (distance < 0 && this.paddle.y > 0) {
                this.paddle.y -= moveSpeed;
            }
        }

        // Keep paddle within bounds
        this.paddle.y = Math.max(0, Math.min(this.paddle.canvas.height - this.paddle.height, this.paddle.y));
    }

    getMoveSpeed() {
        const baseSpeed = this.paddle.speed;
        switch (this.difficulty) {
            case 'easy':
                return baseSpeed * 0.7;
            case 'medium':
                return baseSpeed * 0.85;
            case 'hard':
                return baseSpeed * 1.0;
            default:
                return baseSpeed * 0.85;
        }
    }

    // Method to make AI occasionally miss on purpose (for easier difficulties)
    shouldMiss() {
        switch (this.difficulty) {
            case 'easy':
                return Math.random() < 0.15; // 15% chance to miss
            case 'medium':
                return Math.random() < 0.05; // 5% chance to miss
            case 'hard':
                return Math.random() < 0.01; // 1% chance to miss
            default:
                return false;
        }
    }

    // Handle AI tilt based on ball position and difficulty
    handleTilt(ball) {
        if (!ball || !this.paddle) return;

        // Calculate optimal tilt based on ball trajectory
        const ballAngle = Math.atan2(ball.dy, Math.abs(ball.dx));
        const optimalTilt = (ballAngle * 180 / Math.PI) * 0.5; // Scale down the angle
        
        // Add difficulty-based tilt error
        const tiltError = this.getDifficultyError() * 0.1;
        const targetTilt = optimalTilt + tiltError;
        
        // Apply tilt with difficulty-based speed
        const tiltSpeed = this.paddle.tiltSpeed * this.getTiltSpeedMultiplier();
        
        if (this.paddle.tilt < targetTilt - 2) {
            this.paddle.tilt += tiltSpeed;
        } else if (this.paddle.tilt > targetTilt + 2) {
            this.paddle.tilt -= tiltSpeed;
        }
        
        // Keep tilt within bounds
        this.paddle.tilt = Math.max(-this.paddle.maxTilt, Math.min(this.paddle.maxTilt, this.paddle.tilt));
    }

    getTiltSpeedMultiplier() {
        switch (this.difficulty) {
            case 'easy':
                return 0.5; // Slower tilt
            case 'medium':
                return 0.8; // Medium tilt speed
            case 'hard':
                return 1.0; // Full tilt speed
            default:
                return 0.8;
        }
    }
}
