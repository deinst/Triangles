/**
 * Created by davideinstein on 5/20/17.
 */
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

var ts = require("../src/game.js");

describe("game object", function(){
    describe("has properrties",function () {
        it("game object should exist", function () {
            expect(ts.game).to.exist;
        });
        it("game has move number", function () {
            ts.game.should.have.property('moveNumber');
        });
        it("should have a list of moves", function () {
            ts.game.should.have.property('moves');
        })
        it("should have a list of available transitions", function () {
            ts.game.should.have.property('available')
        })
        it("should have a list of sites", function () {
            ts.game.should.have.property('sites')
        })
        it("should have a reset function", function(){
            ts.game.should.have.property('reset')
        })
    })
    describe("reset function", function(){
        it("should set moves to 0", function(){
            ts.game.reset();
            ts.game.moveNumber.should.equal(0);
        })
    })
})

describe("adjacentVertices", function(){
    it("should recognize adjacent vertices", function(){
        var adjacentTo33 = [[2,3],[2,4],[3,2],[3,4],[4,2],[4,3]];
        function isIn(array, val) {
            for (var i = 0; i < array.length; i++) {
                if (val[0] === array[i][0] && val[1] === array[i][1] ) return true;
            }
            return false;
        }
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                ts.adjacentVertices([3,3],[i,j]).should.equal(isIn(adjacentTo33,[i,j]));
            }
        }
    })
})
describe("edge type", function(){
    it("should return the appropriate value", function () {
        var tests = [
            {arg: [2,3], result: {increase: 2, decrease: 0}},
            {arg: [2,4], result: {increase: 1, decrease: 0}},
            {arg: [3,2], result: {increase: 2, decrease: 1}},
            {arg: [3,4], result: {increase: 1, decrease: 2}},
            {arg: [4,2], result: {increase: 0, decrease: 1}},
            {arg: [4,3], result: {increase: 0, decrease: 2}},
        ];
        function checkEdge(test) {
            var res = ts.edgeType([3,3], test.arg);
            return (res.increase == test.result.increase) && (res.decrease == test.result.decrease)
        }
        tests.forEach(function(test) {checkEdge(test).should.be.true;})
    })
})
describe('check valid next', function(){
    describe("start of game", function(){
        it("should have all posibilities", function(){
            ts.game.reset(4);
            var allmoves = ts.game.validMoves();
            allmoves.should.have.length(15);
        })
    })
    describe("check early moves", function(){
        it("should only allow available moves", function(){
            ts.game.reset(4);
            ts.game.moveNumber = 3;
            ts.game.moves[2] = [1,1];
            ts.game.available[2] = [1,1,1];
            var moves = ts.game.validMoves();
            moves.should.have.deep.members([ [ 0, 1 ], [ 0, 2 ], [ 1, 0 ], [ 1, 2 ], [ 2, 0 ], [ 2, 1 ] ]);
            ts.game.available[2] = [1,1,0];
            moves = ts.game.validMoves();
            moves.should.have.deep.members([ [ 0, 1 ], [ 0, 2 ], [ 1, 0 ], [ 2, 0 ] ]);
            ts.game.sites[0][1] = 1;
            moves = ts.game.validMoves();
            moves.should.have.deep.members([ [ 0, 2 ], [ 1, 0 ], [ 2, 0 ] ]);
        })
    })
    describe("check late moves", function(){
        it("should only allow available moves", function(){
            ts.game.reset(4);
            ts.game.moveNumber = 5;
            ts.game.moves[0] = [1,1];
            ts.game.moves[1] = [2,1];
            ts.game.moves[4] = [2,2];
            ts.game.validMoves().should.have.deep.members([[1,2], [1,3]]);
        })
    })
})

describe("follow game", function () {
    var game = [[2,1],[1,2],[0,3],[0,4],[1,3],[2,2],[3,1],[4,0],[3,0],[2,0],[1,0],[0,0],[0,1],[1,1]];
    it('should permit a legal game', function () {
        ts.game.reset(4);
        game.forEach(function(mv){
            ts.game.move(mv).should.equal(true);
        })
    })
})
