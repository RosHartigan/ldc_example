var Promise = require("bluebird");

var Course = (function(){
  function Course(db_pool, record) {
    if( !db_pool ){
      throw("Can't create Course without database connection");
    } 
    if( !record ){
      throw("Can't create Course without existing record");
    }

  	this.db_pool = db_pool;
    this.record = record;
  }

  // RECORD FUNCTIONS
  Course.prototype.destroy = function() {
    delete_promise = this.db_pool.none(
      "delete from courses where id=$1", 
      [this.record.id])
    .then(function(){
      this.record = {};
    });

    return delete_promise;
  }

  // RELATED RECORD FUNCTIONS
  Course.prototype.get_users = function() {
    return this.db_pool.any(
        "SELECT u.name_last,u.name_first,uc.status FROM users AS u,user_courses AS uc WHERE u.id = uc.user_id AND uc.course_id=$1", 
        [this.record.id]);
  }

  // UTILITY FUNCTIONS
  Course.prototype.get_display_name = function () {
    if( this.record && this.record.id) {
      if( this.record.catalog_number && this.record.catalog_title ) {
        return this.record.catalog_number + ": " + this.record.catalog_title;
      }
      else if( this.record.catalog_number ) {
        return this.record.catalog_number;
      }
      else if( this.record.catalog_title ) {
        return this.record.catalog_title;
      }
      else if( this.record.id ) {
        return "Course " + this.record.id;
      }
    }
    return "Unidentified Course";
  }

  Course.prototype.toJSON = function() {
    return this.record;
  }

  return Course;
})();


// STATIC FUNCTIONS

// Return promise returning list of all course
Course.getAll = function (db_pool) {

  return db_pool.any("select * from courses")
    .then(function(data) {
        return data.map(function(row, index, data) {
            return new Course(db_pool, row);
        });
    });
}

// Return promise returning specific course, throws error if not found
Course.getOne = function(db_pool, course_id) {
  var load_promise = db_pool.one("select * from courses where id=$1", [course_id]);

  return load_promise.then(function (data) {
      var course = new Course(db_pool, data);
      return course;
    });;
}

// Return promise returning newly created course
Course.create = function(db_pool, catalog_number, catalog_title) {
  
  var insert_promise = db_pool.one(
    "insert into courses(catalog_number, catalog_title) values($1, $2) returning id", 
    [catalog_number, catalog_title]);

  return insert_promise.then(function (data) {
      var course = new Course(db_pool, {"id":id, "catalog_number": catalog_number, "catalog_title": catalog_title});
      return course;
    });
}

module.exports = Course;


