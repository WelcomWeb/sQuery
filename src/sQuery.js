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

	_allTrue = function(array){
		for(var i = 0; i < array.length; i++){
			if(!array[i]) return false;
		}
		return true;
	},

	_matches = function(el, selector){

		if(!selector) return el;
		else if(!!el.matches) return el.matches(selector);

		var docMatches = document.querySelectorAll(selector);

		for(var i = 0; i < docMatches.length; i++){
			if(docMatches[i] === el) return true;
		}

		return false;

	},

	_on = function(context, name, callback){

		if(!context) return;

		var internalCallback = function(e){
			callback.call(context, e);
		}

		if(context.addEventListener) context.addEventListener(name, internalCallback);	
		else context.attachEvent('on' + name, internalCallback);

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

	_addClass = function(el, classNames){

		if(!classNames) return;

		if(!!el.classList) return DOMTokenList.prototype.add.apply(el.classList, classNames.split(' '));

		var existing = el.className.split(' ');

		if(_indexOf(existing) > -1) return;

		var classNameArr = classNames.split(' ');

		for(var i = 0; i < classNameArr.length; i++){
			if(_isInArray(existing, classNameArr[i])) continue;
			existing.push(classNameArr[i])
		}

		el.className = existing.join(' ');

	},

	_removeClass = function(el, classNames){

		if(!classNames) return;

		if(!!el.classList) return DOMTokenList.prototype.remove.apply(el.classList, classNames.split(' '));

		var existing = el.className.split(' ');
		var classNameArr = classNames.split(' ');

		for(var i = 0; i < classNameArr.length; i++){
			if(!_isInArray(existing, classNameArr[i])) continue;
			existing.splice(i)
		}

		el.className = existing.join(' ');

	},

	_hasClass = function(el, className){
		return _indexOf(el.className.split(' '), className) > -1;
	},

	_toggleClass = function(el, className){
		if(!className) return;
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

	_parent = function(context, selector){
		return context.parentNode;
	},

	_parents = function(sqObj, selector){
		var arr = _doForAll(sqObj, _parent);
		var uniques = [];
		for(var i = 0; i < arr.length; i++){
			if(!_isInArray(uniques, arr[i]) && _matches(arr[i], selector)) uniques.push(arr[i]);
		}
		return uniques;
	},

	_filter = function(sqObj, selector){
		var arr = [];
		for(var i = 0; i < sqObj.length; i++){
			if(_matches(sqObj[i])) arr.push(sqObj[i]);
		}
		return arr;
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
			return _allTrue(_doForAll(this, _hasClass, className));
			
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

		filter: function(selector){
			return new sQuery.fn.init(_filter(this, selector));
		},

		parent: function(selector){
			return new sQuery.fn.init(_parents(this, selector));
		},

		ready: function(callback){
			this.on('load', callback);
		}

	};

	var init = sQuery.fn.init = function(selector, context){

		if(!selector) return this;

		// Functions means it's short for 
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