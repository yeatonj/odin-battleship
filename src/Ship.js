export default class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.isSunk = false;
    }

    hello() {
        return "hello";
    }
}