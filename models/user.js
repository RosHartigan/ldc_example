var Promise = require("bluebird");

var User = (function(){
  function User(db_pool, record) {
    if( !db_pool ){
      throw("Can't create User without database connection");
    } 
    if( !record ){
      throw("Can't create User without existing record");
    }

  	this.db_pool = db_pool;
    this.record = record;
  }

  // RECORD FUNCTIONS
  User.prototype.destroy = function() {
    return this.db_pool.none(
      "delete from users where id=$1", 
      [this.record.id])
    .then(function(){
      this.record = {};
    });

  }

  // RELATED RECORD FUNCTIONS
  User.prototype.get_courses = function(status) {
    var queryString = "SELECT c.catalog_number,c.catalog_title,uc.status FROM courses AS c,user_courses AS uc WHERE c.id = uc.course_id AND uc.user_id=$1";
    var paramsArray = [this.record.id];
    if( status ) {
      queryString += " AND uc.status=$2";
      paramsArray.push(status);
    }
    return this.db_pool.any( queryString, paramsArray );
  }

  // update or insert
  User.prototype.update_course_status = function (course_id, status) {   
    var _this = this;
    
    var select_promise = this.db_pool.oneOrNone(
        "select * from user_courses where user_id=$1 and course_id=$2", 
        [this.record.id,course_id])
    .then(function (data) {
        // we didn't find it: insert
        if (data === null) {
          return _this.db_pool.none(
            "insert into user_courses(user_id,course_id,status) values($1,$2,$3)", 
            [_this.record.id,course_id, status]);   
        }
        // we found it and status is different: update
        else if (data.status !== status) {
          return _this.db_pool.none(
            "update user_courses set status=$3 where user_id=$1 and course_id=$2", 
            [_this.record.id,course_id,status]);  
        }
      });

    return select_promise;
  }

  // throws error if user is not registered with course
  User.prototype.delete_course = function (course_id) {
    return this.db_pool.none("delete from user_courses where user_id=$1 and course_id=$2", [this.record.id,course_id]);
  }

  // UTILITY FUNCTIONS
  User.prototype.get_display_name = function () {
    if( this.record && this.record.id) {
      if( this.record.name_last && this.record.name_first ) {
        return this.record.name_last + ", " + this.record.name_first;
      }
      else if( this.record.name_last ) {
        return this.record.name_last;
      }
      else if( this.record.name_first ) {
        return this.record.name_first;
      }
      else if( this.record.id ) {
        return "User " + this.record.id;
      }
    }
    return "Unidentified User";
  }

  User.prototype.toJSON = function() {
    return this.record;
  }

  return User;
})();


// STATIC FUNCTIONS

// Return promise returning list of all users
User.getAll = function (db_pool) {

  return db_pool.any("select * from users")
    .then(function(data) {
        return data.map(function(row, index, data) {
             return new User(db_pool, row);
        });
    });
}

// Return promise returning specific user, throws error if not found
User.getOne = function(db_pool, user_id) {
  var load_promise = db_pool.one("select * from users where id=$1", [user_id]);

  return load_promise.then(function (data) {
      var user = new User(db_pool, data);
      return user;
    });;
}

// Return promise returning newly created user
User.create = function(db_pool, name_last, name_first) {
  
  var insert_promise = db_pool.one(
    "insert into users(name_last, name_first) values($1, $2) returning id", 
    [name_last, name_first]);

  return insert_promise.then(function (data) {
      var user = new User(db_pool, {"id":id, "name_last": name_last, "name_first": name_first});
      return user;
    });
}

module.exports = User;


