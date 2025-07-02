import Gameboard from "../src/Gameboard.js";
import Ship from "../src/Ship.js";

describe('Gameboard Tests', () => { 
    let gameboard;

    beforeAll(() => {
        gameboard = new Gameboard(5, 5);
        gameboard.placeShip(1, 1, 3, 'right');
        gameboard.placeShip(2, 2, 2, 'down');
    });

    test('out of bounds ship right', () => {
        expect(() => gameboard.placeShip(4, 4, 2, 'right')).toThrow();
    });

    test('out of bounds ship down', () => {
        expect(() => gameboard.placeShip(4, 4, 2, 'down')).toThrow();
    });

    test('ship overlap', () => {
        expect(() => gameboard.placeShip(2, 1, 3, 'right')).toThrow();
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


    test('boardTooSmall', () => {
        expect(() => {new Gameboard(2, 3);}).toThrow();
    });


});