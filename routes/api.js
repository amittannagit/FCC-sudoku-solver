'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  // Route to check a puzzle placement
  app.route('/api/check')
  .post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // Validate puzzle
    const validation = solver.validate(puzzle);
    if (!validation.valid) {
      return res.status(200).json({ error: validation.error });
    }

    // Check for required fields
    if (!coordinate || !value) {
      return res.status(200).json({ error: 'Required field(s) missing' });
    }

    // Extract row and column from the coordinate
    const row = coordinate[0].toUpperCase();
    const col = parseInt(coordinate[1], 10) - 1;

    // Check for valid row, col, and value
    if (row < 'A' || row > 'I' || col < 0 || col > 8) {
      return res.status(200).json({ error: 'Invalid coordinate' });
    }

    if (!['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value)) {
      return res.status(200).json({ error: 'Invalid value' });
    }

    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const isRowValid = solver.checkRowPlacement(puzzle, rowIndex, col, value);
    const isColValid = solver.checkColPlacement(puzzle, rowIndex, col, value);
    const isRegionValid = solver.checkRegionPlacement(puzzle, rowIndex, col, value);

    // Check for conflicts
    const conflicts = [];
    if (!isRowValid) conflicts.push('row');
    if (!isColValid) conflicts.push('column');
    if (!isRegionValid) conflicts.push('region');

    if (conflicts.length === 0) {
      return res.status(200).json({ valid: true });
    } else {
      // Include 'conflict' only if there are conflicts
      return res.status(200).json({ valid: false, conflict: conflicts });
    }
  });


  // Route to solve the puzzle
  app.route('/api/solve')
  .post((req, res) => {
    const { puzzle } = req.body;

    // Check if the puzzle string is present
    if (!puzzle) {
      return res.status(200).json({ error: 'Required field(s) missing' });
    }

    // Validate puzzle
    const validation = solver.validate(puzzle);
    if (!validation.valid) {
      return res.status(200).json({ error: validation.error });
    }

    // Solve the puzzle
    try {
      const solution = solver.solve(puzzle);
      if (solution) {
        res.status(200).json({ solution });
      } else {
        // Return an error message if the puzzle cannot be solved
        res.status(200).json({ error: 'Puzzle cannot be solved' });
      }
    } catch (e) {
      // Catch any errors thrown during solving
      res.status(200).json({ error: 'Puzzle cannot be solved' });
    }
  });

};
