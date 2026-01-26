// Main game logic entry point
const { generateLevel } = require('./level');
const { createPlayer, playerAction } = require('./player');
const { createEnemies, enemyTurn } = require('./enemy');
const { createItems, itemAction } = require('./item');

function createGame() {
  const level = generateLevel();
  // Parse entities from level.rawLines
  let player = null;
  let enemies = [];
  let items = [];
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      const ch = level.rawLines[y][x];
      if (ch === '@') {
        player = { x, y, facing: 'right', hp: 3, inventory: [] };
      } else if (ch === 'E') {
        enemies.push({ x, y, type: 'sight', facing: 'left', memory: null });
      } else if (ch === 'H') {
        enemies.push({ x, y, type: 'hearing', facing: 'up', memory: null });
      } else if (ch === 'B') {
        enemies.push({ x, y, type: 'blind', facing: 'down', memory: null });
      } else if (ch === 'e') {
        enemies.push({ x, y, type: 'sight', facing: 'right', memory: null });
      } else if (ch === 'h') {
        enemies.push({ x, y, type: 'hearing', facing: 'down', memory: null });
      } else if (ch === 'b') {
        enemies.push({ x, y, type: 'blind', facing: 'up', memory: null });
      } else if (ch === 'r') {
        items.push({ x, y, type: 'rock', used: false });
      }
    }
  }
  // Fallback if no player found
  if (!player) player = { x: 2, y: 2, facing: 'right', hp: 3, inventory: [] };
  return {
    level,
    player,
    enemies,
    items,
    log: ['You enter the dungeon...'],
    over: false
  };
}

function handlePlayerAction(game, action) {
  if (game.over) return;
  const result = playerAction(game, action);
  if (result && result.log) game.log.push(result.log);
  enemyTurn(game);
}


function getGameState(game) {
  return {
    grid: renderGrid(game),
    width: game.level.width,
    height: game.level.height,
    log: game.log.slice(-3),
    rawLines: game.level.rawLines
  };
}

function renderGrid(game) {
  const { level, player, enemies, items } = game;
  let grid = [];
  for (let y = 0; y < level.height; y++) {
    let row = [];
    for (let x = 0; x < level.width; x++) {
      let cell = level.map[y][x];
      let obj = { type: 'floor', color: '#222' };
      if (cell === 1) obj = { type: 'wall', color: '#444' };
      if (items.some(i => i.x === x && i.y === y && !i.used)) obj = { type: 'item', color: '#ff0' };
      let enemy = enemies.find(e => e.x === x && e.y === y);
      if (enemy) {
        if (enemy.type === 'sight') obj = { type: 'enemy', color: '#e74c3c', facing: enemy.facing };
        else if (enemy.type === 'hearing') obj = { type: 'enemy', color: '#3498db', facing: enemy.facing };
        else if (enemy.type === 'blind') obj = { type: 'enemy', color: '#95a5a6', facing: enemy.facing };
      }
      if (player.x === x && player.y === y) obj = { type: 'player', color: '#2ecc40', facing: player.facing };
      row.push(obj);
    }
    grid.push(row);
  }
  return grid;
}

module.exports = { createGame, handlePlayerAction, getGameState };
