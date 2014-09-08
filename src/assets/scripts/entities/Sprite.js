var Sprite = GameObject.extend({
    init: function(args) {
        this._super(args);

        AF.extend(this, args);

        this.cfg = {
            'p1': {
                oX: 0,
                oY: 0,
                w: 34,
                h: 10,
                dO: 0
            },
            'p2': {
                oX: 0,
                oY: 11,
                w: 34,
                h: 16,
                dO: 0
            },
            'p3': {
                oX: 0,
                oY: 28,
                w: 34,
                h: 24,
                dO: 0
            },
            'p4': {
                oX: 0,
                oY: 53,
                w: 34,
                h: 32,
                dO: 0
            },
            'p5': {
                oX: 0,
                oY: 86,
                w: 34,
                h: 36,
                dO: 0
            },
            's1': {
                oX: 35,
                oY: 0,
                w: 43,
                h: 122,
                dO: -1.57
            },
            'b': {
                oX: 79,
                oY: 52,
                w: 20,
                h: 20,
                dO: 0
            },
            'b2': {
                oX: 79,
                oY: 72,
                w: 20,
                h: 20,
                dO: 0
            },
            'b3': {
                oX: 79,
                oY: 92,
                w: 20,
                h: 30,
                dO: -1.57
            }
        };

        this.img = null;
    },
    draw: function(c) {
        var t = this,
            s = t.img;

        if (AF.inViewport(t)) {

            c.save();

            t.p.toInt();

            c.translate(t.p.x, t.p.y);

            // TODO performance enhancement -- remove if space needed
            var r = t.r + s.dO;
            if (r !== 0) {
                c.rotate(r);
            }

            c.drawImage(game.img,
                s.oX,
                s.oY,
                s.w,
                s.h, -(s.w * t.s) / 2, -(s.h * t.s) / 2,
                s.w * t.s,
                s.h * t.s);

            c.restore();

            t._super(c);
        }
    }
});
