# Stealth Roguelike

A single-player, turn-based roguelike focused on survival, stealth, and learning enemy behavior through observation. Playable in your browser, powered by Node.js and Express.

## Features
- Multiple enemy types with unique senses and behaviors
- Stealth mechanics (invisible detection, no visible cones/radii)
- Item-based interaction (rocks, bows, etc.)
- Turn-based, grid-based gameplay
- Server-side game logic, browser frontend
- Keyboard controls (WASD/arrows, space to wait, R to restart)
- Message log for narrative feedback

## Getting Started
1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open the printed URL (default: http://localhost:3000) in your browser

## Controls
- Arrow keys / WASD: Move
- Space: Wait
- R: Restart game

## Project Structure
- `src/server.js` - Express server
- `src/game/` - Game logic (level, player, enemy, item)
- `src/public/` - Frontend (HTML/CSS/JS)

## License
MIT
