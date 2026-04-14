// banana_fall.js
(() => {
  const BANANA_IMAGE = "static/images/loading_banana.png";
  const BANANA_SIZE = 180;
  const MAX_BANANAS = 15;
  const DROP_INTERVAL = 400;
  const GRAVITY = 0.5;
  const BOUNCE = 0.3;
  const FRICTION = 0.98;

  // スタイルを追加
  const style = document.createElement("style");
  style.textContent = `
    .banana-fall {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    }
    
    .banana {
      position: absolute;
      width: ${BANANA_SIZE}px;
      height: ${BANANA_SIZE}px;
      pointer-events: none;
      transition: transform 0.1s linear;
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.className = "banana-fall";
  document.body.appendChild(container);

  const bananas = [];
  let count = 0;

  function dropBanana() {
    if (count >= MAX_BANANAS) {
      clearInterval(timer);
      return;
    }

    const banana = document.createElement("img");
    banana.src = BANANA_IMAGE;
    banana.className = "banana";

    const x = Math.random() * (window.innerWidth - BANANA_SIZE);
    const y = -BANANA_SIZE - 20;

    banana.style.left = `${x}px`;
    banana.style.top = `${y}px`;

    container.appendChild(banana);

    bananas.push({
      element: banana,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: 0,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      width: BANANA_SIZE,
      height: BANANA_SIZE,
      isResting: false,
    });

    count++;
  }

  function checkCollision(b1, b2) {
    const dx = b1.x + b1.width / 2 - (b2.x + b2.width / 2);
    const dy = b1.y + b1.height / 2 - (b2.y + b2.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (b1.width + b2.width) / 3; // 衝突判定の距離

    return distance < minDistance;
  }

  function updatePhysics() {
    const groundY = window.innerHeight - BANANA_SIZE;
    const rightWall = window.innerWidth - BANANA_SIZE;

    bananas.forEach((b, i) => {
      if (b.isResting) return;

      // 重力を適用
      b.vy += GRAVITY;

      // 速度を位置に適用
      b.x += b.vx;
      b.y += b.vy;

      // 回転
      b.rotation += b.rotationSpeed;

      // 他のバナナとの衝突チェック
      for (let j = 0; j < bananas.length; j++) {
        if (i === j) continue;
        const other = bananas[j];

        if (checkCollision(b, other)) {
          // 衝突した場合、上に押し戻す
          if (b.y + b.height > other.y) {
            b.y = other.y - b.height;
            b.vy *= -BOUNCE;
            b.vx *= FRICTION;

            // ほぼ静止していたら完全に止める
            if (Math.abs(b.vy) < 1 && Math.abs(b.vx) < 0.5) {
              b.vy = 0;
              b.vx = 0;
              b.rotationSpeed = 0;
              b.isResting = true;
            }
          }
        }
      }

      // 床との衝突
      if (b.y >= groundY) {
        b.y = groundY;
        b.vy *= -BOUNCE;
        b.rotationSpeed *= FRICTION;

        // 静止判定
        if (Math.abs(b.vy) < 1) {
          b.vy = 0;
          b.vx *= 0.8;
          if (Math.abs(b.vx) < 0.3) {
            b.vx = 0;
            b.rotationSpeed = 0;
            b.isResting = true;
          }
        }
      }

      // 壁との衝突
      if (b.x <= 0) {
        b.x = 0;
        b.vx *= -BOUNCE;
      } else if (b.x >= rightWall) {
        b.x = rightWall;
        b.vx *= -BOUNCE;
      }

      // 摩擦
      b.vx *= FRICTION;

      // DOM更新
      b.element.style.left = `${b.x}px`;
      b.element.style.top = `${b.y}px`;
      b.element.style.transform = `rotate(${b.rotation}deg)`;
    });

    requestAnimationFrame(updatePhysics);
  }

  const timer = setInterval(dropBanana, DROP_INTERVAL);
  updatePhysics();
})();
