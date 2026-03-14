// ============================================
// TURBINE CLASS
// ============================================
//
// - simple 3-blade turbine
// - spins when mouse circles around pivot
// - maintains angular velocity (omega)
// - includes a support pole that reaches the bottom
//

const TURBINE_PIVOT_SIZE = 20;
const TURBINE_GAP = TURBINE_PIVOT_SIZE * 2;

const TURBINE_PROXIMITY = 170;
const TURBINE_TORQUE = 0.015;
const TURBINE_FRICTION = 0.985;
const TURBINE_MAX_SPEED = 0.35;

const TURBINE_BLADE_RADIUS = 125;
const TURBINE_INNER_RADIUS = 50;
const TURBINE_BLADE_SIZE = 12;

let DEBUG_OMEGA = 0;

class Turbine {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.angle = random(TAU);
        this.omega = 0;

        this.prevMouseAngle = null;

    }


    // ============================================
    // UPDATE
    // ============================================
    //
    // - detect circular mouse motion around pivot
    // - convert mouse angle delta into torque
    // - apply friction and clamp speed
    //

    Update() {

        let dx = mouseX - this.x;
        let dy = mouseY - this.y;

        let dist = sqrt(dx*dx + dy*dy);

        let mouseAngle = atan2(dy, dx);

        if (dist < TURBINE_PROXIMITY) {

            if (this.prevMouseAngle !== null) {

                let delta = mouseAngle - this.prevMouseAngle;

                while (delta > PI) delta -= TAU;
                while (delta < -PI) delta += TAU;

                this.omega += delta * TURBINE_TORQUE;

            }
        }

        this.prevMouseAngle = mouseAngle;

        // apply friction
        this.omega *= TURBINE_FRICTION;

        // clamp speed
        this.omega = constrain(
            this.omega,
            -TURBINE_MAX_SPEED,
            TURBINE_MAX_SPEED
        );

        this.angle += this.omega;

        // debug
        DEBUG_OMEGA = this.omega;

    }


    // ============================================
    // DRAW
    // ============================================
    //
    // - draw pole
    // - draw pivot
    // - draw inward blades
    //

    Draw() {

        // ----------------------------------------
        // POLE
        // - small gap between pole and pivot
        // - extends to bottom of screen
        //

        stroke(255);
        strokeWeight(6);

        line(
            this.x,
            this.y + TURBINE_GAP,
            this.x,
            height
        );


        // ----------------------------------------
        // BLADES
        //

        push();

        translate(this.x, this.y);
        rotate(this.angle);

        noStroke();
        fill(255);

        for (let i = 0; i < 3; i++) {

            rotate(TAU / 3);

            triangle(
                TURBINE_BLADE_RADIUS, -TURBINE_BLADE_SIZE,
                TURBINE_BLADE_RADIUS,  TURBINE_BLADE_SIZE,
                TURBINE_INNER_RADIUS,  0
            );

        }

        pop();


        // ----------------------------------------
        // PIVOT
        //

        noStroke();
        fill(255);
        circle(this.x, this.y, TURBINE_PIVOT_SIZE);

    }

}