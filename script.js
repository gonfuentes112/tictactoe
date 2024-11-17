function Board() {
    const size = 3;
    const innerBoard = [];
    for (let i = 0; i < size * size; i++) {
        innerBoard.push(Cell());
    }

    const markCell = (playerValue, location) => {
        const cell = innerBoard[location];
        if (!cell.isEmpty()) {
            return false;
        }
        cell.setValue(playerValue);
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
    const players = [
                    {
                        name: 'Player1',
                        symbol: 1
                    }, 
                    {
                        name: 'Player2',
                        symbol: 2
                    }];
    let activePlayer = players[0];

    const getActivePlayer = () => {
        return activePlayer;
    }

    function switchTurn() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const makeMove = (location) => {
        const moveExecuted = gameBoard.markCell(activePlayer.symbol, location);
        if (moveExecuted) {
            switchTurn();
        }
        return moveExecuted;

    }

    return {
        getActivePlayer,
        makeMove
    }
}

function GameVisual() {
    const gameLogic = GameLogic();
    const playerField = document.getElementById('player-turn-field');
    playerField.innerText = `${gameLogic.getActivePlayer().name}'s turn`;
    const winnerField = document.getElementById('winner-field');
    const screenBoard = document.getElementById('screen-board');

    function score(event) {
        const target = event.target;
        if (!target.classList.contains('button')) {
            return;
        }

        if (target.classList.contains('player-one-cell')
            || target.classList.contains('player-two-cell')) {
            return
        }

        const location = target.dataset.location;
        const currentPlayer = gameLogic.getActivePlayer();
        const moveExecuted = gameLogic.makeMove(location);
        if (moveExecuted) {
            if (currentPlayer.symbol === 1) {
                target.classList.toggle('player-one-cell');
                target.innerText = 'O';
            }
            if (currentPlayer.symbol === 2) {
                target.classList.toggle('player-two-cell');
                target.innerText = 'X';
            }

            playerField.innerText = `${gameLogic.getActivePlayer().name}'s turn`;            
        }
    }

    screenBoard.addEventListener('click', score);

    for(let i = 0; i < 9 ; i++) {
        const cellButton = document.createElement('button');
        cellButton.classList.add('button')
        cellButton.dataset.location = i;
        screenBoard.appendChild(cellButton);
    }


}

GameVisual()