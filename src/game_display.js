/**
 * Created by davideinstein on 5/20/17.
 */
'use strict';
var game = require("../src/game.js").game;
var edgeType = require("../src/game.js").edgeType;

function getPos(i, j, dist) {
    var y = dist.h * (dist.n - i + 1);
    var x = dist.height / 2 - (dist.n - i) * dist.w / 2 + j * dist.w;
    return {x: x, y: y};
}

function VertexDisplay(i, j, paper, dist) {
    var pos = getPos(i, j, dist);
    var y = pos.y;
    var x = pos.x;
    this.i = i;
    this.j = j;
    this.circle = paper.circle(x, y, dist.r);
    this.circle.attr({fill:"lightblue"});
    this.circle.click(function() {gameDisplay.move(i, j)});
    if (game.n < 8) {
        var str = i.toString() + j.toString() + (game.n - i - j).toString();
        this.text = paper.text(x, y, str);
        this.text.click(function() {gameDisplay.move(i, j)});
    }
    var arrows = [];
    game.edges.forEach(function(dir) {
        var i1 = i + dir[0];
        var j1 = j + dir[1];
        if (i1 >= 0 && j1 >= 0 && i1 + j1 <= dist.n) {
            var path = paper.path("M" + (x + dir[1] * dist.w / 4 + dir[0] * dist.w / 8 ) + "," + (y - dir[0] * dist.h / 4) +
                "L" + (x + 3 * dir[1] * dist.w / 4 + 3 * dir[0] * dist.w / 8) + "," + (y - 3 * dir[0] * dist.h / 4)  );
            path.hide();
            path.attr({"arrow-end":"classic", stroke:"black", "stroke-width":3});
            arrows.push({i:i1, j:j1, path: path});
        }
    });
    this.arrows = arrows;
    this.color = function(game) {
        if (this.text) {
            if (game.moveNumber === 0) {
                this.text.show();
            } else {
                this.text.hide();
            }
        }
        var status = game.sites[i][j];
        if ((status >= 0) && (status <= game.moveNumber)) {
            this.circle.attr({fill:"black"});
            this.arrows.forEach(function(arrow) {
                if (game.sites[arrow.i][arrow.j] === status + 1) {
                    arrow.path.show();
                    if (status + 1 + game.n === game.moveNumber) {
                        arrow.path.attr({stroke: "lightblue"});
                    } else {
                        arrow.path.attr({stroke:"black"});
                    }
                } else {
                    arrow.path.hide();
                }
            })
        } else {
            if (game.validMove([i, j])) {
                this.circle.attr({fill:"lightblue"});
            } else {
                this.circle.attr({fill:"green"});
            }
        }
    }.bind(this)
}

function Dist(paper, n) {
    this.height = Math.min(paper.height, paper.width);
    this.n = n;
    this.w = this.height / (this.n +  2);
    this.h = Math.sqrt(3) * this.w / 2;
    this.r = this.w /4;
}

var gameDisplay = {
    paper: null,
    dist: {},
    nodes: [],
    sideLabels: [],
    scoreText: null,
    problemDiv: null,
    init: function(paper, n, div) {
        this.problemDiv = div;
        this.paper = paper;
        this.dist.height = Math.min(paper.height, paper.width);
        game.reset(n);
        this.drawFirst(n);
    },
    drawFirst: function(n) {
        this.paper.clear();
        this.dist = new Dist(this.paper, n);
        this.nodes = [];
        for (var i = 0; i <= this.dist.n; i++) {
            this.nodes[i] = [];
            for (var j = 0; j <= this.dist.n - i; j++) {
                this.nodes[i][j] = new VertexDisplay(i,j,this.paper, this.dist);
            }
        }
        var dist = this.dist;
        var pos0 = getPos(-1/2, dist.n/2 + 1/4, dist);
        this.sideLabels[0] = this.paper.text(pos0.x, pos0.y, ' ').attr({"font-size":dist.r});
        var pos1 = getPos(dist.n / 2 + 1 / 4, -1 / 2, dist);
        this.sideLabels[1] = this.paper.text(pos1.x, pos1.y, ' ').attr({"font-size":dist.r});
        var pos2 = getPos(dist.n / 2 + 1 / 4, dist.n / 2 + 1 / 4, dist);
        this.sideLabels[2] = this.paper.text(pos2.x, pos2.y, ' ').attr({"font-size":dist.r});
        this.scoreText = this.paper.text(10,50, 'Score: 0').attr({"font-size":40, "text-anchor":"start"})
    },
    reset: function(n){
        game.reset(n);
        this.drawFirst(n);
    },
    move: function(i, j){
        if (game.move([i,j])) {
            this.updateDisplay()
        }
    },
    updateDisplay: function(){
        this.nodes.forEach(function(row){
            row.forEach(function(elem) {
                elem.color(game);
            })
        });
        if ((game.moveNumber > 0) &&  (game.moveNumber <= game.n)) {
            this.sideLabels[0].attr({text: game.available[game.moveNumber - 1][0].toString()});
            this.sideLabels[1].attr({text: game.available[game.moveNumber - 1][1].toString()});
            this.sideLabels[2].attr({text: game.available[game.moveNumber - 1][2].toString()})
        } else if (game.moveNumber === 0) {
            this.sideLabels[0].attr({text: ' '});
            this.sideLabels[1].attr({text: ' '});
            this.sideLabels[2].attr({text: ' '})
        } else {
            var mv = edgeType(game.moves[game.moveNumber - game.n - 1], game.moves[game.moveNumber - game.n]);

            this.sideLabels[0].attr({text: (mv.increase === 0 ? '1' : '0')});
            this.sideLabels[1].attr({text: (mv.increase === 1 ? '1' : '0')});
            this.sideLabels[2].attr({text: (mv.increase === 2 ? '1' : '0')});
        }
        this.scoreText.attr({text: "Score: " + game.moveNumber});
        this.problemDiv.innerHTML = game.getProblemString();
    },
    undoMove: function() {
        console.log(this);
        game.undoMove();
        this.updateDisplay();
    }
};

exports.gameDisplay = gameDisplay;
