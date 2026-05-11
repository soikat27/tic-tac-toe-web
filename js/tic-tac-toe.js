/* 
   GameBoard factory

   Creates and manages the internal 3x3 board state.
   The board array stays private inside the closure, and only a small
   public API is returned for reading, placing, and resetting tokens.
*/
function gameBoard (row = 3, col = 3) {
    const boardState = [];

    function reset () {
        for (let i = 0; i < row; i++) {
            boardState[i] = [];
            for (let j = 0; j < col; j++) {
                boardState[i][j] = "";
            }
        }
    }
    reset();

    function isEmpty (row, col) {
        return boardState[row][col] === "";
    }

    function getToken (row, col) {
        return boardState[row][col];
    }

    function placeToken (row, col, token) {
        boardState[row][col] = token;
    }

    return {reset, isEmpty, getToken, placeToken};
}

/* 
   Player factory

   Stores each player's name and marker.
   The values are kept private and exposed through getter methods so the
   rest of the app can read player data without directly mutating it.
*/
function player (name, marker) {
    function getName () {
        return name;
    }

    function getMarker () {
        return marker;
    }

    return {getName, getMarker};
}

/*
   GameController module

   Coordinates the main game flow: player setup, turn management,
   move validation, win/tie detection, and board resets.
   This is an IIFE because the app only needs one active game controller.
   Internal state such as the board, players, and current player stays private,
   while the returned methods provide a focused public API for the UI layer.
*/
const gameController = (() => {
    const board = gameBoard(3, 3);
    const players = [];
    let currentPlayer;

    function setPlayers (player1 = "Player 1", player2 = "Player 2") {
        players[0] = player(player1, "X");
        players[1] = player(player2, "O");

        currentPlayer = players[0];
    }

    function switchPlayer () {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    function resetGame () {
        board.reset();
        currentPlayer = players[0];
    }

    function getToken(row, col) {
        return board.getToken(row, col);
    }
    
    function makeMove (row, col) {
        if (getGameResult() !== "active" || !board.isEmpty(row, col)) return;
        
        // place token on the board
        board.placeToken(row, col, currentPlayer.getMarker());

        if (getGameResult() === "active")
            switchPlayer();  
    }

    function getGameResult () {
        if (isWin())
            return "win";
        else if (isTie())
            return "tie";
        else
            return "active";
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

    function getWinnerName () {
        return currentPlayer.getName();
    }

    return {setPlayers, resetGame, getToken, makeMove, getGameResult, getWinnerName};
})();

/*
   UIController IIFE module
   
   Handles all DOM-related work for the game: rendering the board,
   responding to button/cell clicks, collecting player names, and showing
   end-of-round messages.
   The UI layer does not modify the board directly. Instead, it communicates
   through the GameController's public methods so game rules and display logic
   stay separated.
*/
const uiController = (() => {
    const uiBoard = document.querySelector(".board");

    function displayBoard () {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cellValue = gameController.getToken(row, col);

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

    function render() {
        uiBoard.innerHTML = "";
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

        if (gameController.getGameResult() !== "active")
            showGameResult();
    }

    function setEventListeners () {
        uiBoard.addEventListener("click", renderMove);

        const form = document.querySelector("form");
        form.addEventListener("submit", setGameStage);

        const clearBtn = document.querySelector(".clear-btn");
        clearBtn.addEventListener("click", function () {
            gameController.resetGame();
            render();
        });
        const newGameBtn = document.querySelector(".new-game-btn");
        newGameBtn.addEventListener("click", function () {
            gameController.resetGame();
            render();
            initializeGame();
        });

        const newRoundBtn = document.querySelector(".new-round");
        newRoundBtn.addEventListener("click", function () {
            document.querySelector("#game-end-msg").close();
            gameController.resetGame();
            render();
        });
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

    function showGameResult () {
        const result = gameController.getGameResult();

        const msgTitle = document.querySelector("dialog#game-end-msg h2");
        const message = result === "win"
            ? `The game is over! The winner is ${gameController.getWinnerName()}! 🎉`
            : "The game is over! It's a tie!";
        msgTitle.textContent = message;

        document.querySelector("#game-end-msg").showModal();
    }

    function initializeGame () {
        document.querySelector("#name").showModal();
    }

    // start game
    setEventListeners();
    initializeGame();
})();