import Player from "./Player";

export default class GameController {
    #BOARD_SIZE = 10;
    #SHIP_SIZES = [5, 4, 3, 3, 2];

    constructor() {
        this.players = [new Player("human", this.#BOARD_SIZE), new Player("computer", this.#BOARD_SIZE)];
        this.activePlayer = 0; // always start with the human player

        // 0 -> setup, 1 -> playing, 2 -> finished
        this.gamePhase = 0;

        this.selectedShip = undefined;
        // 0 -> right, 1 -> down
        this.selectedOrientation = 0;

        this.placementTracker = []
        // Place cpu ships randomly and populate placement tracker
        for (const size of this.#SHIP_SIZES) {
            this.players[1].randomlyPlaceShip(size);
            this.placementTracker.push({"length" : size, "placed" : false});
        }
    }

    selectShip(shipNum) {
        this.selectedOrientation = 0;
        this.selectedShip = shipNum;
    }

    rotateSelectedShip() {
        this.selectedOrientation = (this.selectedOrientation + 1) % 2;
    }

    placeSelectedShip(row, col) {
        if (this.selectedShip == -1) {
            throw new Error('No ship selected to place.');
        }
        if (this.placementTracker[this.selectedShip].placed) {
            throw new Error('Unable to place already placed ship.');
        }
        // Place ship based on current placement
        const length = this.placementTracker[this.selectedShip].length;
        const orientation = this.selectedOrientation == 0 ? "right" : "down";
        try {
            this.players[0].board.placeShip(row, col, length, orientation);
            this.placementTracker[this.selectedShip].placed = true;
            // Reset selected ship
            this.selectedShip = -1;
        } catch {
            // Could log error placing ship here if we want
        }
        if (this.#allPlaced()) {
            this.#startGame();
        }
    }

    #allPlaced() {
        return this.placementTracker.reduce((accumulator, current) => {return accumulator && current.placed}, true);
    }

    #startGame() {
        this.gamePhase = 1;
    }

    #swapActivePlayer() {
        if (this.gamePhase != 1) {
            throw new Error('Can only swap phases in phase 1, currently in ' + String(this.gamePhase));
        }
        this.activePlayer = (this.activePlayer + 1) % 2;
    }
}