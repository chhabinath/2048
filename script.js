const gridContainer = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");

let grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let score = 0;

// Initialize game
function initGame() {
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
  grid.forEach((row) => {
    row.forEach((value) => {
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
  const newRow = row.filter((val) => val !== 0); // Remove all zeros
  while (newRow.length < 4) newRow.push(0); // Add zeros to the end
  return newRow;
}

function combine(row) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  return row;
}

function slideAndCombine(row) {
  row = slide(row);
  row = combine(row);
  return slide(row);
}

function rotateGrid(grid) {
  return grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]).reverse());
}

function handleMove(direction) {
  let moved = false;

  if (direction === "up" || direction === "down") {
    grid = rotateGrid(grid);
  }

  grid = grid.map((row) => {
    const originalRow = [...row];
    const newRow = direction === "right" || direction === "down" ? slideAndCombine(row.reverse()).reverse() : slideAndCombine(row);
    if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) moved = true;
    return newRow;
  });

  if (direction === "up" || direction === "down") {
    grid = rotateGrid(grid).reverse();
  }

  if (moved) {
    addRandomTile();
    drawGrid();
  }

  checkGameOver();
}

function checkGameOver() {
  const moves = ["left", "right", "up", "down"];
  const isMovable = moves.some((direction) => {
    const tempGrid = JSON.parse(JSON.stringify(grid));
    handleMove(direction);
    const hasMoved = JSON.stringify(grid) !== JSON.stringify(tempGrid);
    grid = tempGrid; // Revert grid
    return hasMoved;
  });

  if (!isMovable) {
    alert(`Game Over! Final Score: ${score}`);
    resetGame();
  }
}

function resetGame() {
  grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;
  initGame();
}

// Touch support for swipe gestures
let touchStartX = 0, touchStartY = 0;
document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
document.addEventListener("touchend", (e) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    handleMove(deltaX > 0 ? "right" : "left");
  } else {
    handleMove(deltaY > 0 ? "down" : "up");
  }
});

// Initialize game
initGame();
