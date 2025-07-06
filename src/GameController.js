import Player from "./Player";
import DisplayManager from "./DisplayManager";

export default class GameController {
    #BOARD_SIZE = 10;
    #SHIP_SIZES = [5, 4, 3, 3, 2];
    #CPU_TURN_DELAY = 500;

    constructor(randomPlacement) {
        this.randomPlacement = randomPlacement;
        this.displayManager = new DisplayManager(this.#BOARD_SIZE);
        this.#setupGame();
    }

    #setupGame() {
        this.players = [new Player("human", this.#BOARD_SIZE), new Player("computer", this.#BOARD_SIZE)];
        this.activePlayer = 0; // always start with the human player

        // 0 -> setup, 1 -> playing, 2 -> finished
        this.gamePhase = 0;

        this.selectedShip = undefined;
        // 0 -> right, 1 -> down
        this.selectedOrientation = 0;

        this.placementTracker = []
        if (this.randomPlacement) {
            // Place cpu ships randomly and populate placement tracker
            for (const size of this.#SHIP_SIZES) {
                this.players[1].randomlyPlaceShip(size);
                this.placementTracker.push({"length" : size, "placed" : false});
            }
        } else {
            // place all ships deterministically
            for (let i = 0; i < this.#SHIP_SIZES.length; i++) {
                this.players[0].board.placeShip(i, i, this.#SHIP_SIZES[i], "right");
                this.players[1].board.placeShip(i, i, this.#SHIP_SIZES[i], "right");
                this.placementTracker.push({"length" : this.#SHIP_SIZES[i], "placed" : true});
                this.#startGame();
            }
        }
        this.displayManager.drawShipArea(this.placementTracker, this.selectedShip, this.selectShip.bind(this));
    }

    selectShip(shipNum) {
        this.selectedOrientation = 0;
        this.selectedShip = shipNum;
        this.displayManager.drawShipArea(this.placementTracker, this.selectedShip, this.selectShip.bind(this));
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
            this.displayManager.drawShipArea(this.placementTracker, this.selectedShip, this.selectShip.bind(this));
            this.displayManager.drawPlayerBoard(this.players[0].board.getShots(), this.players[0].board.getPlacedShips());
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
        this.displayManager.playerTurnStatus();
        // !! this will likely need to move
        this.displayManager.drawPlayerBoard(this.players[0].board.getShots(), this.players[0].board.getPlacedShips());
        this.displayManager.drawComputerBoard(this.players[1].board.getShots(), this.players[0].board.getSunkShips(), this.processPlayerShot.bind(this));
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
        if (this.gamePhase != 1) {
            console.log("Cannot shoot when game is inactive.");
            return;
        }
        try {
            const wasHit = this.players[1].board.recieveAttack(row, col);
            // !! NEED TO DRAW BOARD HERE, INCLUDING ANY SUNK SHIPS
            this.displayManager.drawComputerBoard(this.players[1].board.getShots(), this.players[0].board.getSunkShips(), this.processPlayerShot.bind(this));
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
        this.displayManager.cpuTurnStatus();
        setTimeout(this.#cpuFireShot.bind(this), this.#CPU_TURN_DELAY);
    }

    #cpuFireShot() {
        console.log(this.players);
        let shotStatus = false;
        let keepShooting = true;

        while (keepShooting) {
            const attack = this.players[1].generateAttack();
            try {
                shotStatus = this.players[0].board.recieveAttack(attack[0], attack[1]);
                keepShooting = false;
            } catch {
                // Need to pick a different place to shoot
                keepShooting = true;
            }
        }
        console.log(shotStatus);
        // shot status true is a hit, false is a miss
        
        this.displayManager.drawPlayerBoard(this.players[0].board.getShots(), this.players[0].board.getPlacedShips());
        if (shotStatus && this.#checkLoss(0)) {
            this.#endGame(1);
            return;
        } else if (shotStatus) {
            setTimeout(this.#cpuFireShot.bind(this), this.#CPU_TURN_DELAY);
            // new turn
        } else {
            this.#finishCPUTurn();
        }
    }

    #finishCPUTurn() {
        // Swap to player turn
        this.displayManager.playerTurnStatus();
        this.#swapActivePlayer();
    }

    #checkLoss(opponentNumber) {
        return this.players[opponentNumber].board.allSunk();
    }

    #endGame(winnerPlayerNum) {
        this.gamePhase = 2;
        this.displayManager.drawEndGame(winnerPlayerNum === 0 ? "human" : "computer", this.resetGame.bind(this));
    }

    resetGame() {
        this.#setupGame();
    }
}