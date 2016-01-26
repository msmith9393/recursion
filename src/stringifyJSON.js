// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {

	// if type of obj is a number, a boolean, or obj is null
	if (typeof obj === "number" || typeof obj === "boolean" ||  obj === null) {
		// return stringified obj
		return obj + '';
	}
	// if type of obj is a string
  if (typeof obj === "string") {
  	// return string beginning and ending with additional quotation marks
  	return '"' + obj + '"';
  }
  // if type of obj is an array
  if (Array.isArray(obj)) {
  	// loop through all elements in array
  	for (var i=0; i<obj.length; i++) {
  		// each element equals the stringified version of itself
  		obj[i] = stringifyJSON(obj[i]);
  	}
  	// return stringified array with stringified elements
  	return '['+ obj +']';
  }
  // if type of obj is an object
  if (typeof obj === "object") {
  	// array to store stringified properties
  	var res = [];
  	// loop through obj
  	for (var key in obj) {
  		// if type of value is a function or equal to undefined
  		if (typeof obj[key] === "function" || obj[key] === undefined) {
  			// do nothing
  		} else {
  			// add stringified key, colon, stringified value to result
  			res.push(stringifyJSON(key) + ':' + stringifyJSON(obj[key]));
   		}
  	}
  	// return stringified object with stringfied keys and values
  	return '{' + res.join(',') + '}';
  }

};
