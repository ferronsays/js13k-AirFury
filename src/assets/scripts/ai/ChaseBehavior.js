var BChase = Behavior.extend({
    run: function() {
        this.turnToFace(this.target.p);
        this.moveForward();
    }
});
