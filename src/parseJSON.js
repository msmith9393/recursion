// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:

/*
<JSON>     ::= <value>
<value>    ::= <object> | <array> | <boolean> | <string> | <number> | <null>
<array>    ::= "[" [<value>] {"," <value>}* "]"
<object>   ::= "{" [<property>] {"," <property>}* "}"
<property> ::= <string> ":" <value>

source: http://wesleytsai.io/2015/06/13/a-json-parser/
*/


var parseJSON = function(json) {

	var at; // the index of the current character
	var ch; // the current character
	// object storing escapee characters
	var escapee = {
		'\"': '\"',
		'\\': '\\',
		'/': '\/',
		'b': '\b',
		'f': '\f',
		'n': '\n',
		'r': '\r',
		't': '\t'
	};

	// if json is a number
	if (typeof json === "number") {
		// convert it to a stringified version of that number
		json += '';
	}

	// function to get the next character
	function next(c) {
		if (c && c !== ch) {
			throw new SyntaxError("Syntax Error!");
		}
		at += 1;
		ch = json.charAt(at);
		return ch;
	};
  

	// function to parse a number value
	function number() {
		var number, string = '';
		if (ch === '-') {
			string = '-';
			next('-');
		}

		while (ch >= '0' && ch <= '9') {
			string += ch;
			next();
		}

		if (ch === '.') {
			string += '.';
			while(next() && ch >= '0' && ch <= '9') {
				string += ch;
			}
		}

		if (ch === 'e' || ch === 'E') {
			string += ch;
			next();
			if (ch === '-' || ch === '+') {
				string += ch;
				next();
			}

			while(ch >= '0' && ch <= '9') {
				string += ch;
				next();
			}
		}

		number = +string;

		if (!isNaN(number)) {
			return number;
		} else {
			throw new SyntaxError('Bad Number!');
		}

	};


	// function to parse a string value
  function string() {
  	// when this function gets ran, current character will be "
  	var str = '';
  	if (ch !== '"') {
  		throw new SyntaxError('Bad String!');
  	}
  	next();
  	while (ch) {
  		if (ch === '"') {
  			next();
  			return str;
  		}
  		if (ch === '\\') {
  			next();
  			if (escapee.hasOwnProperty(ch)) {
  				str += escapee[ch];
  			} else {
  				str += ch;
  			}
  		} else {
  			str += ch;
  		}
  		next();
  	}
  	throw new SyntaxError('Bad String!');
  };


	// function to parse a boolean value
  function bool() {
  	// when this function gets ran, current character will be either f or t
  	switch(ch) {
  		case 't':
  			next('t');
  			next('r');
  			next('u');
  			next('e');
  			return true;
  		case 'f':
  			next('f');
  			next('a');
  			next('l');
  			next('s');
  			next('e');
  			return false;
  	}
  	throw new SyntaxError('Bad Bool!');
  };


	// function to parse a null value
  function nullVal() {
  	// when this function gets ran, current character will be n
  	switch(ch) {
  		case 'n':
  			next('n');
  			next('u');
  			next('l');
  			next('l');
  			return null;
  	}
  	throw new SyntaxError('Bad null!');
  };


	// function to parse an array value
  function array() {
  	// when this function gets ran, current character will be [
  	var array = [];
  	if (ch === '[') {
  		next('[');
  		white();
	  	if (ch === ']') {
	  		next(']');
	  		return array;
	  	}
	  	while(ch) {
	 			array.push(value());
	  		white();
	  		if (ch === ']') {
	  			next(']');
	  			return array;
	  		}
	  		next(',');
	  		white();
	  	}
  	}
  	throw new SyntaxError('Bad Array!')
  };


	// function to parse an object value
  function object() {
  	// when this function gets ran, current character will be {
  	var obj = {}, key;
  	if (ch === '{') {
	  	next('{');
	  	white();
	  	if (ch === '}') {
	  		next('}');
	  		return obj;
	  	}

	  	while(ch) {
	  		key = string();
	  		white();
	  		next(':');
	  		white();
	  		obj[key] = value();
	  		white();
	  		if (ch === '}') {
	  			next('}');
	  			return obj;
	  		}
	  		next(',');
	  		white();
	  	}
  	}
  	throw new SyntaxError('Bad Object!')
  };


  // function to skip white space
  function white() {
  	while (ch && ch <= ' ') {
  		next();
  	}
  };


  // function to parse a JSON value
  function value() {
  	switch (ch) {
  		case '{':
  			return object();
 			case '[':
 				return array();
 			case '"':
 				return string();
 			case 'f':
 				return bool();
 			case 't':
 				return bool();
 			case 'n':
 				return nullVal();
 			default:
 				if (ch === '-' || (ch && ch >= 0 && ch <= 9)) {
 					return number();
 				} else {
 					throw new SyntaxError('Bad JSON!');
 				}
 				break;
  	}
  };


  // Return the JSON parse function
  var at = 0; // current index is 0
  ch = json.charAt(at); // current character of json at index 0
  return value(); // return the invokation of value

};