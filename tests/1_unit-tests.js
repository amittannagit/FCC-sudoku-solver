const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
let solver = new Solver();

suite('Unit Tests', () => {
  // Test 1: Logic handles a valid puzzle string of 81 characters
  test('Logic handles a valid puzzle string of 81 characters', function() {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const result = solver.validate(validPuzzle);
    assert.isTrue(result.valid, 'Puzzle string should be valid');
  });

  // Test 2: Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test('Logic handles a puzzle string with invalid characters', function() {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.a..9.47...8..1..16....926914.37.'; // contains 'a'
    const result = solver.validate(invalidPuzzle);
    assert.isFalse(result.valid, 'Puzzle string should be invalid');
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

  // Test 3: Logic handles a puzzle string that is not 81 characters in length
  test('Logic handles a puzzle string that is not 81 characters in length', function() {
    const shortPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'; // 80 chars
    const result = solver.validate(shortPuzzle);
    assert.isFalse(result.valid, 'Puzzle string should be invalid due to incorrect length');
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
  });

  // Test 4: Logic handles a valid row placement
  test('Logic handles a valid row placement', function() {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkRowPlacement(validPuzzle, 0, 1, '3'); // Place '3' in row 0, column 1
    assert.isTrue(isValid, 'Row placement should be valid');
  });

  // Test 5: Logic handles an invalid row placement
  test('Logic handles an invalid row placement', function() {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkRowPlacement(validPuzzle, 0, 1, '1'); // Place '1' in row 0, column 1 (already exists)
    assert.isFalse(isValid, 'Row placement should be invalid');
  });

  // Test 6: Logic handles a valid column placement
  test('Logic handles a valid column placement', function() {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkColPlacement(validPuzzle, 0, 1, '3'); // Place '3' in row 0, column 1
    assert.isTrue(isValid, 'Column placement should be valid');
  });

  // Test 7: Logic handles an invalid column placement
  test('Logic handles an invalid column placement', function() {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkColPlacement(validPuzzle, 0, 1, '6'); // Place '6' in row 0, column 1 (already exists)
    assert.isFalse(isValid, 'Column placement should be invalid');
  });

  // Test 8: Logic handles a valid region (3x3 grid) placement
  test('Logic handles a valid region placement', function() {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkRegionPlacement(validPuzzle, 0, 1, '3'); // Place '3' in row 0, column 1
    assert.isTrue(isValid, 'Region placement should be valid');
  });

  // Test 9: Logic handles an invalid region (3x3 grid) placement
  test('Logic handles an invalid region placement', function() {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const isValid = solver.checkRegionPlacement(validPuzzle, 0, 1, '2'); // Place '2' in row 0, column 1 (already exists)
    assert.isFalse(isValid, 'Region placement should be invalid');
  });

  // Test 10: Valid puzzle strings pass the solver
  test('Valid puzzle strings pass the solver', function() {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const solution = puzzlesAndSolutions[0][1];
    const result = solver.solve(validPuzzle);
    assert.equal(result, solution, 'Solver should return the correct solution');
  });

  // Test 11: Invalid puzzle strings fail the solver
  test('Invalid puzzle strings fail the solver', function() {
    const invalidPuzzle = '5.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'; // Invalid puzzle (repeating numbers)
    const result = solver.solve(invalidPuzzle);
    assert.isNull(result, 'Solver should return null for an unsolvable puzzle');
  });

  // Test 12: Solver returns the expected solution for an incomplete puzzle
  test('Solver returns the expected solution for an incomplete puzzle', function() {
    const incompletePuzzle = puzzlesAndSolutions[0][0];
    const solution = puzzlesAndSolutions[0][1];
    const result = solver.solve(incompletePuzzle);
    assert.equal(result, solution, 'Solver should return the expected solution');
  });
});

