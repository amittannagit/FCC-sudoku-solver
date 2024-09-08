class SudokuSolver {

  validate(puzzleString) {
    // 1. Check if the length is exactly 81 characters
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }

    // 2. Ensure all characters are valid (digits 1-9 or '.')
    const validCharacters = /^[1-9.]+$/;
    if (!validCharacters.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }

    // 3. If the string passes both checks, return valid
    return { valid: true };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // Calculate the top-left corner of the 3x3 grid
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(column / 3) * 3;

    // Loop through the 3x3 grid
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const index = (regionRowStart + r) * 9 + (regionColStart + c);  // Calculate index in puzzle string
        if (puzzleString[index] == value.toString()) {
          return false;  // Value exists in the region
        }
      }
    }
    return true;  // Value doesn't exist in the region, placement is valid
  }

  checkColPlacement(puzzleString, row, column, value) {
    // Loop through each row to check the value in the given column
    for (let i = 0; i < 9; i++) {
      const index = i * 9 + column;  // Get the index of the column value in the i-th row
      if (puzzleString[index] == value.toString()) {
        return false;  // Value already exists in this column
      }
    }
    return true;  // Value doesn't exist in the column, placement is valid
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // Convert row and column into indexes for a 9x9 grid
    const rowStart = row * 9;  // Calculate the start index of the row

    // Extract the row from the puzzleString
    const rowString = puzzleString.slice(rowStart, rowStart + 9);

    // Check if the value exists in the row
    return !rowString.includes(value.toString());  // Return true if value is not found
  }

  solve(puzzleString) {
    let puzzleArray = puzzleString.split(''); // Convert string to array for easy manipulation

    const solveSudoku = (board) => {
      for (let i = 0; i < 81; i++) {
        if (board[i] === '.') {  // Find an empty cell
          for (let num = 1; num <= 9; num++) {
            let row = Math.floor(i / 9);
            let col = i % 9;

            if (this.checkRowPlacement(board.join(''), row, col, num) &&
                this.checkColPlacement(board.join(''), row, col, num) &&
                this.checkRegionPlacement(board.join(''), row, col, num)) {
              board[i] = num.toString();  // Place number
              
              if (solveSudoku(board)) {  // Recur to solve next empty cell
                return true;
              }
              
              board[i] = '.';  // Backtrack if the placement does not work
            }
          }
          return false;  // No valid number found, return false to backtrack
        }
      }
      return true;  // Puzzle solved
    };

    const isSolved = solveSudoku(puzzleArray);
    return isSolved ? puzzleArray.join('') : null;  // Return null if unsolvable
  }
}

module.exports = SudokuSolver;
