// Enemy logic for minimal roguelike
// No longer used: enemies are placed from level file
function createEnemies(level) {
  return [];
}

function enemyTurn(game) {
  // Placeholder: enemies do not move yet
  // Implement perception/memory/decision/action pipeline here
  for (const enemy of game.enemies) {
    if (enemy.type === 'sight') {
      game.log.push('You feel watched.');
    } else if (enemy.type === 'hearing') {
      game.log.push('You sense listening.');
    } else if (enemy.type === 'blind') {
      game.log.push('You hear shuffling.');
    }
  }
}

module.exports = { createEnemies, enemyTurn };
