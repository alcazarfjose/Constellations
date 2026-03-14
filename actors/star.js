// ============================================
// STAR CLASS
// ============================================

const STAR_RADIUS = 5;
const STAR_HOVER_RADIUS = 10;
const STAR_RADIUS_MIN = 2;
const STAR_RADIUS_MAX = 6;
const STAR_ANIMS_SPEED = 3;

class Star {

    constructor() {

        this.x = 0;
        this.y = 0;

        this.radius = random(STAR_RADIUS_MIN, STAR_RADIUS_MAX);
        this.currRadius = 0;

        // number of nebula blobs around this star
        this.glowBlobs = floor(random(8, 14));

        // --- nebula color palette (milky way inspired) ---
        const palette = [
            color(120, 140, 255),  // blue
            color(160, 120, 255),  // violet
            color(200, 120, 255),  // magenta
            color(255, 150, 200),  // pink nebula
            color(255, 190, 140),  // warm orange dust
            color(120, 200, 255)   // cyan glow
        ];

        this.glowColor = random(palette);

        this.SetRandomPosition();
    }

    // ============================================

    SetRandomPosition() {

        this.x = random(width);
        this.y = random(height);

        this.currRadius = 0;

    }

    // ============================================

    isMouseOver() {

        let d = dist(mouseX, mouseY, this.x, this.y);
        return d < STAR_HOVER_RADIUS;

    }

    // ============================================

    Draw() {

        noStroke();

        // --- nebula ooooooooooooooo ---
        for (let i = 0; i < this.glowBlobs; i++) {

            let seed = this.x * 0.01 + this.y * 0.01 + i * 10;

            let angle = noise(seed) * TWO_PI;
            let distOffset = noise(seed + 5) * this.currRadius * 20;

            let gx = this.x + cos(angle) * distOffset;
            let gy = this.y + sin(angle) * distOffset;

            let r = this.currRadius * random(15, 50);

            fill(
                red(this.glowColor),
                green(this.glowColor),
                blue(this.glowColor),
                2
            );

            circle(gx, gy, r);

        }

        // --- star dot ---
        fill(255);

        this.currRadius = lerp(
            this.currRadius,
            this.radius,
            (deltaTime / 1000) * STAR_ANIMS_SPEED
        );

        circle(this.x, this.y, this.currRadius);

    }

}