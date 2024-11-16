const gridContainer = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const gameOverDisplay = document.getElementById("game-over");

let grid = [];
let score = 0;

// Initialize the game
function initGame() {
  grid = Array(4)
    .fill(null)
    .map(() => Array(4).fill(0));
  score = 0;
  gameOverDisplay.style.display = "none";
  addRandomTile();
  addRandomTile();
  drawGrid();
}

function addRandomTile() {
  const emptyCells = [];
  grid.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) => {
      if (cell === 0) emptyCells.push({ row: rowIndex, col: colIndex });
    })
  );

  if (emptyCells.length > 0) {
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function drawGrid() {
  gridContainer.innerHTML = "";
  grid.forEach(row => {
    row.forEach(value => {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.value = value;
      tile.textContent = value === 0 ? "" : value;
      gridContainer.appendChild(tile);
    });
  });
  scoreDisplay.textContent = `Score: ${score}`;
}

function slide(row) {
  const nonZeroTiles = row.filter(val => val !== 0);
  const mergedRow = [];
  while (nonZeroTiles.length > 0) {
    if (nonZeroTiles.length > 1 && nonZeroTiles[0] === nonZeroTiles[1]) {
      mergedRow.push(nonZeroTiles[0] * 2);
      score += nonZeroTiles[0] * 2;
      nonZeroTiles.shift();
    } else {
      mergedRow.push(nonZeroTiles[0]);
    }
    nonZeroTiles.shift();
  }
  while (mergedRow.length < 4) mergedRow.push(0);
  return mergedRow;
}

function rotateGrid(grid) {
  return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]).reverse());
}

function move(direction) {
  let rotated = false;
  if (direction === "up" || direction === "down") {
    grid = rotateGrid(grid);
    rotated = true;
  }
  if (direction === "down" || direction === "right") {
    grid = grid.map(row => row.reverse());
  }

  const oldGrid = JSON.stringify(grid);
  grid = grid.map(slide);
  if (direction === "down" || direction === "right") {
    grid = grid.map(row => row.reverse());
  }
  if (rotated) {
    grid = rotateGrid(grid).reverse();
  }

  if (JSON.stringify(grid) !== oldGrid) {
    addRandomTile();
  }
  drawGrid();
  checkGameOver();
}

function checkGameOver() {
  if (grid.flat().includes(0)) return;

  const directions = ["left", "right", "up", "down"];
  for (const direction of directions) {
    const tempGrid = JSON.parse(JSON.stringify(grid));
    move(direction);
    if (JSON.stringify(grid) !== JSON.stringify(tempGrid)) {
      grid = tempGrid; // Restore grid
      return;
    }
  }
  gameOverDisplay.style.display = "block";
}

// Swipe functionality for touch
let startX = 0,
  startY = 0;
document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    move(dx > 0 ? "right" : "left");
  } else {
    move(dy > 0 ? "down" : "up");
  }
});

// Restart game on game-over tap
gameOverDisplay.addEventListener("click", initGame);

// Initialize the game
initGame();
