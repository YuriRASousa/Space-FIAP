document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');
    var bgMusic = new Audio("sounds/background.mp3"); // Carrega o som de fundo
    bgMusic.volume = 0.3; // Define o volume da música para 50%
    var explosionSound = new Audio("sounds/explosion.mp3"); // Carrega o som de explosão
    explosionSound.volume = 0.1;
    var ship = {
        x: canvas.width / 2 - 25,
        y: canvas.height / 2 - 25,
        width: 50,
        height: 50,
        speed: 2 // Reduzindo a velocidade para tornar o movimento mais lento
    };

    var asteroids = [];
    var score = 0;
    var gameOver = false;
    var gameLoop;
    var penaltyAmount = 100; // Defina a quantidade de pontos a serem removidos na penalidade
    var scoreUpdateTime = Date.now(); // Variável para controlar a atualização do score
    var meteorSpeed = 1; // Velocidade inicial dos meteoros

    var shipImage = new Image();
    shipImage.src = "img/nave-espacial.png";

    var asteroidImage = new Image();
    asteroidImage.src = "img/asteroide.png";

    var explosionImage = new Image();
    explosionImage.src = "img/explosao.png";

    var leftPressed = false;
    var rightPressed = false;
    var upPressed = false;
    var downPressed = false;

    function startGame() {
        document.getElementById('startButton').style.display = 'none';
        bgMusic.loop = true;
        bgMusic.play(); // Inicia a reprodução da música de fundo
        gameLoop = setInterval(update, 1000 / 60);

        // Adiciona eventos para detectar quando as teclas são pressionadas e soltas
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
    }

    document.getElementById('startButton').addEventListener('click', startGame);

    function keyDownHandler(event) {
        if (event.key === 'ArrowLeft') {
            leftPressed = true;
        }
        if (event.key === 'ArrowRight') {
            rightPressed = true;
        }
        if (event.key === 'ArrowUp') {
            upPressed = true;
        }
        if (event.key === 'ArrowDown') {
            downPressed = true;
        }
    }

    function keyUpHandler(event) {
        if (event.key === 'ArrowLeft') {
            leftPressed = false;
        }
        if (event.key === 'ArrowRight') {
            rightPressed = false;
        }
        if (event.key === 'ArrowUp') {
            upPressed = false;
        }
        if (event.key === 'ArrowDown') {
            downPressed = false;
        }
    }

    function update() {
        if (!gameOver) {
            score++;
            spawnAsteroid();
            moveShip();
            moveAsteroids();
            checkCollisions();
            increaseMeteorSpeed(); // Verifica se a velocidade dos meteoros precisa ser aumentada
            draw();
        } else {
            clearInterval(gameLoop); // Pare o loop do jogo
            explosionSound.play(); // Reproduz o som de explosão
            drawExplosion();
            endGame();
            setTimeout(reloadPage, 5000); // Recarrega a página após 5 segundos
        }

        // Verifica se o tempo de atualização do score passou 2 segundos e aplica a penalidade se a nave estiver parada
        if (Date.now() - scoreUpdateTime >= 2000) {
            if (!leftPressed && !rightPressed && !upPressed && !downPressed) {
                score -= penaltyAmount;
            }
            scoreUpdateTime = Date.now(); // Reseta o contador de tempo de atualização do score
        }
    }

    function moveShip() {
        if (leftPressed && ship.x > 0) {
            ship.x -= ship.speed;
        }
        if (rightPressed && ship.x < canvas.width - ship.width) {
            ship.x += ship.speed;
        }
        if (upPressed && ship.y > 0) {
            ship.y -= ship.speed;
        }
        if (downPressed && ship.y < canvas.height - ship.height) {
            ship.y += ship.speed;
        }
    }

    function spawnAsteroid() {
        if (Math.random() < 0.02) {
            var asteroid = {
                x: Math.random() * (canvas.width - 50),
                y: -50,
                width: 50,
                height: 50,
                speed: Math.random() * meteorSpeed + 1 // A velocidade inicial é definida por meteorSpeed
            };
            asteroids.push(asteroid);
        }
    }

    function moveAsteroids() {
        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].y += asteroids[i].speed;
            if (asteroids[i].y > canvas.height) {
                asteroids.splice(i, 1);
                i--;
            }
        }
    }

    function checkCollisions() {
        for (var i = 0; i < asteroids.length; i++) {
            if (ship.x < asteroids[i].x + asteroids[i].width &&
                ship.x + ship.width > asteroids[i].x &&
                ship.y < asteroids[i].y + asteroids[i].height &&
                ship.y + ship.height > asteroids[i].y) {
                gameOver = true;
                break; // Saia do loop quando houver uma colisão
            }
        }
    }

    // Aumenta a velocidade dos meteoros a cada 1000 pontos
    function increaseMeteorSpeed() {
        if (score % 1000 === 0 && score !== 0) { // Verifica se o score é um múltiplo de 1000
            meteorSpeed += 0.5; // Aumenta a velocidade dos meteoros
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);

        for (var i = 0; i < asteroids.length; i++) {
            ctx.drawImage(asteroidImage, asteroids[i].x, asteroids[i].y, asteroids[i].width, asteroids[i].height);
        }

        // Desenha o score durante o jogo
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Pontos: " + score, 10, 30);
    }

    function drawExplosion() {
        ctx.drawImage(explosionImage, ship.x, ship.y, ship.width, ship.height);
    }

    function endGame() {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        // Não desenha o placar de pontos no final do jogo
    }

    function reloadPage() {
        location.reload(); // Recarrega a página
    }
});
