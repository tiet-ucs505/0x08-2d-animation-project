const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let obstacles = [];
let setIntervalId;
let score = 0;
let speedFactor = 1;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const generateObstacles = () => {
  for (let i = 0; i < 5; i++) {
    let obstacleX = Math.floor(Math.random() * 29) + 1;
    let obstacleY = Math.floor(Math.random() * 29) + 1;
    let obstacleLength = Math.floor(Math.random() * 3) + 2;
    let isVertical = Math.random() < 0.5;

    let isValidPosition = true;
    if (isVertical) {
      for (let j = 0; j < obstacleLength; j++) {
        if (snakeBody.some(part => part[0] === obstacleX && part[1] === obstacleY + j)) {
          isValidPosition = false;
          break;
        }
      }
      if (isValidPosition) {
        for (let j = 0; j < obstacleLength; j++) {
          obstacles.push([obstacleX, obstacleY + j]);
        }
      }
    } else {
      for (let j = 0; j < obstacleLength; j++) {
        if (snakeBody.some(part => part[0] === obstacleX + j && part[1] === obstacleY)) {
          isValidPosition = false;
          break;
        }
      }
      if (isValidPosition) {
        for (let j = 0; j < obstacleLength; j++) {
          obstacles.push([obstacleX + j, obstacleY]);
        }
      }
    }
  }
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Game Over! Press OK to replay...");
  location.reload();
};

const changeDirection = e => {
  if (e.key === "ArrowUp") {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown") {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft") {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight") {
    velocityX = 1;
    velocityY = 0;
  }
};

const initGame = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([snakeBody[snakeBody.length - 1][0], snakeBody[snakeBody.length - 1][1]]);
    score++;
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  snakeX += velocityX * speedFactor;
  snakeY += velocityY * speedFactor;

  if (snakeX <= 0) {
    snakeX = 30;
  } else if (snakeX > 30) {
    snakeX = 1;
  } else if (snakeY <= 0) {
    snakeY = 30;
  } else if (snakeY > 30) {
    snakeY = 1;
  } else if (isObstacle(snakeX, snakeY)) {
    return gameOver = true;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];

  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
      return gameOver = true;
    }
  }
  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
      gameOver = true;
    }
  }

  obstacles.forEach(obstacle => {
    html += `<div class="obstacle" style="grid-area: ${obstacle[1]} / ${obstacle[0]}"></div>`;
  });

  snakeBody.forEach((part, index) => {
    html += `<div class="${index === 0 ? 'head' : 'body'}" style="grid-area: ${part[1]} / ${part[0]}"></div>`;
  });

  playBoard.innerHTML = html;
};

const isObstacle = (x, y) => {
  return obstacles.some(obstacle => obstacle[0] === x && obstacle[1] === y);
};

updateFoodPosition();
generateObstacles();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
