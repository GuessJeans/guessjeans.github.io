// NOTES: ask cooper to remove red from bookmark & key

const startItemSpawnTime = 3000;
const startItemSpeed = 5;
const startPointGoal = 3;
const levelSpawnMult = .8;
const levelSpeedMult = 1.12;
const levelGoalMult = 1.5;
let startBagSize = 175;
let startItemSize = 45;
let startTextH1 = 100; // set in setup
let startTextH2 = 50; // set in setup
let startTextH3 = 35; // set in setup
const gameAspect = .5625;
const look = 2; // 1=flat 2=pixel
const dots = false;

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
let lives = 3;
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
let anim = .8;

let itemSpawnTime = startItemSpawnTime;
let itemSpeed = startItemSpeed;
let pointGoal = startPointGoal;

let img_bg_blue;
let img_play;
let img_exit;
let img_bag;
let img_bg;
let img_good1;
let img_good2;
let img_good3;
let img_good4;
let img_good5;
let img_good6;
let img_good7;
let img_good8;
let img_bad1;
//let img_bad2;
let itemImagesGood;
let itemImagesBad;
let c1;
let c2;
let f1;
let f2;
let f3;

async function setup() {
  //default image
  let img_default = createImage(64,64);
  img_default.loadPixels();
  for (let x = 0; x < img_default.width; x += 1) {
    for (let y = 0; y < img_default.height; y += 1) {
      img_default.set(x, y, 0);
    }
  }
  img_default.updatePixels();
  
  img_bg_blue = img_default;
  img_play = img_default;
  img_exit = img_default;
  img_bag = img_default;
  img_bg = img_default;
  img_good1 = img_default;
  img_good2 = img_default;
  img_good3 = img_default;
  img_good4 = img_default;
  img_good5 = img_default;
  img_good6 = img_default;
  img_good7 = img_default;
  img_good8 = img_default;
  img_bad1 = img_default;
  
  img_bg_blue = await loadImage('img/blue-dither-bg.png');
  img_play = await loadImage('img/PLAY.png');
  img_exit = await loadImage('img/EXIT.png');
  img_bg = await loadImage('img/pixel_bg.png');
  img_bag = await loadImage('img/pixel_bag.png');
  img_good1 = await loadImage('img/pixel_good1.png');
  img_good2 = await loadImage('img/pixel_good2.png');
  img_good3 = await loadImage('img/pixel_good3.png');
  img_good4 = await loadImage('img/pixel_good4.png');
  img_good5 = await loadImage('img/pixel_good5.png');
  img_good6 = await loadImage('img/pixel_good6.png');
  img_good7 = await loadImage('img/pixel_good7.png');
  img_good8 = await loadImage('img/pixel_good8.png');
  img_bad1 = await loadImage('img/pixel_bad1.png');
    //img_bad2 = await loadImage('img/pixel_bad2.png');
    
    startTextH1 = 100;
    startTextH2 = 50;
    startTextH3 = 35;
    
    startBagSize = startBagSize;
    startItemSize = startItemSize;
  
  itemImagesGood = [img_good1, img_good2, img_good3, img_good4, img_good5, img_good6, img_good7, img_good8];
  itemImagesBad = [img_bad1];

  if (look == 1){
    f1 = await loadFont('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap'); // serif
    f2 = await loadFont('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&display=swap'); // serif italics
    f3 = await loadFont('https://fonts.googleapis.com/css2?family=Outfit:wght@550&display=swap'); // sans
  } else {
    f1 = await loadFont('https://fonts.googleapis.com/css2?family=Jersey+10&display=swap');
    f2 = await loadFont('https://fonts.googleapis.com/css2?family=Tiny5&display=swap');
    f3 = await loadFont('https://fonts.googleapis.com/css2?family=Tiny5&display=swap');
  }
  
  c1 = color(250,245,240); // bg color
  c2 = color(10,35,60); // text color
  
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

  if(gameState == 0){ // LOAD SCREEN ///////////////////////////////////////////////////////////////////////////////////////
    if(look==1){
      background(c1);
    } else {
      imageMode(CORNER);
      image(img_bg, 0,0,canvasX,canvasY);
      background(255,255,255,160);
    }
    

    //noStroke();
    //strokeWeight(5);
    //stroke(252, 195, 114);
    fill(c2);
    textSize(textH1); // UI
    textFont(f1);
    textAlign(CENTER, CENTER);
    text("WHAT'S", canvasX/2, canvasY*.15);
    
    textSize(textH3); // UI
    textFont(f2);
    textAlign(CENTER, CENTER);
    text("in my", canvasX/2, canvasY*.225);
    
    textSize(textH1); // UI
    textFont(f1);
    textAlign(CENTER, CENTER);
    text("ALLEGRA?", canvasX/2, canvasY*.3);
    
    noStroke();
    
    imageMode(CENTER);
    noSmooth();
    
    if (look==1){
      image(img_bag, canvasX/2, canvasY*.56, canvasY*.3, canvasY*.3); // flat
    } else {
      image(img_bag, canvasX/2, canvasY*.59, canvasY*.35, canvasY*.35); // pixel
    }
    
    image(img_play, canvasX/2, canvasY*.85, 260*sc, 260*sc);
    
    //rectMode(CENTER);
    //rect(canvasX/2, canvasY*.8, 250*sc, 80*sc, 25*sc);
    //
    //textSize(35*sc);
    //textFont(f3);
    //textAlign(CENTER, CENTER);
    //fill(255);
    //text("PLAY", canvasX/2, canvasY*.8);
    
  } else if (gameState == 1){ // INSTRUCTIONS ////////////////////////////////////////////////////////////////////
    imageMode(CORNER);
      image(img_bg, 0,0,canvasX,canvasY);
      background(255,255,255,160);
    
    textSize(textH1*.8);
    textFont(f1);
    text("Pack for class!", canvasX/2, canvasY*.15);
    
    imageMode(CENTER);
    //text("instructions", 100, 100);
    //fill(255,0,0);
    //circle((canvasX/2)+(myWeirdEase(anim)*canvasX*1.5), canvasY/2, 100);
    image(img_bad1,(canvasX/2)+(myWeirdEase(anim)*canvasX*1.5), canvasY*.5, bagSize*1.2, bagSize*1.2);
    //fill(0,255,0);
    //circle((canvasX/2)+(myWeirdEase((anim+.5) % 1)*canvasX*1.5), canvasY/2, 100, 100);
    image(img_good1,(canvasX/2)+(myWeirdEase((anim+.5) % 1)*canvasX*1.5), canvasY*.5, bagSize*1.2, bagSize*1.2);

    
    if (((anim+.25) % 1) < .5){
      fill(c2);
      textSize(textH2*.6);
      textFont(f2);
      text("CATCH THE ESSENTIALS.", canvasX/2, canvasY*.23);
    } else {
      fill(c2);
      textSize(textH2*.6);
      textFont(f2);
      text("AVOID BAD GRADES.", canvasX/2, canvasY*.23);
    }
    
    image(img_play, canvasX/2, canvasY*.85, 260*sc, 260*sc);
    
    if (anim < 1){
      anim = anim + .0025;
    } else{
      anim = 0;
    }
  } else if(gameState == 2){ // WHILE IN PLAY ////////////////////////////////////////////////////////////////////////////////
    if (look==1){
      background(c1);
    } else {
      imageMode(CORNER);
      image(img_bg, 0, 0, canvasX, canvasY);
      background(255,255,255,100);
    }

    gameTime = gameTime + deltaTime;
    if(gameTime >= currentItemSpawnTime){
      let xPos = random(itemSize, canvasX - itemSize);
      let item = new Item(xPos, 0);
      items.push(item);
      currentItemSpawnTime = currentItemSpawnTime + itemSpawnTime;
    }

    for(let i=0; i<items.length; i++){
      items[i].move();
      //items[i].show();
      if(items[i].offScreen() && items[i].isGood){
        gameState++;
      }
      if(items[i].inBag(bagX, bagY)){
        if(items[i].isGood){
          score++;
          bag.goodAnim();
          if (score >= pointGoal){
            nextLevel();
          }
        } else {
          bag.badAnim();
          gameState++;
        }
        items.splice(i,1);
      }
    }
    
    showAllItems();

    //strokeWeight(4*sc);
    //square(bagX-(bagSize/2), bagY-(bagSize/2), bagSize); // bag
    bag.move();
    bag.show();

    push();
    //noStroke();
    strokeWeight(10*sc);
    stroke(250);
    fill(c2);
    textFont(f1);
    textAlign(CENTER);
    textSize(textH1); // UI
    textWeight(1*sc);
    text(score, canvasX/2, 100*sc);
    pop();

  } else if(gameState == 3){ // ENDING SCREEN ////////////////////////////////////////////////////////////////////////////////
    imageMode(CORNER);
    image(img_bg_blue, 0, 0, canvasX, canvasY);
    //background(c2);
    
    noStroke();
    textAlign(CENTER, CENTER);
    fill(192, 228, 255);
    
    stroke(c2);
    textSize(textH2*1.45); // UI
    textFont(f2);
    text("GAME OVER", canvasX/2, 110*sc);
    textSize(textH3);
    text("SCORE:", canvasX/2, 180*sc);
    textFont(f1);
    textSize(textH1*2);
    fill(255);
    text(score, canvasX/2, 280*sc);
    
    imageMode(CENTER);
    image(img_exit, canvasX/2, canvasY*.85, 260*sc, 260*sc);
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
  //console.log("scale: " + scale);
  //console.log("bagSize: " + bagSize);
  //console.log("itemSize: " + itemSize);
}

function calcItemSpeed(){
  itemSpeed = startItemSpeed*(Math.pow(levelSpeedMult,level))*sc;
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
  if(gameState < 2){
    resetGame();
    gameState++;
  } else if(gameState == 3){
    resetGame();
    gameState = 0;
  }
}

function nextLevel(){
  level++;
  calcItemSpeed();
  itemSpawnTime = itemSpawnTime * levelSpawnMult;
  pointGoal = pointGoal*levelGoalMult;
}

function resetGame(){
  itemSpawnTime = startItemSpawnTime;
  calcItemSpeed();
  pointGoal = startPointGoal;
  items.length = 0;
  score = 0;
  level = 1;
  currentItemSpawnTime = 0;
  gameTime = 0;
}

function showAllItems(){
  for(let i=0; i<items.length; i++){
      items[i].show();
  }
}

function easeInOut(x){
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function myWeirdEase(x){
  x = (x-.5)*2;
  return (x)*(.3+Math.abs(x));
}


class Item {
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.isGood = true;
    this.img;
    let ran = random(1);
    if (ran > .9){
      this.isGood = false;
      this.img = itemImagesBad[Math.floor(Math.random() * itemImagesBad.length)];
    } else {
      this.img = itemImagesGood[Math.floor(Math.random() * itemImagesGood.length)];
    }
  }

  move(){
    this.y = this.y + itemSpeed;
  }

  show(){
    push();
    //if(this.isGood){
    //  fill(255);
    //} else {
    //  fill(255,0,0);
    //}
    //stroke(c2);
    //strokeWeight(4*sc);
    //if (dots){
    //  ellipse(this.x, this.y, itemSize);
    //} else {
    //  imageMode(CENTER);
    //  image(img_good1, this.x, this.y, itemSize*2, itemSize*2);
    //}

    imageMode(CENTER);
    image(this.img, this.x, this.y, itemSize*2, itemSize*2);
    pop();
  }

  inBag(mX,mY){
    let result = false;
    let d = dist(mX, mY, this.x, this.y);
    if (!this.isGood){
      d = d+(5*sc);
    }
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
    this.x = constrain(bagX, bagSize/2, canvasX - (bagSize/2));
    this.y = canvasY - bagSize;
    this.speed = (this.x - lastX)/100;
    this.r = (this.r + this.speed)*.8;
    this.r = map(this.r, -1, 1, -1, 1, true);
  }
  
  goodAnim(){
    this.scaleAdd = 20;
  }
  
  badAnim(){
    console.log("trigger bad anim");
  }

  show(){
    //circle(this.x,this.y,bagSize/2);
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.r);
    noSmooth();
    image(img_bag, 0, bagSize/2, bagSize+this.scaleAdd, bagSize+this.scaleAdd);
    pop();
    
    this.scaleAdd = this.scaleAdd*.8;
  }
};