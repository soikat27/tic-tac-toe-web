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

    function placeToken (row, col, token) {
        boardState[row][col] = token;
    }

    function getBoardState () { 
        return boardState;
    }

    return {isEmpty, placeToken, getBoardState};
}

/* Player Object */
function player (name, token) {
    function getName () {
        return name;
    }

    function getToken () {
        return token;
    }

    return {getName, getToken};
}

/* GameController Object */
const gameController = (() => {
    const board = gameBoard(3, 3);
    const boardState = board.getBoardState();
    const players = [player("player 1", "X"), player("player 2", "O")];
    let currentPlayer = players[0];

    function makeMove (row, col) {
        if (!board.isEmpty(row, col))
            return;
        board.placeToken(row, col, currentPlayer.getToken());

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
        const curToken = currentPlayer.getToken();

        if ((boardState[0][0] === curToken && boardState[0][1] === curToken && boardState[0][2] === curToken) ||
            (boardState[1][0] === curToken && boardState[1][1] === curToken && boardState[1][2] === curToken) ||
            (boardState[2][0] === curToken && boardState[2][1] === curToken && boardState[2][2] === curToken) ||
            (boardState[0][0] === curToken && boardState[1][0] === curToken && boardState[2][0] === curToken) ||
            (boardState[0][1] === curToken && boardState[1][1] === curToken && boardState[2][1] === curToken) ||
            (boardState[0][2] === curToken && boardState[1][2] === curToken && boardState[2][2] === curToken) ||
            (boardState[0][0] === curToken && boardState[1][1] === curToken && boardState[2][2] === curToken) ||
            (boardState[0][2] === curToken && boardState[1][1] === curToken && boardState[2][0] === curToken))
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

    return {boardState, makeMove};
})();