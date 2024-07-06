const score = document.querySelector(".score");
const levelDisplay = document.querySelector(".Level");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const pauseScreen = document.querySelector(".pausedScreen");
const pauseMessage = document.querySelector(".pauseMessage");
const banner = document.querySelector("#banner");
let player = { speed: 10, score: 0, HighScore: 0, level: 1, paused: false, x: 0, y: 0 }; 
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false };
let lastScoreUpdateTime = 0;
const scoreUpdateInterval = 500; // Score update interval in milliseconds

function moveLine() {
    let lines = document.querySelectorAll(".line");
    lines.forEach(function(item) {
        if (item.y >= gameArea.offsetHeight) {
            item.y = -150;
        }
        item.y += player.speed * 0.95;
        item.style.top = item.y + "px";
    });
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

function getValidEnemyPosition(enemies, laneWidth) {
    let overlap = true;
    let newPosition;

    while (overlap) {
        overlap = false;
        let lane = Math.floor(Math.random() * laneCount);
        newPosition = lane * laneWidth + laneWidth / 2 - 30;

        enemies.forEach(function(enemy) {
            let enemyRect = enemy.getBoundingClientRect();
            if (
                (newPosition >= enemyRect.left - laneWidth && newPosition <= enemyRect.right) ||
                (newPosition >= enemyRect.left && newPosition + laneWidth <= enemyRect.right)
            ) {
                overlap = true;
            }
        });
    }
    return newPosition;
}

function getRandomEnemyPosition(existingEnemies) {
    let left;
    let isOverlap;

    do {
        left = Math.floor(Math.random() * (gameArea.offsetWidth - 95));
        isOverlap = Array.from(existingEnemies).some((enemy) => {
            let enemyRect = enemy.getBoundingClientRect();
            return !(left + 95 < enemyRect.left || left > enemyRect.right + 95);
        });
    } while (isOverlap);

    return left;
}

        function moveEnemy(car) {
            let ele = document.querySelectorAll(".enemy");
            ele.forEach(function (item) {
                if (isCollide(car, item)) {
                    console.log("HIT");
                    endGame();
                }
                if (item.y >= 1500) {
                    item.y = -600;
                    item.style.left = Math.floor(Math.random() * 350) + "px";
                    item.style.backgroundColor = randomColor();
                }
                item.y += player.speed;
                item.style.top = item.y + "px";
            })
        }
function updateScore() {
    player.score++;
    score.innerHTML = "Score: " + player.score;
    if (player.level === 1 && player.score >= 50) {
        transitionToLevelTwo();
    }
}

function playGame() {
    let car = document.querySelector(".car");
    moveLine();
    moveEnemy(car);
    let road = gameArea.getBoundingClientRect();

    if (player.start && !player.paused) {
        let carMoved = false;

        if (keys.ArrowUp && player.y > road.top) {
            player.y -= player.speed;
            carMoved = true;
        }
        if (keys.ArrowDown && player.y < road.bottom - 150) {
            player.y += player.speed;
            carMoved = true;
        }
        if (keys.ArrowLeft && player.x > car.offsetWidth / 2) {
            player.x -= player.speed;
            carMoved = true;
        }
        if (keys.ArrowRight && player.x < (road.width - car.offsetWidth / 2)) {
            player.x += player.speed;
            carMoved = true;
        }

        const currentTime = performance.now();
        if (carMoved && currentTime - lastScoreUpdateTime > scoreUpdateInterval) {
            updateScore();
            lastScoreUpdateTime = currentTime;
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
    console.log("on", e.key);
}

function pressOff(e) {
    e.preventDefault();
    keys[e.key] = false;
    console.log("off", e.key);
}

const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');

pauseButton.addEventListener('click', function() {
    if (!player.paused) {
        pauseGame();
    }
});

resumeButton.addEventListener('click', function() {
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
    banner.classList.remove("hide"); // Show the banner
}

function start() {
    banner.classList.add("hide"); 
    startScreen.classList.add("hide");
    score.classList.remove("hide"); 
    gameArea.innerHTML = "";
    player.start = true;
    player.score = 0;
    player.level = 1;
    player.speed = 5; // Reset the speed to initial value
    levelDisplay.innerHTML = "Level: " + player.level; 
    
    for (let x = 0; x < 20; x++) {
        let div = document.createElement("div");
        div.classList.add("line");
        div.y = x * 150;
        div.style.height = "90px";
        div.style.top = (x * 150) + "px";
        gameArea.appendChild(div);
    }

    window.requestAnimationFrame(playGame);

    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    let enemies = [];
    for (let x = 0; x < 10; x++) {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.innerHTML = (x + 1);
        enemy.y = ((x + 1) * 600) * -1;
        enemy.style.top = enemy.y + "px";
        enemy.style.left = getRandomEnemyPosition(enemies) + "px";
        enemy.style.backgroundColor = randomColor();
        gameArea.appendChild(enemy);
        enemies.push(enemy);
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
startGameButton.addEventListener("click", function() {
    console.log("Start button clicked"); 
    banner.classList.add("hide");
    startScreen.classList.add("hide");
    start();
});

document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);


const soundButton = document.getElementById('soundButton');

function playSound() {
    const audio = new Audio('workspace/game-bonus.mp3');
    audio.play()
        .then(() => {
            console.log('Audio played successfully');
        })
        .catch(error => {
            console.error('Error playing audio:', error);
        });
}

soundButton.addEventListener('click', playSound);
