
document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const solveBtn = document.getElementById('solve-btn');
    const checkBtn = document.getElementById('check-btn');
    const messageElement = document.getElementById('message');

    let board = [];
    let solution = [];

    function createBoard() {
        boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('input');
                cell.classList.add('cell');
                cell.type = 'number';
                cell.min = 1;
                cell.max = 9;
                cell.dataset.row = i;
                cell.dataset.col = j;
                row.appendChild(cell);
            }
            boardElement.appendChild(row);
        }
    }

    function generateSudoku() {
        board = Array(9).fill(null).map(() => Array(9).fill(0));
        solveSudoku(board);
        solution = JSON.parse(JSON.stringify(board)); // Deep copy
        pokeHoles(board, 40); // Adjust difficulty by changing the number of holes
        fillBoard();
    }

    function fillBoard() {
        const cells = boardElement.getElementsByClassName('cell');
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            if (board[row][col] !== 0) {
                cells[i].value = board[row][col];
                cells[i].classList.add('readonly');
                cells[i].readOnly = true;
            } else {
                cells[i].value = '';
                cells[i].classList.remove('readonly');
                cells[i].readOnly = false;
            }
        }
    }

    function solveSudoku(board) {
        const empty = findEmpty(board);
        if (!empty) {
            return true;
        }
        const [row, col] = empty;

        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
            if (isValid(board, num, row, col)) {
                board[row][col] = num;
                if (solveSudoku(board)) {
                    return true;
                }
                board[row][col] = 0;
            }
        }
        return false;
    }

    function findEmpty(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    return [i, j];
                }
            }
        }
        return null;
    }

    function isValid(board, num, row, col) {
        // Check row
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num && i !== col) {
                return false;
            }
        }
        // Check col
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num && i !== row) {
                return false;
            }
        }
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num && (boxRow + i !== row || boxCol + j !== col)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    function pokeHoles(board, holes) {
        let removed = 0;
        while (removed < holes) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (board[row][col] !== 0) {
                board[row][col] = 0;
                removed++;
            }
        }
    }

    function solvePuzzle() {
        board = JSON.parse(JSON.stringify(solution));
        fillBoard();
    }

    function checkSolution() {
        const cells = boardElement.getElementsByClassName('cell');
        let isCorrect = true;
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            const value = cells[i].value ? parseInt(cells[i].value) : 0;
            if (value !== solution[row][col]) {
                isCorrect = false;
                cells[i].style.backgroundColor = '#ffdddd';
            } else {
                 cells[i].style.backgroundColor = cells[i].classList.contains('readonly') ? '#eee' : '#fff';
            }
        }
        messageElement.textContent = isCorrect ? 'Congratulations! You solved it!' : 'There are some errors.';
    }

    newGameBtn.addEventListener('click', () => {
        messageElement.textContent = '';
        generateSudoku();
    });
    solveBtn.addEventListener('click', solvePuzzle);
    checkBtn.addEventListener('click', checkSolution);

    createBoard();
    generateSudoku();
});
