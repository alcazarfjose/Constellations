class Joint {

    constructor(star1, star2) {
        this.star1 = star1;
        this.star2 = star2;

        this.x = (star1.x + star2.x) / 2;
        this.y = (star1.y + star2.y) / 2;
    }

    Update() {
    
    }

    Draw() {

        stroke(255);
        strokeWeight(1);
        line(this.star1.x, this.star1.y, this.x, this.y);
        line(this.star2.x, this.star2.y, this.x, this.y);
        
    }

}