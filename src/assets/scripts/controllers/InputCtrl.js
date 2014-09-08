var InputCtrl = Class.extend({
    init: function() {
        this.bind();
    },
    bind: function() {
        var t = this;
        var w = W.addEventListener;
        w('keydown', function(e) {
            switch (e.keyCode) {
                case 68: //d
                    t.D = true;
                    break;
                case 65: //a
                    t.A = true;
                    break;
                case 87: //w
                    t.W = true;
                    break;
                case 32: //space
                    t.Space = true;
                    break;
                case 37: //left
                    t.L = true;
                    break;
                case 38: //up
                    t.U = true;
                    break;
                case 39: //right
                    t.R = true;
                    break;
                case 16: //shift
                    t.Shift = true;
                    break;
            }
        });

        w('keyup', function(e) {
            switch (e.keyCode) {
                case 68: //d
                    t.D = false;
                    break;
                case 65: //a
                    t.A = false;
                    break;
                case 87: //w
                    t.W = false;
                    break;
                case 32: //space
                    t.Space = false;
                    break;
                case 37: //left
                    t.L = false;
                    break; 
                case 38: //up
                    t.U = false;
                    break;
                case 39: //right
                    t.R = false;
                    break;
                case 16: //shift
                    t.Shift = false;
                    break;
            }
        });
    }
});
