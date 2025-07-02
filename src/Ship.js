export default class Ship {
    constructor(length) {
        if (length < 1) {
            throw new Error("Length must be positive.");
        }
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    hit() {
        if (this.hits === this.length) {
            throw new Error("Ship already sunk");
        }
        this.hits = this.hits + 1;
        if (this.hits === this.length) {
            this.sunk = true;
        }
    }

    isSunk() {
        return this.sunk;
    }
}