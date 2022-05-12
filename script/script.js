var snakeObject; //global snake Object for use by all eventhandlers due to scoping issues;

//Snake constructor function with required properties
function Snake() {
this.direction="right";
this.speed=20; //amend to be consistent with height/width of snake head/body element otherwise movement is not in line;
this.head=document.getElementById("head");
this.body=Array.prototype.slice.call(document.querySelectorAll(".body"),0);//convert Nodelist to proper Array;
this.parent=head.parentElement;
this.maximumWidth=this.parent.clientWidth;
this.maximumHeight=this.parent.clientHeight;
this.moving=null;
this.food=document.getElementById("food");
  
  
  var that=this;//for setInterval callback 'this' binding issue;
  //this.move();
  this.interval=setInterval(function(){
    that.move();
    },100); //100ms for width/height at 10px, reduce to 50ms for width/height at 5px; 
}

Snake.prototype.createBody=function() {
  var newBody=document.createElement("div");
  newBody.setAttribute("class","body");
  newBody.setAttribute("id","body"+this.body.length+1);
  
    switch (this.direction) {
    case "right":
      newBody.style.left=this.body[this.body.length-1].offsetLeft-this.speed+"px"
      newBody.style.top=this.body[this.body.length-1].offsetTop+"px"
      break;
    case "left":
      newBody.style.left=this.body[this.body.length-1].offsetLeft+this.speed+"px"
      newBody.style.top=this.body[this.body.length-1].offsetTop+"px"
      break;
    case "up":
      newBody.style.left=this.body[this.body.length-1].offsetLeft+"px"
      newBody.style.top=this.body[this.body.length-1].offsetTop+this.speed+"px"
      break;
   case "down":
      newBody.style.left=this.body[this.body.length-1].offsetLeft+"px"
      newBody.style.top=this.body[this.body.length-1].offsetTop-this.speed+"px"
      break;
      } 

    this.body.push(newBody);
    this.parent.appendChild(newBody);
}


Snake.prototype.move=function() {
//Update all head/body positions before movement;
  this.updatePosition();
  
//Movement of head first based on direction;
  switch (this.direction) {
    case "right":
      this.head.style.left=this.head.offsetLeft+this.speed+"px";
      break;
    case "left":
      this.head.style.left=this.head.offsetLeft-this.speed+"px";
      break;
    case "up":
      this.head.style.top=this.head.offsetTop-this.speed+"px";
      break;
   case "down":
      this.head.style.top=this.head.offsetTop+this.speed+"px";
      break;
    default:
      this.head.style.left=this.head.offsetLeft+this.speed+"px";
  }
  
 //Movement of bodies based on head position and previous body positions
    this.body[0].style.left=this.head.previousPositionLeft+"px";
    this.body[0].style.top=this.head.previousPositionTop+"px";
    for (var i=1;i<this.body.length;i++) {
      this.body[i].style.left=this.body[i-1].previousPositionLeft+"px";
      this.body[i].style.top=this.body[i-1].previousPositionTop+"px";
  }
  
  //whole section below is to reset snake position after moving off end of screen.
  if (this.head.offsetLeft+this.speed>this.maximumWidth) 
    this.head.style.left=0+"px";
  
  if (this.head.offsetLeft<0) 
    this.head.style.left=this.maximumWidth-this.speed+"px"
  
  if (this.head.offsetTop+this.speed>this.maximumHeight) 
    this.head.style.top=0+"px"
  
  if (this.head.offsetTop<0) 
    this.head.style.top=this.maximumHeight-this.speed+"px"
  
  
  //when eat food snake grows and food reappears
  if (this.head.offsetLeft===this.food.offsetLeft && this.head.offsetTop===this.food.offsetTop) {
    this.createBody();
    this.generateFood();
    //update score
  document.getElementById("score").textContent=parseInt(document.getElementById("score").textContent)+5;
  }
  
  this.moving=1;
  //gameover when collide
  if (this.checkSnakeCollision([this.head.offsetLeft,this.head.offsetTop])) {
    clearInterval(this.interval);
    this.moving=null;
  document.getElementById("gameover").classList.add("gameover-activated");
  }
}
  
Snake.prototype.updatePosition=function() {
  this.head.previousPositionLeft=this.head.offsetLeft;
  this.head.previousPositionTop=this.head.offsetTop;
  
   this.body.forEach(function(element){
      element.previousPositionLeft=element.offsetLeft;
      element.previousPositionTop=element.offsetTop;
    });
}  
  
Snake.prototype.changeDirection=function(e){
  switch (e.which) {
    case 37:
    if(this.direction!="right") {
      this.direction="left";
    }
    break;
    case 38:
    if(this.direction!="down") {
      this.direction="up";
    }
    break;
    case 39:
    if(this.direction!="left") {
      this.direction="right";
    }
    break;
    case 40:
    if(this.direction!="up") {
      this.direction="down";
    }
    break;
  }
}

Snake.prototype.generateRandomPosition=function() {
  //round up to 20px intervals;
  var randomTop=Math.floor((Math.random()*(this.maximumHeight))/20)*20;
  var randomLeft=Math.floor((Math.random()*(this.maximumWidth))/20)*20;
  //check whether collide with existing snake head/body positions;
  return [randomLeft,randomTop];
}

Snake.prototype.generateFood=function() {
  var array=this.generateRandomPosition();
  while(this.checkFoodCollision(array)) {
        array=this.generateRandomPosition();
  }
  //make sure any previous food removed
  if(this.food)
    this.parent.removeChild(this.food);
  
  //create new food
  var newFood=document.createElement("div");
  newFood.setAttribute("class","food");
  newFood.setAttribute("id","food");
  newFood.style.left=array[0]+"px";
  newFood.style.top=array[1]+"px";
  this.parent.appendChild(newFood);
  this.food=document.getElementById("food");//update property in instance;
}
  
Snake.prototype.checkFoodCollision=function (arrayPosition) {
  if (arrayPosition[0]===this.head.offsetLeft&&arrayPosition[1]===this.head.offsetTop)  return true;
  
  for (var i=0;i<this.body.length;i++){
    if (arrayPosition[0]===this.body[i].offsetLeft&&arrayPosition[1]===this.body[i].offsetTop)
      return true;
  };
  return false;
}

Snake.prototype.checkSnakeCollision=function (arrayPosition) {
  for (var i=0;i<this.body.length;i++){
    if (arrayPosition[0]===this.body[i].offsetLeft&&arrayPosition[1]===this.body[i].offsetTop)
      return true;
  };
  return false;
}
  
Snake.prototype.reset = function() {
  var x = window.matchMedia("(min-width: 768px)");
  //remove all bodies other than first 2 bodies and update this.body array for createBody() method positioning to work subsequently.
  for (var i=this.body.length-1;i>1;i--) {
    this.parent.removeChild(this.body[i]);
    this.body.pop(i);
  }
  
  if (x.matches) {
    this.head.style.left="300px";
    this.head.style.top="200px";
    this.body[0].style.left="280px";
    this.body[0].style.top="200px";
    this.body[1].style.left="260px";
    this.body[1].style.top="200px";
  } else {
    this.head.style.left="180px";
    this.head.style.top="180px";
    this.body[0].style.left="160px";
    this.body[0].style.top="180px";
    this.body[1].style.left="140px";
    this.body[1].style.top="180px";
  }
  this.direction="right";
  document.getElementById("score").textContent="0";
  document.getElementById("start-resume").textContent="START";
  document.getElementById("gameover").classList.remove("gameover-activated");
}


//EventListeners and handlers
document.getElementById("start-resume").addEventListener("click", function() {
  if(!snakeObject) {
    snakeObject=new Snake();
    snakeObject.generateFood();
    document.getElementById("start-resume").textContent="RESUME";
    document.getElementById("canvas").focus();
    return;
  }
  if(!snakeObject.moving) {
    snakeObject.interval=setInterval(function(){
    snakeObject.move();
    },100);
  }
  document.getElementById("canvas").focus();
});

document.getElementById("pause").addEventListener("click", function() {
  clearInterval(snakeObject.interval);
  snakeObject.moving=null;
})

document.getElementById("canvas").addEventListener("keydown", function(e){
  snakeObject.changeDirection(e);
});

document.getElementById("try-again").addEventListener("click", function(e){
  snakeObject.reset();
});

//eventlisteners for control (for mobile and tablet). Reuse .changeDirection function.

document.getElementById("left").addEventListener("click", function(){
  var direction={which:37};
  snakeObject.changeDirection(direction);
});

document.getElementById("up").addEventListener("click", function(){
  var direction={which:38};
  snakeObject.changeDirection(direction);
});

document.getElementById("right").addEventListener("click", function(){
  var direction={which:39};
  snakeObject.changeDirection(direction);
});

document.getElementById("down").addEventListener("click", function(){
  var direction={which:40};
  snakeObject.changeDirection(direction);
});

//touch screen drag feature for control buttons
document.getElementById("control").addEventListener("touchmove", function(e){
  document.getElementById("control").style.left=e.touches[0].pageX-(document.getElementById("control").clientWidth/2)+"px";
   document.getElementById("control").style.top=e.touches[0].pageY-(document.getElementById("control").clientHeight/2)+"px";
});


//set left position of control button element on screen load based on canvas left position
document.getElementById("control").style.left=document.getElementById("canvas").offsetLeft+240+"px";
