document.addEventListener("DOMContentLoaded", function () {
  function parseConfigNumber(rawValue, fallback, min, max) {
    const parsedValue = Number(rawValue);
    if (!Number.isFinite(parsedValue)) {
      return fallback;
    }
    let normalizedValue = Math.floor(Math.min(max, Math.max(min, parsedValue)));
    return normalizedValue;
  }
  const storageData = {
    hscore: parseConfigNumber(localStorage.getItem("hscore"), 0, 0, 999999),
    tickspeed: parseConfigNumber(
      localStorage.getItem("tickspeed"),
      200,
      50,
      500,
    ),
    apples: parseConfigNumber(localStorage.getItem("apples"), 1, 1, 5, true),
    areaSize: parseConfigNumber(localStorage.getItem("areaSize"), 20, 10, 30),
    increment: parseConfigNumber(localStorage.getItem("increment"), 0.1, 0, 2),
    minspeed: parseConfigNumber(localStorage.getItem("minspeed"), 50, 25, 500),
  };
  let area = Array.from({ length: storageData.areaSize }, () =>
    new Array(storageData.areaSize).fill(0),
  );
  let direction = "w";
  let glowa = {
    x: Math.floor(area.length / 2),
    y: Math.floor(area.length / 2),
  };
  let snake = [];
  let lastDirection = "w";
  let punkty = 0;
  const speedForm = document.getElementById("speed");
  const applesForm = document.getElementById("apples");
  const areaSizeForm = document.getElementById("areaSize");
  const incrementForm = document.getElementById("increment");
  const minspeedForm = document.getElementById("minspeed");

  speedForm.value = storageData.tickspeed;
  applesForm.value = storageData.apples;
  areaSizeForm.value = storageData.areaSize;
  incrementForm.value = storageData.increment;
  minspeedForm.value = storageData.minspeed;
  let isPaused = true;
  const punktyCounter = document.getElementById("score");
  /*
    0 - puste
    1 - jabko 
    2 - głowa węsza 
    3+ - ciało węsza
    */
  const canvas = document.getElementById("snakeArea");
  canvas.width = storageData.areaSize;
  canvas.height = storageData.areaSize;
  const draw = canvas.getContext("2d");
  draw.rect(0, 0, 1, 1);
  for (let i = 0; i < storageData.apples; i++) {
    spawnApple();
  }
  initWasz(glowa.x, glowa.y);
  const appleEffect = new Audio("assets/apple.mp3");
  appleEffect.volume = 0.8;
  const audio = new Audio("assets/8-Bit_Katyusha.mp3");
  audio.volume = 0.4;
  audio.loop = true;
  drawArea();
  try {
    audio.play();
  } catch {
    const startAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener("pointerdown", startAudio);
      window.removeEventListener("keydown", startAudio);
      window.removeEventListener("touchstart", startAudio);
    };
    window.addEventListener("pointerdown", startAudio);
    window.addEventListener("keydown", startAudio);
    window.addEventListener("touchstart", startAudio);
  }
  //Rysowanie planszy
  document
    .getElementById("config-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      storageData.tickspeed = parseConfigNumber(
        speedForm.value,
        200,
        50,
        500,
        true,
      );
      storageData.apples = parseConfigNumber(applesForm.value, 1, 1, 5, true);
      storageData.areaSize = parseConfigNumber(
        areaSizeForm.value,
        20,
        10,
        30,
        true,
      );
      storageData.increment = parseConfigNumber(incrementForm.value, 0.1, 0, 2);
      storageData.minspeed = parseConfigNumber(
        minspeedForm.value,
        50,
        25,
        500,
        true,
      );
      localStorage.setItem("tickspeed", storageData.tickspeed);
      localStorage.setItem("apples", storageData.apples);
      localStorage.setItem("areaSize", storageData.areaSize);
      localStorage.setItem("increment", storageData.increment);
      localStorage.setItem("minspeed", storageData.minspeed);
      window.location.reload();
    });
  function drawArea() {
    for (let i = 0; i < area.length; i++) {
      for (let j = 0; j < area[i].length; j++) {
        switch (area[i][j]) {
          case 0:
            draw.fillStyle = "#08110b";
            break;
          case 1:
            draw.fillStyle = "#d6ffbf";
            break;
          case 2:
            draw.fillStyle = "#b7ff8a";
            break;
          default:
            draw.fillStyle = "#79e06a";
            break;
        }
        draw.fillRect(j, i, 1, 1);
      }
    }
  }
  //Klawisze sterujące
  document.addEventListener("keydown", function (event) {
    if (event.key === "w") {
      direction = "w";
    } else if (event.key === "a") {
      direction = "a";
    } else if (event.key === "s") {
      direction = "s";
    } else if (event.key === "d") {
      direction = "d";
    } else if (event.key === "p") {
      tooglePause();
    }
  });

  // Inicjalizacja węszaa na planszy
  function initWasz(startX, startY) {
    snake = [{ x: startX, y: startY }];
    area[startX][startY] = 2;
  }

  // Ruszanie węsza
  function ruszReszteWesza(nextHeadX, nextHeadY, ateFood = false) {
    // Ustaw poprzednią głowę jako ciało
    area[glowa.x][glowa.y] = 3;

    // Dodaj nową głowę
    snake.unshift({ x: nextHeadX, y: nextHeadY });
    area[nextHeadX][nextHeadY] = 2;

    // Jeśli wąż nie zjadł jedzenia, obetnij mu ogon, troche brutalne ale działa
    if (!ateFood) {
      const tail = snake.pop();
      area[tail.x][tail.y] = 0;
    }
  }

  //Pętla gry
  setInterval(function () {
    mainTick();
  }, storageData.tickspeed);
  function mainTick() {
    if (isPaused) {
      return;
    }
    try {
      // Oblicz nowe położenie głowy
      let nextHeadX = glowa.x;
      let nextHeadY = glowa.y;
      // Zapobiegaj cofnięciu się węsza
      let moveDirection = direction;
      if (
        (direction === "w" && lastDirection === "s") ||
        (direction === "s" && lastDirection === "w") ||
        (direction === "a" && lastDirection === "d") ||
        (direction === "d" && lastDirection === "a")
      ) {
        if (snake.length > 1) {
          moveDirection = lastDirection;
        }
      }

      switch (moveDirection) {
        case "w":
          nextHeadX--;
          break;
        case "a":
          nextHeadY--;
          break;
        case "s":
          nextHeadX++;
          break;
        case "d":
          nextHeadY++;
          break;
      }
      lastDirection = moveDirection;

      // Bardzo długi warunek do zabijania węsza
      if (
        nextHeadX < 0 ||
        nextHeadX >= area.length ||
        nextHeadY < 0 ||
        nextHeadY >= area[0].length
      ) {
        killWasz(1);
        return;
      } else if (area[nextHeadX][nextHeadY] >= 2) {
        killWasz(0);
        return;
      }

      const ateFood = area[nextHeadX][nextHeadY] === 1;
      if (ateFood) {
        punkty++;
        punktyCounter.textContent = punkty;
        spawnApple();
        appleEffect.play();
      }

      // Rusz węsza
      ruszReszteWesza(nextHeadX, nextHeadY, ateFood);

      // Aktualizuj położenie głowy
      glowa.x = nextHeadX;
      glowa.y = nextHeadY;

      drawArea();
    } catch (error) {
      // Nie najlepszy sposób na wykrycie wyjścia poza zakres tablicy, ale ify mi nie chciały działać
      killWasz(1);
    }
  }
  //Spawnowanie jabłka
  function spawnApple() {
    if (!area.flat().includes(0)) {
      killWasz(2);
      return;
    }
    let x = Math.floor(Math.random() * area.length);
    let y = Math.floor(Math.random() * area.length);
    if (area[x][y] === 0) {
      area[x][y] = 1;
    } else {
      spawnApple();
    }
  }
  //Pauza
  const pauseText = document.getElementById("pause-text");
  function tooglePause() {
    pauseText.textContent =
      "Wąsz jest zatrzymany, wciśnij P aby przejąć sterowanie węsza";
    document.getElementById("config-form").style.display = "none";
    isPaused = !isPaused;
    if (isPaused) {
      pauseText.style.display = "block";
      canvas.style.opacity = "0.5";
    } else {
      pauseText.style.display = "none";
      canvas.style.opacity = "1";
    }
  }
  function killWasz(deathType) {
    if (punkty > storageData.hscore) {
      localStorage.setItem("hscore", punkty);
    }
    window.location.href =
      "lost.html?score=" + punkty + "&deathType=" + deathType;
  }
});
