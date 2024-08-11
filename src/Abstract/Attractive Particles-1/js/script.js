window.onload = function() {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var pi = Math.PI;

	var centerX, centerY;
	var part_num = 2000;

	var mousedown = false;
	var X, Y;
	/*===========================================================================*/

	/*===========================================================================*/
	var P = [];
	var part = function(x, y, vx, vy, r, red, green, blue, alpha, col) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.r = r;
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;
		this.col = col;
	};

	function rand(min, max) {
		return Math.random() * (max - min) + min;
	}

	function dist(dx, dy) {
		return Math.sqrt(dx * dx + dy * dy);
	}

	function size() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		centerX = canvas.width / 2;
		centerY = canvas.height / 2;
	}
	size();
	X = centerX;
	Y = centerY;

	function init() {
		var x, y, vx, vy, r, red, green, blue, alpha, col;
		for (var i = 0; i < part_num; i++) {
			x = rand(0, canvas.width);
			y = rand(0, canvas.height);
			vx = rand(-1, 1);
			vy = rand(-1, 1);
			r = rand(1, 3);
			red = Math.round(rand(150, 200));
			green = Math.round(rand(100, 255));
			blue = Math.round(rand(180, 255));
			alpha = 1;
			col = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";

			P.push(new part(x, y, vx, vy, r, red, green, blue, alpha, col));
		}
	}

	function bg() {
		ctx.fillStyle = "rgba(25,25,30,1)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		//ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function bounce(b) {

		if (b.x < b.r) {
			b.x = b.r;
			b.vx *= -1;
		}
		if (b.x > canvas.width - b.r) {
			b.x = canvas.width - b.r;
			b.vx *= -1;
		}

		if (b.y - b.r < 0) {
			b.y = b.r;
			b.vy *= -1;
		}
		if (b.y > canvas.height - b.r) {
			b.y = canvas.height - b.r;
			b.vy *= -1;
		}
	}

	function attract(p) {

		var dx = (p.x - X),
			dy = (p.y - Y),
			dist = Math.sqrt(dx * dx + dy * dy),
			angle = Math.atan2(dy, dx);

		if (dist > 10 && dist < 300) {
			if (!mousedown) {
				p.vx -= (20 / (p.r * dist)) * Math.cos(angle);
				p.vy -= (20 / (p.r * dist)) * Math.sin(angle);
			} else if (mousedown) {
				p.vx += (250 / (p.r * dist)) * Math.cos(angle);
				p.vy += (250 / (p.r * dist)) * Math.sin(angle);
			}
		}

	}

	function draw() {
		var p;
		for (var i = 0; i < P.length; i++) {
			p = P[i];

			if (mouseover) attract(p);
			bounce(p);

			p.x += p.vx;
			p.y += p.vy;

			p.vx *= .975;
			p.vy *= .975;

			ctx.fillStyle = p.col;
			ctx.fillRect(p.x, p.y, p.r, p.r);
			//ctx.beginPath();
			//ctx.fillStyle = p.col;
			//ctx.arc(p.x, p.y, p.r, 0, 2 * pi);
			//ctx.fill();


		}
		//ctx.strokeStyle = (!mousedown) ? "rgba(255,255,255,1)" : "rgba(255,0,0,1)";

		// ctx.beginPath();
		// ctx.moveTo(X, Y - 10);
		// ctx.lineTo(X, Y + 10);
		// ctx.moveTo(X - 10, Y);
		// ctx.lineTo(X + 10, Y);
		// ctx.stroke();

	}

	function loop() {
		bg();
		draw();

		window.requestAnimationFrame(loop);
	}

	window.onresize = size;

	window.onmousemove = function(e) {
		X = e.clientX;
		Y = e.clientY;
	}

	window.onmousedown = function() {
		mousedown = true;
	}

	window.onmouseup = function() {
		mousedown = false;
	}

	var mouseover = false;

	window.onmouseover = function() {
		mouseover = true;
	}

	window.onmouseout = function() {
		mouseover = false;
	}

	init();
	loop();
}