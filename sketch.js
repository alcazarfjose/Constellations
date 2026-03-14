// ============================================
// WHAT'S NEXT?
// ============================================
//
// - first and foremost: PLAYTEST, fern!
// - also, clean up code. get rid of unnecessary files. modularize systems.
// - the juice
// - generative and mesmerizing art with the alignment of the stars
// - sparkly audio layers
// - juicy and animated feedback
// - post-processing
// - comet sounds
// - BIG ONE: more expressive randomization and math with personality
// 

// ============================================
// KNOBS
// ============================================
//
// - tweak interaction + physics
// - note to fern: bring the other knobs in here--have em in one spot
//

let DEBUG_MODE_ACTIVE = false;

const NUMSTARS = 120;
const SPARKLE_SPEED = 2;
const SPARKLE_OMEGA_MIN = 0.15;

const NUMCOMETS = 50;
const COMET_WAIT_MIN = 1000;
const COMET_MAX_WAIT = 10000;

const METEOR_SHOWER_CHANCE = 0.03;       // 3 per cent chance to trigger shower on every comet spawn
const METEOR_SHOWER_INTENSITY_MIN = 50;  // milliseconds between comets during shower
const METEOR_SHOWER_INTENSITY_MAX = 200;
const METEOR_SHOWER_DURATION = 6000;     // how long the shower lasts (ms)

// ============================================
// STORAGE
// ============================================
//
// - actor banks
//

let stars = [];
let comets = [];
let nextCometTime = 0;
let isMeteorShower = false;
let meteorShowerEndTime = 0;
let turbine;

// ============================================
// SYSTEMS
// ============================================
//
// - core loop systems
//

let sparkleSystem;
let constellationsSystem;

// ============================================
// SETUP
// ============================================
//
// - create stars
// - create turbine
// - preload sounds
//

let guitarNote;
let filter;

function preload() {
  guitarNote = loadSound("./assets/audio/c-note-guitar.mp3");
}

function setup() {

    createCanvas(window.innerWidth, window.innerHeight);

    for (let i = 0; i < NUMSTARS; i++) {

        let star = new Star();
        stars.push(star);

    }

    for (let i = 0; i < NUMCOMETS; i++) {
        comets.push(new Comet());
    }

    nextCometTime = millis() + random(COMET_WAIT_MIN, COMET_MAX_WAIT);

    turbine = new Turbine(
        width - 200,
        height - 200
    );

    debugUI = new DebugMode();

    // systems
    
    sparkleSystem = new SparkleSystem(stars.length-1);
    constellationsSystem = new ConstellationsSystem();

    // audio

    filter = new p5.LowPass();
    filter.freq(6000);
    guitarNote.disconnect();
    guitarNote.connect(filter);

}


// ============================================
// DRAW
// ============================================
//
// - draw starfield
// - update + draw turbine
//

function draw() {

    background(0);

    for (let star of stars) {

        star.Draw();

    }

    // check if meteor shower has concluded
    if (isMeteorShower && millis() > meteorShowerEndTime) {
        isMeteorShower = false;
    }

    // comet spawning logic
    if (millis() > nextCometTime) {
        let inactive = comets.find(c => !c.active);
        if (inactive) {
            inactive.Activate();
        }

        // roll for a meteor shower trigger if one isn't already active
        if (!isMeteorShower && random() < METEOR_SHOWER_CHANCE) {
            isMeteorShower = true;
            meteorShowerEndTime = millis() + METEOR_SHOWER_DURATION;
        }

        // calculate next wait time based on whether we are in a shower
        let waitMin = isMeteorShower ? METEOR_SHOWER_INTENSITY_MIN : COMET_WAIT_MIN;
        let waitMax = isMeteorShower ? METEOR_SHOWER_INTENSITY_MAX : COMET_MAX_WAIT;

        nextCometTime = millis() + random(waitMin, waitMax);
    }

    for (let comet of comets) {
        comet.Update();
        comet.Draw();
    }

    turbine.Update();
    turbine.Draw();

    constellationsSystem.Update();
    constellationsSystem.Draw();
    constellationsSystem.JointsUpdate();
    constellationsSystem.StrumCheck();
    sparkleSystem.Update();

    debugUI.Draw();

}

// mousey-mousey

function mousePressed() {
    constellationsSystem.handleMousePressed();
}

function mouseReleased() {
    constellationsSystem.handleMouseReleased();
}

function keyPressed() {
    if (key === 'd' || key === 'D') {
        DEBUG_MODE_ACTIVE = !DEBUG_MODE_ACTIVE;
    }
}
