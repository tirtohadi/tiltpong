# Tilt Pong Game

A modern, web-based Pong game built with HTML5 Canvas and vanilla JavaScript. Features both single-player AI mode and two-player local multiplayer.

## 🎮 Features

### Game Modes
- **1 Player Mode**: Play against AI with adjustable difficulty
- **2 Player Mode**: Local multiplayer for two players

### Customizable Settings
- **Ball Speed**: Adjustable from 3-8 (affects game difficulty)
- **AI Difficulty**: Three levels (Easy, Medium, Hard)

### Controls
- **Player 1**: Arrow keys (↑↓) for up/down movement
- **Player 2**: W/S keys for up/down movement
- **Pause**: Spacebar (during gameplay)

### Game Features
- Smooth 60fps gameplay
- Realistic ball physics with paddle angle reflection
- Progressive ball speed increase during rallies
- Score tracking (first to 11 points wins)
- Responsive design for different screen sizes
- Modern UI with gradient effects and animations

## 🚀 How to Play

1. **Start the Game**: Open `index.html` in a modern web browser
2. **Choose Mode**: Select 1 Player or 2 Player mode
3. **Adjust Settings**: Set ball speed and AI difficulty (1 Player mode only)
4. **Play**: Use the controls to move your paddle and prevent the ball from passing
5. **Win**: First player to reach 11 points wins the match

## 🎯 Game Rules

- The ball bounces off paddles and walls
- Ball speed increases slightly with each paddle hit
- Ball angle changes based on where it hits the paddle
- First player to score 11 points wins
- Ball resets to center after each point

## 🛠️ Technical Details

### Architecture
- **Modular Design**: Separate classes for Ball, Paddle, AI, UI, and Game
- **Canvas Rendering**: HTML5 Canvas for smooth graphics
- **Event-Driven**: Custom event system for UI communication
- **Responsive**: Adapts to different screen sizes

### File Structure
```
eliz_game/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Styling and responsive design
├── js/
│   ├── game.js         # Main game logic and loop
│   ├── ball.js         # Ball physics and collision
│   ├── paddle.js       # Paddle movement and controls
│   ├── ai.js           # AI opponent logic
│   └── ui.js           # UI management and screens
└── README.md           # This file
```

### Key Classes

#### Ball Class
- Handles ball movement and physics
- Collision detection with paddles and walls
- Progressive speed increase
- Angle-based reflection

#### Paddle Class
- Player input handling
- Movement constraints
- Visual rendering with gradients
- Support for both player and AI control

#### AI Class
- Three difficulty levels with different behaviors
- Ball trajectory prediction
- Reaction delays and error simulation
- Intelligent paddle positioning

#### UI Class
- Screen management (splash, game, game over)
- Settings panel handling
- Responsive design
- Event communication

#### PongGame Class
- Main game orchestrator
- Game loop management
- Score tracking
- Game state management

## 🎨 Visual Design

- **Modern UI**: Glassmorphism effects with backdrop blur
- **Gradient Animations**: Animated title with color shifts
- **Glow Effects**: Paddles and ball have subtle glow effects
- **Responsive Layout**: Adapts to mobile and desktop screens
- **Smooth Transitions**: Animated button interactions

## 🌐 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Support

The game is responsive and works on mobile devices, though keyboard controls are optimized for desktop play.

## 🔧 Customization

### Easy Modifications
- **Winning Score**: Change `this.winningScore` in `game.js`
- **Paddle Size**: Modify `width` and `height` in `paddle.js`
- **Ball Size**: Adjust `radius` in `ball.js`
- **Colors**: Update CSS variables in `style.css`

### AI Difficulty Tuning
- **Reaction Delays**: Modify values in `ai.js` `getReactionDelay()`
- **Error Margins**: Adjust `getDifficultyError()` parameters
- **Movement Speed**: Change `getMoveSpeed()` multipliers

## 🎯 Future Enhancements

Potential features for future versions:
- Sound effects and background music
- Power-ups and special abilities
- Tournament mode with brackets
- Online multiplayer
- Custom paddle skins
- Replay system
- Statistics tracking

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy playing Albert's Pong Game!** 🏓
