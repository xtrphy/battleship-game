import Ship from "./ship.js";

export default class Gameboard {
  constructor() {
    this.board = Array(10).fill(null).map(() => Array(10).fill(null));
    this.ships = [];
    this.missedShots = [];
    this.usedCoordinates = [];
  }

  placeShip(x, y, length, direction) {
    const ship = new Ship(length);

    if (direction === 'horizontal') {
      for (let i = 0; i < length; i++) {
        this.board[y][x + i] = ship;
        ship.coordinates.push([x + i, y]);
      }
    } else if (direction === 'vertical') {
      for (let i = 0; i < length; i++) {
        this.board[x][y + i] = ship;
        ship.coordinates.push([x, y + i]);
      }
    }

    this.ships.push(ship);

    return ship;
  }

  recieveAttack(x, y) {
    if (this.usedCoordinates.some(coordinates =>
      coordinates[0] === x && coordinates[1] === y)) {
      this.missedShots.push([x, y]);
    } else {
      let hit = this.ships.some(ship =>
        ship.coordinates.some(coordinate =>
          x === coordinate[0] && y === coordinate[1] ? (ship.hit(), true) : false
        )
      );

      this.usedCoordinates.push([x, y]);

      if (this.ships.every(ship => ship.isSunk())) {
        console.log('All ships have been sunk!');
      };

      if (!hit) {
        this.missedShots.push([x, y]);
      }
    }
  }


}