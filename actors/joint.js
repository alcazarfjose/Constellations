// ============================================
// JOINT CLASS
// ============================================
//
// - star1 --> joint --> star2
// - strumming STATE (oscillates back and forth while stablizing)
//

class Joint {

    constructor(star1, star2) {
        this.star1 = star1;
        this.star2 = star2;

        this.originalX = (star1.x + star2.x) / 2;
        this.originalY = (star1.y + star2.y) / 2;

        this.strumX = 0;
        this.strumY = 0;

        this.x = this.originalX;
        this.y = this.originalY;

        this.isStrumming = false;

        this.phase = 0;
        this.frequency = 1;     // speed of oscillation
        this.amplitude = 0;     // max displacement
        this.damping = 0.9;     // how quickly vibration dies out

        this.strumDirection = 0;    // start direction
    }

    Update() {

        // midpoint between stars
        this.originalX = (this.star1.x + this.star2.x) / 2;
        this.originalY = (this.star1.y + this.star2.y) / 2;

        if (this.isStrumming) {

            // advance oscillation
            this.phase += this.frequency;

            // decay amplitude
            this.amplitude *= this.damping;

            // compute oscillating offset
            let offset = sin(this.phase) * this.amplitude;

            // apply displacement perpendicular to string
            this.x = this.strumX + cos(this.strumDirection) * offset;
            this.y = this.strumY + sin(this.strumDirection) * offset;

            // recenter
            let t = constrain(this.amplitude / 50, 0, 1);
            let recenter = 0.02 + 0.08 * (1 - t);

            this.strumX = lerp(this.strumX, this.originalX, recenter);
            this.strumY = lerp(this.strumY, this.originalY, recenter);

            // stop when vibration is tiny
            if (abs(this.amplitude) < 0.1) {
                this.isStrumming = false;
                this.x = this.originalX;
                this.y = this.originalY;
            }

        } else {

            // stay centered if not vibrating
            this.x = this.originalX;
            this.y = this.originalY;

        }

    }

    Draw() {

        if (!this.star1.tickOn || !this.star2.tickOn) {return;}

        stroke(255);
        strokeWeight(1);

        line(this.star1.x, this.star1.y, this.x, this.y);
        line(this.star2.x, this.star2.y, this.x, this.y);

    }

    Strum(x, y, vx, vy) {

        console.log("STRUMMED");

        let stringLength = dist(
            this.star1.x, this.star1.y,
            this.star2.x, this.star2.y
        );

        // amplitude proportional to string length
        this.amplitude = stringLength / 40;

        // perpendicular direction to the string
        this.strumDirection =
            atan2(
                this.star2.y - this.star1.y,
                this.star2.x - this.star1.x
            ) + HALF_PI;

        // apply directionality based on the trigger movement vector (mouse or comet)
        if (vx !== undefined && vy !== undefined) {
            let dot = vx * cos(this.strumDirection) + vy * sin(this.strumDirection);
            if (dot < 0) this.amplitude *= -1;
        }

        // start at peak displacement (quarter unit circle (thanks rene))
        this.phase = HALF_PI;

        // shorter strings vibrate faster
        this.frequency = 0.25 + 100 / (stringLength + 100);

        this.isStrumming = true;

        // direction of the string
        let ABx = this.star2.x - this.star1.x;
        let ABy = this.star2.y - this.star1.y;

        // vector from star1 to mouse
        // use provided coordinates, or fallback to midpoint for non-mouse triggers
        let targetX = (x !== undefined) ? x : (vx !== undefined ? this.originalX : mouseX);
        let targetY = (y !== undefined) ? y : (vy !== undefined ? this.originalY : mouseY);

        let AMx = targetX - this.star1.x;
        let AMy = targetY - this.star1.y;

        // projection amount along the string
        let t = (AMx * ABx + AMy * ABy) / (ABx * ABx + ABy * ABy);

        // optional: clamp so the point stays between the stars
        t = constrain(t, 0, 1);

        // intersection point (foot of perpendicular)
        this.strumX = this.star1.x + ABx * t;
        this.strumY = this.star1.y + ABy * t;

        // map string length to pitch
        let rate = map(stringLength, 0, 600, 3, 0.05);
        rate = constrain(rate, 0.5, 2);

        // apply pitch
        guitarNote.rate(rate);

        // play sound
        guitarNote.play();

    }

}