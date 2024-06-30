// script.js

const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
let player = { speed: 5, score: 0 }; // Initialize player with speed and starting position
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false };

// Function to move lines on the game area
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

// Function to check collision between two elements
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

// Function to move enemies on the game area
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
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

// Function to play the game
function playGame() {
    let car = document.querySelector(".car");
    moveLine();
    moveEnemy(car);
    let road = gameArea.getBoundingClientRect();

    if (player.start) {
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
        car.style.left = player.x + 'px';
        car.style.top = player.y + 'px';
        window.requestAnimationFrame(playGame);
        player.score++;
        score.innerHTML = "Score: " + player.score;
    }
}

// Event listener for key press down
function pressOn(e) {
    e.preventDefault();
    keys[e.key] = true;
    console.log("on", e.key);
}

// Event listener for key press up
function pressOff(e) {
    e.preventDefault();
    keys[e.key] = false;
    console.log("off", e.key);
}

// Function to end the game
function endGame() {
    player.start = false;
    score.innerHTML = "Game Over<br> Score was " + player.score;
    startScreen.classList.remove("hide");
}

// Function to start the game
function start() {
    startScreen.classList.add("hide");
    gameArea.innerHTML = "";
    player.start = true;
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

// Function to generate random color
function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + String(hex)).substr(-2);
    }
    return "#" + c() + c() + c();
}

// Event listener for Start Game button
const startGameButton = document.getElementById("startGameButton");
startGameButton.addEventListener("click", start);

// script.js - Add JavaScript for button functionality
const instructionsButton = document.getElementById("instructionsButton");
const instructionsDropdown = document.querySelector(".instructionsDropdown");

instructionsButton.addEventListener("click", function() {
    instructionsDropdown.classList.toggle("active");
});

const cancelInstructionsButton = document.getElementById("cancelInstructions");

cancelInstructionsButton.addEventListener("click", function() {
    instructionsDropdown.classList.remove("active");
});
