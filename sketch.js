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

// ============================================
// STORAGE
// ============================================
//
// - actor banks
//

let stars = [];
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
//

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
