var canvas = $('#gameCanvas')[0].getContext('2d');
var width = $('#gameCanvas').width();
var height = $('#gameCanvas').height();

//creates the ball
var ball = new Ball()

//creates two new players at opposing sides of the field
var player1 = new Paddle(0,5, height/2 - 10, height/2 + 10);
var player2 = new Paddle(width-5,width, height/2 - 10, height/2 + 10)

//ball object that gets hit around the board by the paddles with hitbox
function Ball(x1, x2, y1, y2, speed){
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.speed = speed;
	this.direction = Math.PI; //represents direction the ball is traveling in radians
	this.setDirection = function(direction){
		this.direction = direction;
	};
	//applies the speed and direction to the position
	this.move = function(){
		var dx = this.speed * Math.cos(direction);
		var dy = this.speed * Math.sin(direction);
		this.x1 += dx;
		this.x2 += dx;
		this.y1 += dy;
		this.y2 += dy;
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
		return !(ball.x1 > this.x2 ||
				 ball.x2 < this.x1 ||
				 ball.y1 > this.y2 ||
				 ball.y2 < this.y1);
	};
	//changes the direction of the ball during collision
	this.returnTrajectory = function(ball){
		var center = (this.x1 + this.x2) / 2;
		var ballcenter = (ball.x1 + ball.x2) / 2;
		var maxDifference = (ball.x1 + ball.x2 + this.x1 + this.x2) / 2;
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
	ball.move();
	if (player1.isColliding(ball)){
		player1.returnTrajectory(ball);
	} else if (player2.isColliding(ball)){
		player2.returnTrajectory(ball);
	}
	
	//refresh graphics
	refreshCanvas();
};

function refreshCanvas(){
	canvas.fillStyle = 'White';
	canvas.fillRect(0,0,)
};

$(document).keydown(function(e){
	//switch statement to handle different keycodes
	switch(e.which){
		case 38:
			//arrow key up

			break;
		case 40:
			//arrow key down

			break;
	}
});
