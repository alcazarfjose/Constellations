// ============================================
// AMBIENT AUDIO SYSTEM
// ============================================

class AmbientAudioSystem {

    constructor(stars, turbine) {

        this.stars = stars;
        this.turbine = turbine;

        // --- NOISE LAYER ---
        this.noise = new p5.Noise('pink');
        this.noise.amp(0.05);

        this.noiseFilter = new p5.LowPass();
        this.noiseFilter.freq(800);

        this.noise.disconnect();
        this.noise.connect(this.noiseFilter);

        this.reverb = new p5.Reverb();
        this.reverb.process(this.noiseFilter, 6, 2);

        this.noise.start();

        // --- DRONE LAYER ---
        this.osc1 = new p5.Oscillator('sine');
        this.osc2 = new p5.Oscillator('sine');

        this.osc1.amp(0.02);
        this.osc2.amp(0.015);

        this.osc1.start();
        this.osc2.start();

    }

    Update() {

        // --- STAR-BASED PITCH ---
        let avgDist = 0;

        for (let i = 0; i < this.stars.length - 1; i++) {
            let a = this.stars[i];
            let b = this.stars[i + 1];
            avgDist += dist(a.x, a.y, b.x, b.y);
        }

        avgDist /= this.stars.length;

        // map to low frequency range
        let baseFreq = map(avgDist, 0, width, 60, 120);

        this.osc1.freq(baseFreq);
        this.osc2.freq(baseFreq * 1.5);

        // --- TURBINE → FILTER BRIGHTNESS ---
        let cutoff = map(this.turbine.omega, 0, 2, 500, 3000);
        this.noiseFilter.freq(cutoff);

        // --- VERY SUBTLE BREATHING ---
        let t = millis() * 0.0002;
        let breath = map(noise(t), 0, 1, 0.03, 0.07);
        this.noise.amp(breath);

    }

}