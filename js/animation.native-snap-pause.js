function extend(Child, Parent) {
	var F = function() { }
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}

function Timer(callback, delay) {
	window.console.log("Timer.create " + delay);
	var remaining = delay;
	if (!remaining) {
		remaining = 0;
	};
	var paused = true, timerId, start;

	this.pause = function() {
		window.console.log("Timer.pause");
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
		paused = true;
	};

	this.resume = function() {
		if (paused && (remaining >= 0)) {
			window.console.log("Timer.resume");
			paused = false;
			start = new Date();
			timerId = window.setTimeout(callback, remaining);
		};
	};

	this.resume();
}

function DanceAnimation(id) {
	this.svg = Snap("#" + id);

	this.timeouts = [];
	this.animations = [];
	this.paused = false;

	this.clear = function() {
		window.console.log("Anim.clear");
		this.paused = false;
		this.svg.clear();

		for (var i = 0; i < this.timeouts.length; i++) {
			this.timeouts[i].pause();
		};
		while (this.timeouts.length > 0) {
			this.timeouts.pop();
		};

		for (var i = 0; i < this.animations.length; i++) {
			this.animations[i].stop();
		};
		while (this.animations.length > 0) {
			this.animations.pop();
		};
	};

	this.pause = function() {
		window.console.log("DanceAnimation.pause");
		this.paused = true;
		for (var i = 0; i < this.timeouts.length; i++) {
			window.console.log("timeout.pause");
			this.timeouts[i].pause();
		};
		for (var i = 0; i < this.animations.length; i++) {
			window.console.log("animation.pause");
			this.animations[i].pause();
		};
	};

	this.resume = function() {
		if (this.paused) {
			window.console.log("DanceAnimation.resume");
			this.paused = false;
			for (var i = 0; i < this.animations.length; i++) {
				window.console.log("animation.resume");
				this.animations[i].resume();
			};
			for (var i = 0; i < this.timeouts.length; i++) {
				window.console.log("timeout.resume");
				this.timeouts[i].resume();
			};
		};
	};

	this.initManWoman = function() {
		this.man = this.svg.polyline("0,0 15,30 30,0")
		.attr({
			id: "plane",
			fill: "Blue",
			stroke: "black",
			strokeWidth: 2,
			opacity: 0
		});

		this.woman = this.svg.polyline("0,30 15,0 30,30")
		.attr({
			id: "plane",
			fill: "DarkMagenta",
			stroke: "black",
			strokeWidth: 2,
			opacity: 0
		});

		this.animateMan = function(self) {
			return function(path, startLen, stopLen, timeLength, backward) {
				self.man.attr({opacity: 1});
				self.animations[self.animations.length] = Snap.animate(startLen, stopLen, 
					function(value) {
						movePoint = path.getPointAtLength(value);
						var angle = 90;
						if (backward) {
							angle = -angle;
						};
						self.man.transform('t' + parseInt(movePoint.x - 15) + ',' + parseInt(movePoint.y - 15) + 
							'r' + (movePoint.alpha + angle));
					}, timeLength, mina.linear);
				window.console.log(self.animations[self.animations.length - 1]);

			};
		}(this);

		this.animateWoman = function(self) {
			return function(path, startLen, stopLen, timeLength, backward) {
				self.woman.attr({opacity: 1});
				self.animations[self.animations.length] = Snap.animate(startLen, stopLen, 
					function(value) {
						movePoint = path.getPointAtLength(value);
						var angle = -90;
						if (backward) {
							angle = -angle;
						};
						self.woman.transform('t' + parseInt(movePoint.x - 15) + ',' + parseInt(movePoint.y - 15) + 
							'r' + (movePoint.alpha + angle));
					}, timeLength, mina.linear);
			};
		}(this);
	};

	this.path = function(pathStr, color, id) {
		return this.svg.path(pathStr)
		.attr({
			id: id,
			fill: "none",
			strokeWidth: "3",
			stroke: color,
			strokeMiterLimit: "10",
			strokeDasharray: "9 9"
		});
	};
	this.manPath = function(pathStr) {
		return this.path(pathStr, "Blue", "manPath");
	};
	this.womanPath = function(pathStr) {
		return this.path(pathStr, "DarkMagenta", "womanPath");
	};

	this.commonAnimation = function(seconds, manPosition, leftPath, rightPath) {
		this.svg.clear();
		if (manPosition === "left") {
			var manPath = this.manPath(leftPath);
			var womanPath = this.womanPath(rightPath);
		} else {
			var manPath = this.manPath(rightPath);
			var womanPath = this.womanPath(leftPath);
		}
		this.initManWoman();

		var manLen = manPath.getTotalLength();
		var womanLen = womanPath.getTotalLength();

		var timeLength = seconds * 1000;

		this.timeouts[this.timeouts.length] = new Timer(function(self) {
			return function() {
				self.animateMan(manPath, 0, manLen, timeLength);
				self.animateWoman(womanPath, 0, womanLen, timeLength);
			};
		}(this));	
	};
}

function GatoAnimation(id) {
	GatoAnimation.superclass.constructor.apply(this, arguments);

	this.vuelta = function(seconds, manPosition) {
		this.svg.clear();
		var vueltaPath = this.path("m 45,150 c 0,45 105,105 255,105 150,0 255,-60 255,-105 C 555,105 450,45 300,45 150,45 45,105 45,150 z",
			"Black", "vueltaPath");

		var len = vueltaPath.getTotalLength();
		window.console.log("vuelta by seconds " + seconds);

		var timeLength = seconds * 1000 / 2;

		if (manPosition === "left") {
			startPos1 = 0;
			endPos1 = len / 2;
			startPos2 = len / 2;
			endPos2 = len;
			g1 = "Blue-DarkMagenta";
			g2 = "DarkMagenta-Blue";
		} else {
			startPos1 = len / 2;
			endPos1 = len;
			startPos2 = 0;
			endPos2 = len / 2;
			g1 = "DarkMagenta-Blue";
			g2 = "Blue-DarkMagenta";
		}

		this.initManWoman();
		self = this;
		// this.timeouts[this.timeouts.length] = new Timer(function(self) {
		// 	return function() {
				self.animateMan(vueltaPath, startPos1, endPos1, timeLength);
				self.animateWoman(vueltaPath, startPos2, endPos2, timeLength);

				// self.animations[self.animations.length] = Snap.animate(0, len / 2, function(value) {
				// 	movePoint1 = vueltaPath.getPointAtLength(value + len / 6);
				// 	movePoint2 = vueltaPath.getPointAtLength(value + len / 2 + len / 6);
				// 	var g = self.svg.gradient("L(" + movePoint1.x + ", " + movePoint1.y + ", " + 
				// 		movePoint2.x + ", " + movePoint2.y + ")" + g1);
				// 	vueltaPath.attr({stroke: g});
				// }, timeLength, mina.linear);
		// 	};
		// }(this));
		
		var to1 = window.setTimeout(function(self) {
			return function() {
				window.console.log("paused by timeout " + timeLength / 4);

				for (var i = 0; i < self.animations.length; i++) {
					window.console.log("animation.pause");
					window.console.log(self.animations[i]);
					self.animations[i].pause();
				};
			}
		}(this), timeLength / 4);

		var to2 = window.setTimeout(function(self) {
			return function() {
				window.console.log("resumed by timeout " + timeLength / 2);

				for (var i = 0; i < self.animations.length; i++) {
					window.console.log("animation.resume");
					window.console.log(self.animations[i]);
					self.animations[i].resume();
				};
			}
		}(this), timeLength / 2);

		this.timeouts[this.timeouts.length] = new Timer(function(self) {
			return function() {
				self.animateMan(vueltaPath, startPos2, endPos2, timeLength);
				self.animateWoman(vueltaPath, startPos1, endPos1, timeLength);

				// self.animations[self.animations.length] = Snap.animate(0, len / 2, function(value) {
				// 	movePoint1 = vueltaPath.getPointAtLength(value + len / 6);
				// 	movePoint2 = vueltaPath.getPointAtLength(value + len / 2 + len / 6);
				// 	var g = self.svg.gradient("L(" + movePoint1.x + ", " + movePoint1.y + ", " + 
				// 		movePoint2.x + ", " + movePoint2.y + ")" + g2);
				// 	vueltaPath.attr({stroke: g});
				// }, timeLength, mina.linear);
			};
		}(this), timeLength);
	};

	this.giro = function(seconds, manPosition) {
		var leftGiro = "m 40,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 C 240,80 200,40 140,40 80,40 40,80 40,140 z";
		var rightGiro = "M 560,140 C 560,80 520,40 460,40 400,40 360,80 360,140 c 0,60 40,100 100,100 60,0 100,-40 100,-100 z";

		this.commonAnimation(seconds, manPosition, leftGiro, rightGiro);
	};

	this.zarandeo = function(seconds, manPosition) {
		var leftZarandeo = "M 40,160 140,260 240,160 140,60 z";
		var rightZarandeo = "M 560,160 460,60 360,160 460,260 z";

		this.svg.clear();
		if (manPosition === "left") {			
			var womanPath = this.womanPath(rightZarandeo);
		} else {
			var womanPath = this.womanPath(leftZarandeo);
		}
		this.initManWoman();
		if (manPosition === "left") {
			this.man.transform('t' + parseInt(40 - 15) + ',' + parseInt(160 - 15) + 'r' + (-90));
		} else {
			this.man.transform('t' + parseInt(560 - 15) + ',' + parseInt(160 - 15) + 'r' + (90));
		}
		this.man.attr({opacity: 1});

		var womanLen = womanPath.getTotalLength();

		var timeLength = seconds * 1000 / 4;

		this.timeouts[this.timeouts.length] = new Timer(function(self) {
			return function() {
				self.animateWoman(womanPath, 0, womanLen / 2, timeLength);
			};
		}(this));
		this.timeouts[this.timeouts.length] = new Timer(function(self) {
			return function() {
				self.animateWoman(womanPath, womanLen / 2, womanLen, timeLength, true);
			};
		}(this), timeLength);
		this.timeouts[this.timeouts.length] = new Timer(function(self) {
			return function() {
				self.animateWoman(womanPath, 0, womanLen / 2, timeLength);
			};
		}(this), timeLength * 2);
		this.timeouts[this.timeouts.length] = new Timer(function(self) {
			return function() {
				self.animateWoman(womanPath, womanLen / 2, womanLen, timeLength, true);
			};
		}(this), timeLength * 3);
	};

	this.mediaVuelta = function(seconds, manPosition) {
		var leftMediaVuelta = "m 40,160 c 0,50 120,120 260,120 140,0 260,-70 260,-120";
		var rightMediaVuelta = "M 560,160 C 560,110 440,40 300,40 160,40 40,110 40,160";

		this.commonAnimation(seconds, manPosition, leftMediaVuelta, rightMediaVuelta);
	};

	this.coronazion = function(seconds, manPosition) {
		var leftCoronazion = "m 40,160 c 0,40 120,60 160,60 40,0 80,-20 80,-60 0,-25 -15,-40 -40,-40 -25,0 -40,15 -40,40 0,25 15,40 40,40 25,0 40,-20 50,-40";
		var rightCoronazion = "m 560,160 c 0,-40 -120,-60 -160,-60 -40,0 -80,20 -80,60 0,25 15,40 40,40 25,0 40,-15 40,-40 0,-25 -15,-40 -40,-40 -25,0 -40,20 -50,40";

		this.commonAnimation(seconds, manPosition, leftCoronazion, rightCoronazion);
	};
};
extend(GatoAnimation, DanceAnimation);