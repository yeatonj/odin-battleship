import Ship from "./Ship";

export default class Gameboard {
    constructor(rows, cols) {
        if (rows < 4 || cols < 4) {
            throw new Error("Board too small.");
        }
        this.rows = rows;
        this.cols = cols;
        this.ships = [];
        this.shots = new Map();
        this.shipLocs = new Map();
    }

    placeShip(row, col, length, orientation) {
        const shipNum = this.ships.length;
        if (orientation == "right") {
            // Check OOB
            if ((col + length - 1) >= this.cols) {
                throw new Error("Ship out of bounds.");
            }
            // Check spots
            for (let i = col; i < col + length; i++) {
                const key = this.#keyfromCoord(row, i);
                if (this.shipLocs[key] != undefined) {
                    throw new Error("Ship overlap.");
                }
            }
            // No overlap, we can add the ship
            this.ships.push({
                "ship": new Ship(length),
                "row" : row,
                "col" : col,
                "orientation" : orientation
            });
            for (let i = col; i < col + length; i++) {
                const key = this.#keyfromCoord(row, i);
                this.shipLocs[key] = shipNum;
            }
        } else if (orientation == "down") {
            if ((row + length - 1) >= this.rows) {
                throw new Error("Ship out of bounds.");
            }
            // Check spots
            for (let i = row; i < row + length; i++) {
                const key = this.#keyfromCoord(i, col);
                if (this.shipLocs[key] != undefined) {
                    throw new Error("Ship overlap.");
                }
            }
            // No overlap, we can add the ship
            this.ships.push({
                "ship": new Ship(length),
                "row" : row,
                "col" : col,
                "orientation" : orientation
            });
            
            for (let i = row; i < row + length; i++) {
                const key = this.#keyfromCoord(i, col);
                this.shipLocs[key] = shipNum;
            }
        } else {
            throw new Error("Improper orientation.");
        }
        return true;
    }

    recieveAttack(row, col) {
        if (row < 0 || 
            row >= this.rows ||
            col < 0 ||
            col >= this.cols
        ) {
            throw new Error("Shot out of bounds.");
        }
        // check if already shot here
        const coord = this.#keyfromCoord(row, col);
        if (this.shots[coord] != undefined) {
            throw new Error('Already shot here.');
        }
        // Otherwise, check if a ship is here
        const shipNum = this.shipLocs[coord];
        if (shipNum === undefined) {
            this.shots[coord] = 'miss';
        } else {
            this.shots[coord] = 'hit';
            this.ships[shipNum].ship.hit();
        }
    }

    allSunk() {
        // !! might want to update depending on how we return sunk objects
        for (const shipStruct of this.ships) {
            if (!shipStruct.ship.isSunk()) {
                return false;
            }
        }
        return true;
    }

    getSunkShips() {
        // !!
    }

    getShots() {
        // !!
    }

    #keyfromCoord(row, col) {
        return String(row) + "," + String(col);
    }
}