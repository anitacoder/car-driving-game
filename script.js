const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
let player = { speed: 9, x: 0, y: 0 }; // Initialize player with speed and starting position
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false };

startScreen.addEventListener("click", start);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

function moveLine() {
    let lines = document.querySelectorAll(".line");
    lines.forEach(function(item){
        console.log(item.y);
        if(item.y >= 1500) {
            item.y = -1500;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    })
}

function playGame() {
    let car = document.querySelector(".car");
    moveLine();
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
    }
}

function pressOn(e) {
    e.preventDefault();
    keys[e.key] = true;
    console.log("on", e.key);
}

function pressOff(e) {
    e.preventDefault();
    keys[e.key] = false;
    console.log("off", e.key);
}

function start() {
    startScreen.classList.add("hide");
    gameArea.classList.remove("hide");
    player.start = true;
    for(let x = 0; x < 10; x++) {
        let div = document.createElement("div");
        div.classList.add("line");
        div.y = x * 150;
        div.style.top = (x*150) + "px";
        gameArea.appendChild(div);
    }
    
    window.requestAnimationFrame(playGame);

    let car = document.createElement("div");
    car.innerText = "Car";
    car.setAttribute("class", "car");
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;
    for(let x = 0; x < 3; x++) {
        let enemy = document.createElement("div");
        enemy.classList.add("line");
        enemy.y = x * 150;
        enemy.style.top = (x*150) + "px";
        gameArea.appendChild(enemy);
    }
}
