function ChacareraCadenaAnimation(id) {
	ChacareraCadenaAnimation.superclass.constructor.apply(this, arguments);


	this.CadenaElement = new FourDanceAnimationElement(this,
		{left: "m 50,130 c 0,30 170,30 170,30 l 200,0 0,120 -400,0 c 0,0 0,0 0,-60 0,-60 30,-90 30,-90",
		right: "m 390,130 c 0,-30 -170,-30 -170,-30 l -140,0 0,240 280,0 c 0,0 0,-60 0,-120 0,-60 30,-90 30,-90"},
		{left: "m 50,310 c 0,30 170,30 170,30 l 140,0 0,-240 -280,0 c 0,0 0,60 0,120 0,60 -30,90 -30,90",
		right: "m 390,310 c 0,-30 -170,-30 -170,-30 l -200,0 0,-120 400,0 c 0,0 0,0 0,60 0,60 -30,90 -30,90"});

	this.CadenaVisualPath = "m 50,310 340,0 0,-180 -340,0 z";

	this.vuelta = function(seconds, manPosition, times) {		
		this.CadenaPath = this.path(this.CadenaVisualPath, "black");

		this.CadenaElement.drawPath(manPosition, true);
		this.CadenaElement.startAnimation(seconds, times);

		var partSeconds = seconds / 8;
		var partTimes = times / 8;
		// this.CadenaElement.startAnimation(partSeconds * 2, partTimes * 2, this.DIRECTION_FORWARD, partSeconds * 0, 0, 1/6);
		// this.CadenaElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 2, 1/6, 2/6);
		// this.CadenaElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 3, 2/8, 3/8);
		// this.CadenaElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 4, 3/8, 4/8);
		// this.CadenaElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 5, 4/8, 5/8);
		// this.CadenaElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 6, 5/8, 6/8);
		// this.CadenaElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 7, 6/8, 7/8);
		// this.CadenaElement.startAnimation(partSeconds, partTimes, this.DIRECTION_FORWARD, partSeconds * 8, 7/8, 8/8);
	}
};
extend(ChacareraCadenaAnimation, Chacarera4Animation);