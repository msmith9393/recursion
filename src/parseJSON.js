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


	// function to get the next character
	function next() {
		at += 1;
		ch = json.charAt(at);
		return ch;
	};
  

	// function to parse a number value
  function number() {
  	// when this function gets ran, current character will be either - or a digit
  	var number = '', res;

  	function digits() {
  		while (ch && ch>=0 && ch<=9) {
  			number += ch;
  			next();
  		}
  	};

  	if (ch === '-') {
  		number += ch;
  		next();
  	}

  	digits();

  	if (ch === '.') {
  		number += ch;
  		next();
  		digits();
  	}

  	if (ch === 'e' || ch === 'E') {
  		number += ch;
  		next();
  		if (ch === '-' || ch === '+') {
  			number += ch;
  			next();
  		}
  		digits();
  	}

  	res += number;

  	if (!isNaN(number)) {
  		return number;
  	} else {
  		throw SyntaxError('Bad Number!')
  	}

  };


	// function to parse a string value
  function string() {
  	// when this function gets ran, current character will be "
  	var str = "";
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
  	throw SyntaxError('Bad String!');
  }


	// function to parse a boolean value
  function bool() {
  	// when this function gets ran, current character will be either f or t
  	var boo = '';
  	switch(ch) {
  		case 't':
  			boo += ch;
  			boo += next();
  			boo += next();
  			boo += next();
  			if (boo === 'true') {
  				return true;
  			} else {
  				throw SyntaxError('Bad Bool!');
  			}
  		case 'f':
  			boo += ch;
  			boo += next();
  			boo += next();
  			boo += next();
  			boo += next();
  			if (boo === 'false') {
  				return false;
  			} else {
  				throw SyntaxError('Bad Bool!');
  			}
  	}
  };


	// function to parse a null value
  function nullVal() {
  	// when this function gets ran, current character will be n
  	var nullCheck = ch;
  	nullCheck += next();
  	nullCheck += next();
  	nullCheck += next();
  	if (nullCheck === "null") {
  		return null;
  	} else {
  		throw SyntaxError('Bad null!');
  	}
  };


	// function to parse an array value
  function array() {};


	// function to parse an object value
  function object() {};


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
 					throw SyntaxError('Bad JSON!');
 				}
 				break;
  	}
  };


  // Return the JSON parse function
  var at = 0; // current index is 0
  ch = json.charAt(at); // current character of json at index 0
  return value(); // return the invokation of value

};

console.log(parseJSON('999'));
