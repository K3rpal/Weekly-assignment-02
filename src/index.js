// CT30A3203 Web Applications
// Weekly Assignment 2
// Topi Jussinniemi

import "./styles.css";

// Table for calculating winning combinations
let score = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
];

let player = 1; // Which players turn it is
let round = 0; // Number of filled cells
let winner = 0; // indicates which player won. Value 3 means draw.
let interval;

if (document.readyState !== "loading") {
  // Document ready, executing
  console.log("Document ready, executing");
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function() {
    // Document was not ready, executing when loaded
    console.log("Document ready, executing after a wait");
    initializeCode();
  });
}

function initializeCode() {
  console.log("Initializing");
  // Adding all cells of the table to an array
  const cells = document.getElementsByTagName("td");
  let i;
  for (i = 0; i < cells.length; i++) {
    let location_xy = cells[i].id.split("."); // coordinates of the cliked cell
    let cell_id = cells[i].id;
    cells[i].addEventListener("mousedown", event => {
      click_cell(location_xy[0], location_xy[1], cell_id);
      event.stopPropagation();
    });
  }
  move_bar();
}

// Function that is executed when user clicks a cell
function click_cell(x, y, cell_id) {
  // Checking that the clicked cell has not been already filled
  if (score[x][y] == 0) {
    if (player == 1 && round < 25) {
      // Player 1 (X) turn
      round = round + 1;
      document.getElementById(cell_id).innerHTML = "X";
      color_cell_x(cell_id);
      score[x][y] = 1;
      player = 2;
      document.getElementById("player_turn").innerHTML = "Player 2 (O) turn";
      check_for_winner(x, y);
    } else if (player == 2 && round < 25) {
      // Player 2 (O) turn
      round = round + 1;
      document.getElementById(cell_id).innerHTML = "O";
      color_cell_o(cell_id);
      score[x][y] = -1;
      player = 1;
      document.getElementById("player_turn").innerHTML = "Player 1 (X) turn";
      check_for_winner(x, y);
    }
  }
}

// Function for checking if player has got 5 same symbols in a row, column or diagonal
function check_for_winner(x, y) {
  let row,
    column,
    diagonal1,
    diagonal2 = 0;

  diagonal1 = check_diagonal_1();
  diagonal2 = check_diagonal_2();
  row = check_row(x);
  column = check_column(y);

  // 5 X in a row, column or diagonal. Player 1 wins.
  if (row == 5 || column == 5 || diagonal1 == 5 || diagonal2 == 5) {
    winner = 1;
    alert("Player 1 won!");
    reset_board();
    // 5 O in a row, column or diagonal. Player 2 wins.
  } else if (row == -5 || column == -5 || diagonal1 == -5 || diagonal2 == -5) {
    winner = 2;
    alert("Player 2 won!");
    reset_board();
  }
  // All cells are filled and neither of the players got 5 symbols in a row, column or diagonal. It is a draw.
  if (winner == 0 && round == 25) {
    winner = 3;
    alert("Draw. Nobody wins.");
    reset_board();
  }
  clearInterval(interval);
  move_bar();
}

// Function for checking is there 5 same symvols in a row.
function check_row(x) {
  let row = 0;
  let i;
  for (i = 0; i < 5; i++) {
    row = row + score[x][i];
  }
  return row;
}

// Function for checking is there 5 same symbols in a column.
function check_column(y) {
  let column = 0;
  let i;
  for (i = 0; i < 5; i++) {
    column = column + score[i][y];
  }
  return column;
}

// Function for checking is there 5 symbols in diagonal from upper left corner to lover right corner.
function check_diagonal_1() {
  let diagonal1 = 0;
  let i;
  for (i = 0; i < 5; i++) {
    diagonal1 = diagonal1 + score[i][i];
  }
  return diagonal1;
}

// Function for checking is there 5 same symbols in a diagonal starting from lower left corner to upper right corner.
function check_diagonal_2() {
  let diagonal2 = 0;
  let i;
  let j = 4;
  for (i = 0; i < 5; i++) {
    diagonal2 = diagonal2 + score[i][j];
    j = j - 1;
  }
  return diagonal2;
}

// Function for resetting the game and board.
function reset_board() {
  round = 0;
  player = 1;
  winner = 0;
  let i, j;

  // Resetting the table  to calculate winnning combinations.
  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      score[i][j] = 0;
    }
  }
  // Resetting the tic-tac-toe table
  let cells = document.getElementsByTagName("td");
  for (i = 0; i < cells.length; i++) {
    document.getElementById(cells[i].id).innerHTML = "";
    reset_cell_color(cells[i].id);
  }
  document.getElementById("player_turn").innerHTML = "Player 1 (X) turn";
  console.log("Board has been reset.");
}

// Function to color cell when player 1 clicks it
function color_cell_x(cell_id) {
  const att = document.createAttribute("class");
  att.value = "x_cell";
  document.getElementById(cell_id).setAttributeNode(att);
}

// Function to color cell when player 2 clicks it
function color_cell_o(cell_id) {
  const att = document.createAttribute("class");
  att.value = "o_cell";
  document.getElementById(cell_id).setAttributeNode(att);
}

// Function to reset background color of colored cells back to transparent
function reset_cell_color(cell_id) {
  const att = document.createAttribute("class");
  att.value = "reset_cell";
  document.getElementById(cell_id).setAttributeNode(att);
}

// Function to move the progress bar every 100 ms
// Idea and some code taken from:
// https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_setinterval_progressbar
function move_bar() {
  let bar_width = 0;
  let p_bar = document.getElementById("bar");
  interval = setInterval(frame, 100);

  function frame() {
    if (winner != 0) {
      clearInterval(interval);
    } else if (bar_width == 100 && winner == 0) {
      clearInterval(interval);
      if (player == 1) {
        player = 2;
        document.getElementById("player_turn").innerHTML = "Player 2 (O) turn";
        p_bar.style.width = "0%";
        move_bar();
      } else {
        player = 1;
        document.getElementById("player_turn").innerHTML = "Player 1 (X) turn";
        p_bar.style.width = "0%";
        move_bar();
      }
    } else {
      bar_width = bar_width + 1;
      p_bar.style.width = bar_width + "%";
    }
  }
}
