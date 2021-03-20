// kaboom.debug.showArea = true;
// kaboom.debug.hoverInfo = true;

layers([
	"bg",					// background layer
	"game", 			// foreground layer
  "ui",         // ui layer
	"transition", // overlay transition layer
], "game");

getSprite("volume").slice(2, 1);

add([
	sprite("mainMenu"),
	pos(width()/2, height()/2),
	scale(2,2),
	layer("bg"),
	color(.95,.95,.95)
]);

// console.log(width());

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
	pos(width()-45,height()-15),
	layer("game"),
])

const volumeButton = add([
  sprite("volume"),
  layer("ui"),
  scale(2, 2),
  origin("topright"),
  pos(width() - 4, 4)
]);
volumeButton.frame = 1;
volumeButton.clicks(() => {
  volumeButton.frame = +!volumeButton.frame;
  volume(!volume())
});


// Positioning for the center of the startButton
const buttonCenter = pos(width()/2,(height()/2)+75)

play("bambooninja", {
  loop: true
});

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