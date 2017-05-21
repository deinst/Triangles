/**
 * Created by davideinstein on 5/20/17.
 */
'use strict';
var Raphael = require('raphael');
var gd = require('./src/game_display.js').gameDisplay;

function tryUpdate() {
    var size = parseInt(document.getElementById('game_size').value);
    console.log(gd);
    gd.reset(size)
}

window.onload = function () {
    var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
    var resultDiv = document.getElementById('problem_string');
    gd.init(paper, 4, resultDiv);
    var backbutton = document.getElementById('back');
    backbutton.addEventListener('click', gd.undoMove.bind(gd));
    var resetbutton = document.getElementById('reset');
    resetbutton.addEventListener('click', tryUpdate);
};
