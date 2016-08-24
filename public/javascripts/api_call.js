

function courseList() {
	fetchJson("/api/courses", "get");
}

function userCourseList(userId, status) {
	var url = "/api/users/"+userId+"/courses";
	if( status ) {
		url += "?status="+status;
	}
	fetchJson(url, "get");
}

function userCourseAdd(userId, courseId) {
	fetchJson("/api/users/"+userId+"/courses/"+courseId+"/status/enrolled", "post");
}

function userCourseDelete(userId, courseId) {
	fetchJson("/api/users/"+userId+"/courses/"+courseId, "delete");
}

function fetchJson(url, method) {
	$.ajax( { "url": url, "method": method, dataType: "json"} )
	  .done(function(json) {
	  	$('#returnError').hide();
	  	$('#returnJsonCode').text(JSON.stringify(json, null, '  '));
	  	$('#returnJson').show();
	  })
	  .fail(function(jqXHR, textStatus) {
	  	console.log("Error: " + url + " " + textStatus);
	  	$('#returnJson').hide();
	    $('#returnError').text( "Error: " + textStatus );
	  	$('#returnError').show();
	  });
}