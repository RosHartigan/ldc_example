var express = require('express');
var router = express.Router();

var promise = require('bluebird');

var pgp = require('pg-promise')({ promiseLib: promise });
var connectionString = 'postgres://postgres:q1w2e3@localhost:5432/ldc';
var db = pgp(connectionString);

// API : Reset db
router.get('/db/reset', function(req, res, next) {
	
	try {
	   	var db_reset = require('../models/database_reset.js'); 
	   	// should convert this to promise based.
	   	db_reset.on_error = function(e) {
	   		res.status(500).send(e.name + ": " + e.message);
	   	}
	   	db_reset.on_complete = function() {
			res.send("Database Reset");
	   	}
		db_reset(); 

	}
	catch (error) {
		res.status(500).send(error.name + ": " + e.error);
	}
});


// API : COURSES
var Course = require('../models/course.js');

/* List all courses */
router.get('/courses', function(req, res, next) {
	Course.getAll(db)
	.then(function(courses) {
		res.json(courses);
	})
	.catch(function(error){
		console.log(error.stack);
		var status = ( error.name === "QueryResultError") ? 404 : 500;
		res.status(status).send(error.name + ": " + error.message + "\n" + error.stack);
	});  
});

// API : USERS
var User = require('../models/user.js');

/* Display all users */
router.get('/users', function(req, res, next) {
	User.getAll(db)
	.then(function(users) {
		res.json(users);
	})
	.catch(function(error){
		console.log(error.stack);
		var status = ( error.name === "QueryResultError") ? 404 : 500;
		res.status(status).send(error.name + ": " + error.message + "\n" + error.stack);
	});  
});

// helper function for single user queries
var userQuery = function(user_id, res, thenFunction) {
	User.getOne(db,user_id)
	.then(thenFunction)
	.catch(function(error){
		console.log(error.stack);
		var status = ( error.name === "QueryResultError") ? 404 : 500;
		res.status(status).send(error.name + ": " + error.message + "\n" + error.stack);
	});  
}

/* display single user */
router.get('/users/:user_id', function(req, res, next) {
	userQuery(req.params.user_id, res, function(user) {
		res.json(user.record);
	});
});

// API : USER COURSES

/* List courses user is enrolled in */
router.get('/users/:user_id/courses', function(req, res, next) {
	userQuery(req.params.user_id, res, function(user) {
		return user.get_courses(req.query.status).then(function(data) {
			res.json(data);
		});
	});
});

/* Delete user's course enrollment */
router.delete('/users/:user_id/courses/:course_id', function(req, res, next) {
	userQuery(req.params.user_id, res, function(user) {
		return user.delete_course(req.params.course_id).then(function(data) {
			res.json("Course " + req.params.course_id + " deleted from User " + req.params.user_id);
		});
	});
});

/* Update user's course enrollment */
router.post('/users/:user_id/courses/:course_id/:status', function(req, res, next) {
	userQuery(req.params.user_id, res, function(user) {
		return user.update_course_status(req.params.course_id,req.params.status).then(function(data) {
			res.status(201).json("Course " + req.params.course_id + " for User " + req.params.user_id + " updated to " + req.params.status);
		});
	});
});

module.exports = router;
