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

    function placeMove (row, col, token) {
        boardState[row][col] = token;
    }

    function getBoardState () { 
        return boardState;
    }

    return {isEmpty, placeMove, getBoardState};
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