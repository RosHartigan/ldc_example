var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:q1w2e3@localhost:5432/ldc';

var client = new pg.Client(connectionString);
client.connect();

// first drop all the tables (user_courses, courses, users)
// then add them all in opposite order
dropUserCoursesTable();

function dropUserCoursesTable() {

	var query = client.query('DROP TABLE user_courses');
	query.on('end', function() { 
		dropCoursesTable();
	});
}
function dropCoursesTable() {
	var query = client.query('DROP TABLE courses');
	query.on('end', function() { 
		dropUsersTable();
	});
}

function dropUsersTable() {
	var query = client.query('DROP TABLE users');
	query.on('end', function() { 
		addUsersTable();
	});
}

function addUsersTable() {
	var query = client.query(
		'CREATE TABLE users' + 
		'(' +
			'id SERIAL PRIMARY KEY, ' +
			'name_first text, ' +
			'name_last text not null' +
		')'
	);
	query.on('end', function() { 
		addUsers(); 
	});
}

function addUsers() {
	var query = client.query(
		"INSERT INTO users (id, name_first, name_last) VALUES \
		    (1, 'Hermione', 'Granger'), \
		    (2, 'Ron', 'Weasley'), \
		    (3, 'Harry', 'Potter');"
	);
	query.on('end', function() { 
		addCoursesTable(); 
	});
}



function addCoursesTable() {
	var query = client.query(
		'CREATE TABLE courses' +
		'(' +
			'id SERIAL PRIMARY KEY, ' +
			'catalog_number text not null, ' +
			'catalog_title text' +
		')' 
	);
	query.on('end', function() { 
		addCourses(); 
	});
}

function addCourses() {
	var query = client.query(
		"INSERT INTO courses (id, catalog_number, catalog_title) VALUES \
		    (1, 'POT100', 'Introduction to Potions'), \
		    (2, 'POT200', 'Advanced Potions'), \
		    (3, 'CS100', 'Introduction to Computer Science');"
	);
	query.on('end', function() { 
		addUserCoursesTable(); 
	});
}

function addUserCoursesTable() {
	var query = client.query(
		'CREATE TABLE user_courses ' +
		'(' +
		'  user_id integer NOT NULL,' +
		'  course_id integer NOT NULL,' +
		'  status text,' +
		'  CONSTRAINT user_courses_id PRIMARY KEY (user_id, course_id),' +
		'  CONSTRAINT users_courses_course_id FOREIGN KEY (course_id)' +
		'      REFERENCES courses (id) MATCH SIMPLE' +
		'      ON UPDATE NO ACTION ON DELETE CASCADE,' +
		'  CONSTRAINT users_courses_user_id FOREIGN KEY (user_id)' +
		'      REFERENCES users (id) MATCH SIMPLE' +
		'      ON UPDATE NO ACTION ON DELETE CASCADE' +
		')' 
	);
	query.on('end', function() { 
		adduserCourses();
	});
}

function adduserCourses() {
	var query = client.query(
		"INSERT INTO user_courses (user_id, course_id, status) VALUES \
		    (1, 1, 'complete'), \
		    (1, 2, 'enrolled'), \
		    (1, 3, 'enrolled'), \
		    (2, 1, 'enrolled'), \
		    (2, 2, 'withdrawn'), \
		    (3, 3, 'enrolled'), \
		    (3, 1, 'enrolled');"
	);
	query.on('end', function() { 
		client.end();
	});
}


