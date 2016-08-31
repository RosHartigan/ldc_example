## ldc_example

###LDC Code sample using node.js and postgres.

Demonstrating simple user/course api. 

```
// Get list of all courses
GET 	/api/courses

// Get list of all users
GET 	/api/users			

// Get info for specific user
GET 	/api/users/:user_id			

// Get list of courses for user with given enrollment status
GET 	/api/users/:user_id/courses?status=:status	

// Delete user's course enrollment
DELETE 	/api/users/:user_id/courses/:course_id	

// Set user's course enrollment status
POST 	/api/users/:user_id/courses/:course_id/status=:status	
```

To install:

Install [postgres](https://www.postgresql.org/download/) and create empty database `ldc`.

```
npm install
```

To run:
```
npm start
```


