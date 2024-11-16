const gridContainer = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");

let grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let score = 0;

// Initialize the game
function initGame() {
  grid = grid.map(row => row.map(() => 0));
  score = 0;
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

function slideAndCombine(row) {
  let newRow = row.filter(value => value !== 0);
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      score += newRow[i];
      newRow[i + 1] = 0;
    }
  }
  newRow = newRow.filter(value => value !== 0);
  while (newRow.length < 4) newRow.push(0);
  return newRow;
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
  grid = grid.map(slideAndCombine);
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
  alert(`Game Over! Your final score is ${score}`);
  initGame();
}

// Touch events for mobile
let touchStartX = 0, touchStartY = 0;
document.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
document.addEventListener("touchend", e => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    move(deltaX > 0 ? "right" : "left");
  } else {
    move(deltaY > 0 ? "down" : "up");
  }
});

// Initialize game on load
initGame();
