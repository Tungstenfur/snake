document.addEventListener('DOMContentLoaded', function() {
    let area = Array.from({ length: 20 }, () => new Array(20).fill(0));
    let direction = 'w';
    let glowa = { x: 10, y: 10 };
    let snake = [];
    let lastDirection = 'w';
    let punkty = 0;
    const punktyCounter = document.getElementById('score');
    /*
    0 - puste
    1 - jabko 
    2 - głowa węsza 
    3+ - ciało węsza
    */
    const canvas = document.getElementById('snakeArea');
    const draw = canvas.getContext('2d');
    draw.rect(0,0,1,1);
    drawArea();
    spawnApple();
    initSnake(glowa.x, glowa.y);

    //Rysowanie planszy
    function drawArea()
    {
        for(let i = 0; i < area.length; i++)
        {
            for(let j = 0; j < area[i].length; j++)
            {
                switch(area[i][j])
                {
                    case 0:
                        draw.fillStyle = '#08110b';
                        break;
                    case 1:
                        draw.fillStyle = '#d6ffbf';
                        break;
                    case 2:
                        draw.fillStyle = '#b7ff8a';
                        break;
                    default:
                        draw.fillStyle = '#79e06a';
                        break;
                }
                draw.fillRect(j, i, 1, 1);
            }
        }
    }
    //Klawisze sterujące
    document.addEventListener('keydown', function(event) {
        if(event.key === 'w') {
            direction = 'w';
        }
        else if(event.key === 'a') {
            direction = 'a';
        }
        else if(event.key === 's') {
            direction = 's';
        }
        else if(event.key === 'd') {
            direction=('d');
        }
    });

    // Inicjalizacja węszaa na planszy
    function initSnake(startX, startY) {
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
    setInterval(function() {
        try {
            // Oblicz nowe położenie głowy
            let nextHeadX = glowa.x;
            let nextHeadY = glowa.y;
            let moveDirection = direction;
            if (
                (direction === 'w' && lastDirection === 's') ||
                (direction === 's' && lastDirection === 'w') ||
                (direction === 'a' && lastDirection === 'd') ||
                (direction === 'd' && lastDirection === 'a')
            ) {
                if (snake.length > 1) {
                    moveDirection = lastDirection;
                }
            }

            switch (moveDirection) {
                case 'w':
                    nextHeadX--;
                    break;
                case 'a':
                    nextHeadY--;
                    break;
                case 's':
                    nextHeadX++;
                    break;
                case 'd':
                    nextHeadY++;
                    break;
            }
            lastDirection = moveDirection;

            // Bardzo długi warunek do zabijania węsza
            if (nextHeadX < 0 || nextHeadX >= area.length || nextHeadY < 0 || nextHeadY >= area[0].length || area[nextHeadX][nextHeadY] >= 2) {
                window.location.href = 'lost.html';
                return;
            }

            const ateFood = area[nextHeadX][nextHeadY] === 1;
            if (ateFood) {
                punkty++;
                punktyCounter.textContent = punkty;
                spawnApple();
            }

            // Rusz węsza
            ruszReszteWesza(nextHeadX, nextHeadY, ateFood);

            // Aktualizuj położenie głowy
            glowa.x = nextHeadX;
            glowa.y = nextHeadY;

            drawArea();
        } catch (error) {
            window.location.href = 'lost.html';
        }
    }, 200);

    //Spawnowanie jabłka
    function spawnApple()
    {

        let x = Math.floor(Math.random() * 20);
        let y = Math.floor(Math.random() * 20);
        if(area[x][y] === 0)
        {
            area[x][y] = 1;
        }
        else
        {
            spawnApple();
        }
        
    }
});