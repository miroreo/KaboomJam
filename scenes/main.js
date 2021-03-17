// kaboom.debug.showArea = true;
// kaboom.debug.hoverInfo = true;

layers([
	"bg",					// background layer
	"game", 			// foreground layer
	"transition", // overlay transition layer
], "game");

// calculate the ratio of the background in order to cover
const bgRatio = () => {
	imgW = 120;
	imgH = 120;	
	if(width() > height() || width() == height)return width()/imgW;
	else return height()/imgH;
}

add([
	sprite("mainMenu"),
	pos(width()/2, height()/2),
	scale(bgRatio(),bgRatio()),
	layer("bg"),
	color(.95,.95,.95)
])
console.log(width());

// animated transition expanding from center out
const expandOut = (callback) => {
	const movingRect = add([
		rect(0,0),
		pos(width()/2, height()/2),
		color(0,0,0,1),
		layer("transition"),
	]);
	const steps = 60;
	const waitSecs = 0.5;
  const transitionTime = 1;
	// const stepW = width()/steps;
	// const stepH = height()/steps;
	let inTransition = false;
  let elapsedTime = 0;
	movingRect.action(() => {
		// console.log(dt()/transitionTime*width());
		if(elapsedTime >= transitionTime && !inTransition){
			wait(waitSecs, callback)
			inTransition = true;
      return;
		}
    elapsedTime += dt();
    let stepW = dt()/transitionTime*width();
    let stepH = dt()/transitionTime*height();
		movingRect.width += stepW;
		movingRect.height += stepH;
	});
	
}

var shiftFromCenter = 75;

// Draw the Title
const title = add([
	// text("Choppy Shoot!", 20),
	sprite("bambooNinja"),
	// color(.8,.9,.8),
	scale(1.5,1.5),
	pos(width()/2, (height()/2)-30),
	layer("game"),
]);

const names = add([
	sprite("authorNames"),
	pos(45,height()-15),
	layer("game"),
])


// Positioning for the center of the startButton
const buttonCenter = pos(width()/2,(height()/2)+shiftFromCenter)

// Draw the startButton
const startButton = add([
	// rect(100, 30),
	sprite("startButton"),
	buttonCenter,
	scale(1.5,1.5),
	layer("game"),
]);



mouseClick(() => {
	let m = mousePos();
	if(startButton.hasPt(m)){
		expandOut(() => {
			go("mainGame");
		})
	}
});

// bypass main screen for testing purposes
// go("mainGame");