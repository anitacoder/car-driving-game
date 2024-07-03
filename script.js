const score = document.querySelector(".score");
const levelDisplay = document.querySelector(".Level");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const pauseScreen = document.querySelector(".pausedScreen");
const pauseMessage = document.querySelector(".pauseMessage");
const banner = document.querySelector("#banner");
let player = { speed: 5, score: 0, HighScore: 0,level: 1, paused: false }; 
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false };

const linePositions = [
    gameArea.offsetWidth * 0.15,
    gameArea.offsetWidth * 0.35,
    gameArea.offsetWidth * 0.55,
    gameArea.offsetWidth * 0.15,
    gameArea.offsetWidth * 0.95
];

function moveLine() {
    let lines = document.querySelectorAll(".line");
    lines.forEach(function(item) {
        if (item.y >= gameArea.offsetHeight) {
            item.y = -150;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function moveline() {
    let line = document.querySelectorAll(".line2");
    line.forEach(function(item) {
        if (item.y >= gameArea.offsetHeight) {
            item.y = -150;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function MoveLines() {
    let Line = document.querySelectorAll(".line3");
    Line.forEach(function(item) {
        if (item.y >= gameArea.offsetHeight) {
            item.y = -150;
        }
        item.y += player.speed;
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

function moveEnemy(car) {
    let enemies = document.querySelectorAll(".enemy");
    let line3 = document.querySelector(".line3");
    let line3Rect = line3.getBoundingClientRect();
    let line3Width = 10;

    enemies.forEach(function(item, index) {
        if (isCollide(car, item)) {
            console.log("HIT");
            endGame();
        }
        if (item.y >= 1500) {
            let newPosition = linePositions[Math.floor(Math.random() * linePositions.length)];
            let enemyWidth = 60;
            let overlap = true;

            while (overlap) {
                overlap = false;
                newPosition = linePositions[Math.floor(Math.random() * linePositions.length)];
                enemies.forEach(function(enemy, idx) {
                    if (index !== idx) {
                        let enemyRect = enemy.getBoundingClientRect();
                        if (
                            (newPosition >= enemyRect.left - enemyWidth && newPosition <= enemyRect.right) ||
                            (newPosition >= enemyRect.left - enemyWidth && newPosition <= enemyRect.right) ||
                            (newPosition >= enemyRect.left && newPosition + enemyWidth <= enemyRect.right)
                        ) {
                            overlap = true;
                        }
                    }
                }); 
                if (
                    (newPosition <= line3Rect.left - enemyWidth && newPosition <= line3Rect.right + line3Width) ||
                    (newPosition + enemyWidth <= line3Rect.left - enemyWidth && newPosition + enemyWidth <= line3Rect.right + line3Width)
                ) {
                    overlap = false;
                }
            }

            item.y = -650;
            item.style.left = newPosition + "px";
            item.style.backgroundColor = randomColor();
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}


let lastScoreUpdateTime = 0;
const scoreUpdateInterval = 500;

function playGame() {
    let currentTime = Date.now();
    let car = document.querySelector(".car");
    moveLine();
    moveline();
    MoveLines();
    moveEnemy(car);
    let road = gameArea.getBoundingClientRect();
    let line3 = document.querySelector(".line3").getBoundingClientRect();

    if (player.start && !player.paused) {
        if (keys.ArrowUp && player.y > road.top) {
            player.y -= player.speed;
        }
        if (keys.ArrowDown && player.y < road.bottom - 150) {
            player.y += player.speed;
        }
        if (keys.ArrowLeft && player.x > car.offsetWidth / 2) {
            player.x -= player.speed;
        }
        if (keys.ArrowRight && player.x < (road.width - car.offsetWidth / 2)) {
            if (player.x + car.offsetWidth / 2 < line3.left || player.x - car.offsetWidth / 2 > line3.right) {
                player.x += player.speed;
            }       
     }

        if (currentTime - lastScoreUpdateTime >= scoreUpdateInterval) {
            player.score++;
            score.innerHTML = "Score: " + player.score;
            lastScoreUpdateTime = currentTime;
        }
        if(player.level === 1 && player.score >= 50){
            transitionToLevelTwo();
        }
        if(player.level === 2 && player.score >= 100){
            transitionToLevelThree();
        }
        window.requestAnimationFrame(playGame);
        car.style.left = player.x + 'px';
        car.style.top = player.y + 'px';
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
        let div = document.createElement("div");
        div.classList.add("line");
        div.y = x * 150;
        div.style.left = (gameArea.offsetWidth * 0.25) + "px";
        div.style.height = "80px";
        div.style.top = (x * 150) + "px";
        gameArea.appendChild(div);
    }

    for(let x = 0; x < 10; x++) {
        let divs = document.createElement("div");
        divs.classList.add("line2");
        divs.y = x * 150;
        divs.style.left = (gameArea.offsetWidth * 0.50) + "px";
        divs.style.height = "80px"
        divs.style.top = (x * 150) + "px";
        gameArea.appendChild(divs);
    }


    for(let x = 0; x < 10; x++) {
        let dives = document.createElement("div");
        dives.classList.add("line3");
        dives.y = x * 150;
        dives.style.left = (gameArea.offsetWidth * 0.75)+"px";
        dives.style.height = "80px"
        dives.style.top = (x * 150) + "px";
        gameArea.appendChild(dives);
    }

    window.requestAnimationFrame(playGame);

    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    GenerateEnemies();

    function GenerateEnemies() {
        const positions = [...linePositions];
        for (let x = 0; x < 30; x++) {
            let enemy = document.createElement("div");
            enemy.classList.add("enemy");
            enemy.innerHTML = (x + 1);
            enemy.y = ((x + 1) * 600) * -1;
            enemy.style.top = enemy.y + "px";
            let newPositionIndex = Math.floor(Math.random() * positions.length);
            let newPosition = positions.splice(newPositionIndex, 9)[0];
            enemy.style.left = linePositions[Math.floor(Math.random() * linePositions.length)] + "px";
            enemy.style.backgroundColor = randomColor();
            gameArea.appendChild(enemy);
        }    
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
