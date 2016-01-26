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
		'"': '"',
		'\\': '\\',
		'/': '/',
		b: '\b',
		f: '\f',
		n: '\n',
		r: '\r',
		t: '\t'
	};


	// function to get the next character
	function next() {
		at += 1;
		ch = json.charAr(at);
		return ch;
	};
  

	// function to parse a number value
  function number() {};


	// function to parse a string value
  function string() {}


	// function to parse a boolean value
  function bool() {};


	// function to parse a null value
  function nullVal() {};


	// function to parse an array value
  function array() {};


	// function to parse an object value
  function object() {};


  // function to skip white space
  function white() {
  	while (ch === " ") {
  		next();
  	}
  };


  // function to parse a JSON value
  function value() {
  	white();
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
 					throw("syntax error");
 				}
  	}
  };


  // Return the JSON parse function
  var at = 0; // current index is 0
  ch = json.charAt(at); // current character of json at index 0
  return value(); // return the invokation of value

};
