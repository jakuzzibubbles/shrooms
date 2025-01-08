const Gameboard = (() => {
  let board = Array(100).fill(""); // 10x10 grid with 100 spots

  const winPatterns = [];

  // Generate winning patterns dynamically
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 6; j++) {
      // Rows
      winPatterns.push([
        i * 10 + j,
        i * 10 + j + 1,
        i * 10 + j + 2,
        i * 10 + j + 3,
        i * 10 + j + 4,
      ]);
      // Columns
      winPatterns.push([
        i + j * 10,
        i + (j + 1) * 10,
        i + (j + 2) * 10,
        i + (j + 3) * 10,
        i + (j + 4) * 10,
      ]);
    }
  }

  // Diagonals
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      winPatterns.push([
        i * 10 + j,
        (i + 1) * 10 + j + 1,
        (i + 2) * 10 + j + 2,
        (i + 3) * 10 + j + 3,
        (i + 4) * 10 + j + 4,
      ]);
      winPatterns.push([
        i * 10 + j + 4,
        (i + 1) * 10 + j + 3,
        (i + 2) * 10 + j + 2,
        (i + 3) * 10 + j + 1,
        (i + 4) * 10 + j,
      ]);
    }
  }

  const getBoard = () => board;
  const setMark = (index, mark) => {
    if (!board[index]) board[index] = mark;
  };
  const reset = () => board.fill("");

  return { getBoard, setMark, reset, winPatterns };
})();

const Player = (name, mark) => ({ name, mark });

const GameController = (() => {
  const player1 = Player("Player 1", "🍄");
  const player2 = Player("Player 2", "🍄‍🟫");
  let currentPlayer = player1;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const winPatterns = Gameboard.winPatterns;

    for (const pattern of winPatterns) {
      if (
        board[pattern[0]] &&
        pattern.every((index) => board[index] === board[pattern[0]])
      ) {
        return currentPlayer;
      }
    }
    return board.includes("") ? null : "Tie";
  };

  const playRound = (index) => {
    if (!Gameboard.getBoard()[index]) {
      Gameboard.setMark(index, currentPlayer.mark);
      const winner = checkWinner();
      if (winner) return winner;
      switchPlayer();
    }
    return null;
  };

  const getCurrentPlayer = () => currentPlayer;

  return { playRound, getCurrentPlayer };
})();

const DisplayController = (() => {
  const gameboardDiv = document.querySelector("#gameboard");
  const statusDiv = document.querySelector("#status");
  const restartBtn = document.querySelector("#restart");

  const renderBoard = () => {
    gameboardDiv.innerHTML = "";
    const board = Gameboard.getBoard();

    board.forEach((mark, index) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = mark || "";
      cell.dataset.index = index;
      cell.addEventListener("click", () => handleCellClick(index));
      if (mark) cell.classList.add("taken");
      gameboardDiv.appendChild(cell);
    });
  };

  const handleCellClick = (index) => {
    const winner = GameController.playRound(index);
    renderBoard();
    if (winner) {
      statusDiv.textContent =
        winner === "Tie" ? "It's a tie!" : `${winner.name} wins!`;
      disableBoard(); // Disable further moves after game ends
    } else {
      statusDiv.textContent = `Current Player: ${
        GameController.getCurrentPlayer().name
      }`;
    }
  };

  const disableBoard = () => {
    document
      .querySelectorAll(".cell")
      .forEach((cell) => cell.replaceWith(cell.cloneNode(true)));
  };

  const init = () => {
    restartBtn.addEventListener("click", () => {
      Gameboard.reset();
      renderBoard();
      statusDiv.textContent = `Current Player: ${
        GameController.getCurrentPlayer().name
      }`;
    });
    renderBoard();
  };

  return { init };
})();

DisplayController.init();
