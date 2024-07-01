const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const pauseScreen = document.querySelector(".pausedScreen");
const pauseMessage = pauseScreen.querySelector(".pauseMessage");
const banner = document.querySelector("#banner");
let player = { speed: 5, score: 0, HighScore: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false };


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
    enemies.forEach(function(item) {
        if (isCollide(car, item)) {
            console.log('HIT');
            endGame();
        }
        if (item.y >= 1500) {
            item.y = -600;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
            item.style.backgroundColor = randomColor();
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

let lastScoreUpdateTime = 0;
const scoreUpdateInterval = 820;

function playGame() {
    let currentTime = Date.now();
    let car = document.querySelector(".car");
    moveLine();
    moveEnemy(car);
    let road = gameArea.getBoundingClientRect();

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
            player.x += player.speed;
        }

        if (currentTime - lastScoreUpdateTime >= scoreUpdateInterval) {
            player.score++;
            score.innerHTML = "Score: " + player.score;
            lastScoreUpdateTime = currentTime;
        }
        window.requestAnimationFrame(playGame);
        car.style.left = player.x + 'px';
        car.style.top = player.y + 'px';
    }
}

function pressOn(e) {
    e.preventDefault();
    keys[e.key] = true;

    // Toggle pause on space bar press
    if (e.key === " ") {
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

function pauseGame() {
    player.paused = true;
    pauseScreen.classList.remove("hide"); // Show the pause screen
    const pauseMessage = document.querySelector(".pauseMessage");
    if (pauseMessage) {
        pauseMessage.textContent = "Game Paused"; // Ensure text content is set correctly
    }
    console.log("Game Paused");
}

function resumeGame() {
    player.paused = false;
    pauseScreen.classList.add("hide"); // Hide the pause screen
    const pauseMessage = document.querySelector(".pauseMessage");
    if (pauseMessage) {
        pauseMessage.textContent = "Game Paused"; // Ensure text content is set correctly
    }
    console.log("Game Paused");
    window.requestAnimationFrame(playGame); // Resume game animation loop
}


function endGame() {
    player.start = false;
    score.classList.add("hide");
    if(player.score > player.HighScore) {
        player.HighScore = player.score;
    }
    const gameOverMessage = document.getElementById("gameOverMessage");
    gameOverMessage.innerHTML = `Game Over<br> Score: ${player.score} <br>High Score : ${player.HighScore}`;
    banner.classList.remove("hide"); // Hide the banner

}

function start() {
    banner.classList.add("hide"); // Hide the banner
    startScreen.classList.add("hide");
    score.classList.remove("hide"); // Show the score
    gameArea.innerHTML = "";
    player.start = true;
    player.score = 0;
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
    for (let x = 0; x < 3; x++) {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.innerHTML = (x + 1);
        enemy.y = ((x + 1) * 600) * -1;
        enemy.style.top = enemy.y + "px";
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
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
startGameButton.addEventListener("click", function() {
    console.log("Start button clicked"); 
    banner.classList.add("hide");
    startScreen.classList.add("hide");
    start();
});


document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

