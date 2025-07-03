import Player from "./Player";
import DisplayManager from "./DisplayManager";

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

        this.displayManager = new DisplayManager(this.#BOARD_SIZE);

        this.displayManager.drawShipArea(this.placementTracker, this.selectedShip, this.selectShip.bind(this));
    }

    selectShip(shipNum) {
        this.selectedOrientation = 0;
        this.selectedShip = shipNum;
    }

    rotateSelectedShip() {
        this.selectedOrientation = (this.selectedOrientation + 1) % 2;
    }

    placeSelectedShip(row, col) {
        if (this.selectedShip === undefined) {
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
            this.selectedShip = undefined;
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
        // !! this will likely need to move
        this.displayManager.drawPlayerBoard(this.players[0].board.getShots(), this.players[0].board.getPlacedShips())
    }

    #swapActivePlayer() {
        if (this.gamePhase != 1) {
            throw new Error('Can only swap phases in phase 1, currently in ' + String(this.gamePhase));
        }
        this.activePlayer = (this.activePlayer + 1) % 2;
        if (this.activePlayer == 1) {
            this.#takeCPUTurn();
        }
    }

    processPlayerShot(row, col) {
        try {
            const wasHit = this.players[1].board.recieveAttack(attack[0], attack[1]);
            // !! NEED TO DRAW BOARD HERE, INCLUDING ANY SUNK SHIPS
            if (wasHit && this.#checkLoss(1)) {
                this.#endGame(0);
                return;
            }
            if (!wasHit) {
                // switch turn
                this.#swapActivePlayer();
                return;
            }
            // Otherwise, we can keep shooting
            // !! NEED TO INDICATE THAT IT WAS A HIT AND THAT PLAYER CAN KEEP SHOOTING
        } catch {
            // Need to pick a different place to shoot, could log something here
        }
    }

    #takeCPUTurn() {
        let keepShooting = true;
        while (keepShooting) {
            const attack = this.players[1].generateAttack();
            try {
                keepShooting = this.players[0].board.recieveAttack(attack[0], attack[1]);
                // !! NEED TO DRAW BOARD HERE
                if (wasHit && this.#checkLoss(0)) {
                    this.#endGame(1);
                    return;
                }
            } catch {
                // Need to pick a different place to shoot
                keepShooting = true;
            }
            
            // We get another turn if we keep hitting
        }
        // Swap to player turn
        this.#swapActivePlayer();
    }

    #checkLoss(opponentNumber) {
        return this.players[opponentNumber].board.allSunk();
    }

    #endGame(winnerPlayerNum) {
        this.gamePhase = 2;
        // !! NEED TO CALL SOMETHING IN THE DISPLAY TO DISPLAY WIN
    }
}