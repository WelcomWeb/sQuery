# sQuery

Small framework removing old browsers shortcomings and simplify DOM queries.

## Usage

    var sQuery = require('sQuery') with commonJS. Or just <script type="text/javascript" src="sQuery.js"></script> in your .html and use $([selector]), the rest is history... But, everything is not like jQuery, refer to the documentation for details.

## Chainable

	All methods not returning anything returns the object on which the method applied to.

## Selector

	It's possible to select DOM nodes like:

	$([selector])

	**selector**
	*	string describing the nodes. Strings that work with standard querySelectorAll works with sQuery
	*	DOM node
	*	Array of DOM nodes

## Methods

	At the moment the following methods are available on a sQuery object.

	*	each([callback]): Loop through all DOM nodes in a sQuery object.

	*	addClass([className]): Add css class to each element in the set of matched elements.
	*	removeClass([className]): Add css class from each element in the set of matched elements.
	*	toggleClass([className]): Toggle css class on and off for each element in the set of matched elements.
	*	hasClass([className]): Returns true if all elements in the matched set of elements has given class name, otherwise returns false.

	*	children([selector]): Get the children of each element in the set of matched elements, optionally filtered by a selector.
	*	parent([selector]): Get the parent of each element in the current set of matched elements, optionally filtered by a selector. 
	*	filter([selector]): Reduce the set of matched elements to those that match the selector.

	*	on([eventName], callback): Attach an event handler function for each element in the set of matched elements.

