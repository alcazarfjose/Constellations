// ============================================
// STAR CLASS
// ============================================

const STAR_RADIUS = 5;
const STAR_HOVER_RADIUS = 10;
const STAR_RADIUS_MIN = 2;
const STAR_RADIUS_MAX = 6;
const STAR_ANIMS_SPEED = 3;
const STAR_REPOS_RADIUS = 100;

class Star {

    constructor() {

        this.x = -500;
        this.y = -500;

        this.tickOn = false;

        this.radius = random(STAR_RADIUS_MIN, STAR_RADIUS_MAX);
        this.currRadius = 0;

        // shimmer properties
        this.shimmerOffset = random(1000);
        this.shimmerSpeed = random(10, 15);
        this.shimmerAmount = random(0.1, 0.45);

        // number of nebula blobs
        this.glowBlobs = floor(random(8, 14));

        const palette = [
            color(120, 140, 255),
            color(160, 120, 255),
            color(200, 120, 255),
            color(255, 150, 200),
            color(255, 190, 140),
            color(120, 200, 255)
        ];

        this.glowColor = random(palette);
    }

    // ============================================

    SetRandomPosition() {

        if (!this.tickOn) {
            this.x = random(width);
            this.y = random(height);
            this.currRadius = 0;
            
            this.tickOn = true;

            // connect to nearby active stars
            const MAX_DIST = 300;

            let neighbors = [];

            // find neightbors
            for (let i = 0; i < stars.length; i++) {
                let other = stars[i];
                if (other !== this && other.tickOn) {
                    let d = dist(this.x, this.y, other.x, other.y);
                    if (d < MAX_DIST) {
                        neighbors.push({ index: i, dist: d });
                    }
                }
            }

            neighbors.sort((a, b) => a.dist - b.dist);

            if (constellationsSystem.connections.length >= 10) { 
                return;
            }

            let myIndex = stars.indexOf(this);
            for (let i = 0; i < neighbors.length; i++) {
                
                let targetIdx = neighbors[i].index;
                let exists = constellationsSystem.connections.some(c => (c[0] === myIndex && c[1] === targetIdx) || (c[0] === targetIdx && c[1] === myIndex));

                if (!exists) {
                    let newJoint = new Joint(this, stars[targetIdx]);
                    constellationsSystem.connections.push([myIndex, targetIdx, newJoint]);
                }

            }

            return;

        }

        let dispX = random(-STAR_REPOS_RADIUS, STAR_REPOS_RADIUS);
        let dispY = random(-STAR_REPOS_RADIUS, STAR_REPOS_RADIUS);

        this.x += dispX;
        this.y += dispY;

        this.x = constrain(this.x, 0, width);
        this.y = constrain(this.y, 0, height);

    }

    // ============================================

    isMouseOver() {

        let d = dist(mouseX, mouseY, this.x, this.y);
        return d < STAR_HOVER_RADIUS;

    }

    // ============================================

    Draw() {

        noStroke();

        // --- shimmer calculation ---
        let t = millis() * 0.001 * this.shimmerSpeed + this.shimmerOffset;
        let shimmer = noise(t);

        // map shimmer to subtle radius + brightness variation
        let shimmerRadius = this.currRadius * (1 + shimmer * this.shimmerAmount);
        let shimmerAlpha = 200 + shimmer * 55;

        // --- nebula blobs ---
        for (let i = 0; i < this.glowBlobs; i++) {

            let seed = this.x * 0.01 + this.y * 0.01 + i * 10;

            let angle = noise(seed) * TWO_PI;
            let distOffset = noise(seed + 5) * shimmerRadius * 20;

            let gx = this.x + cos(angle) * distOffset;
            let gy = this.y + sin(angle) * distOffset;

            let r = shimmerRadius * random(15, 50);

            fill(
                red(this.glowColor),
                green(this.glowColor),
                blue(this.glowColor),
                2
            );

            circle(gx, gy, r);

        }

        // --- star core ---
        this.currRadius = lerp(
            this.currRadius,
            this.radius,
            (deltaTime / 1000) * STAR_ANIMS_SPEED
        );

        fill(255, shimmerAlpha);
        circle(this.x, this.y, shimmerRadius);

    }

}