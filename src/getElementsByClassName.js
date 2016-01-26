// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className){
  
  // start our search at the node document.body so that we search through all the nodes
  var node = document.body;
  // an array to store all the nodes that have a class named className
  var hasClass = [];

  // create an inner function that will search through all the nodes and determine if they have a class named className
  function traverse(node) {
  	// check if node has className
  	if (node.classList && node.classList.contains(className)) {
  		// if it does add it to hasClass
  		hasClass.push(node);
  	}
  	// loop through all the nodes children
  	for (var i=0; i<node.children.length; i++) {
  		// recursively call traverse on each child node
  		traverse(node.children[i])
  	}
  }
  
  // invoke traverse on the document body so it will begin searching from the top
  traverse(node);

  // return the array storing all the nodes that have a class named className
  return hasClass;

};
