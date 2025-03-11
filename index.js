import Ship from "./modules/ship.js";
import Gameboard from "./modules/gameboard.js";
import Player from "./modules/player.js";

const startBtn = document.querySelector('.start-btn');
const gameboardContainer = document.querySelector('.gameboard-container');
const gameboardPlayerOne = document.querySelector('.gameboard-player-one');
const gameboardPlayerTwo = document.querySelector('.gameboard-player-two');

let playerOne;
let playerTwo;
let currentPlayer;
let gameActive = false;
let placementPhase = false;
let shipsToPlace = [
  { length: 4, name: 'Linkor (4 cells)' },
  { length: 3, name: 'Cruiser (3 cells)' },
  { length: 3, name: 'Cruiser (3 cells)' },
  { length: 2, name: 'Destroyer (2 cells)' },
  { length: 2, name: 'Destroyer (2 cells)' },
  { length: 1, name: 'Boat (1 cells)' },
  { length: 1, name: 'Boat (1 cells)' }
];
let currentShipIndex = 0;
let currentDirection = 'horizontal';

function initializeShipPlacement() {
  startBtn.style.display = 'none';

  playerOne = new Player(false);
  playerTwo = new Player(true);

  placementPhase = true;

  createPlacementUI();

  renderPlacementBoard();
}

function createPlacementUI() {
  const placementControls = document.createElement('div');
  placementControls.classList.add('placement-controls');

  const shipInfo = document.createElement('div');
  shipInfo.classList.add('ship-info');
  shipInfo.textContent = `Place: ${shipsToPlace[currentShipIndex].name}`;
  shipInfo.id = 'ship-info';

  const rotateBtn = document.createElement('button');
  rotateBtn.textContent = 'Rotate Ship';
  rotateBtn.classList.add('rotate-btn');
  rotateBtn.addEventListener('click', () => {
    currentDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
    const directionText = currentDirection === 'horizontal' ? 'horizontal' : 'vertical';
    shipInfo.textContent = `Place: ${shipsToPlace[currentShipIndex].name} (${directionText})`;
  });

  const randomPlacementBtn = document.createElement('button');
  randomPlacementBtn.textContent = 'Random placement';
  randomPlacementBtn.classList.add('random-btn');
  randomPlacementBtn.addEventListener('click', randomlyPlaceAllShips);

  placementControls.appendChild(shipInfo);
  placementControls.appendChild(rotateBtn);
  placementControls.appendChild(randomPlacementBtn);

  gameboardContainer.insertAdjacentElement('beforebegin', placementControls);

  const instructions = document.createElement('div')
  instructions.classList.add('instructions');
  instructions.textContent = 'Click on cell to place ship. Use button "rotate ship" to change orientation.';
  placementControls.insertAdjacentElement('beforebegin', instructions);
}

function renderPlacementBoard() {
  gameboardPlayerOne.innerHTML = '';
  gameboardPlayerTwo.innerHTML = '';

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (playerOne.gameboard.board[y][x] instanceof Ship) {
        cell.classList.add('ship');
      }

      cell.addEventListener('mouseover', () => {
        if (!placementPhase) return;

        document.querySelectorAll('.preview-valid, .preview-invalid').forEach(el => {
          el.classList.remove('preview-valid', 'preview-invalid');
        });

        const shipLength = shipsToPlace[currentShipIndex].length;
        const canPlace = canPlaceShip(x, y, shipLength, currentDirection);

        showShipPreview(x, y, shipLength, currentDirection, canPlace);
      });

      cell.addEventListener('click', () => {
        if (!placementPhase) return;

        const shipLength = shipsToPlace[currentShipIndex].length;
        if (canPlaceShip(x, y, shipLength, currentDirection)) {
          placeShip(x, y, shipLength, currentDirection);
        }
      });

      cell.dataset.x = x;
      cell.dataset.y = y;
      gameboardPlayerOne.appendChild(cell);
    }
  }
}

function showShipPreview(x, y, length, direction, isValid) {
  const previewClass = isValid ? 'preview-valid' : 'preview-invalid';

  if (direction === 'horizontal') {
    for (let i = 0; i < length; i++) {
      if (x + i < 10) {
        const cell = gameboardPlayerOne.querySelector(`[data-x="${x + i}"][data-y="${y}"]`);
        if (cell) cell.classList.add(previewClass);
      }
    }
  } else {
    for (let i = 0; i < length; i++) {
      if (y + i < 10) {
        const cell = gameboardPlayerOne.querySelector(`[data-x="${x}"][data-y="${y + i}"]`);
        if (cell) cell.classList.add(previewClass);
      }
    }
  }
}

function canPlaceShip(x, y, length, direction) {
  if (direction === 'horizontal' && x + length > 10) {
    return false;
  }
  if (direction === 'vertical' && y + length > 10) {
    return false;
  }

  if (direction === 'horizontal') {
    for (let i = -1; i <= length; i++) {
      for (let j = -1; j <= 1; j++) {
        const checkX = x + i;
        const checkY = y + j;

        if (checkX < 0 || checkX >= 10 || checkY < 0 || checkY >= 10) {
          continue;
        }

        if (playerOne.gameboard.board[checkY][checkX] instanceof Ship) {
          return false;
        }
      }
    }
  } else {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= length; j++) {
        const checkX = x + i;
        const checkY = y + j;

        if (checkX < 0 || checkX >= 10 || checkY < 0 || checkY >= 10) {
          continue;
        }

        if (playerOne.gameboard.board[checkY][checkX] instanceof Ship) {
          return false;
        }
      }
    }
  }

  return true;
}

function placeShip(x, y, length, direction) {
  playerOne.gameboard.placeShip(x, y, length, direction);

  currentShipIndex++;

  if (currentShipIndex < shipsToPlace.length) {
    const shipInfo = document.getElementById('ship-info');
    const directionText = currentDirection === 'horizontal' ? 'horizontal' : 'vertical';
    shipInfo.textContent = `Place: ${shipsToPlace[currentShipIndex].name} (${directionText})`;
  } else {
    finishPlacement();
  }

  renderPlacementBoard();
}

function randomlyPlaceAllShips() {
  playerOne.gameboard = new Gameboard();

  for (const ship of shipsToPlace) {
    let placed = false;

    while (!placed) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';

      if (canPlaceShip(x, y, ship.length, direction)) {
        playerOne.gameboard.placeShip(x, y, ship.length, direction);
        placed = true;
      }
    }
  }

  finishPlacement();
  renderPlacementBoard();
}

function finishPlacement() {
  placementPhase = false;

  const placementControls = document.querySelector('.placement-controls');
  if (placementControls) placementControls.remove();

  const instructions = document.querySelector('.instructions');
  if (instructions) instructions.remove();

  const startGameBtn = document.createElement('button');
  startGameBtn.textContent = 'Start Game';
  startGameBtn.classList.add('start-game-btn');
  startGameBtn.addEventListener('click', startGame);

  gameboardContainer.insertAdjacentElement('beforebegin', startGameBtn);

  displayMessage("The ships are positioned! Click 'Start Game' to continue.");
}

function placeComputerShips() {
  for (const ship of shipsToPlace) {
    let placed = false;

    while (!placed) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';

      if (canPlaceShipForComputer(x, y, ship.length, direction)) {
        playerTwo.gameboard.placeShip(x, y, ship.length, direction);
        placed = true;
      }
    }
  }
}

function canPlaceShipForComputer(x, y, length, direction) {
  if (direction === 'horizontal' && x + length > 10) {
    return false;
  }
  if (direction === 'vertical' && y + length > 10) {
    return false;
  }

  if (direction === 'horizontal') {
    for (let i = -1; i <= length; i++) {
      for (let j = -1; j <= 1; j++) {
        const checkX = x + i;
        const checkY = y + j;

        if (checkX < 0 || checkX >= 10 || checkY < 0 || checkY >= 10) {
          continue;
        }

        if (playerTwo.gameboard.board[checkY][checkX] instanceof Ship) {
          return false;
        }
      }
    }
  } else {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= length; j++) {
        const checkX = x + i;
        const checkY = y + j;

        if (checkX < 0 || checkX >= 10 || checkY < 0 || checkY >= 10) {
          continue;
        }

        if (playerTwo.gameboard.board[checkY][checkX] instanceof Ship) {
          return false;
        }
      }
    }
  }

  return true;
}

function startGame() {
  const startGameBtn = document.querySelector('.start-game-btn');
  if (startGameBtn) startGameBtn.remove();

  placeComputerShips();

  gameActive = true;
  currentPlayer = playerOne;

  renderBoards();

  displayMessage("The game has begun! Your turn.");
}

function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.classList.add('game-message');

  const prevMessage = document.querySelector('.game-message');
  if (prevMessage) {
    prevMessage.remove();
  }

  gameboardContainer.insertAdjacentElement('beforebegin', messageElement);
}

function renderBoards() {
  gameboardPlayerOne.innerHTML = '';
  gameboardPlayerTwo.innerHTML = '';

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (playerOne.gameboard.board[y][x] instanceof Ship) {
        cell.classList.add('ship');
      }

      if (playerOne.gameboard.usedCoordinates.some(coord => coord[0] === x && coord[1] === y)) {
        if (playerOne.gameboard.board[y][x] instanceof Ship) {
          cell.classList.add('hit');
        } else {
          cell.classList.add('miss');
        }
      }

      cell.dataset.x = x;
      cell.dataset.y = y;
      gameboardPlayerOne.appendChild(cell);
    }
  }

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // if (playerTwo.gameboard.board[y][x] instanceof Ship) {
      //   cell.classList.add('ship');
      // }

      if (playerTwo.gameboard.usedCoordinates.some(coord => coord[0] === x && coord[1] === y)) {
        if (playerTwo.gameboard.board[y][x] instanceof Ship) {
          cell.classList.add('hit');
        } else {
          cell.classList.add('miss');
        }
      }

      cell.dataset.x = x;
      cell.dataset.y = y;

      cell.addEventListener('click', () => {
        if (!gameActive || currentPlayer !== playerOne) {
          return;
        }

        if (playerTwo.gameboard.usedCoordinates.some(coord => coord[0] === x && coord[1] === y)) {
          return;
        }

        const hitSuccess = playerTwo.gameboard.recieveAttack(x, y);

        renderBoards();

        if (playerTwo.gameboard.ships.every(ship => ship.isSunk())) {
          endGame("Congratulations! You won!");
          return;
        }

        if (!hitSuccess) {
          currentPlayer = playerTwo;
          displayMessage("You missed! Computer move...");

          setTimeout(computerTurn, 1000);
        } else {
          displayMessage("Hit! Your turn again.");
        }
      });

      gameboardPlayerTwo.appendChild(cell);
    }
  }
}

function computerTurn() {
  if (!gameActive) return;

  let keepTurn = true;

  while (keepTurn && gameActive) {
    const attack = playerTwo.randomAttack(playerOne.gameboard);

    renderBoards();

    if (playerOne.gameboard.ships.every(ship => ship.isSunk())) {
      endGame("Сomputer has won! Game over.");
      return;
    }

    if (!attack.hit) {
      keepTurn = false;
      currentPlayer = playerOne;
      displayMessage(`Сomputer missed (${attack.x}, ${attack.y})! Your turn.`);
    } else {
      displayMessage(`Computer hitted (${attack.x}, ${attack.y})! Computer's turn again...`);

      if (keepTurn) {
        return setTimeout(computerTurn, 1000);
      }
    }
  }
}

function endGame(message) {
  gameActive = false;
  displayMessage(message);

  const restartBtn = document.createElement('button');
  restartBtn.textContent = "New Game";
  restartBtn.classList.add('restart-btn');
  restartBtn.addEventListener('click', () => {
    location.reload();
  });

  document.querySelector('.game-message').appendChild(restartBtn);
}

startBtn.addEventListener('click', () => {
  initializeShipPlacement();
});