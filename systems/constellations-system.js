
class ConstellationsSystem {

    constructor() {

        this.connections = [];
        this.hoveredStarIndex = null;
        this.selectedStarIndex = null;

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

    // ============================================
    // draw
    // ============================================
    //
    // - draw connections
    // - draw hover glow
    // - draw drag line
    //

    Draw() {

        // - draw connections
        stroke(255);
        strokeWeight(1);

        for (let i = 0; i < this.connections.length; i++) {
            const conn = this.connections[i];
            const star1 = stars[conn[0]];
            const star2 = stars[conn[1]];

            //get offset
            let offset = 0;
            line(star1.x, star1.y, star2.x, star2.y);
        }

        // - draw hover glow
        if (this.hoveredStarIndex !== null) {
            const star = stars[this.hoveredStarIndex];
            noStroke();
            fill(255, 50);
            circle(star.x, star.y, STAR_HOVER_RADIUS * 2);
        }

        // - draw drag line
        if (this.selectedStarIndex !== null) {
            const star = stars[this.selectedStarIndex];
            let imminentDelete = false;
            if (this.hoveredStarIndex !== null) {
                const start = this.selectedStarIndex;
                const end = this.hoveredStarIndex;
                 for (let i = 0; i < this.connections.length; i++) {
                    const conn = this.connections[i];
                    if ((conn[0] === start && conn[1] === end) || (conn[0] === end && conn[1] === start)) {
                        imminentDelete = true;
                        break;
                    }
                }
            }

            stroke(imminentDelete ? 255: 0, 0, imminentDelete ? 0: 255);

            strokeWeight(2);
            line(star.x, star.y, mouseX, mouseY);
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
                this.connections.push([start, end]);
            }
        }

        this.selectedStarIndex = null;

    }
}