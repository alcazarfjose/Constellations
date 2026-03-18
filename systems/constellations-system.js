
class ConstellationsSystem {

    constructor() {

        this.connections = [];
        this.hoveredStarIndex = null;
        this.selectedStarIndex = null;

        // - generate premade connections
        const PREMADE_MIN = 3;
        const PREMADE_MAX = 10;
        const PREMADE_MAX_DISTANCE = 300; // max pixel distance for a premade connection
        let premadeCount = floor(random(PREMADE_MIN, PREMADE_MAX + 1));
        let attempts = 0;
    }

    // ============================================
    // update
    // ============================================
    //
    // - find which star is being hovered
    //

    Update() {

        this.hoveredStarIndex = null;

        for (let i = 0; i < stars.length; i++) {
            if (stars[i].isMouseOver()) {
                this.hoveredStarIndex = i;
                break;
            }
        }
    }

    // Helper for line segment intersection
    intersects(x1, y1, x2, y2, x3, y3, x4, y4) {
        const den = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (den === 0) return false; // Parallel

        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / den;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;

        return (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1);
    }

    StrumCheck() {
        // Only check if the mouse has actually moved
        if (mouseX === pmouseX && mouseY === pmouseY) return;

        for (let i = 0; i < this.connections.length; i++) {
            let jointData = this.connections[i];

            let s1 = stars[jointData[0]];
            let s2 = stars[jointData[1]];
            let joint = jointData[2];

            // Check if mouse trajectory (prev pos to current pos) intersects the star connection
            if (this.intersects(pmouseX, pmouseY, mouseX, mouseY, s1.x, s1.y, s2.x, s2.y)) {
                // Pass mouse position and movement delta for directional strumming
                joint.Strum(mouseX, mouseY, mouseX - pmouseX, mouseY - pmouseY);
                // Removed 'break' to allow strumming multiple strings in a single fast swipe
            }
        }
    }

    JointsUpdate() {
        for (let i = 0; i < this.connections.length; i++) {

            let jointData = this.connections[i];
            let joint = jointData[2];

            joint.Update();
            joint.Draw();
        }
    }

    // ============================================
    // draw
    // ============================================
    //
    // - draw connections
    // - draw hover glow
    // - draw drag line
    //

    Draw() {

        // draw hover glow
        if (this.hoveredStarIndex !== null) {
            const star = stars[this.hoveredStarIndex];
            noStroke();
            fill(255, 50);
            circle(star.x, star.y, STAR_HOVER_RADIUS * 2);
        }

        // draw drag line
        if (this.selectedStarIndex !== null) {
            const star = stars[this.selectedStarIndex];
            
            // default white (dragging in voidddddd..... o_o)
            let r = 255, g = 255, b = 255;

            if (this.hoveredStarIndex !== null && this.hoveredStarIndex !== this.selectedStarIndex) {
                const start = this.selectedStarIndex;
                const end = this.hoveredStarIndex;
                let exists = false;
                 for (let i = 0; i < this.connections.length; i++) {
                    const conn = this.connections[i];
                    if ((conn[0] === start && conn[1] === end) || (conn[0] === end && conn[1] === start)) {
                        exists = true;
                        break;
                    }
                }

                if (exists) {
                    r = 255; g = 0; b = 0; // red del
                } else {
                    r = 0; g = 255; b = 0; // green create
                }
            }

            stroke(r, g, b);

            strokeWeight(2);
            drawingContext.setLineDash([10, 10]);
            line(star.x, star.y, mouseX, mouseY);
            drawingContext.setLineDash([]);
        }
    }

    // ============================================
    // mouse pressed
    // ============================================
    //
    // - select a star to start a connection
    //

    handleMousePressed() {
        if (this.hoveredStarIndex !== null) {
            this.selectedStarIndex = this.hoveredStarIndex;
        }

    }

    // ============================================
    // mouse released
    // ============================================
    //
    // - complete or remove a connection
    //

    handleMouseReleased() {

        if (this.selectedStarIndex !== null && this.hoveredStarIndex !== null && this.selectedStarIndex !== this.hoveredStarIndex) {

            const start = this.selectedStarIndex;
            const end = this.hoveredStarIndex;

            // - check if connection exists
            let foundIndex = -1;
            for (let i = 0; i < this.connections.length; i++) {
                const conn = this.connections[i];
                if ((conn[0] === start && conn[1] === end) || (conn[0] === end && conn[1] === start)) {
                    foundIndex = i;
                    break;
                }
            }

            if (foundIndex !== -1) {
                // - remove existing connection
                this.connections.splice(foundIndex, 1);
            } else {
                // - add new connection
                let newJoint = new Joint(stars[start], stars[end]);
                this.connections.push([start, end, newJoint, ]);
            }
        }

        this.selectedStarIndex = null;

    }
}