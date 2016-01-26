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

  	res = + number;

  	if (!isNaN(number)) {
  		return number;
  	} else {
  		throw new SyntaxError('Bad Number!')
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
  	throw new SyntaxError('Bad String!');
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
  				throw new SyntaxError('Bad Bool!');
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
  				throw new SyntaxError('Bad Bool!');
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
  		throw new SyntaxError('Bad null!');
  	}
  };


	// function to parse an array value
  function array() {
  	// when this function gets ran, current character will be [
  	var array = [], val;
  	next('[');
  	white();
  	if (ch === ']') {
  		next(']');
  		return array;
  	}
  	while(ch) {
  		val = value();
  		if (typeof (val*1) === "number") {
  			array.push(Number(val));
  		} else {
  			array.push(val);
  		}
  		white();
  		if (ch === ']') {
  			next(']');
  			return array;
  		}
  		next(',');
  		white();
  	}
  	throw new SyntaxError('Bad Array!')
  };


	// function to parse an object value
  function object() {
  	// when this function gets ran, current character will be {
  	var obj = {}, key;
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


	console.log('mine', parseJSON('[1, 0, -1, -0.3, 0.3, 1343.32, 3345, 0.00011999999999999999]'));
	console.log('correct', JSON.parse('[1, 0, -1, -0.3, 0.3, 1343.32, 3345, 0.00011999999999999999]'));

parseableStrings = [
  // basic stuff
  '[]',
  '{"foo": ""}',
  '{}',
  '{"foo": "bar"}',
  '["one", "two"]',
  '{"a": "b", "c": "d"}',
  '[null,false,true]',
  '{"foo": true, "bar": false, "baz": null}',
  '[1, 0, -1, -0.3, 0.3, 1343.32, 3345, 0.00011999999999999999]',
  '{"boolean, true": true, "boolean, false": false, "null": null }',

  // basic nesting
  '{"a":{"b":"c"}}',
  '{"a":["b", "c"]}',
  '[{"a":"b"}, {"c":"d"}]',
  '{"a":[],"c": {}, "b": true}',
  '[[[["foo"]]]]',

  // escaping
  '["\\\\\\"\\"a\\""]',
  '["and you can\'t escape thi\s"]',

  // everything all at once
  '{"CoreletAPIVersion":2,"CoreletType":"standalone",' +
    '"documentation":"A corelet that provides the capability to upload' +
    ' a folderâ€™s contents into a userâ€™s locker.","functions":[' +
    '{"documentation":"Displays a dialog box that allows user to ' +
    'select a folder on the local system.","name":' +
    '"ShowBrowseDialog","parameters":[{"documentation":"The ' +
    'callback function for results.","name":"callback","required":' +
    'true,"type":"callback"}]},{"documentation":"Uploads all mp3 files' +
    ' in the folder provided.","name":"UploadFolder","parameters":' +
    '[{"documentation":"The path to upload mp3 files from."' +
    ',"name":"path","required":true,"type":"string"},{"documentation":' +
    ' "The callback function for progress.","name":"callback",' +
    '"required":true,"type":"callback"}]},{"documentation":"Returns' +
    ' the server name to the current locker service.",' +
    '"name":"GetLockerService","parameters":[]},{"documentation":' +
    '"Changes the name of the locker service.","name":"SetLockerSer' +
    'vice","parameters":[{"documentation":"The value of the locker' +
    ' service to set active.","name":"LockerService","required":true' +
    ',"type":"string"}]},{"documentation":"Downloads locker files to' +
    ' the suggested folder.","name":"DownloadFile","parameters":[{"' +
    'documentation":"The origin path of the locker file.",' +
    '"name":"path","required":true,"type":"string"},{"documentation"' +
    ':"The Window destination path of the locker file.",' +
    '"name":"destination","required":true,"type":"integer"},{"docum' +
    'entation":"The callback function for progress.","name":' +
    '"callback","required":true,"type":"callback"}]}],' +
    '"name":"LockerUploader","version":{"major":0,' +
    '"micro":1,"minor":0},"versionString":"0.0.1"}',
  '{ "firstName": "John", "lastName" : "Smith", "age" : ' +
    '25, "address" : { "streetAddress": "21 2nd Street", ' +
    '"city" : "New York", "state" : "NY", "postalCode" : ' +
    ' "10021" }, "phoneNumber": [ { "type" : "home", ' +
    '"number": "212 555-1234" }, { "type" : "fax", ' +
    '"number": "646 555-4567" } ] }',
  '{\r\n' +
    '          "glossary": {\n' +
    '              "title": "example glossary",\n\r' +
    '      \t\t"GlossDiv": {\r\n' +
    '                  "title": "S",\r\n' +
    '      \t\t\t"GlossList": {\r\n' +
    '                      "GlossEntry": {\r\n' +
    '                          "ID": "SGML",\r\n' +
    '      \t\t\t\t\t"SortAs": "SGML",\r\n' +
    '      \t\t\t\t\t"GlossTerm": "Standard Generalized ' +
    'Markup Language",\r\n' +
    '      \t\t\t\t\t"Acronym": "SGML",\r\n' +
    '      \t\t\t\t\t"Abbrev": "ISO 8879:1986",\r\n' +
    '      \t\t\t\t\t"GlossDef": {\r\n' +
    '                              "para": "A meta-markup language,' +
    ' used to create markup languages such as DocBook.",\r\n' +
    '      \t\t\t\t\t\t"GlossSeeAlso": ["GML", "XML"]\r\n' +
    '                          },\r\n' +
    '      \t\t\t\t\t"GlossSee": "markup"\r\n' +
    '                      }\r\n' +
    '                  }\r\n' +
    '              }\r\n' +
    '          }\r\n' +
    '      }\r\n'
];

// for (var i=6; i<7; i++) {
// 	console.log('mine', parseJSON(parseableStrings[i]));
// 	console.log('correct', JSON.parse(parseableStrings[i]))
// }
