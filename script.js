function Board() {
    const size = 3;
    const innerBoard = [];
    for (let i = 0; i < size * size; i++) {
        innerBoard.push(Cell());
    }

    const markCell = (playerValue, location) => {
        if (!location.isEmpty()) {
            return false;
        }
        location.setValue(playerValue);
        return true;
    }

    function winHorizontal() {
        let result = false;
        for (let i = 0; i < size * size; i += size) {
            result = board[i].getValue === board[i+1].getValue && board[i].getValue === board[i+2].getValue;
            if (result) {
                break;
            }
        }
        return result;
    }

    function winVertical() {
        let result = false;
        for (let i = 0; i < size; i++) {
            result = board[i].getValue === board[i+size].getValue && board[i].getValue === board[i+(size *2)].getValue;
            if (result) {
                break;
            }
        }
        return result;
    }

    function winDiagonal() {
        let result = false;
        for (let i = 0; i < size -1; i+=size) {
            result = board[i].getValue === board[(i+1)*size+(i+1)].getValue && board[i].getValue === board[(i+2)*size+(i+2)].getValue;
            if (result) {
                break;
            }
        }
        return result;
    }

    const existsWinner = () => {
        return winHorizontal() || winVertical() || winDiagonal();
    }

    const boardFull = () => {
        innerBoard.every(cell => !cell.isEmpty());
    }

    return {
        markCell,
        existsWinner,
        boardFull,
    }

}

function Cell() {
    let value = 0;

    const setValue = (newValue) => {
        value = newValue;
    }

    const isEmpty = () => {
        return value === 0;
    }

    const getValue = () => {
        return value;
    }

    return {
        setValue, 
        isEmpty, 
        getValue
    };
}

function GameLogic() {
    const gameBoard = Board();
    const players = [1, 2];
    let activePlayer = players[0];

    const getActivePlayer = () => {
        return activePlayer;
    }

    function switchTurn() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const makeMove = (location) => {
        const moveExecuted = gameBoard.markCell(activePlayer, location);
        if (moveExecuted) {
            switchTurn();
        }

    }

    return {
        getActivePlayer,
        makeMove
    }
}