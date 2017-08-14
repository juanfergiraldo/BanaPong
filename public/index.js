class VecPos  {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

class Bar{
  constructor(w, h){
    this.pos = new VecPos (0, 0);
    this.size = new VecPos(w, h);
  }
  get left(){
        return this.pos.x - this.size.x / 2;
    }
    get right(){
        return this.pos.x + this.size.x / 2;
    }
    get top(){
        return this.pos.y - this.size.y / 2;
    }
    get bottom(){
        return this.pos.y + this.size.y / 2;
    }
}

class Ball {
  constructor(r) {
    this.r = r;
    this.pos = new VecPos(0, 0);
    this.speed = new VecPos(0, 0);
  }
}

class Player extends Bar{

  constructor() {
    super(20, 150)
    this.score = 0;
    this.speed = new VecPos(0, 0);
  }

}

class Pong{

  constructor(canvas){
    this.canvas = canvas;
    this.contex = this.canvas.getContext('2d');
    this.counter = 0;
    this.ban = true;
    this.time = 20;
    this.rad = 10;
    this.ball = new Ball(this.rad);
    this.ball.pos.x = 100;
    this.ball.pos.y = 100;
    this.ball.speed.x = 100;
    this.ball.speed.y = 100;
    this.players = [new Player, new Player];

    this.players[0].pos.x = 40;
    this.players[1].pos.x = canvas.width - 40;
    this.players.forEach(player => {
      player.pos.y = this.canvas.height / 2;
    })
    //Calculates time to draw with request animation frame
    let lasTime = null;
    this.framecallback = (millisec) => {
      if (lasTime !== null) {
        this.update((millisec - lasTime)/1000); //converts to seconds
      }
      lasTime = millisec;
      requestAnimationFrame(this.framecallback);
    }
    this.pause();
  }
  update(dt) {

    this.ball.pos.x += this.ball.speed.x * dt;
    this.ball.pos.y += this.ball.speed.y * dt;

    if((this.ball.pos.x + this.rad) > canvas.width ||
            (this.ball.pos.x - this.rad) < 0){
      const playerId = this.ball.speed.x < 0 | 0;
      this.players[playerId].score++;
      console.log(playerId);
      this.reset();

    }

    if((this.ball.pos.y + this.rad) > canvas.height ||
            (this.ball.pos.y - this.rad) < 0){
      this.ball.speed.y = - this.ball.speed.y;
    }

    //this.players[0].pos.y =  this.ball.pos.y;
    this.setBackground();
    this.setBall();
    this.setPlayers();
    this.follow();
    this.collision();
  }


  setBackground() {
    this.contex.beginPath();
    this.contex.fillStyle = 'pink';
    this.contex.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  setBall() {
    this.contex.arc(this.ball.pos.x, this.ball.pos.y, this.ball.r, 0, 2*Math.PI);
    this.contex.fillStyle = 'yellow';
    this.contex.fill();
    this.contex.stroke();
  }
  setBar(bar) {
    this.contex.fillStyle = 'white';
    this.contex.fillRect(bar.left, bar.top, bar.size.x, bar.size.y);
    this.contex.stroke();
  }

  setPlayers(){
    this.players.forEach(player => this.setBar(player));
  }

  start(){
    requestAnimationFrame(this.framecallback);
  }
  pause(){
    document.addEventListener("keydown", evt =>{
      if(evt.keyCode == 80 || evt.keyCode == 32 && this.ban == true){
        this.ball.speed.x = 0;
        this.ball.speed.y = 0;
        console.log(this.ban);
        this.ban = false;
        console.log(this.ban);
      }
      if(evt.keyCode == 80 || evt.keyCode == 32 && this.ban == false){
        this.ball.speed.x = 0;
        this.ball.speed.y = 0;
        this.ban = true;
      }

    })
  }
  reset(){
    this.ball.pos.x = Math.floor((Math.random() * 300)+ 100);
    this.ball.pos.y = Math.floor((Math.random() * 390)+ 10);;
    this.ball.speed.x = 100;
    this.ball.speed.y = 100;
  }
  follow(){
    this.players[0].pos.y =  this.ball.pos.y;
    var lastPos = this.ball.pos.y;
    if ((this.ball.pos.y - this.players[0].size.y/2) < 0) {
      this.players[0].pos.y = this.players[0].size.y/2;
    }

    if ((this.ball.pos.y + this.players[0].size.y/2) > this.canvas.height) {
      this.players[0].pos.y = this.canvas.height - this.players[0].size.y/2;
    }

  }

  move(){
    document.addEventListener("keydown", evt => {
      if(evt.keyCode == 38 || evt.keyCode == 87){ //Up
        this.players[1].pos.y = this.players[1].pos.y - 20;
        if(this.players[1].pos.y == 75){
        }
        if((this.players[1].pos.y - this.players[1].size.y/2) < 0){
          this.players[1].pos.y = this.players[1].size.y/2;
        }
      }
      if(evt.keyCode == 40 || evt.keyCode == 83){ //Down
        this.players[1].pos.y = this.players[1].pos.y + 20;
        if((this.players[1].pos.y + this.players[1].size.y/2) > this.canvas.height){
          this.players[1].pos.y = this.canvas.height - this.players[1].size.y/2;
        }
      }
    });
  }

  collision(){
          if(this.ball.pos.x - this.rad > 51 && this.ball.pos.x - this.rad < 52){
            this.ball.speed.x = -this.ball.speed.x;
          }
          if(this.ball.pos.y > (this.players[1].pos.y - this.players[1].size.y/2) &&
              this.ball.pos.y < (this.players[1].pos.y + this.players[1].size.y/2) &&
              (this.ball.pos.x < 546) && this.ball.pos.x > 545){
                    this.ball.speed.x = -this.ball.speed.x;
          }
  }

}
const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

pong.start();
pong.move();
//pong.pause();
