export default class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.coordinates = [];
  }

  hit() {
    if (this.hits === this.length) {
      return this.isSunk();
    } else if (this.hits < this.length) {
      this.hits++;
      this.isSunk();
    }
  }

  isSunk() {
    if (this.hits === this.length) {
      return true;
    }
  }
}