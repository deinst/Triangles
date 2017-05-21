/**
 * Created by davideinstein on 5/20/17.
 */

function adjacentVertices(a, b) {
    return (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[0] + a[1] - b[0] - b[1])) === 2;
}
exports.adjacentVertices = adjacentVertices;

/**
 * returns a two element array the first element indicates the increasing value, the second
 * the decreasing one
 * @param a
 * @param b
 */
function edgeType(a, b) {
    var ret = {increase: 2, decrease: 2};
    if (a[0] - b[0] > 0) {
        ret.decrease = 0
    }
    if (a[0] - b[0] < 0) {
        ret.increase = 0
    }
    if (a[1] - b[1] > 0) {
        ret.decrease = 1
    }
    if (a[1] - b[1] < 0) {
        ret.increase = 1
    }
    return ret;
}
exports.edgeType = edgeType;

var game = {
    moveNumber: 0,
    moves: [],
    available: [],
    sites: [],
    n: 4,
    edges: [[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0]],
    reset: function (n) {
        if (n !== undefined) {
            this.n = n;
        }
        this.moveNumber = 0;
        this.sites = [];
        for (var i = 0; i <= n; i++) {
            this.sites[i] = [];
            for (var j = 0; j <= n - i; j++) {
                this.sites[i][j] = -1;
            }
        }
    },
    move: function (coord) {
        if (!this.validMove(coord)) {
            return false;
        }
        this.moves[this.moveNumber] = coord;
        if (this.moveNumber === 0) {
            this.available[0] = [coord[0], coord[1], this.n - coord[0] - coord[1]];
        } else if (this.moveNumber <= this.n) {
            var edge = edgeType(this.moves[this.moveNumber - 1], coord);
            this.available[this.moveNumber] = this.available[this.moveNumber - 1].slice();
            this.available[this.moveNumber][edge.decrease] -= 1;
        }
        this.sites[coord[0]][coord[1]] = this.moveNumber;
        this.moveNumber += 1;
        return true;
    },
    validMove: function(coord) {
        // make sure it's a valid coordinate
        if ((coord[0] < 0) || (coord[1] < 0) || (coord[0] + coord[1] > this.n)) {
            return false;
        }
        if (this.moveNumber === 0) {
            return true;
        }
        // if a move has been made make sure the new move is adjacent to the last move
        if (!adjacentVertices(this.moves[this.moveNumber - 1], coord)) {
            return false;
        }
        // make sure it is not occupied.
        var state = this.sites[coord[0]][coord[1]];
        if ((state >= 0) && (state < this.moveNumber)) {
            return false;
        }
        //make sure it's a valid edge
        var edge = edgeType(this.moves[this.moveNumber - 1], coord);
        if (this.moveNumber <= this.n) {
            return this.available[this.moveNumber - 1][edge.decrease] > 0;
        }
        var oldmove = this.moveNumber - this.n;
        var oldedge = edgeType(this.moves[oldmove - 1], this.moves[oldmove]);
        return oldedge.increase === edge.decrease;
    },
    validMoves: function () {
        if (this.moveNumber === 0) {
            var all = [];
            for (var i = 0; i <= this.n; i++) {
                for (var j = 0; j <= this.n - i; j ++) {
                    all.push([i,j]);
                }
            }
            return all;
        } else {
            var lastmove = this.moves[this.moveNumber - 1];
            var ret = this.edges.map(function (dir) {
                return [dir[0] + lastmove[0], dir[1] + lastmove[1]]
            });
            return ret.filter(this.validMove, this);
        }
    },
    undoMove: function () {
        if (this.moveNumber >  0) {
            this.moveNumber -= 1;
            var m = this.moves[this.moveNumber];
            this.sites[m[0]][m[1]] = -1;
        }
    },
    getProblemString: function() {
        var base = (new Array(this.n + 1)).join('?');
        if (this.moveNumber <= 1) {
            return base;
        }
        var temp = [];
        for (i = 0; i < this.moveNumber - 1; i++) {
            temp.push(edgeType(this.moves[i], this.moves[i+1]))
        }
        var sd = temp.map(function(x){return x.decrease}).join('');
        var si = temp.map(function(x){return x.increase}).join('');
        if (sd.length < this.n) {
            base = sd + (new Array(this.n + 1 - sd.length)).join('?');
        } else {
            base = sd.substr(0, this.n)
        }
        return base + si;
    }
};

exports.game = game;
