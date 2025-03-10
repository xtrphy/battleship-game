import Ship from "../modules/ship.js";

test('adds hits points to the ship', () => {
  const ship = new Ship(3);
  expect(ship.length).toBe(3);
  expect(ship.hits).toBe(0);
  ship.hit();
  expect(ship.hits).toBe(1);
  ship.hit();
  expect(ship.hits).toBe(2);
  ship.hit();
  expect(ship.hits).toBe(3);
  ship.hit(); // When ship is already destroyed it wouldn't increase hit points
  expect(ship.hits).toBe(3);
});

test('if ship is destroyed', () => {
  const ship = new Ship(4);
  ship.hit()
  ship.hit()
  ship.hit()
  ship.hit()
  expect(ship.isSunk()).toBeTruthy();
});