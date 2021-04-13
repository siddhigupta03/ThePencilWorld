var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var backgroundImg,
bg = "images/Bm.jpg"

function preload(){
  getBackgroundImg();

  trex_running =   loadAnimation("images/run1.png","images/run2.png");
  
  groundImage = loadImage("images/ground2.png");
  
  cloudImage = loadImage("images/clouds.png");
  
  obstacle1 = loadImage("images/ob1.png");
  obstacle2 = loadImage("images/ob2.png");
  
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(displayWidth,displayHeight+50);
  
  trex = createSprite(displayWidth-130,displayHeight,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  ground = createSprite(displayWidth/1,displayHeight/1,20000000000,displayHeight/35);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(displayWidth/1,displayHeight/2-200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/1,displayHeight/2+100);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.4;
  restart.scale = 0.3;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(displayWidth/1,displayHeight/1,displayWidth/0.02,displayHeight/35);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  if(backgroundImg)
  background(backgroundImg);

  textSize(40);
  fill(0);
  text("Score: "+ score, displayWidth/1-150,50);

  trex.setDefaultCollider();

  trex.visible = true;

  var x = trex.x;
  var y = 400;
  camera.position.x = x;
  camera.position.y = y;
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/300);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/1.5;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.visible = false;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(displayWidth,displayHeight,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.07;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = -1;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(0,displayHeight/1.1,10,40);
    obstacle.scale = 0.09;
    //obstacle.debug = true;
    obstacle.velocityX = +(6 + 3*score/100);
    
    //generate random obstacles
      obstacle.addImage(obstacle1);
    
    obstacle.lifetime = -1;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);

  score = 0;
  
}

  async function getBackgroundImg() {
    var response = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo");
    var responseJson = await response.json();
    var dateTime = responseJson.datetime;
    var hour = dateTime.slice(11,13);
    if(hour>=06 && hour<=19) {
        bg = "images/Bm.jpg";
    } 
    else {
        bg = "images/Bn.jpg";
    }
    backgroundImg = loadImage(bg);
    console.log(responseJson);
}