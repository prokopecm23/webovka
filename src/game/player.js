// Player logic for minimal roguelike
// No longer used: player is placed from level file
function createPlayer(level) {
  return null;
}

function playerAction(game, action) {
  const { player, level } = game;
  let dx = 0, dy = 0;
  if (action === 'up')    { dy = -1; player.facing = 'up'; }
  if (action === 'down')  { dy = 1;  player.facing = 'down'; }
  if (action === 'left')  { dx = -1; player.facing = 'left'; }
  if (action === 'right') { dx = 1;  player.facing = 'right'; }
  if (action === 'wait')  { return { log: 'You wait.' }; }
  let nx = player.x + dx, ny = player.y + dy;
  if (level.map[ny] && level.map[ny][nx] === 0) {
    player.x = nx; player.y = ny;
    return { log: `You move ${player.facing}.` };
  }
  return { log: 'You bump into a wall.' };
}

module.exports = { createPlayer, playerAction };
