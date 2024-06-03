import Player from "./components/Player/Player";
import GameBoard from "./components/GameBoard/GameBoard";
import Log from "./components/Log/Log";
import { useState } from "react";
import { WINNING_COMBINATIONS } from "./data/WINNING_COMBINATIONS";
import GameOver from "./components/GameOver/GameOver";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

/* function deriveWinner(gameBoard, players) {
  let winner = null;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
} */

function deriveWinner(gameBoard, players) {
  let winner = null;
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      gameBoard[i][0] !== "" &&
      gameBoard[i][0] === gameBoard[i][1] &&
      gameBoard[i][0] === gameBoard[i][2]
    ) {
      return players[gameBoard[i][0]];
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (
      gameBoard[0][i] !== "" &&
      gameBoard[0][i] === gameBoard[1][i] &&
      gameBoard[0][i] === gameBoard[2][i]
    ) {
      return players[gameBoard[0][i]];
    }
  }

  // Check diagonals
  if (
    gameBoard[0][0] !== "" &&
    gameBoard[0][0] === gameBoard[1][1] &&
    gameBoard[0][0] === gameBoard[2][2]
  ) {
    return players[gameBoard[0][0]];
  }
  if (
    gameBoard[0][2] !== "" &&
    gameBoard[0][2] === gameBoard[1][1] &&
    gameBoard[0][2] === gameBoard[2][0]
  ) {
    return players[gameBoard[0][2]];
  }
  return winner;
}

/* function deriveWinner(board, players) {
  const size = board.length;

  // Check rows and columns
  for (let i = 0; i < size; i++) {
    let rowWin = true;
    let colWin = true;
    for (let j = 0; j < size - 1; j++) {
      if (board[i][j] === "" || board[i][j] !== board[i][j + 1]) {
        rowWin = false;
      }
      if (board[j][i] === "" || board[j][i] !== board[j + 1][i]) {
        colWin = false;
      }
    }
    if (rowWin && board[i][0] !== "") return board[i][0];
    if (colWin && board[0][i] !== "") return board[0][i];
  }

  // Check diagonals
  let diag1Win = true;
  let diag2Win = true;
  for (let i = 0; i < size - 1; i++) {
    if (board[i][i] === "" || board[i][i] !== board[i + 1][i + 1]) {
      diag1Win = false;
    }
    if (
      board[i][size - 1 - i] === "" ||
      board[i][size - 1 - i] !== board[i + 1][size - 2 - i]
    ) {
      diag2Win = false;
    }
  }
  if (diag1Win && board[0][0] !== "") return board[0][0];
  if (diag2Win && board[0][size - 1] !== "") return board[0][size - 1];

  // No winner
  return null;
} */

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectedSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      let currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  function handleBoardRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleBoardRestart} />
        )}
        <GameBoard onSelectSquare={handleSelectedSquare} board={gameBoard} />
      </div>

      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
