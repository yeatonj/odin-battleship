import Gameboard from "./Gameboard";


export default class Player {
    constructor(playerType, boardSize) {
        if (playerType === 'human') {
            this.isCpu = false;
        } else if (playerType == 'computer') {
            this.isCpu = true;
        } else {
            throw new Error('Improper player type, must be either "human" or "computer"');
        }
        this.board = new Gameboard(boardSize, boardSize);
        this.boardSize = boardSize;
    }

    generateAttack() {
        if (!this.isCpu) {
            throw new Error('Human players should not generate attacks randomly');
        }
        const row = Math.floor(Math.random() * this.boardSize);
        const col = Math.floor(Math.random() * this.boardSize);
        return [row, col];
    }

    randomlyPlaceShip(length) {
        if (!this.isCpu) {
            throw new Error('Human players should not place ships randomly');
        }
        let success = false;
        while (!success) {
            try {
                const row = Math.floor(Math.random() * this.boardSize);
                const col = Math.floor(Math.random() * this.boardSize);
                const orientationNum = Math.floor(Math.random() * 2);
                const orientation = orientationNum === 0 ? "right" : "down";
                this.board.placeShip(row, col, length, orientation);
                success = true;
            } catch (error) {
                // console.log("CPU unable to place ship: " + error.message);
                // console.log("Attempting to place again.");
            }
        }
    }
}