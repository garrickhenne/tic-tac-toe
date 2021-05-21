const player = (piece) => {
    let _wins = 0;
    const getPiece = () => piece;
    const getWins = () => _wins;
    const addWin = () => _wins++;

    return {getPiece, getWins, addWin}
};

const gameboard = (function() {
    // True: player 1's turn, False: player 2's turn
    const player1 = player("X");
    const player2 = player("O");


    let _turn = true;
    let _board = Array(9).fill('');
    let getSquare = (num) => _board[num];
    let setSquare = (num, piece) => {
        _board[num] = piece;
        displayController.updateBoard();
    }

    const rotateTurns = () => _turn = !_turn;

    const getTurn = () => _turn;

    // Clear board array, set turn to true;
    let clearBoard = () => {
        _board = Array(9).fill('');
        _turn = true;
    }

    const isFull = () => {
        for (let square of _board) {
            if (square === '') return false;
        }
        return true;
    }


    return {getSquare, clearBoard, setSquare, rotateTurns, getTurn, isFull}


})();

const displayController = (function() {
    const squares = Array.from(document.querySelectorAll('.square'));
    const restartBtn = document.querySelector('.restart');
    const turnText = document.querySelector('.turn-display');

    let determineClick = (e) => {
        let index = e.target.dataset.indexNumber;
        
        if (gameboard.getSquare(index) !== '') {
            console.log("Cant place here");
            if (gameboard.isFull()) {
                turnText.textContent = "It's a tie...";
            }
            return; // A player has already chosen that spot, try again
        }

        if (gameboard.getTurn()) {
            turnText.textContent = "Player 2's Turn (O)";
            gameboard.setSquare(index, "X");
            gameboard.rotateTurns();
            
        } else {
            turnText.textContent = "Player 1's Turn (X)";
            gameboard.setSquare(index, "O");
            gameboard.rotateTurns();
            
        }
        
    }

    let updateBoard = () => {
        for (let i = 0; i < squares.length; i++) {
            squares[i].textContent = gameboard.getSquare(i);
        }

        if (gameLogic.checkWin() === 'xWin') {
            turnText.textContent = "Player 1 Wins!";
        } else if (gameLogic.checkWin() === 'oWin') {
            turnText.textContent = "Player 2 Wins";
        } else if (gameboard.isFull()) {
            turnText.textContent = "Its a tie...";
        }

    }

    const restart = () => {
        gameboard.clearBoard();
        turnText.textContent = "Player 1's Turn (X)";
        updateBoard();
    };

    squares.forEach((e) => {
        e.addEventListener('click', determineClick);
    });

    restartBtn.addEventListener('click', restart);

    return { updateBoard }



})();

const gameLogic = (function() {

    const _checkForWin = (piece) => {
        //Vertical check
        return _vertWin(piece) || _horWin(piece) || _diagWin(piece);
    }

    const _vertWin = (piece) => {
        let square = gameboard.getSquare;
        return (square(0) === piece && square(1) === piece && square(2) === piece) ||
                (square(3) === piece && square(4) === piece && square(5) === piece) ||
                (square(6) === piece && square(7) === piece && square(8) === piece);

    }

    const _horWin = (piece) => {
        let square = gameboard.getSquare;
        return (square(0) === piece && square(3) === piece && square(6) === piece) ||
                (square(1) === piece && square(4) === piece && square(7) === piece) ||
                (square(2) === piece && square(5) === piece && square(8) === piece);
    }

    const _diagWin = (piece) => {
        let square = gameboard.getSquare;
        return (square(0) === piece && square(4) === piece && square(8) === piece) ||
                (square(2) === piece && square(4) === piece && square(6) === piece);
    }

    const checkWin = () => {
        let xWin = _checkForWin("X");
        let oWin = _checkForWin("O");

        if (xWin) {
            return "xWin";
        } else if (oWin) {
            return "oWin";
        } else {
            return "No wins...";
        }
    }

    return {checkWin}
})();

