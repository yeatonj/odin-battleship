import Player from "../src/Player";

describe('Player Tests', () => { 
    test('Invalid Player Type', () => {
        expect(() => {new Player('wrong');}).toThrow();
    });

    test('CPU generates appropriate random attacks', () => {
        let boardSize = 10;
        const player = new Player('computer', boardSize);
        let minRow = boardSize;
        let maxRow = 0;
        let minCol = boardSize;
        let maxCol = 0;
        // Note there is a bit of randomness here...
        for (let i = 0; i < boardSize*100; i++) {
            const coords = player.generateAttack();
            expect(coords[0]).toBeGreaterThanOrEqual(0);
            expect(coords[0]).toBeLessThan(boardSize);
            if (coords[0] < minRow) {
                minRow = coords[0];
            }
            if (coords[0] > maxRow) {
                maxRow = coords[0];
            }

            expect(coords[1]).toBeGreaterThanOrEqual(0);
            expect(coords[1]).toBeLessThan(boardSize);
            if (coords[1] < minCol) {
                minCol = coords[1];
            }
            if (coords[1] > maxCol) {
                maxCol = coords[1];
            }
        }
        expect(minCol).toBe(0);
        expect(minRow).toBe(0);
        expect(maxRow).toBe(boardSize - 1);
        expect(maxCol).toBe(boardSize - 1);
    });

    test('Human Player does not generate random attacks', () => {
        const player = new Player('human', 10);
        expect(() => {player.generateAttack();}).toThrow();

    });

    test('CPU appropriately randomly places ships', () => {
        const player = new Player('computer', 10);
        player.randomlyPlaceShip(2);
        player.randomlyPlaceShip(4);
        player.randomlyPlaceShip(5);
        expect(player.board.ships.length).toBe(3);

    });

    test('Human Player does not randomly place ships', () => {
        const player = new Player('human', 10);
        expect(() => {player.randomlyPlaceShip();}).toThrow();
    });
});