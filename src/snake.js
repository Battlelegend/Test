const gameState = {
    width: 8,
    height: 8,
    head: {
        x: 1,
        y: 0
    },
    snakeSegments:[{
      x: 0,
      y: 0
    }],
    direction: 'east',
    apple: {
        x: 4,
        y: 4
    },
    addable: {
        x: 0,
        y: 0
    },
    newPart: false
};

document.addEventListener('keyup', arrowPressed);

function arrowPressed(event) {
    if (event.key ==="ArrowLeft"){
        gameState.direction = 'west';
    }
    if (event.key === "ArrowRight") {
        gameState.direction = 'east';
    }
    if (event.key === "ArrowDown") {
        gameState.direction = 'south';
    }
    if (event.key === "ArrowUp") {
        gameState.direction = 'north';
    }
}

function update() {
    // Your code here
    if (gameState.newPart) {
        gameState.snakeSegments.push(gameState.addable);
        gameState.newPart = false;
    }
    let head = {
            x: gameState.head.x,
            y: gameState.head.y
        };
    let snakeSegments = gameState.snakeSegments;

    if (gameState.direction === 'east') {
        if (gameState.head.x !== 7 || selfCrash({x:gameState.head.x + 1, y:gameState.head.y}) ) {
            gameState.head.x++;
        } else {
            //finish eventListener
            document.removeEventListener('keyup', arrowPressed);
            clearInterval(ongoing);
            alert("GAME OVER!");
            return;
        }
    }
    if (gameState.direction === 'west') {
        if (gameState.head.x !== 0 || selfCrash({x:gameState.head.x - 1, y:gameState.head.y})) {
            gameState.head.x--;
        } else {
            //finish eventListener
            document.removeEventListener('keyup', arrowPressed);
            clearInterval(ongoing);
            alert("GAME OVER!");
            return;
        }
    }
    if (gameState.direction === 'south') {
        if (gameState.head.y !== 7 || selfCrash({x:gameState.head.x, y:gameState.head.y + 1})) {
            gameState.head.y++;
        } else {
            //finish eventListener
            document.removeEventListener('keyup', arrowPressed);
            clearInterval(ongoing);
            alert("GAME OVER!");
            return;
        }
    }
    if (gameState.direction === 'north') {
        if (gameState.head.y !== 0 || selfCrash({x:gameState.head.x, y:gameState.head.y - 1})) {
            gameState.head.y--;
        } else {
            //finish eventListener
            document.removeEventListener('keyup', arrowPressed);
            clearInterval(ongoing);
            alert("GAME OVER!");
            return;
        }
    }

    if (gameState.snakeSegments !== []) {
        gameState.safedField = gameState.snakeSegments[gameState.snakeSegments.length - 1];
        gameState.snakeSegments[0].x = head.x;
        gameState.snakeSegments[0].y = head.y;
        for (let i = 1; i < gameState.snakeSegments.length; i++) {
            gameState.snakeSegments[i].x = snakeSegments[i-1].x;
            gameState.snakeSegments[i].y = snakeSegments[i-1].y;
        }
    }

    console.log("head:", gameState.head, "apple:", gameState.apple, "segments:", gameState.snakeSegments);
    if (gameState.head.x === gameState.apple.x && gameState.head.y === gameState.apple.y) {
       gameState.newPart = true;

        console.log("ATE APPLE!!!");
        newApple();
    }

    console.log(gameState);
    render(gameState, 'myCanvas');
}

function selfCrash(goingTo) {

    for (let i = 0; i < gameState.snakeSegments; i++){
        if (goingTo.x === gameState.snakeSegments[i].x && goingTo.y === gameState.snakeSegments[i].y) {
            return true
        }
    }
    return false
}

function newApple() {
    let x = Math.round((Math.random()*7.49));
    let y = Math.round((Math.random()*7.49));
    let doubled = false;
    if ( {x:x, y:y} === gameState.head ) {
        doubled = true;
    }
    for (let i = 0; i < gameState.snakeSegments; i++) {
        if ({x: x, y: y} === gameState.snakeSegments[i]) {
            doubled = true;
        }
    }
    if (doubled) {
        newApple();
    } else {
        gameState.apple = {
            x: x,
            y: y
        };
    }
}

function drawLine(x1, y1, x2, y2, context) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

function render(canvasId) {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    for(let i=0; i<=gameState.height; i++) {
        drawLine(0, i*canvas.height/gameState.height, canvas.width, i*canvas.height/gameState.height, context);
    }
    for(let i=0; i<=gameState.width; i++) {
        drawLine(i*canvas.width/gameState.width, 0, i*canvas.width/gameState.width, canvas.height, context);
    }

    context.fillStyle = 'red';
    context.fillRect(gameState.apple.x*60,gameState.apple.y*60, 60, 60);
    // Your code here
    context.fillStyle = 'yellow';
    context.fillRect(gameState.head.x*60,gameState.head.y*60, 60, 60);

    for(let i = 0; i < gameState.snakeSegments.length; i++) {
        context.fillStyle = 'black';
        context.fillRect(gameState.snakeSegments[i].x*60,gameState.snakeSegments[i].y*60, 60, 60);
    }
}

render(gameState, 'myCanvas');
let ongoing = setInterval(update,1000);