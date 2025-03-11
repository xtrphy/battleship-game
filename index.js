import Ship from "./modules/ship.js";
import Gameboard from "./modules/gameboard.js";
import Player from "./modules/player.js";

const startBtn = document.querySelector('.start-btn');
const gameboardContainer = document.querySelector('.gameboard-container');
const gameboardPlayerOne = document.querySelector('.gameboard-player-one');
const gameboardPlayerTwo = document.querySelector('.gameboard-player-two');

const playerOne = new Player();
playerOne.gameboard.placeShip(2, 3, 3, 'horizontal');
const playerTwo = new Player();

function renderBoards() {
  gameboardPlayerOne.innerHTML = '';
  gameboardPlayerTwo.innerHTML = '';

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (playerOne.gameboard.board[y][x] === playerOne.gameboard.ships.find(ship => ship.coordinates.some(coordinate => coordinate[0] === playerOne.gameboard.board[x] && coordinate[1] === playerOne.gameboard.board[y]))) {
        cell.classList.add('ship'); // Показываем корабль
      } else {
        console.log(playerOne.gameboard.ships);
        console.log(playerOne.gameboard.board);
      }

      gameboardPlayerOne.appendChild(cell);
      gameboardContainer.appendChild(gameboardPlayerOne);
    }
  }
}

startBtn.addEventListener('click', () => {
  renderBoards();
});