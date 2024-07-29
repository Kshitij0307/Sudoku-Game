# Sudoku-Game
Sudoku Game - A feature-rich Sudoku game built with JavaScript, including puzzle generation, solving algorithms, score tracking, mistake handling, hints, and a timer. Enjoy an interactive UI with dynamic updates and difficulty selection. Play, pause, and reset the game seamlessly for an engaging user experience.

Key Features:

=> Puzzle Generation and Solving: The game fetches a new puzzle from an API based on the selected difficulty. It uses a backtracking algorithm to solve the puzzle and ensure the solution is correct.

=> User Interface: The game board is dynamically populated with the puzzle, and user interactions are handled through event listeners. Users can select boxes, fill numbers, and use a num pad for input.

=> Score and Mistake Tracking: The game tracks the player's score and mistakes. Correct moves increase the score, while incorrect moves decrease it and increment the mistake counter. If the player makes three mistakes, the game is over.

=> Hints and Undo Functionality: Players have a limited number of hints they can use to reveal the correct number for a selected box. They can also undo their last move.

=> Timer and Game Controls: The game includes a timer to track the duration of gameplay. Players can pause and resume the game, which hides the board and stops the timer.

=> Game Over and New Game: When the puzzle is solved or the game is over due to mistakes, a modal is displayed with options to start a new game with a selected difficulty.
