const score = document.querySelector(".score");
const levelDisplay = document.querySelector(".Level");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const pauseScreen = document.querySelector(".pausedScreen");
const pauseMessage = document.querySelector(".pauseMessage");
const banner = document.querySelector("#banner");
const startSound = document.getElementById('startSound');
const backgroundMusic = document.getElementById('backgroundMusic'); 
const gameMusic = document.getElementById('gameMusic');

let player = { speed: 10, score: 0, HighScore: 0, level: 1, paused: false, x: 0, y: 0, autoMoveSpeed: 0.2}; 
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false };
let lastScoreUpdateTime = 0;
const scoreUpdateInterval = 820; 


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

function getValidEnemyPosition(enemies, laneWidth) {
    let overlap = true;
    let newPosition;

    while (overlap) {
        overlap = false;
        let lane = Math.floor(Math.random() * laneCount);
        newPosition = lane * laneWidth + laneWidth / 2 - 20;

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
    const laneWidth = gameArea.offsetWidth / 3;
    const minMargin = 40; 
    let left;
    let isOverlap;

    do {
        const lane = Math.floor(Math.random() * 3);
        left = lane * laneWidth + laneWidth / 20 + minMargin;
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
        if (item.y >= gameArea.offsetHeight) {
            item.y = -600;
            item.style.left = getRandomEnemyPosition(ele) + "px";
            item.style.backgroundColor = randomColor();
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function updateScore() {
    player.score++;
    score.innerHTML = "Score: " + player.score;
    if (player.score % 30 === 0) { 
        player.level++;
        levelDisplay.innerHTML = "Level: " + player.level;
        player.speed += 2; 
        showLevelPopup(player.level);
    }
}

function playGame() {
    let car = document.querySelector(".car");
    moveLine();
    moveEnemy(car);
    let road = gameArea.getBoundingClientRect();
    const laneWidth = gameArea.offsetWidth / 3; 
    const carMargin = laneWidth / 6;
    const minMargin = 20; 

    if (player.start && !player.paused) {
        player.y -= player.autoMoveSpeed;

        let carMoved = false;
        if (keys.ArrowUp && player.y > road.top) {
            player.y -= player.speed;
            carMoved = true;
        }
        if (keys.ArrowDown && player.y < road.bottom - 150) {
            player.y += player.speed;
            carMoved = true;
        }
        if (keys.ArrowLeft && player.x > minMargin) {
            player.x -= player.speed;
            carMoved = true;
        }
        if (keys.ArrowRight && player.x < (road.width - car.offsetWidth)) {
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

function showLevelPopup(level) {
    const levelPopup = document.getElementById('levelPopup');
    const levelNumber = document.getElementById('levelNumber');

    levelNumber.textContent = level;
    levelPopup.classList.add('show');
    levelPopup.classList.remove('hide');

    setTimeout(() => {
        levelPopup.classList.remove('show');
    }, 1000); 

    levelPopup.addEventListener('transitionend', () => {
        if (!levelPopup.classList.contains('show')) {
            levelPopup.classList.add('hide');
        }
    }, { once: true });
}

function transitionToLevelTwo() {
    player.level = 2;
    levelDisplay.innerHTML = "Level: " + player.level;
    showLevelPopup(player.level);
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
    score.innerHTML = "Score: " + player.score;
    score.classList.add("hide");
    if (player.score > player.HighScore) {
        player.HighScore = player.score;
    }
    const gameOverMessage = document.getElementById("gameOverMessage");
    gameOverMessage.innerHTML = `Game Over<br> Score: ${player.score} <br>High Score : ${player.HighScore}`;
    banner.classList.remove("hide"); 

       backgroundMusic.pause();
       backgroundMusic.currentTime = 0; 
       gameMusic.pause();
       gameMusic.currentTime = 0; 
   }

function start() {
    banner.classList.add("hide"); 
    startScreen.classList.add("hide");
    score.classList.remove("hide"); 
    gameArea.innerHTML = "";
    player.start = true;
    player.score = 0;
    score.innerHTML = "Score: " + player.score; 
    player.level = 1;
    player.speed = 5; 
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

    player.x = car.offsetLeft + gameArea.offsetWidth / 6;
    player.y = car.offsetTop;

    let enemies = [];
    let enemyPositions = [];

    let numEnemies = 5 


    for (let x = 0; x < numEnemies; x++) {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");

        let positionY;
        let overlap;
        do {
            overlap = false;
            positionY = ((x + 1) * 600) * -1;
            for (let pos of enemyPositions) {
                if (Math.abs(pos - positionY) < 300) { 
                    overlap = true;
                    positionY -= 300; 
                    break;
                }
            }
        } while (overlap);

        enemy.y = positionY;
        enemy.style.top = enemy.y + "px";
        enemy.style.left = getRandomEnemyPosition(enemies) + "px";
        enemy.style.backgroundColor = randomColor();
        gameArea.appendChild(enemy);
        enemies.push(enemy);
        enemyPositions.push(enemy.y);
    }

    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    const soundIcon = document.getElementById('soundIcon');
    
    backgroundMusic.play()
        .then(() => {
            console.log('Audio played successfully');
            updateSoundIcon(true);
        })
        .catch(error => {
            console.error('Error playing audio:', error);
            updateSoundIcon(false);
        });

    backgroundMusic.addEventListener('play', function() {
        updateSoundIcon(true);
    });

    backgroundMusic.addEventListener('pause', function() {
        updateSoundIcon(false);
    });

    backgroundMusic.addEventListener('ended', function() {
        updateSoundIcon(false);
    });

    function updateSoundIcon(isPlaying) {
        if (isPlaying) {
            soundIcon.classList.remove('fa-volume-mute');
            soundIcon.classList.add('fa-volume-up');
        } else {
            soundIcon.classList.remove('fa-volume-up');
            soundIcon.classList.add('fa-volume-mute');
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

document.addEventListener('DOMContentLoaded', () => {
    // Start background music on load
    backgroundMusic.volume = 0.5;
    backgroundMusic.play().catch(error => {
        console.error('Error playing background music:', error);
    });

    const startGameButton = document.getElementById("startGameButton");
    startGameButton.addEventListener("click", function() {
        // Play start sound
        startSound.play().then(() => {
            // After 2 seconds, start the game music
            setTimeout(() => {
                backgroundMusic.pause();
                gameMusic.currentTime = 0;
                gameMusic.play().catch(error => {
                    console.error('Error playing game music:', error);
                });
                start();
            }, 2000);
        }).catch(error => {
            console.error('Error playing start sound:', error);
        });

        // Hide start screen and banner immediately
        startScreen.classList.add("hide");
        banner.classList.add("hide");
    });
});


document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

document.getElementById("startGameButton").addEventListener('click', function() {
    start();
    document.getElementById("startSound").play();
})

document.addEventListener('DOMContentLoaded', function() {
    const soundButton = document.getElementById('soundButton');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const soundIcon = document.getElementById('soundIcon');

    backgroundMusic.volume = 1.0;

    soundButton.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play()
                .then(() => {
                    console.log('Audio played successfully');
                    updateSoundIcon(true);
                })
                .catch(error => {
                    console.error('Error playing audio:', error);
                });
        } else {
            backgroundMusic.pause();
            updateSoundIcon(false);
        }
    });
});
