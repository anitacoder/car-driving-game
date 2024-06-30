const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const banner = document.querySelector(".Banner");
const pausedScreen  = document.querySelector(".pausedScreen");
const resumeScreen  = document.querySelector(".resumeScreen");
let player = { speed: 5, score: 0 }; 
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false };

function moveLine() {
    let lines = document.querySelectorAll(".line");
    lines.forEach(function(item){
        if(item.y >= gameArea.offsetHeight) {
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
    enemies.forEach(function(item){
        if(isCollide(car, item)) {
            console.log('HIT');
            endGame();
        }
        if(item.y >= 1500) {
            item.y = -600;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
            item.style.backgroundColor = randomColor(); // Randomize enemy color on reset
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

let lastScoreUpdateTime = 0;
const scoreUpdateInterval = 750;

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

        if(currentTime - lastScoreUpdateTime >= scoreUpdateInterval) {
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
    if (e.key === " ") { //Handles space bar press
        player.paused = !player.paused;
        if (player.paused) {
            pauseGame();
        } else {
            resumeGame();
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
    pausedScreen.classList.remove("hide");
    console.log("Game Paused");
}

function resumeGame() {
    player.paused = false;
    pausedScreen.classList.add("hide");
    console.log("Resume Game");
    window.requestAnimationFrame(playGame);

}

function endGame() {
    player.start = false;
    score.innerHTML = "Game Over<br> Score was " + player.score;
    startScreen.classList.remove("hide");
    banner.classList.remove("hide");
    pausedScreen.classList.add("hide");
}

function start() {
    startScreen.classList.add("hide");
    banner.classList.add("hide");
    gameArea.innerHTML = "";
    player.start = true;
    player.paused = false;
    player.score = 0;
    for(let x = 0; x < 10; x++) {
        let div = document.createElement("div");
        div.classList.add("line");
        div.y = x * 150;
        div.style.top = (x*150) + "px";
        gameArea.appendChild(div);
    }
    
    window.requestAnimationFrame(playGame);

    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;
    for(let x = 0; x < 3; x++) {
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
    startScreen.classList.add("hide");
    banner.classList.add("hide");
    start();
});

const instructionsButton = document.getElementById("instructionsButton");
const instructionsDropdown = document.querySelector(".instructionsDropdown");

instructionsButton.addEventListener("click", function() {
    instructionsDropdown.classList.toggle("active");
});

const cancelInstructionsButton = document.getElementById("cancelInstructions");

cancelInstructionsButton.addEventListener("click", function() {
    instructionsDropdown.classList.remove("active");
});

document.addEventListener("keydown", pressOn); // Listen for key press
document.addEventListener("keyup", pressOff); // Listen for key release
