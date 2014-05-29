$(document).ready(function () {
	
var canvas = $('#gameCanvas')[0].getContext('2d');
var width = $('#gameCanvas').width();
var height = $('#gameCanvas').height();

//timer
var timer;

//starts the game
startTimer();

//creates the ball
var ball = new Ball(width/2,height/2, 5, 3);

//array of players
var paddles = [];

//creates two new paddles on opposing sides of the field
paddles.push(new Paddle(0, 10, height/2 - 30, height/2 + 30, 'red', 87, 83, prompt("Player 1 name?")));
paddles.push(new Paddle(width-10, width, height/2 - 30, height/2 + 30, 'blue', 38, 40,  prompt("Player 2 name?")));

//ball object that gets hit around the board by the paddles with hitbox
function Ball(x, y, radius, speed){
	//gets called when the game starts and when a point is scored
	this.reset = function(){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed = speed;
		this.direction = 0;
	}

	this.reset(); //initial call at the start of the game

	//gets called every time the ball hits a paddle to make it go faster
	this.incrementSpeed = function(){
		if (this.speed < 8){
			this.speed++;
		}
	};

	this.setDirection = function(direction){
		//todo: make this compatible with more than 2pi and less than zero
		this.direction = direction;
	};

	//applies the speed and direction to the position
	this.move = function(){
		var dx = this.speed * Math.cos(this.direction);
		var dy = this.speed * Math.sin(this.direction);

		this.x += dx;
		this.y -= dy; //subtract because graphics start at top left corner
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

		if (this.y < 0){
			//colliding with top wall
			this.setDirection(2 * Math.PI - (this.direction % Math.PI));
		} else if (this.y > height){
			//colliding with bottom
			this.setDirection(Math.PI - (this.direction % Math.PI));
		} else if (this.x < 0){
			//colliding with left wall
			//left player just lost
			for (var index in paddles){
				paddles[index].reset();
			}
			ball.reset();
			paddles[1].score++;
		} else if (this.x > width){
			//colliding with right wall
			//right player just lost
			for (var index in paddles){
				paddles[index].reset();
			}
			ball.reset();
			paddles[0].score++;
		}
	};
};

//new paddle object, represents the paddle that hits the ball which the player controls
//four variables to represent each corner of the hitbox
function Paddle(x1, x2, y1, y2, color, upKeyCode, downKeyCode, name){
	this.color = color;
	this.upKeyCode = upKeyCode;
	this.downKeyCode = downKeyCode;
	this.name = name; //represents player's name
	this.score = 0;

	//called when game starts and when a ball is scored
	this.reset = function(){
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.moveArray = [];
	};

	this.reset(); //initial call at the start of the game

	//gets a ball as an input and returns true if they are colliding
	this.isColliding = function(ball){
		return (!(ball.x - ball.radius > this.x2 ||
				  ball.x + ball.radius < this.x1 ||
				  ball.y - ball.radius > this.y2 ||
				  ball.y + ball.radius < this.y1));		
	};

	//changes the direction of the ball during collision
	this.returnTrajectory = function(ball){
		var center = (this.y1 + this.y2) / 2;
		var ballcenter = ball.y;
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

function startTimer(){
	timer = setInterval(tick, 25);
};

function stopTimer(){
	clearInterval(timer);
};

//called every 25ms
function tick(){
	//move the ball
	ball.move();
	
	//check for paddle collision
	for (var index in paddles){
		var paddle = paddles[index];
		if (paddle.isColliding(ball)){
			paddle.returnTrajectory(ball);
			ball.incrementSpeed();
		}
	}

	// paddle movement
	for (var index in paddles){
		var paddle = paddles[index];
		for (var i in paddle.moveArray){
			switch(paddle.moveArray[i]){
				case 'u':
					//prevents paddle from moving off the board
					if (paddle.y1 > 0){
						paddle.y1 -= 5;
						paddle.y2 -= 5;
					}
					break;
				case 'd':
					//prevents paddle from moving off the board
					if (paddle.y2 <= height){
						paddle.y1 += 5;
						paddle.y2 += 5;
					}
					break;
				default:
					break;
			}
		}
	}

	//checks for wall collision
	ball.wallCollision();

	//refresh graphics
	paint();
};


//clears canvas and redraws graphics
function paint(){
	//background
	canvas.fillStyle = 'White';
	canvas.fillRect(0,0,width,height);

	//outline
	canvas.fillStyle = 'black';
	canvas.strokeRect(0,0,width,height);

	//draw score
	canvas.fillStyle = 'red';
	//canvas.font = 'bold 16px Arial';
	//loops through each player and draws them
	for (var index in paddles){
		var paddle = paddles[index];

		//draws paddle
		canvas.fillStyle = paddle.color;
		canvas.fillRect(paddle.x1, paddle.y1, (paddle.x2 - paddle.x1), (paddle.y2 - paddle.y1));

		//draws score
		canvas.font = '16 px Arial';
		canvas.fillText(paddle.name + ": " + paddle.score, width / 2 - 10, 18 * index + 10);
	}
	
	//draws ball
	canvas.beginPath();
	canvas.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
	canvas.fillStyle = 'black';
	canvas.fill();
};

//unused, to be removed
function refreshCanvas(){
	
	ball.move();

	//loops through each paddle and each checks for collision
	for (var index in paddles){
		var paddle = paddles[index];
		if (paddle.isColliding(ball)){
			console.log("collided");
			paddle.returnTrajectory(ball);
			ball.incrementSpeed();
		} else {
			console.log("not colliding");
		}
	}

	//checks for collision with walls
	ball.wallCollision();


	// paddle movement
	for (var index in paddles){
		var paddle = paddles[index];
		for (var i in paddle.moveArray){
			switch(paddle.moveArray[i]){
				case 'u':
					paddle.y1 -= 5;
					paddle.y2 -= 5;
					break;
				case 'd':
					paddle.y1 += 5;
					paddle.y2 += 5;
					break;
				default:
					break;
			}
		}
	}

	paint();
};

$(document).keydown(function(e){
	//loop to handle different keycodes
	for (var index in paddles){
		var paddle = paddles[index];
		if (e.which === paddle.upKeyCode){
			//moving up
			if (paddle.moveArray.indexOf('u') === -1){
				paddle.moveArray.push('u');
			}
		} else if (e.which === paddle.downKeyCode){
			//moving down
			if (paddle.moveArray.indexOf('d') === -1){
				paddle.moveArray.push('d');
			}
		}
	}
	
});

$(document).keyup(function(e){
	//loop to handle different keycodes
	for (var index in paddles){
		var paddle = paddles[index];
		if (e.which === paddle.upKeyCode){
			//up
			paddle.moveArray.splice(paddle.moveArray.indexOf('u'), 1);
		} else if (e.which === paddle.downKeyCode){
			//down
			paddle.moveArray.splice(paddle.moveArray.indexOf('d'), 1);
		}
	}
	
});


});
