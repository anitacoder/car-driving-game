const score = document.querySelector(".score");
const levelDisplay = document.querySelector(".Level");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const pauseScreen = document.querySelector(".pausedScreen");
const pauseMessage = document.querySelector(".pauseMessage");
const banner = document.querySelector("#banner");
let player = { speed: 5, score: 0, HighScore: 0, level: 1, paused: false, x: 0, y: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false };

const linePosition = gameArea.offsetWidth / 2;

function moveLine() {
    let line = document.querySelector(".line");
    if (line.y >= gameArea.offsetHeight) {
        line.y = -150;
    }
    line.y += player.speed;
    line.style.top = line.y + "px";
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right)
    );
}

function moveEnemy(car) {
    let enemies = document.querySelectorAll(".enemy");
    let lineRect = document.querySelector(".line").getBoundingClientRect();
    let lineWidth = 10;

    enemies.forEach(function (item, index) {
        if (isCollide(car, item)) {
            console.log("HIT");
            endGame();
        }
        if (item.y >= gameArea.offsetHeight) {
            item.y = -600;
            item.style.left = Math.random() < 0.5 ? linePosition - 100 + "px" : linePosition + 100 + "px";
            item.style.backgroundColor = randomColor();
        }
        item.y += player.speed;
        item.style.top = Math.floor(item.y) + "px";
    });
}

let lastScoreUpdateTime = 0;
const scoreUpdateInterval = 290;

function playGame() {
    let car = document.querySelector(".car");
    moveLine();
    moveEnemy(car);
    let road = gameArea.getBoundingClientRect();
    let line = document.querySelector(".line").getBoundingClientRect();

    if (player.start && !player.paused) {
        if (keys.ArrowUp && player.y > road.top) {
            player.y -= player.speed;
            UpdateScores();
        }
        if (keys.ArrowDown && player.y < road.bottom - 150) {
            player.y += player.speed;
            UpdateScores();
        }
        if (keys.ArrowLeft && player.x > car.offsetWidth / 2) {
            player.x -= player.speed;
            UpdateScores();
        }
        if (keys.ArrowRight && player.x < road.width - car.offsetWidth / 2) {
            if (player.x + car.offsetWidth / 2 < line.left || player.x - car.offsetWidth / 2 > line.right) {
                player.x += player.speed;
                UpdateScores();
            }
        }

        function UpdateScores() {
            let currentTime = Date.now();
            if (currentTime - lastScoreUpdateTime >= scoreUpdateInterval) {
                player.score++;
                score.innerHTML = "Score: " + player.score;
                lastScoreUpdateTime = currentTime;
            }
        }
        if (player.level === 1 && player.score >= 50) {
            transitionToLevelTwo();
        }
        if (player.level === 2 && player.score >= 100) {
            transitionToLevelThree();
        }
        car.style.left = player.x + 'px';
        car.style.top = player.y + 'px';
        window.requestAnimationFrame(playGame);
    }
}

function transitionToLevelTwo() {
    player.level = 2;
    levelDisplay.innerHTML = "Level: " + player.level;
}

function transitionToLevelThree() {
    player.level = 3;
    levelDisplay.innerHTML = "Level: " + player.level;
}

function pressOn(e) {
    e.preventDefault();
    keys[e.key] = true;

    if (player.start && e.key === " ") {
        if (player.paused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
}

function pressOff(e) {
    e.preventDefault();
    keys[e.key] = false;
}

const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');

pauseButton.addEventListener('click', function () {
    if (!player.paused) {
        pauseGame();
    }
});

resumeButton.addEventListener('click', function () {
    if (player.paused) {
        resumeGame();
    }
});

function pauseGame() {
    player.paused = true;
    pauseScreen.classList.remove("hide");
    pauseButton.classList.add("hide");
    resumeButton.classList.remove("hide");
    const pauseMessage = document.querySelector(".pauseMessage");
    if (pauseMessage) {
        pauseMessage.textContent = "Paused";
    }
    console.log("Game Paused");
}

function resumeGame() {
    player.paused = false;
    pauseScreen.classList.add("hide");
    resumeButton.classList.add("hide");
    pauseButton.classList.remove("hide");
    console.log("Resume Game");
    window.requestAnimationFrame(playGame);
}

function endGame() {
    player.start = false;
    score.classList.add("hide");
    if (player.score > player.HighScore) {
        player.HighScore = player.score;
    }
    const gameOverMessage = document.getElementById("gameOverMessage");
    gameOverMessage.innerHTML = `Game Over<br> Score: ${player.score} <br>High Score : ${player.HighScore}`;
    banner.classList.remove("hide");
}

function start() {
    banner.classList.add("hide");
    startScreen.classList.add("hide");
    score.classList.remove("hide");
    gameArea.innerHTML = "";
    player.start = true;
    player.score = 0;
    player.level = 1;
    player.speed += 1;
    levelDisplay.innerHTML = "Level: " + player.level;

    let line = document.createElement("div");
    line.classList.add("line");
    line.y = 0;
    line.style.left = linePosition + "px";
    line.style.height = "80px";
    line.style.top = "0px";
    gameArea.appendChild(line);

    window.requestAnimationFrame(playGame);

    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    for (let x = 0; x < 3; x++) {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.innerHTML = (x + 1);
        enemy.y = ((x + 1) * 600) * -1;
        enemy.style.top = enemy.y + "px";
        enemy.style.left = Math.random() < 0.5 ? linePosition - 100 + "px" : linePosition + 100 + "px";
        enemy.style.backgroundColor = randomColor();
        gameArea.appendChild(enemy);
    }
}

function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + hex).slice(-2);
    }
    return "#" + c() + c() + c();
}

const startGameButton = document.getElementById("startGameButton");
startGameButton.addEventListener("click", function () {
    console.log("Start button clicked");
    banner.classList.add("hide");
    startScreen.classList.add("hide");
    start();
});

document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);
