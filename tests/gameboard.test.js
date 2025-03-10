import Gameboard from "../modules/gameboard.js";

test('place ship in specific coordinates', () => {
  const gameboard = new Gameboard();
  expect(gameboard.board[0][0]).toBe(null);

  gameboard.placeShip(2, 3, 3, 'horizontal');

  expect(gameboard.board[3][2]).not.toBeNull();
  expect(gameboard.board[3][3]).not.toBeNull();
  expect(gameboard.board[3][4]).not.toBeNull();
});

test('ship takes damage', () => {
  const gameboard = new Gameboard();
  const ship = gameboard.placeShip(2, 3, 3, 'horizontal');

  const spy = jest.spyOn(ship, 'hit');

  gameboard.recieveAttack(2, 3);

  expect(spy.mock.calls).toHaveLength(1);
  expect(spy).toHaveBeenCalled();
});

test('dublicates of coordinates goes to usedCoordinates', () => {
  const gameboard = new Gameboard();

  const ship = gameboard.placeShip(2, 3, 3, 'horizontal');

  const spy = jest.spyOn(ship, 'hit');

  gameboard.recieveAttack(2, 3);
  gameboard.recieveAttack(2, 3);
  gameboard.recieveAttack(3, 3);
  gameboard.recieveAttack(3, 3);
  gameboard.recieveAttack(4, 3);
  gameboard.recieveAttack(4, 3);

  expect(gameboard.usedCoordinates).toEqual([[2, 3], [3, 3], [4, 3]]);
  expect(spy.mock.calls).toHaveLength(3);
});

test('missed shorts goes to missedShots array', () => {
  const gameboard = new Gameboard();

  const ship = gameboard.placeShip(2, 3, 3, 'horizontal');

  const spy = jest.spyOn(ship, 'hit');

  gameboard.recieveAttack(5, 8);
  gameboard.recieveAttack(4, 4);
  gameboard.recieveAttack(2, 3);
  gameboard.recieveAttack(1, 3);
  gameboard.recieveAttack(3, 3);
  gameboard.recieveAttack(4, 3);

  expect(gameboard.missedShots).toEqual([[5, 8], [4, 4], [1, 3]]);
});