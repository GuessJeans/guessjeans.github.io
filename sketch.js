const startItemSpawnTime = 3000;
const startItemSpeed = 4;
const startPointGoal = 5;
const startBagSize = 100;
const startItemSize = 50;
const startTextH1 = 100;
const startTextH2 = 50;
const startTextH3 = 25;
const gameAspect = .5625;

let canvasX = 540;
let canvasY = 960;
let bagSize = startBagSize;
let itemSize = startItemSize;
let textH1 = startTextH1;
let textH2 = startTextH2;
let textH3 = startTextH3;
let sc = 1;
let items = [];
let score = 0;
let level = 1;
let currentItemSpawnTime = 0;
let gameState = 0;
let gameTime = 0;
let bagX = canvasX/2;
let bagY = canvasY - bagSize;
let isTouching = false;
let tapped = false;
let touchMode = false;

let itemSpawnTime = startItemSpawnTime;
let itemSpeed = startItemSpeed*(Math.pow(1.25,level))*sc;
let pointGoal = startPointGoal;

function setup() {
  calcCanvas();
  createCanvas(canvasX, canvasY);
}

function windowResized(){
  calcCanvas();
  resizeCanvas(canvasX, canvasY);
}

function draw() {
  handleInput();

  if(gameState == 0){
    background(220);

    textSize(textH2); // UI
    textWeight(3*sc);
    text("PLAY GAME v2", 25*sc, canvasY/2);
  } else if(gameState == 1){ // WHILE IN PLAY
    background(220);

    gameTime = gameTime + deltaTime;
    if(gameTime >= currentItemSpawnTime){
      let xPos = random(canvasX);
      let item = new Item(xPos, 0);
      items.push(item);
      currentItemSpawnTime = currentItemSpawnTime + itemSpawnTime;
    }

    for(let i=0; i<items.length; i++){
      items[i].move();
      items[i].show();
      if(items[i].offScreen()){
        gameState++;
      }
      if(items[i].inBag(bagX, bagY)){
        score++;
        items.splice(i,1);
        if (score >= pointGoal){
          nextLevel();
        }
      }

    }

    strokeWeight(4*sc);
    square(bagX-(bagSize/2), bagY-(bagSize/2), bagSize); // bag

    textSize(textH2); // UI
    strokeWeight(2*sc);
    text("level " + level, 25*sc, 75*sc);
    textSize(textH3);
    strokeWeight(1*sc);
    text("points: " + score, 25*sc, 120*sc);

  } else if(gameState == 2){ // ENDING SCREEN
    background(220,80,80);

    textSize(textH2); // UI
    strokeWeight(3*sc);
    text("GAME OVER", 25*sc, 110*sc);
    textSize(textH2);
    strokeWeight(2*sc);
    text("level " + level, 25*sc, 175*sc);
    textSize(textH3);
    strokeWeight(1*sc);
    text("points: " + score, 25*sc, 220*sc);
  }
}

function calcCanvas(){
  browserAspect = windowWidth/windowHeight;
  if (browserAspect > gameAspect){ // landscape browser
    canvasY = windowHeight;
    canvasX = windowHeight*gameAspect;
  } else {
    canvasX = windowWidth;
    canvasY = windowWidth/gameAspect;
  }
  sc = canvasX/540;
  bagSize = startBagSize*sc;
  itemSize = startItemSize*sc;
  textH1 = startTextH1*sc;
  textH2 = startTextH2*sc;
  textH3 = startTextH3*sc;
  itemSpeed = startItemSpeed*(Math.pow(1.25,level))*sc;
}

function handleInput(){
  if (touches.length > 0){
    touchMode = true;
  }

  if (!touchMode){
    bagX = mouseX;
    bagY = mouseY;
  } else if (touches[0] !== null){
    bagX = touches[0].x;
    bagY = touches[0].y;
    isTouching = true;
    if(isTouching !== tapped){
      interact();
      tapped = true;
    }
  } else {
    isTouching = false;
    tapped = false;
  }
}

function mouseClicked(){
  interact();
}

function interact(){
  if(gameState == 0){
    resetGame();
    gameState++;
  }
  if(gameState == 2){
    resetGame();
  }
}

function nextLevel(){
  level++;
  itemSpeed = startItemSpeed*(Math.pow(1.25,level))*sc;
  itemSpawnTime = itemSpawnTime * .5;
  pointGoal = pointGoal*2;
}

function resetGame(){
  itemSpawnTime = startItemSpawnTime;
  itemSpeed = startItemSpeed*sc;
  pointGoal = startPointGoal;
  items.length = 0;
  score = 0;
  level = 1;
  currentItemSpawnTime = 0;
  gameState = 0;
  gameTime = 0;
}



class Item {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  move(){
    this.y = this.y + itemSpeed;
  }

  show(){
    stroke(10);
    strokeWeight(4*sc);
    ellipse(this.x, this.y, itemSize);
  }

  inBag(mX,mY){
    let result = false;
    let d = dist(mX, mY, this.x, this.y);
    if(d <= bagSize){
      result = true;
    }
    return result;
  }

  offScreen(){
    if(this.y > height){
      return true;
    } else {
      return false;
    }
  }
}
