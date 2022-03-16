var main = document.getElementById('main');
var showcanvas = true;
var bestscore = 0;
var mostpause = 0;
var score;
var x = 0;
var bg = ["#FF0000", "#000000", "#FFFF99", "#B5FF91", "#94DBFF"];
//set map
function Map(grid, xnum, ynum) {
  this.grid = grid; // 20x20
  this.xnum = xnum; //
  this.ynum = ynum;

  this.canvas = null;

  //set canvas
  this.create = function() {
    this.canvas = document.createElement('div');
    this.canvas.style.cssText = "position:relative;top:10px;left:50px;border:1px solid darkred;"
    this.canvas.style.width = this.grid * this.xnum + 'px'; //画布的宽
    this.canvas.style.height = this.grid * this.ynum + 'px'; //画布的高
    main.appendChild(this.canvas);

    if (showcanvas) {
      for (var y = 0; y < ynum; y++) {
        for (var x = 0; x < xnum; x++) {
          var a = document.createElement('div');
          a.style.cssText = "border:1px solid yellow";
          a.style.width = this.grid + 'px';
          a.style.height = this.grid + 'px';
          a.style.position = 'absolute';
          a.style.left = x * this.grid + 'px';
          a.style.top = y * this.grid + 'px';
          a.style.backgroundColor = "#EE6A50";
          this.canvas.appendChild(a);
        }
      }
    }

  }

}

//set food
function Food(map) {
  this.width = map.grid;
  this.height = map.grid;
  this.bgcolor = bg[(Math.floor(Math.random() * 5))];
  this.x = Math.floor(Math.random() * map.xnum);
  this.y = Math.floor(Math.random() * map.ynum);
  this.flag = document.createElement('div');
  this.flag.style.width = this.width + 'px';
  this.flag.style.height = this.height + 'px';
  this.flag.style.backgroundColor = this.bgcolor;
  // this.flag.style.borderRadius = '50%';
  this.flag.style.position = 'absolute';
  this.flag.style.left = this.x * this.width + 'px';
  this.flag.style.top = this.y * this.height + 'px';

  map.canvas.appendChild(this.flag);
}

//set snake
function Snake(map) {
  this.width = map.grid;
  this.height = map.grid;
  this.direction = 'right';

  this.body = [{
      x: 2,
      y: 0
    },
    {
      x: 1,
      y: 0
    },
    {
      x: 0,
      y: 0
    }
    //{x:null, y:null, flag:null} 3
  ];
  //show snake
  this.display = function() {
    for (var i = 0; i < this.body.length; i++) {
      if (this.body[i].x != null) {
        var s = document.createElement('div');
        this.body[i].flag = s;

        //set snake
        s.style.width = this.width + 'px';
        s.style.height = this.height + 'px';
        s.bgcolor = bg[(Math.floor(Math.random() * 5))];
        s.style.position = 'absolute';
        s.style.left = this.body[i].x * this.width + 'px';
        s.style.top = this.body[i].y * this.height + 'px';
        s.style.backgroundColor = s.bgcolor;
        //add to map
        map.canvas.appendChild(s);
      }

    }
  }
  //move
  this.move = function() {

    for (var i = this.body.length - 1; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
    }
    switch (this.direction) {
      case "left":
        this.body[0].x -= 1;
        break;
      case "right":
        this.body[0].x += 1;
        break;
      case "up":
        this.body[0].y -= 1;
        break;
      case "down":
        this.body[0].y += 1;
        break;
    }


    //eat food
    if (this.body[0].x == food.x && this.body[0].y == food.y && food.bgcolor != "#FF0000") {
      score = score + 1;
      document.getElementById("score").innerHTML = score;
      this.body.push({
        x: null,
        y: null,
        flag: null
      });
      if (this.body.length > l.slength) {
        l.set();
      }

      map.canvas.removeChild(food.flag);
      food = new Food(map);
    }

    if (this.body[0].x != food.x && this.body[0].y != food.y && food.bgcolor == "#FF0000") {
      setTimeout(function() {
        //food.flag.style.display="none";
        map.canvas.removeChild(food.flag);
        food = new Food(map);
      }, 10 * l.speed);
      //food.flag.style.display="none";
      //map.canvas.removeChild(food.flag);
      //food = new Food(map);
    }

    if (this.body[0].x == food.x && this.body[0].y == food.y && food.bgcolor == "#FF0000") {
      checkCookie();
      clearInterval(timer);
      //checkCookie();
      alert("Game is over!");
      //checkCookie();
      restart(map, this);
      // checkCookie();
      return false;

    }

    //reach itself
    for (var i = 4; i < this.body.length; i++) {
      if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
        score = score - 5;
        document.getElementById("score").innerHTML = score;

      }

    }

    if (this.body.length >= 4 && score <= 0) {
      checkCookie();
      clearInterval(timer);
      //checkCookie();
      alert("Game is over!");
      // checkCookie();
      //重新开始游戏
      restart(map, this);
      checkCookie();
      return false;
    }
    //reach the wall
    if (this.body[0].x < 0 || this.body[0].x > map.xnum - 1 || this.body[0].y < 0 || this.body[0].y > map.ynum - 1) {
      checkCookie();
      clearInterval(timer);
      alert("Game is over!");
      //checkCookie();
      restart(map, this);
      //checkCookie();
      return false;
    }

    for (var i = 0; i < this.body.length; i++) {
      if (this.body[i].flag != null) {
        map.canvas.removeChild(this.body[i].flag)
      }
    }

    this.display();
  }
}

function restart(map, snake) {
  score = 0;
  x = 0;
  document.getElementById("time").innerHTML = x;
  document.getElementById("score").innerHTML = score;
  for (var i = 0; i < snake.body.length; i++) {
    map.canvas.removeChild(snake.body[i].flag);
  }
  snake.body = [{
      x: 2,
      y: 0
    },
    {
      x: 1,
      y: 0
    },
    {
      x: 0,
      y: 0
    }

  ];
  snake.direction = 'right';
  snake.display();
  map.canvas.removeChild(food.flag);
  food = new Food(map);

}
//set level
function Level() {
  this.num = 1;
  this.speed = 300; //with the level rise, speed rise 
  this.slength = 8;

  this.set = function() {
    this.num++;
    if (this.speed <= 50) {
      this.speed = 50;
    } else {
      this.speed -= 50;
    }
    this.slength += 12;
    this.display();
    start();
  }

  this.display = function() {
    document.getElementById('slevel').innerHTML = this.num;
  }
}
var l = new Level();
l.display();


var map = new Map(15, 30, 15);
map.create();


var food = new Food(map);

var snake = new Snake(map);
snake.display();

function Up() {
  if (snake.direction != "down") {
    snake.direction = "up";
  }
}

function Down() {
  if (snake.direction != "up") {
    snake.direction = "down";
  }
}

function Left() {
  if (snake.direction != "right") {
    snake.direction = "left";
  }
}

function Right() {
  if (snake.direction != "left") {
    snake.direction = "right";
  }
}



var timer;

function start() {
  score = Number(document.getElementById("score").innerHTML);
  clearInterval(timer);
  timer = setInterval(function() {
    snake.move();
  }, l.speed);
}

document.getElementById('startBtn').onclick = function() {
  start();
}
document.getElementById('downBtn').onclick = function() {
  Down();
}
document.getElementById('leftBtn').onclick = function() {
  Left();
}
document.getElementById('rightBtn').onclick = function() {
  Right();
}
document.getElementById('upBtn').onclick = function() {
  Up();
}



document.getElementById('pauseBtn').onclick = function() {
  x = x + 1;
  document.getElementById('time').innerHTML = x;
  clearInterval(timer);
}


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Function to get the cookie
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var cbestscore = getCookie("bestscore");
  var cmostpause = getCookie("mostpause");
  if ((parseInt(cbestscore)) <= score || parseInt(cmostpause) <= x) {
    setCookie("bestscore", score, 30);
    setCookie("mostpause", x, 30);
  }
  document.getElementById("bestscore").innerHTML = getCookie("bestscore");
  document.getElementById("mostpause").innerHTML = getCookie("mostpause");
}
