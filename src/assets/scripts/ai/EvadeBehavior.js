var BEvade = Behavior.extend({
    run: function() {
        this.turnAwayFrom(this.target.p);
        this.moveForward();
    }
});
