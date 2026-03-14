class DebugMode {

    constructor() {

    }

    Draw() {
        
        if (!DEBUG_MODE_ACTIVE) return;

        // - display sparkle ratio
        noStroke();
        fill(255);
        textSize(16);
        text(`${sparkleSystem.index_curr} / ${sparkleSystem.index_max}`, 15, 25);
        text(`OMEGE: ${DEBUG_OMEGA}`, 15, 65);

    }

}