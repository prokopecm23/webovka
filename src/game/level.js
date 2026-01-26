// Level generation from text file
const fs = require('fs');
const path = require('path');

function parseLevelFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let lines = raw.trim().split(/\r?\n/).map(line => line.replace(/\s+$/, ''));
  // Only use the first line for the level
  lines = [lines[0]];
  const height = 1;
  const width = lines[0].length;
  let map = [];
  let row = [];
  for (let x = 0; x < width; x++) {
    const ch = lines[0][x];
    if (ch === '#') row.push(1); // wall
    else row.push(0); // floor or entity
  }
  map.push(row);
  return { map, width, height, rawLines: lines };
}

function generateLevel() {
  // Always load level1.txt for now
  const filePath = path.join(__dirname, 'level1.txt');
  return parseLevelFile(filePath);
}

module.exports = { generateLevel };
