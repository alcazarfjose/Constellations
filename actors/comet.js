class Comet {

    constructor() {
        this.active = false;
        this.startX = 0;
        this.startY = 0;
        this.distProgress = 0;
        
        this.speed = 12;
        this.maxTravel = 150; 
        this.tailMaxLen = 40;
    }

    Activate() {
        this.startX = random(width);
        this.startY = random(height);
        this.distProgress = 0;
        this.maxTravel = random(100, 300); // short distance
        this.active = true;

        // Check for intersections with existing constellation joints
        const cos45 = 0.7071;
        const endX = this.startX + this.maxTravel * cos45;
        const endY = this.startY + this.maxTravel * cos45;

        for (let conn of constellationsSystem.connections) {
            const s1 = stars[conn[0]];
            const s2 = stars[conn[1]];
            const joint = conn[2];

            if (this.intersects(
                this.startX, this.startY, endX, endY, 
                s1.x, s1.y, s2.x, s2.y
            )) {
                joint.Strum();
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

    Update() {
        if (!this.active) return;

        this.distProgress += this.speed;

        // Turn off when the tail has also finished its travel
        if (this.distProgress - this.tailMaxLen > this.maxTravel) {
            this.active = false;
        }
    }

    Draw() {
        if (!this.active) return;

        // head stops moving at its destination
        let headDist = min(this.distProgress, this.maxTravel);
        // tail start lags behind the head
        let tailDist = max(0, this.distProgress - this.tailMaxLen);
        // clamp tail start to the head's final position to shorten the tail
        tailDist = min(tailDist, headDist);

        // 45 degrees down-right (PI/4)
        const cos45 = 0.7071;

        let hX = this.startX + headDist * cos45;
        let hY = this.startY + headDist * cos45;
        let tX = this.startX + tailDist * cos45;
        let tY = this.startY + tailDist * cos45;

        // Solid red line trail
        stroke(255, 0, 0);
        strokeWeight(2);
        line(tX, tY, hX, hY);

        // Comet Head (small red dot)
        noStroke();
        fill(255, 0, 0);
        circle(hX, hY, 4);
    }
}