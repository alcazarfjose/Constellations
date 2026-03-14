// ============================================
// KNOBS
// ============================================
//
// - tweak interaction + physics
//

const DEBUG_MODE_ACTIVE = true;

const NUMSTARS = 120;
const SPARKLE_SPEED = 2;
const SPARKLE_OMEGA_MIN = 0.15;

const NUMCOMETS = 50;

// ============================================
// STORAGE
// ============================================
//
// - actor banks
//

let stars = [];
let comets = []
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

    turbine.Update();
    turbine.Draw();

    constellationsSystem.Update();
    constellationsSystem.Draw();
    constellationsSystem.JointsUpdate();
    constellationsSystem.StrumCheck();
    sparkleSystem.Update();

    debugUI.Draw();

}

// ============================================
// MOUSE EVENTS
// ============================================

function mousePressed() {
    constellationsSystem.handleMousePressed();
}

function mouseReleased() {
    constellationsSystem.handleMouseReleased();
}
