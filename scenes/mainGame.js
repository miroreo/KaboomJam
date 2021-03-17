const MAX_SEGMENTS = 7;
const BAMBOO_HEIGHT = 32;
const MAX_OFFSET = 5;
const MAX_CHANCE = 1 / 0.075;
const CURVE_WIDTH_SCALE = 75;

const MAX_HEIGHT = height() - MAX_OFFSET;
let numChops = 0;

const getChance = () => numChops < CURVE_WIDTH_SCALE / 2 
		? (2 ** (8 * numChops / CURVE_WIDTH_SCALE - 4)) / (2 * MAX_CHANCE) 
		: (2 - 2 ** (-8 * numChops / CURVE_WIDTH_SCALE + 4)) / (2 * MAX_CHANCE);

class Shoot {
	constructor(xpos) {
		this.xpos = xpos;
    this.numClicks = 0;
		this.currentScaleY = 1
		this.scaleBamboo();
    this.sprites = [];
    this.addSegment();
	}
	scaleBamboo() {
		if(MAX_HEIGHT / MAX_SEGMENTS > BAMBOO_HEIGHT){
			this.currentScaleY = (MAX_HEIGHT / MAX_SEGMENTS) / BAMBOO_HEIGHT;
		}
	}

  addSegment() {
    this.sprites.push(add([
      sprite("bamboo"),
      scale(2, this.currentScaleY),
      pos(this.xpos, height() - (BAMBOO_HEIGHT * this.currentScaleY * (this.sprites.length))),
      origin("bot")
    ]));
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
	}
	trim() {
		if (this.sprites.length > 1) {
			destroy(this.sprites.pop());
			numChops++;
		}
  }
}

const debug = x => {
	console.log(x);
	return x;
}

let shoots = Array(5)
							.fill(null)
							.map((_, i) => new Shoot( width() / 2 - 96 + i * 48) );

add(["shoot-manager"]);
action("shoot-manager", _ => {
	shoots.forEach(shoot => {
		shoot.tick();
		if(shoot.sprites.length > MAX_SEGMENTS) {
			go("endScreen", {
				win: false,
				score: numChops,
			});
		};
	});
});
