const startItemSpawnTime = 2500;
const startItemSpeed = 5;
const startPointGoal = 3;
const startBagSize = 150;
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
let handleX = canvasX/2;
let handleY = canvasY - bagSize;
let bagX = canvasX/2;
let bagY = canvasY - bagSize;
let isTouching = false;
let tapped = false;
let touchMode = false;
let bag;

let itemSpawnTime = startItemSpawnTime;
let itemSpeed = startItemSpeed;
let pointGoal = startPointGoal;

let img_bag;
let img_bg;

async function setup() {
  img_bag = await loadImage('img/Bag_A_512x512.png');
  img_bg = await loadImage('img/bg_540x960.png');
  calcCanvas();
  createCanvas(canvasX, canvasY);
  bag = new Bag();
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
    image(img_bg, 0, 0, canvasX, canvasY);

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
        bag.goodAnim();
        items.splice(i,1);
        if (score >= pointGoal){
          nextLevel();
        }
      }

    }

    strokeWeight(4*sc);
    //square(bagX-(bagSize/2), bagY-(bagSize/2), bagSize); // bag
    bag.move();
    bag.show();

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
  bagY = canvasY - bagSize;
  calcItemSpeed();
}

function calcItemSpeed(){
  itemSpeed = startItemSpeed*(Math.pow(1.25,level))*sc;
}

function handleInput(){
  if (touches.length > 0){
    touchMode = true;
  }

  if (!touchMode){
    bagX = mouseX;
    //bagY = mouseY;
  } else if (touches.length > 0){
    bagX = touches[0].x;
    //bagY = touches[0].y;
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
  } else if(gameState == 2){
    resetGame();
  }
}

function nextLevel(){
  level++;
  calcItemSpeed();
  itemSpawnTime = itemSpawnTime * .6;
  pointGoal = pointGoal*2;
}

function resetGame(){
  itemSpawnTime = startItemSpawnTime;
  calcItemSpeed();
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
    if((d-(itemSize/2)) <= (bagSize/2)){
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

class Bag {
  constructor(){
    this.x = bagX-(bagSize/2);
    this.y = bagY-(bagSize/2);
    this.r = 0;
    this.speed = 0;
    this.acceleration = 0;
    this.scaleAdd = 0;
  }

  move(){
    let lastX = this.x;
    let lastSpeed = this.speed;
    this.x = bagX;
    //this.y = bagY-(bagSize/2);
    this.speed = (this.x - lastX)/100;
    this.r = (this.r + this.speed)*.8;
  }
  
  goodAnim(){
    this.scaleAdd = 20;
  }

  show(){
    //circle(this.x,this.y,bagSize/2);
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.r);
    image(img_bag, 0, bagSize/2, bagSize+this.scaleAdd, bagSize+this.scaleAdd);
    pop();
    
    this.scaleAdd = this.scaleAdd*.8;
  }
};