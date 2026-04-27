/* GameBoard object */
function gameBoard (row = 3, col = 3) {
    const boardState = [];

    function initializeGameBoard () {
        reset();
    }
    initializeGameBoard ();

    function reset () {
        for (let i = 0; i < row; i++) {
            boardState[i] = [];
            for (let j = 0; j < col; j++) {
                boardState[i][j] = "";
            }
        }
    }

    function isEmpty (row, col) {
        return boardState[row][col] === "";
    }

    function getToken (row, col) {
        return boardState[row][col];
    }

    function placeToken (row, col, token) {
        boardState[row][col] = token;
    }

    function getBoardState () { 
        return boardState;
    }

    return {isEmpty, placeToken, getToken, reset};
}

/* Player Object */
function player (name, marker) {
    function getName () {
        return name;
    }

    function getMarker () {
        return marker;
    }

    return {getName, getMarker};
}

/* GameController Object */
const gameController = (() => {
    const board = gameBoard(3, 3);
    const players = [];
    // setPlayers();
    let currentPlayer;

    function setPlayers (player1 = "Player 1", player2 = "Player 2") {
        players[0] = player(player1, "X");
        players[1] = player(player2, "O");

        currentPlayer = players[0];
    }
    
    function makeMove (row, col) {
        if (!board.isEmpty(row, col))
            return;
        board.placeToken(row, col, currentPlayer.getMarker());

        const win = isWin();
        const tie = isTie();
        if (win || tie) {
            const message = win ? `The winner is  ${currentPlayer.getName()}` : "Tie!";
            console.log(`The game is over! ${message}`);
        }

        switchPlayer();  
    }

    function switchPlayer () {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    function isGameOver () {
        if (isWin() || isTie()) {
            return true
        }
        return false;
    }

    function isWin () {
        const curToken = currentPlayer.getMarker();

        if ((board.getToken(0, 0) === curToken && board.getToken(0, 1) === curToken && board.getToken(0, 2) === curToken) ||
            (board.getToken(1, 0) === curToken && board.getToken(1, 1) === curToken && board.getToken(1, 2) === curToken) ||
            (board.getToken(2, 0) === curToken && board.getToken(2, 1) === curToken && board.getToken(2, 2) === curToken) ||
            (board.getToken(0, 0) === curToken && board.getToken(1, 0) === curToken && board.getToken(2, 0) === curToken) ||
            (board.getToken(0, 1) === curToken && board.getToken(1, 1) === curToken && board.getToken(2, 1) === curToken) ||
            (board.getToken(0, 2) === curToken && board.getToken(1, 2) === curToken && board.getToken(2, 2) === curToken) ||
            (board.getToken(0, 0) === curToken && board.getToken(1, 1) === curToken && board.getToken(2, 2) === curToken) ||
            (board.getToken(0, 2) === curToken && board.getToken(1, 1) === curToken && board.getToken(2, 0) === curToken))
            return true;
        
        return false;
    }

    function isTie () {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board.isEmpty(row, col))
                    return false;
            }
        }
        return true;
    }

    return {board, currentPlayer, makeMove, setPlayers};
})();

/* UI Controller object */
const uiController = (() => {
    const board = gameController.board;
    const uiBoard = document.querySelector(".board");

    function displayBoard () {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cellValue = board.getToken(row, col);

                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.textContent = cellValue;

                // only add class if cell is not empty
                if (cellValue === "X") {
                    cell.classList.add("p1");
                } else if (cellValue === "O") {
                    cell.classList.add("p2");
                }

                cell.dataset.row = row;
                cell.dataset.col = col;

                uiBoard.appendChild(cell);
            } 
        }
    }

    function resetBoard () {
        uiBoard.innerHTML = "";
    }

    function render() {
        resetBoard();
        displayBoard();
    }

    function renderMove (event) {
        const cell = event.target.closest(".cell");

        if (!cell) 
            return;

        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);

        gameController.makeMove(row, col);
        render();
    }

    function setEventListeners () {
        uiBoard.addEventListener("click", renderMove);

        const clearBtn = document.querySelector(".clear-btn");
        clearBtn.addEventListener("click", function () {
            board.reset();
            render();
        });
        const newGameBtn = document.querySelector(".new-game-btn");
        newGameBtn.addEventListener("click", initializeGame);
    }

    function getPlayersNames () {
        const nameDialog = document.querySelector("#name");
        nameDialog.showModal();
    }

    function initializeGame () {
        getPlayersNames();
        const form = document.querySelector("form");
        form.addEventListener("submit", setGameStage);
        
        setEventListeners();
    }

    function setGameStage (event) {
        event.preventDefault();

        const nameDialog = document.querySelector("#name");
        const form       = nameDialog.querySelector("form");
        
        const player1Name = form.querySelector("#player1").value;
        const player2Name = form.querySelector("#player2").value;

        const p1NameUI = document.querySelector(".p1-name");
        p1NameUI.textContent = player1Name;
        const p2NameUI = document.querySelector(".p2-name");
        p2NameUI.textContent = player2Name;

        gameController.setPlayers(player1Name, player2Name);

        form.reset();
        nameDialog.close();

        render();
    }

    // start game
    initializeGame();
})();