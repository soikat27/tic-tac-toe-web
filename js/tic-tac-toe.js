/* GameBoard object */
function gameBoard (row = 3, col = 3) {
    const boardState = [];

    function initializeGameBoard () {
        for (let i = 0; i < row; i++) {
            boardState[i] = [];
            for (let j = 0; j < col; j++) {
                boardState[i][j] = "";
            }
        }
    }
    initializeGameBoard();

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

    return {isEmpty, placeToken, getToken};
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
    setPlayers();
    let currentPlayer = players[0];

    function setPlayers (player1 = "Player 1", player2 = "Player 2") {
        players[0] = player(player1, "X");
        players[1] = player(player2, "O");
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

    return {board, currentPlayer, makeMove};
})();

const demo = gameController;
// console.log(demo.board.getBoardState());
demo.makeMove(0,0);
demo.makeMove(0,1);
demo.makeMove(0,2);
demo.makeMove(1,0);
demo.makeMove(1,2);
demo.makeMove(1,1);
demo.makeMove(2,1);
demo.makeMove(2,2);
demo.makeMove(2,0);


/* UI Controller object */
function uiController () {
    const uiBoard = document.querySelector(".board");

    function displayBoard () {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                console.log(gameController.board.getToken(row, col));
                cell.textContent = gameController.board.getToken(row, col);
                cell.classList.add((cell.textContent === "X" ? "p1" : "p2"));
                uiBoard.appendChild(cell);
            } 
        }
    }

    return {displayBoard};
}

const demoUI = uiController ();
demoUI.displayBoard();
