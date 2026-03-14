
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

    isNearLine(x1, y1, x2, y2, mx, my) {
        let d = dist(x1, y1, x2, y2);
        let offset = dist(x1, y1, mx, my) + dist(x2, y2, mx, my);
        return offset >= d - 1 && offset <= d + 1; // Adjust tolerance as needed
    }

    StrumCheck() {

        for (let i = 0; i < this.connections.length; i++) {
            let jointData = this.connections[i];

            let start = jointData[0];
            let end = jointData[1];
            let joint = jointData[2];

            if (this.isNearLine(stars[start].x, stars[start].y, stars[end].x, stars[end].y, mouseX, mouseY)) {
                joint.Strum();
                break;
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
                let newJoint = new Joint(stars[start], stars[end]);
                this.connections.push([start, end, newJoint, ]);
            }
        }

        this.selectedStarIndex = null;

    }
}