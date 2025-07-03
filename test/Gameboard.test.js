import Gameboard from "../src/Gameboard.js";
import Ship from "../src/Ship.js";

describe('Gameboard Tests', () => { 
    let gameboard;

    beforeEach(() => {
        gameboard = new Gameboard(5, 5);
    });

    test('place 1', () => {
        expect(gameboard.placeShip(1, 1, 3, 'right')).toBe(true);
    });

    test('place 2', () => {
        gameboard.placeShip(1, 1, 3, 'right');
        expect(gameboard.placeShip(2, 2, 2, 'down')).toBe(true);
    })

    test('bad orientation', () => {
        expect(() => {gameboard.placeShip(4, 4, 2, 'wrong');}).toThrow();
    });

    test('out of bounds ship right', () => {
        expect(() => {gameboard.placeShip(4, 4, 2, 'right');}).toThrow();
    });

    test('out of bounds ship down', () => {
        expect(() => {gameboard.placeShip(4, 4, 2, 'down');}).toThrow();
    });

    test('ship overlap', () => {
        gameboard.placeShip(2, 2, 2, 'down')
        expect(() => {gameboard.placeShip(2, 1, 3, 'right');}).toThrow();
    });

    test('out of bounds shot 1', () => {
        expect(() => {gameboard.recieveAttack(-1, 1)}).toThrow();
    });

    test('out of bounds shot 2', () => {
        expect(() => {gameboard.recieveAttack(1, -1)}).toThrow();
    });

    test('out of bounds shot 3', () => {
        expect(() => {gameboard.recieveAttack(5, 1)}).toThrow();
    });

    test('out of bounds shot 4', () => {
        expect(() => {gameboard.recieveAttack(1, 5)}).toThrow();
    });

    test('repeat attack', () => {
        gameboard.recieveAttack(1, 1);
        expect(() => {gameboard.recieveAttack(1, 1)}).toThrow();
    });

    test('all sunk one ship', () => {
        gameboard.placeShip(1, 1, 3, 'right');
        gameboard.recieveAttack(1, 1);
        expect(gameboard.allSunk()).toBe(false);
        gameboard.recieveAttack(1, 2);
        expect(gameboard.allSunk()).toBe(false);
        gameboard.recieveAttack(1, 3);
        expect(gameboard.allSunk()).toBe(true);
    });

    test('all sunk multiple ships', () => {

        gameboard.placeShip(2, 2, 2, 'down');
        gameboard.placeShip(1, 1, 3, 'right');

        gameboard.recieveAttack(1, 1);
        expect(gameboard.allSunk()).toBe(false);
        gameboard.recieveAttack(1, 2);
        expect(gameboard.allSunk()).toBe(false);
        gameboard.recieveAttack(2, 2);
        expect(gameboard.allSunk()).toBe(false);
        
        gameboard.recieveAttack(1, 3);
        expect(gameboard.allSunk()).toBe(false);
        gameboard.recieveAttack(3, 2);
        expect(gameboard.allSunk()).toBe(true);
    });


    test('boardTooSmall', () => {
        expect(() => {new Gameboard(2, 3);}).toThrow();
    });


});