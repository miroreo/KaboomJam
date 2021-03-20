const MAX_SEGMENTS = 7;
const BAMBOO_HEIGHT = 32;
const MAX_OFFSET = 5;
const MAX_CHANCE = 0.025;
const CURVE_WIDTH_SCALE = 200;
const JUMP_HEIGHT = 100;

const MAX_HEIGHT = height() - MAX_OFFSET;
const FALL_SPEED_HORIZ = 150;
const FALL_SPEED_ROTAT = 10;
let numChops = 0;
let endShowing = false;
// let tutorialComplete = localStorage.getItem('tut_complete');
let tutorialComplete = false;
let paused = false;

const debug = x => {
	console.log(x);
	return x;
}

layers([
	"bg",
	"game",
	"ui",
], "game");


loadFont("quarlow", "fonts/quarlow.png", 8, 16, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,“”‘’\"'?!@_*#$%&()+-\/:;");
loadFont("chronotype", "fonts/chronotype.png", 7, 15, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz                                 ");
loadFont("proggy", "fonts/proggy.png", 7,13);

const getChance = () => numChops < CURVE_WIDTH_SCALE / 2 
		? (2 ** (8 * numChops / CURVE_WIDTH_SCALE - 4)) / (2 / MAX_CHANCE) 
		: (2 - 2 ** (-8 * numChops / CURVE_WIDTH_SCALE + 4)) / (2 / MAX_CHANCE);

add([
	sprite("bambooWall"),
	pos(width()/2,height()/2),
	scale(2,2),
	layer("bg"),
])
class Shoot {
	constructor(xpos) {
		this.xpos = xpos;
    this.numClicks = 0;
		this.currentScaleY = 1
    this.sprites = [];
    this.addSegment();
		this.chopped = [];
	}

  addSegment() {
    this.sprites.push(add([
      sprite(this.spriteName()),
      scale(this.sprites.length % 2 * 2 - 1,1),
      rotate(0),
      pos(this.xpos, 240 - (32 * (this.sprites.length)) - 10),
      origin("bot")
    ]));
  }
	spriteName() {
		if(this.sprites.length < 1) return("bambooBottom");
		else{
			// return("bambooSprite" + (Math.ceil(random()*5)));
		return("bamboo");
		}
		 
	}
	grow() {
		this.addSegment();
	}
	tick() {
    if (this.sprites.reduce((acc, next) => acc || next.isClicked(), false)) {
      // this.numClicks++;
			
      this.trim();
    }
    if (chance(getChance()))
      this.grow();
		// if(this.chopped.length > 0) this.chopped.forEach((val, ind) => {
		// 	this.chopped[ind].pos.x += ind % 2 * 2 - 1 * FALL_SPEED_HORIZ;
		// 	this.chopped[ind].use(rotate(val.angle + ind % 2 * 2 - 1 * FALL_SPEED_ROTAT));
		// });
	}
	trim() {
		if (this.sprites.length > 1) {
      play("hit_sfx", {
        detune: rand(-200, 500)
      });
			let destroyed = this.sprites.pop();
			destroyed.use(body());
      destroyed.jump(JUMP_HEIGHT)
      let slash = add([
        sprite("slash", {
          animSpeed: 0.05
        }),
        pos(0, 0),
        scale(2, 2)
      ])
      slash.pos = destroyed.pos.clone();
      slash.play("slash", false);
      slash.onAnimEnd("slash", () => destroy(slash));
			// destroyed.use({
			// 	vel: FALL_SPEED_HORIZ*100,
			// });
      const direction = chance(0.5) * 2 - 1;
			destroyed.action(() => {
				destroyed.pos.x += FALL_SPEED_HORIZ * direction * dt();
        destroyed.angle -= FALL_SPEED_ROTAT * Math.sign(destroyed.scale.x) * direction * dt();
			});
      wait(5, () => destroy(destroyed));
			numChops++;
		}
  }
}

getSprite("slash").useAseSpriteSheet("/data/slash.json")
getSprite("volume").slice(2, 1);

let shoots = Array(5)
							.fill(null)
							.map((_, i) => new Shoot( width() / 2 - 96 + i * 48) );

const showEnd = () => {
  if (endShowing) return;
	endShowing = true;
	let high = localStorage.getItem('high_score');
	if(numChops > high){
		localStorage.setItem('high_score', numChops);
		high = numChops;
	}
	add([
		sprite("scoreScreen"),
		pos(width()/2, height()/2),
		scale(2,2),
		layer("ui"),
	]);
	add([
		text(numChops, 17),
		pos(95,140),
		color(.60,.40,.13),
		layer("ui"),
	]);
	add([
		text(high, 17),
		pos(190,140),
		color(.60,.40,.13),
		layer("ui"),
	]);
	playAgain = add([
		sprite("playAgain"),
		pos(width()/2,170),
		layer("ui"),
	])
	mouseClick(() => {
		let m = mousePos();
		if(playAgain.hasPt(m)){
			go("mainGame");
		}
	});
}
const scoreNumber = add([
	text("",6),
	origin("left"),
	color(.60,.40,.13),
	pos(2,5)
])
// showEnd();
if(!tutorialComplete){
	const tutorialSprites = [
		add([
			rect(180,150),
			pos(width()/2,height()/2),
		]),
		add([
			text("Welcome to\nBamboo Ninja!\n\nHere are 5 bamboo shoots!\nChop thembefore they break\nthrough your ceiling!\n\nThe shoots grow faster as\nyou chop them!",12, {
				font: "proggy",
				width:170,
				align: 'left'
			}),
			// font("yeet"),
			layer("ui"),
			color("#FFFFFF"),
			pos(width()/2,height()/2-10)
		]),
		add([
			sprite("panda"),
			pos(190,190),
			scale(2,2),
			layer("ui")
		])
	];
	let start = add([
		sprite("start"),
		pos(120,177),
		scale(1.5,1.5)
	])
	mouseClick(()=> {
		if(start.hasPt(mousePos())){
			tutorialSprites.forEach((val, ind) => {
				destroy(tutorialSprites[ind]);
				destroy(start);
				wait(.5, () => paused = false);
				localStorage.setItem('tut_complete', true);
			})
		}
	})
	paused = true;

}
add(["shoot-manager"]);
action("shoot-manager", _ => {
	if(!paused && !endShowing){
		scoreNumber.text = numChops;
		shoots.forEach(shoot => {
      if (shoot.sprites.length <= MAX_SEGMENTS)
        shoot.tick();
      else {
        console.log(getChance());
        showEnd();
      }
      // shoot.sprites.length <= MAX_SEGMENTS && !endShowing
      // ? shoot.tick() 
      // : showEnd();
    });
	} 
	
});

const volumeButton = add([
  sprite("volume"),
  layer("ui"),
  scale(2, 2),
  origin("topright"),
  pos(width() - 4, 4)
]);
volumeButton.frame = +!!volume();
volumeButton.clicks(() => {
  volumeButton.frame = +!volumeButton.frame;
  volume(!volume())
});