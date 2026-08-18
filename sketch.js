const startItemSpawnTime = 3000;
const startItemSpeed = 4;
const startPointGoal = 5;
const bagSize = 100;
const canvasX = 540;
const canvasY = 960;

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
let itemSpeed = startItemSpeed;
let pointGoal = startPointGoal;

function setup() {
  createCanvas(canvasX, canvasY);
}



function draw() {

  handleInput();
  
  if(gameState == 0){
    background(220);
    
    textSize(50); // UI
    strokeWeight(3);
    text("PLAY GAME", 25, height/2);
  } else if(gameState == 1){ // WHILE IN PLAY
    background(220);

    gameTime = gameTime + deltaTime;
    if(gameTime >= currentItemSpawnTime){
      let xPos = random(width);
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
  
    strokeWeight(4);
    square(bagX-(bagSize/2), bagY-(bagSize/2), bagSize); // bag
  
    textSize(50); // UI
    strokeWeight(2);
    text("level " + level, 25, 75);
    textSize(25);
    strokeWeight(1);
    text("points: " + score, 25, 120);
    
  } else if(gameState == 2){ // ENDING SCREEN
    background(220,80,80);
    
    textSize(50); // UI
    strokeWeight(3);
    text("GAME OVER", 25, 110);
    textSize(50);
    strokeWeight(2);
    text("level " + level, 25, 175);
    textSize(25);
    strokeWeight(1);
    text("points: " + score, 25, 220);
  }
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
  itemSpeed = itemSpeed + 2;
  itemSpawnTime = itemSpawnTime * .5;
  pointGoal = pointGoal*2;
}

function resetGame(){
  itemSpawnTime = startItemSpawnTime;
  itemSpeed = startItemSpeed;
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
    strokeWeight(4);
    ellipse(this.x, this.y, 50);
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