var V2 = (function() {
    /*
     * CONSTRUCTOR
     */

    function V2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    /*
     * INSTANCE METHODS
     */
    V2.prototype = {
        copy: function() {
            return new V2(this.x, this.y);
        },
        length: function() {
            return M.sqrt(this.x * this.x + this.y * this.y);
        },
        norm: function() {
            var m = this.length();

            if (m > 0) {
                this.divide(m);
            }

            return this;
        },
        limit: function(max) {
            if (this.length() > max) {
                this.norm();

                return this.mult(max);
            } else {
                return this;
            }
        },
        heading: function() {
            return -1 * M.atan2(-1 * this.y, this.x);
        },
        add: function(other) {
            this.x += other.x;
            this.y += other.y;

            return this;
        },
        sub: function(other) {
            this.x -= other.x;
            this.y -= other.y;

            return this;
        },
        mult: function(n) {
            this.x = this.x * n;
            this.y = this.y * n;

            return this;
        },
        divide: function(n) {
            this.x = this.x / n;
            this.y = this.y / n;

            return this;
        },
        toInt: function() {
            this.x = M.round(this.x);
            this.y = M.round(this.y);
            return this;
        }
    };
    return V2;
})();
