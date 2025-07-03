export default class DisplayManager {
    constructor(boardSize) {
        this.boardSize = boardSize;
    }

    drawShipArea(shipPlacements, selected, selectionCallback) {
        const shipNames = ["Carrier", "Battleship", "Destroyer", "Submarine", "Patrol Boat"];

        const shipArea = document.getElementById("ship-area");

        const header = document.createElement('h3');
        header.textContent = "Ships Available:"
        shipArea.appendChild(header);

        for (let i = 0; i < shipNames.length; i++) {
            const shipContainer = document.createElement('div');
            const name = document.createElement('p');
            name.textContent = shipNames[i];
            shipContainer.appendChild(name);
            const shipButton = document.createElement('Button');
            shipButton.textContent = shipNames[i];
            shipButton.addEventListener("click", () => selectionCallback(i));
            shipContainer.appendChild(shipButton);

            shipArea.appendChild(shipContainer);
        }
    }

    drawPlayerBoard(shotMap, shipMap) {
        // shotMap: [[row, col, "hit/miss"].....]
        // shipMap: [{length, row, col, orientation}]
        const board = document.querySelector(".player-board");
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
                const boardMarker = document.createElement('div');
                boardMarker.classList.add(boardState[r][c]);
                boardMarker.classList.add("board-space");
                board.appendChild(boardMarker);
            }
        }
    }

    drawComputerBoard(shotMap, shipMap, shotCallback) {
        // shotMap: [[row, col, "hit/miss"].....]
        // shipMap: [{length, row, col, orientation}]
        const board = document.querySelector(".cpu-board");
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
                board.appendChild(boardMarker);
            }
        }
    }
}