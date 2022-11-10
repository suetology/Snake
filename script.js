class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Apple {
    constructor(pos, placed) {
        this.pos = pos;
        this.placed = placed;
    }
}

const canvas = document.getElementById("canvas");
canvas.setAttribute("width", 540);
canvas.setAttribute("height", 540);

const ctx = canvas.getContext("2d");

const CELL_SIZE = 20;
const WINDOW_SIZE = 500;

let gridSize = WINDOW_SIZE / CELL_SIZE;
let snake = [ new Vec2(3, 1), new Vec2(2, 1), new Vec2(1, 1) ];
let curDir = "right";
let apple = new Apple(undefined, false);

ctx.fillRect(0, 0, WINDOW_SIZE + CELL_SIZE * 2, CELL_SIZE);
ctx.fillRect(WINDOW_SIZE + CELL_SIZE, 0, CELL_SIZE, WINDOW_SIZE + CELL_SIZE * 2);
ctx.fillRect(0, WINDOW_SIZE + CELL_SIZE, WINDOW_SIZE + CELL_SIZE * 2, CELL_SIZE);
ctx.fillRect(0, 0, CELL_SIZE, WINDOW_SIZE + CELL_SIZE * 2);

const clearWindow = () => {

    ctx.clearRect(CELL_SIZE, CELL_SIZE, WINDOW_SIZE, WINDOW_SIZE);
}

const drawSnake = () => {

    
    ctx.fillStyle = "green";

    for(let i = 0; i < snake.length; i++) {

        ctx.fillRect(snake[i].x * CELL_SIZE + CELL_SIZE, snake[i].y * CELL_SIZE + CELL_SIZE, CELL_SIZE, CELL_SIZE); 
    }
}

const moveSnake = (dir) => {

    let temp = snake[snake.length - 1];
    for(let i = snake.length - 1; i >= 1; i--) {

        snake[i] = new Vec2(snake[i - 1].x, snake[i - 1].y);
    }

    switch(dir) {
        case "left":
            snake[0].x--;
            break;
        case "right":
            snake[0].x++;
            break;
        case "up":
            snake[0].y--;
            break;
        case "down":
            snake[0].y++;
            break;
    }
    if(outOfMap(snake[0]) || hit(snake[0])) {

        clearInterval(id);
        return;
    }

    if(snake[0].x == apple.pos.x && snake[0].y == apple.pos.y) {

        placeApple();
        snake.push(temp);
    }

    drawSnake();
}

const outOfMap = (pos) => pos.x >= gridSize || pos.y >= gridSize ||
                          pos.y < 0 || pos.x < 0;

const hit = (pos) => {
    for(let i = 1; i < snake.length; i++) {
        if(pos.x == snake[i].x && pos.y == snake[i].y) {
            return true;
        }
    }
    return false;
}

const checkApple = (pos) => {
    for(let i = 0; i < snake.length; i++) {
        if(pos.x == snake[i].x && pos.y == snake[i].y) {
            return true;
        }
    }
    return false;
}

const placeApple = () => {

    let x = Math.floor(Math.random() * 25);
    let y = Math.floor(Math.random() * 25);

    while(checkApple(new Vec2(x, y))) {
        x = Math.floor(Math.random() * 25);
        y = Math.floor(Math.random() * 25);    
    }

    apple.placed = true;
    apple.pos = new Vec2(x, y);
}

const drawApple = () => {

    if(apple.placed) {

        ctx.fillStyle = "red";
        ctx.fillRect((apple.pos.x + 1) * CELL_SIZE, (apple.pos.y + 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}

const gameLoop = () => {
    clearWindow();
    moveSnake(curDir);
    drawApple();
}

//createGrid();
placeApple();

var id = setInterval(gameLoop, 100);

document.addEventListener("keydown", (e) => {
    switch(e.key) {
        case "ArrowDown": 
            if(curDir == "left" || curDir == "right") {
                curDir = "down";
            }
            break;
        case "ArrowUp":
            if(curDir == "left" || curDir == "right") {
                curDir = "up";
            }
            break;
        case "ArrowRight": 
            if(curDir == "up" || curDir == "down") {
                curDir = "right";
            }
            break;
        case "ArrowLeft":
            if(curDir == "up" || curDir == "down") {
                curDir = "left";
            }
            break;
    }
});
