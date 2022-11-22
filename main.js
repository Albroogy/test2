const canvas = document.getElementById("game-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const stateDuration = 1000;
const LANE_WIDTH = canvas.width/3;
const LANE_COUNT = 3;
const SCORE_SPEED = 1;
const PlayerStates = {
    Running: "Running", // Also, states are continuous so their names should reflect that - you don't run or jump for a single frame, that's a continuous action over many frames
    Jumping: "Jumping",
    Ducking: "Ducking",
    Powerup: "Powerup"
};
const objectColor = ["yellow","brown","black"]
const objectType = [PlayerStates.Ducking, PlayerStates.Jumping,PlayerStates.Powerup]

let lastTime = Date.now();
let lastClick = Date.now();
let lastRectSpawn = Date.now();
let lastCoinSpawn = Date.now();
let clickDelay = 300; //This is milliseconds
let spawnDelay = 1500; //This is also in milliseconds
let spawnCoinDelay = 2500
let objectLane = 0;
let SCORE = 0;
let HIGH_SCORE = 0;

const allPressedKeys = {};
window.addEventListener("keydown", function (event) {
    allPressedKeys[event.keyCode] = true;
});
window.addEventListener("keyup", function (event) {
    allPressedKeys[event.keyCode] = false;
});
class Rectangle{
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
      }
    draw(){
        context.fillStyle = rects[i].color;
        context.fillRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
    }
}
const rects = [
    lane1 = new Rectangle(0, 500, LANE_WIDTH, 50, "red"),
    lane2 = new Rectangle(canvas.width / 3, 500, LANE_WIDTH, 50, "green"),
    lane3 = new Rectangle(canvas.width / 3 * 2, 500, LANE_WIDTH, 50, "purple"),
]
const coins = [

]
const player = {
    x: canvas.width / 2 - 25,
    y: 600,
    width: 50,
    height: 50,
    color: "blue",
    lane: 2,
    state: PlayerStates.Running
};
const KEYS = {
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    Space: 32,
    ArrowLeft: 37,
    ArrowRight: 39,
    ArrowUp: 38,
    ArrowDown: 40,
};
requestAnimationFrame(runFrame)

function runFrame() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    // process input
    processInput();
    // update state
    update(deltaTime);
    // draw the world
    draw();
    // be called one more time
    requestAnimationFrame(runFrame);
}
function processInput(){
    if (allPressedKeys[KEYS.A] || allPressedKeys[KEYS.ArrowLeft]) {
        if (lastClick <= Date.now() - clickDelay && player.lane - 1 >= 1){
            player.lane -= 1;
            lastClick = Date.now();
            player.state = PlayerStates.Running;
        }
    }
    if (allPressedKeys[KEYS.D] || allPressedKeys[KEYS.ArrowRight]) {
        if (lastClick <= Date.now() - clickDelay && player.lane + 1 <= 3){
            player.lane += 1;
            lastClick = Date.now();
            player.state = PlayerStates.Running;
        }
    }
    if (allPressedKeys[KEYS.S] || allPressedKeys[KEYS.ArrowDown]) {
        if (player.state == PlayerStates.Running){
            player.state = PlayerStates.Ducking;
            console.log(player.state);
            setTimeout(runState, stateDuration);
        }
    }
    if (allPressedKeys[KEYS.W] || allPressedKeys[KEYS.ArrowUp]) {
        if (player.state == PlayerStates.Running){
            player.state = PlayerStates.Jumping;
            console.log(player.state);
            setTimeout(runState, stateDuration);
        }
    }
    player.x = laneLocation(player.lane, player.width)
}
function update(deltaTime){
    SCORE += SCORE_SPEED
    if (lastRectSpawn <= Date.now() - spawnDelay){
        generateObject();
        lastRectSpawn = Date.now();
    }
    if (lastCoinSpawn <= Date.now() - spawnCoinDelay){
        generateCoin()
        lastCoinSpawn = Date.now()
        console.log("coin")
    }
    for (let i = 3; i < rects.length; i++){
        rects[i].y += move(rects[i].speed, deltaTime)
        if (rects[i].y >= canvas.height){
            rects.splice(i,1);
        }
        if (isColliding(rects[i],player) && !isDodging(rects[i],player)){
            console.log("game over");
            rects.splice(3);
            coins.splice(0)
            player.lane = 2;
            if (SCORE > HIGH_SCORE){
                HIGH_SCORE = SCORE
            }
            SCORE = 0
        }
    }
    for (let i = 0; i < coins.length; i++){
        coins[i].y += move(coins[i].speed, deltaTime)
        console.log(coins[i].speed)
        if (isCoinColliding(coins[i],player)){
            coins.splice(i,1);
            SCORE += 300;
        }
        else if (coins[i].y >= canvas.height){
            coins.splice(i,1);
        }
    }
    
    if (player.state == PlayerStates.Running){
        player.color = "blue"
    }
    else if (player.state == PlayerStates.Jumping){
        player.color = "navy"
    }
    else if (player.state == PlayerStates.Ducking){
        player.color = "teal"
    }
}

function draw() {
    // 2d context can do primitive graphic object manipulation
    // it can draw points, lines, and anything composed of those
    // it has predefined commands for basic objects like players, coins and images
    // when drawing, we can decide whether we want to stroke or fill the path

    // before we start drawing, clear the canvas

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rects.length; i++) {
        context.fillStyle = rects[i].color;
        context.fillRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
    }
    for (let i = 0; i < coins.length; i++){
        context.beginPath();
        context.arc(coins[i].x, coins[i].y, coins[i].radius,0, 2*Math.PI, false);
        context.closePath()
        context.fillStyle = coins[i].color;
        context.fill();
    }
    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = "black"
    context.font = "20px Arial";
    context.fillText("SCORE: " + SCORE, 50, 100);
    context.font = "20px Arial";
    context.fillText("HIGH SCORE: " + HIGH_SCORE, 50, 50);

}

function generateObject(){
    objectLane = Math.floor(Math.random() * LANE_COUNT) + 1;
    type = Math.floor(Math.random() * LANE_COUNT);
    rects.push(
        object = {
            x: laneLocation(objectLane,50),//I don't know how to find the objects width when the width has not been defined yet
            y: -50,
            width: 50,
            height: 50,
            color: objectColor[type],
            requiredState: objectType[type],
            speed: 150
        }
    )
}
function generateCoin(){
    objectLane = Math.floor(Math.random() * LANE_COUNT) + 1;
    coins.push(
        object = {
            x: laneLocation(objectLane,0),
            y: -50,
            radius: 25,
            color: "yellow",
            speed: 150
        }
    )
}
function isColliding(obstacle, player){
    return (
        obstacle.x <= player.x + player.width &&
        obstacle.x + obstacle.width >= player.x &&
        obstacle.y + obstacle.height >= player.y &&
        obstacle.y <= player.y + player.height
    )
}
function isCoinColliding(coin, player){
    return (
        coin.x - coin.radius <= player.x + player.width &&
        coin.x + coin.radius >= player.x &&
        coin.y + coin.radius >= player.y &&
        coin.y - coin.radius <= player.y + player.height
    )
}
function isDodging(obstacle,player){
    return obstacle.requiredState == player.state;
}
function runState(){
    player.state = PlayerStates.Running
    console.log(player.state)
}
function laneLocation(lane,width){
    return lane * LANE_WIDTH - LANE_WIDTH/2 - width/2;
}
function move(speed, deltaTime){
    return speed * deltaTime / 1000;
}
