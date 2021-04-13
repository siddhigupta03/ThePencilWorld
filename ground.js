class Ground {
    constructor() {
        var options = {
            isStatic:true
        }
        this.body = Bodies.rectangle(displayWidth/2,displayHeight/1+90,displayWidth/0.02,displayHeight/35,options);
        this.w = displayWidth/5;
        this.h = displayHeight/5
        this.img = loadImage("images/ground.png");
        World.add(world, this.body);
    }
    display() {
        var pos  = this.body.position;
        imageMode(CENTER);
        image(this.img,pos.x,pos.y,200000,500); 
    }
}

