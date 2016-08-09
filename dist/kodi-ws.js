(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["KodiWS"] = factory();
	else
		root["KodiWS"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = connect;
	
	var _Connection = __webpack_require__(1);
	
	var _Connection2 = _interopRequireDefault(_Connection);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function connect(host, port) {
	  return new Promise(function (resolve, reject) {
	    var connection = new _Connection2.default(host, port);
	
	    connection.on('error', reject);
	    connection.on('connect', function () {
	      // Remove the handler so we dont try to reject on any later errors
	      connection.removeListener('error', reject);
	
	      resolve(connection);
	    });
	  });
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _events = __webpack_require__(2);
	
	var _jrpcSchema = __webpack_require__(3);
	
	var _jrpcSchema2 = _interopRequireDefault(_jrpcSchema);
	
	var _hasValue = __webpack_require__(21);
	
	var _hasValue2 = _interopRequireDefault(_hasValue);
	
	var _setValue = __webpack_require__(26);
	
	var _setValue2 = _interopRequireDefault(_setValue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var WebSocket = window.WebSocket;
	
	var CONNECTING = 0;
	// const OPEN = 1
	// const CLOSING = 2
	// const CLOSED = 3
	
	var Connection = function (_EventEmitter) {
	  _inherits(Connection, _EventEmitter);
	
	  function Connection() {
	    var host = arguments.length <= 0 || arguments[0] === undefined ? '127.0.0.1' : arguments[0];
	    var port = arguments.length <= 1 || arguments[1] === undefined ? 9090 : arguments[1];
	    var timeout = arguments.length <= 2 || arguments[2] === undefined ? 500 : arguments[2];
	
	    _classCallCheck(this, Connection);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Connection).call(this));
	
	    _this.socket = new WebSocket('ws://' + host + ':' + port + '/jsonrpc');
	    _this.closed = true;
	    _this.timeout = timeout;
	    _this.init();
	    return _this;
	  }
	
	  _createClass(Connection, [{
	    key: 'init',
	    value: function init() {
	      var _this2 = this;
	
	      this.socket.onopen = function () {
	        _this2.loadSchema().then(function (schema) {
	          var _context;
	
	          _this2.socket.onmessage = function (data) {
	            console.log(data);
	          };
	
	          _this2.schema = new _jrpcSchema2.default.Schema(schema, (_context = _this2.socket, _this2.socket.send).bind(_context));
	
	          _this2.socket.onmessage = function (_ref) {
	            var data = _ref.data;
	
	            try {
	              _this2.schema.handleResponse(data);
	            } catch (err) {
	              err.message = 'Failed to handle response: ' + err.message;
	              _this2.emit('error', err);
	            }
	          };
	
	          _this2.addShortcuts();
	          _this2.closed = false;
	
	          _this2.emit('connect');
	        }).catch(function (err) {
	          err.message = 'Schema error: ' + err.message;
	          _this2.emit('error', err);
	        });
	      };
	
	      this.socket.onclose = function () {
	        _this2.close = true;
	        _this2.emit('close');
	      };
	
	      this.socket.onerror = function (err) {
	        if (!_this2.socketTimedOut) {
	          console.log(err);
	          _this2.emit('error');
	        }
	      };
	
	      setTimeout(function () {
	        if (_this2.socket.readyState === CONNECTING) {
	          _this2.emit('error', new Error('Timed out'));
	          _this2.socketTimedOut = true;
	        }
	      }, this.timeout);
	    }
	  }, {
	    key: 'loadSchema',
	    value: function loadSchema() {
	      var _context2,
	          _this3 = this;
	
	      var fetchSchema = _jrpcSchema2.default.run('JSONRPC.Introspect', [], (_context2 = this.socket, this.socket.send).bind(_context2));
	      this.socket.onmessage = function (_ref2) {
	        var data = _ref2.data;
	        return fetchSchema.handle(data);
	      };
	
	      return fetchSchema.then(function (schema) {
	        _this3.socket.onmessage = null;
	        return schema;
	      });
	    }
	  }, {
	    key: 'addShortcuts',
	    value: function addShortcuts() {
	      var _this4 = this;
	
	      var _schema$schema = this.schema.schema;
	      var methods = _schema$schema.methods;
	      var notifications = _schema$schema.notifications;
	
	
	      Object.keys(methods).forEach(function (method) {
	        if (!(0, _hasValue2.default)(_this4, method)) {
	          (0, _setValue2.default)(_this4, method, methods[method]);
	        }
	      });
	
	      Object.keys(notifications).forEach(function (method) {
	        if (!(0, _hasValue2.default)(_this4, method)) {
	          (0, _setValue2.default)(_this4, method, notifications[method]);
	        }
	      });
	    }
	  }, {
	    key: 'batch',
	    value: function batch() {
	      var rawBatch = this.schema.batch();
	      var batch = {
	        send: rawBatch.send.bind(rawBatch)
	      };
	
	      var methods = rawBatch.schema.methods;
	
	
	      Object.keys(methods).forEach(function (method) {
	        if (!(0, _hasValue2.default)(batch, method)) {
	          (0, _setValue2.default)(batch, method, methods[method]);
	        }
	      });
	
	      return batch;
	    }
	  }, {
	    key: 'run',
	    value: function run(method) {
	      if (!this.schema) throw new Error('Connection not initialized!');
	
	      var args = Array.prototype.slice.call(arguments, 1);
	      var methods = this.schema.schema.methods;
	
	      return methods[method].apply(methods, args);
	    }
	  }, {
	    key: 'notification',
	    value: function notification(method) {
	      var _this5 = this;
	
	      return new Promise(function (resolve, reject) {
	        if (!_this5.schema) return reject('Connection not initialized!');
	
	        _this5.schema.schema.notifications[method](resolve);
	      });
	    }
	  }]);
	
	  return Connection;
	}(_events.EventEmitter);
	
	exports.default = Connection;

/***/ },
/* 2 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var uid = -1;
	var Schema = __webpack_require__(4);
	
	module.exports = {
		Schema: Schema,
		run: function(name, args, run) {
			var id = uid--;
			run(Schema.methodToJSON(name, args, id));
	
			var resolver;
			var rejecter;
			var promise = new Promise(function(resolve, reject) {
				resolver = resolve;
				rejecter = reject;
			});
	
			promise.handle = function(response) {
				var res = JSON.parse(response);
	
				if(res.id === id) {
					if(res.error) {
						var error = new Error('Server responded with error: ' + res.error.message);
						error.resonse = res.error;
	
						rejecter(error);
					} else {
						resolver(res.result);
					}
				}
			};
	
			return promise;
		}
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var skeemas = __webpack_require__(5);
	var EventEmitter = __webpack_require__(2).EventEmitter;
	
	function Schema(schema, handler, parent) {
		var id = 1;
	
		/* If we have a parent, use its ids */
		this.id = function() { return parent ? parent.id() : id++; };
		this.ids = parent ? parent.ids : new EventEmitter();
		this.cbs = [];
	
		/* If we have a parent, create a queue we run in batch mode */
		this.queue = parent ? [] : false;
		this.handler = handler;
		this.rawSchema = schema;
		this.validator = skeemas();
		this.validator.addRef(schema);
		this.notifications = new EventEmitter();
	
		this.schema = this.shortcutGenericSchema(schema);
	}
	
	/* Create a batch schema from ourself */
	Schema.prototype.batch = function() {
		return new Schema(this.rawSchema, this.handler, this);
	};
	
	/* If we are a batch schema, this is used to send all queued requests at once */
	Schema.prototype.send = function() {
		if(!this.queue) throw new Error('.send() can only be called in batch mode!');
	
		/* Send a batch of data */
		this.handler(JSON.stringify(this.queue));
		this.queue = [];
	};
	
	//Parses a schema regardless of type
	Schema.prototype.shortcutSchema = function(schema, name) {
		if(schema.type) {
			switch(schema.type) {
				case 'method':
					//Return the created method
					return this.createMethod(name, schema);
	
				case 'notification':
					//Return a bound notification
					return this.notifications.on.bind(this.notifications, name);
	
				default:
					//Do not assume any type
					return this.shortcutGenericSchema(schema);
			}
		} else {
			return this.shortcutGenericSchema(schema);
		}
	};
	
	//Parses a schema with no type
	Schema.prototype.shortcutGenericSchema = function(schema) {
		var self = this;
	
		//We want to return a validator function for our schema
		var result = function(data) {
			return self.validator.validate(data, schema).valid;
		};
	
		Object.keys(schema).forEach(function(prop) {
			var child = schema[prop];
	
			if(typeof child === 'object' && child !== null && !Array.isArray(child)) {
				result[prop] = self.shortcutSchema(child, prop);
			}
		});
	
		return result;
	};
	
	Schema.prototype.handleResponse = function(response) {
		try {
			var parsed = JSON.parse(response);
	
			/* If we have an array, we got a batch result, so normalize and iterate over all result objects */
			var results = Array.isArray(parsed) ? parsed : [parsed];
	
			results.forEach(function(result) {
				//Check if response contains an id
				if(result.id) {
					this.ids.emit(result.id, result);
					this.ids.removeAllListeners(result.id);
				} else {
					this.notifications.emit(result.method, result.params);
				}
			}, this);
		} catch (err) {
			if(this.onerror) {
				this.onerror(err);
			} else {
				throw err;
			}
		}
	};
	
	Schema.prototype.createMethod = function(name) {
		var self = this;
	
		return function(args) {
			if(arguments.length > 1) {
				args = Array.prototype.slice.call(arguments);
			} else if(typeof args === 'undefined') {
				args = {};
			} else if(typeof args !== 'object') {
				args = [args];
			}
	
			//Return a promise
			return new Promise(function(resolve, reject) {
				//Get a unique id
				var id = self.id();
	
				//Resolve the promise once we get a response with the correct id
				self.ids.on(id, function(result) {
					if(result.error) {
						var error = new Error('Server responded with error: ' + result.error.message);
						error.response = result.error;
	
						reject(error);
					} else {
						resolve(result.result);
					}
				});
	
				//Run or queue the method
				if(self.queue) {
					self.queue.push(Schema.methodToObject(name, args, id));
				} else {
					self.handler(Schema.methodToJSON(name, args, id));
				}
			});
		};
	};
	
	Schema.methodToObject = function(name, args, id) {
		return {
			id: id,
			jsonrpc: '2.0',
			method: name,
			params: args
		};
	};
	
	Schema.methodToJSON = function(name, args, id) {
		return JSON.stringify(Schema.methodToObject(name, args, id));
	};
	
	module.exports = Schema;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var validators = __webpack_require__(6),
		validationContext = __webpack_require__(17),
		jsonRefs = __webpack_require__(19);
	
	var protoValidator = {
		addRef: function(uri, ref) {
			if(typeof uri === 'object') {
				ref = uri;
				uri = null;
			}
			uri = uri || ref.id;
	
			if(!uri) throw new Error('Cannot add a json schema reference without a uri/id.');
	
			this._refs.add(uri, ref);
	
			return this;
		},
		validate: function(instance, schema, options) {
			if(instance === undefined) throw new Error('Instance undefined in call to validate.');
			if(!schema) throw new Error('No schema specified in call to validate.');
	
			if(typeof schema === 'string') {
				var uri = schema;
				schema = this._refs.get(uri);
	
				if(!schema) throw new Error('Unable to locate schema (' + uri + '). Did you call addRef with this schema?');
			}
	
			var context = validationContext(schema, {
				instance: instance,
				refs: this._refs,
				breakOnError: options && options.breakOnError,
				cleanWithDefaults: options && options.cleanWithDefaults
			});
			validators.base(context, instance, schema);
			if(context.result.valid) context.result.cleanInstance = context.cleanSubject;
			return context.result;
		}
	};
	
	function makeValidator() {
		return Object.create(protoValidator, {
			_refs: { enumerable:false, writable:false, value:jsonRefs() }
		});
	}
	
	module.exports = makeValidator;
	
	module.exports.validate = function(instance, schema, options) {
		if(instance === undefined) throw new Error('Instance undefined in call to validate.');
		if(!schema) throw new Error('No schema specified in call to validate.');
	
		var context = validationContext(schema, {
			instance: instance,
			breakOnError: options && options.breakOnError,
			cleanWithDefaults: options && options.cleanWithDefaults
		});
		validators.base(context, instance, schema);
		if(context.result.valid) context.result.cleanInstance = context.cleanSubject;
		return context.result;
	};
	
	module.exports.use = function(plugin) {
		if(typeof plugin !== 'function') throw new Error('skeemas.use called with non-function. Plugins are in the form function(skeemas){}.');
		plugin(protoValidator);
		return this;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	exports.types = {
		'any': function() { return true; },
		'array': __webpack_require__(7),
		'boolean': __webpack_require__(10),
		'integer': __webpack_require__(11),
		'null': __webpack_require__(12),
		'number': __webpack_require__(11),
		'object': __webpack_require__(13),
		'string': __webpack_require__(14)
	};
	
	exports.deepEqual = __webpack_require__(9);
	
	// base cannot be required until other validators are added
	exports.base = __webpack_require__(8);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var validateBase = __webpack_require__(8),
		deepEqual = __webpack_require__(9);
	
	function items(context, subject, schema, cleanItems) {
		var valid = true;
	
		if(Array.isArray(schema.items)) {
			valid = tupleItems(context, subject, schema, cleanItems);
			if('additionalItems' in schema) valid = additionalItems(context, subject, schema, cleanItems) && valid;
		} else if(schema.items) {
			valid = itemSchema(context, subject, schema, cleanItems);
		}
	
		return valid;
	}
	
	function itemSchema(context, subject, schema, cleanItems) {
		var items = schema.items;
	
		if(typeof items !== 'object')
			throw new Error('Invalid schema: invalid "items"');
	
		var lastPath = context.path.length;
		for(var i = 0, len = subject.length; i < len; i++) {
			context.path[lastPath] = i;
			if(!validateBase(context, subject[i], items)) {
				context.addError('Failed "items" criteria', subject, items);
				context.path.length = lastPath;
				return false;
			}
			cleanItems.push(context.cleanSubject);
		}
		context.path.length = lastPath;
	
		return true;
	}
	
	function tupleItems(context, subject, schema, cleanItems) {
		var items = schema.items,
			lastPath = context.path.length;
		for(var i = 0, len = items.length; i < len; i++) {
			context.path[lastPath] = i;
			if(!validateBase(context, subject[i], items[i])) {
				context.addError('Failed "items" criteria', subject, items);
				context.path.length = lastPath;
				return false;
			}
			cleanItems.push(context.cleanSubject);
		}
		context.path.length = lastPath;
	
		return true;
	}
	
	function additionalItems(context, subject, schema, cleanItems) {
		var i = schema.items.length,
			len = subject.length,
			additionalItemSchema = schema.additionalItems;
	
		if(additionalItemSchema === false) {
			if(len <= i) return true;
	
			context.addError('Failed "additionalItems" criteria: no additional items are allowed', subject, schema);
			return false;
		}
	
		if(typeof additionalItemSchema !== 'object')
			throw new Error('Invalid schema: invalid "additionalItems"');
	
		var lastPath = context.path.length;
		for(; i < len; i++) {
			context.path[lastPath] = i;
			if(!validateBase(context, subject[i], additionalItemSchema)) {
				context.addError('Failed "additionalItems" criteria', subject, schema);
				context.path.length = lastPath;
				return false;
			}
			cleanItems.push(context.cleanSubject);
		}
		context.path.length = lastPath;
	
		return true;
	}
	
	function minItems(context, subject, schema) {
		if(subject.length < schema.minItems) {
			context.addError('Failed "minItems" criteria', subject, schema);
			return false;
		}
	
		return true;
	}
	
	function maxItems(context, subject, schema) {
		if(subject.length > schema.maxItems) {
			context.addError('Failed "maxItems" criteria', subject, schema);
			return false;
		}
	
		return true;
	}
	
	function uniqueItems(context, subject, schema) {
		var i = subject.length, j;
	
		while(i--) {
			j = i;
			while(j--) {
				if(deepEqual(subject[i], subject[j])) {
					context.addError('Failed "uniqueItems" criteria', subject, schema);
					return false;
				}
			}
		}
	
		return true;
	}
	
	
	module.exports = function(context, subject, schema) {
		if(!Array.isArray(subject)) {
			context.addError('Failed type:array criteria', schema);
			return false;
		}
	
		var cleanItems = [],
			valid = context.runValidations([
				[ 'minItems' in schema, minItems ],
				[ 'maxItems' in schema, maxItems ],
				[ 'uniqueItems' in schema, uniqueItems ],
				[ 'items' in schema, items ]
			], subject, schema, cleanItems);
	
		if('items' in schema)
			context.cleanSubject = cleanItems;
		else
			context.cleanSubject = subject.slice();
	
		return valid;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var validators = __webpack_require__(6),
		formats = {
			'date-time': /^\d{4}-(0[0-9]{1}|1[0-2]{1})-[0-9]{2}[t ]\d{2}:\d{2}:\d{2}(\.\d+)?([zZ]|[+-]\d{2}:\d{2})$/i,
			'date': /^\d{4}-(0[0-9]{1}|1[0-2]{1})-[0-9]{2}$/,
			'time': /^\d{2}:\d{2}:\d{2}$/,
			'color': /^(#[0-9a-f]{3}|#[0-9a-f]{6}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow)$/i,
			'style': /^(?:\s*-?[_A-Z]+[_A-Z0-9-]*:[^\n\r\f;]+;)*\s*-?[_A-Z]+[_A-Z0-9-]*:[^\n\r\f;]+;?\s*$/i,
			'phone': /^(?:(?:\(?(?:00|\+)(?:[1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?(?:(?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(?:\d+))?$/i,
			'uri': /^(?:([a-z0-9+.-]+:\/\/)((?:(?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(:(?:\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|([a-z0-9+.-]+:)(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(\?(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?(#(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?$/i,
			'email': /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i,
			'ipv4': /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
			'ipv6': /^\s*((([0-9A-F]{1,4}:){7}([0-9A-F]{1,4}|:))|(([0-9A-F]{1,4}:){6}(:[0-9A-F]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-F]{1,4}:){5}(((:[0-9A-F]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-F]{1,4}:){4}(((:[0-9A-F]{1,4}){1,3})|((:[0-9A-F]{1,4})((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-F]{1,4}:){3}(((:[0-9A-F]{1,4}){1,4})|((:[0-9A-F]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-F]{1,4}:){2}(((:[0-9A-F]{1,4}){1,5})|((:[0-9A-F]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-F]{1,4}:){1}(((:[0-9A-F]{1,4}){1,6})|((:[0-9A-F]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-F]{1,4}){1,7})|((:[0-9A-F]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/i,
	
			// hostname regex from: http://stackoverflow.com/a/1420225/5628
			'hostname': /^(?=.{1,255}$)[0-9A-Z](?:(?:[0-9A-Z]|-){0,61}[0-9A-Z])?(?:\.[0-9A-Z](?:(?:[0-9A-Z]|-){0,61}[0-9A-Z])?)*\.?$/i,
	
			'utc-millisec': function(subject) {
				var parsed = parseInt(subject, 10);
				return !isNaN(parsed) && parsed.toString() === subject.toString();
			},
			'regex': function (subject) {
				try { new RegExp(subject); }
				catch(e) { return false; }
				return true;
			}
		};
	
	// aliases
	formats['host-name'] = formats.hostname;
	formats['ip-address'] = formats.ipv4;
	
	
	function getType(subject) {
		var type = typeof subject;
	
		if(type === 'object') {
			if(subject === null) return 'null';
			if(Array.isArray(subject)) return 'array';
		}
	
		if(type === 'number' && subject === Math.round(subject)) return 'integer';
	
		return type;
	}
	
	function format(context, subject, schema) {
		var fmt = schema.format,
			validator = formats[fmt];
	
		if(!validator)
			throw new Error('Invalid schema: unknown format (' + fmt + ')');
	
		var valid = validator.test ? validator.test(subject) : validator(subject);
		if(!valid) {
			context.addError('Failed "format" criteria (' + fmt + ')', subject, schema);
		}
	
		return valid;
	}
	
	function validateTypes(context, subject, type, validTypes) {
		var i = validTypes.length,
			validType, valid;
		while(i--) {
			validType = validTypes[i];
	
			if(validType === 'any') return true;
	
			if(typeof validType === 'object') {
				valid = context.silently(function() {
					return validateBase(context, subject, validType);
				}); // jshint ignore:line
				if(valid) return true;
				else continue;
			}
	
			if(!(validType in validators.types))
				throw new Error('Invalid schema: invalid type (' + validType + ')');
	
			if(validType === 'number' && type === 'integer') return true;
	
			if(type === validType) return true;
		}
	
		return false;
	}
	
	function allOf(context, subject, schema) {
		var schemas = schema.allOf;
	
		if(!Array.isArray(schemas))
			throw new Error('Invalid schema: "allOf" value must be an array');
	
		var i = schemas.length,
			invalidCount = 0;
		while(i--) {
			if(!validateBase(context, subject, schemas[i])) {
				invalidCount += 1;
			}
		}
	
		if(invalidCount === 0) return true;
	
		context.addError('Failed "allOf" criteria', subject, schemas);
		return false;
	}
	
	function anyOf(context, subject, schema) {
		var schemas = schema.anyOf;
	
		if(!Array.isArray(schemas))
			throw new Error('Invalid schema: "anyOf" value must be an array');
	
		var matched = context.silently(function() {
			var i = schemas.length;
			while(i--) {
				if(validateBase(context, subject, schemas[i])) return true;
			}
			return false;
		});
	
		if(matched) return true;
	
		context.addError('Failed "anyOf" criteria', subject, schemas);
		return false;
	}
	
	function oneOf(context, subject, schema) {
		var schemas = schema.oneOf;
	
		if(!Array.isArray(schemas))
			throw new Error('Invalid schema: "oneOf" value must be an array');
	
		var i = schemas.length,
			validCount = 0;
		context.silently(function() {
			while(i--) {
				if(validateBase(context, subject, schemas[i])) validCount += 1;
			}
		});
	
		if(validCount === 1) return true;
	
		context.addError('Failed "oneOf" criteria', subject, schemas);
		return false;
	}
	
	function not(context, subject, schema) {
		var badSchema = schema.not,
			valid = context.silently(function() {
				return !validateBase(context, subject, badSchema);
			});
	
		if(valid) return true;
	
		context.addError('Failed "not" criteria', subject, schema);
		return false;
	}
	
	function disallow(context, subject, schema, type) {
		var invalidTypes = Array.isArray(schema.disallow) ? schema.disallow : [ schema.disallow ],
			valid = !validateTypes(context, subject, type, invalidTypes);
	
		if(!valid) {
			context.addError('Failed "disallow" criteria: expecting ' + invalidTypes.join(' or ') + ', found ' + type, subject, schema);
		}
	
		return valid;
	}
	
	function validateExtends(context, subject, schema) {
		var schemas = Array.isArray(schema["extends"]) ? schema["extends"] : [ schema["extends"] ];
	
		var i = schemas.length,
			invalidCount = 0;
		while(i--) {
			if(!validateBase(context, subject, schemas[i])) {
				invalidCount += 1;
			}
		}
	
		return invalidCount === 0;
	}
	
	function validateEnum(context, subject, schema) {
		var values = schema['enum'];
	
		if(!Array.isArray(values))
			throw new Error('Invalid schema: "enum" value must be an array');
	
		var i = values.length;
		while(i--) {
			if(validators.deepEqual(subject, values[i])) return true;
		}
	
		context.addError('Failed "enum" criteria', subject, values);
		return false;
	}
	
	function validateType(context, subject, schema, type) {
		var validTypes = Array.isArray(schema.type) ? schema.type : [ schema.type ],
			valid = validateTypes(context, subject, type, validTypes);
	
		if(!valid) {
			context.addError('Failed "type" criteria: expecting ' + validTypes.join(' or ') + ', found ' + type, subject, schema);
		}
	
		return valid;
	}
	
	function typeValidations(context, subject, schema, type) {
		return validators.types[type](context, subject, schema);
	}
	
	function $ref(context, subject, schema) {
		var absolute = /^#|\//.test(schema.$ref),
			ref = absolute ? schema.$ref : context.id.join('') + schema.$ref,
			refSchema = context.refs.get(ref, context.schema),
			ctx = context;
	
		if(schema.$ref[0] !== '#') {
			ctx = context.subcontext(context.refs.get(ref, context.schema, true));
		}
	
		var valid = validateBase(ctx, subject, refSchema);
	
		context.cleanSubject = ctx.cleanSubject;
	
		return valid;
	}
	
	
	
	function validateBase(context, subject, schema) {
		if(schema.$ref) {
			return $ref(context, subject, schema);
		}
	
		if(schema.id) context.id.push(schema.id);
	
		var valid = context.runValidations([
			[ 'type' in schema, validateType ],
			[ 'disallow' in schema, disallow ],
			[ 'enum' in schema, validateEnum ],
			[ true, typeValidations ],
			[ 'format' in schema, format ],
			[ 'extends' in schema, validateExtends ],
			[ 'allOf' in schema, allOf ],
			[ 'anyOf' in schema, anyOf ],
			[ 'oneOf' in schema, oneOf ],
			[ 'not' in schema, not ]
		], subject, schema, getType(subject));
	
		if(schema.id) context.id.pop();
	
		return valid;
	}
	
	module.exports = validateBase;


/***/ },
/* 9 */
/***/ function(module, exports) {

	function getType(subject) {
		var type = typeof subject;
	
		if(type === 'object') {
			if(subject === null) return 'null';
			if(Array.isArray(subject)) return 'array';
		}
		return type;
	}
	
	function arrayEqual(a, b) {
		var i = a.length;
	
		if(i !== b.length) return false;
	
		while(i--) {
			if(!deepEqual(a[i], b[i])) return false;
		}
	
		return true;
	}
	
	function objectEqual(a, b) {
		var keys = Object.keys(a),
			i = keys.length;
	
		if(i !== Object.keys(b).length) return false;
	
		while(i--) {
			if(!deepEqual(a[keys[i]], b[keys[i]])) return false;
		}
	
		return true;
	}
	
	var deepEqual = module.exports = function(a, b) {
		if(a === b) return true;
	
		var t = getType(a);
	
		if(t !== getType(b)) return false;
	
		if(t === 'array') return arrayEqual(a, b);
		if(t === 'object') return objectEqual(a, b);
	
		return false;
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	function validateBoolean(context, subject, schema) {
		if(typeof subject !== 'boolean') {
			context.addError('Failed type:boolean criteria', subject, schema);
			return false;
		}
	
		context.cleanSubject = subject;
	
		return true;
	}
	
	module.exports = validateBoolean;


/***/ },
/* 11 */
/***/ function(module, exports) {

	function validateNumber(context, subject, schema) {
		if(typeof subject !== 'number') {
			context.addError('Failed type:number criteria', subject, schema);
			return false;
		}
	
		return true;
	}
	
	function validateInteger(context, subject, schema) {
		if(typeof subject !== 'number' || subject !== Math.round(subject)) {
			context.addError('Failed type:integer criteria', subject, schema);
			return false;
		}
	
		return true;
	}
	
	function minimum(context, subject, schema) {
		var valid = (schema.exclusiveMinimum) ? subject > schema.minimum : subject >= schema.minimum;
	
		if(!valid) context.addError('Failed "minimum" criteria', subject, schema);
	
		return valid;
	}
	
	function maximum(context, subject, schema) {
		var valid = (schema.exclusiveMaximum) ? subject < schema.maximum : subject <= schema.maximum;
	
		if(!valid) context.addError('Failed "maximum" criteria', subject, schema);
	
		return valid;
	}
	
	function multipleOf(context, subject, schema, key) {
		key = key || 'multipleOf';
	
		var valid = (subject / schema[key] % 1) === 0;
	
		if(!valid) context.addError('Failed "' + key + '" criteria', subject, schema);
	
		return valid;
	}
	
	function divisibleBy(context, subject, schema) {
		return multipleOf(context, subject, schema, 'divisibleBy');
	}
	
	
	
	module.exports = function(context, subject, schema) {
		var valid = true,
			isType = true;
	
		if(schema.type === 'number') isType = validateNumber(context, subject, schema);
		if(schema.type === 'integer') isType = validateInteger(context, subject, schema);
	
		context.cleanSubject = subject;
	
		return isType && context.runValidations([
			[ 'minimum' in schema, minimum ],
			[ 'maximum' in schema, maximum ],
			[ 'multipleOf' in schema, multipleOf ],
			[ 'divisibleBy' in schema, divisibleBy ]
		], subject, schema);
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	function validateNull(context, subject, schema) {
		if(subject !== null) {
			context.addError('Failed type:null criteria', subject, schema);
			return false;
		}
	
		context.cleanSubject = subject;
	
		return true;
	}
	
	module.exports = validateNull;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var validateBase = __webpack_require__(8);
	
	function properties(context, subject, schema, handledProps) {
		var props = schema.properties,
			valid = true;
		for(var key in props) {
			if(key in subject) {
				context.path.push(key);
				valid = validateBase(context, subject[key], props[key]) && valid;
				context.path.pop();
				handledProps[key] = context.cleanSubject;
			} else if(props[key].required === true) {
				context.addError('Failed "required" criteria: missing property (' + key + ')', subject, props);
				valid = false;
			}
		}
	
		return valid;
	}
	
	function patternProperties(context, subject, schema, handledProps) {
		var patternProps = schema.patternProperties;
	
		if(typeof patternProps !== 'object')
			throw new Error('Invalid schema: "patternProperties" must be an object');
	
		var valid = true,
			patterns = Object.keys(patternProps),
			len = patterns.length,
			keys = Object.keys(subject),
			i = keys.length,
			j, key;
	
		while(i--) {
			key = keys[i];
	
			j = len;
			while(j--) {
				if(key.match(patterns[j])) {
					context.path.push(key);
					valid = validateBase(context, subject[key], patternProps[patterns[j]]) && valid;
					context.path.pop();
					if(!(key in handledProps)) handledProps[key] = context.cleanSubject;
				}
			}
		}
	
		return valid;
	}
	
	function additionalProperties(context, subject, schema, handledProps) {
		var additionalProps = schema.additionalProperties;
	
		if(additionalProps === true) return true;
	
		var keys = Object.keys(subject),
			i = keys.length;
		if(additionalProps === false) {
			while(i--) {
				if(!(keys[i] in handledProps)) {
					context.addError('Failed "additionalProperties" criteria: unexpected property (' + keys[i] + ')', subject, schema);
					return false;
				}
			}
			return true;
		}
	
		if(typeof additionalProps !== 'object')
			throw new Error('Invalid schema: "additionalProperties" must be a valid schema');
	
		var valid;
		while(i--) {
			if(keys[i] in handledProps) continue;
	
			context.path.push(keys[i]);
			valid = validateBase(context, subject[keys[i]], additionalProps) && valid;
			context.path.pop();
			handledProps[keys[i]] = context.cleanSubject;
		}
	
		return valid;
	}
	
	function minProperties(context, subject, schema) {
		var keys = Object.keys(subject);
		if(keys.length < schema.minProperties) {
			context.addError('Failed "minProperties" criteria', subject, schema);
			return false;
		}
		return true;
	}
	
	function maxProperties(context, subject, schema) {
		var keys = Object.keys(subject);
		if(keys.length > schema.maxProperties) {
			context.addError('Failed "maxProperties" criteria', subject, schema);
			return false;
		}
		return true;
	}
	
	function required(context, subject, schema) {
		var requiredProps = schema.required;
	
		if(!Array.isArray(requiredProps))
			throw new Error('Invalid schema: "required" must be an array');
	
		var valid = true,
			i = requiredProps.length;
		while(i--) {
			if(!(requiredProps[i] in subject)) {
				context.addError('Missing required property "' + requiredProps[i] + '"', subject, requiredProps[i]);
				valid = false;
			}
		}
	
		return valid;
	}
	
	function dependencies(context, subject, schema) {
		var deps = schema.dependencies;
	
		if(typeof deps !== 'object')
			throw new Error('Invalid schema: "dependencies" must be an object');
	
		var valid = true,
			keys = Object.keys(deps),
			i = keys.length,
			requiredProps, j;
	
		while(i--) {
			if(!(keys[i] in subject)) continue;
	
			requiredProps = deps[keys[i]];
	
			if(typeof requiredProps === 'string') requiredProps = [ requiredProps ];
	
			if(Array.isArray(requiredProps)) {
				j = requiredProps.length;
				while(j--) {
					if(!(requiredProps[j] in subject)) {
						context.addError('Missing required property "' + requiredProps[j] + '"', subject, requiredProps[j]);
						valid = false;
					}
				}
			} else if(typeof requiredProps === 'object') {
				valid = validateBase(context, subject, requiredProps) && valid;
			} else {
				throw new Error('Invalid schema: dependencies must be string, array, or object');
			}
		}
	
		return valid;
	}
	
	function addDefaults(subject, schema) {
		var props = schema.properties;
	
		if(!props) return;
	
		for(var key in props) {
			if('default' in props[key] && !(key in subject)) {
				subject[key] = props[key].default;
			}
		}
	}
	
	
	function validateObject(context, subject, schema) {
		if(typeof subject !== 'object') {
			context.addError('Failed type:object criteria', subject, schema);
			return false;
		}
	
		var handledProps = {},
			valid = context.runValidations([
				[ 'properties' in schema, properties ],
				[ 'patternProperties' in schema, patternProperties ],
				[ 'additionalProperties' in schema, additionalProperties ],
				[ 'minProperties' in schema, minProperties ],
				[ 'maxProperties' in schema, maxProperties ],
				[ Array.isArray(schema.required), required ],
				[ 'dependencies' in schema, dependencies ]
			], subject, schema, handledProps);
	
		if(context.cleanWithDefaults) addDefaults(handledProps, schema);
	
		context.cleanSubject = handledProps;
	
		return valid;
	}
	
	module.exports = validateObject;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var decode = __webpack_require__(15).ucs2.decode;
	
	
	function minLength(context, subject, schema) {
		if(decode(subject).length < schema.minLength) {
			context.addError('Failed "minLength" criteria', subject, schema);
			return false;
		}
	
		return true;
	}
	
	function maxLength(context, subject, schema) {
		if(decode(subject).length > schema.maxLength) {
			context.addError('Failed "maxLength" criteria', subject, schema);
			return false;
		}
	
		return true;
	}
	
	function pattern(context, subject, schema) {
		var strPattern = schema.pattern;
	
		if(!subject.match(strPattern)) {
			context.addError('Failed "pattern" criteria (' + strPattern + ')', subject, strPattern);
			return false;
		}
	
		return true;
	}
	
	
	
	function validateString(context, subject, schema) {
		if(typeof subject !== 'string') {
			context.addError('Failed type:string criteria', schema);
			return false;
		}
	
		context.cleanSubject = subject;
	
		return context.runValidations([
			[ 'minLength' in schema, minLength ],
			[ 'maxLength' in schema, maxLength ],
			[ 'pattern' in schema, pattern ]
		], subject, schema);
	}
	
	module.exports = validateString;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.4.1 by @mathias */
	;(function(root) {
	
		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}
	
		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,
	
		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1
	
		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'
	
		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators
	
		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},
	
		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,
	
		/** Temporary variable */
		key;
	
		/*--------------------------------------------------------------------------*/
	
		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw new RangeError(errors[type]);
		}
	
		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}
	
		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}
	
		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}
	
		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}
	
		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}
	
		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}
	
		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * https://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}
	
		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;
	
			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.
	
			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}
	
			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}
	
			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.
	
			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
	
				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {
	
					if (index >= inputLength) {
						error('invalid-input');
					}
	
					digit = basicToDigit(input.charCodeAt(index++));
	
					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}
	
					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
	
					if (digit < t) {
						break;
					}
	
					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}
	
					w *= baseMinusT;
	
				}
	
				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);
	
				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}
	
				n += floor(i / out);
				i %= out;
	
				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);
	
			}
	
			return ucs2encode(output);
		}
	
		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;
	
			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);
	
			// Cache the length
			inputLength = input.length;
	
			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;
	
			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}
	
			handledCPCount = basicLength = output.length;
	
			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.
	
			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}
	
			// Main encoding loop:
			while (handledCPCount < inputLength) {
	
				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}
	
				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}
	
				delta += (m - n) * handledCPCountPlusOne;
				n = m;
	
				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];
	
					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}
	
					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}
	
						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}
	
				++delta;
				++n;
	
			}
			return output.join('');
		}
	
		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}
	
		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}
	
		/*--------------------------------------------------------------------------*/
	
		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.4.1',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};
	
		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) {
				// in Node.js, io.js, or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else {
				// in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else {
			// in Rhino or a web browser
			root.punycode = punycode;
		}
	
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)(module), (function() { return this; }())))

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var validationResult = __webpack_require__(18),
		jsonRefs = __webpack_require__(19);
	
	var protoContext = {
		addError: function(message, subject, criteria) {
			if(!this.silent) this.result.addError(message, subject, criteria, this);
			return this;
		},
		silently: function(fn) {
			this.silent = true;
			var result = fn();
			this.silent = false;
			return result;
		},
		subcontext: function(schema) {
			return makeContext(schema, this, this.silent);
		},
		runValidations: function(validations, subject, schema) {
			var breakOnError = this.breakOnError,
				args = Array.prototype.slice.call(arguments),
				valid = true,
				validation;
	
			args[0] = this;
	
			for(var i = 0, len = validations.length; i < len; i++) {
				validation = validations[i];
				if(!validation[0]) continue;
				valid = validation[1].apply(null, args) && valid;
				if(breakOnError && !valid) return false;
			}
	
			return valid;
		}
	};
	
	var makeContext = module.exports = function(schema, context, forceNewResult) {
		context = context || {};
		return Object.create(protoContext, {
			id: { enumerable:true, writable:false, value: [] },
			schema: { enumerable:true, writable:false, value: schema || context.schema },
			path: { enumerable:true, writable:false, value: context.path && context.path.slice() || ['#'] },
			result: { enumerable:true, writable:false, value: (!forceNewResult && context.result) || validationResult(context.instance) },
			refs: { enumerable:true, writable:false, value: context.refs || jsonRefs() },
			silent: { enumerable:true, writable:true, value: false },
			breakOnError: { enumerable:true, writable:true, value: context.breakOnError || false },
			cleanWithDefaults: { enumerable:true, writable:true, value: context.cleanWithDefaults || false },
			cleanSubject: { enumerable:true, writable:true, value: undefined }
		});
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	function errorToString() {
		return this.message + ' (pointer: ' + this.context + ')';
	}
	
	var protoValidationResult = {
		addError: function(message, subject, criteria, context) {
			this.errors.push({
				message: message,
				context: context.path.join('/'),
				value: subject,
				criteria: criteria,
				toString: errorToString
			});
			this.valid = false;
			return this;
		}
	};
	
	module.exports = function(instance) {
		return Object.create(protoValidationResult, {
			instance: { enumerable:true, writable:false, value:instance },
			cleanInstance: { enumerable:true, writable:true, value: undefined },
			valid: { enumerable:true, writable:true, value:true },
			errors: { enumerable:true, writable:false, value:[] }
		});
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var jsonPointer = __webpack_require__(20);
	
	var protoJsonRefs = {
		add: function(uri, subject) {
			if(typeof uri !== 'string')
				throw new Error('Unable to add JSON Ref: uri must be of type "string"');
	
			if(~uri.indexOf('#'))
				throw new Error('Unable to add JSON Ref (' + uri + '): uri cannot include a fragment identifier (#)');
	
			this.__refs[uri] = subject;
			return this;
		},
	
		remove: function(uri) {
			delete this.__refs[uri];
			return this;
		},
	
		get: function(uri, subject, ignoreFragment) {
			if(typeof uri !== 'string')
				throw new Error('Unable to get JSON Ref: uri must be of type "string"');
	
			var parts = uri.split('#');
	
			if(parts.length > 2)
				throw new Error('Unable to get JSON Ref (' + uri + '): uri cannot contain multiple fragment identifiers (#)');
	
			if(parts[0])
				subject = this.__refs[parts[0]];
	
			if(!subject)
				throw new Error('Unable to locate JSON Ref (' + parts[0] + ')');
	
			if(parts.length === 1 || ignoreFragment)
				return subject;
	
			return jsonPointer(parts[1]).get(subject);
		}
	};
	
	module.exports = function() {
		return Object.create(protoJsonRefs, {
			__refs: { writable:false, configurable:false, enumerable:false, value: {} }
		});
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	function fastMap(array, fn) {
		var len = array.length,
			result = new Array(len);
	
		for(var i = 0; i < len; i++) result[i] = fn(array[i]);
	
		return result;
	}
	
	function decodeToken(ref) {
		return decodeURI(ref.replace(/~1/g, '/').replace(/~0/g, '~'));
	}
	
	function parse(strPointer) {
		if(typeof strPointer !== 'string')
			throw new Error('Invalid JSON Pointer: invalid type (' + (typeof strPointer) + ')');
	
		// Remove the leading hash if it exists
		var arrPointer = fastMap((strPointer[0] === '#' ? strPointer.substr(1) : strPointer).split('/'), decodeToken);
	
		if(arrPointer[0] !== '')
			throw new Error('Invalid JSON Pointer ("' + strPointer + '"): non-empty pointers must begin with "/" or "#/"');
	
		return arrPointer;
	}
	
	function get(arrPointer, subject) {
		for(var i = 1, len = arrPointer.length; i < len; i++) {
			subject = subject && subject[arrPointer[i]];
			if(subject === undefined) return;
		}
		return subject;
	}
	
	function set(arrPointer, subject, value) {
		for(var i = 1, len = arrPointer.length - 1; i < len; i++) {
			subject = (subject || undefined) && subject[arrPointer[i]];
			if(subject === undefined) return false;
		}
	
		if(typeof subject !== 'object') return false;
	
		var key = arrPointer[i];
		if(key === '-') {
			if(!Array.isArray(subject)) return false;
			subject[subject.length] = value;
			return true;
		}
	
		subject[key] = value;
		return true;
	}
	
	var protoPointer = {
		get: function(subject) {
			return get(this.__arrPointer, subject);
		},
		set: function(subject, value) {
			return set(this.__arrPointer, subject, value);
		}
	};
	
	module.exports = function(sPointer) {
		return Object.create(protoPointer, {
			__sPointer: { writable:false, configurable:false, enumerable:false, value: sPointer },
			__arrPointer: { writable:false, configurable:false, enumerable:false, value: parse(sPointer) }
		});
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * has-value <https://github.com/jonschlinkert/has-value>
	 *
	 * Copyright (c) 2014-2016, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */
	
	'use strict';
	
	var isObject = __webpack_require__(22);
	var hasValues = __webpack_require__(24);
	var get = __webpack_require__(25);
	
	module.exports = function(obj, prop, noZero) {
	  if (isObject(obj)) {
	    return hasValues(get(obj, prop), noZero);
	  }
	  return hasValues(obj, prop);
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * isobject <https://github.com/jonschlinkert/isobject>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */
	
	'use strict';
	
	var isArray = __webpack_require__(23);
	
	module.exports = function isObject(val) {
	  return val != null && typeof val === 'object' && isArray(val) === false;
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 24 */
/***/ function(module, exports) {

	/*!
	 * has-values <https://github.com/jonschlinkert/has-values>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */
	
	'use strict';
	
	module.exports = function hasValue(o, noZero) {
	  if (o === null || o === undefined) {
	    return false;
	  }
	
	  if (typeof o === 'boolean') {
	    return true;
	  }
	
	  if (typeof o === 'number') {
	    if (o === 0 && noZero === true) {
	      return false;
	    }
	    return true;
	  }
	
	  if (o.length !== undefined) {
	    return o.length !== 0;
	  }
	
	  for (var key in o) {
	    if (o.hasOwnProperty(key)) {
	      return true;
	    }
	  }
	  return false;
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	/*!
	 * get-value <https://github.com/jonschlinkert/get-value>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */
	
	module.exports = function(obj, prop, a, b, c) {
	  if (!isObject(obj) || !prop) {
	    return obj;
	  }
	
	  prop = toString(prop);
	
	  // allowing for multiple properties to be passed as
	  // a string or array, but much faster (3-4x) than doing
	  // `[].slice.call(arguments)`
	  if (a) prop += '.' + toString(a);
	  if (b) prop += '.' + toString(b);
	  if (c) prop += '.' + toString(c);
	
	  if (prop in obj) {
	    return obj[prop];
	  }
	
	  var segs = prop.split('.');
	  var len = segs.length;
	  var i = -1;
	
	  while (obj && (++i < len)) {
	    var key = segs[i];
	    while (key[key.length - 1] === '\\') {
	      key = key.slice(0, -1) + '.' + segs[++i];
	    }
	    obj = obj[key];
	  }
	  return obj;
	};
	
	function isObject(val) {
	  return val !== null && (typeof val === 'object' || typeof val === 'function');
	}
	
	function toString(val) {
	  if (!val) return '';
	  if (Array.isArray(val)) {
	    return val.join('.');
	  }
	  return val;
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * set-value <https://github.com/jonschlinkert/set-value>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */
	
	'use strict';
	
	var toPath = __webpack_require__(27);
	var extend = __webpack_require__(30);
	var isObject = __webpack_require__(22);
	
	module.exports = function(obj, path, val) {
	  if (typeof obj !== 'object') {
	    return obj;
	  }
	
	  if (Array.isArray(path)) {
	    path = toPath(path);
	  }
	
	  if (typeof path !== 'string') {
	    return obj;
	  }
	
	  var segs = path.split('.');
	  var len = segs.length, i = -1;
	  var res = obj;
	  var last;
	
	  while (++i < len) {
	    var key = segs[i];
	
	    while (key[key.length - 1] === '\\') {
	      key = key.slice(0, -1) + '.' + segs[++i];
	    }
	
	    if (i === len - 1) {
	      last = key;
	      break;
	    }
	
	    if (typeof obj[key] !== 'object') {
	      obj[key] = {};
	    }
	    obj = obj[key];
	  }
	
	  if (obj.hasOwnProperty(last) && typeof obj[last] === 'object') {
	    if (isObject(val)) {
	      extend(obj[last], val);
	    } else {
	      obj[last] = val;
	    }
	
	  } else {
	    obj[last] = val;
	  }
	  return res;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * to-object-path <https://github.com/jonschlinkert/to-object-path>
	 *
	 * Copyright (c) 2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */
	
	'use strict';
	
	var isArguments = __webpack_require__(28);
	var flatten = __webpack_require__(29);
	
	module.exports = function toPath(args) {
	  if (isArguments(args)) {
	    args = [].slice.call(args);
	  } else {
	    args = [].slice.call(arguments);
	  }
	  return flatten(args).join('.');
	};


/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	
	var toStr = Object.prototype.toString;
	
	var isStandardArguments = function isArguments(value) {
		return toStr.call(value) === '[object Arguments]';
	};
	
	var isLegacyArguments = function isArguments(value) {
		if (isStandardArguments(value)) {
			return true;
		}
		return value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value) !== '[object Array]' &&
			toStr.call(value.callee) === '[object Function]';
	};
	
	var supportsStandardArguments = (function () {
		return isStandardArguments(arguments);
	}());
	
	isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests
	
	module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;


/***/ },
/* 29 */
/***/ function(module, exports) {

	/*!
	 * arr-flatten <https://github.com/jonschlinkert/arr-flatten>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */
	
	'use strict';
	
	module.exports = function flatten(arr) {
	  return flat(arr, []);
	};
	
	function flat(arr, res) {
	  var len = arr.length;
	  var i = -1;
	
	  while (len--) {
	    var cur = arr[++i];
	    if (Array.isArray(cur)) {
	      flat(cur, res);
	    } else {
	      res.push(cur);
	    }
	  }
	  return res;
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isObject = __webpack_require__(31);
	
	module.exports = function extend(o/*, objects*/) {
	  if (!isObject(o)) { o = {}; }
	
	  var len = arguments.length;
	  for (var i = 1; i < len; i++) {
	    var obj = arguments[i];
	
	    if (isObject(obj)) {
	      assign(o, obj);
	    }
	  }
	  return o;
	};
	
	function assign(a, b) {
	  for (var key in b) {
	    if (hasOwn(b, key)) {
	      a[key] = b[key];
	    }
	  }
	}
	
	/**
	 * Returns true if the given `key` is an own property of `obj`.
	 */
	
	function hasOwn(obj, key) {
	  return Object.prototype.hasOwnProperty.call(obj, key);
	}


/***/ },
/* 31 */
/***/ function(module, exports) {

	/*!
	 * is-extendable <https://github.com/jonschlinkert/is-extendable>
	 *
	 * Copyright (c) 2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */
	
	'use strict';
	
	module.exports = function isExtendable(val) {
	  return typeof val !== 'undefined' && val !== null
	    && (typeof val === 'object' || typeof val === 'function');
	};


/***/ }
/******/ ])
});
;
//# sourceMappingURL=kodi-ws.js.map