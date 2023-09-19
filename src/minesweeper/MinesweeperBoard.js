/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

const MinesweeperBoard = () => {
  // Define the size of the game board
  const boardWidth = 7;
  const boardHeight = 7;
  const bombCount = 7;

  // Define the initial state of the game board
  const [board, setBoard] = useState(() => {
    const rows = [];
    for (let i = 0; i < boardHeight; i++) {
      const row = [];
      for (let j = 0; j < boardWidth; j++) {
        row.push({
          x: j,
          y: i,
          isBomb: false,
          adjacentBombCount: 0,
          isRevealed: false,
          isFlagged: false,
        });
      }
      rows.push(row);
    }
    return rows;
  });

  // Define the state of the game
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [flagsRemaining, setFlagsRemaining] = useState(bombCount);

  // Generate random bomb locations
  useEffect(() => {
    const randomBombIndices = [];

    while (randomBombIndices.length < bombCount) {
      const randomIndex = Math.floor(Math.random() * boardWidth * boardHeight);
      if (!randomBombIndices.includes(randomIndex)) {
        randomBombIndices.push(randomIndex);
      }
    }
    const newBoard = [...board];
    for (let i = 0; i < boardHeight; i++) {
      for (let j = 0; j < boardWidth; j++) {
        const cell = newBoard[i][j];
        let adjacentBombCount = 0;
        for (let k = i - 1; k <= i + 1; k++) {
          for (let l = j - 1; l <= j + 1; l++) {
            if (k >= 0 && k < boardHeight && l >= 0 && l < boardWidth && !(k === i && l === j)) {
              newBoard[k][l].isBomb = randomBombIndices.includes(k * boardWidth + l) ? true : false;

              adjacentBombCount += newBoard[k][l].isBomb ? 1 : 0;
            }
          }
        }
        cell.adjacentBombCount = adjacentBombCount;
      }
    }
    setBoard(newBoard);
  }, []);

  // Handle cell clicks
  const handleCellClick = (cell) => {
    if (gameOver || gameWon || cell.isRevealed || cell.isFlagged) {
      return;
    }

    // Reveal the clicked cell
    const newBoard = [...board];
    newBoard[cell.y][cell.x].isRevealed = true;
    setBoard(newBoard);
    setRevealedCount((count) => count + 1);

    // Check if the clicked cell is a bomb
    if (cell.isBomb) {
      setGameOver(true);
      return;
    }

    console.log(revealedCount, boardWidth * boardHeight - bombCount);

    // Check if the game has been won
    if (revealedCount === boardWidth * boardHeight - bombCount) {
      setGameWon(true);
      return;
    }

    // Reveal adjacent cells if the clicked cell has no adjacent bombs
    if (cell.adjacentBombCount === 0) {
      revealAdjacentCells(cell);
    }
  };

  // Handle right-clicks to toggle flagging
  const handleCellRightClick = (event, cell) => {
    event.preventDefault();
    if (gameOver || gameWon || cell.isRevealed) {
      return;
    }

    // Toggle the flag on the clicked cell
    const newBoard = [...board];
    newBoard[cell.y][cell.x].isFlagged = !cell.isFlagged;
    setBoard(newBoard);

    // Update the number of flags remaining
    setFlagsRemaining((count) => count + (cell.isFlagged ? 1 : -1));
  };

  // Reveal all adjacent cells with no adjacent bombs

  const revealAdjacentCells = (cell) => {
    const newBoard = [...board];
    const { x, y } = cell;
    const adjacentCells = [];

    // Reveal the cell
    newBoard[y][x].isRevealed = true;
    setRevealedCount((count) => count + 1);

    // Recursively reveal adjacent cells with no adjacent bombs
    adjacentCells.forEach((adjacentCell) => {
      revealAdjacentCells(adjacentCell);
    });

    setBoard(newBoard);
  };

  const giveOneChance = () => {
    setGameOver(false);
    setGameWon(false);
    setRevealedCount(0);
    setFlagsRemaining(bombCount);
  };

  const resetGame = () => {
    window.location.reload();
  };

  const gameStatusClass = () => {
    if (gameOver) {
      return "text-red-50 bg-red-700";
    } else if (gameWon) {
      return "text-green-50 bg-green-800";
    }
    return "text-neutral-50 bg-neutral-300";
  };

  // Render the game board
  return (
    <div className={"flex h-screen flex-col items-center justify-center " + gameStatusClass()}>
      {/* Display the game status */}
      <div className="my-6 mx-8 text-center text-8xl font-bold">
        {gameOver ? (
          <span className="">Game Over</span>
        ) : gameWon ? (
          <span className="">You Win!</span>
        ) : (
          <span className="font-normal">
            {flagsRemaining} {flagsRemaining === 1 ? "flag" : "flags"} left
          </span>
        )}
      </div>
      <div className="relative border-2 border-gray-400">
        {gameOver || gameWon ? (
          <div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center bg-gray-300 bg-opacity-50">
            <button
              className="mb-4 rounded-lg bg-slate-800 px-4 py-2 font-semibold text-slate-100 shadow-lg hover:bg-gray-300 hover:text-slate-800"
              onClick={resetGame}
            >
              Reset Game
            </button>
            {!gameWon && (
              <button
                className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-teal-50 shadow-lg hover:bg-gray-300 hover:text-teal-800"
                onClick={giveOneChance}
              >
                Give me one more chance
              </button>
            )}
          </div>
        ) : null}

        {board.map((row, y) => (
          <div key={y} className="flex flex-row">
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="flex h-12 w-12 cursor-pointer items-center justify-center border-2 border-slate-400 bg-slate-300 text-center text-xl font-bold shadow-lg"
                onClick={() => handleCellClick(cell)}
                onContextMenu={(event) => handleCellRightClick(event, cell)}
              >
                {/* Display the contents of the cell */}
                {cell.isRevealed ? (
                  cell.isBomb ? (
                    <span role="img" aria-label="bomb">
                      💣
                    </span>
                  ) : cell.adjacentBombCount > 0 ? (
                    <span className="text-stone-900">{cell.adjacentBombCount}</span>
                  ) : (
                    <span role="img" aria-label="blank"></span>
                  )
                ) : cell.isFlagged ? (
                  <span role="img" aria-label="flag">
                    🚩
                  </span>
                ) : (
                  <span role="img" aria-label="blank" className="h-full w-full bg-slate-50 hover:bg-slate-300"></span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Display the reset button */}
      <div className="flex flex-col">
        <button
          className="mx-auto my-3 rounded bg-slate-50 py-2 px-4 font-bold text-stone-800 hover:bg-blue-50 hover:text-slate-700 hover:shadow-lg"
          onClick={() => resetGame()}
        >
          Reset
        </button>

        {gameOver || gameWon ? (
          <button
            className="mx-auto my-3 rounded bg-slate-50 py-2 px-4 font-bold text-stone-800 hover:bg-blue-50 hover:text-slate-700 hover:shadow-lg"
            onClick={() => giveOneChance()}
          >
            Give One Chance
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default MinesweeperBoard;
