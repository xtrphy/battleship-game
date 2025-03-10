import Ship from "./ship.js";

export default class Gameboard {
  constructor() {
    this.board = Array(10).fill(null).map(() => Array(10).fill(null));
    this.ships = [];
    this.missedShots = [];
  }

  placeShip(x, y, length, direction) {
    const ship = new Ship(length);
    let coordinates = [];

    if (direction === 'horizontal') {
      for (let i = 0; i < length; i++) {
        this.board[y][x + i] = ship;
        coordinates.push([x + i, y]);
      }
    } else if (direction === 'vertical') {
      for (let i = 0; i < length; i++) {
        this.board[x][y + i] = ship;
        coordinates.push([x, y + i]);
      }
    }

    this.ships.push({ ship: ship, coordinates: coordinates });
    return ship;
  }

  recieveAttack(x, y) {

  }
}