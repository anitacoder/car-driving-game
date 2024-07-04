const score = document.querySelector(".score");
const levelDisplay = document.querySelector(".Level");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const pauseScreen = document.querySelector(".pausedScreen");
const pauseMessage = document.querySelector(".pauseMessage");
const banner = document.querySelector("#banner");
let player = { speed: 5, score: 0, HighScore: 0,level: 1, paused: false, x: 0, y: 0}; 
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false };

const linePositions = [
    gameArea.offsetWidth * 0.15,
    gameArea.offsetWidth * 0.35,
    gameArea.offsetWidth * 0.55,
    gameArea.offsetWidth * 0.75,
    gameArea.offsetWidth * 0.95
];

function MoveLines() {
    let Line = document.querySelectorAll(".line3");
    Line.forEach(function(item) {
        if (item.y >= gameArea.offsetHeight) {
            item.y = -150;
        }
        item.y += player.speed;
        item.style.top = Math.floor(item.y) + "px"; 
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


function getValidEnemyPosition(enemies, linePositions, enemyWidth, line3Rect) {
    let overlap = true;
    let newPosition;

    while (overlap) {
        overlap = false;
        newPosition = linePositions[Math.floor(Math.random() * linePositions.length)];
        
        // Ensure the new position is not on the line
        if (newPosition === line3Rect.left) {
            overlap = false;
            continue;
        }

        enemies.forEach(function(enemy) {
            let enemyRect = enemy.getBoundingClientRect();
            if (
                (newPosition >= enemyRect.left - enemyWidth && newPosition <= enemyRect.right) ||
                (newPosition >= enemyRect.left && newPosition + enemyWidth <= enemyRect.right)
            ) {
                overlap = true;
            }
        });
    }
    return newPosition;
}


function moveEnemy(car) {
    let enemies = document.querySelectorAll(".enemy");
    let lines = document.querySelectorAll(".line3");
    let enemyWidth = 60;

    enemies.forEach(function(item) {
        if (isCollide(car, item)) {
            console.log("HIT");
            endGame();
        }
        if (item.y >= 1500) {
            let newPosition = getValidEnemyPosition(enemies, linePositions, enemyWidth, lines);
            item.y = -600;
            item.style.left = newPosition + "px";
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
    MoveLines();
    moveEnemy(car);
    let road = gameArea.getBoundingClientRect();
    let line3 = document.querySelector(".line3");
    let line3Rect = line3.getBoundingClientRect();

    if (player.start && !player.paused) {
        if (keys.ArrowUp && player.y > road.top) {
            player.y -= player.speed;
            updateScore();
        }
        if (keys.ArrowDown && player.y < road.bottom - 150) {
            player.y += player.speed;
            updateScore();
        }
        if (keys.ArrowLeft && player.x > car.offsetWidth / 2) {
            player.x -= player.speed;
            updateScore();
        }
        if (keys.ArrowRight && player.x < (road.width - car.offsetWidth / 2)) {
            if (player.x + car.offsetWidth / 2 < line3Rect.left || player.x - car.offsetWidth / 2 > line3Rect.right) {
                player.x += player.speed;
                updateScore();
            }
        }

        car.style.left = player.x + 'px';
        car.style.top = player.y + 'px';
        window.requestAnimationFrame(playGame);
    }
}

     function updateScore() {
        let currentTime = Date.now();
        if (currentTime - lastScoreUpdateTime >= scoreUpdateInterval) {
            player.score++;
            score.innerHTML = "Score: " + player.score;
            lastScoreUpdateTime = currentTime;
        }
    
        if (player.level === 1 && player.score >= 50) {
            transitionToLevelTwo();
        } else if (player.level === 2 && player.score >= 100) {
            transitionToLevelThree();
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
    banner.classList.remove("hide"); // Hide the banner
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
   
    for (let x = 0; x < 10; x++) {
        let dives = document.createElement("div");
        dives.classList.add("line3");
        dives.y = x * 150;
        dives.style.left = (gameArea.offsetWidth * 0.75) + "px";
        dives.style.height = "80px"; 
        dives.style.top = (x * 150) + "px";
        gameArea.appendChild(dives);
    }

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
        enemy.style.left = getValidEnemyPosition([], linePositions, 90, document.querySelectorAll(".line3")) + "px";
        let color = randomColor();
        enemy.style.backgroundColor = color;
        enemy.style.filter = `brightness(0) saturate(100%) invert(27%) sepia(77%) saturate(7484%) hue-rotate(349deg) brightness(99%) contrast(101%) drop-shadow(0 0 10px ${color})`;  // Apply the color filter effect
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
startGameButton.addEventListener("click", function() {
    console.log("Start button clicked"); 
    banner.classList.add("hide");
    startScreen.classList.add("hide");
    start();
});

document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);
