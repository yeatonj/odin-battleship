export default class DisplayManager {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.#setupStatus();
    }

    #setupStatus() {
        const statusArea = document.getElementById("status-msg");
        statusArea.innerHTML = "Welcome to Battleship. Please place your ships. Use the toggle button to rotate your ship; the leftmost (horizontal) or topmost (vertical) part of the ship will be placed where you click.";

    }

    drawShipArea(shipPlacements, selected, selectionCallback, rotateCallback, isHorizontal) {
        const shipNames = ["Carrier", "Battleship", "Destroyer", "Submarine", "Patrol Boat"];
        const shipLengths = ["5", "4", "3", "3", "2"];

        const shipArea = document.getElementById("ship-area");
        while (shipArea.firstChild) {
            shipArea.removeChild(shipArea.lastChild);
        }

        const header = document.createElement('h3');
        header.textContent = "Placement Menu:"
        shipArea.appendChild(header);

        const orientationLabel = document.createElement('p');
        orientationLabel.textContent = "Toggle Orientation:";
        shipArea.appendChild(orientationLabel);
        const orientationToggle = document.createElement("button");
        if (isHorizontal) {
            orientationToggle.textContent = "Placing Horizontally";
        } else {
            orientationToggle.textContent = "Placing Vertically";
        }
        orientationToggle.addEventListener("click", () => {
            rotateCallback();
        });
        shipArea.appendChild(orientationToggle);

        for (let i = 0; i < shipNames.length; i++) {
            const shipContainer = document.createElement('div');
            const name = document.createElement('p');
            name.textContent = shipNames[i] + ": " + shipLengths[i] + " tiles";
            shipContainer.appendChild(name);
            if (shipPlacements[i].placed) {
                const alreadyPlaced = document.createElement('p');
                alreadyPlaced.textContent = "Ship already placed.";
                shipContainer.appendChild(alreadyPlaced);
                
            } else if (selected === i) {
                // Placement in process
                const shipButton = document.createElement('Button');
                shipButton.classList.add('selected');
                shipButton.textContent = "Unselect Ship";
                shipButton.addEventListener("click", () => {
                    selectionCallback(undefined);
                });
                shipContainer.appendChild(shipButton);
            } else {
                // Still need to place
                const shipButton = document.createElement('Button');
                shipButton.textContent = "Select " + shipNames[i];
                shipButton.addEventListener("click", () => {
                    selectionCallback(i);
                });
                shipContainer.appendChild(shipButton);
            }
            shipArea.appendChild(shipContainer);
        }
    }

    drawPlayerBoard(shotMap, shipMap, isCallback, placementCallback, rotateCallback) {
        // shotMap: [[row, col, "hit/miss"].....]
        // shipMap: [{length, row, col, orientation}]
        const board = document.querySelector(".player-board");
        while(board.firstChild) {
            board.removeChild(board.lastChild);
        }

        const boardState = []
        // populate initial state
        for (let r = 0; r < this.boardSize; r++) {
            boardState.push([])
            for (let c = 0; c < this.boardSize; c++) {
                boardState[r].push("empty"); 
            }
        }
        // add ships
        for (const ship of shipMap) {
            if (ship.orientation == "right") {
                for (let c = ship.col; c < ship.col + ship.length; c ++) {
                    boardState[ship.row][c] = "ship";
                }
            } else {
                for (let r = ship.row; r < ship.row + ship.length; r ++) {
                    boardState[r][ship.col] = "ship";
                }
            }
        }
        // Add shots
        for (const shot of shotMap) {
            boardState[shot[0]][shot[1]] = shot[2];
        }
        // Draw map
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                if (!isCallback) {
                    const boardMarker = document.createElement('div');
                    boardMarker.classList.add(boardState[r][c]);
                    if (boardState[r][c] === "hit" || boardState[r][c] === "miss") {
                        boardMarker.textContent = '\u2715';
                    }
                    boardMarker.classList.add("board-space");
                    board.appendChild(boardMarker);
                } else {
                    const boardMarker = document.createElement('button');
                    boardMarker.addEventListener("click", () => {
                        try {
                            const row = r;
                            const col = c;
                            placementCallback(row,col);
                        } catch (error) {
                            console.log(error.message);
                        }
                    });
                    boardMarker.classList.add(boardState[r][c]);
                    boardMarker.classList.add("board-space");
                    board.appendChild(boardMarker);
                }
                
            }
        }
    }

    drawComputerBoard(shotMap, shipMap, shotCallback) {
        // shotMap: [[row, col, "hit/miss"].....]
        // shipMap: [{length, row, col, orientation}]
        const board = document.querySelector(".cpu-board");
        while(board.firstChild) {
            board.removeChild(board.lastChild);
        }
        const boardState = []
        // populate initial state
        for (let r = 0; r < this.boardSize; r++) {
            boardState.push([])
            for (let c = 0; c < this.boardSize; c++) {
                boardState[r].push("empty"); 
            }
        }
        // add ships
        for (const ship of shipMap) {
            if (ship.orientation == "right") {
                for (let c = ship.col; c < ship.col + ship.length; c ++) {
                    boardState[ship.row][c] = "ship";
                }
            } else {
                for (let r = ship.row; r < ship.row + ship.length; c ++) {
                    boardState[r][ship.col] = "ship";
                }
            }
        }
        // Add shots
        for (const shot of shotMap) {
            boardState[shot[0]][shot[1]] = shot[2];
        }
        // Draw map
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                const boardMarker = document.createElement('button');
                boardMarker.addEventListener("click", () => {shotCallback(r,c)});
                boardMarker.classList.add(boardState[r][c]);
                boardMarker.classList.add("board-space");
                if (boardState[r][c] === "hit" || boardState[r][c] === "miss") {
                    boardMarker.textContent = '\u2715';
                }
                board.appendChild(boardMarker);
            }
        }
    }
    drawEndGame(winner, resetCallback) {
        const statusArea = document.getElementById("status-msg");
        if (winner === "human") {
            statusArea.innerHTML = "Congratulations, you won! Click the button below if you'd like to play again.";
        } else {
            statusArea.innerHTML = "Unfortunately, you lost. Click the button below if you'd like to play again."
        }
        const resetArea = document.getElementById("reset-area");
        const newGameButton = document.createElement("button");
        newGameButton.textContent = "Start New Game";
        newGameButton.classList.add('new-game');
        newGameButton.addEventListener("click", () => {
            const resetArea = document.getElementById("reset-area");
            while (resetArea.firstChild) {
                resetArea.removeChild(resetArea.lastChild);
            }
            this.#setupStatus();
            resetCallback();
        });
        resetArea.appendChild(newGameButton);
    }

    playerTurnStatus() {
        const statusArea = document.getElementById("status-msg");
        statusArea.innerHTML = "Your turn, please select a space on the enemy board to the right to fire a shot!";
    }

    cpuTurnStatus() {
        const statusArea = document.getElementById("status-msg");
        statusArea.innerHTML = "CPU turn, please wait while it selects its shot.";
    }
}