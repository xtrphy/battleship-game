import Gameboard from "../modules/gameboard.js";

test('place ship in specific coordinates', () => {
  const gameboard = new Gameboard();
  expect(gameboard.board[0][0]).toBe(null);

  gameboard.placeShip(2, 3, 3, 'horizontal');

  expect(gameboard.board[3][2]).not.toBeNull();
  expect(gameboard.board[3][3]).not.toBeNull();
  expect(gameboard.board[3][4]).not.toBeNull();
});