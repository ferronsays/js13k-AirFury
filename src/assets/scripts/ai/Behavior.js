var Behavior = Class.extend({
    init: function(a, t) {
        this.actor = a;
        this.target = t;
    },
    run: function() {
        //OVERRIDE THIS
    },
    turnToFace: function(point) {
        var desiredAngle = this.getAngleToPoint(point);

        var difference = AF.wrapAngle(desiredAngle - this.actor.r);

        difference = AF.clamp(difference, -this.actor.ts, this.actor.ts);
        this.actor.r = AF.wrapAngle(this.actor.r + difference);
    },
    turnAwayFrom: function(point) {
        var desiredAngle = this.getAngleToPoint(point);
        desiredAngle -= M.PI;

        var difference = AF.wrapAngle(desiredAngle - this.actor.r);

        difference = AF.clamp(difference, -this.actor.ts, this.actor.ts);
        this.actor.r = AF.wrapAngle(this.actor.r + difference / game.slomo);
    },
    getAngleToPoint: function(point) {
        var x = point.x - this.actor.p.x;
        var y = point.y - this.actor.p.y;

        return M.atan2(y, x);
    },
    moveForward: function() {
        var xD = M.cos(this.actor.r);
        var yD = M.sin(this.actor.r);
        this.actor.v.add(new V2(xD, yD).mult(0.2));
    }
});
