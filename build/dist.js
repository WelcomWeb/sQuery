(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(name, definition) {
    if (typeof module != 'undefined') {
        module.exports = definition();
    } else if (typeof define == 'function' && typeof define.amd == 'object') {
        define(definition);
    } else {
        this[name] = definition();
    }
}('sQuery', function () {

	var

	VERSION = '0.0.1',

	_types = {
		FUNCTION: '[object Function]',
		STRING: '[object String]',
		ARRAY: '[object Array]'
	},

	_isFunction = function(obj){
		return Object.prototype.toString.call(obj) === _types.FUNCTION;
	},

	_isString = function(obj){
		return Object.prototype.toString.call(obj) === _types.STRING;
	},

	_isElement = function(obj){
		return !!obj.nodeName && obj.nodeType === 1;
	},

	_isArray = function(obj){
		return Object.prototype.toString.call(obj) === _types.ARRAY;
	},

	_toArray = function(collection){
		if(!collection.length) return [];
		var arr = [];
		for(var i = 0; i < collection.length; i++){
			arr.push(collection[i]);
		}
		return arr;
	},

	_isInArray = function(array, test){

		if(!_isFunction(test)) return _indexOf(array, test) !== -1;

		for(var i = 0; i < array.length; i++){
			if(test.call(array[i], array[i], i)) return true;
		}

		return false;
	},

	_on = function(context, name, callback){

		if(!context) return;

		if(context.addEventListener) context.addEventListener(name, callback);
		else context.attachEvent('on' + name, callback);

	},

	_indexOf = function(array, test){
		var isFunction = _isFunction(test);

		if(!isFunction && !!array.indexOf) return array.indexOf(test);

		else if(!isFunction){
			for(var i = 0; i < array.length; i++){
				if(array[i] === test) return i;	
			}
			return -1;
		}

		for(var i = 0; i < array.length; i++){
			if(test(array, array[i], i)) return i;
		}

		return -1;

	},

	_addClass = function(el, className){

		if(!!el.classList) return el.classList.add(className);

		var classNames = el.className.split(' ');

		if(_indexOf(classNames) > -1) return;

		el.className += el.className + ' ' + className;

	},

	_removeClass = function(el, className){

		if(!!el.classList) return el.classList.remove(className);

		var classNames = el.className.split(' ');
		var index = _indexOf(classNames);
		
		if(index === -1) return;

		el.className = classNames.splice(index, 1).join(' ');

	},

	_hasClass = function(el, className){
		return _indexOf(el.className.split(' '), className) > -1;
	},

	_toggleClass = function(el, className){
		if(_hasClass(el, className)) _removeClass(el, className);
		else _addClass(el, className);
	},

	_children = function(context, selector){
		var arr = [];
		var childNodes = !!selector ? context.querySelectorAll(selector) : context.childNodes;
		for(var i = 0; i < childNodes.length; i++){
			if(childNodes[i].nodeType === 1 && childNodes[i].parentNode === context) arr.push(childNodes[i]);
		}
		return arr;
	},

	_find = function(context, selector){
		var arr = [];
		var childNodes = !!selector ? context.querySelectorAll(selector) : context.childNodes;
		for(var i = 0; i < childNodes.length; i++){
			if(childNodes[i].nodeType === 1) arr.push(childNodes[i]);
		}
		return arr;
	},

	_parent = function(context){
		return context.parentNode;
	},

	_parents = function(sqObj){
		var arr = _doForAll(sqObj, _parent);
		var uniques = [];
		for(var i = 0; i < arr.length; i++){
			if(!_isInArray(uniques, arr[i])) uniques.push(arr[i]);
		}
		return uniques;
	},

	_doForAll = function(){
		var args = _toArray(arguments);
		var returns = [];
		args[0].each(function(el){
			var ret = args[1].apply(args[0], [el].concat(args.slice(2)));

			if(_isArray(ret)) returns = returns.concat(ret);
			else returns.push(ret);
		});
		return returns;
	},

	sQuery = function(selector, context){
		return new sQuery.fn.init(selector, context);
	};

	sQuery.fn = sQuery.prototype = {

		each: function(callback){

			for(var i = 0; i < this.length; i++) callback.call(this[i], this[i], i);

		},

		addClass: function(className){
			_doForAll(this, _addClass, className);
			return this;
		},

		removeClass: function(className){
			_doForAll(this, _removeClass, className);
			return this;
		},

		toggleClass: function(className){
			_doForAll(this, _toggleClass, className);
			return this;
		},

		hasClass: function(className){
			_doForAll(this, _hasClass, className);
			return this;
		},

		on: function(eventName, callback){
			_doForAll(this, _on, eventName, callback);
			return this;
		},

		children: function(selector){
			var arr = _doForAll(this, _children, selector);
			return new sQuery.fn.init(arr);
		},

		find: function(selector){
			var arr = _doForAll(this, _find, selector);
			return new sQuery.fn.init(arr);
		},

		parent: function(){
			return new sQuery.fn.init(_parents(this));
		}

	};

	var init = sQuery.fn.init = function(selector, context){

		if(!selector) return this;

		if(_isFunction(selector)){
			sQuery.ready(selector);
			return;	
		} 

		var _context = context || document;

		var matches = [];

		this.length = 0;

		// String selector
		if(_isString(selector)) matches = _context.querySelectorAll(selector);

		// Selector is a DOM node
		else if(_isElement(selector)) matches = [selector];

		// Selector is array
		else if(_isArray(selector)){
			for(var i = 0; i < selector.length; i++){
				if(_isElement(selector[i])){
					this.length++;
					this[i] = selector[i];
				}
			}

			return this;
		}

		// Selector is nothing useful. Return empty this
		else return this;

		this.length = matches.length;

		for(var i = 0; i < matches.length; i++){
			this[i] = matches[i];
		}

		return this;

	};

	init.prototype = sQuery.fn;

	sQuery.ready = function(callback){
		_on(window, 'load', callback);
	}

	window.$ = sQuery;

}));
},{}]},{},[1]);
