
class SparkleSystem {

    constructor(max) {

        this.index_curr = 0;
        this.index_max = max - 1;

    }

    Update() {

        if (abs(turbine.omega) > SPARKLE_OMEGA_MIN) {

            if (frameCount % SPARKLE_SPEED === 0) {

                this.index_curr++;

                if (this.index_curr > this.index_max) {
                    this.index_curr = 0;
                }

                stars[this.index_curr].SetRandomPosition();
            }
        }
    }
}