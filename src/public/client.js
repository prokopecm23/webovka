let sessionId = null;
let gameState = null;

async function newGame() {
  const res = await fetch('/api/new', { method: 'POST' });
  const data = await res.json();
  sessionId = data.id;
  await fetchState();
}

async function fetchState() {
  const res = await fetch(`/api/state?id=${sessionId}`);
  gameState = await res.json();
  render();
}

async function sendAction(action) {
  const res = await fetch('/api/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: sessionId, action })
  });
  gameState = await res.json();
  render();
}


function render() {
  if (!gameState) return;
  const { grid, width, height, rawLines } = gameState;
  const cellSize = 32;
  let html = '';
  if (grid && grid.length && width && height) {
    html = `<table style="border-collapse:collapse;border:3px solid #0ff;background:#111;width:auto;">`;
    for (let y = 0; y < height; y++) {
      html += '<tr>';
      for (let x = 0; x < width; x++) {
        const cell = grid[y][x];
        let style = `width:${cellSize}px;height:${cellSize}px;background:${cell.color};display:flex;align-items:center;justify-content:center;border:1px solid #333;box-sizing:border-box;`;
        let content = '';
        if (cell.type === 'player') {
          if (cell.facing === 'up') content = '▲';
          else if (cell.facing === 'down') content = '▼';
          else if (cell.facing === 'left') content = '◀';
          else if (cell.facing === 'right') content = '▶';
        } else if (cell.type === 'enemy') {
          if (cell.facing === 'up') content = '▲';
          else if (cell.facing === 'down') content = '▼';
          else if (cell.facing === 'left') content = '◀';
          else if (cell.facing === 'right') content = '▶';
        }
        html += `<td style="${style};text-align:center;vertical-align:middle;font-size:1.2em;">${content}</td>`;
      }
      html += '</tr>';
    }
    html += '</table>';
  } else {
    html = '<div style="color:#f44;padding:2em;text-align:center;">Game grid not available.</div>';
  }
  document.getElementById('game').innerHTML = html;
  document.getElementById('log').textContent = gameState.log.join(' ');
  // Debug overlay
  if (window.DEBUG_GRID) {
    let dbg = document.getElementById('debug-grid');
    if (!dbg) {
      dbg = document.createElement('pre');
      dbg.id = 'debug-grid';
      dbg.style = 'color:#0ff;background:#111;padding:1em;position:fixed;top:0;right:0;z-index:1000;max-width:40vw;max-height:40vh;overflow:auto;';
      document.body.appendChild(dbg);
    }
    dbg.textContent = 'Grid size: ' + width + ' x ' + height + '\nSample row: ' + (grid && grid[0] ? JSON.stringify(grid[0]) : 'none');
    if (rawLines) {
      dbg.textContent += '\nRaw level lines:\n' + rawLines.map(l => l.replace(/ /g, '.')).join('\n');
    }
  }
}

document.addEventListener('keydown', e => {
  if (!sessionId) return;
  if (e.key === 'ArrowUp' || e.key === 'w') sendAction('up');
  if (e.key === 'ArrowDown' || e.key === 's') sendAction('down');
  if (e.key === 'ArrowLeft' || e.key === 'a') sendAction('left');
  if (e.key === 'ArrowRight' || e.key === 'd') sendAction('right');
  if (e.key === ' ') sendAction('wait');
  if (e.key === 'r') newGame();
});

window.onload = newGame;
