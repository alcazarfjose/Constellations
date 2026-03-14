// ============================================
// STAR CLASS
// ============================================
//
// - represents a single star in the sky.
// - stores position and handles its own drawing.
//

const STAR_RADIUS = 5;
const STAR_HOVER_RADIUS = 10;

class Star {

    constructor() {

        this.x = 0;
        this.y = 0;

        this.radius = STAR_RADIUS;
        this.SetRandomPosition();
    }


    // ============================================
    // set random position
    // ============================================
    //
    // - places the star somewhere on the canvas
    //

    SetRandomPosition() {

        this.x = random(width);
        this.y = random(height);

    }

    // ============================================
    // is mouse over
    // ============================================
    //
    // - checks if mouse is within hover radius
    //

    isMouseOver() {

        let d = dist(mouseX, mouseY, this.x, this.y);
        return d < STAR_HOVER_RADIUS;

    }


    // ============================================
    // draw
    // ============================================
    //
    // - renders the star
    //

    Draw() {

        noStroke();
        fill(255);
        circle(this.x, this.y, this.radius);

    }

}