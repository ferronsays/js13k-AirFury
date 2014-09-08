var Background = Class.extend({
    init: function(w, h) {
        var t = this;
        t.count = 2;
        t.nodes = [];
        // Total clouds per layer
        t.counts = [125, 75];
        // Cloud circle radii
        t.sizes = [30, 50];
        // Parralax Offsets
        t.pOffsets = [0.5, 0.2];
        // Height Offsets
        t.hOffsets = [2000, 500];

        var tempC = document.createElement('canvas'),
            tmpCtx = tempC.getContext('2d');

        tempC.width = w;
        tempC.height = h;

        for (var i = 0; i < t.count; i++) {
            t.nodes.push(new Image());

            for (var j = 0; j < t.counts[i]; j++) {

                var p = new V2(AF.randRange(0, w), AF.randRange(0, h));

                tmpCtx.fillStyle = '#D3EDFF';

                var nodes = AF.randRange(5, 50);

                for (var k = 0; k < nodes; k++) {
                    tmpCtx.beginPath();
                    tmpCtx.arc(
                        p.x + AF.randRange(0, 8 * t.sizes[i]),
                        p.y + AF.randRange(30, 125),
                        t.sizes[i],
                        0,
                        M.PI * 2,
                        true);

                    tmpCtx.fill();
                }
            }

            t.nodes[i].src = tempC.toDataURL();

            tmpCtx.clearRect(0, 0, w, h);
        }
    },
    draw: function(c) {
        var t = this;

        for (var i = 0; i < t.count; i++) {
            c.save();
            c.globalAlpha = (i === 0 ? 0.5 : 1);
            c.translate(game.cam.vp.l * t.pOffsets[i], game.cam.vp.t * t.pOffsets[i]);
            c.drawImage(t.nodes[i], -t.nodes[i].width / 2, -t.nodes[i].height + t.hOffsets[i]);
            c.restore();
        }
    }
});
