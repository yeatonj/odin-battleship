import Ship from "../src/Ship.js";

describe('Ship Tests', () => {
    let ship;

    beforeAll(() => {
        ship = new Ship(2);
    });

    test('new ship floats', () => {
        expect(ship.isSunk()).toBe(false);
    });

    test('single hit floats', () => {
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });

    test('second hit sinks', () => {
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });

    test('third hit error', () => {
        expect(() => {ship.hit();}).toThrow();
    });

    test('empty ship error', () => {
        expect(() => {new Ship(0);}).toThrow();
    });
});