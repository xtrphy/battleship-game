import Gameboard from "./gameboard.js";

export default class Player {
  constructor(isComputer = false) {
    this.score = 0;
    this.gameboard = new Gameboard();
    this.isComputer = isComputer;
    this.attackedCoordinates = [];
  }

  randomAttack(enemyGameboard) {
    let x, y;
    let validMove = false;

    while (!validMove) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);

      if (!enemyGameboard.usedCoordinates.some(coord => coord[0] === x && coord[1] === y)) {
        validMove = true;
      }
    }

    const hitSuccess = enemyGameboard.recieveAttack(x, y);
    this.attackedCoordinates.push([x, y]);

    return { x, y, hit: hitSuccess };
  }
}