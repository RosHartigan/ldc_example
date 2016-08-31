"use strict";
var promise = require('bluebird');

var pgp = require('pg-promise')({ promiseLib: promise });

var connectionString = process.env.DATABASE_URL || 'postgres://postgres:q1w2e3@localhost:5432/ldc';
if( process.env.DATABASE_URL ) {
    connectionString +=  '?ssl=true';
}
var db = pgp(connectionString);


describe("The User object", function() {
    var User;

    beforeEach(function() {
        User = require("../../../models/user.js");
    });

    it("should exist", function() {
        expect(User).toBeDefined();
    });

    it("should return a user with id 1", function(done) {
        var user_id = 1;
        
        User.getOne(db,user_id)
        .then(function(user){
            expect(user).toBeDefined();
            done();
        })
        .catch(function(error){
            console.log(error);
            expect(undefined).toBeDefined();
            done();
        });  
    });
    it("should not return a user with id 0", function(done) {
        var user_id = 0;
        
        User.getOne(db,user_id)
        .then(function(user){
            expect(user).toBeUndefined();
            done();
        })
        .catch(function(error){
            expect(undefined).toBeUndefined();
            done();
        });  
    });
});

if (jasmine.Runner) {
    var _finishCallback = jasmine.Runner.prototype.finishCallback;
    jasmine.Runner.prototype.finishCallback = function () {
        // Run the old finishCallback:
        _finishCallback.bind(this)();

        pgp.end(); // closing pg database application pool;
    };
}