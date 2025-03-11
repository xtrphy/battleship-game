import Gameboard from "./gameboard.js";

export default class Player {
  constructor() {
    this.score = 0;
    this.gameboard = new Gameboard();
  }
}