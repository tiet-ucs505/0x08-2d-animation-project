class Experiment {
  // Group Details
  static rollNos = '102103092,102103180';
  static names = 'Pahuljot Singh, Sanmaandeep Singh Gill';

  canvasSel = '#myCanvas';

  run() {
    const canvas = document.querySelector(this.canvasSel);
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    const ctx = canvas.getContext('2d');

    let ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 15,
      dx: 8,
      dy: 8
    };

    let score = 0;
    let lifelines = 3;

    function drawBall() {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    }

    function updateBallPosition() {
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }

      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }

      if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        lifelines--;
        updateInfo();
      }
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function updateInfo() {
      document.getElementById('score').innerText = score;
      document.getElementById('lifelines').innerText = lifelines;

      if (lifelines <= 0) {
        gameOver();
      }
    }

    function gameOver() {
      alert('Game Over! Your final score is: ' + score);
      location.reload(); // Reload the page to start a new game
    }

    function checkCollision() {
      if (ball.y + ball.radius >= canvas.height - 30) {
        if (ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width) {
          ball.dy = -ball.dy;
          score++;
          updateInfo();
        }
      }
    }

    function run() {
      clearCanvas();
      drawBall();
      updateBallPosition();
      checkCollision();
      drawPaddle();
      requestAnimationFrame(run);
    }

    let paddle = {
      x: (canvas.width - 100) / 2,
      y: canvas.height - 20,
      width: 150,
      height: 10,
      color: '#0095DD'
    };

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.fillStyle = paddle.color;
      ctx.fill();
      ctx.closePath();
    }

    document.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowRight' && paddle.x + paddle.width < canvas.width) {
        paddle.x += 50; // Adjust the paddle movement speed as needed
      } else if (event.key === 'ArrowLeft' && paddle.x > 0) {
        paddle.x -= 50; // Adjust the paddle movement speed as needed
      }
    });

    run();
  }

  runSteppers() {

    // Steppers
    // --------------------------------------------------
    const stepperOneRaf
      = window.requestAnimationFrame(stepperOne)

    const stepperTwoRaf
      = window.requestAnimationFrame(stepperTwo)

    const stepperThree = new StepperThree(
      '#valueFromStepperThree', 15
    )
    const stepperThreeFn = (ts) => {
      if (!stepperThree.isActive) stepperThree.start()
      stepperThree.step(ts)
      window.requestAnimationFrame(stepperThreeFn)
    }
    const stepperThreeRaf
      = window.requestAnimationFrame(stepperThreeFn)
    // --------------------------------------------------
    
  }

  hideSteppers() {
    document.querySelector('#side-note')
      .classList.add('hidden')
  }
}

// Initialize and run the experiment
const experiment = new Experiment();
experiment.run();
