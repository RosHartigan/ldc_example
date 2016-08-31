## ldc_example

###LDC Code sample using node.js and postgres.

Demonstrating simple user/course api. 

```
GET 	/api/courses

GET 	/api/users					// Get list of all users
GET 	/api/users/:user_id			// Get info for specific user
GET 	/api/users/:user_id/courses?status=:status	// Get list of courses for user with given enrollment status

DELETE 	/api/users/:user_id/courses/:course_id	// Delete user's course enrollment
POST 	/api/users/:user_id/courses/:course_id/status=:status	// Set user's course enrollment status
```

To install:

Install [postgres](https://www.postgresql.org/download/)

```
npm install
```

To run:
```
npm start
```


