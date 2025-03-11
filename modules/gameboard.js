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

    // Check if out of bounds
    if (direction === 'horizontal' && x + length > 10) {
      console.error('Ship placement out of bounds');
      return null;
    }
    if (direction === 'vertical' && y + length > 10) {
      console.error('Ship placement out of bounds');
      return null;
    }

    if (direction === 'horizontal') {
      for (let i = 0; i < length; i++) {
        if (this.board[y][x + i] !== null) {
          console.error('Cannot place ship: space already occupied');
          return null;
        }
      }
    } else if (direction === 'vertical') {
      for (let i = 0; i < length; i++) {
        if (this.board[y + i][x] !== null) {
          console.error('Cannot place ship: space already occupied');
          return null;
        }
      }
    }

    // Ship placement
    if (direction === 'horizontal') {
      for (let i = 0; i < length; i++) {
        this.board[y][x + i] = ship;
        ship.coordinates.push([x + i, y]);
      }
    } else if (direction === 'vertical') {
      for (let i = 0; i < length; i++) {
        this.board[y + i][x] = ship;
        ship.coordinates.push([x, y + i]);
      }
    }

    this.ships.push(ship);
    return ship;
  }

  recieveAttack(x, y) {
    // If coords have been used before - miss
    if (this.usedCoordinates.some(coords => coords[0] === x && coords[1] === y)) {
      return false; // Already shooted
    }

    // Add coords to usedCoordinates array
    this.usedCoordinates.push([x, y]);

    // Check hit
    const targetCell = this.board[y][x];
    if (targetCell instanceof Ship) {
      targetCell.hit();

      // Check if ships are sunk
      if (this.ships.every(ship => ship.isSunk())) {
        console.log('All ships have been sunk!');
      }

      return true; // Hit
    } else {
      this.missedShots.push([x, y]);
      return false; // Miss
    }
  }
}