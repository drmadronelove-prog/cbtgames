(function () {
  const zone = document.getElementById("hero-zone");
  const ballEl = document.getElementById("hero-ball");
  const paddleEl = document.getElementById("hero-paddle");
  const catchesEl = document.getElementById("hero-catches");
  if (!zone || !ballEl || !paddleEl || !catchesEl) return;

  const RADIUS = 24;
  const PADDLE_WIDTH = 90;
  const PADDLE_Y = 427;
  const TOP_Y = 8;
  const FLOOR_Y = PADDLE_Y - RADIUS;
  const HALF_PADDLE = PADDLE_WIDTH / 2;

  const state = {
    width: zone.offsetWidth,
    ballX: 450,
    ballY: 200,
    vx: 4,
    vy: 0,
    paddleX: 450,
    catches: 0,
  };

  function syncWidth() {
    state.width = zone.offsetWidth;
  }
  window.addEventListener("resize", syncWidth);

  zone.addEventListener("mousemove", (e) => {
    const rect = zone.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(HALF_PADDLE, Math.min(state.width - HALF_PADDLE, x));
    state.paddleX = x;
  });

  let lastTime = null;

  function tick(time) {
    if (lastTime == null) lastTime = time;
    let dt = (time - lastTime) / 16.67;
    lastTime = time;
    dt = Math.min(dt, 2);

    let { width, ballX, ballY, vx, vy, paddleX, catches } = state;

    vy += 0.175 * dt;
    ballX += vx * dt;
    ballY += vy * dt;

    const leftWall = RADIUS;
    if (ballX < leftWall) {
      ballX = leftWall;
      vx = Math.abs(vx) * (0.8 + Math.random() * 0.3);
      if (vx < 2.8) vx = 2.8 + Math.random();
    }
    if (ballX > width - RADIUS) {
      ballX = width - RADIUS;
      vx = -Math.abs(vx) * (0.8 + Math.random() * 0.3);
      if (vx > -2.8) vx = -(2.8 + Math.random());
    }
    if (ballY < TOP_Y) {
      ballY = TOP_Y;
      vy = Math.abs(vy) * 0.8;
    }

    if (ballY >= FLOOR_Y) {
      ballY = FLOOR_Y;
      const caught = ballX > paddleX - HALF_PADDLE - RADIUS && ballX < paddleX + HALF_PADDLE + RADIUS;
      if (caught) {
        vy = -(10 + Math.random() * 5);
        vx += (ballX - paddleX) * 0.09 + (Math.random() - 0.5) * 1.25;
        catches += 1;
      } else {
        vy = -(Math.abs(vy) * (0.9 + Math.random() * 0.15));
        if (Math.abs(vy) < 6) vy = -(9 + Math.random() * 4);
        vx += (Math.random() - 0.5) * 1.5;
      }
      vx = Math.max(-6, Math.min(6, vx));
    }

    Object.assign(state, { ballX, ballY, vx, vy, catches });
    render();
    requestAnimationFrame(tick);
  }

  function render() {
    const { ballX, ballY, paddleX, catches, vy } = state;
    const nearFloor = ballY > PADDLE_Y - RADIUS - 16;
    const squash = nearFloor ? Math.max(0.55, 1 - Math.min(0.4, Math.abs(vy) / 45)) : 1;

    ballEl.style.top = Math.round(ballY - RADIUS) + "px";
    ballEl.style.left = Math.round(ballX - RADIUS) + "px";
    ballEl.style.transform = `scaleY(${squash.toFixed(2)}) scaleX(${(2 - squash).toFixed(2)})`;

    paddleEl.style.left = Math.round(paddleX - HALF_PADDLE) + "px";

    catchesEl.textContent = "CATCHES " + catches;
  }

  render();
  requestAnimationFrame(tick);
})();
