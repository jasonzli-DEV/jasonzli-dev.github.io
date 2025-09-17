# Dinosaur Game

A recreation of the Google Chrome "No Internet" dinosaur game (T-Rex Runner) built with HTML5, CSS, and JavaScript.

## Features

- **Enhanced Gameplay**: Jump higher over taller obstacles with improved dinosaur jumping mechanics
- **Dynamic Obstacles**: Cacti are now taller (40-70px) and flying birds appear at higher altitudes (30-130px above ground)
- **Progressive Challenge**: Obstacles spawn closer together as your score increases, making the game increasingly difficult
- **Bird Obstacles**: Flying birds start appearing at 1000 points (increased challenge threshold)
- **Scoring System**: Earn points for each obstacle avoided, with persistent high score tracking
- **Progressive Difficulty**: Game speed increases as your score gets higher
- **Smooth Game Flow**: Single press restart from game over - no double press needed
- **Frozen Game Over**: Clouds freeze during game over state for better visual feedback
- **Responsive Design**: Works on desktop and mobile devices
- **Authentic Look**: Enhanced recreation of the original Chrome game aesthetic
- **🎮 CrazyGames Integration**: 
  - **Ad-Based Revives**: Watch ads to continue playing after game over (up to 3 revives per session)
  - **Cloud High Score Storage**: High scores are saved using CrazyGames data storage with localStorage fallback
  - **Cross-Platform Sync**: Your high scores sync across devices when playing on CrazyGames platform

## How to Play

1. Open `index.html` in your web browser
2. Press **SPACE** or **↑** (up arrow) to start the game
3. Press **SPACE** or **↑** to make the dinosaur jump over obstacles (enhanced jump height!)
4. Avoid hitting the cacti and flying birds to keep playing
5. Birds start appearing at 1000 points for added challenge
6. Obstacles get closer together as your score increases
7. Try to beat your high score!
8. **On CrazyGames**: When you die, click "Watch Ad to Continue" to revive and keep playing (up to 3 times per session)

## Game Controls

- **SPACE** or **↑**: Jump (enhanced height) / Start game / Instant restart after game over
- **Click**: Alternative way to jump (mouse/touch)

## Technical Details

- Built with vanilla JavaScript (no external dependencies)
- HTML5 Canvas for smooth 60fps animations
- CrazyGames SDK v3 integration for enhanced platform features
- Local storage for persistent high score tracking with cloud sync fallback
- Responsive CSS design
- Object-oriented game architecture
- Progressive web app compatible

## Files

- `index.html` - Main game page
- `style.css` - Game styling and responsive design
- `game.js` - Complete game logic and rendering

## Live Demo

Simply open `index.html` in any modern web browser to play the game.

## Screenshots

![Game Start Screen](https://github.com/user-attachments/assets/894289f1-1ccd-4514-822a-dca82c0f9f31)

![Game Over Screen](https://github.com/user-attachments/assets/6dcb14c3-0e3e-43a7-8fc9-7afe1b964988)