$(document).ready(function () {
	
var canvas = $('#gameCanvas')[0].getContext('2d');
var width = $('#gameCanvas').width();
var height = $('#gameCanvas').height();

//creates the ball
var ball = new Ball(width/2,height/2, 5, 3);

//creates two new players at opposing sides of the field
var player1 = new Paddle(0, 10, height/2 - 30, height/2 + 30);
var player2 = new Paddle(width-10, width, height/2 - 30, height/2 + 30);

//ball object that gets hit around the board by the paddles with hitbox
function Ball(centerX, centerY, radius, speed){
	this.X = centerX;
	this.Y = centerY;
	this.radius = radius;
	this.speed = speed;
	this.direction = 0; //represents direction the ball is traveling in radians
	this.setDirection = function(direction){
		//todo: make this compatible with more than 2pi and less than zero
		this.direction = direction;
	};
	//applies the speed and direction to the position
	this.move = function(){
		var dx = this.speed * Math.cos(this.direction);
		var dy = this.speed * Math.sin(this.direction);

		this.X += dx;
		this.Y -= dy; //subtract because graphics start at top left corner
	};

	//if the ball is moving to the right returns true, false for left
	this.isRight = function() {
		if (this.direction > 0 && this.direction < Math.PI / 2){
			return true;
		} else if (this.direction < Math.PI * 3 / 2){
			return false;
		} else {
			return true;
		}
	};

	//checks for collision with wall and chagnes direction as necessary
	this.wallCollision = function(){

		if (this.Y < 0){
			//colliding with top wall
			this.setDirection(2 * Math.PI - (this.direction % Math.PI));
		} else if (this.Y > height){
			//colliding with bottom
			this.setDirection(Math.PI - (this.direction % Math.PI));
		} else if (this.X < 0){
			//colliding with left wall
			//left player just lost
		} else if (this.X > width){
			//colliding with right wall
			//right player just lost
		}
	};
};

//new paddle object, represents the paddle that hits the ball which the player controls
//four variables to represent each corner of the hitbox
function Paddle(x1, x2, y1, y2){
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.isColliding = function(ball){
		if (ball.direction%(Math.PI*2) < (Math.PI/2)) {
			return ((ball.X+ball.radius) > this.x1 &&
		 		ball.Y < this.y2 &&
				ball.Y > this.y1);
		}
		else {
			return ((ball.X-ball.radius) < this.x2 &&
		 		ball.Y < this.y2 &&
				ball.Y > this.y1);
		};
		
	};
	//changes the direction of the ball during collision
	this.returnTrajectory = function(ball){
		var center = (this.y1 + this.y2) / 2;
		var ballcenter = ball.Y;
		var maxDifference = (this.y2 - this.y1);
		var difference = center - ballcenter;

		//ratio to get multiplied by 90 degrees to get new direction
		var ratio = difference / maxDifference;

		//if ratio is negative, then the ball will be going down
		//if the ball is going right, then it will go left

		var newDirection;

		if (ball.direction >= 0 && ball.direction < Math.PI / 2){
			//quadrant 1
			//going right, now needs to go left
			newDirection = 'left';
		} else if (ball.direction < Math.PI){
			//quadrant 2
			//going left, now needs to go right
			newDirection = 'right';
		} else if (ball.direction < Math.PI * 3 / 2){
			//quadrant 3
			//going left, now needs to go right
			newDirection = 'right';
		} else {
			//quadrant 4
			//going right, now needs to go left
			newDirection = 'left';
		}
		
		//Math.PI / 2 * ratio

		if (newDirection === 'right') {
			ball.setDirection((Math.PI / 2) * ratio);
		} else if (newDirection === 'left') {
			ball.setDirection(Math.PI + -1 * (Math.PI / 2) * ratio);
		}

	};
};

function tick(){

	
	//move the ball and check for collision with both paddles
	
if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(refreshCanvas, 25);
	//refresh graphics
	
};

tick();

function paint(){
	//player 1
	canvas.fillStyle = 'red';
	canvas.fillRect(player1.x1,player1.y1,(player1.x2-player1.x1),(player1.y2-player1.y1));
	
	//player 2
	canvas.fillStyle = 'blue';
	canvas.fillRect(player2.x1,player2.y1,(player2.x2-player2.x1),(player2.y2-player2.y1));
	
	//ball
	canvas.beginPath();
	//(centerX, centerY, radius, 0, arc length, false)
	canvas.arc(ball.X, ball.Y, ball.radius, 0, 2 * Math.PI, false);
	canvas.fillStyle = 'black';
	canvas.fill();
};

function refreshCanvas(){
	
	ball.move();
	// if ball is moving right
	if ((ball.direction+(Math.PI/2))%(Math.PI*2) < (Math.PI)) {
		if (player2.isColliding(ball)){
			player2.returnTrajectory(ball);
			ball.speed+=1;
		}
	}
	else {
		if (player1.isColliding(ball)){
			player1.returnTrajectory(ball);
			ball.speed+=1;
		}
	}

	//checks for collision with walls
	ball.wallCollision();


	
	
	canvas.fillStyle = 'White';
	canvas.fillRect(0,0,width,height);
	
	paint();
};

$(document).keydown(function(e){
	//switch statement to handle different keycodes
	switch(e.which){
		// w/s for player 1
		// up/down for player 2
		case 38:
			//arrow key up
			player2.y1-=5;
			player2.y2-=5;
			break;
		case 40:
			//arrow key down
			player2.y1+=5;
			player2.y2+=5;
			break;
		case 87:
			//w key up
			player1.y1-=5;
			player1.y2-=5;
			break;
		case 83:
			//s key down
			player1.y1+=5;
			player1.y2+=5;
			break;
		default:
			break;
	}
	
});



});
