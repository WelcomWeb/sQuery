(function(name, definition) {
    if (typeof module != 'undefined') {
        module.exports = definition();
    } else if (typeof define == 'function' && typeof define.amd == 'object') {
        define(definition);
    } else {
        this[name] = definition();
    }
}('sTest', function () {

	var

	VERSION = '0.0.1',

	_types = {
		FUNCTION: '[object Function]',
		STRING: '[object String]',
		ARRAY: '[object Array]',
		NUMBER: '[object Number]'
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

	_getType = function(obj){
		return Object.prototype.toString.call(obj);	
	},

	_testFunction = function(actual, expected){
		return actu
	},

	_testSimple = function(actual, expected){

	},

	_testArray = function(actual, expected){

	},

	_tests = [],

	_add = function(actual, expected){
		_tests.push(new _test(actual, expected));
	},

	_test = function(actual, expected, name){

		var _actual = actual;
		var _expected = expected;
		var _type = _getType(actual);
		var _name = name;

		this.result = 'Not runned yet';

		this.test = function(){

			switch(_type){
				case _types.FUNCTION:
					this.result = _testFunction(_actual, _expected);
				case _types.STRING:
				case _types.NUMBER:
					this.result = _testSimple(_actual, _expected);
				case _types.ARRAY:
					this.result = _testArray(_actual, _expected);
				default:
					this.result = null;
			}

			return this.result.name = _name;
		}

	},

	_run = function(resultContainer){

	}

	window.sTest = {
		test: _add,
		run: _run
	};

}));