function Board() {
    const size = 3;
    const innerBoard = [];
    for (let i = 0; i < size * size; i++) {
        innerBoard.push(Cell());
    }

    const getBoard = () => {
        return innerBoard;
    }

    const getSize = () => {
        return size;
    }

    const markCell = (playerValue, location) => {
        const cell = innerBoard[location];
        if (!cell.isEmpty()) {
            return false;
        }
        cell.setValue(playerValue);
        return true;
    }

    return {
        getSize,
        getBoard,
        markCell
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

    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const makeMove = (location) => {
        const moveExecuted = gameBoard.markCell(activePlayer.symbol, location);
        return moveExecuted;
    }

    function winHorizontal() {
        let result = false;
        const size = gameBoard.getSize();
        const currentBoard = gameBoard.getBoard();
        for (let i = 0; i < size * size; i += size) {
            result = currentBoard[i].getValue() === currentBoard[i+1].getValue() 
                    && currentBoard[i].getValue() === currentBoard[i+2].getValue()
                    && currentBoard[i].getValue() !== 0;
            if (result) {
                break;
            }
        }
        return result;
    }

    function winVertical() {
        let result = false;
        const size = gameBoard.getSize();
        const currentBoard = gameBoard.getBoard();
        for (let i = 0; i < size; i++) {
            result = currentBoard[i].getValue() === currentBoard[i+size].getValue() 
                    && currentBoard[i].getValue() === currentBoard[i+(size *2)].getValue()
                    && currentBoard[i].getValue() !== 0;
            if (result) {
                break;
            }
        }
        return result;
    }

    function winDiagonal() {
        let result = false;
        const size = gameBoard.getSize();
        const currentBoard = gameBoard.getBoard();
        for (let i = 0; i < size -1; i+=size) {
            result = currentBoard[i].getValue() === currentBoard[(i+1)*size+(i+1)].getValue() 
                    && currentBoard[i].getValue() === currentBoard[(i+2)*size+(i+2)].getValue()
                    && currentBoard[i].getValue() !== 0;
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
        return gameBoard.getBoard().every(cell => !cell.isEmpty());
    }

    return {
        getActivePlayer,
        makeMove,
        switchTurn,
        existsWinner,
        boardFull
    }
}

function GameVisual() {
    const gameLogic = GameLogic();
    const playerField = document.getElementById('player-turn-field');
    playerField.innerText = `${gameLogic.getActivePlayer().name}'s turn`;
    const winnerField = document.getElementById('winner-field');
    const screenBoard = document.getElementById('screen-board');

    function paintPlayerOneCells() {
        const buttonArray = Array.from(screenBoard.children);
        buttonArray.forEach(cell => {
            if (cell.classList.contains('player-one-cell')) {
                cell.classList.toggle('player-one-wins');
            }
            if (cell.classList.contains('player-two-cell')) {
                cell.classList.toggle('player-two-loses');
            }            

            
        });
    }

    function paintPlayerTwoCells() {
        const buttonArray = Array.from(screenBoard.children);
        buttonArray.forEach(cell => {
            if (cell.classList.contains('player-one-cell')) {
                cell.classList.toggle('player-one-loses');
            }
            if (cell.classList.contains('player-two-cell')) {
                cell.classList.toggle('player-two-wins');
            }            

            
        });
    }

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

            if (!gameLogic.existsWinner() && !gameLogic.boardFull() ) {
                gameLogic.switchTurn();
                playerField.innerText = `${gameLogic.getActivePlayer().name}'s turn`;
                return;
            }

            screenBoard.removeEventListener('click', score);

            if (gameLogic.existsWinner()) {
                if (gameLogic.getActivePlayer().symbol === 1) {
                    paintPlayerOneCells();
                } else {
                    paintPlayerTwoCells();
                }
                winnerField.innerText = `${gameLogic.getActivePlayer().name} WINS!!!`;
                return;
            }

            if (gameLogic.boardFull()) {
                winnerField.innerText = "GAME OVER: DRAW";
            }

            
        }
    }

    screenBoard.addEventListener('click', score);

    for(let i = 0; i < 9 ; i++) {
        const cellButton = document.createElement('button');
        cellButton.innerText = " ";
        cellButton.classList.add('button')
        cellButton.dataset.location = i;
        screenBoard.appendChild(cellButton);
    }


}

GameVisual()