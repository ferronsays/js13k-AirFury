var Camera = Class.extend({

    init: function(g) {
        var t = this;

        t.dist = 200;
        t.targetDistance = 1600;

        t.lookat = new V2();
        t.c = g.c;
        t.fov = M.PI / 4.0;
        t.vp = {
            l: 0,
            r: 0,
            t: 0,
            b: 0,
            w: 0,
            h: 0,
            scale: new V2(1, 1)
        };

        t.bounds = g.bounds;

        t.lerp = true;
        t.lerpD = 0.04;

        t.shake = 0;
        t.stepVp(0);
    },
    begin: function() {
        this.c.save();
        this.scale();
        this.translate();
    },
    end: function() {
        this.c.restore();
    },
    scale: function() {
        this.c.scale(this.vp.scale.x, this.vp.scale.y);
    },
    translate: function() {
        this.c.translate(-this.vp.l, -this.vp.t);
    },
    step: function(dt) {
        var t = this;
        t.shake = M.max(t.shake - dt, 0);
        t.zoomTo(t.dist + (t.targetDistance - t.dist) * 0.05);
    },
    stepVp: function(dt) {
        var t = this;
        t.aspectRatio = t.c.canvas.width / t.c.canvas.height;
        t.vp.w = t.dist * M.tan(t.fov);
        t.vp.h = t.vp.w / t.aspectRatio;
        t.vp.l = t.lookat.x - (t.vp.w / 2.0);
        t.vp.t = t.lookat.y - (t.vp.h / 2.0);

        // TODO magic numbers for space
        t.vp.scale.x = 800 / t.vp.w;
        t.vp.scale.y = 500 / t.vp.h;

        t.lockBounds();

        if (t.shake > 0) {
            t.vp.l += AF.randPN() * 4;
            t.vp.t += AF.randPN() * 4;
        }

        t.vp.r = t.vp.l + t.vp.w;
        t.vp.b = t.vp.t + t.vp.h;

    },
    zoomTo: function(z) {
        this.dist = z;
        this.stepVp();
    },
    moveTo: function(x, y) {
        var t = this;
        if (t.lerp) {
            t.lookat.x -= (t.lookat.x - x) * t.lerpD;
            t.lookat.y -= (t.lookat.y - y) * t.lerpD;
        } else {
            t.lookat.x = x;
            t.lookat.y = y;
        }

        t.stepVp();
    },
    lockBounds: function() {
        var t = this;
        t.vp.l = AF.clamp(t.vp.l, t.bounds.l, t.bounds.r - t.vp.w);
        t.vp.t = AF.clamp(t.vp.t, t.bounds.t, t.bounds.b - t.vp.h);
    },
    screenToWorld: function(x, y, obj) {
        obj = obj || {};
        obj.x = (x / this.vp.scale.x) + this.vp.l;
        obj.y = (y / this.vp.scale.y) + this.vp.t;
        return obj;
    },
    worldToScreen: function(x, y, obj) {
        obj = obj || {};
        obj.x = (x - this.vp.l) * (this.vp.scale.x);
        obj.y = (y - this.vp.t) * (this.vp.scale.y);
        return obj;
    }
});
