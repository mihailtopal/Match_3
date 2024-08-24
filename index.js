let bestScore = 0;
let lastClickedCell = null;
let countOfIdentical = 1;
let currentPlace;
let tempPlace;
let intervalId;
let hashPlace;
let falling = false;
let drop = false;
let tempRow;
let firstBurn = 1;
let tempValue;
let score = 0;
document.getElementById("scoreValue").innerText = score;
document.getElementById("bestScoreValue").innerText = bestScore;
let place = Array.from({ length: 10 }, () =>
  Array.from({ length: 10 }, () => Math.floor(Math.random() * 6))
);
newPlaceWithoutMarh3(place);
score = 0;
function newPlaceWithoutMarh3(place) {
  currentPlace = countingShapes(place);
  if (currentPlace.some((el) => el.some((el) => el == -1))) {
    for (let x = 0; x < currentPlace.length; x++) {
      for (let y = 0; y < currentPlace[x].length; y++) {
        currentPlace[x][y] == -1
          ? (place[x][y] = Math.floor(Math.random() * 6))
          : true;
      }
    }
  }
  currentPlace = countingShapes(place);
  if (currentPlace.some((el) => el.some((el) => el == -1))) {
    newPlaceWithoutMarh3(place);
  } else {
    return place;
  }
}
function displayBoard(currentPlace) {
  tempPlace = countingShapes(currentPlace);
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  for (let x = 0; x < currentPlace.length; x++) {
    for (let y = 0; y < currentPlace[x].length; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add(`alive${currentPlace[x][y]}`);
      if (tempPlace[x][y] == -1) {
        score += 50;

        cell.classList.add(`explode`);
      }
      cell.addEventListener("click", () => handleCellClick(x, y, cell));

      gameBoard.appendChild(cell);
    }
  }
}
displayBoard(place);

function handleCellClick(x, y, cell) {
  if (lastClickedCell !== null && !falling) {
    tempValue = place[x][y];
    if (
      Math.abs(lastClickedCell.x - x) + Math.abs(lastClickedCell.y - y) <=
      1 // если ячейки рядом и разного цвета
    ) {
      tempPlace = JSON.parse(JSON.stringify(place));
      tempPlace[x][y] = place[lastClickedCell.x][lastClickedCell.y];
      tempPlace[lastClickedCell.x][lastClickedCell.y] = tempValue;
      currentPlace = countingShapes(tempPlace);

      if (currentPlace.some((el) => el.some((el) => el == -1))) {
        // если можно поменять чтобы что то сгорело
        falling = true;
        firstBurn = 1;
        place = JSON.parse(JSON.stringify(tempPlace));

        moveAnimation(lastClickedCell, x, y, cell);
        runInterval();
      } else {
        // если можно поменять но ничего не сгорит
        negativeClickReverse(tempCell, cell, lastClickedCell, x, y);
        removeMovedClass(tempCell, cell);
        lastClickedCell = null;
      }
      removeMovedClass(tempCell, cell);
    } else {
      // если ячейки не рядом или одного цвета
      negativeClick(tempCell, cell);
      lastClickedCell = null;
    }
  } else if (!falling) {
    cell.classList.add(`alive_clicked`); // добавляем пульсацию
    lastClickedCell = { x, y };
    tempCell = cell; // сохраняем позицию первой нажатой клетки
  }
}
function moveAnimation(lastClickedCell, x, y, cell) {
  if (lastClickedCell.x === x && lastClickedCell.y < y) {
    cell.classList.add(`move_left`);
    tempCell.classList.replace(`alive_clicked`, `move_right`);
  } else if (lastClickedCell.x === x && lastClickedCell.y > y) {
    cell.classList.add(`move_right`);
    tempCell.classList.replace(`alive_clicked`, `move_left`);
  } else if (lastClickedCell.x > x && lastClickedCell.y === y) {
    cell.classList.add(`move_top`);
    tempCell.classList.replace(`alive_clicked`, `move_bottom`);
  } else if (lastClickedCell.x < x && lastClickedCell.y === y) {
    cell.classList.add(`move_bottom`);
    tempCell.classList.replace(`alive_clicked`, `move_top`);
  }
}
function removeMovedClass(tempCell, cell) {
  setTimeout(() => {
    cell.classList.remove(
      `move_right`,
      `move_left`,
      `move_top`,
      `move_bottom`,
      `move_right_to_left`,
      `move_left_to_right`,
      `move_down_to_up`,
      `move_up_to_down`
    );
    tempCell.classList.remove(
      `move_right`,
      `move_left`,
      `move_top`,
      `move_bottom`,
      `move_right_to_left`,
      `move_left_to_right`,
      `move_down_to_up`,
      `move_up_to_down`
    );

    lastClickedCell = null;
  }, 500);
}
function negativeClick(tempCell, cell) {
  tempCell.classList.remove(`alive_clicked`); // убираем пульсацию
  tempCell.classList.add(`alive_negative`); // добавляем класс с анимацией отрицания
  cell.classList.add(`alive_negative`); // добавляем класс с анимацией отрицания
  setTimeout(() => {
    tempCell.classList.remove(`alive_negative`); // убираем класс с анимацией отрицания
    cell.classList.remove(`alive_negative`); // убираем класс с анимацией отрицания
  }, 500);
}
function negativeClickReverse(tempCell, cell, lastClickedCell, x, y) {
  if (lastClickedCell.x === x && lastClickedCell.y > y) {
    cell.classList.add(`move_right_to_left`);
    tempCell.classList.replace(`alive_clicked`, `move_left_to_right`);
  } else if (lastClickedCell.x === x && lastClickedCell.y < y) {
    cell.classList.add(`move_left_to_right`);
    tempCell.classList.replace(`alive_clicked`, `move_right_to_left`);
  } else if (lastClickedCell.x > x && lastClickedCell.y === y) {
    cell.classList.add(`move_up_to_down`);
    tempCell.classList.replace(`alive_clicked`, `move_down_to_up`);
  } else if (lastClickedCell.x < x && lastClickedCell.y === y) {
    cell.classList.add(`move_down_to_up`);
    tempCell.classList.replace(`alive_clicked`, `move_up_to_down`);
  }
}
function countingShapes(place) {
  currentPlace = JSON.parse(JSON.stringify(place));
  for (let y = 0; y < currentPlace.length; y++) {
    for (let x = 0; x < currentPlace[0].length; x++) {
      if (place[y][x] == place[y][x + 1] && place[y][x] !== -2) {
        countOfIdentical++;
      } else {
        if (countOfIdentical >= 3) {
          while (countOfIdentical > 0) {
            currentPlace[y][x - countOfIdentical + 1] = -1;
            countOfIdentical--;
          }
        }
        countOfIdentical = 1;
      }
    }
  }
  for (let y = 0; y < currentPlace.length; y++) {
    for (let x = 0; x < currentPlace[0].length; x++) {
      if (
        x < currentPlace.length - 1 &&
        place[x][y] === place[x + 1][y] &&
        place[x][y] !== -2
      ) {
        countOfIdentical++;
      } else {
        if (countOfIdentical >= 3) {
          while (countOfIdentical > 0) {
            currentPlace[x - countOfIdentical + 1][y] = -1;
            countOfIdentical--;
          }
        }
        countOfIdentical = 1;
      }
    }
  }

  return currentPlace;
}
function fallingFigures() {
  tempPlace = JSON.parse(JSON.stringify(place));

  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  for (let y = 0; y <= place.length - 1; y++) {
    if (drop) {
      y++;
      drop = false;
      for (let x = 0; x < tempRow.length; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.classList.add(`alive${tempRow[x]}`, "disable_hover");
        gameBoard.appendChild(cell);
      }
    }
    place[y + 1] ? (tempRow = [...place[y + 1]]) : 0;
    if (!drop && place[y]) {
      for (let x = 0; x < place[0].length; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        if (place[y + 1] && (place[y + 1][x] == -1 || place[y + 1][x] == -2)) {
          cell.classList.add(`alive${place[y][x]}`, "disable_hover");
          cell.classList.add(`move_falling`);
          place[y + 1][x] = place[y][x];
          place[y][x] = -2;

          drop = true;
        } else {
          cell.classList.add(`alive${place[y][x]}`, "disable_hover");
        }

        gameBoard.appendChild(cell);
      }
    }
  }
  if (place[0].some((el) => el == -2 || el == -1)) {
    for (let x = 0; x < place[0].length; x++) {
      if (place[0][x] == -2 || place[0][x] == -1) {
        place[0][x] = Math.floor(Math.random() * 6);
      }
    }
  }

  if (JSON.stringify(place) === JSON.stringify(tempPlace)) {
    if (JSON.stringify(countingShapes(place)) === JSON.stringify(place)) {
      falling = false;
    } else {
      clearInterval(intervalId);
      displayBoard(place);
      place = countingShapes(place);
      runInterval();
    }
    document.getElementById("scoreValue").innerText = score;
    score > bestScore ? (bestScore = score) : 0;
    document.getElementById("bestScoreValue").innerText = bestScore;
  }
}

function runInterval() {
  setTimeout(() => {
    firstBurn == 1 ? firstBurn++ : displayBoard(place);
  }, 500);
  setTimeout(() => {
    intervalId = setInterval(() => {
      if (falling == true) {
        fallingFigures();
      } else {
        clearInterval(intervalId);
        displayBoard(place);
      }
    }, 100);
  }, 400);
}
