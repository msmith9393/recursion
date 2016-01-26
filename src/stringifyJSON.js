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
};
