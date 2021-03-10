// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"Style/Styles.css":[function(require,module,exports) {

},{}],"../node_modules/@pnp/common/util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCtxCallback = getCtxCallback;
exports.dateAdd = dateAdd;
exports.combine = combine;
exports.getRandomString = getRandomString;
exports.getGUID = getGUID;
exports.isFunc = isFunc;
exports.objectDefinedNotNull = objectDefinedNotNull;
exports.isArray = isArray;
exports.assign = assign;
exports.isUrlAbsolute = isUrlAbsolute;
exports.stringIsNullOrEmpty = stringIsNullOrEmpty;
exports.sanitizeGuid = sanitizeGuid;
exports.jsS = jsS;
exports.hOP = hOP;
exports.getHashCode = getHashCode;

/**
 * Gets a callback function which will maintain context across async calls.
 * Allows for the calling pattern getCtxCallback(thisobj, method, methodarg1, methodarg2, ...)
 *
 * @param context The object that will be the 'this' value in the callback
 * @param method The method to which we will apply the context and parameters
 * @param params Optional, additional arguments to supply to the wrapped method when it is invoked
 */
function getCtxCallback(context, method) {
  var params = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    params[_i - 2] = arguments[_i];
  }

  return function () {
    method.apply(context, params);
  };
}
/**
 * Adds a value to a date
 *
 * @param date The date to which we will add units, done in local time
 * @param interval The name of the interval to add, one of: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']
 * @param units The amount to add to date of the given interval
 *
 * http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
 */


function dateAdd(date, interval, units) {
  var ret = new Date(date.toString()); // don't change original date

  switch (interval.toLowerCase()) {
    case "year":
      ret.setFullYear(ret.getFullYear() + units);
      break;

    case "quarter":
      ret.setMonth(ret.getMonth() + 3 * units);
      break;

    case "month":
      ret.setMonth(ret.getMonth() + units);
      break;

    case "week":
      ret.setDate(ret.getDate() + 7 * units);
      break;

    case "day":
      ret.setDate(ret.getDate() + units);
      break;

    case "hour":
      ret.setTime(ret.getTime() + units * 3600000);
      break;

    case "minute":
      ret.setTime(ret.getTime() + units * 60000);
      break;

    case "second":
      ret.setTime(ret.getTime() + units * 1000);
      break;

    default:
      ret = undefined;
      break;
  }

  return ret;
}
/**
 * Combines an arbitrary set of paths ensuring and normalizes the slashes
 *
 * @param paths 0 to n path parts to combine
 */


function combine() {
  var paths = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    paths[_i] = arguments[_i];
  }

  return paths.filter(function (path) {
    return !stringIsNullOrEmpty(path);
  }).map(function (path) {
    return path.replace(/^[\\|\/]/, "").replace(/[\\|\/]$/, "");
  }).join("/").replace(/\\/g, "/");
}
/**
 * Gets a random string of chars length
 *
 * https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 *
 * @param chars The length of the random string to generate
 */


function getRandomString(chars) {
  var text = new Array(chars);

  for (var i = 0; i < chars; i++) {
    text[i] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 62));
  }

  return text.join("");
}
/**
 * Gets a random GUID value
 *
 * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */

/* tslint:disable no-bitwise */


function getGUID() {
  var d = Date.now();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : r & 0x3 | 0x8).toString(16);
  });
}
/* tslint:enable */

/**
 * Determines if a given value is a function
 *
 * @param cf The thing to test for functionness
 */


function isFunc(f) {
  return typeof f === "function";
}
/**
 * Determines if an object is both defined and not null
 * @param obj Object to test
 */


function objectDefinedNotNull(obj) {
  return typeof obj !== "undefined" && obj !== null;
}
/**
 * @returns whether the provided parameter is a JavaScript Array or not.
*/


function isArray(array) {
  return Array.isArray ? Array.isArray(array) : array && typeof array.length === "number" && array.constructor === Array;
}
/**
 * Provides functionality to extend the given object by doing a shallow copy
 *
 * @param target The object to which properties will be copied
 * @param source The source object from which properties will be copied
 * @param noOverwrite If true existing properties on the target are not overwritten from the source
 * @param filter If provided allows additional filtering on what properties are copied (propName: string) => boolean
 *
 */


function assign(target, source, noOverwrite, filter) {
  if (noOverwrite === void 0) {
    noOverwrite = false;
  }

  if (filter === void 0) {
    filter = function () {
      return true;
    };
  }

  if (!objectDefinedNotNull(source)) {
    return target;
  } // ensure we don't overwrite things we don't want overwritten


  var check = noOverwrite ? function (o, i) {
    return !(i in o);
  } : function () {
    return true;
  }; // final filter we will use

  var f = function (v) {
    return check(target, v) && filter(v);
  };

  return Object.getOwnPropertyNames(source).filter(f).reduce(function (t, v) {
    t[v] = source[v];
    return t;
  }, target);
}
/**
 * Determines if a given url is absolute
 *
 * @param url The url to check to see if it is absolute
 */


function isUrlAbsolute(url) {
  return /^https?:\/\/|^\/\//i.test(url);
}
/**
 * Determines if a string is null or empty or undefined
 *
 * @param s The string to test
 */


function stringIsNullOrEmpty(s) {
  return s === undefined || s === null || s.length < 1;
}
/**
 * Ensures guid values are represented consistently as "ea123463-137d-4ae3-89b8-cf3fc578ca05"
 *
 * @param guid The candidate guid
 */


function sanitizeGuid(guid) {
  if (stringIsNullOrEmpty(guid)) {
    return guid;
  }

  var matches = /([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i.exec(guid);
  return matches === null ? guid : matches[1];
}
/**
 * Shorthand for JSON.stringify
 *
 * @param o Any type of object
 */


function jsS(o) {
  return JSON.stringify(o);
}
/**
 * Shorthand for Object.hasOwnProperty
 *
 * @param o Object to check for
 * @param p Name of the property
 */


function hOP(o, p) {
  return Object.hasOwnProperty.call(o, p);
}
/**
 * Generates a ~unique hash code
 *
 * From: https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
 */
// tslint:disable:no-bitwise


function getHashCode(s) {
  var hash = 0;

  if (s.length === 0) {
    return hash;
  }

  for (var i = 0; i < s.length; i++) {
    var chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
} // tslint:enable:no-bitwise
},{}],"../node_modules/@pnp/common/collections.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectToMap = objectToMap;
exports.mergeMaps = mergeMaps;

var _util = require("./util");

/**
 * Used to calculate the object properties, with polyfill if needed
 */
var objectEntries = (0, _util.isFunc)(Object.entries) ? Object.entries : function (o) {
  return Object.keys(o).map(function (k) {
    return [k, o[k]];
  });
};
/**
 * Converts the supplied object to a map
 *
 * @param o The object to map
 */

function objectToMap(o) {
  if (o !== undefined && o !== null) {
    return new Map(objectEntries(o));
  }

  return new Map();
}
/**
 * Merges to Map instances together, overwriting values in target with matching keys, last in wins
 *
 * @param target map into which the other maps are merged
 * @param maps One or more maps to merge into the target
 */


function mergeMaps(target) {
  var maps = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    maps[_i - 1] = arguments[_i];
  }

  for (var i = 0; i < maps.length; i++) {
    maps[i].forEach(function (v, k) {
      target.set(k, v);
    });
  }

  return target;
}
},{"./util":"../node_modules/@pnp/common/util.js"}],"../node_modules/@pnp/common/libconfig.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;
exports.RuntimeConfig = exports.RuntimeConfigImpl = void 0;

var _collections = require("./collections");

function setup(config) {
  RuntimeConfig.assign(config);
} // lable mapping for known config values


var s = ["defaultCachingStore", "defaultCachingTimeoutSeconds", "globalCacheDisable", "enableCacheExpiration", "cacheExpirationIntervalMilliseconds", "spfxContext", "ie11"];

var RuntimeConfigImpl =
/** @class */
function () {
  function RuntimeConfigImpl(_v) {
    if (_v === void 0) {
      _v = new Map();
    }

    this._v = _v; // setup defaults

    this._v.set(s[0], "session");

    this._v.set(s[1], 60);

    this._v.set(s[2], false);

    this._v.set(s[3], false);

    this._v.set(s[4], 750);

    this._v.set(s[5], null);

    this._v.set(s[6], false);
  }
  /**
   *
   * @param config The set of properties to add to the globa configuration instance
   */


  RuntimeConfigImpl.prototype.assign = function (config) {
    this._v = (0, _collections.mergeMaps)(this._v, (0, _collections.objectToMap)(config));
  };

  RuntimeConfigImpl.prototype.get = function (key) {
    return this._v.get(key);
  };

  Object.defineProperty(RuntimeConfigImpl.prototype, "defaultCachingStore", {
    get: function () {
      return this.get(s[0]);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(RuntimeConfigImpl.prototype, "defaultCachingTimeoutSeconds", {
    get: function () {
      return this.get(s[1]);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(RuntimeConfigImpl.prototype, "globalCacheDisable", {
    get: function () {
      return this.get(s[2]);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(RuntimeConfigImpl.prototype, "enableCacheExpiration", {
    get: function () {
      return this.get(s[3]);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(RuntimeConfigImpl.prototype, "cacheExpirationIntervalMilliseconds", {
    get: function () {
      return this.get(s[4]);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(RuntimeConfigImpl.prototype, "spfxContext", {
    get: function () {
      return this.get(s[5]);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(RuntimeConfigImpl.prototype, "ie11", {
    get: function () {
      return this.get(s[6]);
    },
    enumerable: false,
    configurable: true
  });
  return RuntimeConfigImpl;
}();

exports.RuntimeConfigImpl = RuntimeConfigImpl;

var _runtimeConfig = new RuntimeConfigImpl();

var RuntimeConfig = _runtimeConfig;
exports.RuntimeConfig = RuntimeConfig;
},{"./collections":"../node_modules/@pnp/common/collections.js"}],"../node_modules/tslib/tslib.es6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__extends = __extends;
exports.__rest = __rest;
exports.__decorate = __decorate;
exports.__param = __param;
exports.__metadata = __metadata;
exports.__awaiter = __awaiter;
exports.__generator = __generator;
exports.__exportStar = __exportStar;
exports.__values = __values;
exports.__read = __read;
exports.__spread = __spread;
exports.__spreadArrays = __spreadArrays;
exports.__await = __await;
exports.__asyncGenerator = __asyncGenerator;
exports.__asyncDelegator = __asyncDelegator;
exports.__asyncValues = __asyncValues;
exports.__makeTemplateObject = __makeTemplateObject;
exports.__importStar = __importStar;
exports.__importDefault = __importDefault;
exports.__assign = void 0;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function () {
  exports.__assign = __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

exports.__assign = __assign;

function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
}

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}

function __exportStar(m, exports) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
  var m = typeof Symbol === "function" && o[Symbol.iterator],
      i = 0;
  if (m) return m.call(o);
  return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}

function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}

;

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;

  function verb(n) {
    if (g[n]) i[n] = function (v) {
      return new Promise(function (a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }

  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }

  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }

  function fulfill(value) {
    resume("next", value);
  }

  function reject(value) {
    resume("throw", value);
  }

  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function () {
    return this;
  }, i;

  function verb(n, f) {
    i[n] = o[n] ? function (v) {
      return (p = !p) ? {
        value: __await(o[n](v)),
        done: n === "return"
      } : f ? f(v) : v;
    } : f;
  }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
}

;

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result.default = mod;
  return result;
}

function __importDefault(mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
}
},{}],"../node_modules/@pnp/common/safe-global.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safeGlobal = void 0;
// export either window or global
var safeGlobal = typeof global === "undefined" ? window : global;
exports.safeGlobal = safeGlobal;
},{}],"../node_modules/@pnp/common/net.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeHeaders = mergeHeaders;
exports.mergeOptions = mergeOptions;
exports.getADALResource = getADALResource;
exports.SPFxAdalClient = exports.BearerTokenFetchClient = exports.FetchClient = void 0;

var _tslib = require("tslib");

var _util = require("./util");

var _safeGlobal = require("./safe-global");

function mergeHeaders(target, source) {
  if ((0, _util.objectDefinedNotNull)(source)) {
    var temp = new Request("", {
      headers: source
    });
    temp.headers.forEach(function (value, name) {
      target.append(name, value);
    });
  }
}

function mergeOptions(target, source) {
  if ((0, _util.objectDefinedNotNull)(source)) {
    var headers = (0, _util.assign)(target.headers || {}, source.headers);
    target = (0, _util.assign)(target, source);
    target.headers = headers;
  }
}
/**
 * Parses out the root of the request url to use as the resource when getting the token
 *
  * @param url The url to parse
 */


function getADALResource(url) {
  var u = new URL(url);
  return u.protocol + "//" + u.hostname;
}
/**
 * Makes requests using the global/window fetch API
 */


var FetchClient =
/** @class */
function () {
  function FetchClient() {}

  FetchClient.prototype.fetch = function (url, options) {
    return _safeGlobal.safeGlobal.fetch(url, options);
  };

  return FetchClient;
}();

exports.FetchClient = FetchClient;

/**
 * Makes requests using the fetch API adding the supplied token to the Authorization header
 */
var BearerTokenFetchClient =
/** @class */
function (_super) {
  (0, _tslib.__extends)(BearerTokenFetchClient, _super);

  function BearerTokenFetchClient(_token) {
    var _this = _super.call(this) || this;

    _this._token = _token;
    return _this;
  }

  Object.defineProperty(BearerTokenFetchClient.prototype, "token", {
    get: function () {
      return this._token || "";
    },
    set: function (token) {
      this._token = token;
    },
    enumerable: false,
    configurable: true
  });

  BearerTokenFetchClient.prototype.fetch = function (url, options) {
    if (options === void 0) {
      options = {};
    }

    var headers = new Headers();
    mergeHeaders(headers, options.headers);
    headers.set("Authorization", "Bearer " + this._token);
    options.headers = headers;
    return _super.prototype.fetch.call(this, url, options);
  };

  return BearerTokenFetchClient;
}(FetchClient);

exports.BearerTokenFetchClient = BearerTokenFetchClient;

/**
 * Client wrapping the aadTokenProvider available from SPFx >= 1.6
 */
var SPFxAdalClient =
/** @class */
function (_super) {
  (0, _tslib.__extends)(SPFxAdalClient, _super);
  /**
   *
   * @param context provide the appropriate SPFx Context object
   */

  function SPFxAdalClient(context) {
    var _this = _super.call(this, null) || this;

    _this.context = context;
    return _this;
  }
  /**
   * Executes a fetch request using the supplied url and options
   *
   * @param url Absolute url of the request
   * @param options Any options
   */


  SPFxAdalClient.prototype.fetch = function (url, options) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var token;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.getToken(getADALResource(url))];

          case 1:
            token = _a.sent();
            this.token = token;
            return [2
            /*return*/
            , _super.prototype.fetch.call(this, url, options)];
        }
      });
    });
  };
  /**
   * Gets an AAD token for the provided resource using the SPFx AADTokenProvider
   *
   * @param resource Resource for which a token is to be requested (ex: https://graph.microsoft.com)
   */


  SPFxAdalClient.prototype.getToken = function (resource) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var provider;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.context.aadTokenProviderFactory.getTokenProvider()];

          case 1:
            provider = _a.sent();
            return [2
            /*return*/
            , provider.getToken(resource)];
        }
      });
    });
  };

  return SPFxAdalClient;
}(BearerTokenFetchClient);

exports.SPFxAdalClient = SPFxAdalClient;
},{"tslib":"../node_modules/tslib/tslib.es6.js","./util":"../node_modules/@pnp/common/util.js","./safe-global":"../node_modules/@pnp/common/safe-global.js"}],"../node_modules/@pnp/common/storage.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PnPClientStorage = exports.PnPClientStorageWrapper = void 0;

var _tslib = require("tslib");

var _util = require("./util");

var _libconfig = require("./libconfig");

/**
 * A wrapper class to provide a consistent interface to browser based storage
 *
 */
var PnPClientStorageWrapper =
/** @class */
function () {
  /**
   * Creates a new instance of the PnPClientStorageWrapper class
   *
   * @constructor
   */
  function PnPClientStorageWrapper(store, defaultTimeoutMinutes) {
    if (defaultTimeoutMinutes === void 0) {
      defaultTimeoutMinutes = -1;
    }

    this.store = store;
    this.defaultTimeoutMinutes = defaultTimeoutMinutes;
    this.enabled = this.test(); // if the cache timeout is enabled call the handler
    // this will clear any expired items and set the timeout function

    if (_libconfig.RuntimeConfig.enableCacheExpiration) {
      this.cacheExpirationHandler();
    }
  }

  PnPClientStorageWrapper.bind = function (store) {
    return new PnPClientStorageWrapper(typeof store === "undefined" ? new MemoryStorage() : store);
  };
  /**
   * Get a value from storage, or null if that value does not exist
   *
   * @param key The key whose value we want to retrieve
   */


  PnPClientStorageWrapper.prototype.get = function (key) {
    if (!this.enabled) {
      return null;
    }

    var o = this.store.getItem(key);

    if (!(0, _util.objectDefinedNotNull)(o)) {
      return null;
    }

    var persistable = JSON.parse(o);

    if (new Date(persistable.expiration) <= new Date()) {
      this.delete(key);
      return null;
    } else {
      return persistable.value;
    }
  };
  /**
   * Adds a value to the underlying storage
   *
   * @param key The key to use when storing the provided value
   * @param o The value to store
   * @param expire Optional, if provided the expiration of the item, otherwise the default is used
   */


  PnPClientStorageWrapper.prototype.put = function (key, o, expire) {
    if (this.enabled) {
      this.store.setItem(key, this.createPersistable(o, expire));
    }
  };
  /**
   * Deletes a value from the underlying storage
   *
   * @param key The key of the pair we want to remove from storage
   */


  PnPClientStorageWrapper.prototype.delete = function (key) {
    if (this.enabled) {
      this.store.removeItem(key);
    }
  };
  /**
   * Gets an item from the underlying storage, or adds it if it does not exist using the supplied getter function
   *
   * @param key The key to use when storing the provided value
   * @param getter A function which will upon execution provide the desired value
   * @param expire Optional, if provided the expiration of the item, otherwise the default is used
   */


  PnPClientStorageWrapper.prototype.getOrPut = function (key, getter, expire) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var o;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.enabled) {
              return [2
              /*return*/
              , getter()];
            }

            o = this.get(key);
            if (!(o === null)) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , getter()];

          case 1:
            o = _a.sent();
            this.put(key, o, expire);
            _a.label = 2;

          case 2:
            return [2
            /*return*/
            , o];
        }
      });
    });
  };
  /**
   * Deletes any expired items placed in the store by the pnp library, leaves other items untouched
   */


  PnPClientStorageWrapper.prototype.deleteExpired = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var i, key;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.enabled) {
              return [2
              /*return*/
              ];
            }

            i = 0;
            _a.label = 1;

          case 1:
            if (!(i < this.store.length)) return [3
            /*break*/
            , 4];
            key = this.store.key(i);
            if (!(key !== null)) return [3
            /*break*/
            , 3];
            if (!/["|']?pnp["|']? ?: ?1/i.test(this.store.getItem(key))) return [3
            /*break*/
            , 3]; // get those items as get will delete from cache if they are expired

            return [4
            /*yield*/
            , this.get(key)];

          case 2:
            // get those items as get will delete from cache if they are expired
            _a.sent();

            _a.label = 3;

          case 3:
            i++;
            return [3
            /*break*/
            , 1];

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Used to determine if the wrapped storage is available currently
   */


  PnPClientStorageWrapper.prototype.test = function () {
    var str = "t";

    try {
      this.store.setItem(str, str);
      this.store.removeItem(str);
      return true;
    } catch (e) {
      return false;
    }
  };
  /**
   * Creates the persistable to store
   */


  PnPClientStorageWrapper.prototype.createPersistable = function (o, expire) {
    if (expire === undefined) {
      // ensure we are by default inline with the global library setting
      var defaultTimeout = _libconfig.RuntimeConfig.defaultCachingTimeoutSeconds;

      if (this.defaultTimeoutMinutes > 0) {
        defaultTimeout = this.defaultTimeoutMinutes * 60;
      }

      expire = (0, _util.dateAdd)(new Date(), "second", defaultTimeout);
    }

    return (0, _util.jsS)({
      pnp: 1,
      expiration: expire,
      value: o
    });
  };
  /**
   * Deletes expired items added by this library in this.store and sets a timeout to call itself
   */


  PnPClientStorageWrapper.prototype.cacheExpirationHandler = function () {
    var _this = this;

    if (!this.enabled) {
      return;
    }

    this.deleteExpired().then(function (_) {
      // call ourself in the future
      setTimeout((0, _util.getCtxCallback)(_this, _this.cacheExpirationHandler), _libconfig.RuntimeConfig.cacheExpirationIntervalMilliseconds);
    }).catch(console.error);
  };

  return PnPClientStorageWrapper;
}();

exports.PnPClientStorageWrapper = PnPClientStorageWrapper;

/**
 * A thin implementation of in-memory storage for use in nodejs
 */
var MemoryStorage =
/** @class */
function () {
  function MemoryStorage(_store) {
    if (_store === void 0) {
      _store = new Map();
    }

    this._store = _store;
  }

  Object.defineProperty(MemoryStorage.prototype, "length", {
    get: function () {
      return this._store.size;
    },
    enumerable: false,
    configurable: true
  });

  MemoryStorage.prototype.clear = function () {
    this._store.clear();
  };

  MemoryStorage.prototype.getItem = function (key) {
    return this._store.get(key);
  };

  MemoryStorage.prototype.key = function (index) {
    return Array.from(this._store)[index][0];
  };

  MemoryStorage.prototype.removeItem = function (key) {
    this._store.delete(key);
  };

  MemoryStorage.prototype.setItem = function (key, data) {
    this._store.set(key, data);
  };

  return MemoryStorage;
}();
/**
 * A class that will establish wrappers for both local and session storage
 */


var PnPClientStorage =
/** @class */
function () {
  /**
   * Creates a new instance of the PnPClientStorage class
   *
   * @constructor
   */
  function PnPClientStorage(_local, _session) {
    if (_local === void 0) {
      _local = null;
    }

    if (_session === void 0) {
      _session = null;
    }

    this._local = _local;
    this._session = _session;
  }

  Object.defineProperty(PnPClientStorage.prototype, "local", {
    /**
     * Provides access to the local storage of the browser
     */
    get: function () {
      if (this._local === null) {
        this._local = new PnPClientStorageWrapper(typeof localStorage === "undefined" ? new MemoryStorage() : localStorage);
      }

      return this._local;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(PnPClientStorage.prototype, "session", {
    /**
     * Provides access to the session storage of the browser
     */
    get: function () {
      if (this._session === null) {
        this._session = new PnPClientStorageWrapper(typeof sessionStorage === "undefined" ? new MemoryStorage() : sessionStorage);
      }

      return this._session;
    },
    enumerable: false,
    configurable: true
  });
  return PnPClientStorage;
}();

exports.PnPClientStorage = PnPClientStorage;
},{"tslib":"../node_modules/tslib/tslib.es6.js","./util":"../node_modules/@pnp/common/util.js","./libconfig":"../node_modules/@pnp/common/libconfig.js"}],"../node_modules/@pnp/common/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _collections = require("./collections");

Object.keys(_collections).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _collections[key];
    }
  });
});

var _libconfig = require("./libconfig");

Object.keys(_libconfig).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _libconfig[key];
    }
  });
});

var _net = require("./net");

Object.keys(_net).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _net[key];
    }
  });
});

var _spfxcontextinterface = require("./spfxcontextinterface");

Object.keys(_spfxcontextinterface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _spfxcontextinterface[key];
    }
  });
});

var _storage = require("./storage");

Object.keys(_storage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _storage[key];
    }
  });
});

var _util = require("./util");

Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _util[key];
    }
  });
});

var _safeGlobal = require("./safe-global");

Object.keys(_safeGlobal).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _safeGlobal[key];
    }
  });
});
},{"./collections":"../node_modules/@pnp/common/collections.js","./libconfig":"../node_modules/@pnp/common/libconfig.js","./net":"../node_modules/@pnp/common/net.js","./spfxcontextinterface":"Style/Styles.css","./storage":"../node_modules/@pnp/common/storage.js","./util":"../node_modules/@pnp/common/util.js","./safe-global":"../node_modules/@pnp/common/safe-global.js"}],"../node_modules/@pnp/sp/splibconfig.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;
exports.SPRuntimeConfig = exports.SPRuntimeConfigImpl = exports.emptyGuid = void 0;

var _common = require("@pnp/common");

var emptyGuid = "00000000-0000-0000-0000-000000000000";
exports.emptyGuid = emptyGuid;

function setup(config) {
  _common.RuntimeConfig.assign(config);
}

var SPRuntimeConfigImpl =
/** @class */
function () {
  function SPRuntimeConfigImpl() {}

  Object.defineProperty(SPRuntimeConfigImpl.prototype, "headers", {
    get: function () {
      var spPart = _common.RuntimeConfig.get("sp");

      if (spPart !== undefined && spPart.headers !== undefined) {
        return spPart.headers;
      }

      return {};
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SPRuntimeConfigImpl.prototype, "baseUrl", {
    get: function () {
      var spPart = _common.RuntimeConfig.get("sp");

      if (spPart !== undefined && spPart.baseUrl !== undefined) {
        return spPart.baseUrl;
      }

      if ((0, _common.objectDefinedNotNull)(_common.RuntimeConfig.spfxContext)) {
        return _common.RuntimeConfig.spfxContext.pageContext.web.absoluteUrl;
      }

      return null;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SPRuntimeConfigImpl.prototype, "fetchClientFactory", {
    get: function () {
      var spPart = _common.RuntimeConfig.get("sp");

      if (spPart !== undefined && spPart.fetchClientFactory !== undefined) {
        return spPart.fetchClientFactory;
      } else {
        return function () {
          return new _common.FetchClient();
        };
      }
    },
    enumerable: false,
    configurable: true
  });
  return SPRuntimeConfigImpl;
}();

exports.SPRuntimeConfigImpl = SPRuntimeConfigImpl;
var SPRuntimeConfig = new SPRuntimeConfigImpl();
exports.SPRuntimeConfig = SPRuntimeConfig;
},{"@pnp/common":"../node_modules/@pnp/common/index.js"}],"../node_modules/@pnp/sp/rest.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sp = exports.SPRest = void 0;

var _splibconfig = require("./splibconfig");

/**
 * Root of the SharePoint REST module
 */
var SPRest =
/** @class */
function () {
  /**
   * Creates a new instance of the SPRest class
   *
   * @param options Additional options
   * @param baseUrl A string that should form the base part of the url
   */
  function SPRest(_options, _baseUrl) {
    if (_options === void 0) {
      _options = {};
    }

    if (_baseUrl === void 0) {
      _baseUrl = "";
    }

    this._options = _options;
    this._baseUrl = _baseUrl;
  }
  /**
   * Configures instance with additional options and baseUrl.
   * Provided configuration used by other objects in a chain
   *
   * @param options Additional options
   * @param baseUrl A string that should form the base part of the url
   */


  SPRest.prototype.configure = function (options, baseUrl) {
    if (baseUrl === void 0) {
      baseUrl = "";
    }

    return new SPRest(options, baseUrl);
  };
  /**
   * Global SharePoint configuration options
   *
   * @param config The SharePoint configuration to apply
   */


  SPRest.prototype.setup = function (config) {
    if (config.pageContext) {
      (0, _splibconfig.setup)({
        spfxContext: config
      });
    } else {
      (0, _splibconfig.setup)(config);
    }
  };

  return SPRest;
}();

exports.SPRest = SPRest;
var sp = new SPRest();
exports.sp = sp;
},{"./splibconfig":"../node_modules/@pnp/sp/splibconfig.js"}],"../node_modules/@pnp/odata/batch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Batch = void 0;

var _common = require("@pnp/common");

var Batch =
/** @class */
function () {
  function Batch(_batchId) {
    if (_batchId === void 0) {
      _batchId = (0, _common.getGUID)();
    }

    this._batchId = _batchId;
    this._reqs = [];
    this._deps = [];
    this._rDeps = [];
    this._index = -1;
  }

  Object.defineProperty(Batch.prototype, "batchId", {
    get: function () {
      return this._batchId;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Batch.prototype, "requests", {
    /**
     * The requests contained in this batch
     */
    get: function () {
      // we sort these each time this is accessed
      return this._reqs.sort(function (info1, info2) {
        return info1.index - info2.index;
      });
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Not meant for use directly
   *
   * @param batchee The IQueryable for this batch to track in order
   */

  Batch.prototype.track = function (batchee) {
    batchee.data.batch = this; // we need to track the order requests are added to the batch to ensure we always
    // operate on them in order

    if (typeof batchee.data.batchIndex === "undefined" || batchee.data.batchIndex < 0) {
      batchee.data.batchIndex = ++this._index;
    }
  };
  /**
   * Adds the given request context to the batch for execution
   *
   * @param context Details of the request to batch
   */


  Batch.prototype.add = function (context) {
    var info = {
      id: context.requestId,
      index: context.batchIndex,
      method: context.method.toUpperCase(),
      options: context.options,
      parser: context.parser,
      reject: null,
      resolve: null,
      url: context.url
    }; // we create a new promise that will be resolved within the batch

    var p = new Promise(function (resolve, reject) {
      info.resolve = resolve;
      info.reject = reject;
    });

    this._reqs.push(info);

    return p;
  };
  /**
   * Adds a dependency insuring that some set of actions will occur before a batch is processed.
   * MUST be cleared using the returned resolve delegate to allow batches to run
   */


  Batch.prototype.addDependency = function () {
    var resolver = function () {
      return void 0;
    };

    this._deps.push(new Promise(function (resolve) {
      resolver = resolve;
    }));

    return resolver;
  };
  /**
   * The batch's execute method will not resolve util any promises added here resolve
   *
   * @param p The dependent promise
   */


  Batch.prototype.addResolveBatchDependency = function (p) {
    this._rDeps.push(p);
  };
  /**
   * Execute the current batch and resolve the associated promises
   *
   * @returns A promise which will be resolved once all of the batch's child promises have resolved
   */


  Batch.prototype.execute = function () {
    var _this = this; // we need to check the dependencies twice due to how different engines handle things.
    // We can get a second set of promises added during the first set resolving


    return Promise.all(this._deps).then(function () {
      return Promise.all(_this._deps);
    }).then(function () {
      return _this.executeImpl();
    }).then(function () {
      return Promise.all(_this._rDeps);
    }).then(function () {
      return void 0;
    });
  };

  return Batch;
}();

exports.Batch = Batch;
},{"@pnp/common":"../node_modules/@pnp/common/index.js"}],"../node_modules/@pnp/odata/caching.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CachingParserWrapper = exports.CachingOptions = void 0;

var _common = require("@pnp/common");

var CachingOptions =
/** @class */
function () {
  function CachingOptions(key, storeName, expiration) {
    if (storeName === void 0) {
      storeName = _common.RuntimeConfig.defaultCachingStore;
    }

    if (expiration === void 0) {
      expiration = (0, _common.dateAdd)(new Date(), "second", _common.RuntimeConfig.defaultCachingTimeoutSeconds);
    }

    this.key = key;
    this.storeName = storeName;
    this.expiration = expiration;
  }

  Object.defineProperty(CachingOptions.prototype, "store", {
    get: function () {
      if (this.storeName === "local") {
        return CachingOptions.storage.local;
      } else {
        return CachingOptions.storage.session;
      }
    },
    enumerable: false,
    configurable: true
  });
  CachingOptions.storage = new _common.PnPClientStorage();
  return CachingOptions;
}();

exports.CachingOptions = CachingOptions;

var CachingParserWrapper =
/** @class */
function () {
  function CachingParserWrapper(parser, cacheOptions) {
    this.parser = parser;
    this.cacheOptions = cacheOptions;
  }

  CachingParserWrapper.prototype.parse = function (response) {
    var _this = this;

    return this.parser.parse(response).then(function (r) {
      return _this.cacheData(r);
    });
  };

  CachingParserWrapper.prototype.cacheData = function (data) {
    if (this.cacheOptions.store !== null) {
      this.cacheOptions.store.put(this.cacheOptions.key, data, this.cacheOptions.expiration);
    }

    return data;
  };

  return CachingParserWrapper;
}();

exports.CachingParserWrapper = CachingParserWrapper;
},{"@pnp/common":"../node_modules/@pnp/common/index.js"}],"../node_modules/@pnp/odata/add-prop.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addProp = addProp;

/**
 * Adds a property to a target instance
 *
 * @param target The object to whose prototype we will add a property
 * @param name Property name
 * @param factory Factory method used to produce the property value
 * @param path Any additional path required to produce the value
 */
function addProp(target, name, factory, path) {
  Reflect.defineProperty(target.prototype, name, {
    configurable: true,
    enumerable: true,
    get: function () {
      return factory(this, path);
    }
  });
}
},{}],"../node_modules/@pnp/odata/invokable-extensions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extensionOrDefault = extensionOrDefault;
exports.applyFactoryExtensions = exports.enableExtensions = exports.disableExtensions = exports.clearGlobalExtensions = exports.extendFactory = exports.extendObj = exports.extendGlobal = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _enableExtensions = false;
var globaExtensions = [];
var ObjExtensionsSym = Symbol("__extensions");
/**
 * Creates global extensions across all invokable objects
 *
 * @param e The global extensions to apply
 */

var extendGlobal = function (e) {
  _enableExtensions = true;
  extendCol(globaExtensions, e);
};
/**
 * Applies the supplied extensions to a single instance
 *
 * @param target Object to which extensions are applied
 * @param extensions Extensions to apply
 */


exports.extendGlobal = extendGlobal;

var extendObj = function (target, extensions) {
  _enableExtensions = true;

  if (!Reflect.has(target, ObjExtensionsSym)) {
    Reflect.set(target, ObjExtensionsSym, []);
  }

  extendCol(Reflect.get(target, ObjExtensionsSym), extensions);
  return target;
};
/**
 * Allows applying extensions to all instances created from the supplied factory
 *
 * @param factory The Invokable Factory method to extend
 * @param extensions Extensions to apply
 */


exports.extendObj = extendObj;

var extendFactory = function (factory, extensions) {
  _enableExtensions = true;

  if (factory.__proto__[ObjExtensionsSym] === undefined) {
    factory.__proto__[ObjExtensionsSym] = [];
  }

  extendCol(factory.__proto__[ObjExtensionsSym], extensions);
};

exports.extendFactory = extendFactory;

function extendCol(a, e) {
  if ((0, _common.isArray)(e)) {
    // @ts-ignore
    a.push.apply(a, (0, _tslib.__spread)(e));
  } else {
    // @ts-ignore
    a.push(e);
  }
}
/**
 * Clears all global extensions
 */


var clearGlobalExtensions = function () {
  globaExtensions.length = 0;
};
/**
 * Disables all extensions
 */


exports.clearGlobalExtensions = clearGlobalExtensions;

var disableExtensions = function () {
  _enableExtensions = false;
};
/**
 * Enables all extensions
 */


exports.disableExtensions = disableExtensions;

var enableExtensions = function () {
  _enableExtensions = true;
};
/**
 * Applies a set of extension previously applied to a factory using extendFactory to an object created from that factory
 *
 * @param factory
 * @param args
 */


exports.enableExtensions = enableExtensions;

var applyFactoryExtensions = function (factory, args) {
  var o = factory(args);

  if (factory.__proto__[ObjExtensionsSym]) {
    o = extendObj(o, factory.__proto__[ObjExtensionsSym]);
  }

  return o;
};

exports.applyFactoryExtensions = applyFactoryExtensions;

function extensionOrDefault(op, or, target) {
  var rest = [];

  for (var _i = 3; _i < arguments.length; _i++) {
    rest[_i - 3] = arguments[_i];
  }

  if (_enableExtensions) {
    var extensions = []; // we need to first invoke extensions tied to only this object

    if (Reflect.has(target, ObjExtensionsSym)) {
      extensions.push.apply(extensions, (0, _tslib.__spread)(Reflect.get(target, ObjExtensionsSym)));
    } // second we need to process any global extensions


    extensions.push.apply(extensions, (0, _tslib.__spread)(globaExtensions));

    for (var i = 0; i < extensions.length; i++) {
      var extension = extensions[i];
      var result = undefined;

      if ((0, _common.isFunc)(extension)) {
        // this extension is a function which we call
        result = extension.apply(void 0, (0, _tslib.__spread)([op, target], rest));
      } else if (op === "get" && Reflect.has(extension, rest[0])) {
        // this extension is a named extension meaning we are overriding a specific method/property
        result = Reflect.get(extension, rest[0], target);
      } else if (Reflect.has(extension, op)) {
        // this extension is a ProxyHandler that has a handler defined for {op} so we pass control and see if we get a result
        result = Reflect.get(extension, op).apply(void 0, (0, _tslib.__spread)([target], rest));
      }

      if (typeof result !== "undefined") {
        // if a extension returned a result, we return that
        // this means that this extension overrides any other extensions and no more are executed
        // first extension in the list to return "wins"
        return result;
      }
    }
  }

  return or.apply(void 0, (0, _tslib.__spread)([target], rest));
}
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js"}],"../node_modules/@pnp/odata/invokable-binder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invokableFactory = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _invokableExtensions = require("./invokable-extensions");

var invokableBinder = function (invoker) {
  return function (constructor) {
    return function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      var factory = function (as) {
        var r = Object.assign(function () {
          var ags = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            ags[_i] = arguments[_i];
          }

          return invoker.apply(r, ags);
        }, new (constructor.bind.apply(constructor, (0, _tslib.__spread)([void 0], as)))());
        Reflect.setPrototypeOf(r, constructor.prototype);
        return r;
      };

      if (_common.RuntimeConfig.ie11) {
        return factory(args);
      } else {
        return new Proxy((0, _invokableExtensions.applyFactoryExtensions)(factory, args), {
          apply: function (target, _thisArg, argArray) {
            return (0, _invokableExtensions.extensionOrDefault)("apply", function () {
              var a = [];

              for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
              }

              return Reflect.apply(a[0], a[1], a[2]);
            }, target, _thisArg, argArray);
          },
          get: function (target, p, receiver) {
            return (0, _invokableExtensions.extensionOrDefault)("get", function () {
              var a = [];

              for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
              }

              return Reflect.get(a[0], a[1], a[2]);
            }, target, p, receiver);
          },
          has: function (target, p) {
            return (0, _invokableExtensions.extensionOrDefault)("has", function () {
              var a = [];

              for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
              }

              return Reflect.has(a[0], a[1]);
            }, target, p);
          },
          set: function (target, p, value, receiver) {
            return (0, _invokableExtensions.extensionOrDefault)("set", function () {
              var a = [];

              for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
              }

              return Reflect.set(a[0], a[1], a[2], a[3]);
            }, target, p, value, receiver);
          }
        });
      }
    };
  };
};

var invokableFactory = invokableBinder(function (options) {
  return this.defaultAction(options);
});
exports.invokableFactory = invokableFactory;
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","./invokable-extensions":"../node_modules/@pnp/odata/invokable-extensions.js"}],"../node_modules/@pnp/odata/parsers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpRequestError = exports.LambdaParser = exports.BufferParser = exports.JSONParser = exports.BlobParser = exports.TextParser = exports.ODataParser = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var ODataParser =
/** @class */
function () {
  function ODataParser() {}

  ODataParser.prototype.parse = function (r) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      if (_this.handleError(r, reject)) {
        _this.parseImpl(r, resolve, reject);
      }
    });
  };

  ODataParser.prototype.parseImpl = function (r, resolve, reject) {
    var _this = this;

    if (r.headers.has("Content-Length") && parseFloat(r.headers.get("Content-Length")) === 0 || r.status === 204) {
      resolve({});
    } else {
      // patch to handle cases of 200 response with no or whitespace only bodies (#487 & #545)
      r.text().then(function (txt) {
        return txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {};
      }).then(function (json) {
        return resolve(_this.parseODataJSON(json));
      }).catch(function (e) {
        return reject(e);
      });
    }
  };
  /**
   * Handles a response with ok === false by parsing the body and creating a ProcessHttpClientResponseException
   * which is passed to the reject delegate. This method returns true if there is no error, otherwise false
   *
   * @param r Current response object
   * @param reject reject delegate for the surrounding promise
   */


  ODataParser.prototype.handleError = function (r, reject) {
    if (!r.ok) {
      HttpRequestError.init(r).then(reject);
    }

    return r.ok;
  };
  /**
   * Normalizes the json response by removing the various nested levels
   *
   * @param json json object to parse
   */


  ODataParser.prototype.parseODataJSON = function (json) {
    var result = json;

    if ((0, _common.hOP)(json, "d")) {
      if ((0, _common.hOP)(json.d, "results")) {
        result = json.d.results;
      } else {
        result = json.d;
      }
    } else if ((0, _common.hOP)(json, "value")) {
      result = json.value;
    }

    return result;
  };

  return ODataParser;
}();

exports.ODataParser = ODataParser;

var TextParser =
/** @class */
function (_super) {
  (0, _tslib.__extends)(TextParser, _super);

  function TextParser() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  TextParser.prototype.parseImpl = function (r, resolve) {
    r.text().then(resolve);
  };

  return TextParser;
}(ODataParser);

exports.TextParser = TextParser;

var BlobParser =
/** @class */
function (_super) {
  (0, _tslib.__extends)(BlobParser, _super);

  function BlobParser() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  BlobParser.prototype.parseImpl = function (r, resolve) {
    r.blob().then(resolve);
  };

  return BlobParser;
}(ODataParser);

exports.BlobParser = BlobParser;

var JSONParser =
/** @class */
function (_super) {
  (0, _tslib.__extends)(JSONParser, _super);

  function JSONParser() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  JSONParser.prototype.parseImpl = function (r, resolve) {
    r.json().then(resolve);
  };

  return JSONParser;
}(ODataParser);

exports.JSONParser = JSONParser;

var BufferParser =
/** @class */
function (_super) {
  (0, _tslib.__extends)(BufferParser, _super);

  function BufferParser() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  BufferParser.prototype.parseImpl = function (r, resolve) {
    if ((0, _common.isFunc)(r.arrayBuffer)) {
      r.arrayBuffer().then(resolve);
    } else {
      r.buffer().then(resolve);
    }
  };

  return BufferParser;
}(ODataParser);

exports.BufferParser = BufferParser;

var LambdaParser =
/** @class */
function (_super) {
  (0, _tslib.__extends)(LambdaParser, _super);

  function LambdaParser(parser) {
    var _this = _super.call(this) || this;

    _this.parser = parser;
    return _this;
  }

  LambdaParser.prototype.parseImpl = function (r, resolve) {
    this.parser(r).then(resolve);
  };

  return LambdaParser;
}(ODataParser);

exports.LambdaParser = LambdaParser;

var HttpRequestError =
/** @class */
function (_super) {
  (0, _tslib.__extends)(HttpRequestError, _super);

  function HttpRequestError(message, response, status, statusText) {
    if (status === void 0) {
      status = response.status;
    }

    if (statusText === void 0) {
      statusText = response.statusText;
    }

    var _this = _super.call(this, message) || this;

    _this.response = response;
    _this.status = status;
    _this.statusText = statusText;
    _this.isHttpRequestError = true;
    return _this;
  }

  HttpRequestError.init = function (r) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var t;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , r.clone().text()];

          case 1:
            t = _a.sent();
            return [2
            /*return*/
            , new HttpRequestError("Error making HttpClient request in queryable [" + r.status + "] " + r.statusText + " ::> " + t, r.clone())];
        }
      });
    });
  };

  return HttpRequestError;
}(Error);

exports.HttpRequestError = HttpRequestError;
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js"}],"../node_modules/@pnp/odata/queryable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneQueryableData = cloneQueryableData;
exports.Queryable = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _parsers = require("./parsers");

function cloneQueryableData(source) {
  var s = JSON.stringify(source, function (key, value) {
    switch (key) {
      case "query":
        return JSON.stringify((0, _tslib.__spread)(value));

      case "batch":
        return "-";

      case "batchDependency":
        return "-";

      case "cachingOptions":
        return "-";

      case "clientFactory":
        return "-";

      case "parser":
        return "-";

      default:
        return value;
    }
  }, 0);
  var parsed = JSON.parse(s, function (key, value) {
    switch (key) {
      case "query":
        return new Map(JSON.parse(value));

      case "batch":
        return source.batch;

      case "batchDependency":
        return source.batchDependency;

      case "cachingOptions":
        return source.cachingOptions;

      case "clientFactory":
        return source.clientFactory;

      case "parser":
        return source.parser;

      default:
        return value;
    }
  }); // this handles bodies that cannot be JSON encoded (Blob, etc)

  if (source.options && source.options.body) {
    parsed.options.body = source.options.body;
  }

  return parsed;
}

var Queryable =
/** @class */
function () {
  function Queryable(dataSeed) {
    if (dataSeed === void 0) {
      dataSeed = {};
    }

    this._data = Object.assign({}, {
      cloneParentWasCaching: false,
      options: {},
      parentUrl: "",
      parser: new _parsers.ODataParser(),
      query: new Map(),
      url: "",
      useCaching: false
    }, cloneQueryableData(dataSeed));
  }

  Object.defineProperty(Queryable.prototype, "data", {
    get: function () {
      return this._data;
    },
    set: function (value) {
      this._data = Object.assign({}, cloneQueryableData(this.data), cloneQueryableData(value));
    },
    enumerable: false,
    configurable: true
  });
  /**
  * Gets the currentl url
  *
  */

  Queryable.prototype.toUrl = function () {
    return this.data.url;
  };
  /**
   * Directly concatenates the supplied string to the current url, not normalizing "/" chars
   *
   * @param pathPart The string to concatenate to the url
   */


  Queryable.prototype.concat = function (pathPart) {
    this.data.url += pathPart;
    return this;
  };

  Object.defineProperty(Queryable.prototype, "query", {
    /**
     * Provides access to the query builder for this url
     *
     */
    get: function () {
      return this.data.query;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Sets custom options for current object and all derived objects accessible via chaining
   *
   * @param options custom options
   */

  Queryable.prototype.configure = function (options) {
    (0, _common.mergeOptions)(this.data.options, options);
    return this;
  };
  /**
   * Configures this instance from the configure options of the supplied instance
   *
   * @param o Instance from which options should be taken
   */


  Queryable.prototype.configureFrom = function (o) {
    (0, _common.mergeOptions)(this.data.options, o.data.options);
    return this;
  };
  /**
   * Enables caching for this request
   *
   * @param options Defines the options used when caching this request
   */


  Queryable.prototype.usingCaching = function (options) {
    if (!_common.RuntimeConfig.globalCacheDisable) {
      this.data.useCaching = true;

      if (options !== undefined) {
        this.data.cachingOptions = options;
      }
    }

    return this;
  };

  Queryable.prototype.usingParser = function (parser) {
    this.data.parser = parser;
    return this;
  };
  /**
   * Allows you to set a request specific processing pipeline
   *
   * @param pipeline The set of methods, in order, to execute a given request
   */


  Queryable.prototype.withPipeline = function (pipeline) {
    this.data.pipes = pipeline.slice(0);
    return this;
  };
  /**
   * Appends the given string and normalizes "/" chars
   *
   * @param pathPart The string to append
   */


  Queryable.prototype.append = function (pathPart) {
    this.data.url = (0, _common.combine)(this.data.url, pathPart);
  };
  /**
   * Adds this query to the supplied batch
   *
   * @example
   * ```
   *
   * let b = pnp.sp.createBatch();
   * pnp.sp.web.inBatch(b).get().then(...);
   * b.execute().then(...)
   * ```
   */


  Queryable.prototype.inBatch = function (batch) {
    if (this.hasBatch) {
      throw Error("This query is already part of a batch.");
    }

    if ((0, _common.objectDefinedNotNull)(batch)) {
      batch.track(this);
    }

    return this;
  };
  /**
   * Blocks a batch call from occuring, MUST be cleared by calling the returned function
  */


  Queryable.prototype.addBatchDependency = function () {
    if ((0, _common.objectDefinedNotNull)(this.data.batch)) {
      return this.data.batch.addDependency();
    }

    return function () {
      return null;
    };
  };

  Object.defineProperty(Queryable.prototype, "hasBatch", {
    /**
     * Indicates if the current query has a batch associated
     *
     */
    get: function () {
      return (0, _common.objectDefinedNotNull)(this.data.batch);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Queryable.prototype, "batch", {
    /**
     * The batch currently associated with this query or null
     *
     */
    get: function () {
      return this.hasBatch ? this.data.batch : null;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Queryable.prototype, "parentUrl", {
    /**
     * Gets the parent url used when creating this instance
     *
     */
    get: function () {
      return this.data.parentUrl;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Clones this instance's data to target
   *
   * @param target Instance to which data is written
   * @param settings [Optional] Settings controlling how clone is applied
   */

  Queryable.prototype.cloneTo = function (target, settings) {
    if (settings === void 0) {
      settings = {
        includeBatch: true
      };
    }

    target.data = Object.assign({}, cloneQueryableData(this.data), {
      batch: null,
      cloneParentCacheOptions: null,
      cloneParentWasCaching: false
    }, cloneQueryableData(target.data));
    target.configureFrom(this);

    if (settings.includeBatch) {
      target.inBatch(this.batch);
    }

    if (this.data.useCaching) {
      target.data.cloneParentWasCaching = true;
      target.data.cloneParentCacheOptions = this.data.cachingOptions;
    }

    return target;
  };

  return Queryable;
}();

exports.Queryable = Queryable;
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","./parsers":"../node_modules/@pnp/odata/parsers.js"}],"../node_modules/@pnp/logging/logger.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogLevel = exports.Logger = void 0;

/**
 * Class used to subscribe ILogListener and log messages throughout an application
 *
 */
var Logger =
/** @class */
function () {
  function Logger() {}

  Object.defineProperty(Logger, "activeLogLevel", {
    /**
     * Gets or sets the active log level to apply for log filtering
     */
    get: function () {
      return Logger.instance.activeLogLevel;
    },
    set: function (value) {
      Logger.instance.activeLogLevel = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Logger, "instance", {
    get: function () {
      if (Logger._instance === undefined || Logger._instance === null) {
        Logger._instance = new LoggerImpl();
      }

      return Logger._instance;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Adds ILogListener instances to the set of subscribed listeners
   *
   * @param listeners One or more listeners to subscribe to this log
   */

  Logger.subscribe = function () {
    var listeners = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      listeners[_i] = arguments[_i];
    }

    listeners.forEach(function (listener) {
      return Logger.instance.subscribe(listener);
    });
  };
  /**
   * Clears the subscribers collection, returning the collection before modification
   */


  Logger.clearSubscribers = function () {
    return Logger.instance.clearSubscribers();
  };

  Object.defineProperty(Logger, "count", {
    /**
     * Gets the current subscriber count
     */
    get: function () {
      return Logger.instance.count;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Writes the supplied string to the subscribed listeners
   *
   * @param message The message to write
   * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Info)
   */

  Logger.write = function (message, level) {
    if (level === void 0) {
      level = 1
      /* Info */
      ;
    }

    Logger.instance.log({
      level: level,
      message: message
    });
  };
  /**
   * Writes the supplied string to the subscribed listeners
   *
   * @param json The json object to stringify and write
   * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Info)
   */


  Logger.writeJSON = function (json, level) {
    if (level === void 0) {
      level = 1
      /* Info */
      ;
    }

    this.write(JSON.stringify(json), level);
  };
  /**
   * Logs the supplied entry to the subscribed listeners
   *
   * @param entry The message to log
   */


  Logger.log = function (entry) {
    Logger.instance.log(entry);
  };
  /**
   * Logs an error object to the subscribed listeners
   *
   * @param err The error object
   */


  Logger.error = function (err) {
    Logger.instance.log({
      data: err,
      level: 3
      /* Error */
      ,
      message: err.message
    });
  };

  return Logger;
}();

exports.Logger = Logger;

var LoggerImpl =
/** @class */
function () {
  function LoggerImpl(activeLogLevel, subscribers) {
    if (activeLogLevel === void 0) {
      activeLogLevel = 2
      /* Warning */
      ;
    }

    if (subscribers === void 0) {
      subscribers = [];
    }

    this.activeLogLevel = activeLogLevel;
    this.subscribers = subscribers;
  }

  LoggerImpl.prototype.subscribe = function (listener) {
    this.subscribers.push(listener);
  };

  LoggerImpl.prototype.clearSubscribers = function () {
    var s = this.subscribers.slice(0);
    this.subscribers.length = 0;
    return s;
  };

  Object.defineProperty(LoggerImpl.prototype, "count", {
    get: function () {
      return this.subscribers.length;
    },
    enumerable: false,
    configurable: true
  });

  LoggerImpl.prototype.write = function (message, level) {
    if (level === void 0) {
      level = 1
      /* Info */
      ;
    }

    this.log({
      level: level,
      message: message
    });
  };

  LoggerImpl.prototype.log = function (entry) {
    if (entry !== undefined && this.activeLogLevel <= entry.level) {
      this.subscribers.map(function (subscriber) {
        return subscriber.log(entry);
      });
    }
  };

  return LoggerImpl;
}();
/**
 * A set of logging levels
 */


var LogLevel;
exports.LogLevel = LogLevel;

(function (LogLevel) {
  LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
  LogLevel[LogLevel["Info"] = 1] = "Info";
  LogLevel[LogLevel["Warning"] = 2] = "Warning";
  LogLevel[LogLevel["Error"] = 3] = "Error";
  LogLevel[LogLevel["Off"] = 99] = "Off";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
},{}],"../node_modules/@pnp/logging/listeners.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionListener = exports.ConsoleListener = void 0;

/**
 * Implementation of LogListener which logs to the console
 *
 */
var ConsoleListener =
/** @class */
function () {
  function ConsoleListener() {}
  /**
   * Any associated data that a given logging listener may choose to log or ignore
   *
   * @param entry The information to be logged
   */


  ConsoleListener.prototype.log = function (entry) {
    var msg = this.format(entry);

    switch (entry.level) {
      case 0
      /* Verbose */
      :
      case 1
      /* Info */
      :
        console.log(msg);
        break;

      case 2
      /* Warning */
      :
        console.warn(msg);
        break;

      case 3
      /* Error */
      :
        console.error(msg);
        break;
    }
  };
  /**
   * Formats the message
   *
   * @param entry The information to format into a string
   */


  ConsoleListener.prototype.format = function (entry) {
    var msg = [];
    msg.push("Message: " + entry.message);

    if (entry.data !== undefined) {
      try {
        msg.push(" Data: " + JSON.stringify(entry.data));
      } catch (e) {
        msg.push(" Data: Error in stringify of supplied data " + e);
      }
    }

    return msg.join("");
  };

  return ConsoleListener;
}();

exports.ConsoleListener = ConsoleListener;

/**
 * Implementation of LogListener which logs to the supplied function
 *
 */
var FunctionListener =
/** @class */
function () {
  /**
   * Creates a new instance of the FunctionListener class
   *
   * @constructor
   * @param  method The method to which any logging data will be passed
   */
  function FunctionListener(method) {
    this.method = method;
  }
  /**
   * Any associated data that a given logging listener may choose to log or ignore
   *
   * @param entry The information to be logged
   */


  FunctionListener.prototype.log = function (entry) {
    this.method(entry);
  };

  return FunctionListener;
}();

exports.FunctionListener = FunctionListener;
},{}],"../node_modules/@pnp/logging/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require("./logger");

Object.keys(_logger).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _logger[key];
    }
  });
});

var _listeners = require("./listeners");

Object.keys(_listeners).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _listeners[key];
    }
  });
});
},{"./logger":"../node_modules/@pnp/logging/logger.js","./listeners":"../node_modules/@pnp/logging/listeners.js"}],"../node_modules/@pnp/odata/pipeline.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setResult = setResult;
exports.pipe = pipe;
exports.requestPipelineMethod = requestPipelineMethod;
exports.getDefaultPipeline = getDefaultPipeline;
exports.PipelineMethods = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _logging = require("@pnp/logging");

var _caching = require("./caching");

/**
 * Resolves the context's result value
 *
 * @param context The current context
 */
function returnResult(context) {
  _logging.Logger.log({
    data: _logging.Logger.activeLogLevel === 0
    /* Verbose */
    ? context.result : {},
    level: 1
    /* Info */
    ,
    message: "[" + context.requestId + "] (" + new Date().getTime() + ") Returning result from pipeline. Set logging to verbose to see data."
  });

  return Promise.resolve(context.result);
}
/**
 * Sets the result on the context
 */


function setResult(context, value) {
  return new Promise(function (resolve) {
    context.result = value;
    context.hasResult = true;
    resolve(context);
  });
}
/**
 * Invokes the next method in the provided context's pipeline
 *
 * @param c The current request context
 */


function next(c) {
  return c.pipes.length > 0 ? c.pipes.shift()(c) : Promise.resolve(c);
}
/**
 * Executes the current request context's pipeline
 *
 * @param context Current context
 */


function pipe(context) {
  if (context.pipes.length < 1) {
    _logging.Logger.write("[" + context.requestId + "] (" + new Date().getTime() + ") Request pipeline contains no methods!", 3
    /* Error */
    );

    throw Error("Request pipeline contains no methods!");
  }

  var promise = next(context).then(function (ctx) {
    return returnResult(ctx);
  }).catch(function (e) {
    _logging.Logger.error(e);

    throw e;
  });

  if (context.isBatched) {
    // this will block the batch's execute method from returning until the child requets have been resolved
    context.batch.addResolveBatchDependency(promise);
  }

  return promise;
}
/**
 * decorator factory applied to methods in the pipeline to control behavior
 */


function requestPipelineMethod(alwaysRun) {
  if (alwaysRun === void 0) {
    alwaysRun = false;
  }

  return function (target, propertyKey, descriptor) {
    var method = descriptor.value;

    descriptor.value = function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      } // if we have a result already in the pipeline, pass it along and don't call the tagged method


      if (!alwaysRun && args.length > 0 && (0, _common.hOP)(args[0], "hasResult") && args[0].hasResult) {
        _logging.Logger.write("[" + args[0].requestId + "] (" + new Date().getTime() + ") Skipping request pipeline method " + propertyKey + ", existing result in pipeline.", 0
        /* Verbose */
        );

        return Promise.resolve(args[0]);
      } // apply the tagged method


      _logging.Logger.write("[" + args[0].requestId + "] (" + new Date().getTime() + ") Calling request pipeline method " + propertyKey + ".", 0
      /* Verbose */
      ); // then chain the next method in the context's pipeline - allows for dynamic pipeline


      return method.apply(target, args).then(function (ctx) {
        return next(ctx);
      });
    };
  };
}
/**
 * Contains the methods used within the request pipeline
 */


var PipelineMethods =
/** @class */
function () {
  function PipelineMethods() {}
  /**
   * Logs the start of the request
   */


  PipelineMethods.logStart = function (context) {
    return new Promise(function (resolve) {
      _logging.Logger.log({
        data: _logging.Logger.activeLogLevel === 1
        /* Info */
        ? {} : context,
        level: 1
        /* Info */
        ,
        message: "[" + context.requestId + "] (" + new Date().getTime() + ") Beginning " + context.method + " request (" + context.url + ")"
      });

      resolve(context);
    });
  };
  /**
   * Handles caching of the request
   */


  PipelineMethods.caching = function (context) {
    return new Promise(function (resolve) {
      // handle caching, if applicable
      if (context.useCaching) {
        _logging.Logger.write("[" + context.requestId + "] (" + new Date().getTime() + ") Caching is enabled for request, checking cache...", 1
        /* Info */
        );

        var cacheOptions = new _caching.CachingOptions(context.url.toLowerCase());

        if (context.cachingOptions !== undefined) {
          cacheOptions = (0, _common.assign)(cacheOptions, context.cachingOptions);
        } // we may not have a valid store


        if (cacheOptions.store !== null) {
          // check if we have the data in cache and if so resolve the promise and return
          var data = cacheOptions.store.get(cacheOptions.key);

          if (data !== null) {
            _logging.Logger.log({
              data: _logging.Logger.activeLogLevel === 1
              /* Info */
              ? {} : data,
              level: 1
              /* Info */
              ,
              message: "[" + context.requestId + "] (" + new Date().getTime() + ") Value returned from cache."
            }); // ensure we clear any held batch dependency we are resolving from the cache


            if ((0, _common.isFunc)(context.batchDependency)) {
              context.batchDependency();
            } // handle the case where a parser needs to take special actions with a cached result


            if ((0, _common.hOP)(context.parser, "hydrate")) {
              data = context.parser.hydrate(data);
            }

            return setResult(context, data).then(function (ctx) {
              return resolve(ctx);
            });
          }
        }

        _logging.Logger.write("[" + context.requestId + "] (" + new Date().getTime() + ") Value not found in cache.", 1
        /* Info */
        ); // if we don't then wrap the supplied parser in the caching parser wrapper
        // and send things on their way


        context.parser = new _caching.CachingParserWrapper(context.parser, cacheOptions);
      }

      return resolve(context);
    });
  };
  /**
   * Sends the request
   */


  PipelineMethods.send = function (context) {
    return new Promise(function (resolve, reject) {
      // send or batch the request
      if (context.isBatched) {
        var p = context.batch.add(context); // we release the dependency here to ensure the batch does not execute until the request is added to the batch

        if ((0, _common.isFunc)(context.batchDependency)) {
          context.batchDependency();
        }

        _logging.Logger.write("[" + context.requestId + "] (" + new Date().getTime() + ") Batching request in batch " + context.batch.batchId + ".", 1
        /* Info */
        ); // we set the result as the promise which will be resolved by the batch's execution


        resolve(setResult(context, p));
      } else {
        _logging.Logger.write("[" + context.requestId + "] (" + new Date().getTime() + ") Sending request.", 1
        /* Info */
        ); // we are not part of a batch, so proceed as normal


        var client = context.clientFactory();
        var opts = (0, _common.assign)(context.options || {}, {
          method: context.method
        });
        client.fetch(context.url, opts).then(function (response) {
          return context.parser.parse(response);
        }).then(function (result) {
          return setResult(context, result);
        }).then(function (ctx) {
          return resolve(ctx);
        }).catch(function (e) {
          return reject(e);
        });
      }
    });
  };
  /**
   * Logs the end of the request
   */


  PipelineMethods.logEnd = function (context) {
    return new Promise(function (resolve) {
      if (context.isBatched) {
        _logging.Logger.log({
          data: _logging.Logger.activeLogLevel === 1
          /* Info */
          ? {} : context,
          level: 1
          /* Info */
          ,
          message: "[" + context.requestId + "] (" + new Date().getTime() + ") " + context.method + " request will complete in batch " + context.batch.batchId + "."
        });
      } else {
        _logging.Logger.log({
          data: _logging.Logger.activeLogLevel === 1
          /* Info */
          ? {} : context,
          level: 1
          /* Info */
          ,
          message: "[" + context.requestId + "] (" + new Date().getTime() + ") Completing " + context.method + " request."
        });
      }

      resolve(context);
    });
  };

  (0, _tslib.__decorate)([requestPipelineMethod(true)], PipelineMethods, "logStart", null);
  (0, _tslib.__decorate)([requestPipelineMethod()], PipelineMethods, "caching", null);
  (0, _tslib.__decorate)([requestPipelineMethod()], PipelineMethods, "send", null);
  (0, _tslib.__decorate)([requestPipelineMethod(true)], PipelineMethods, "logEnd", null);
  return PipelineMethods;
}();

exports.PipelineMethods = PipelineMethods;

function getDefaultPipeline() {
  return [PipelineMethods.logStart, PipelineMethods.caching, PipelineMethods.send, PipelineMethods.logEnd].slice(0);
}
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/logging":"../node_modules/@pnp/logging/index.js","./caching":"../node_modules/@pnp/odata/caching.js"}],"../node_modules/@pnp/odata/pipeline-binder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipelineBinder = pipelineBinder;
exports.defaultPipelineBinder = void 0;

var _parsers = require("./parsers");

var _common = require("@pnp/common");

var _queryable = require("./queryable");

var _pipeline = require("./pipeline");

// first we bind the pipeline we will use for all requests within this closure
function pipelineBinder(pipes) {
  // then we bind the client factory we'll use (typically done in an implementing library such as sp)
  return function (clientFactory) {
    // then we create a binder we can apply for each type of method (GET, POST, etc.)
    return function (method) {
      // finally we get a function back to which we can pass an IQueryableData instance and execute the request it defines
      return function (o) {
        // send the IQueryableData down the pipeline
        return (0, _pipeline.pipe)(Object.assign({}, {
          batch: null,
          batchDependency: null,
          batchIndex: -1,
          cachingOptions: null,
          clientFactory: clientFactory,
          cloneParentCacheOptions: null,
          cloneParentWasCaching: false,
          hasResult: false,
          isBatched: (0, _common.objectDefinedNotNull)(o.batch),
          method: method,
          options: null,
          parentUrl: "",
          parser: new _parsers.ODataParser(),
          pipes: pipes.slice(0),
          query: new Map(),
          requestId: (0, _common.getGUID)(),
          url: "",
          useCaching: /^get$/i.test(o.method) && o.useCaching
        }, (0, _queryable.cloneQueryableData)(o)));
      };
    };
  };
}

var defaultPipelineBinder = pipelineBinder((0, _pipeline.getDefaultPipeline)());
exports.defaultPipelineBinder = defaultPipelineBinder;
},{"./parsers":"../node_modules/@pnp/odata/parsers.js","@pnp/common":"../node_modules/@pnp/common/index.js","./queryable":"../node_modules/@pnp/odata/queryable.js","./pipeline":"../node_modules/@pnp/odata/pipeline.js"}],"../node_modules/@pnp/odata/request-builders.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.body = body;
exports.headers = headers;

var _common = require("@pnp/common");

function body(o, previous) {
  return Object.assign({
    body: (0, _common.jsS)(o)
  }, previous);
}

function headers(o, previous) {
  return Object.assign({
    headers: o
  }, previous);
}
},{"@pnp/common":"../node_modules/@pnp/common/index.js"}],"../node_modules/@pnp/odata/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  extendGlobal: true,
  extendObj: true,
  extendFactory: true,
  clearGlobalExtensions: true,
  enableExtensions: true,
  disableExtensions: true
};
Object.defineProperty(exports, "extendGlobal", {
  enumerable: true,
  get: function () {
    return _invokableExtensions.extendGlobal;
  }
});
Object.defineProperty(exports, "extendObj", {
  enumerable: true,
  get: function () {
    return _invokableExtensions.extendObj;
  }
});
Object.defineProperty(exports, "extendFactory", {
  enumerable: true,
  get: function () {
    return _invokableExtensions.extendFactory;
  }
});
Object.defineProperty(exports, "clearGlobalExtensions", {
  enumerable: true,
  get: function () {
    return _invokableExtensions.clearGlobalExtensions;
  }
});
Object.defineProperty(exports, "enableExtensions", {
  enumerable: true,
  get: function () {
    return _invokableExtensions.enableExtensions;
  }
});
Object.defineProperty(exports, "disableExtensions", {
  enumerable: true,
  get: function () {
    return _invokableExtensions.disableExtensions;
  }
});

var _batch = require("./batch");

Object.keys(_batch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _batch[key];
    }
  });
});

var _caching = require("./caching");

Object.keys(_caching).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _caching[key];
    }
  });
});

var _addProp = require("./add-prop");

Object.keys(_addProp).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _addProp[key];
    }
  });
});

var _invokableBinder = require("./invokable-binder");

Object.keys(_invokableBinder).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _invokableBinder[key];
    }
  });
});

var _pipelineBinder = require("./pipeline-binder");

Object.keys(_pipelineBinder).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pipelineBinder[key];
    }
  });
});

var _parsers = require("./parsers");

Object.keys(_parsers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _parsers[key];
    }
  });
});

var _pipeline = require("./pipeline");

Object.keys(_pipeline).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pipeline[key];
    }
  });
});

var _queryable = require("./queryable");

Object.keys(_queryable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _queryable[key];
    }
  });
});

var _requestBuilders = require("./request-builders");

Object.keys(_requestBuilders).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _requestBuilders[key];
    }
  });
});

var _invokableExtensions = require("./invokable-extensions");
},{"./batch":"../node_modules/@pnp/odata/batch.js","./caching":"../node_modules/@pnp/odata/caching.js","./add-prop":"../node_modules/@pnp/odata/add-prop.js","./invokable-binder":"../node_modules/@pnp/odata/invokable-binder.js","./pipeline-binder":"../node_modules/@pnp/odata/pipeline-binder.js","./parsers":"../node_modules/@pnp/odata/parsers.js","./pipeline":"../node_modules/@pnp/odata/pipeline.js","./queryable":"../node_modules/@pnp/odata/queryable.js","./request-builders":"../node_modules/@pnp/odata/request-builders.js","./invokable-extensions":"../node_modules/@pnp/odata/invokable-extensions.js"}],"../node_modules/@pnp/sp/utils/metadata.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metadata = metadata;

function metadata(type) {
  return {
    "__metadata": {
      "type": type
    }
  };
}
},{}],"../node_modules/@pnp/sp/utils/extractweburl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractWebUrl = extractWebUrl;

var _common = require("@pnp/common");

function extractWebUrl(candidateUrl) {
  if ((0, _common.stringIsNullOrEmpty)(candidateUrl)) {
    return "";
  }

  var index = candidateUrl.indexOf("_api/");

  if (index < 0) {
    index = candidateUrl.indexOf("_vti_bin/");
  }

  if (index > -1) {
    return candidateUrl.substr(0, index);
  } // if all else fails just give them what they gave us back


  return candidateUrl;
}
},{"@pnp/common":"../node_modules/@pnp/common/index.js"}],"../node_modules/@pnp/sp/telemetry.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tag = tag;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _odata = require("@pnp/odata");

/**
 * Includes this method name in the X-ClientService-ClientTag used to record pnpjs usage
 *
 * @param name Method name, displayed in the
 */
function tag(name) {
  return function (target, key, descriptor) {
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }

    var originalMethod = descriptor.value;

    descriptor.value = function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
        return (0, _tslib.__generator)(this, function (_a) {
          this.configure((0, _odata.headers)({
            "X-PnPjs-Tracking": name
          }));
          return [2
          /*return*/
          , originalMethod.apply(this, args)];
        });
      });
    };

    return descriptor;
  };
}

tag.getClientTag = function (h, deleteFromCollection) {
  if (deleteFromCollection === void 0) {
    deleteFromCollection = true;
  }

  if (h.has("X-PnPjs-Tracking")) {
    var methodName = h.get("X-PnPjs-Tracking");

    if (deleteFromCollection) {
      h.delete("X-PnPjs-Tracking");
    }

    if (!(0, _common.stringIsNullOrEmpty)(methodName)) {
      return methodName;
    }
  }

  return "";
};

tag.configure = function (o, name) {
  return o.configure((0, _odata.headers)({
    "X-PnPjs-Tracking": name
  }));
};

tag.isTagged = function (o) {
  return o.data.options.headers && o.data.options.headers["X-PnPjs-Tracking"];
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/odata":"../node_modules/@pnp/odata/index.js"}],"../node_modules/@pnp/sp/sphttpclient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SPHttpClient = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _splibconfig = require("./splibconfig");

var _extractweburl = require("./utils/extractweburl");

var _telemetry = require("./telemetry");

var _odata = require("@pnp/odata");

var SPHttpClient =
/** @class */
function () {
  function SPHttpClient(_impl) {
    if (_impl === void 0) {
      _impl = _splibconfig.SPRuntimeConfig.fetchClientFactory();
    }

    this._impl = _impl;
    this._digestCache = getDigestFactory(this);
  }

  SPHttpClient.prototype.fetch = function (url, options) {
    if (options === void 0) {
      options = {};
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var opts, headers, methodName, clientTag, digest;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            opts = (0, _common.assign)(options, {
              cache: "no-cache",
              credentials: "same-origin"
            }, true);
            headers = new Headers(); // first we add the global headers so they can be overwritten by any passed in locally to this call

            (0, _common.mergeHeaders)(headers, _splibconfig.SPRuntimeConfig.headers); // second we add the local options so we can overwrite the globals

            (0, _common.mergeHeaders)(headers, options.headers); // lastly we apply any default headers we need that may not exist

            if (!headers.has("Accept")) {
              headers.append("Accept", "application/json");
            }

            if (!headers.has("Content-Type")) {
              headers.append("Content-Type", "application/json;odata=verbose;charset=utf-8");
            }

            if (!headers.has("X-ClientService-ClientTag")) {
              methodName = _telemetry.tag.getClientTag(headers);
              clientTag = "PnPCoreJS:2.0.6:" + methodName;

              if (clientTag.length > 32) {
                clientTag = clientTag.substr(0, 32);
              }

              headers.append("X-ClientService-ClientTag", clientTag);
            }

            opts = (0, _common.assign)(opts, {
              headers: headers
            });
            if (!(opts.method && opts.method.toUpperCase() !== "GET" && !headers.has("X-RequestDigest") && !headers.has("Authorization"))) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this._digestCache((0, _extractweburl.extractWebUrl)(url))];

          case 1:
            digest = _a.sent();
            headers.append("X-RequestDigest", digest);
            _a.label = 2;

          case 2:
            return [2
            /*return*/
            , this.fetchRaw(url, opts)];
        }
      });
    });
  };

  SPHttpClient.prototype.fetchRaw = function (url, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    } // here we need to normalize the headers


    var rawHeaders = new Headers();
    (0, _common.mergeHeaders)(rawHeaders, options.headers);
    options = (0, _common.assign)(options, {
      headers: rawHeaders
    });

    var retry = function (ctx) {
      // handles setting the proper timeout for a retry
      var setRetry = function (response) {
        var delay;

        if (response.headers.has("Retry-After")) {
          // if we have gotten a header, use that value as the delay value in seconds
          delay = parseInt(response.headers.get("Retry-After"), 10) * 1000;
        } else {
          // grab our current delay
          delay = ctx.delay; // Increment our counters.

          ctx.delay *= 2;
        }

        ctx.attempts++; // If we have exceeded the retry count, reject.

        if (ctx.retryCount <= ctx.attempts) {
          ctx.reject(Error("Retry count exceeded (" + ctx.retryCount + ") for request. Response status: [" + response.status + "] " + response.statusText));
        } else {
          // Set our retry timeout for {delay} milliseconds.
          setTimeout((0, _common.getCtxCallback)(_this, retry, ctx), delay);
        }
      }; // send the actual request


      _this._impl.fetch(url, options).then(function (response) {
        if (response.status === 429) {
          // we have been throttled
          setRetry(response);
        } else {
          ctx.resolve(response);
        }
      }).catch(function (response) {
        if (response.status === 503 || response.status === 504) {
          // http status code 503 or 504, we can retry this
          setRetry(response);
        } else {
          ctx.reject(response);
        }
      });
    };

    return new Promise(function (resolve, reject) {
      retry.call(_this, {
        attempts: 0,
        delay: 100,
        reject: reject,
        resolve: resolve,
        retryCount: 7
      });
    });
  };

  SPHttpClient.prototype.get = function (url, options) {
    if (options === void 0) {
      options = {};
    }

    var opts = (0, _common.assign)(options, {
      method: "GET"
    });
    return this.fetch(url, opts);
  };

  SPHttpClient.prototype.post = function (url, options) {
    if (options === void 0) {
      options = {};
    }

    var opts = (0, _common.assign)(options, {
      method: "POST"
    });
    return this.fetch(url, opts);
  };

  SPHttpClient.prototype.patch = function (url, options) {
    if (options === void 0) {
      options = {};
    }

    var opts = (0, _common.assign)(options, {
      method: "PATCH"
    });
    return this.fetch(url, opts);
  };

  SPHttpClient.prototype.delete = function (url, options) {
    if (options === void 0) {
      options = {};
    }

    var opts = (0, _common.assign)(options, {
      method: "DELETE"
    });
    return this.fetch(url, opts);
  };

  return SPHttpClient;
}();

exports.SPHttpClient = SPHttpClient;
// allows for the caching of digests across all HttpClient's which each have their own DigestCache wrapper.
var digests = new Map();

function getDigestFactory(client) {
  var _this = this;

  return function (webUrl) {
    return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
      var cachedDigest, now, url, headers, resp, parsed, newCachedDigest;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            cachedDigest = digests.get(webUrl);

            if (cachedDigest !== undefined) {
              now = new Date();

              if (now < cachedDigest.expiration) {
                return [2
                /*return*/
                , cachedDigest.value];
              }
            }

            url = (0, _common.combine)(webUrl, "/_api/contextinfo");
            headers = {
              "Accept": "application/json;odata=verbose",
              "Content-Type": "application/json;odata=verbose;charset=utf-8"
            };
            return [4
            /*yield*/
            , client.fetchRaw(url, {
              cache: "no-cache",
              credentials: "same-origin",
              headers: (0, _common.assign)(headers, _splibconfig.SPRuntimeConfig.headers, true),
              method: "POST"
            })];

          case 1:
            resp = _a.sent();
            return [4
            /*yield*/
            , new _odata.ODataParser().parse(resp).then(function (r) {
              return r.GetContextWebInformation;
            })];

          case 2:
            parsed = _a.sent();
            newCachedDigest = {
              expiration: (0, _common.dateAdd)(new Date(), "second", parsed.FormDigestTimeoutSeconds),
              value: parsed.FormDigestValue
            };
            digests.set(webUrl, newCachedDigest);
            return [2
            /*return*/
            , newCachedDigest.value];
        }
      });
    });
  };
}
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","./splibconfig":"../node_modules/@pnp/sp/splibconfig.js","./utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","./telemetry":"../node_modules/@pnp/sp/telemetry.js","@pnp/odata":"../node_modules/@pnp/odata/index.js"}],"../node_modules/@pnp/sp/utils/toabsoluteurl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toAbsoluteUrl = toAbsoluteUrl;

var _common = require("@pnp/common");

var _splibconfig = require("../splibconfig");

/**
 * Ensures that a given url is absolute for the current web based on context
 *
 * @param candidateUrl The url to make absolute
 *
 */
function toAbsoluteUrl(candidateUrl) {
  return new Promise(function (resolve) {
    if ((0, _common.isUrlAbsolute)(candidateUrl)) {
      // if we are already absolute, then just return the url
      return resolve(candidateUrl);
    }

    if (_splibconfig.SPRuntimeConfig.baseUrl !== null) {
      // base url specified either with baseUrl of spfxContext config property
      return resolve((0, _common.combine)(_splibconfig.SPRuntimeConfig.baseUrl, candidateUrl));
    }

    if (_common.safeGlobal._spPageContextInfo !== undefined) {
      // operating in classic pages
      if ((0, _common.hOP)(_common.safeGlobal._spPageContextInfo, "webAbsoluteUrl")) {
        return resolve((0, _common.combine)(_common.safeGlobal._spPageContextInfo.webAbsoluteUrl, candidateUrl));
      } else if ((0, _common.hOP)(_common.safeGlobal._spPageContextInfo, "webServerRelativeUrl")) {
        return resolve((0, _common.combine)(_common.safeGlobal._spPageContextInfo.webServerRelativeUrl, candidateUrl));
      }
    } // does window.location exist and have a certain path part in it?


    if (_common.safeGlobal.location !== undefined) {
      var baseUrl_1 = _common.safeGlobal.location.toString().toLowerCase();

      ["/_layouts/", "/siteassets/"].forEach(function (s) {
        var index = baseUrl_1.indexOf(s);

        if (index > 0) {
          return resolve((0, _common.combine)(baseUrl_1.substr(0, index), candidateUrl));
        }
      });
    }

    return resolve(candidateUrl);
  });
}
},{"@pnp/common":"../node_modules/@pnp/common/index.js","../splibconfig":"../node_modules/@pnp/sp/splibconfig.js"}],"../node_modules/@pnp/sp/operations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spPostDeleteETag = exports.spPostDelete = exports.spPatch = exports.spDelete = exports.spPost = exports.spGet = void 0;

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _sphttpclient = require("./sphttpclient");

var _common = require("@pnp/common");

var _toabsoluteurl = require("./utils/toabsoluteurl");

var spClientBinder = (0, _odata.defaultPipelineBinder)(function () {
  return new _sphttpclient.SPHttpClient();
});

var send = function (method) {
  var operation = spClientBinder(method);
  return function (o, options) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var data, batchDependency, url;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            data = (0, _odata.cloneQueryableData)(o.data);
            batchDependency = (0, _common.objectDefinedNotNull)(data.batch) ? data.batch.addDependency() : function () {
              return;
            };
            return [4
            /*yield*/
            , (0, _toabsoluteurl.toAbsoluteUrl)(o.toUrlAndQuery())];

          case 1:
            url = _a.sent();
            (0, _common.mergeOptions)(data.options, options);
            return [2
            /*return*/
            , operation(Object.assign({}, data, {
              batchDependency: batchDependency,
              url: url
            }))];
        }
      });
    });
  };
};

var spGet = function (o, options) {
  // Fix for #304 - when we clone objects we in some cases then execute a get request
  // in these cases the caching settings were getting dropped from the request
  // this tracks if the object from which this was cloned was caching and applies that to an immediate get request
  // does not affect objects cloned from this as we are using different fields to track the settings so it won't
  // be triggered
  if (o.data.cloneParentWasCaching) {
    o.usingCaching(o.data.cloneParentCacheOptions);
  } // if we are forcing caching set that in the data here


  if (o._forceCaching) {
    o.data.useCaching = true;
  }

  return send("GET")(o, options);
};

exports.spGet = spGet;
var spPost = send("POST");
exports.spPost = spPost;
var spDelete = send("DELETE");
exports.spDelete = spDelete;
var spPatch = send("PATCH");
exports.spPatch = spPatch;

var spPostDelete = function (o, options) {
  var opts = Object.assign((0, _odata.headers)({
    "X-HTTP-Method": "DELETE"
  }), options);
  return spPost(o, opts);
};

exports.spPostDelete = spPostDelete;

var spPostDeleteETag = function (o, options, eTag) {
  if (eTag === void 0) {
    eTag = "*";
  }

  var opts = Object.assign((0, _odata.headers)({
    "X-HTTP-Method": "DELETE",
    "IF-Match": eTag
  }), options);
  return spPost(o, opts);
};

exports.spPostDeleteETag = spPostDeleteETag;
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","./sphttpclient":"../node_modules/@pnp/sp/sphttpclient.js","@pnp/common":"../node_modules/@pnp/common/index.js","./utils/toabsoluteurl":"../node_modules/@pnp/sp/utils/toabsoluteurl.js"}],"../node_modules/@pnp/sp/sharepointqueryable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteable = deleteable;
exports.deleteableWithETag = deleteableWithETag;
exports.SharePointQueryableInstance = exports._SharePointQueryableInstance = exports.SharePointQueryableCollection = exports._SharePointQueryableCollection = exports.SharePointQueryable = exports._SharePointQueryable = exports.spInvokableFactory = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _odata = require("@pnp/odata");

var _logging = require("@pnp/logging");

var _metadata = require("./utils/metadata");

var _operations = require("./operations");

var _telemetry = require("./telemetry");

var spInvokableFactory = function (f) {
  return (0, _odata.invokableFactory)(f);
};
/**
 * SharePointQueryable Base Class
 *
 */


exports.spInvokableFactory = spInvokableFactory;

var _SharePointQueryable =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_SharePointQueryable, _super);
  /**
   * Creates a new instance of the SharePointQueryable class
   *
   * @constructor
   * @param baseUrl A string or SharePointQueryable that should form the base part of the url
   *
   */

  function _SharePointQueryable(baseUrl, path) {
    var _this = this;

    var url = "";
    var parentUrl = "";
    var query = new Map();

    if (typeof baseUrl === "string") {
      // we need to do some extra parsing to get the parent url correct if we are
      // being created from just a string.
      if ((0, _common.isUrlAbsolute)(baseUrl) || baseUrl.lastIndexOf("/") < 0) {
        parentUrl = baseUrl;
        url = (0, _common.combine)(baseUrl, path);
      } else if (baseUrl.lastIndexOf("/") > baseUrl.lastIndexOf("(")) {
        // .../items(19)/fields
        var index = baseUrl.lastIndexOf("/");
        parentUrl = baseUrl.slice(0, index);
        path = (0, _common.combine)(baseUrl.slice(index), path);
        url = (0, _common.combine)(parentUrl, path);
      } else {
        // .../items(19)
        var index = baseUrl.lastIndexOf("(");
        parentUrl = baseUrl.slice(0, index);
        url = (0, _common.combine)(baseUrl, path);
      }
    } else {
      parentUrl = baseUrl.toUrl();
      url = (0, _common.combine)(parentUrl, path || "");
      var target = baseUrl.query.get("@target");

      if (target !== undefined) {
        query.set("@target", target);
      }
    } // init base with correct values for data seed


    _this = _super.call(this, {
      parentUrl: parentUrl,
      query: query,
      url: url
    }) || this; // post init actions

    if (typeof baseUrl !== "string") {
      _this.configureFrom(baseUrl);
    }

    _this._forceCaching = false;
    return _this;
  }
  /**
   * Gets the full url with query information
   */


  _SharePointQueryable.prototype.toUrlAndQuery = function () {
    var aliasedParams = new Map(this.query);
    var url = this.toUrl().replace(/'!(@.*?)::(.*?)'/ig, function (match, labelName, value) {
      _logging.Logger.write("Rewriting aliased parameter from match " + match + " to label: " + labelName + " value: " + value, 0
      /* Verbose */
      );

      aliasedParams.set(labelName, "'" + value + "'");
      return labelName;
    });

    if (aliasedParams.size > 0) {
      var char = url.indexOf("?") > -1 ? "&" : "?";
      url += "" + char + Array.from(aliasedParams).map(function (v) {
        return v[0] + "=" + v[1];
      }).join("&");
    }

    return url;
  };
  /**
   * Choose which fields to return
   *
   * @param selects One or more fields to return
   */


  _SharePointQueryable.prototype.select = function () {
    var selects = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      selects[_i] = arguments[_i];
    }

    if (selects.length > 0) {
      this.query.set("$select", selects.join(","));
    }

    return this;
  };

  _SharePointQueryable.prototype.get = function (options) {
    return (0, _operations.spGet)(this, options);
  };
  /**
   * Expands fields such as lookups to get additional data
   *
   * @param expands The Fields for which to expand the values
   */


  _SharePointQueryable.prototype.expand = function () {
    var expands = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      expands[_i] = arguments[_i];
    }

    if (expands.length > 0) {
      this.query.set("$expand", expands.join(","));
    }

    return this;
  };
  /**
   * Clones this SharePointQueryable into a new SharePointQueryable instance of T
   * @param factory Constructor used to create the new instance
   * @param additionalPath Any additional path to include in the clone
   * @param includeBatch If true this instance's batch will be added to the cloned instance
   */


  _SharePointQueryable.prototype.clone = function (factory, additionalPath, includeBatch) {
    if (includeBatch === void 0) {
      includeBatch = true;
    }

    var clone = _super.prototype.cloneTo.call(this, factory(this, additionalPath), {
      includeBatch: includeBatch
    }); // handle sp specific clone actions


    var t = "@target";

    if (this.query.has(t)) {
      clone.query.set(t, this.query.get(t));
    }

    return clone;
  };
  /**
   * The default action for this object (unless overridden spGet)
   *
   * @param options optional request options
   */


  _SharePointQueryable.prototype.defaultAction = function (options) {
    return (0, _operations.spGet)(this, options);
  };
  /**
   * Gets a parent for this instance as specified
   *
   * @param factory The contructor for the class to create
   */


  _SharePointQueryable.prototype.getParent = function (factory, baseUrl, path, batch) {
    if (baseUrl === void 0) {
      baseUrl = this.parentUrl;
    }

    var parent = factory(baseUrl, path).configureFrom(this);
    var t = "@target";

    if (this.query.has(t)) {
      parent.query.set(t, this.query.get(t));
    }

    if (batch !== undefined) {
      parent = parent.inBatch(batch);
    }

    return parent;
  };

  return _SharePointQueryable;
}(_odata.Queryable);

exports._SharePointQueryable = _SharePointQueryable;
var SharePointQueryable = spInvokableFactory(_SharePointQueryable);
/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */

exports.SharePointQueryable = SharePointQueryable;

var _SharePointQueryableCollection =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_SharePointQueryableCollection, _super);

  function _SharePointQueryableCollection() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Filters the returned collection (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#bk_supported)
   *
   * @param filter The string representing the filter query
   */


  _SharePointQueryableCollection.prototype.filter = function (filter) {
    this.query.set("$filter", filter);
    return this;
  };
  /**
   * Orders based on the supplied fields
   *
   * @param orderby The name of the field on which to sort
   * @param ascending If false DESC is appended, otherwise ASC (default)
   */


  _SharePointQueryableCollection.prototype.orderBy = function (orderBy, ascending) {
    if (ascending === void 0) {
      ascending = true;
    }

    var o = "$orderby";
    var query = this.query.has(o) ? this.query.get(o).split(",") : [];
    query.push(orderBy + " " + (ascending ? "asc" : "desc"));
    this.query.set(o, query.join(","));
    return this;
  };
  /**
   * Skips the specified number of items
   *
   * @param skip The number of items to skip
   */


  _SharePointQueryableCollection.prototype.skip = function (skip) {
    this.query.set("$skip", skip.toString());
    return this;
  };
  /**
   * Limits the query to only return the specified number of items
   *
   * @param top The query row limit
   */


  _SharePointQueryableCollection.prototype.top = function (top) {
    this.query.set("$top", top.toString());
    return this;
  };

  return _SharePointQueryableCollection;
}(_SharePointQueryable);

exports._SharePointQueryableCollection = _SharePointQueryableCollection;
var SharePointQueryableCollection = spInvokableFactory(_SharePointQueryableCollection);
/**
 * Represents an instance that can be selected
 *
 */

exports.SharePointQueryableCollection = SharePointQueryableCollection;

var _SharePointQueryableInstance =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_SharePointQueryableInstance, _super);

  function _SharePointQueryableInstance() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Curries the update function into the common pieces
   *
   * @param type
   * @param mapper
   */


  _SharePointQueryableInstance.prototype._update = function (type, mapper) {
    var _this = this;

    return function (props) {
      return (0, _operations.spPost)(_telemetry.tag.configure(_this, type + ".Update"), {
        body: (0, _common.jsS)((0, _common.assign)((0, _metadata.metadata)(type), props)),
        headers: {
          "X-HTTP-Method": "MERGE"
        }
      }).then(function (d) {
        return mapper(d, props);
      });
    };
  };

  return _SharePointQueryableInstance;
}(_SharePointQueryable);

exports._SharePointQueryableInstance = _SharePointQueryableInstance;
var SharePointQueryableInstance = spInvokableFactory(_SharePointQueryableInstance);
/**
 * Adds the a delete method to the tagged class taking no parameters and calling spPostDelete
 */

exports.SharePointQueryableInstance = SharePointQueryableInstance;

function deleteable(t) {
  return function () {
    return (0, _operations.spPostDelete)(_telemetry.tag.configure(this, t + ".delete"));
  };
}

function deleteableWithETag(t) {
  return function (eTag) {
    if (eTag === void 0) {
      eTag = "*";
    }

    return (0, _operations.spPostDeleteETag)(_telemetry.tag.configure(this, t + ".delete"), {}, eTag);
  };
}
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","@pnp/logging":"../node_modules/@pnp/logging/index.js","./utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","./operations":"../node_modules/@pnp/sp/operations.js","./telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/odata.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.odataUrlFrom = odataUrlFrom;
exports.spODataEntity = spODataEntity;
exports.spODataEntityArray = spODataEntityArray;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _logging = require("@pnp/logging");

var _odata = require("@pnp/odata");

var _extractweburl = require("./utils/extractweburl");

function odataUrlFrom(candidate) {
  var parts = [];
  var s = ["odata.type", "odata.editLink", "__metadata", "odata.metadata", "odata.id"];

  if ((0, _common.hOP)(candidate, s[0]) && candidate[s[0]] === "SP.Web") {
    // webs return an absolute url in the id
    if ((0, _common.hOP)(candidate, s[4])) {
      parts.push(candidate[s[4]]);
    } else if ((0, _common.hOP)(candidate, s[2])) {
      // we are dealing with verbose, which has an absolute uri
      parts.push(candidate.__metadata.uri);
    }
  } else {
    if ((0, _common.hOP)(candidate, s[3]) && (0, _common.hOP)(candidate, s[1])) {
      // we are dealign with minimal metadata (default)
      // some entities return an abosolute url in the editlink while for others it is relative
      // without the _api. This code is meant to handle both situations
      var editLink = (0, _common.isUrlAbsolute)(candidate[s[1]]) ? candidate[s[1]].split("_api")[1] : candidate[s[1]];
      parts.push((0, _extractweburl.extractWebUrl)(candidate[s[3]]), "_api", editLink);
    } else if ((0, _common.hOP)(candidate, s[1])) {
      parts.push("_api", candidate[s[1]]);
    } else if ((0, _common.hOP)(candidate, s[2])) {
      // we are dealing with verbose, which has an absolute uri
      parts.push(candidate.__metadata.uri);
    }
  }

  if (parts.length < 1) {
    _logging.Logger.write("No uri information found in ODataEntity parsing, chaining will fail for this object.", 2
    /* Warning */
    );

    return "";
  }

  return _common.combine.apply(void 0, (0, _tslib.__spread)(parts));
}

var SPODataEntityParserImpl =
/** @class */
function (_super) {
  (0, _tslib.__extends)(SPODataEntityParserImpl, _super);

  function SPODataEntityParserImpl(factory) {
    var _this = _super.call(this) || this;

    _this.factory = factory;

    _this.hydrate = function (d) {
      var o = _this.factory(odataUrlFrom(d), null);

      return (0, _common.assign)(o, d);
    };

    return _this;
  }

  SPODataEntityParserImpl.prototype.parse = function (r) {
    var _this = this;

    return _super.prototype.parse.call(this, r).then(function (d) {
      var o = _this.factory(odataUrlFrom(d), null);

      return (0, _common.assign)(o, d);
    });
  };

  return SPODataEntityParserImpl;
}(_odata.ODataParser);

var SPODataEntityArrayParserImpl =
/** @class */
function (_super) {
  (0, _tslib.__extends)(SPODataEntityArrayParserImpl, _super);

  function SPODataEntityArrayParserImpl(factory) {
    var _this = _super.call(this) || this;

    _this.factory = factory;

    _this.hydrate = function (d) {
      return d.map(function (v) {
        var o = _this.factory(odataUrlFrom(v), null);

        return (0, _common.assign)(o, v);
      });
    };

    return _this;
  }

  SPODataEntityArrayParserImpl.prototype.parse = function (r) {
    var _this = this;

    return _super.prototype.parse.call(this, r).then(function (d) {
      return d.map(function (v) {
        var o = _this.factory(odataUrlFrom(v), null);

        return (0, _common.assign)(o, v);
      });
    });
  };

  return SPODataEntityArrayParserImpl;
}(_odata.ODataParser);

function spODataEntity(factory) {
  return new SPODataEntityParserImpl(factory);
}

function spODataEntityArray(factory) {
  return new SPODataEntityArrayParserImpl(factory);
}
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/logging":"../node_modules/@pnp/logging/index.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","./utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js"}],"../node_modules/@pnp/sp/decorators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultPath = defaultPath;

var _tslib = require("tslib");

/**
 * Class Decorators
 */

/**
 * Decorator used to specify the default path for SharePointQueryable objects
 *
 * @param path
 */
function defaultPath(path) {
  return function (target) {
    return (
      /** @class */
      function (_super) {
        (0, _tslib.__extends)(class_1, _super);

        function class_1() {
          var args = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }

          return _super.call(this, args[0], args.length > 1 && args[1] !== undefined ? args[1] : path) || this;
        }

        return class_1;
      }(target)
    );
  };
} // TODO::?
// performance tracking method decorator
// redirect to graph api
},{"tslib":"../node_modules/tslib/tslib.es6.js"}],"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeQueryStrValue = escapeQueryStrValue;

var _common = require("@pnp/common");

var _logging = require("@pnp/logging");

function escapeQueryStrValue(value) {
  if ((0, _common.stringIsNullOrEmpty)(value)) {
    return "";
  } // replace all instance of ' with ''


  if (/!(@.*?)::(.*?)/ig.test(value)) {
    // to ensure our param aliasing still works we need to treat these special or we'll hear about it
    // so we encode JUST the part that will end up in the url
    return value.replace(/!(@.*?)::(.*)$/ig, function (match, labelName, v) {
      _logging.Logger.write("Rewriting aliased parameter from match " + match + " to label: " + labelName + " value: " + v, 0
      /* Verbose */
      );

      return "!" + labelName + "::" + encodeURIComponent(v.replace(/\'/ig, "''"));
    });
  } else {
    return encodeURIComponent(value.replace(/\'/ig, "''"));
  }
}
},{"@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/logging":"../node_modules/@pnp/logging/index.js"}],"../node_modules/@pnp/sp/utils/toResourcePath.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toResourcePath = toResourcePath;

function toResourcePath(url) {
  return {
    DecodedUrl: url,
    __metadata: {
      type: "SP.ResourcePath"
    }
  };
}
},{}],"../node_modules/@pnp/sp/lists/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControlMode = exports.RenderListDataOptions = exports.List = exports._List = exports.Lists = exports._Lists = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _odata = require("@pnp/odata");

var _sharepointqueryable = require("../sharepointqueryable");

var _odata2 = require("../odata");

var _metadata = require("../utils/metadata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _escapeQueryStrValue = require("../utils/escapeQueryStrValue");

var _telemetry = require("../telemetry");

var _toResourcePath = require("../utils/toResourcePath");

var _Lists =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Lists, _super);

  function _Lists() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a list from the collection by guid id
   *
   * @param id The Id of the list (GUID)
   */


  _Lists.prototype.getById = function (id) {
    return _telemetry.tag.configure(List(this).concat("('" + id + "')"), "ls.getById");
  };
  /**
   * Gets a list from the collection by title
   *
   * @param title The title of the list
   */


  _Lists.prototype.getByTitle = function (title) {
    return _telemetry.tag.configure(List(this, "getByTitle('" + (0, _escapeQueryStrValue.escapeQueryStrValue)(title) + "')"), "ls.getByTitle");
  };
  /**
   * Adds a new list to the collection
   *
   * @param title The new list's title
   * @param description The new list's description
   * @param template The list template value
   * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
   * @param additionalSettings Will be passed as part of the list creation body
   */


  _Lists.prototype.add = function (title, desc, template, enableContentTypes, additionalSettings) {
    if (desc === void 0) {
      desc = "";
    }

    if (template === void 0) {
      template = 100;
    }

    if (enableContentTypes === void 0) {
      enableContentTypes = false;
    }

    if (additionalSettings === void 0) {
      additionalSettings = {};
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var addSettings, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            addSettings = Object.assign({
              "AllowContentTypes": enableContentTypes,
              "BaseTemplate": template,
              "ContentTypesEnabled": enableContentTypes,
              "Description": desc,
              "Title": title
            }, (0, _metadata.metadata)("SP.List"), additionalSettings);
            return [4
            /*yield*/
            , (0, _operations.spPost)(this, (0, _odata.body)(addSettings))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              list: this.getByTitle(addSettings.Title)
            }];
        }
      });
    });
  };
  /**
   * Ensures that the specified list exists in the collection (note: this method not supported for batching)
   *
   * @param title The new list's title
   * @param desc The new list's description
   * @param template The list template value
   * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
   * @param additionalSettings Will be passed as part of the list creation body or used to update an existing list
   */


  _Lists.prototype.ensure = function (title, desc, template, enableContentTypes, additionalSettings) {
    if (desc === void 0) {
      desc = "";
    }

    if (template === void 0) {
      template = 100;
    }

    if (enableContentTypes === void 0) {
      enableContentTypes = false;
    }

    if (additionalSettings === void 0) {
      additionalSettings = {};
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var addOrUpdateSettings, list, data, e_1, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.hasBatch) {
              throw Error("The ensure list method is not supported for use in a batch.");
            }

            addOrUpdateSettings = (0, _common.assign)(additionalSettings, {
              Title: title,
              Description: desc,
              ContentTypesEnabled: enableContentTypes
            }, true);
            list = this.getByTitle(addOrUpdateSettings.Title);
            _a.label = 1;

          case 1:
            _a.trys.push([1, 4,, 6]); // this will throw if the list doesn't exist


            return [4
            /*yield*/
            , list.select("Title")()];

          case 2:
            // this will throw if the list doesn't exist
            _a.sent();

            return [4
            /*yield*/
            , list.update(addOrUpdateSettings).then(function (r) {
              return r.data;
            })];

          case 3:
            data = _a.sent();
            return [2
            /*return*/
            , {
              created: false,
              data: data,
              list: this.getByTitle(addOrUpdateSettings.Title)
            }];

          case 4:
            e_1 = _a.sent();
            return [4
            /*yield*/
            , this.add(title, desc, template, enableContentTypes, addOrUpdateSettings).then(function (r) {
              return r.data;
            })];

          case 5:
            data = _a.sent();
            return [2
            /*return*/
            , {
              created: true,
              data: data,
              list: this.getByTitle(addOrUpdateSettings.Title)
            }];

          case 6:
            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Gets a list that is the default asset location for images or other files, which the users upload to their wiki pages.
   */


  _Lists.prototype.ensureSiteAssetsLibrary = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var json;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Lists, "ensuresiteassetslibrary"))];

          case 1:
            json = _a.sent();
            return [2
            /*return*/
            , List((0, _odata2.odataUrlFrom)(json))];
        }
      });
    });
  };
  /**
   * Gets a list that is the default location for wiki pages.
   */


  _Lists.prototype.ensureSitePagesLibrary = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var json;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Lists, "ensuresitepageslibrary"))];

          case 1:
            json = _a.sent();
            return [2
            /*return*/
            , List((0, _odata2.odataUrlFrom)(json))];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("ls.add")], _Lists.prototype, "add", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ls.ensure")], _Lists.prototype, "ensure", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ls.ensureSiteAssetsLibrary")], _Lists.prototype, "ensureSiteAssetsLibrary", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ls.ensureSitePagesLibrary")], _Lists.prototype, "ensureSitePagesLibrary", null);
  _Lists = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("lists")], _Lists);
  return _Lists;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Lists = _Lists;
var Lists = (0, _sharepointqueryable.spInvokableFactory)(_Lists);
exports.Lists = Lists;

var _List =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_List, _super);

  function _List() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteableWithETag)("l");
    return _this;
  }

  Object.defineProperty(_List.prototype, "effectiveBasePermissions", {
    /**
     * Gets the effective base permissions of this list
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryable)(this, "EffectiveBasePermissions"), "l.effectiveBasePermissions");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_List.prototype, "eventReceivers", {
    /**
     * Gets the event receivers attached to this list
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableCollection)(this, "EventReceivers"), "l.eventReceivers");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_List.prototype, "relatedFields", {
    /**
     * Gets the related fields of this list
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryable)(this, "getRelatedFields"), "l.relatedFields");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_List.prototype, "informationRightsManagementSettings", {
    /**
     * Gets the IRM settings for this list
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryable)(this, "InformationRightsManagementSettings"), "l.informationRightsManagementSettings");
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Updates this list intance with the supplied properties
   *
   * @param properties A plain object hash of values to update for the list
   * @param eTag Value used in the IF-Match header, by default "*"
   */

  _List.prototype.update = function (properties, eTag) {
    if (eTag === void 0) {
      eTag = "*";
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data, list;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = (0, _odata.body)((0, _common.assign)((0, _metadata.metadata)("SP.List"), properties), (0, _odata.headers)({
              "IF-Match": eTag,
              "X-HTTP-Method": "MERGE"
            }));
            return [4
            /*yield*/
            , (0, _operations.spPost)(this, postBody)];

          case 1:
            data = _a.sent();
            list = this;

            if ((0, _common.hOP)(properties, "Title")) {
              list = this.getParent(List, this.parentUrl, "getByTitle('" + properties.Title + "')");
            }

            return [2
            /*return*/
            , {
              data: data,
              list: list
            }];
        }
      });
    });
  };
  /**
   * Returns the collection of changes from the change log that have occurred within the list, based on the specified query.
   * @param query A query that is performed against the change log.
   */


  _List.prototype.getChanges = function (query) {
    return (0, _operations.spPost)(this.clone(List, "getchanges"), (0, _odata.body)({
      query: (0, _common.assign)((0, _metadata.metadata)("SP.ChangeQuery"), query)
    }));
  };
  /**
   * Returns the collection of items in the list based on the provided CamlQuery
   * @param query A query that is performed against the list
   * @param expands An expanded array of n items that contains fields to expand in the CamlQuery
   */


  _List.prototype.getItemsByCAMLQuery = function (query) {
    var expands = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      expands[_i - 1] = arguments[_i];
    }

    var q = this.clone(List, "getitems");
    return (0, _operations.spPost)(q.expand.apply(q, expands), (0, _odata.body)({
      query: (0, _common.assign)((0, _metadata.metadata)("SP.CamlQuery"), query)
    }));
  };
  /**
   * See: https://msdn.microsoft.com/en-us/library/office/dn292554.aspx
   * @param query An object that defines the change log item query
   */


  _List.prototype.getListItemChangesSinceToken = function (query) {
    var o = this.clone(List, "getlistitemchangessincetoken").usingParser({
      parse: function (r) {
        return r.text();
      }
    });
    return (0, _operations.spPost)(o, (0, _odata.body)({
      "query": (0, _common.assign)((0, _metadata.metadata)("SP.ChangeLogItemQuery"), query)
    }));
  };
  /**
   * Moves the list to the Recycle Bin and returns the identifier of the new Recycle Bin item.
   */


  _List.prototype.recycle = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(List, "recycle"))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , (0, _common.hOP)(data, "Recycle") ? data.Recycle : data];
        }
      });
    });
  };
  /**
   * Renders list data based on the view xml provided
   * @param viewXml A string object representing a view xml
   */


  _List.prototype.renderListData = function (viewXml) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var q, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            q = this.clone(List, "renderlistdata(@viewXml)");
            q.query.set("@viewXml", "'" + viewXml + "'");
            return [4
            /*yield*/
            , (0, _operations.spPost)(q)];

          case 1:
            data = _a.sent(); // data will be a string, so we parse it again

            return [2
            /*return*/
            , JSON.parse((0, _common.hOP)(data, "RenderListData") ? data.RenderListData : data)];
        }
      });
    });
  };
  /**
   * Returns the data for the specified query view
   *
   * @param parameters The parameters to be used to render list data as JSON string.
   * @param overrideParameters The parameters that are used to override and extend the regular SPRenderListDataParameters.
   * @param queryParams Allows setting of query parameters
   */


  _List.prototype.renderListDataAsStream = function (parameters, overrideParameters, queryParams) {
    if (overrideParameters === void 0) {
      overrideParameters = null;
    }

    if (queryParams === void 0) {
      queryParams = new Map();
    }

    if ((0, _common.hOP)(parameters, "RenderOptions") && (0, _common.isArray)(parameters.RenderOptions)) {
      parameters.RenderOptions = parameters.RenderOptions.reduce(function (v, c) {
        return v + c;
      });
    }

    var postBody = (0, _odata.body)({
      overrideParameters: (0, _common.assign)((0, _metadata.metadata)("SP.RenderListDataOverrideParameters"), overrideParameters),
      parameters: (0, _common.assign)((0, _metadata.metadata)("SP.RenderListDataParameters"), parameters)
    });
    var clone = this.clone(List, "RenderListDataAsStream", true);

    if (queryParams && queryParams.size > 0) {
      queryParams.forEach(function (v, k) {
        return clone.query.set(k, v);
      });
    }

    return (0, _operations.spPost)(clone, postBody);
  };
  /**
   * Gets the field values and field schema attributes for a list item.
   * @param itemId Item id of the item to render form data for
   * @param formId The id of the form
   * @param mode Enum representing the control mode of the form (Display, Edit, New)
   */


  _List.prototype.renderListFormData = function (itemId, formId, mode) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(List, "renderlistformdata(itemid=" + itemId + ", formid='" + formId + "', mode='" + mode + "')"))];

          case 1:
            data = _a.sent(); // data will be a string, so we parse it again

            return [2
            /*return*/
            , JSON.parse((0, _common.hOP)(data, "RenderListFormData") ? data.RenderListFormData : data)];
        }
      });
    });
  };
  /**
   * Reserves a list item ID for idempotent list item creation.
   */


  _List.prototype.reserveListItemId = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(List, "reservelistitemid"))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , (0, _common.hOP)(data, "ReserveListItemId") ? data.ReserveListItemId : data];
        }
      });
    });
  };
  /**
   * Returns the ListItemEntityTypeFullName for this list, used when adding/updating list items. Does not support batching.
   */


  _List.prototype.getListItemEntityTypeFullName = function () {
    return this.clone(List, null, false).select("ListItemEntityTypeFullName").get().then(function (o) {
      return o.ListItemEntityTypeFullName;
    });
  };
  /**
   * Creates an item using path (in a folder), validates and sets its field values.
   *
   * @param formValues The fields to change and their new values.
   * @param decodedUrl Path decoded url; folder's server relative path.
   * @param bNewDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
   * @param checkInComment Optional check in comment.
   * @param additionalProps Optional set of additional properties LeafName new document file name,
   */


  _List.prototype.addValidateUpdateItemUsingPath = function (formValues, decodedUrl, bNewDocumentUpdate, checkInComment, additionalProps) {
    if (bNewDocumentUpdate === void 0) {
      bNewDocumentUpdate = false;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var addProps, res;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            addProps = {
              FolderPath: (0, _toResourcePath.toResourcePath)(decodedUrl)
            };

            if ((0, _common.objectDefinedNotNull)(additionalProps)) {
              if (additionalProps.leafName) {
                addProps.LeafName = (0, _toResourcePath.toResourcePath)(additionalProps.leafName);
              }

              if (additionalProps.objectType) {
                addProps.UnderlyingObjectType = additionalProps.objectType;
              }
            }

            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(List, "AddValidateUpdateItemUsingPath()"), (0, _odata.body)({
              bNewDocumentUpdate: bNewDocumentUpdate,
              checkInComment: checkInComment,
              formValues: formValues,
              listItemCreateInfo: (0, _common.assign)((0, _metadata.metadata)("SP.ListItemCreationInformationUsingPath"), addProps)
            }))];

          case 1:
            res = _a.sent();
            return [2
            /*return*/
            , (0, _common.hOP)(res, "AddValidateUpdateItemUsingPath") ? res.AddValidateUpdateItemUsingPath : res];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("l.update")], _List.prototype, "update", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("l.getChanges")], _List.prototype, "getChanges", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("l.CAMLQuery")], _List.prototype, "getItemsByCAMLQuery", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("l.ChangesSinceToken")], _List.prototype, "getListItemChangesSinceToken", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("l.recycle")], _List.prototype, "recycle", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("l.renderListData")], _List.prototype, "renderListData", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("l.AsStream")], _List.prototype, "renderListDataAsStream", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("l.renderListFormData")], _List.prototype, "renderListFormData", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("l.reserveListItemId")], _List.prototype, "reserveListItemId", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("l.getListItemEntityTypeFullName")], _List.prototype, "getListItemEntityTypeFullName", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("l.addValidateUpdateItemUsingPath")], _List.prototype, "addValidateUpdateItemUsingPath", null);
  return _List;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._List = _List;
var List = (0, _sharepointqueryable.spInvokableFactory)(_List);
/**
 * Enum representing the options of the RenderOptions property on IRenderListDataParameters interface
 */

exports.List = List;
var RenderListDataOptions;
exports.RenderListDataOptions = RenderListDataOptions;

(function (RenderListDataOptions) {
  RenderListDataOptions[RenderListDataOptions["None"] = 0] = "None";
  RenderListDataOptions[RenderListDataOptions["ContextInfo"] = 1] = "ContextInfo";
  RenderListDataOptions[RenderListDataOptions["ListData"] = 2] = "ListData";
  RenderListDataOptions[RenderListDataOptions["ListSchema"] = 4] = "ListSchema";
  RenderListDataOptions[RenderListDataOptions["MenuView"] = 8] = "MenuView";
  RenderListDataOptions[RenderListDataOptions["ListContentType"] = 16] = "ListContentType";
  RenderListDataOptions[RenderListDataOptions["FileSystemItemId"] = 32] = "FileSystemItemId";
  RenderListDataOptions[RenderListDataOptions["ClientFormSchema"] = 64] = "ClientFormSchema";
  RenderListDataOptions[RenderListDataOptions["QuickLaunch"] = 128] = "QuickLaunch";
  RenderListDataOptions[RenderListDataOptions["Spotlight"] = 256] = "Spotlight";
  RenderListDataOptions[RenderListDataOptions["Visualization"] = 512] = "Visualization";
  RenderListDataOptions[RenderListDataOptions["ViewMetadata"] = 1024] = "ViewMetadata";
  RenderListDataOptions[RenderListDataOptions["DisableAutoHyperlink"] = 2048] = "DisableAutoHyperlink";
  RenderListDataOptions[RenderListDataOptions["EnableMediaTAUrls"] = 4096] = "EnableMediaTAUrls";
  RenderListDataOptions[RenderListDataOptions["ParentInfo"] = 8192] = "ParentInfo";
  RenderListDataOptions[RenderListDataOptions["PageContextInfo"] = 16384] = "PageContextInfo";
  RenderListDataOptions[RenderListDataOptions["ClientSideComponentManifest"] = 32768] = "ClientSideComponentManifest";
})(RenderListDataOptions || (exports.RenderListDataOptions = RenderListDataOptions = {}));
/**
 * Determines the display mode of the given control or view
 */


var ControlMode;
exports.ControlMode = ControlMode;

(function (ControlMode) {
  ControlMode[ControlMode["Display"] = 1] = "Display";
  ControlMode[ControlMode["Edit"] = 2] = "Edit";
  ControlMode[ControlMode["New"] = 3] = "New";
})(ControlMode || (exports.ControlMode = ControlMode = {}));
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../odata":"../node_modules/@pnp/sp/odata.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../utils/escapeQueryStrValue":"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js","../utils/toResourcePath":"../node_modules/@pnp/sp/utils/toResourcePath.js"}],"../node_modules/@pnp/sp/items/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PagedItemCollection = exports.ItemVersion = exports._ItemVersion = exports.ItemVersions = exports._ItemVersions = exports.Item = exports._Item = exports.Items = exports._Items = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _common = require("@pnp/common");

var _types = require("../lists/types");

var _odata = require("@pnp/odata");

var _logging = require("@pnp/logging");

var _metadata = require("../utils/metadata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

/**
 * Describes a collection of Item objects
 *
 */
var _Items =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Items, _super);

  function _Items() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
  * Gets an Item by id
  *
  * @param id The integer id of the item to retrieve
  */


  _Items.prototype.getById = function (id) {
    return _telemetry.tag.configure(Item(this).concat("(" + id + ")"), "is.getById");
  };
  /**
   * Gets BCS Item by string id
   *
   * @param stringId The string id of the BCS item to retrieve
   */


  _Items.prototype.getItemByStringId = function (stringId) {
    // creates an item with the parent list path and append out method call
    return _telemetry.tag.configure(Item(this.parentUrl, "getItemByStringId('" + stringId + "')"), "is.getItemByStringId");
  };
  /**
   * Skips the specified number of items (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#sectionSection6)
   *
   * @param skip The starting id where the page should start, use with top to specify pages
   * @param reverse It true the PagedPrev=true parameter is added allowing backwards navigation in the collection
   */


  _Items.prototype.skip = function (skip, reverse) {
    if (reverse === void 0) {
      reverse = false;
    }

    if (reverse) {
      this.query.set("$skiptoken", encodeURIComponent("Paged=TRUE&PagedPrev=TRUE&p_ID=" + skip));
    } else {
      this.query.set("$skiptoken", encodeURIComponent("Paged=TRUE&p_ID=" + skip));
    }

    return this;
  };
  /**
   * Gets a collection designed to aid in paging through data
   *
   */


  _Items.prototype.getPaged = function () {
    return this.usingParser(new PagedItemCollectionParser(this))();
  };
  /**
   * Gets all the items in a list, regardless of count. Does not support batching or caching
   *
   *  @param requestSize Number of items to return in each request (Default: 2000)
   *  @param acceptHeader Allows for setting the value of the Accept header for SP 2013 support
   */


  _Items.prototype.getAll = function (requestSize, acceptHeader) {
    if (requestSize === void 0) {
      requestSize = 2000;
    }

    if (acceptHeader === void 0) {
      acceptHeader = "application/json;odata=nometadata";
    }

    _logging.Logger.write("Calling items.getAll should be done sparingly. Ensure this is the correct choice. If you are unsure, it is not.", 2
    /* Warning */
    ); // this will be used for the actual query
    // and we set no metadata here to try and reduce traffic


    var items = Items(this, "").top(requestSize).configure({
      headers: {
        "Accept": acceptHeader
      }
    }); // let's copy over the odata query params that can be applied
    // $top - allow setting the page size this way (override what we did above)
    // $select - allow picking the return fields (good behavior)
    // $filter - allow setting a filter, though this may fail due for large lists

    this.query.forEach(function (v, k) {
      if (/^\$select|filter|top|expand$/i.test(k)) {
        items.query.set(k, v);
      }
    }); // give back the promise

    return new Promise(function (resolve, reject) {
      // this will eventually hold the items we return
      var itemsCollector = []; // action that will gather up our results recursively

      var gatherer = function (last) {
        // collect that set of results
        [].push.apply(itemsCollector, last.results); // if we have more, repeat - otherwise resolve with the collected items

        if (last.hasNext) {
          last.getNext().then(gatherer).catch(reject);
        } else {
          resolve(itemsCollector);
        }
      }; // start the cycle


      items.getPaged().then(gatherer).catch(reject);
    });
  };
  /**
   * Adds a new item to the collection
   *
   * @param properties The new items's properties
   * @param listItemEntityTypeFullName The type name of the list's entities
   */


  _Items.prototype.add = function (properties, listItemEntityTypeFullName) {
    if (properties === void 0) {
      properties = {};
    }

    if (listItemEntityTypeFullName === void 0) {
      listItemEntityTypeFullName = null;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var removeDependency, listItemEntityType, postBody, promise;

      var _this = this;

      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            removeDependency = this.addBatchDependency();
            return [4
            /*yield*/
            , this.ensureListItemEntityTypeName(listItemEntityTypeFullName)];

          case 1:
            listItemEntityType = _a.sent();
            postBody = (0, _odata.body)((0, _common.assign)((0, _metadata.metadata)(listItemEntityType), properties));
            promise = (0, _operations.spPost)(this.clone(Items, ""), postBody).then(function (data) {
              return {
                data: data,
                item: _this.getById(data.Id)
              };
            });
            removeDependency();
            return [2
            /*return*/
            , promise];
        }
      });
    });
  };
  /**
   * Ensures we have the proper list item entity type name, either from the value provided or from the list
   *
   * @param candidatelistItemEntityTypeFullName The potential type name
   */


  _Items.prototype.ensureListItemEntityTypeName = function (candidatelistItemEntityTypeFullName) {
    return candidatelistItemEntityTypeFullName ? Promise.resolve(candidatelistItemEntityTypeFullName) : this.getParent(_types.List).getListItemEntityTypeFullName();
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("is.getPaged")], _Items.prototype, "getPaged", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("is.getAll")], _Items.prototype, "getAll", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("is.add")], _Items.prototype, "add", null);
  _Items = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("items")], _Items);
  return _Items;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Items = _Items;
var Items = (0, _sharepointqueryable.spInvokableFactory)(_Items);
/**
 * Descrines a single Item instance
 *
 */

exports.Items = Items;

var _Item =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Item, _super);

  function _Item() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteableWithETag)("i");
    return _this;
  }

  Object.defineProperty(_Item.prototype, "effectiveBasePermissions", {
    /**
     * Gets the effective base permissions for the item
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryable)(this, "EffectiveBasePermissions"), "i.effectiveBasePermissions");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Item.prototype, "effectiveBasePermissionsForUI", {
    /**
     * Gets the effective base permissions for the item in a UI context
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryable)(this, "EffectiveBasePermissionsForUI"), "i.effectiveBasePermissionsForUI");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Item.prototype, "fieldValuesAsHTML", {
    /**
     * Gets the field values for this list item in their HTML representation
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableInstance)(this, "FieldValuesAsHTML"), "i.fvHTML");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Item.prototype, "fieldValuesAsText", {
    /**
     * Gets the field values for this list item in their text representation
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableInstance)(this, "FieldValuesAsText"), "i.fvText");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Item.prototype, "fieldValuesForEdit", {
    /**
     * Gets the field values for this list item for use in editing controls
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableInstance)(this, "FieldValuesForEdit"), "i.fvEdit");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Item.prototype, "versions", {
    /**
     * Gets the collection of versions associated with this item
     */
    get: function () {
      return _telemetry.tag.configure(ItemVersions(this), "i.versions");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Item.prototype, "list", {
    get: function () {
      return this.getParent(_types.List, this.parentUrl.substr(0, this.parentUrl.lastIndexOf("/")));
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Updates this list intance with the supplied properties
   *
   * @param properties A plain object hash of values to update for the list
   * @param eTag Value used in the IF-Match header, by default "*"
   * @param listItemEntityTypeFullName The type name of the list's entities
   */

  _Item.prototype.update = function (properties, eTag, listItemEntityTypeFullName) {
    if (eTag === void 0) {
      eTag = "*";
    }

    if (listItemEntityTypeFullName === void 0) {
      listItemEntityTypeFullName = null;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var removeDependency, listItemEntityType, postBody, poster, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            removeDependency = this.addBatchDependency();
            return [4
            /*yield*/
            , this.ensureListItemEntityTypeName(listItemEntityTypeFullName)];

          case 1:
            listItemEntityType = _a.sent();
            postBody = (0, _odata.body)((0, _common.assign)((0, _metadata.metadata)(listItemEntityType), properties), (0, _odata.headers)({
              "IF-Match": eTag,
              "X-HTTP-Method": "MERGE"
            }));
            removeDependency();
            poster = _telemetry.tag.configure(this.clone(Item).usingParser(new ItemUpdatedParser()), "i.update");
            return [4
            /*yield*/
            , (0, _operations.spPost)(poster, postBody)];

          case 2:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              item: this
            }];
        }
      });
    });
  };
  /**
   * Moves the list item to the Recycle Bin and returns the identifier of the new Recycle Bin item.
   */


  _Item.prototype.recycle = function () {
    return (0, _operations.spPost)(this.clone(Item, "recycle"));
  };
  /**
   * Gets a string representation of the full URL to the WOPI frame.
   * If there is no associated WOPI application, or no associated action, an empty string is returned.
   *
   * @param action Display mode: 0: view, 1: edit, 2: mobileView, 3: interactivePreview
   */


  _Item.prototype.getWopiFrameUrl = function (action) {
    if (action === void 0) {
      action = 0;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var i, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            i = this.clone(Item, "getWOPIFrameUrl(@action)");
            i.query.set("@action", action);
            return [4
            /*yield*/
            , (0, _operations.spPost)(i)];

          case 1:
            data = _a.sent(); // handle verbose mode

            if ((0, _common.hOP)(data, "GetWOPIFrameUrl")) {
              return [2
              /*return*/
              , data.GetWOPIFrameUrl];
            }

            return [2
            /*return*/
            , data];
        }
      });
    });
  };
  /**
   * Validates and sets the values of the specified collection of fields for the list item.
   *
   * @param formValues The fields to change and their new values.
   * @param bNewDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
   */


  _Item.prototype.validateUpdateListItem = function (formValues, bNewDocumentUpdate) {
    if (bNewDocumentUpdate === void 0) {
      bNewDocumentUpdate = false;
    }

    return (0, _operations.spPost)(this.clone(Item, "validateupdatelistitem"), (0, _odata.body)({
      formValues: formValues,
      bNewDocumentUpdate: bNewDocumentUpdate
    }));
  };
  /**
   * Ensures we have the proper list item entity type name, either from the value provided or from the list
   *
   * @param candidatelistItemEntityTypeFullName The potential type name
   */


  _Item.prototype.ensureListItemEntityTypeName = function (candidatelistItemEntityTypeFullName) {
    return candidatelistItemEntityTypeFullName ? Promise.resolve(candidatelistItemEntityTypeFullName) : this.list.getListItemEntityTypeFullName();
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("i.recycle")], _Item.prototype, "recycle", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("i.getWopiFrameUrl")], _Item.prototype, "getWopiFrameUrl", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("i.validateUpdateListItem")], _Item.prototype, "validateUpdateListItem", null);
  return _Item;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Item = _Item;
var Item = (0, _sharepointqueryable.spInvokableFactory)(_Item);
/**
 * Describes a collection of Version objects
 *
 */

exports.Item = Item;

var _ItemVersions =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_ItemVersions, _super);

  function _ItemVersions() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a version by id
   *
   * @param versionId The id of the version to retrieve
   */


  _ItemVersions.prototype.getById = function (versionId) {
    return _telemetry.tag.configure(ItemVersion(this).concat("(" + versionId + ")"), "iv.getById");
  };

  _ItemVersions = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("versions")], _ItemVersions);
  return _ItemVersions;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._ItemVersions = _ItemVersions;
var ItemVersions = (0, _sharepointqueryable.spInvokableFactory)(_ItemVersions);
/**
 * Describes a single Version instance
 *
 */

exports.ItemVersions = ItemVersions;

var _ItemVersion =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_ItemVersion, _super);

  function _ItemVersion() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteableWithETag)("iv");
    return _this;
  }

  return _ItemVersion;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._ItemVersion = _ItemVersion;
var ItemVersion = (0, _sharepointqueryable.spInvokableFactory)(_ItemVersion);
/**
 * Provides paging functionality for list items
 */

exports.ItemVersion = ItemVersion;

var PagedItemCollection =
/** @class */
function () {
  function PagedItemCollection(parent, nextUrl, results) {
    this.parent = parent;
    this.nextUrl = nextUrl;
    this.results = results;
  }

  Object.defineProperty(PagedItemCollection.prototype, "hasNext", {
    /**
     * If true there are more results available in the set, otherwise there are not
     */
    get: function () {
      return typeof this.nextUrl === "string" && this.nextUrl.length > 0;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Gets the next set of results, or resolves to null if no results are available
   */

  PagedItemCollection.prototype.getNext = function () {
    if (this.hasNext) {
      var items = _telemetry.tag.configure(Items(this.nextUrl, null).configureFrom(this.parent), "ip.getNext");

      return items.getPaged();
    }

    return new Promise(function (r) {
      return r(null);
    });
  };

  return PagedItemCollection;
}();

exports.PagedItemCollection = PagedItemCollection;

var PagedItemCollectionParser =
/** @class */
function (_super) {
  (0, _tslib.__extends)(PagedItemCollectionParser, _super);

  function PagedItemCollectionParser(_parent) {
    var _this = _super.call(this) || this;

    _this._parent = _parent;
    return _this;
  }

  PagedItemCollectionParser.prototype.parse = function (r) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      if (_this.handleError(r, reject)) {
        r.json().then(function (json) {
          var nextUrl = (0, _common.hOP)(json, "d") && (0, _common.hOP)(json.d, "__next") ? json.d.__next : json["odata.nextLink"];
          resolve(new PagedItemCollection(_this._parent, nextUrl, _this.parseODataJSON(json)));
        });
      }
    });
  };

  return PagedItemCollectionParser;
}(_odata.ODataParser);

var ItemUpdatedParser =
/** @class */
function (_super) {
  (0, _tslib.__extends)(ItemUpdatedParser, _super);

  function ItemUpdatedParser() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  ItemUpdatedParser.prototype.parse = function (r) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      if (_this.handleError(r, reject)) {
        resolve({
          "odata.etag": r.headers.get("etag")
        });
      }
    });
  };

  return ItemUpdatedParser;
}(_odata.ODataParser);
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/common":"../node_modules/@pnp/common/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","@pnp/logging":"../node_modules/@pnp/logging/index.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/items/list.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../lists/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._List, "items", _types2.Items);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","./types":"../node_modules/@pnp/sp/items/types.js"}],"../node_modules/@pnp/sp/items/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Item", {
  enumerable: true,
  get: function () {
    return _types.Item;
  }
});
Object.defineProperty(exports, "Items", {
  enumerable: true,
  get: function () {
    return _types.Items;
  }
});
Object.defineProperty(exports, "ItemVersion", {
  enumerable: true,
  get: function () {
    return _types.ItemVersion;
  }
});
Object.defineProperty(exports, "ItemVersions", {
  enumerable: true,
  get: function () {
    return _types.ItemVersions;
  }
});
Object.defineProperty(exports, "PagedItemCollection", {
  enumerable: true,
  get: function () {
    return _types.PagedItemCollection;
  }
});

require("./list");

var _types = require("./types");
},{"./list":"../node_modules/@pnp/sp/items/list.js","./types":"../node_modules/@pnp/sp/items/types.js"}],"../node_modules/@pnp/sp/batch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SPBatch = void 0;

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _common = require("@pnp/common");

var _logging = require("@pnp/logging");

var _sphttpclient = require("./sphttpclient");

var _splibconfig = require("./splibconfig");

var _toabsoluteurl = require("./utils/toabsoluteurl");

/**
 * Manages a batch of OData operations
 */
var SPBatch =
/** @class */
function (_super) {
  (0, _tslib.__extends)(SPBatch, _super);

  function SPBatch(baseUrl) {
    var _this = _super.call(this) || this;

    _this.baseUrl = baseUrl;
    return _this;
  }
  /**
   * Parses the response from a batch request into an array of Response instances
   *
   * @param body Text body of the response from the batch request
   */


  SPBatch.ParseResponse = function (body) {
    var responses = [];
    var header = "--batchresponse_"; // Ex. "HTTP/1.1 500 Internal Server Error"

    var statusRegExp = new RegExp("^HTTP/[0-9.]+ +([0-9]+) +(.*)", "i");
    var lines = body.split("\n");
    var state = "batch";
    var status;
    var statusText;

    for (var i = 0; i < lines.length; ++i) {
      var line = lines[i];

      switch (state) {
        case "batch":
          if (line.substr(0, header.length) === header) {
            state = "batchHeaders";
          } else {
            if (line.trim() !== "") {
              throw Error("Invalid response, line " + i);
            }
          }

          break;

        case "batchHeaders":
          if (line.trim() === "") {
            state = "status";
          }

          break;

        case "status":
          var parts = statusRegExp.exec(line);

          if (parts.length !== 3) {
            throw Error("Invalid status, line " + i);
          }

          status = parseInt(parts[1], 10);
          statusText = parts[2];
          state = "statusHeaders";
          break;

        case "statusHeaders":
          if (line.trim() === "") {
            state = "body";
          }

          break;

        case "body":
          responses.push(status === 204 ? new Response() : new Response(line, {
            status: status,
            statusText: statusText
          }));
          state = "batch";
          break;
      }
    }

    if (state !== "status") {
      throw Error("Unexpected end of input");
    }

    return responses;
  };

  SPBatch.prototype.executeImpl = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var client, absoluteRequestUrl, batchBody, currentChangeSetId, i, reqInfo, headers, url, method, castHeaders, batchOptions, fetchResponse, text, responses;

      var _this = this;

      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            _logging.Logger.write("[" + this.batchId + "] (" + new Date().getTime() + ") Executing batch with " + this.requests.length + " requests.", 1
            /* Info */
            ); // if we don't have any requests, don't bother sending anything
            // this could be due to caching further upstream, or just an empty batch


            if (this.requests.length < 1) {
              _logging.Logger.write("Resolving empty batch.", 1
              /* Info */
              );

              return [2
              /*return*/
              ];
            }

            client = new _sphttpclient.SPHttpClient();
            return [4
            /*yield*/
            , (0, _toabsoluteurl.toAbsoluteUrl)(this.baseUrl)];

          case 1:
            absoluteRequestUrl = _a.sent();
            batchBody = [];
            currentChangeSetId = "";

            for (i = 0; i < this.requests.length; i++) {
              reqInfo = this.requests[i];

              if (reqInfo.method === "GET") {
                if (currentChangeSetId.length > 0) {
                  // end an existing change set
                  batchBody.push("--changeset_" + currentChangeSetId + "--\n\n");
                  currentChangeSetId = "";
                }

                batchBody.push("--batch_" + this.batchId + "\n");
              } else {
                if (currentChangeSetId.length < 1) {
                  // start new change set
                  currentChangeSetId = (0, _common.getGUID)();
                  batchBody.push("--batch_" + this.batchId + "\n");
                  batchBody.push("Content-Type: multipart/mixed; boundary=\"changeset_" + currentChangeSetId + "\"\n\n");
                }

                batchBody.push("--changeset_" + currentChangeSetId + "\n");
              } // common batch part prefix


              batchBody.push("Content-Type: application/http\n");
              batchBody.push("Content-Transfer-Encoding: binary\n\n");
              headers = new Headers();
              url = (0, _common.isUrlAbsolute)(reqInfo.url) ? reqInfo.url : (0, _common.combine)(absoluteRequestUrl, reqInfo.url);

              _logging.Logger.write("[" + this.batchId + "] (" + new Date().getTime() + ") Adding request " + reqInfo.method + " " + url + " to batch.", 0
              /* Verbose */
              );

              if (reqInfo.method !== "GET") {
                method = reqInfo.method;
                castHeaders = reqInfo.options.headers;

                if ((0, _common.hOP)(reqInfo, "options") && (0, _common.hOP)(reqInfo.options, "headers") && castHeaders["X-HTTP-Method"] !== undefined) {
                  method = castHeaders["X-HTTP-Method"];
                  delete castHeaders["X-HTTP-Method"];
                }

                batchBody.push(method + " " + url + " HTTP/1.1\n");
                headers.set("Content-Type", "application/json;odata=verbose;charset=utf-8");
              } else {
                batchBody.push(reqInfo.method + " " + url + " HTTP/1.1\n");
              } // merge global config headers


              (0, _common.mergeHeaders)(headers, _splibconfig.SPRuntimeConfig.headers); // merge per-request headers

              if (reqInfo.options) {
                (0, _common.mergeHeaders)(headers, reqInfo.options.headers);
              } // lastly we apply any default headers we need that may not exist


              if (!headers.has("Accept")) {
                headers.append("Accept", "application/json");
              }

              if (!headers.has("Content-Type")) {
                headers.append("Content-Type", "application/json;odata=verbose;charset=utf-8");
              }

              if (!headers.has("X-ClientService-ClientTag")) {
                headers.append("X-ClientService-ClientTag", "PnPCoreJS:@pnp-2.0.6:batch");
              } // write headers into batch body


              headers.forEach(function (value, name) {
                batchBody.push(name + ": " + value + "\n");
              });
              batchBody.push("\n");

              if (reqInfo.options.body) {
                batchBody.push(reqInfo.options.body + "\n\n");
              }
            }

            if (currentChangeSetId.length > 0) {
              // Close the changeset
              batchBody.push("--changeset_" + currentChangeSetId + "--\n\n");
              currentChangeSetId = "";
            }

            batchBody.push("--batch_" + this.batchId + "--\n");
            batchOptions = {
              "body": batchBody.join(""),
              "headers": {
                "Content-Type": "multipart/mixed; boundary=batch_" + this.batchId
              },
              "method": "POST"
            };

            _logging.Logger.write("[" + this.batchId + "] (" + new Date().getTime() + ") Sending batch request.", 1
            /* Info */
            );

            return [4
            /*yield*/
            , client.fetch((0, _common.combine)(absoluteRequestUrl, "/_api/$batch"), batchOptions)];

          case 2:
            fetchResponse = _a.sent();
            return [4
            /*yield*/
            , fetchResponse.text()];

          case 3:
            text = _a.sent();
            responses = SPBatch.ParseResponse(text);

            if (responses.length !== this.requests.length) {
              throw Error("Could not properly parse responses to match requests in batch.");
            }

            _logging.Logger.write("[" + this.batchId + "] (" + new Date().getTime() + ") Resolving batched requests.", 1
            /* Info */
            ); // this structure ensures that we resolve the batched requests in the order we expect
            // using async this is not guaranteed depending on the requests


            return [2
            /*return*/
            , responses.reduce(function (p, response, index) {
              return p.then(function (_) {
                return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
                  var request, _a, _b, e_1;

                  return (0, _tslib.__generator)(this, function (_c) {
                    switch (_c.label) {
                      case 0:
                        request = this.requests[index];

                        _logging.Logger.write("[" + request.id + "] (" + new Date().getTime() + ") Resolving request in batch " + this.batchId + ".", 1
                        /* Info */
                        );

                        _c.label = 1;

                      case 1:
                        _c.trys.push([1, 3,, 4]);

                        _b = (_a = request).resolve;
                        return [4
                        /*yield*/
                        , request.parser.parse(response)];

                      case 2:
                        _b.apply(_a, [_c.sent()]);

                        return [3
                        /*break*/
                        , 4];

                      case 3:
                        e_1 = _c.sent();
                        request.reject(e_1);
                        return [3
                        /*break*/
                        , 4];

                      case 4:
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              });
            }, Promise.resolve(void 0))];
        }
      });
    });
  };

  return SPBatch;
}(_odata.Batch);

exports.SPBatch = SPBatch;
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/logging":"../node_modules/@pnp/logging/index.js","./sphttpclient":"../node_modules/@pnp/sp/sphttpclient.js","./splibconfig":"../node_modules/@pnp/sp/splibconfig.js","./utils/toabsoluteurl":"../node_modules/@pnp/sp/utils/toabsoluteurl.js"}],"../node_modules/@pnp/sp/sites/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Site = exports._Site = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _decorators = require("../decorators");

var _types = require("../webs/types");

var _common = require("@pnp/common");

var _odata = require("@pnp/odata");

var _odata2 = require("../odata");

var _operations = require("../operations");

var _batch = require("../batch");

var _escapeQueryStrValue = require("../utils/escapeQueryStrValue");

var _telemetry = require("../telemetry");

var _metadata = require("../utils/metadata");

var _extractweburl = require("../utils/extractweburl");

var _splibconfig = require("../splibconfig");

var _Site =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Site, _super);

  function _Site() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_Site.prototype, "rootWeb", {
    /**
    * Gets the root web of the site collection
    *
    */
    get: function () {
      return _telemetry.tag.configure((0, _types.Web)(this, "rootweb"), "si.rootWeb");
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Gets a Web instance representing the root web of the site collection
   * correctly setup for chaining within the library
   */

  _Site.prototype.getRootWeb = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var web;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.rootWeb.select("Url")()];

          case 1:
            web = _a.sent();
            return [2
            /*return*/
            , _telemetry.tag.configure((0, _types.Web)(web.Url), "si.getRootWeb")];
        }
      });
    });
  };
  /**
  * Gets the context information for this site collection
  */


  _Site.prototype.getContextInfo = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var q, data, info;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            q = _telemetry.tag.configure(Site(this.parentUrl, "_api/contextinfo"), "si.getContextInfo");
            return [4
            /*yield*/
            , (0, _operations.spPost)(q)];

          case 1:
            data = _a.sent();

            if ((0, _common.hOP)(data, "GetContextWebInformation")) {
              info = data.GetContextWebInformation;
              info.SupportedSchemaVersions = info.SupportedSchemaVersions.results;
              return [2
              /*return*/
              , info];
            } else {
              return [2
              /*return*/
              , data];
            }

            return [2
            /*return*/
            ];
        }
      });
    });
  };

  _Site.prototype.createBatch = function () {
    return new _batch.SPBatch(this.parentUrl);
  };
  /**
  * Deletes the current site
  *
  */


  _Site.prototype.delete = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var site, q;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.clone(Site, "").select("Id")()];

          case 1:
            site = _a.sent();
            q = _telemetry.tag.configure(Site(this.parentUrl, "_api/SPSiteManager/Delete"), "si.delete");
            return [4
            /*yield*/
            , (0, _operations.spPost)(q, (0, _odata.body)({
              siteId: site.Id
            }))];

          case 2:
            _a.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Gets the document libraries on a site. Static method. (SharePoint Online only)
   *
   * @param absoluteWebUrl The absolute url of the web whose document libraries should be returned
   */


  _Site.prototype.getDocumentLibraries = function (absoluteWebUrl) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var q, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            q = _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryable)("", "_api/sp.web.getdocumentlibraries(@v)"), "si.getDocumentLibraries");
            q.query.set("@v", "'" + (0, _escapeQueryStrValue.escapeQueryStrValue)(absoluteWebUrl) + "'");
            return [4
            /*yield*/
            , q()];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , (0, _common.hOP)(data, "GetDocumentLibraries") ? data.GetDocumentLibraries : data];
        }
      });
    });
  };
  /**
   * Gets the site url from a page url
   *
   * @param absolutePageUrl The absolute url of the page
   */


  _Site.prototype.getWebUrlFromPageUrl = function (absolutePageUrl) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var q, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            q = _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryable)("", "_api/sp.web.getweburlfrompageurl(@v)"), "si.getWebUrlFromPageUrl");
            q.query.set("@v", "'" + (0, _escapeQueryStrValue.escapeQueryStrValue)(absolutePageUrl) + "'");
            return [4
            /*yield*/
            , q()];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , (0, _common.hOP)(data, "GetWebUrlFromPageUrl") ? data.GetWebUrlFromPageUrl : data];
        }
      });
    });
  };
  /**
   * Returns the collection of changes from the change log that have occurred within the list, based on the specified query
   *
   * @param query The change query
   */


  _Site.prototype.getChanges = function (query) {
    var postBody = (0, _odata.body)({
      "query": (0, _common.assign)((0, _metadata.metadata)("SP.ChangeQuery"), query)
    });
    return (0, _operations.spPost)(this.clone(_types.Web, "getchanges"), postBody);
  };
  /**
  * Opens a web by id (using POST)
  *
  * @param webId The GUID id of the web to open
  */


  _Site.prototype.openWebById = function (webId) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Site, "openWebById('" + webId + "')"))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              web: (0, _types.Web)((0, _extractweburl.extractWebUrl)((0, _odata2.odataUrlFrom)(data)))
            }];
        }
      });
    });
  };
  /**
   * Creates a Modern communication site.
   *
   * @param title The title of the site to create
   * @param lcid The language to use for the site. If not specified will default to 1033 (English).
   * @param shareByEmailEnabled If set to true, it will enable sharing files via Email. By default it is set to false
   * @param url The fully qualified URL (e.g. https://yourtenant.sharepoint.com/sites/mysitecollection) of the site.
   * @param description The description of the communication site.
   * @param classification The Site classification to use. For instance 'Contoso Classified'. See https://www.youtube.com/watch?v=E-8Z2ggHcS0 for more information
   * @param siteDesignId The Guid of the site design to be used.
   *                     You can use the below default OOTB GUIDs:
   *                     Topic: 00000000-0000-0000-0000-000000000000
   *                     Showcase: 6142d2a0-63a5-4ba0-aede-d9fefca2c767
   *                     Blank: f6cc5403-0d63-442e-96c0-285923709ffc
   * @param hubSiteId The id of the hub site to which the new site should be associated
   * @param owner Optional owner value, required if executing the method in app only mode
   */


  _Site.prototype.createCommunicationSite = function (title, lcid, shareByEmailEnabled, url, description, classification, siteDesignId, hubSiteId, owner) {
    if (lcid === void 0) {
      lcid = 1033;
    }

    if (shareByEmailEnabled === void 0) {
      shareByEmailEnabled = false;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      return (0, _tslib.__generator)(this, function (_a) {
        return [2
        /*return*/
        , this.createCommunicationSiteFromProps({
          Classification: classification,
          Description: description,
          HubSiteId: hubSiteId,
          Lcid: lcid,
          Owner: owner,
          ShareByEmailEnabled: shareByEmailEnabled,
          SiteDesignId: siteDesignId,
          Title: title,
          Url: url
        })];
      });
    });
  };

  _Site.prototype.createCommunicationSiteFromProps = function (props) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var p, postBody;
      return (0, _tslib.__generator)(this, function (_a) {
        p = Object.assign({}, {
          Classification: "",
          Description: "",
          HubSiteId: _splibconfig.emptyGuid,
          Lcid: 1033,
          ShareByEmailEnabled: false,
          SiteDesignId: _splibconfig.emptyGuid,
          WebTemplate: "SITEPAGEPUBLISHING#0",
          WebTemplateExtensionId: _splibconfig.emptyGuid
        }, props);
        postBody = (0, _odata.body)({
          "request": (0, _common.assign)((0, _metadata.metadata)("Microsoft.SharePoint.Portal.SPSiteCreationRequest"), p)
        });
        return [2
        /*return*/
        , (0, _operations.spPost)(Site((0, _extractweburl.extractWebUrl)(this.toUrl()), "/_api/SPSiteManager/Create"), postBody)];
      });
    });
  };
  /**
   *
   * @param url Site Url that you want to check if exists
   */


  _Site.prototype.exists = function (url) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, value;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = (0, _odata.body)({
              url: url
            });
            return [4
            /*yield*/
            , (0, _operations.spPost)(Site((0, _extractweburl.extractWebUrl)(this.toUrl()), "/_api/SP.Site.Exists"), postBody)];

          case 1:
            value = _a.sent();
            return [2
            /*return*/
            , value];
        }
      });
    });
  };
  /**
  * Creates a Modern team site backed by Office 365 group. For use in SP Online only. This will not work with App-only tokens
  *
  * @param displayName The title or display name of the Modern team site to be created
  * @param alias Alias of the underlying Office 365 Group
  * @param isPublic Defines whether the Office 365 Group will be public (default), or private.
  * @param lcid The language to use for the site. If not specified will default to English (1033).
  * @param description The description of the site to be created.
  * @param classification The Site classification to use. For instance 'Contoso Classified'. See https://www.youtube.com/watch?v=E-8Z2ggHcS0 for more information
  * @param owners The Owners of the site to be created
  */


  _Site.prototype.createModernTeamSite = function (displayName, alias, isPublic, lcid, description, classification, owners, hubSiteId, siteDesignId) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      return (0, _tslib.__generator)(this, function (_a) {
        return [2
        /*return*/
        , this.createModernTeamSiteFromProps({
          alias: alias,
          classification: classification,
          description: description,
          displayName: displayName,
          hubSiteId: hubSiteId,
          isPublic: isPublic,
          lcid: lcid,
          owners: owners,
          siteDesignId: siteDesignId
        })];
      });
    });
  };

  _Site.prototype.createModernTeamSiteFromProps = function (props) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var p, postBody;
      return (0, _tslib.__generator)(this, function (_a) {
        p = Object.assign({}, {
          classification: "",
          description: "",
          hubSiteId: _splibconfig.emptyGuid,
          isPublic: true,
          lcid: 1033,
          owners: []
        }, props);
        postBody = {
          alias: p.alias,
          displayName: p.displayName,
          isPublic: p.isPublic,
          optionalParams: {
            Classification: p.classification,
            CreationOptions: {
              "results": ["SPSiteLanguage:" + p.lcid, "HubSiteId:" + p.hubSiteId]
            },
            Description: p.description,
            Owners: {
              "results": p.owners
            }
          }
        };

        if (p.siteDesignId) {
          postBody.optionalParams.CreationOptions.results.push("implicit_formula_292aa8a00786498a87a5ca52d9f4214a_" + p.siteDesignId);
        }

        return [2
        /*return*/
        , (0, _operations.spPost)(Site((0, _extractweburl.extractWebUrl)(this.toUrl()), "/_api/GroupSiteManager/CreateGroupEx"), (0, _odata.body)(postBody))];
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("si.getChanges")], _Site.prototype, "getChanges", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("si.openWebById")], _Site.prototype, "openWebById", null);
  _Site = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("_api/site")], _Site);
  return _Site;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Site = _Site;
var Site = (0, _sharepointqueryable.spInvokableFactory)(_Site);
exports.Site = Site;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../odata":"../node_modules/@pnp/sp/odata.js","../operations":"../node_modules/@pnp/sp/operations.js","../batch":"../node_modules/@pnp/sp/batch.js","../utils/escapeQueryStrValue":"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","../splibconfig":"../node_modules/@pnp/sp/splibconfig.js"}],"../node_modules/@pnp/sp/sites/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Site", {
  enumerable: true,
  get: function () {
    return _types.Site;
  }
});

var _rest = require("../rest");

var _types = require("./types");

Reflect.defineProperty(_rest.SPRest.prototype, "site", {
  configurable: true,
  enumerable: true,
  get: function () {
    return (0, _types.Site)(this._baseUrl).configure(this._options);
  }
});
},{"../rest":"../node_modules/@pnp/sp/rest.js","./types":"../node_modules/@pnp/sp/sites/types.js"}],"../node_modules/@pnp/sp/webs/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Web = exports._Web = exports.Webs = exports._Webs = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _odata = require("@pnp/odata");

var _sharepointqueryable = require("../sharepointqueryable");

var _decorators = require("../decorators");

var _odata2 = require("../odata");

var _batch = require("../batch");

var _metadata = require("../utils/metadata");

var _sites = require("../sites");

var _operations = require("../operations");

var _escapeQueryStrValue = require("../utils/escapeQueryStrValue");

var _telemetry = require("../telemetry");

var _Webs =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Webs, _super);

  function _Webs() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Adds a new web to the collection
   *
   * @param title The new web's title
   * @param url The new web's relative url
   * @param description The new web's description
   * @param template The new web's template internal name (default = STS)
   * @param language The locale id that specifies the new web's language (default = 1033 [English, US])
   * @param inheritPermissions When true, permissions will be inherited from the new web's parent (default = true)
   */


  _Webs.prototype.add = function (title, url, description, template, language, inheritPermissions) {
    if (description === void 0) {
      description = "";
    }

    if (template === void 0) {
      template = "STS";
    }

    if (language === void 0) {
      language = 1033;
    }

    if (inheritPermissions === void 0) {
      inheritPermissions = true;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = (0, _odata.body)({
              "parameters": (0, _common.assign)((0, _metadata.metadata)("SP.WebCreationInformation"), {
                Description: description,
                Language: language,
                Title: title,
                Url: url,
                UseSamePermissionsAsParentSite: inheritPermissions,
                WebTemplate: template
              })
            });
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Webs, "add"), postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              web: Web((0, _odata2.odataUrlFrom)(data).replace(/_api\/web\/?/i, ""))
            }];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("ws.add")], _Webs.prototype, "add", null);
  _Webs = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("webs")], _Webs);
  return _Webs;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Webs = _Webs;
var Webs = (0, _sharepointqueryable.spInvokableFactory)(_Webs);
/**
 * Describes a web
 *
 */

exports.Webs = Webs;

var _Web =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Web, _super);

  function _Web() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteable)("w");
    return _this;
  }

  Object.defineProperty(_Web.prototype, "webs", {
    /**
     * Gets this web's subwebs
     *
     */
    get: function () {
      return Webs(this);
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Gets this web's parent web and data
   *
   */

  _Web.prototype.getParentWeb = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var ParentWeb;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spGet)(this.select("ParentWeb/Id").expand("ParentWeb"))];

          case 1:
            ParentWeb = _a.sent().ParentWeb;
            return [2
            /*return*/
            , ParentWeb ? (0, _sites.Site)(this.parentUrl).openWebById(ParentWeb.Id) : null];
        }
      });
    });
  };
  /**
  * Returns a collection of objects that contain metadata about subsites of the current site in which the current user is a member.
  *
  * @param nWebTemplateFilter Specifies the site definition (default = -1)
  * @param nConfigurationFilter A 16-bit integer that specifies the identifier of a configuration (default = -1)
  */


  _Web.prototype.getSubwebsFilteredForCurrentUser = function (nWebTemplateFilter, nConfigurationFilter) {
    if (nWebTemplateFilter === void 0) {
      nWebTemplateFilter = -1;
    }

    if (nConfigurationFilter === void 0) {
      nConfigurationFilter = -1;
    }

    var o = this.clone(Webs, "getSubwebsFilteredForCurrentUser(nWebTemplateFilter=" + nWebTemplateFilter + ",nConfigurationFilter=" + nConfigurationFilter + ")");
    return _telemetry.tag.configure(o, "w.getSubwebsFilteredForCurrentUser");
  };

  Object.defineProperty(_Web.prototype, "allProperties", {
    /**
     * Allows access to the web's all properties collection
     */
    get: function () {
      return _telemetry.tag.configure(this.clone(_sharepointqueryable.SharePointQueryableInstance, "allproperties"), "w.allprops");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Web.prototype, "webinfos", {
    /**
     * Gets a collection of WebInfos for this web's subwebs
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableCollection)(this, "webinfos"), "w.webinfos");
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Creates a new batch for requests within the context of this web
   *
   */

  _Web.prototype.createBatch = function () {
    return new _batch.SPBatch(this.parentUrl);
  };
  /**
   * Updates this web instance with the supplied properties
   *
   * @param properties A plain object hash of values to update for the web
   */


  _Web.prototype.update = function (properties) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = (0, _odata.body)((0, _common.assign)((0, _metadata.metadata)("SP.Web"), properties), (0, _odata.headers)({
              "X-HTTP-Method": "MERGE"
            }));
            return [4
            /*yield*/
            , (0, _operations.spPost)(this, postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              web: this
            }];
        }
      });
    });
  };
  /**
   * Applies the theme specified by the contents of each of the files specified in the arguments to the site
   *
   * @param colorPaletteUrl The server-relative URL of the color palette file
   * @param fontSchemeUrl The server-relative URL of the font scheme
   * @param backgroundImageUrl The server-relative URL of the background image
   * @param shareGenerated When true, the generated theme files are stored in the root site. When false, they are stored in this web
   */


  _Web.prototype.applyTheme = function (colorPaletteUrl, fontSchemeUrl, backgroundImageUrl, shareGenerated) {
    var postBody = (0, _odata.body)({
      backgroundImageUrl: backgroundImageUrl,
      colorPaletteUrl: colorPaletteUrl,
      fontSchemeUrl: fontSchemeUrl,
      shareGenerated: shareGenerated
    });
    return (0, _operations.spPost)(this.clone(Web, "applytheme"), postBody);
  };
  /**
   * Applies the specified site definition or site template to the Web site that has no template applied to it
   *
   * @param template Name of the site definition or the name of the site template
   */


  _Web.prototype.applyWebTemplate = function (template) {
    var q = this.clone(Web, "applywebtemplate");
    q.concat("(webTemplate='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(template) + "')");
    return (0, _operations.spPost)(q);
  };
  /**
   * Returns a collection of site templates available for the site
   *
   * @param language The locale id of the site templates to retrieve (default = 1033 [English, US])
   * @param includeCrossLanguage When true, includes language-neutral site templates; otherwise false (default = true)
   */


  _Web.prototype.availableWebTemplates = function (language, includeCrossLanugage) {
    if (language === void 0) {
      language = 1033;
    }

    if (includeCrossLanugage === void 0) {
      includeCrossLanugage = true;
    }

    var path = "getavailablewebtemplates(lcid=" + language + ", doincludecrosslanguage=" + includeCrossLanugage + ")";
    return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableCollection)(this, path), "w.availableWebTemplates");
  };
  /**
   * Returns the collection of changes from the change log that have occurred within the list, based on the specified query
   *
   * @param query The change query
   */


  _Web.prototype.getChanges = function (query) {
    var postBody = (0, _odata.body)({
      "query": (0, _common.assign)((0, _metadata.metadata)("SP.ChangeQuery"), query)
    });
    return (0, _operations.spPost)(this.clone(Web, "getchanges"), postBody);
  };
  /**
   * Returns the name of the image file for the icon that is used to represent the specified file
   *
   * @param filename The file name. If this parameter is empty, the server returns an empty string
   * @param size The size of the icon: 16x16 pixels = 0, 32x32 pixels = 1 (default = 0)
   * @param progId The ProgID of the application that was used to create the file, in the form OLEServerName.ObjectName
   */


  _Web.prototype.mapToIcon = function (filename, size, progId) {
    if (size === void 0) {
      size = 0;
    }

    if (progId === void 0) {
      progId = "";
    }

    return (0, _operations.spGet)(this.clone(Web, "maptoicon(filename='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(filename) + "', progid='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(progId) + "', size=" + size + ")"));
  };
  /**
   * Returns the tenant property corresponding to the specified key in the app catalog site
   *
   * @param key Id of storage entity to be set
   */


  _Web.prototype.getStorageEntity = function (key) {
    return (0, _operations.spGet)(this.clone(Web, "getStorageEntity('" + (0, _escapeQueryStrValue.escapeQueryStrValue)(key) + "')"));
  };
  /**
   * This will set the storage entity identified by the given key (MUST be called in the context of the app catalog)
   *
   * @param key Id of storage entity to be set
   * @param value Value of storage entity to be set
   * @param description Description of storage entity to be set
   * @param comments Comments of storage entity to be set
   */


  _Web.prototype.setStorageEntity = function (key, value, description, comments) {
    if (description === void 0) {
      description = "";
    }

    if (comments === void 0) {
      comments = "";
    }

    return (0, _operations.spPost)(this.clone(Web, "setStorageEntity"), (0, _odata.body)({
      comments: comments,
      description: description,
      key: key,
      value: value
    }));
  };
  /**
   * This will remove the storage entity identified by the given key
   *
   * @param key Id of storage entity to be removed
   */


  _Web.prototype.removeStorageEntity = function (key) {
    return (0, _operations.spPost)(this.clone(Web, "removeStorageEntity('" + (0, _escapeQueryStrValue.escapeQueryStrValue)(key) + "')"));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("w.getParentWeb")], _Web.prototype, "getParentWeb", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("w.update")], _Web.prototype, "update", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("w.applyTheme")], _Web.prototype, "applyTheme", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("w.applyWebTemplate")], _Web.prototype, "applyWebTemplate", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("w.getChanges")], _Web.prototype, "getChanges", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("w.mapToIcon")], _Web.prototype, "mapToIcon", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("w.getStorageEntity")], _Web.prototype, "getStorageEntity", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("w.setStorageEntity")], _Web.prototype, "setStorageEntity", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("w.removeStorageEntity")], _Web.prototype, "removeStorageEntity", null);
  _Web = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("_api/web")], _Web);
  return _Web;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Web = _Web;
var Web = (0, _sharepointqueryable.spInvokableFactory)(_Web);
exports.Web = Web;
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../odata":"../node_modules/@pnp/sp/odata.js","../batch":"../node_modules/@pnp/sp/batch.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","../sites":"../node_modules/@pnp/sp/sites/index.js","../operations":"../node_modules/@pnp/sp/operations.js","../utils/escapeQueryStrValue":"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/lists/web.js":[function(require,module,exports) {
"use strict";

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _types = require("../webs/types");

var _types2 = require("./types");

var _odata2 = require("../odata");

var _sharepointqueryable = require("../sharepointqueryable");

var _escapeQueryStrValue = require("../utils/escapeQueryStrValue");

(0, _odata.addProp)(_types._Web, "lists", _types2.Lists);
(0, _odata.addProp)(_types._Web, "siteUserInfoList", _types2.List, "siteuserinfolist");
(0, _odata.addProp)(_types._Web, "defaultDocumentLibrary", _types2.List, "DefaultDocumentLibrary");
(0, _odata.addProp)(_types._Web, "customListTemplates", _sharepointqueryable.SharePointQueryableCollection, "getcustomlisttemplates");

_types._Web.prototype.getList = function (listRelativeUrl) {
  return (0, _types2.List)(this, "getList('" + (0, _escapeQueryStrValue.escapeQueryStrValue)(listRelativeUrl) + "')");
};

_types._Web.prototype.getCatalog = function (type) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var data;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , this.clone(_types.Web, "getcatalog(" + type + ")").select("Id").get()];

        case 1:
          data = _a.sent();
          return [2
          /*return*/
          , (0, _types2.List)((0, _odata2.odataUrlFrom)(data))];
      }
    });
  });
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/lists/types.js","../odata":"../node_modules/@pnp/sp/odata.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../utils/escapeQueryStrValue":"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js"}],"../node_modules/@pnp/sp/lists/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "List", {
  enumerable: true,
  get: function () {
    return _types.List;
  }
});
Object.defineProperty(exports, "Lists", {
  enumerable: true,
  get: function () {
    return _types.Lists;
  }
});
Object.defineProperty(exports, "ControlMode", {
  enumerable: true,
  get: function () {
    return _types.ControlMode;
  }
});
Object.defineProperty(exports, "RenderListDataOptions", {
  enumerable: true,
  get: function () {
    return _types.RenderListDataOptions;
  }
});

require("./web");

var _types = require("./types");
},{"./web":"../node_modules/@pnp/sp/lists/web.js","./types":"../node_modules/@pnp/sp/lists/types.js"}],"../node_modules/@pnp/sp/webs/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Web", {
  enumerable: true,
  get: function () {
    return _types.Web;
  }
});
Object.defineProperty(exports, "Webs", {
  enumerable: true,
  get: function () {
    return _types.Webs;
  }
});

var _types = require("./types");

var _rest = require("../rest");

Reflect.defineProperty(_rest.SPRest.prototype, "web", {
  configurable: true,
  enumerable: true,
  get: function () {
    return (0, _types.Web)(this._baseUrl).configure(this._options);
  }
});

_rest.SPRest.prototype.createBatch = function () {
  return this.web.createBatch();
};
},{"./types":"../node_modules/@pnp/sp/webs/types.js","../rest":"../node_modules/@pnp/sp/rest.js"}],"../node_modules/@pnp/sp/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageType = exports.PrincipalSource = exports.PrincipalType = void 0;
// reference: https://msdn.microsoft.com/en-us/library/office/dn600183.aspx

/**
 * Specifies the type of a principal.
 */

/* tslint:disable:no-bitwise */
var PrincipalType;
exports.PrincipalType = PrincipalType;

(function (PrincipalType) {
  /**
   * Enumeration whose value specifies no principal type.
   */
  PrincipalType[PrincipalType["None"] = 0] = "None";
  /**
   * Enumeration whose value specifies a user as the principal type.
   */

  PrincipalType[PrincipalType["User"] = 1] = "User";
  /**
   * Enumeration whose value specifies a distribution list as the principal type.
   */

  PrincipalType[PrincipalType["DistributionList"] = 2] = "DistributionList";
  /**
   * Enumeration whose value specifies a security group as the principal type.
   */

  PrincipalType[PrincipalType["SecurityGroup"] = 4] = "SecurityGroup";
  /**
   * Enumeration whose value specifies a group as the principal type.
   */

  PrincipalType[PrincipalType["SharePointGroup"] = 8] = "SharePointGroup";
  /**
   * Enumeration whose value specifies all principal types.
   */

  PrincipalType[PrincipalType["All"] = 15] = "All";
})(PrincipalType || (exports.PrincipalType = PrincipalType = {}));
/* tslint:enable:no-bitwise */

/**
 * Specifies the source of a principal.
 */

/* tslint:disable:no-bitwise */


var PrincipalSource;
exports.PrincipalSource = PrincipalSource;

(function (PrincipalSource) {
  /**
   * Enumeration whose value specifies no principal source.
   */
  PrincipalSource[PrincipalSource["None"] = 0] = "None";
  /**
   * Enumeration whose value specifies user information list as the principal source.
   */

  PrincipalSource[PrincipalSource["UserInfoList"] = 1] = "UserInfoList";
  /**
   * Enumeration whose value specifies Active Directory as the principal source.
   */

  PrincipalSource[PrincipalSource["Windows"] = 2] = "Windows";
  /**
   * Enumeration whose value specifies the current membership provider as the principal source.
   */

  PrincipalSource[PrincipalSource["MembershipProvider"] = 4] = "MembershipProvider";
  /**
   * Enumeration whose value specifies the current role provider as the principal source.
   */

  PrincipalSource[PrincipalSource["RoleProvider"] = 8] = "RoleProvider";
  /**
   * Enumeration whose value specifies all principal sources.
   */

  PrincipalSource[PrincipalSource["All"] = 15] = "All";
})(PrincipalSource || (exports.PrincipalSource = PrincipalSource = {}));

var PageType;
exports.PageType = PageType;

(function (PageType) {
  PageType[PageType["Invalid"] = -1] = "Invalid";
  PageType[PageType["DefaultView"] = 0] = "DefaultView";
  PageType[PageType["NormalView"] = 1] = "NormalView";
  PageType[PageType["DialogView"] = 2] = "DialogView";
  PageType[PageType["View"] = 3] = "View";
  PageType[PageType["DisplayForm"] = 4] = "DisplayForm";
  PageType[PageType["DisplayFormDialog"] = 5] = "DisplayFormDialog";
  PageType[PageType["EditForm"] = 6] = "EditForm";
  PageType[PageType["EditFormDialog"] = 7] = "EditFormDialog";
  PageType[PageType["NewForm"] = 8] = "NewForm";
  PageType[PageType["NewFormDialog"] = 9] = "NewFormDialog";
  PageType[PageType["SolutionForm"] = 10] = "SolutionForm";
  PageType[PageType["PAGE_MAXITEMS"] = 11] = "PAGE_MAXITEMS";
})(PageType || (exports.PageType = PageType = {}));
},{}],"../node_modules/@pnp/sp/utils/objectToSPKeyValueCollection.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectToSPKeyValueCollection = objectToSPKeyValueCollection;

var _metadata = require("./metadata");

var _common = require("@pnp/common");

/**
 * Creates an object representing a SharePoint Collection(SP.KeyValue)
 *
 * @param obj The plain object defining the properties
 */
function objectToSPKeyValueCollection(obj) {
  return (0, _common.assign)((0, _metadata.metadata)("Collection(SP.KeyValue)"), {
    results: Object.keys(obj).map(function (key) {
      return (0, _common.assign)((0, _metadata.metadata)("SP.KeyValue"), {
        Key: key,
        Value: Reflect.get(obj, key),
        ValueType: "Edm.String"
      });
    })
  });
}
},{"./metadata":"../node_modules/@pnp/sp/utils/metadata.js","@pnp/common":"../node_modules/@pnp/common/index.js"}],"../node_modules/@pnp/sp/utils/file-names.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containsInvalidFileFolderChars = containsInvalidFileFolderChars;
exports.stripInvalidFileFolderChars = stripInvalidFileFolderChars;
var InvalidFileFolderNameCharsOnlineRegex = /["*:<>?/\\|\x00-\x1f\x7f-\x9f]/g;
var InvalidFileFolderNameCharsOnPremiseRegex = /["#%*:<>?/\\|\x00-\x1f\x7f-\x9f]/g;
/**
 * Checks if file or folder name contains invalid characters
 *
 * @param input File or folder name to check
 * @param onPremise Set to true for SharePoint On-Premise
 * @returns True if contains invalid chars, false otherwise
 */

function containsInvalidFileFolderChars(input, onPremise) {
  if (onPremise === void 0) {
    onPremise = false;
  }

  if (onPremise) {
    return InvalidFileFolderNameCharsOnPremiseRegex.test(input);
  } else {
    return InvalidFileFolderNameCharsOnlineRegex.test(input);
  }
}
/**
 * Removes invalid characters from file or folder name
 *
 * @param input File or folder name
 * @param replacer Value that will replace invalid characters
 * @param onPremise Set to true for SharePoint On-Premise
 * @returns File or folder name with replaced invalid characters
 */


function stripInvalidFileFolderChars(input, replacer, onPremise) {
  if (replacer === void 0) {
    replacer = "";
  }

  if (onPremise === void 0) {
    onPremise = false;
  }

  if (onPremise) {
    return input.replace(InvalidFileFolderNameCharsOnPremiseRegex, replacer);
  } else {
    return input.replace(InvalidFileFolderNameCharsOnlineRegex, replacer);
  }
}
},{}],"../node_modules/@pnp/sp/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SharePointQueryableInstance: true,
  SharePointQueryableCollection: true,
  SharePointQueryable: true,
  spInvokableFactory: true,
  SPBatch: true,
  SPHttpClient: true,
  SPRest: true,
  sp: true,
  toAbsoluteUrl: true,
  extractWebUrl: true,
  objectToSPKeyValueCollection: true,
  stripInvalidFileFolderChars: true,
  containsInvalidFileFolderChars: true
};
Object.defineProperty(exports, "SharePointQueryableInstance", {
  enumerable: true,
  get: function () {
    return _sharepointqueryable.SharePointQueryableInstance;
  }
});
Object.defineProperty(exports, "SharePointQueryableCollection", {
  enumerable: true,
  get: function () {
    return _sharepointqueryable.SharePointQueryableCollection;
  }
});
Object.defineProperty(exports, "SharePointQueryable", {
  enumerable: true,
  get: function () {
    return _sharepointqueryable.SharePointQueryable;
  }
});
Object.defineProperty(exports, "spInvokableFactory", {
  enumerable: true,
  get: function () {
    return _sharepointqueryable.spInvokableFactory;
  }
});
Object.defineProperty(exports, "SPBatch", {
  enumerable: true,
  get: function () {
    return _batch.SPBatch;
  }
});
Object.defineProperty(exports, "SPHttpClient", {
  enumerable: true,
  get: function () {
    return _sphttpclient.SPHttpClient;
  }
});
Object.defineProperty(exports, "SPRest", {
  enumerable: true,
  get: function () {
    return _rest.SPRest;
  }
});
Object.defineProperty(exports, "sp", {
  enumerable: true,
  get: function () {
    return _rest.sp;
  }
});
Object.defineProperty(exports, "toAbsoluteUrl", {
  enumerable: true,
  get: function () {
    return _toabsoluteurl.toAbsoluteUrl;
  }
});
Object.defineProperty(exports, "extractWebUrl", {
  enumerable: true,
  get: function () {
    return _extractweburl.extractWebUrl;
  }
});
Object.defineProperty(exports, "objectToSPKeyValueCollection", {
  enumerable: true,
  get: function () {
    return _objectToSPKeyValueCollection.objectToSPKeyValueCollection;
  }
});
Object.defineProperty(exports, "stripInvalidFileFolderChars", {
  enumerable: true,
  get: function () {
    return _fileNames.stripInvalidFileFolderChars;
  }
});
Object.defineProperty(exports, "containsInvalidFileFolderChars", {
  enumerable: true,
  get: function () {
    return _fileNames.containsInvalidFileFolderChars;
  }
});

var _sharepointqueryable = require("./sharepointqueryable");

var _batch = require("./batch");

var _decorators = require("./decorators");

Object.keys(_decorators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _decorators[key];
    }
  });
});

var _operations = require("./operations");

Object.keys(_operations).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _operations[key];
    }
  });
});

var _sphttpclient = require("./sphttpclient");

var _rest = require("./rest");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _toabsoluteurl = require("./utils/toabsoluteurl");

var _extractweburl = require("./utils/extractweburl");

var _objectToSPKeyValueCollection = require("./utils/objectToSPKeyValueCollection");

var _fileNames = require("./utils/file-names");
},{"./sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","./batch":"../node_modules/@pnp/sp/batch.js","./decorators":"../node_modules/@pnp/sp/decorators.js","./operations":"../node_modules/@pnp/sp/operations.js","./sphttpclient":"../node_modules/@pnp/sp/sphttpclient.js","./rest":"../node_modules/@pnp/sp/rest.js","./types":"../node_modules/@pnp/sp/types.js","./utils/toabsoluteurl":"../node_modules/@pnp/sp/utils/toabsoluteurl.js","./utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","./utils/objectToSPKeyValueCollection":"../node_modules/@pnp/sp/utils/objectToSPKeyValueCollection.js","./utils/file-names":"../node_modules/@pnp/sp/utils/file-names.js"}],"../node_modules/@pnp/sp/presets/core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  sp: true
};
exports.sp = void 0;

var _rest = require("../rest");

var _items = require("../items");

Object.keys(_items).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _items[key];
    }
  });
});

var _lists = require("../lists");

Object.keys(_lists).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _lists[key];
    }
  });
});

var _sites = require("../sites");

Object.keys(_sites).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sites[key];
    }
  });
});

var _webs = require("../webs");

Object.keys(_webs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _webs[key];
    }
  });
});

var _index = require("../index");

Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index[key];
    }
  });
});
var sp = new _rest.SPRest();
exports.sp = sp;
},{"../rest":"../node_modules/@pnp/sp/rest.js","../items":"../node_modules/@pnp/sp/items/index.js","../lists":"../node_modules/@pnp/sp/lists/index.js","../sites":"../node_modules/@pnp/sp/sites/index.js","../webs":"../node_modules/@pnp/sp/webs/index.js","../index":"../node_modules/@pnp/sp/index.js"}],"Utilities/utils.ts":[function(require,module,exports) {
"use strict";

var _a;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ui = exports.lists = exports.customFielPWA = exports.urls = void 0;

var core_1 = require("@pnp/sp/presets/core");

var config = {
  headers: (_a = {}, _a["accept"] = "application/json;odata=nometadata", _a)
};
var urls;

(function (urls) {
  urls.site = _spPageContextInfo.siteServerRelativeUrl;
  urls.PWA = "https://tccbpos.sharepoint.com/sites/pwa";
})(urls = exports.urls || (exports.urls = {}));

var customFielPWA;

(function (customFielPWA) {
  customFielPWA.fields = [{
    id: "42de966a-fa8d-e911-b079-00155d603a3b",
    type: "String",
    campo: "Estado Proyecto",
    lookup: []
  }, {
    id: "c08bc7c2-bc8b-e911-b083-00155d682b16",
    type: "String",
    campo: "Unidad Negocio",
    lookup: [{
      value: "Paquetería",
      key: "328f1671-bc8b-e911-b082-00155d689230"
    }, {
      value: "Mensajería",
      key: "338f1671-bc8b-e911-b082-00155d689230"
    }]
  }];
})(customFielPWA = exports.customFielPWA || (exports.customFielPWA = {}));

var lists;

(function (lists) {
  lists.Iniciativas = core_1.sp.web.lists.getById("1A9D7F85-A890-40A5-AAAC-B75FD53DD62D");
  lists.Iniciativas.configure(config);
  lists.MetaData = core_1.sp.web.lists.getById("3763F83B-5D11-4251-81C6-355CD8D89729");
  lists.MetaData.configure(config);
  lists.Puntaje = core_1.sp.web.lists.getById("0A7270B3-CC69-4138-9746-2CAD960DAF06");
  lists.Puntaje.configure(config);
  lists.Historico = core_1.sp.web.lists.getById("5B2737F2-BC7F-42A8-9B61-5ECFE5540762");
  lists.Historico.configure(config);
  lists.HistoricoEsfuerzo = core_1.sp.web.lists.getById("6BB91741-6C6E-4651-901B-69188C9CE9DB");
  lists.HistoricoEsfuerzo.configure(config);
  lists.ComiteValoracion = core_1.sp.web.lists.getById("2608abb3-ec5b-435b-b4b9-4500ad427cfd");
  lists.ComiteValoracion.configure(config);
  lists.ComiteValoracion1 = core_1.sp.web.lists.getById("b2ae66c3-c0fd-4e5f-8496-a5b172cc85bc");
  lists.ComiteValoracion1.configure(config);
  lists.ComiteValoracion2 = core_1.sp.web.lists.getById("C08D86C4-2FEE-486A-8EB5-A39DB175CEFE");
  lists.ComiteValoracion2.configure(config);
  lists.EquipoProductividad = core_1.sp.web.lists.getById("5b416733-d5fc-4d0e-a37d-a92d72d663b7");
  lists.EquipoProductividad.configure(config);
  lists.EquipoProyectos = core_1.sp.web.lists.getById("21a81907-776e-4693-b865-e9476f609f2d");
  lists.EquipoProyectos.configure(config);
  lists.EncargadosComite = core_1.sp.web.lists.getById("6ec10dd3-4f78-4ae1-a15a-e80ee06449e5");
  lists.EncargadosComite.configure(config);
  lists.GrupoIniciativas = core_1.sp.web.lists.getById("c0f99104-f4bf-4f92-96ab-0a6b9edd6e1f");
  lists.GrupoIniciativas.configure(config);
})(lists = exports.lists || (exports.lists = {}));

var ui;

(function (ui) {
  function renderFilterField(parameters) {
    var title = parameters.title,
        value = parameters.value,
        type = parameters.type,
        id = parameters.id,
        className = parameters.className,
        required = parameters.required,
        name = parameters.name,
        readonly = parameters.readonly,
        others = parameters.others,
        classTitle = parameters.classTitle;
    return "\n            <label class=\"label " + classTitle + "\">" + title + "</label>\n            <div class=\"control\">\n              <" + type + " id=\"" + (id || "") + "\" name=\"" + name + "\" class=\"" + (className || "") + "\" data-bind=\"value: " + value + "\" " + (required ? "required" : "") + " " + (readonly ? readonly : "") + " " + (others ? others : "") + "></" + type + ">\n            </div>\n        ";
  }

  ui.renderFilterField = renderFilterField;

  function renderFilterCheckField(parameters) {
    var title = parameters.title,
        value = parameters.value,
        type = parameters.type,
        id = parameters.id,
        className = parameters.className,
        required = parameters.required,
        name = parameters.name,
        readonly = parameters.readonly,
        others = parameters.others,
        classTitle = parameters.classTitle;
    return "\n          <label class=\"label " + classTitle + "\">" + title + "</label>\n          <div class=\"control\">\n            <" + type + " id=\"" + (id || "") + "\" name=\"" + name + "\" class=\"item-55 " + (className || "") + "\" data-bind=\"value: " + value + "\" " + (required ? "required" : "") + " " + (readonly ? readonly : "") + " " + (others ? others : "") + "></" + type + ">\n            <div class=\"is-inline\">\n                <input type=\"checkbox\" id=\"filterCheck" + id + "\" class=\"k-checkbox\">\n                <label class=\"k-checkbox-label\" for=\"filterCheck" + id + "\">Contain</label>\n            </div>\n          </div>\n      ";
  }

  ui.renderFilterCheckField = renderFilterCheckField;

  function renderFieldDetail(parameters) {
    var title = parameters.title,
        value = parameters.value,
        type = parameters.type,
        id = parameters.id,
        className = parameters.className,
        required = parameters.required,
        name = parameters.name,
        others = parameters.others,
        classTitle = parameters.classTitle;
    return "\n          <label>" + title + "</label>\n          <div class=\"control\">\n            <" + type + " id=\"" + (id || "") + "\" name=\"" + name + "\" class=\"" + (className || "") + "\" data-bind=\"value: " + value + "\" " + (required ? "required" : "") + " " + (others ? others : "") + "></" + type + ">\n          </div>\n      ";
  }

  ui.renderFieldDetail = renderFieldDetail;

  function renderFieldCheckbox(parameters, parameters2) {
    var title = parameters.title,
        value = parameters.value,
        type = parameters.type,
        id = parameters.id,
        className = parameters.className,
        required = parameters.required,
        name = parameters.name,
        others = parameters.others,
        classTitle = parameters.classTitle;
    return "\n          <label>" + title + "</label>\n          <div class=\"control\">\n            <" + type + " id=\"" + (id || "") + "\" name=\"" + name + "\" class=\"" + (className || "") + "\" data-bind=\"value: " + value + "\" " + (required ? "required" : "") + " " + (others ? others : "") + "></" + type + ">\n          </div>\n      ";
  }

  ui.renderFieldCheckbox = renderFieldCheckbox;

  function renderFieldSwitch(parameters) {
    var title = parameters.title,
        value = parameters.value,
        type = parameters.type,
        id = parameters.id,
        className = parameters.className;
    return "\n          <label>" + title + "</label>\n          <div class=\"control\">\n            <" + type + " id=\"" + (id || "") + "\" name=\"" + name + "\" class=\"" + (className || "") + "\" data-bind=\"value: " + value + "\"></" + type + ">\n          </div>\n      ";
  }

  ui.renderFieldSwitch = renderFieldSwitch;
})(ui = exports.ui || (exports.ui = {}));
},{"@pnp/sp/presets/core":"../node_modules/@pnp/sp/presets/core.js"}],"Template/IniciativasTemplate.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetTemplate = exports.getAttachments = void 0;

var utils_1 = require("../Utilities/utils");

var renderFieldDetail = utils_1.ui.renderFieldDetail; // Principal

var EstadoIdea = renderFieldDetail({
  id: "EstadoIdea",
  className: "input dropdown",
  title: "Estado de la iniciativa ",
  type: "input",
  name: "EstadoIdea",
  others: "validationMessage='Este campo es obligatorio'",
  value: "EstadoIdeaId",
  required: true
});
var UEN = renderFieldDetail({
  id: "UEN",
  className: "input dropdown",
  title: "UEN ",
  type: "input",
  name: "UEN",
  others: "validationMessage='Este campo es obligatorio'",
  value: "UENId",
  required: true
});
var NombreOportunidad = renderFieldDetail({
  id: "NombreOportunidad",
  className: "input",
  title: "Nombre de la oportunidad ",
  type: "input",
  name: "NombreOportunidad",
  others: "validationMessage='Este campo es obligatorio'",
  value: "NombreOportunidad",
  required: true
});
var Regional = renderFieldDetail({
  id: "Regional",
  className: "input dropdown",
  title: "Regional ",
  type: "input",
  name: "Regional",
  others: "validationMessage='Este campo es obligatorio'",
  value: "RegionalId",
  required: true
});
var CostoAproximado = renderFieldDetail({
  id: "CostoAproximado",
  className: "input",
  title: "Costo aproximado ",
  type: "input",
  name: "CostoAproximado",
  others: "validationMessage='Este campo es obligatorio' autocomplete='off' type='number'",
  value: "CostoAproximado",
  required: true
});
var TipoCosto = renderFieldDetail({
  id: "TipoCosto",
  className: "input dropdown",
  title: "Tipo Costo",
  type: "input",
  name: "TipoCosto",
  others: "validationMessage='Este campo es obligatorio'",
  value: "TipoCostoId",
  required: true
});
var Colaborador = renderFieldDetail({
  id: "Colaborador",
  className: "",
  title: "Colaborador ",
  type: "div",
  name: "Colaborador",
  others: "validationMessage='Este campo es obligatorio'",
  value: "Colaborador",
  required: true
});
var Telefono = renderFieldDetail({
  id: "Telefono",
  className: "input",
  title: "Teléfono ",
  type: "input",
  name: "Telefono",
  others: "validationMessage='Este campo es obligatorio'",
  value: "Telefono",
  required: true
});
var Correo = renderFieldDetail({
  id: "Correo",
  className: "input",
  title: "Correo ",
  type: "input",
  name: "Correo",
  others: "validationMessage='Este campo es obligatorio'type='email'",
  value: "Correo",
  required: true
});
var SitioAplicacion = renderFieldDetail({
  id: "SitioAplicacion",
  className: "input",
  title: "Sitio de aplicación ",
  type: "input",
  name: "SitioAplicacion",
  others: "validationMessage='Este campo es obligatorio'",
  value: "SitioAplicacion",
  required: true
});
var QueProponer = renderFieldDetail({
  id: "QueProponer",
  className: "input dropdown",
  title: "¿Qué quieres proponer? ",
  type: "input",
  name: "QueProponer",
  others: "validationMessage='Este campo es obligatorio'",
  value: "QueProponerId",
  required: true
});
var AnalistaAsignado = renderFieldDetail({
  id: "AnalistaAsignado",
  className: "",
  title: "Analista asignado",
  type: "div",
  name: "AnalistaAsignado",
  others: "validationMessage='Este campo es obligatorio'",
  value: "AnalistaAsignado",
  required: true
});
var Continuidad = renderFieldDetail({
  id: "Continuidad",
  className: "k-checkbox",
  title: "",
  type: "input",
  name: "Continuidad",
  others: "type='checkbox'",
  value: "",
  required: false
}); // Beneficios

var BeneficioEstimadoCosto = renderFieldDetail({
  id: "BeneficioEstimadoCosto",
  className: "input dropdown",
  title: "Beneficio Costo",
  type: "input",
  name: "BeneficioEstimadoCosto",
  others: "validationMessage='Este campo es obligatorio'",
  value: "BeneficioEstimadoCostoId",
  required: true
});
var AumentoVentas = renderFieldDetail({
  id: "AumentoVentas",
  className: "input dropdown",
  title: "Aumento Ventas ",
  type: "input",
  name: "AumentoVentas",
  others: "validationMessage='Este campo es obligatorio'",
  value: "AumentoVentasId",
  required: true
});
var IncrementoServicio = renderFieldDetail({
  id: "IncrementoServicio",
  className: "input dropdown",
  title: "Nivel De Servicio",
  type: "input",
  name: "IncrementoServicio",
  others: "validationMessage='Este campo es obligatorio'",
  value: "IncrementoServicioId",
  required: true
});
var CumplimientoNormativo = renderFieldDetail({
  id: "CumplimientoNormativo",
  className: "input dropdown",
  title: "Cumplimiento Normativo ",
  type: "input",
  name: "CumplimientoNormativo",
  others: "validationMessage='Este campo es obligatorio'",
  value: "CumplimientoNormativoId",
  required: true
});
var ProyectoInnovacion = renderFieldDetail({
  id: "ProyectoInnovacion",
  className: "input dropdown",
  title: "Proyecto de Innovación",
  type: "input",
  name: "ProyectoInnovacion",
  others: "validationMessage='Este campo es obligatorio'",
  value: "ProyectoInnovacionId",
  required: true
});
var EsfuerzoEnTiempo = renderFieldDetail({
  id: "EsfuerzoEnTiempo",
  className: "input dropdown",
  title: "Esfuerzo Tiempo ",
  type: "input",
  name: "EsfuerzoEnTiempo",
  others: "validationMessage='Este campo es obligatorio'",
  value: "EsfuerzoEnTiempoId",
  required: true
});
var EsfuerzoEnCostos = renderFieldDetail({
  id: "EsfuerzoEnCostos",
  className: "input dropdown",
  title: "Nivel de Inversión ",
  type: "input",
  name: "EsfuerzoEnCostos",
  others: "validationMessage='Este campo es obligatorio'",
  value: "EsfuerzoEnCostosId",
  required: true
});
var Beneficio = renderFieldDetail({
  id: "Beneficio",
  className: "input",
  title: "Beneficio ",
  type: "input",
  name: "Beneficio",
  others: "validationMessage='Este campo es obligatorio'",
  value: "Beneficio",
  required: true
});
var ReduccionCostos = renderFieldDetail({
  id: "ReduccionCostos",
  className: "input dropdown",
  title: "Reducción de costos",
  type: "input",
  name: "ReduccionCostos",
  others: "validationMessage='Este campo es obligatorio'",
  value: "ReduccionCostosId",
  required: true
});
var TipoBeneficio = renderFieldDetail({
  id: "TipoBeneficio",
  className: "input dropdown",
  title: "Tipo de beneficio",
  type: "input",
  name: "TipoBeneficio",
  others: "validationMessage='Este campo es obligatorio'",
  value: "TipoBeneficioId",
  required: true
});
var BeneficioEstimadoServicio = renderFieldDetail({
  id: "BeneficioEstimadoServicio",
  className: "input dropdown",
  title: "Beneficio Estimado Servicio",
  type: "input",
  name: "BeneficioEstimadoServicio",
  others: "validationMessage='Este campo es obligatorio'",
  value: "BeneficioEstimadoServicioId",
  required: true
});
var BeneficioVenta = renderFieldDetail({
  id: "BeneficioVenta",
  className: "input dropdown",
  title: "Beneficio Venta",
  type: "input",
  name: "BeneficioVenta",
  others: "validationMessage='Este campo es obligatorio'",
  value: "BeneficioVentaId",
  required: true
}); // General

var Coordinacion = renderFieldDetail({
  id: "Coordinacion",
  className: "input dropdown",
  title: "Coordinación",
  type: "input",
  name: "Coordinacion",
  others: "validationMessage='Este campo es obligatorio'",
  value: "CoordinacionId",
  required: true
});
var ComentariosEvaluacion = renderFieldDetail({
  id: "ComentariosEvaluacion",
  className: "input textarea",
  title: "Comentarios de evaluación",
  type: "textarea",
  name: "ComentariosEvaluacion",
  others: "validationMessage='Este campo es obligatorio'",
  value: "ComentariosEvaluacion",
  required: true
});
var DescripcionOportunidad = renderFieldDetail({
  id: "DescripcionOportunidad",
  className: "input textarea",
  title: "Descripción Oportunidad",
  type: "textarea",
  name: "DescripcionOportunidad",
  others: "validationMessage='Este campo es obligatorio'",
  value: "DescripcionOportunidad",
  required: true
});
var Area = renderFieldDetail({
  id: "Area",
  className: "input dropdown",
  title: "Área a la que pertenece",
  type: "input",
  name: "Area",
  others: "validationMessage='Este campo es obligatorio'",
  value: "AreaId",
  required: true
});
var IndicadorAsociado = renderFieldDetail({
  id: "IndicadorAsociado",
  className: "input textarea",
  title: "¿Tiene un Indicador Asociado? ¿Cuál?",
  type: "textarea",
  name: "IndicadorAsociado",
  others: "validationMessage='Este campo es obligatorio'",
  value: "IndicadorAsociado",
  required: true
});

function getAttachments() {
  return "\n\t<li style=\"list-style-type: decimal;\">\n\t\t<a target=\"_blank\" style=\"vertical-align: middle;\" href=\"#=ServerRelativeUrl#\">#= FileName #</a>\n\t\t<a class=\"k-delete-button\" href=\"#\"><span class=\"k-icon k-i-close\"><span></a>\n\t</li>\n\t\n\t";
}

exports.getAttachments = getAttachments;
/**
 * Funcion que pemite devolver un String
 */

function GetTemplate() {
  return "\n    <div id=\"tabstrip\">\n        <ul>\n            <li class=\"k-state-active\">Principal</li>\n            <li>Beneficios</li>\n            <li>General</li>\n            <li id=\"tabHistorico\">Hist\xF3rico</li>\n        </ul>\n\n\n        <div class=\"edit-container\">\n            <div class=\"columns\">\n                <div class=\"column is-6\">\n\n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + NombreOportunidad + "\n                        <span class=\"k-invalid-msg\" data-for=\"NombreOportunidad\"></span>\n                    </div>\n\n                    <div class=\"column is-11 NumeroIdea\">\n                        <label>Numero de idea</label><br />\n                        <input type=\"text\" class=\"input\" id=\"NumeroIdea\" name=\"NumeroIdea\" />\n                        <span class=\"k-invalid-msg\" data-for=\"PublicoImpactado\"></span>\n                    </div>\n\n\n                    <div class=\"column is-11 col-titulo\">\n                        <span class=\"required-icon\">*</span>\n                        " + EstadoIdea + "\n                        <span class=\"k-invalid-msg\" data-for=\"EstadoIdea\"></span>\n                    </div>\n\n                                \n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + UEN + "\n                        <span class=\"k-invalid-msg\" data-for=\"UEN\"></span>\n                    </div>\n                    \n                    <div class=\"column is-7\" id=\"columnCosto\">\n                        <span class=\"required-icon\">*</span>\n                            " + CostoAproximado + "\n                        <span class=\"k-invalid-msg\" data-for=\"CostoAproximado\"></span>\n                    </div>  \n\n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + Regional + "\n                        <span class=\"k-invalid-msg\" data-for=\"Regional\"></span>\n                    </div>  \n\n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + Telefono + "\n                        <span class=\"k-invalid-msg\" data-for=\"Telefono\"></span>\n                    </div>  \n\n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + IndicadorAsociado + "\n                        <span class=\"k-invalid-msg\" data-for=\"IndicadorAsociado\"></span>\n                    </div> \n                </div>      \n                            \n                <div class=\"column is-6\">\n\n                    <div class=\"column is-11 CreadoPor\">\n                        <label>Creado por</label><br />\n                        <input type=\"text\" class=\"input\" id=\"CreadoPor\" name=\"CreadoPor\" />\n                        <span class=\"k-invalid-msg\" data-for=\"PublicoImpactado\"></span>\n                    </div>\n\n                    <div class=\"column is-11 FechaCreacion\">\n                        <label>Fecha de creaci\xF3n</label><br />\n                        <input type=\"text\" class=\"input\" id=\"FechaCreacion\" name=\"FechaCreacion\" />\n                        <span class=\"k-invalid-msg\" data-for=\"PublicoImpactado\"></span>\n                    </div>\n\n\n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + Area + "\n                        <span class=\"k-invalid-msg\" data-for=\"Area\"></span>\n                    </div> \n\n\n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + Colaborador + "\n                        <span class=\"k-invalid-msg\" data-for=\"Colaborador\"></span>\n                    </div>\n\n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + Correo + "\n                        <span class=\"k-invalid-msg\" data-for=\"Correo\"></span>\n                    </div> \n\n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + QueProponer + "\n                        <span class=\"k-invalid-msg\" data-for=\"QueProponer\"></span>\n                    </div> \n                    \n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + DescripcionOportunidad + "\n                        <span class=\"k-invalid-msg\" data-for=\"DescripcionOportunidad\"></span>\n                    </div>\n\n                    <div class=\"column is-11\">\n                        <label>Adjuntos</label><br />\n                        <input name=\"adjuntos\" id=\"adjuntos\" type=\"file\" aria-label=\"files\" />\n                        <div id=\"listViewAttachment\"></div>\n                    </div>\n                    <div class=\"column is-11\">\n                        <br />\n                        <div style=\"display: flex; align-items: center;\">" + Continuidad + "<span style=\"font-size: 18px;\">&nbsp; \xBFProyecto de Continuidad?</span></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <!-- Beneficios -->\n        <div class=\"edit-container\">\n            <div class=\"columns\">\n                <div class=\"column is-6\">\n                    <label style=\"color: gray; font-size: 15px;\">PUNTUACI\xD3N BENEFICIOS</label>\n                    <br />\n                    <div class=\"columnsBeneficio\">\n                        <div class=\"column is-11\">\n                            <span class=\"required-icon\">*</span>\n                            " + ReduccionCostos + "\n                            <span class=\"k-invalid-msg\" data-for=\"ReduccionCostos\"></span>\n                        </div>\n\n                        <div class=\"column is-11\">\n                            <span class=\"required-icon\">*</span>\n                            " + AumentoVentas + "\n                            <span class=\"k-invalid-msg\" data-for=\"AumentoVentas\"></span>\n                        </div>\n                                    \n                        <div class=\"column is-11\">\n                            <span class=\"required-icon\">*</span>\n                            " + IncrementoServicio + "\n                            <span class=\"k-invalid-msg\" data-for=\"IncrementoServicio\"></span>\n                        </div>\n\n                        <div class=\"column is-11\">\n                            <span class=\"required-icon\">*</span>\n                            " + CumplimientoNormativo + "\n                            <span class=\"k-invalid-msg\" data-for=\"CumplimientoNormativo\"></span>\n                        </div>\n\n                        <!--<div id=\"radio-md\"><br>\n                            \n                            <legend class=\"label\" id=\"labelapprovers\"><span class=\"required-icon\">*</span> Proyecto de Innovaci\xF3n</legend>\n                            <div class=\"content-radio\">\n                                <input validationMessage=\"Este campo es obligatorio\" type=\"radio\" class=\"k-radio\" id=\"innovacion1\" name=\"innovacion\" value=\"innovacion1\" required=\"true\">\n                                <label for=\"innovacion1\">No es un proyecto de innovaci\xF3n</label><br>\n                            </div>\n                            \n                            <div class=\"content-radio\">\n                                <input validationMessage=\"Este campo es obligatorio\" type=\"radio\" class=\"k-radio\" id=\"innovacion2\" name=\"innovacion\" value=\"innovacion2\" required=\"true\">\n                                <label for=\"innovacion2\">Es un proyecto de innovaci\xF3n</label><br>\n                            </div>\n\n                            <span class=\"k-invalid-msg\" data-for=\"CumplimientoNormativo\"></span>\n                        </div>-->\n                    </div>\n                </div>\n\n                <div class=\"column is-6\">\n                    <label style=\"color: gray; font-size: 15px;\">PUNTUACI\xD3N ESFUERZOS</label>\n                    <div class=\"columnsBeneficio\">\n                        <div class=\"column is-11\">\n                            <span class=\"required-icon\">*</span>\n                            " + EsfuerzoEnTiempo + "\n                            <span class=\"k-invalid-msg\" data-for=\"EsfuerzoEnTiempo\"></span>\n                        </div>\n                                \n                        <div class=\"column is-11\">\n                            <span class=\"required-icon\">*</span>\n                            " + EsfuerzoEnCostos + "\n                            <span class=\"k-invalid-msg\" data-for=\"EsfuerzoEnCostos\"></span>\n                        </div>\n                    </div>\n\n                    <br />\n                    <!--<button class=\"button\" id=\"setPuntuacion\">Guardar Puntuaci\xF3n</button>-->\n                </div>\n            </div>\n        </div>\n\n        <!-- General -->\n        <div class=\"edit-container\">\n            <div class=\"columns\">\n                <div class=\"column is-6\">\n                                \n                    <!--<div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + TipoBeneficio + "\n                        <span class=\"k-invalid-msg\" data-for=\"TipoBeneficio\"></span>\n                    </div>-->\n                                \n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + Coordinacion + "\n                        <span class=\"k-invalid-msg\" data-for=\"Coordinacion\"></span>\n                    </div>\n                    \n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + ComentariosEvaluacion + "\n                        <span class=\"k-invalid-msg\" data-for=\"ComentariosEvaluacion\"></span>\n                    </div> \n                </div>      \n                            \n                <div class=\"column is-6\">\n\n                    <div class=\"column is-11\">\n                        <span class=\"required-icon\">*</span>\n                        " + AnalistaAsignado + "\n                        <span class=\"k-invalid-msg\" data-for=\"AnalistaAsignado\"></span>\n                    </div>\n                            \n                    <br />\n\n                    <div id=\"promoteContent\" class=\"column is-7\">\n                        <label>Promover a Project Online</label>\n                        <fieldset class=\"box box-promover\">\n                            <button id=\"btnPromover\"><span class=\"k-icon k-i-filter-add-group\"></span></button>\n                        </fieldset>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n\n        <div class=\"edit-container\" id=\"historico\">\n            \n            <fieldset class=\"box\">\n                <label style=\"color: gray; margin-bottom: 10px !important;\">HISTORICO DE PUNTUACI\xD3N BENEFICIO</label>\n                <div style=\"margin-top: 10px !important;\" id=\"gridHistorico\"></div>\n            </fieldset>\n\n            <fieldset class=\"box\">\n                <label style=\"color: gray; margin-bottom: 10px !important;\">HISTORICO DE PUNTUACI\xD3N ESFUERZO</label>\n                <div style=\"margin-top: 10px !important;\" id=\"gridHistoricoBeneficio\"></div>\n            </fieldset>\n        </div>\n\n    </div>\n  \n\n    <div id =\"load\"><div> \n    ";
}

exports.GetTemplate = GetTemplate;
},{"../Utilities/utils":"Utilities/utils.ts"}],"BusinessLogic/HistoricoBL.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HistoricoBL = void 0;

var utils_1 = require("../Utilities/utils");

var HistoricoBL;

(function (HistoricoBL) {
  function addHistorico(data) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.Historico.items.add(data)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  HistoricoBL.addHistorico = addHistorico;

  function addHistoricoEsfuerzo(data) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.HistoricoEsfuerzo.items.add(data)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  HistoricoBL.addHistoricoEsfuerzo = addHistoricoEsfuerzo;

  function calcularCampos() {
    return __awaiter(this, void 0, void 0, function () {
      var pesoReduccionCosto, pesoAumentoVentas, pesoNivelDeServicio, pesoEsfuerzoCosto, pesoEsfuerzoTiempo;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.MetaData.items.filter("Title eq 'ReduccionCostos' and Calificacion eq '1'").get()];

          case 1:
            pesoReduccionCosto = _a.sent();
            HistoricoBL.reduccion_costo = parseInt(pesoReduccionCosto[0].qmrp) / 100;
            return [4
            /*yield*/
            , utils_1.lists.MetaData.items.filter("Title eq 'AumentoVentas' and Calificacion eq '1'").get()];

          case 2:
            pesoAumentoVentas = _a.sent();
            HistoricoBL.aumento_ventas = parseInt(pesoAumentoVentas[0].qmrp) / 100;
            return [4
            /*yield*/
            , utils_1.lists.MetaData.items.filter("Title eq 'IncrementoServicio' and Calificacion eq '1'").get()];

          case 3:
            pesoNivelDeServicio = _a.sent();
            HistoricoBL.nivel_de_servicio = parseInt(pesoNivelDeServicio[0].qmrp) / 100;
            return [4
            /*yield*/
            , utils_1.lists.MetaData.items.filter("Title eq 'EsfuerzoEnCostos' and Calificacion eq '1'").get()];

          case 4:
            pesoEsfuerzoCosto = _a.sent();
            HistoricoBL.esfuerzo_costo = parseInt(pesoEsfuerzoCosto[0].qmrp) / 100;
            return [4
            /*yield*/
            , utils_1.lists.MetaData.items.filter("Title eq 'EsfuerzoEnTiempo' and Calificacion eq '1'").get()];

          case 5:
            pesoEsfuerzoTiempo = _a.sent();
            HistoricoBL.esfuerzo_tiempo = parseInt(pesoEsfuerzoTiempo[0].qmrp) / 100;
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  HistoricoBL.calcularCampos = calcularCampos;
})(HistoricoBL = exports.HistoricoBL || (exports.HistoricoBL = {}));
},{"../Utilities/utils":"Utilities/utils.ts"}],"Controller/PuntajeController.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PuntajeController = void 0;

var utils_1 = require("../Utilities/utils");

var IniciativasBL_1 = require("../BusinessLogic/IniciativasBL");

var HistoricoBL_1 = require("../BusinessLogic/HistoricoBL");

var PuntajeController;

(function (PuntajeController) {
  function createPuntaje(data) {
    return __awaiter(this, void 0, void 0, function () {
      var BeneficioCalculado, EsfuerzoCalculado, eb1, eb;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , HistoricoBL_1.HistoricoBL.calcularCampos()];

          case 1:
            _a.sent();

            BeneficioCalculado = data.ReduccionCostosId * HistoricoBL_1.HistoricoBL.reduccion_costo + data.AumentoVentasId * HistoricoBL_1.HistoricoBL.aumento_ventas + data.IncrementoServicioId * HistoricoBL_1.HistoricoBL.nivel_de_servicio;
            EsfuerzoCalculado = data.EsfuerzoEnTiempoId * HistoricoBL_1.HistoricoBL.esfuerzo_tiempo + data.EsfuerzoEnCostosId * HistoricoBL_1.HistoricoBL.esfuerzo_costo;
            eb1 = BeneficioCalculado * (1 / EsfuerzoCalculado);
            eb = eb1.toFixed(2);
            IniciativasBL_1.DataGridIniciativas.Historico = [{
              IdIniciativa: 0,
              BeneficioCosto: data.BeneficioEstimadoCostoId,
              AumentoVentas: data.AumentoVentasId,
              NivelDeServicio: data.IncrementoServicioId,
              ReduccionCostos: data.ReduccionCostosId,
              BeneficioCalculado: BeneficioCalculado
            }];
            IniciativasBL_1.DataGridIniciativas.HistoricoEsfuerzo = [{
              IdIniciativa: 0,
              EsfuerzoTiempo: data.EsfuerzoEnTiempoId,
              EsfuerzoCostos: data.EsfuerzoEnCostosId,
              EsfuerzoCalculado: EsfuerzoCalculado,
              EB: eb
            }];
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  PuntajeController.createPuntaje = createPuntaje;

  function updatePuntaje(data) {
    return __awaiter(this, void 0, void 0, function () {
      var result, result2, index1, index2, BeneficioCalculado, eb1, EsfuerzoCalculado, eb;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , HistoricoBL_1.HistoricoBL.calcularCampos()];

          case 1:
            _a.sent();

            return [4
            /*yield*/
            , utils_1.lists.Historico.items.filter("IdIniciativa eq " + data.Id).get()];

          case 2:
            result = _a.sent();
            return [4
            /*yield*/
            , utils_1.lists.HistoricoEsfuerzo.items.filter("IdIniciativa eq " + data.Id).get()];

          case 3:
            result2 = _a.sent();
            index1 = result.length - 1;
            index2 = result2.length - 1;

            if (result[index1].BeneficioCosto != data.BeneficioEstimadoCostoId || result[index1].AumentoVentas != data.AumentoVentasId || result[index1].NivelDeServicio != data.IncrementoServicioId || result[index1].ReduccionCostos != data.ReduccionCostosId) {
              PuntajeController.cambio = true;
            } else {
              PuntajeController.cambio = false;
            }

            if (result2[index2].EsfuerzoTiempo != data.EsfuerzoEnTiempoId || result2[index2].EsfuerzoCostos != data.EsfuerzoEnCostosId) {
              PuntajeController.cambioEsfuerzo = true;
            } else {
              PuntajeController.cambioEsfuerzo = false;
            }

            if (PuntajeController.cambio) {
              BeneficioCalculado = data.ReduccionCostosId * HistoricoBL_1.HistoricoBL.reduccion_costo + data.AumentoVentasId * HistoricoBL_1.HistoricoBL.aumento_ventas + data.IncrementoServicioId * HistoricoBL_1.HistoricoBL.nivel_de_servicio;
              IniciativasBL_1.DataGridIniciativas.Historico = [{
                IdIniciativa: data.IdIniciativa,
                BeneficioCosto: data.BeneficioEstimadoCostoId,
                AumentoVentas: data.AumentoVentasId,
                NivelDeServicio: data.IncrementoServicioId,
                ReduccionCostos: data.ReduccionCostosId,
                BeneficioCalculado: BeneficioCalculado
              }];
            }

            if (PuntajeController.cambioEsfuerzo) {
              EsfuerzoCalculado = data.EsfuerzoEnTiempoId * HistoricoBL_1.HistoricoBL.esfuerzo_tiempo + data.EsfuerzoEnCostosId * HistoricoBL_1.HistoricoBL.esfuerzo_costo;

              if (BeneficioCalculado != null && EsfuerzoCalculado != null) {
                eb1 = BeneficioCalculado * (1 / EsfuerzoCalculado);
                eb = eb1.toFixed(2);
              } else {
                eb = 0;
              }

              IniciativasBL_1.DataGridIniciativas.HistoricoEsfuerzo = [{
                IdIniciativa: data.IdIniciativa,
                EsfuerzoTiempo: data.EsfuerzoEnTiempoId,
                EsfuerzoCostos: data.EsfuerzoEnCostosId,
                EsfuerzoCalculado: EsfuerzoCalculado,
                EB: eb
              }];
            }

            return [2
            /*return*/
            ];
        }
      });
    });
  }

  PuntajeController.updatePuntaje = updatePuntaje;
})(PuntajeController = exports.PuntajeController || (exports.PuntajeController = {}));
},{"../Utilities/utils":"Utilities/utils.ts","../BusinessLogic/IniciativasBL":"BusinessLogic/IniciativasBL.ts","../BusinessLogic/HistoricoBL":"BusinessLogic/HistoricoBL.ts"}],"Controller/IniciativasController.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataController = void 0;

var utils_1 = require("../Utilities/utils");

var IniciativasBL_1 = require("../BusinessLogic/IniciativasBL");

var PuntajeController_1 = require("./PuntajeController");

var HistoricoBL_1 = require("../BusinessLogic/HistoricoBL");

var DataController;

(function (DataController) {
  function readData(filtro) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.orderBy("Created", false).select("*", "Colaborador/Name", "AnalistaAsignado/Name", "Author/Title", "EstadoIdea/Valor", "UEN/Valor").expand("Colaborador", "AnalistaAsignado", "Author", "EstadoIdea", "UEN").filter(filtro).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  DataController.readData = readData;

  function createData(data) {
    return __awaiter(this, void 0, void 0, function () {
      var promesas, _a, _b, _c, _d, _e, _f;

      return __generator(this, function (_g) {
        switch (_g.label) {
          case 0:
            promesas = [];
            _b = (_a = promesas).push;
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.add(data)];

          case 1:
            return [4
            /*yield*/
            , _b.apply(_a, [_g.sent()])];

          case 2:
            _g.sent();

            IniciativasBL_1.DataGridIniciativas.Historico[0].IdIniciativa = promesas[0].data.Id;
            IniciativasBL_1.DataGridIniciativas.HistoricoEsfuerzo[0].IdIniciativa = promesas[0].data.Id;
            _d = (_c = promesas).push;
            return [4
            /*yield*/
            , HistoricoBL_1.HistoricoBL.addHistorico(IniciativasBL_1.DataGridIniciativas.Historico[0])];

          case 3:
            return [4
            /*yield*/
            , _d.apply(_c, [_g.sent()])];

          case 4:
            _g.sent();

            _f = (_e = promesas).push;
            return [4
            /*yield*/
            , HistoricoBL_1.HistoricoBL.addHistoricoEsfuerzo(IniciativasBL_1.DataGridIniciativas.HistoricoEsfuerzo[0])];

          case 5:
            return [4
            /*yield*/
            , _f.apply(_e, [_g.sent()])];

          case 6:
            _g.sent();

            Promise.all(promesas).then(function (result) {
              IniciativasBL_1.IniciativasEvents.NotificationSuccess("Una nueva iniciativa fue agregada");
              $("#grid").data("kendoGrid").dataSource.read();
              $("#gridHistoricoBeneficio").data("kendoGrid").dataSource.read();
              return result;
            });
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  DataController.createData = createData;

  function updateData(data) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.Id).update(data)];

          case 1:
            result = _a.sent();
            return [4
            /*yield*/
            , PuntajeController_1.PuntajeController.updatePuntaje(data)];

          case 2:
            _a.sent();

            if (!PuntajeController_1.PuntajeController.cambio) return [3
            /*break*/
            , 4];
            IniciativasBL_1.DataGridIniciativas.Historico[0].IdIniciativa = data.Id;
            return [4
            /*yield*/
            , HistoricoBL_1.HistoricoBL.addHistorico(IniciativasBL_1.DataGridIniciativas.Historico[0])];

          case 3:
            _a.sent();

            $("#gridHistorico").data("kendoGrid").dataSource.read();
            _a.label = 4;

          case 4:
            if (!PuntajeController_1.PuntajeController.cambioEsfuerzo) return [3
            /*break*/
            , 6];
            IniciativasBL_1.DataGridIniciativas.HistoricoEsfuerzo[0].IdIniciativa = data.Id;
            return [4
            /*yield*/
            , HistoricoBL_1.HistoricoBL.addHistoricoEsfuerzo(IniciativasBL_1.DataGridIniciativas.HistoricoEsfuerzo[0])];

          case 5:
            _a.sent();

            $("#gridHistoricoBeneficio").data("kendoGrid").dataSource.read();
            _a.label = 6;

          case 6:
            IniciativasBL_1.IniciativasEvents.NotificationSuccess("Una iniciativa fue modificada con exito");
            $("#grid").data("kendoGrid").dataSource.read();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  DataController.updateData = updateData;

  function deleteData(data) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.Id).delete()];

          case 1:
            result = _a.sent();
            IniciativasBL_1.IniciativasEvents.NotificationSuccess("Una iniciativa fue eliminada con exito");
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  DataController.deleteData = deleteData;

  function addAttachment(id, data) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(id).attachmentFiles.addMultiple(data)];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  DataController.addAttachment = addAttachment;

  function getAttachment(id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(id).attachmentFiles.get()];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  DataController.getAttachment = getAttachment;

  function deleteAttachment(id, name) {
    return __awaiter(this, void 0, void 0, function () {
      var result, _a;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2,, 3]);

            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(id).attachmentFiles.getByName(name).delete()];

          case 1:
            result = _b.sent();
            IniciativasBL_1.IniciativasEvents.NotificationSuccess("Adjuntos eliminados con exito");
            return [2
            /*return*/
            , result];

          case 2:
            _a = _b.sent();
            IniciativasBL_1.IniciativasEvents.NotificationError("Ocurrió un error al eliminar los adjuntos");
            return [3
            /*break*/
            , 3];

          case 3:
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  DataController.deleteAttachment = deleteAttachment;
})(DataController = exports.DataController || (exports.DataController = {}));
},{"../Utilities/utils":"Utilities/utils.ts","../BusinessLogic/IniciativasBL":"BusinessLogic/IniciativasBL.ts","./PuntajeController":"Controller/PuntajeController.ts","../BusinessLogic/HistoricoBL":"BusinessLogic/HistoricoBL.ts"}],"../node_modules/@pnp/sp/files/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateFileType = exports.MoveOperations = exports.CheckinType = exports.Version = exports._Version = exports.Versions = exports._Versions = exports.File = exports._File = exports.Files = exports._Files = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _odata = require("@pnp/odata");

var _common = require("@pnp/common");

var _items = require("../items");

var _odata2 = require("../odata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _escapeQueryStrValue = require("../utils/escapeQueryStrValue");

var _extractweburl = require("../utils/extractweburl");

var _telemetry = require("../telemetry");

var _toResourcePath = require("../utils/toResourcePath");

/**
 * Describes a collection of File objects
 *
 */
var _Files =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Files, _super);

  function _Files() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a File by filename
   *
   * @param name The name of the file, including extension.
   */


  _Files.prototype.getByName = function (name) {
    if (/\%#/.test(name)) {
      throw Error("For file names containing % or # please use web.getFileByServerRelativePath");
    }

    return _telemetry.tag.configure(File(this).concat("('" + (0, _escapeQueryStrValue.escapeQueryStrValue)(name) + "')"), "fis.getByName");
  };
  /**
   * Uploads a file. Not supported for batching
   *
   * @param url The folder-relative url of the file.
   * @param content The file contents blob.
   * @param shouldOverWrite Should a file with the same name in the same location be overwritten? (default: true)
   * @returns The new File and the raw response.
   */


  _Files.prototype.add = function (url, content, shouldOverWrite) {
    if (shouldOverWrite === void 0) {
      shouldOverWrite = true;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var response;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(Files(this, "add(overwrite=" + shouldOverWrite + ",url='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(url) + "')"), {
              body: content
            })];

          case 1:
            response = _a.sent();
            return [2
            /*return*/
            , {
              data: response,
              file: this.getByName(url)
            }];
        }
      });
    });
  };
  /**
   * Adds a file using the pound percent safe methods
   *
   * @param url Excoded url of the file
   * @param content The file content
   * @param parameters Additional parameters to control method behavior
   */


  _Files.prototype.addUsingPath = function (url, content, parameters) {
    if (parameters === void 0) {
      parameters = {
        Overwrite: false
      };
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var path, resp;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            path = ["AddUsingPath(decodedurl='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(url) + "'"];

            if (parameters) {
              if (parameters.Overwrite) {
                path.push(",Overwrite=true");
              }

              if (parameters.AutoCheckoutOnInvalidData) {
                path.push(",AutoCheckoutOnInvalidData=true");
              }

              if (!(0, _common.stringIsNullOrEmpty)(parameters.XorHash)) {
                path.push(",XorHash=" + (0, _escapeQueryStrValue.escapeQueryStrValue)(parameters.XorHash));
              }
            }

            path.push(")");
            return [4
            /*yield*/
            , (0, _operations.spPost)(Files(this, path.join("")), {
              body: content
            })];

          case 1:
            resp = _a.sent();
            return [2
            /*return*/
            , {
              data: resp,
              file: File((0, _odata2.odataUrlFrom)(resp))
            }];
        }
      });
    });
  };
  /**
   * Uploads a file. Not supported for batching
   *
   * @param url The folder-relative url of the file.
   * @param content The Blob file content to add
   * @param progress A callback function which can be used to track the progress of the upload
   * @param shouldOverWrite Should a file with the same name in the same location be overwritten? (default: true)
   * @param chunkSize The size of each file slice, in bytes (default: 10485760)
   * @returns The new File and the raw response.
   */


  _Files.prototype.addChunked = function (url, content, progress, shouldOverWrite, chunkSize) {
    if (shouldOverWrite === void 0) {
      shouldOverWrite = true;
    }

    if (chunkSize === void 0) {
      chunkSize = 10485760;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var file;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Files, "add(overwrite=" + shouldOverWrite + ",url='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(url) + "')", false))];

          case 1:
            _a.sent();

            file = this.getByName(url);
            return [4
            /*yield*/
            , file.setContentChunked(content, progress, chunkSize)];

          case 2:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  };
  /**
   * Adds a ghosted file to an existing list or document library. Not supported for batching.
   *
   * @param fileUrl The server-relative url where you want to save the file.
   * @param templateFileType The type of use to create the file.
   * @returns The template file that was added and the raw response.
   */


  _Files.prototype.addTemplateFile = function (fileUrl, templateFileType) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var response;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Files, "addTemplateFile(urloffile='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(fileUrl) + "',templatefiletype=" + templateFileType + ")", false))];

          case 1:
            response = _a.sent();
            return [2
            /*return*/
            , {
              data: response,
              file: File((0, _odata2.odataUrlFrom)(response))
            }];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("fis.add")], _Files.prototype, "add", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fis.addUsingPath")], _Files.prototype, "addUsingPath", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fis.addChunked")], _Files.prototype, "addChunked", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fis.addTemplateFile")], _Files.prototype, "addTemplateFile", null);
  _Files = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("files")], _Files);
  return _Files;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Files = _Files;
var Files = (0, _sharepointqueryable.spInvokableFactory)(_Files);
/**
 * Describes a single File instance
 *
 */

exports.Files = Files;

var _File =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_File, _super);

  function _File() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteableWithETag)("fi");
    return _this;
  }

  Object.defineProperty(_File.prototype, "listItemAllFields", {
    /**
     * Gets a value that specifies the list item field values for the list item corresponding to the file.
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableInstance)(this, "listItemAllFields"), "fi.listItemAllFields");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_File.prototype, "versions", {
    /**
     * Gets a collection of versions
     *
     */
    get: function () {
      return _telemetry.tag.configure(Versions(this), "fi.versions");
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Approves the file submitted for content approval with the specified comment.
   * Only documents in lists that are enabled for content approval can be approved.
   *
   * @param comment The comment for the approval.
   */

  _File.prototype.approve = function (comment) {
    if (comment === void 0) {
      comment = "";
    }

    return (0, _operations.spPost)(this.clone(File, "approve(comment='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(comment) + "')"));
  };
  /**
   * Stops the chunk upload session without saving the uploaded data. Does not support batching.
   * If the file doesn’t already exist in the library, the partially uploaded file will be deleted.
   * Use this in response to user action (as in a request to cancel an upload) or an error or exception.
   * Use the uploadId value that was passed to the StartUpload method that started the upload session.
   * This method is currently available only on Office 365.
   *
   * @param uploadId The unique identifier of the upload session.
   */


  _File.prototype.cancelUpload = function (uploadId) {
    return (0, _operations.spPost)(this.clone(File, "cancelUpload(uploadId=guid'" + uploadId + "')", false));
  };
  /**
   * Checks the file in to a document library based on the check-in type.
   *
   * @param comment A comment for the check-in. Its length must be <= 1023.
   * @param checkinType The check-in type for the file.
   */


  _File.prototype.checkin = function (comment, checkinType) {
    if (comment === void 0) {
      comment = "";
    }

    if (checkinType === void 0) {
      checkinType = CheckinType.Major;
    }

    if (comment.length > 1023) {
      throw Error("The maximum comment length is 1023 characters.");
    }

    return (0, _operations.spPost)(this.clone(File, "checkin(comment='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(comment) + "',checkintype=" + checkinType + ")"));
  };
  /**
   * Checks out the file from a document library.
   */


  _File.prototype.checkout = function () {
    return (0, _operations.spPost)(this.clone(File, "checkout"));
  };
  /**
   * Copies the file to the destination url.
   *
   * @param url The absolute url or server relative url of the destination file path to copy to.
   * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
   */


  _File.prototype.copyTo = function (url, shouldOverWrite) {
    if (shouldOverWrite === void 0) {
      shouldOverWrite = true;
    }

    return (0, _operations.spPost)(this.clone(File, "copyTo(strnewurl='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(url) + "',boverwrite=" + shouldOverWrite + ")"));
  };
  /**
   * Copies the file by path to destination path.
   * Also works with different site collections.
   *
   * @param destUrl The absolute url or server relative url of the destination file path to copy to.
   * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
   * @param keepBoth Keep both if file with the same name in the same location already exists? Only relevant when shouldOverWrite is set to false.
   */


  _File.prototype.copyByPath = function (destUrl, shouldOverWrite, KeepBoth) {
    if (KeepBoth === void 0) {
      KeepBoth = false;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var _a, srcUrl, absoluteUrl, webBaseUrl, hostUrl;

      return (0, _tslib.__generator)(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4
            /*yield*/
            , this.select("ServerRelativeUrl")()];

          case 1:
            _a = _b.sent(), srcUrl = _a.ServerRelativeUrl, absoluteUrl = _a["odata.id"];
            webBaseUrl = (0, _extractweburl.extractWebUrl)(absoluteUrl);
            hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
            return [4
            /*yield*/
            , (0, _operations.spPost)(File(webBaseUrl, "/_api/SP.MoveCopyUtil.CopyFileByPath(overwrite=@a1)?@a1=" + shouldOverWrite), (0, _odata.body)({
              destPath: (0, _toResourcePath.toResourcePath)((0, _common.isUrlAbsolute)(destUrl) ? destUrl : "" + hostUrl + destUrl),
              options: {
                KeepBoth: KeepBoth,
                ResetAuthorAndCreatedOnCopy: true,
                ShouldBypassSharedLocks: true,
                __metadata: {
                  type: "SP.MoveCopyOptions"
                }
              },
              srcPath: (0, _toResourcePath.toResourcePath)((0, _common.isUrlAbsolute)(srcUrl) ? srcUrl : "" + hostUrl + srcUrl)
            }))];

          case 2:
            _b.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Denies approval for a file that was submitted for content approval.
   * Only documents in lists that are enabled for content approval can be denied.
   *
   * @param comment The comment for the denial.
   */


  _File.prototype.deny = function (comment) {
    if (comment === void 0) {
      comment = "";
    }

    if (comment.length > 1023) {
      throw Error("The maximum comment length is 1023 characters.");
    }

    return (0, _operations.spPost)(this.clone(File, "deny(comment='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(comment) + "')"));
  };
  /**
   * Moves the file to the specified destination url.
   *
   * @param url The absolute url or server relative url of the destination file path to move to.
   * @param moveOperations The bitwise MoveOperations value for how to move the file.
   */


  _File.prototype.moveTo = function (url, moveOperations) {
    if (moveOperations === void 0) {
      moveOperations = MoveOperations.Overwrite;
    }

    return (0, _operations.spPost)(this.clone(File, "moveTo(newurl='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(url) + "',flags=" + moveOperations + ")"));
  };
  /**
   * Moves the file by path to the specified destination url.
   * Also works with different site collections.
   *
   * @param destUrl The absolute url or server relative url of the destination file path to move to.
   * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
   * @param keepBoth Keep both if file with the same name in the same location already exists? Only relevant when shouldOverWrite is set to false.
   */


  _File.prototype.moveByPath = function (destUrl, shouldOverWrite, KeepBoth) {
    if (KeepBoth === void 0) {
      KeepBoth = false;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var _a, srcUrl, absoluteUrl, webBaseUrl, hostUrl;

      return (0, _tslib.__generator)(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4
            /*yield*/
            , this.select("ServerRelativeUrl")()];

          case 1:
            _a = _b.sent(), srcUrl = _a.ServerRelativeUrl, absoluteUrl = _a["odata.id"];
            webBaseUrl = (0, _extractweburl.extractWebUrl)(absoluteUrl);
            hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
            return [4
            /*yield*/
            , (0, _operations.spPost)(File(webBaseUrl, "/_api/SP.MoveCopyUtil.MoveFileByPath(overwrite=@a1)?@a1=" + shouldOverWrite), (0, _odata.body)({
              destPath: (0, _toResourcePath.toResourcePath)((0, _common.isUrlAbsolute)(destUrl) ? destUrl : "" + hostUrl + destUrl),
              options: {
                KeepBoth: KeepBoth,
                ResetAuthorAndCreatedOnCopy: false,
                ShouldBypassSharedLocks: true,
                __metadata: {
                  type: "SP.MoveCopyOptions"
                }
              },
              srcPath: (0, _toResourcePath.toResourcePath)((0, _common.isUrlAbsolute)(srcUrl) ? srcUrl : "" + hostUrl + srcUrl)
            }))];

          case 2:
            _b.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Submits the file for content approval with the specified comment.
   *
   * @param comment The comment for the published file. Its length must be <= 1023.
   */


  _File.prototype.publish = function (comment) {
    if (comment === void 0) {
      comment = "";
    }

    if (comment.length > 1023) {
      throw Error("The maximum comment length is 1023 characters.");
    }

    return (0, _operations.spPost)(this.clone(File, "publish(comment='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(comment) + "')"));
  };
  /**
   * Moves the file to the Recycle Bin and returns the identifier of the new Recycle Bin item.
   *
   * @returns The GUID of the recycled file.
   */


  _File.prototype.recycle = function () {
    return (0, _operations.spPost)(this.clone(File, "recycle"));
  };
  /**
   * Reverts an existing checkout for the file.
   *
   */


  _File.prototype.undoCheckout = function () {
    return (0, _operations.spPost)(this.clone(File, "undoCheckout"));
  };
  /**
   * Removes the file from content approval or unpublish a major version.
   *
   * @param comment The comment for the unpublish operation. Its length must be <= 1023.
   */


  _File.prototype.unpublish = function (comment) {
    if (comment === void 0) {
      comment = "";
    }

    if (comment.length > 1023) {
      throw Error("The maximum comment length is 1023 characters.");
    }

    return (0, _operations.spPost)(this.clone(File, "unpublish(comment='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(comment) + "')"));
  };
  /**
   * Gets the contents of the file as text. Not supported in batching.
   *
   */


  _File.prototype.getText = function () {
    return this.clone(File, "$value", false).usingParser(new _odata.TextParser())((0, _odata.headers)({
      "binaryStringResponseBody": "true"
    }));
  };
  /**
   * Gets the contents of the file as a blob, does not work in Node.js. Not supported in batching.
   *
   */


  _File.prototype.getBlob = function () {
    return this.clone(File, "$value", false).usingParser(new _odata.BlobParser())((0, _odata.headers)({
      "binaryStringResponseBody": "true"
    }));
  };
  /**
   * Gets the contents of a file as an ArrayBuffer, works in Node.js. Not supported in batching.
   */


  _File.prototype.getBuffer = function () {
    return this.clone(File, "$value", false).usingParser(new _odata.BufferParser())((0, _odata.headers)({
      "binaryStringResponseBody": "true"
    }));
  };
  /**
   * Gets the contents of a file as an ArrayBuffer, works in Node.js. Not supported in batching.
   */


  _File.prototype.getJSON = function () {
    return this.clone(File, "$value", false).usingParser(new _odata.JSONParser())((0, _odata.headers)({
      "binaryStringResponseBody": "true"
    }));
  };
  /**
   * Sets the content of a file, for large files use setContentChunked. Not supported in batching.
   *
   * @param content The file content
   *
   */


  _File.prototype.setContent = function (content) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(File, "$value", false), {
              body: content,
              headers: {
                "X-HTTP-Method": "PUT"
              }
            })];

          case 1:
            _a.sent();

            return [2
            /*return*/
            , File(this)];
        }
      });
    });
  };
  /**
   * Gets the associated list item for this folder, loading the default properties
   */


  _File.prototype.getItem = function () {
    var selects = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      selects[_i] = arguments[_i];
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var q, d;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            q = this.listItemAllFields;
            return [4
            /*yield*/
            , q.select.apply(q, selects)()];

          case 1:
            d = _a.sent();
            return [2
            /*return*/
            , (0, _common.assign)((0, _items.Item)((0, _odata2.odataUrlFrom)(d)), d)];
        }
      });
    });
  };
  /**
   * Sets the contents of a file using a chunked upload approach. Not supported in batching.
   *
   * @param file The file to upload
   * @param progress A callback function which can be used to track the progress of the upload
   * @param chunkSize The size of each file slice, in bytes (default: 10485760)
   */


  _File.prototype.setContentChunked = function (file, progress, chunkSize) {
    if (chunkSize === void 0) {
      chunkSize = 10485760;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var fileSize, totalBlocks, uploadId, currentPointer, i;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(0, _common.isFunc)(progress)) {
              progress = function () {
                return null;
              };
            }

            fileSize = file.size;
            totalBlocks = parseInt((fileSize / chunkSize).toString(), 10) + (fileSize % chunkSize === 0 ? 1 : 0);
            uploadId = (0, _common.getGUID)(); // report that we are starting

            progress({
              uploadId: uploadId,
              blockNumber: 1,
              chunkSize: chunkSize,
              currentPointer: 0,
              fileSize: fileSize,
              stage: "starting",
              totalBlocks: totalBlocks
            });
            return [4
            /*yield*/
            , this.startUpload(uploadId, file.slice(0, chunkSize))];

          case 1:
            currentPointer = _a.sent();
            i = 2;
            _a.label = 2;

          case 2:
            if (!(i < totalBlocks)) return [3
            /*break*/
            , 5];
            progress({
              uploadId: uploadId,
              blockNumber: i,
              chunkSize: chunkSize,
              currentPointer: currentPointer,
              fileSize: fileSize,
              stage: "continue",
              totalBlocks: totalBlocks
            });
            return [4
            /*yield*/
            , this.continueUpload(uploadId, currentPointer, file.slice(currentPointer, currentPointer + chunkSize))];

          case 3:
            currentPointer = _a.sent();
            _a.label = 4;

          case 4:
            i++;
            return [3
            /*break*/
            , 2];

          case 5:
            progress({
              uploadId: uploadId,
              blockNumber: totalBlocks,
              chunkSize: chunkSize,
              currentPointer: currentPointer,
              fileSize: fileSize,
              stage: "finishing",
              totalBlocks: totalBlocks
            });
            return [2
            /*return*/
            , this.finishUpload(uploadId, currentPointer, file.slice(currentPointer))];
        }
      });
    });
  };
  /**
   * Starts a new chunk upload session and uploads the first fragment.
   * The current file content is not changed when this method completes.
   * The method is idempotent (and therefore does not change the result) as long as you use the same values for uploadId and stream.
   * The upload session ends either when you use the CancelUpload method or when you successfully
   * complete the upload session by passing the rest of the file contents through the ContinueUpload and FinishUpload methods.
   * The StartUpload and ContinueUpload methods return the size of the running total of uploaded data in bytes,
   * so you can pass those return values to subsequent uses of ContinueUpload and FinishUpload.
   * This method is currently available only on Office 365.
   *
   * @param uploadId The unique identifier of the upload session.
   * @param fragment The file contents.
   * @returns The size of the total uploaded data in bytes.
   */


  _File.prototype.startUpload = function (uploadId, fragment) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var n;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(File, "startUpload(uploadId=guid'" + uploadId + "')", false), {
              body: fragment
            })];

          case 1:
            n = _a.sent();

            if (typeof n === "object") {
              // When OData=verbose the payload has the following shape:
              // { StartUpload: "10485760" }
              n = n.StartUpload;
            }

            return [2
            /*return*/
            , parseFloat(n)];
        }
      });
    });
  };
  /**
   * Continues the chunk upload session with an additional fragment.
   * The current file content is not changed.
   * Use the uploadId value that was passed to the StartUpload method that started the upload session.
   * This method is currently available only on Office 365.
   *
   * @param uploadId The unique identifier of the upload session.
   * @param fileOffset The size of the offset into the file where the fragment starts.
   * @param fragment The file contents.
   * @returns The size of the total uploaded data in bytes.
   */


  _File.prototype.continueUpload = function (uploadId, fileOffset, fragment) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var n;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(File, "continueUpload(uploadId=guid'" + uploadId + "',fileOffset=" + fileOffset + ")", false), {
              body: fragment
            })];

          case 1:
            n = _a.sent();

            if (typeof n === "object") {
              // When OData=verbose the payload has the following shape:
              // { ContinueUpload: "20971520" }
              n = n.ContinueUpload;
            }

            return [2
            /*return*/
            , parseFloat(n)];
        }
      });
    });
  };
  /**
   * Uploads the last file fragment and commits the file. The current file content is changed when this method completes.
   * Use the uploadId value that was passed to the StartUpload method that started the upload session.
   * This method is currently available only on Office 365.
   *
   * @param uploadId The unique identifier of the upload session.
   * @param fileOffset The size of the offset into the file where the fragment starts.
   * @param fragment The file contents.
   * @returns The newly uploaded file.
   */


  _File.prototype.finishUpload = function (uploadId, fileOffset, fragment) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var response;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(File, "finishUpload(uploadId=guid'" + uploadId + "',fileOffset=" + fileOffset + ")", false), {
              body: fragment
            })];

          case 1:
            response = _a.sent();
            return [2
            /*return*/
            , {
              data: response,
              file: File((0, _odata2.odataUrlFrom)(response))
            }];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.approve")], _File.prototype, "approve", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.cancelUpload")], _File.prototype, "cancelUpload", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.checkin")], _File.prototype, "checkin", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.checkout")], _File.prototype, "checkout", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.copyTo")], _File.prototype, "copyTo", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.copyByPath")], _File.prototype, "copyByPath", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.deny")], _File.prototype, "deny", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.moveTo")], _File.prototype, "moveTo", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.moveByPath")], _File.prototype, "moveByPath", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.publish")], _File.prototype, "publish", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.recycle")], _File.prototype, "recycle", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.undoCheckout")], _File.prototype, "undoCheckout", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.unpublish")], _File.prototype, "unpublish", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.getText")], _File.prototype, "getText", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.getBlob")], _File.prototype, "getBlob", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.getBuffer")], _File.prototype, "getBuffer", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.getJSON")], _File.prototype, "getJSON", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.setContent")], _File.prototype, "setContent", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.getItem")], _File.prototype, "getItem", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.startUpload")], _File.prototype, "startUpload", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.continueUpload")], _File.prototype, "continueUpload", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fi.finishUpload")], _File.prototype, "finishUpload", null);
  return _File;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._File = _File;
var File = (0, _sharepointqueryable.spInvokableFactory)(_File);
/**
 * Describes a collection of Version objects
 *
 */

exports.File = File;

var _Versions =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Versions, _super);

  function _Versions() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a version by id
   *
   * @param versionId The id of the version to retrieve
   */


  _Versions.prototype.getById = function (versionId) {
    return _telemetry.tag.configure(Version(this).concat("(" + versionId + ")"), "vers.getById");
  };
  /**
   * Deletes all the file version objects in the collection.
   *
   */


  _Versions.prototype.deleteAll = function () {
    return (0, _operations.spPost)(Versions(this, "deleteAll"));
  };
  /**
   * Deletes the specified version of the file.
   *
   * @param versionId The ID of the file version to delete.
   */


  _Versions.prototype.deleteById = function (versionId) {
    return (0, _operations.spPost)(this.clone(Versions, "deleteById(vid=" + versionId + ")"));
  };
  /**
   * Recycles the specified version of the file.
   *
   * @param versionId The ID of the file version to delete.
   */


  _Versions.prototype.recycleByID = function (versionId) {
    return (0, _operations.spPost)(this.clone(Versions, "recycleByID(vid=" + versionId + ")"));
  };
  /**
   * Deletes the file version object with the specified version label.
   *
   * @param label The version label of the file version to delete, for example: 1.2
   */


  _Versions.prototype.deleteByLabel = function (label) {
    return (0, _operations.spPost)(this.clone(Versions, "deleteByLabel(versionlabel='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(label) + "')"));
  };
  /**
   * Recycles the file version object with the specified version label.
   *
   * @param label The version label of the file version to delete, for example: 1.2
   */


  _Versions.prototype.recycleByLabel = function (label) {
    return (0, _operations.spPost)(this.clone(Versions, "recycleByLabel(versionlabel='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(label) + "')"));
  };
  /**
   * Creates a new file version from the file specified by the version label.
   *
   * @param label The version label of the file version to restore, for example: 1.2
   */


  _Versions.prototype.restoreByLabel = function (label) {
    return (0, _operations.spPost)(this.clone(Versions, "restoreByLabel(versionlabel='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(label) + "')"));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("vers.deleteAll")], _Versions.prototype, "deleteAll", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("vers.deleteById")], _Versions.prototype, "deleteById", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("vers.recycleByID")], _Versions.prototype, "recycleByID", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("vers.deleteByLabel")], _Versions.prototype, "deleteByLabel", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("vers.recycleByLabel")], _Versions.prototype, "recycleByLabel", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("vers.restoreByLabel")], _Versions.prototype, "restoreByLabel", null);
  _Versions = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("versions")], _Versions);
  return _Versions;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Versions = _Versions;
var Versions = (0, _sharepointqueryable.spInvokableFactory)(_Versions);
/**
 * Describes a single Version instance
 *
 */

exports.Versions = Versions;

var _Version =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Version, _super);

  function _Version() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteableWithETag)("ver");
    return _this;
  }

  return _Version;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Version = _Version;
var Version = (0, _sharepointqueryable.spInvokableFactory)(_Version);
/**
 * Types for document check in.
 * Minor = 0
 * Major = 1
 * Overwrite = 2
 */

exports.Version = Version;
var CheckinType;
exports.CheckinType = CheckinType;

(function (CheckinType) {
  CheckinType[CheckinType["Minor"] = 0] = "Minor";
  CheckinType[CheckinType["Major"] = 1] = "Major";
  CheckinType[CheckinType["Overwrite"] = 2] = "Overwrite";
})(CheckinType || (exports.CheckinType = CheckinType = {}));
/**
 * File move opertions
 * Overwrite = 1
 * AllowBrokenThickets = 8
 */


var MoveOperations;
exports.MoveOperations = MoveOperations;

(function (MoveOperations) {
  MoveOperations[MoveOperations["Overwrite"] = 1] = "Overwrite";
  MoveOperations[MoveOperations["AllowBrokenThickets"] = 8] = "AllowBrokenThickets";
})(MoveOperations || (exports.MoveOperations = MoveOperations = {}));

var TemplateFileType;
exports.TemplateFileType = TemplateFileType;

(function (TemplateFileType) {
  TemplateFileType[TemplateFileType["StandardPage"] = 0] = "StandardPage";
  TemplateFileType[TemplateFileType["WikiPage"] = 1] = "WikiPage";
  TemplateFileType[TemplateFileType["FormPage"] = 2] = "FormPage";
  TemplateFileType[TemplateFileType["ClientSidePage"] = 3] = "ClientSidePage";
})(TemplateFileType || (exports.TemplateFileType = TemplateFileType = {}));
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","@pnp/common":"../node_modules/@pnp/common/index.js","../items":"../node_modules/@pnp/sp/items/index.js","../odata":"../node_modules/@pnp/sp/odata.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../utils/escapeQueryStrValue":"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js","../utils/toResourcePath":"../node_modules/@pnp/sp/utils/toResourcePath.js"}],"../node_modules/@pnp/sp/appcatalog/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = exports._App = exports.AppCatalog = exports._AppCatalog = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _operations = require("../operations");

var _odata = require("../odata");

var _extractweburl = require("../utils/extractweburl");

var _types = require("../files/types");

var _telemetry = require("../telemetry");

var _webs = require("../webs");

require("../items");

var _AppCatalog =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_AppCatalog, _super);

  function _AppCatalog(baseUrl, path) {
    if (path === void 0) {
      path = "_api/web/tenantappcatalog/AvailableApps";
    }

    return _super.call(this, (0, _extractweburl.extractWebUrl)(typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl()), path) || this;
  }
  /**
   * Get details of specific app from the app catalog
   * @param id - Specify the guid of the app
   */


  _AppCatalog.prototype.getAppById = function (id) {
    return _telemetry.tag.configure(App(this, "getById('" + id + "')"), "ac.getAppById");
  };
  /**
   * Synchronize a solution to the Microsoft Teams App Catalog
   * @param id - Specify the guid of the app
   * @param useSharePointItemId (optional) - By default this REST call requires the SP Item id of the app, not the app id.
   *                            PnPjs will try to fetch the item id by default, you can still use this parameter to pass your own item id in the first parameter
   */


  _AppCatalog.prototype.syncSolutionToTeams = function (id, useSharePointItemId) {
    if (useSharePointItemId === void 0) {
      useSharePointItemId = false;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var appId, webUrl, web, listId, listItems, poster;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            appId = null;
            webUrl = (0, _extractweburl.extractWebUrl)(this.toUrl());
            if (!useSharePointItemId) return [3
            /*break*/
            , 1];
            appId = id;
            return [3
            /*break*/
            , 4];

          case 1:
            web = (0, _webs.Web)(webUrl);
            return [4
            /*yield*/
            , web.lists.select("Id").filter("EntityTypeName eq 'AppCatalog'")()];

          case 2:
            listId = _a.sent()[0].Id;
            return [4
            /*yield*/
            , web.lists.getById(listId).items.filter("AppProductID eq '" + id + "'").top(1)()];

          case 3:
            listItems = _a.sent();

            if (listItems && listItems.length > 0) {
              appId = listItems[0].Id;
            } else {
              throw Error("Did not find the app with id " + id + " in the appcatalog.");
            }

            _a.label = 4;

          case 4:
            poster = _telemetry.tag.configure(AppCatalog(webUrl, "_api/web/tenantappcatalog/SyncSolutionToTeams(id=" + appId + ")"), "ac.syncSolutionToTeams");
            return [4
            /*yield*/
            , (0, _operations.spPost)(poster, {})];

          case 5:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  };
  /**
   * Uploads an app package. Not supported for batching
   *
   * @param filename Filename to create.
   * @param content app package data (eg: the .app or .sppkg file).
   * @param shouldOverWrite Should an app with the same name in the same location be overwritten? (default: true)
   * @returns Promise<IAppAddResult>
   */


  _AppCatalog.prototype.add = function (filename, content, shouldOverWrite) {
    if (shouldOverWrite === void 0) {
      shouldOverWrite = true;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var adder, r;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            adder = _telemetry.tag.configure(AppCatalog((0, _extractweburl.extractWebUrl)(this.toUrl()), "_api/web/tenantappcatalog/add(overwrite=" + shouldOverWrite + ",url='" + filename + "')"), "ac.add");
            return [4
            /*yield*/
            , (0, _operations.spPost)(adder, {
              body: content,
              headers: {
                "binaryStringRequestBody": "true"
              }
            })];

          case 1:
            r = _a.sent();
            return [2
            /*return*/
            , {
              data: r,
              file: (0, _types.File)((0, _odata.odataUrlFrom)(r))
            }];
        }
      });
    });
  };

  return _AppCatalog;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._AppCatalog = _AppCatalog;
var AppCatalog = (0, _sharepointqueryable.spInvokableFactory)(_AppCatalog);
exports.AppCatalog = AppCatalog;

var _App =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_App, _super);

  function _App() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * This method deploys an app on the app catalog. It must be called in the context
   * of the tenant app catalog web or it will fail.
   *
   * @param skipFeatureDeployment Deploy the app to the entire tenant
   */


  _App.prototype.deploy = function (skipFeatureDeployment) {
    if (skipFeatureDeployment === void 0) {
      skipFeatureDeployment = false;
    }

    return this.do("Deploy(" + skipFeatureDeployment + ")");
  };
  /**
   * This method retracts a deployed app on the app catalog. It must be called in the context
   * of the tenant app catalog web or it will fail.
   */


  _App.prototype.retract = function () {
    return this.do("Retract");
  };
  /**
   * This method allows an app which is already deployed to be installed on a web
   */


  _App.prototype.install = function () {
    return this.do("Install");
  };
  /**
   * This method allows an app which is already installed to be uninstalled on a web
   * Note: when you use the REST API to uninstall a solution package from the site, it is not relocated to the recycle bin
   */


  _App.prototype.uninstall = function () {
    return this.do("Uninstall");
  };
  /**
   * This method allows an app which is already installed to be upgraded on a web
   */


  _App.prototype.upgrade = function () {
    return this.do("Upgrade");
  };
  /**
   * This method removes an app from the app catalog. It must be called in the context
   * of the tenant app catalog web or it will fail.
   */


  _App.prototype.remove = function () {
    return this.do("Remove");
  };

  _App.prototype.do = function (path) {
    return (0, _operations.spPost)(this.clone(App, path));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("app.deploy")], _App.prototype, "deploy", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("app.retract")], _App.prototype, "retract", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("app.install")], _App.prototype, "install", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("app.uninstall")], _App.prototype, "uninstall", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("app.upgrade")], _App.prototype, "upgrade", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("app.remove")], _App.prototype, "remove", null);
  return _App;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._App = _App;
var App = (0, _sharepointqueryable.spInvokableFactory)(_App);
exports.App = App;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../operations":"../node_modules/@pnp/sp/operations.js","../odata":"../node_modules/@pnp/sp/odata.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","../files/types":"../node_modules/@pnp/sp/files/types.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js","../webs":"../node_modules/@pnp/sp/webs/index.js","../items":"../node_modules/@pnp/sp/items/index.js"}],"../node_modules/@pnp/sp/appcatalog/web.js":[function(require,module,exports) {
"use strict";

var _types = require("../webs/types");

var _types2 = require("./types");

_types._Web.prototype.getAppCatalog = function (url) {
  return (0, _types2.AppCatalog)(url || this);
};
},{"../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/appcatalog/types.js"}],"../node_modules/@pnp/sp/appcatalog/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "App", {
  enumerable: true,
  get: function () {
    return _types2.App;
  }
});
Object.defineProperty(exports, "AppCatalog", {
  enumerable: true,
  get: function () {
    return _types2.AppCatalog;
  }
});

var _tslib = require("tslib");

var _rest = require("../rest");

var _types = require("../webs/types");

require("./web");

var _sharepointqueryable = require("../sharepointqueryable");

var _types2 = require("./types");

_rest.SPRest.prototype.getTenantAppCatalogWeb = function () {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var data;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , (0, _sharepointqueryable.SharePointQueryable)("/", "_api/SP_TenantSettings_Current")()];

        case 1:
          data = _a.sent();
          return [2
          /*return*/
          , (0, _types.Web)(data.CorporateCatalogUrl)];
      }
    });
  });
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","../rest":"../node_modules/@pnp/sp/rest.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./web":"../node_modules/@pnp/sp/appcatalog/web.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","./types":"../node_modules/@pnp/sp/appcatalog/types.js"}],"../node_modules/@pnp/sp/attachments/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Attachment = exports._Attachment = exports.Attachments = exports._Attachments = void 0;

var _tslib = require("tslib");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _sharepointqueryable = require("../sharepointqueryable");

var _odata = require("@pnp/odata");

var _telemetry = require("../telemetry");

var _Attachments =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Attachments, _super);

  function _Attachments() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
  * Gets a Attachment File by filename
  *
  * @param name The name of the file, including extension.
  */


  _Attachments.prototype.getByName = function (name) {
    var f = _telemetry.tag.configure(Attachment(this), "ats.getByName");

    f.concat("('" + name + "')");
    return f;
  };
  /**
   * Adds a new attachment to the collection. Not supported for batching.
   *
   * @param name The name of the file, including extension.
   * @param content The Base64 file content.
   */


  _Attachments.prototype.add = function (name, content) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var response;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Attachments, "add(FileName='" + name + "')", false), {
              body: content
            })];

          case 1:
            response = _a.sent();
            return [2
            /*return*/
            , {
              data: response,
              file: this.getByName(name)
            }];
        }
      });
    });
  };
  /**
   * Adds multiple new attachment to the collection. Not supported for batching.
   *
   * @param files The collection of files to add
   */


  _Attachments.prototype.addMultiple = function (files) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var i;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            i = 0;
            _a.label = 1;

          case 1:
            if (!(i < files.length)) return [3
            /*break*/
            , 4];
            return [4
            /*yield*/
            , this.add(files[i].name, files[i].content)];

          case 2:
            _a.sent();

            _a.label = 3;

          case 3:
            i++;
            return [3
            /*break*/
            , 1];

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Delete multiple attachments from the collection. Not supported for batching.
   *
   * @param files The collection of files to delete
   */


  _Attachments.prototype.deleteMultiple = function () {
    var files = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      files[_i] = arguments[_i];
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var i;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            i = 0;
            _a.label = 1;

          case 1:
            if (!(i < files.length)) return [3
            /*break*/
            , 4];
            return [4
            /*yield*/
            , this.getByName(files[i]).delete()];

          case 2:
            _a.sent();

            _a.label = 3;

          case 3:
            i++;
            return [3
            /*break*/
            , 1];

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Delete multiple attachments from the collection and send to recycle bin. Not supported for batching.
   *
   * @param files The collection of files to be deleted and sent to recycle bin
   */


  _Attachments.prototype.recycleMultiple = function () {
    var files = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      files[_i] = arguments[_i];
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var i;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            i = 0;
            _a.label = 1;

          case 1:
            if (!(i < files.length)) return [3
            /*break*/
            , 4];
            return [4
            /*yield*/
            , this.getByName(files[i]).recycle()];

          case 2:
            _a.sent();

            _a.label = 3;

          case 3:
            i++;
            return [3
            /*break*/
            , 1];

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("ats.add")], _Attachments.prototype, "add", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ats.addMultiple")], _Attachments.prototype, "addMultiple", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ats.deleteMultiple")], _Attachments.prototype, "deleteMultiple", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ats.recycleMultiple")], _Attachments.prototype, "recycleMultiple", null);
  _Attachments = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("AttachmentFiles")], _Attachments);
  return _Attachments;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Attachments = _Attachments;
var Attachments = (0, _sharepointqueryable.spInvokableFactory)(_Attachments);
exports.Attachments = Attachments;

var _Attachment =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Attachment, _super);

  function _Attachment() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteableWithETag)("at");
    return _this;
  }
  /**
   * Gets the contents of the file as text
   *
   */


  _Attachment.prototype.getText = function () {
    return this.getParsed(new _odata.TextParser());
  };
  /**
   * Gets the contents of the file as a blob, does not work in Node.js
   *
   */


  _Attachment.prototype.getBlob = function () {
    return this.getParsed(new _odata.BlobParser());
  };
  /**
   * Gets the contents of a file as an ArrayBuffer, works in Node.js
   */


  _Attachment.prototype.getBuffer = function () {
    return this.getParsed(new _odata.BufferParser());
  };
  /**
   * Gets the contents of a file as an ArrayBuffer, works in Node.js
   */


  _Attachment.prototype.getJSON = function () {
    return this.getParsed(new _odata.JSONParser());
  };
  /**
   * Sets the content of a file. Not supported for batching
   *
   * @param content The value to set for the file contents
   */


  _Attachment.prototype.setContent = function (content) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Attachment, "$value", false), (0, _odata.headers)({
              "X-HTTP-Method": "PUT"
            }, {
              body: content
            }))];

          case 1:
            _a.sent();

            return [2
            /*return*/
            , Attachment(this)];
        }
      });
    });
  };
  /**
   * Delete this attachment file and send it to recycle bin
   *
   * @param eTag Value used in the IF-Match header, by default "*"
   */


  _Attachment.prototype.recycle = function (eTag) {
    if (eTag === void 0) {
      eTag = "*";
    }

    return (0, _operations.spPost)(this.clone(Attachment, "recycleObject"), (0, _odata.headers)({
      "IF-Match": eTag,
      "X-HTTP-Method": "DELETE"
    }));
  };

  _Attachment.prototype.getParsed = function (parser) {
    return this.clone(Attachment, "$value", false).usingParser(parser)();
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("at.getText")], _Attachment.prototype, "getText", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("at.getBlob")], _Attachment.prototype, "getBlob", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("at.getBuffer")], _Attachment.prototype, "getBuffer", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("at.getJSON")], _Attachment.prototype, "getJSON", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("at.setContent")], _Attachment.prototype, "setContent", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("at.recycle")], _Attachment.prototype, "recycle", null);
  return _Attachment;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Attachment = _Attachment;
var Attachment = (0, _sharepointqueryable.spInvokableFactory)(_Attachment);
exports.Attachment = Attachment;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/attachments/item.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../items/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Item, "attachmentFiles", _types2.Attachments);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../items/types":"../node_modules/@pnp/sp/items/types.js","./types":"../node_modules/@pnp/sp/attachments/types.js"}],"../node_modules/@pnp/sp/attachments/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Attachment", {
  enumerable: true,
  get: function () {
    return _types.Attachment;
  }
});
Object.defineProperty(exports, "Attachments", {
  enumerable: true,
  get: function () {
    return _types.Attachments;
  }
});

require("./item");

var _types = require("./types");
},{"./item":"../node_modules/@pnp/sp/attachments/item.js","./types":"../node_modules/@pnp/sp/attachments/types.js"}],"../node_modules/@pnp/sp/clientside-pages/funcs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNextOrder = getNextOrder;
exports.reindex = reindex;

var _common = require("@pnp/common");

/**
 * Gets the next order value 1 based for the provided collection
 *
 * @param collection Collection of orderable things
 */
function getNextOrder(collection) {
  return collection.length < 1 ? 1 : Math.max.apply(null, collection.map(function (i) {
    return i.order;
  })) + 1;
}
/**
 * Normalizes the order value for all the sections, columns, and controls to be 1 based and stepped (1, 2, 3...)
 *
 * @param collection The collection to normalize
 */


function reindex(collection) {
  for (var i = 0; i < collection.length; i++) {
    collection[i].order = i + 1;

    if ((0, _common.hOP)(collection[i], "columns")) {
      reindex(collection[i].columns);
    } else if ((0, _common.hOP)(collection[i], "controls")) {
      reindex(collection[i].controls);
    }
  }
}
},{"@pnp/common":"../node_modules/@pnp/common/index.js"}],"../node_modules/@pnp/sp/files/web.js":[function(require,module,exports) {
"use strict";

var _types = require("../webs/types");

var _types2 = require("./types");

var _escapeQueryStrValue = require("../utils/escapeQueryStrValue");

_types._Web.prototype.getFileByServerRelativeUrl = function (fileRelativeUrl) {
  return (0, _types2.File)(this, "getFileByServerRelativeUrl('" + (0, _escapeQueryStrValue.escapeQueryStrValue)(fileRelativeUrl) + "')");
};

_types._Web.prototype.getFileByServerRelativePath = function (fileRelativeUrl) {
  return (0, _types2.File)(this, "getFileByServerRelativePath(decodedUrl='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(fileRelativeUrl) + "')");
};

_types._Web.prototype.getFileById = function (uniqueId) {
  return (0, _types2.File)(this, "getFileById('" + uniqueId + "')");
};

_types._Web.prototype.getFileByUrl = function (fileUrl) {
  return (0, _types2.File)(this, "getFileByUrl('!@p1::" + (0, _escapeQueryStrValue.escapeQueryStrValue)(fileUrl) + "')");
};
},{"../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/files/types.js","../utils/escapeQueryStrValue":"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js"}],"../node_modules/@pnp/sp/comments/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Replies = exports._Replies = exports.Comment = exports._Comment = exports.Comments = exports._Comments = void 0;

var _tslib = require("tslib");

var _decorators = require("../decorators");

var _sharepointqueryable = require("../sharepointqueryable");

var _common = require("@pnp/common");

var _odata = require("../odata");

var _metadata = require("../utils/metadata");

var _odata2 = require("@pnp/odata");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _Comments =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Comments, _super);

  function _Comments() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Adds a new comment to this collection
   *
   * @param info Comment information to add
   */


  _Comments.prototype.add = function (info) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, d;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (typeof info === "string") {
              info = {
                text: info
              };
            }

            postBody = (0, _odata2.body)((0, _common.assign)((0, _metadata.metadata)("Microsoft.SharePoint.Comments.comment"), info));
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Comments, null), postBody)];

          case 1:
            d = _a.sent();
            return [2
            /*return*/
            , (0, _common.assign)(this.getById(d.id), d)];
        }
      });
    });
  };
  /**
   * Gets a comment by id
   *
   * @param id Id of the comment to load
   */


  _Comments.prototype.getById = function (id) {
    return _telemetry.tag.configure(Comment(this).concat("(" + id + ")"), "coms.getById");
  };
  /**
   * Deletes all the comments in this collection
   */


  _Comments.prototype.clear = function () {
    return (0, _operations.spPost)(_telemetry.tag.configure(this.clone(Comments, "DeleteAll"), "coms.clear"));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("coms.add")], _Comments.prototype, "add", null);
  _Comments = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("comments")], _Comments);
  return _Comments;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Comments = _Comments;
var Comments = (0, _sharepointqueryable.spInvokableFactory)(_Comments);
exports.Comments = Comments;

var _Comment =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Comment, _super);

  function _Comment() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_Comment.prototype, "replies", {
    /**
     * A comment's replies
     */
    get: function () {
      return _telemetry.tag.configure(Replies(this), "com.replies");
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Likes the comment as the current user
   */

  _Comment.prototype.like = function () {
    return (0, _operations.spPost)(this.clone(Comment, "Like"));
  };
  /**
   * Unlikes the comment as the current user
   */


  _Comment.prototype.unlike = function () {
    return (0, _operations.spPost)(this.clone(Comment, "Unlike"));
  };
  /**
   * Deletes this comment
   */


  _Comment.prototype.delete = function () {
    return (0, _operations.spPost)(this.clone(Comment, "DeleteComment"));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("com.like")], _Comment.prototype, "like", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("com.unlike")], _Comment.prototype, "unlike", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("com.delete")], _Comment.prototype, "delete", null);
  return _Comment;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Comment = _Comment;
var Comment = (0, _sharepointqueryable.spInvokableFactory)(_Comment);
exports.Comment = Comment;

var _Replies =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Replies, _super);

  function _Replies() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Adds a new reply to this collection
   *
   * @param info Comment information to add
   */


  _Replies.prototype.add = function (info) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, d;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (typeof info === "string") {
              info = {
                text: info
              };
            }

            postBody = (0, _odata2.body)((0, _common.assign)((0, _metadata.metadata)("Microsoft.SharePoint.Comments.comment"), info));
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Replies, null), postBody)];

          case 1:
            d = _a.sent();
            return [2
            /*return*/
            , (0, _common.assign)(Comment((0, _odata.odataUrlFrom)(d)), d)];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("reps.add")], _Replies.prototype, "add", null);
  _Replies = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("replies")], _Replies);
  return _Replies;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Replies = _Replies;
var Replies = (0, _sharepointqueryable.spInvokableFactory)(_Replies);
exports.Replies = Replies;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/common":"../node_modules/@pnp/common/index.js","../odata":"../node_modules/@pnp/sp/odata.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/comments/item.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../items/types");

var _types2 = require("./types");

var _operations = require("../operations");

(0, _odata.addProp)(_types._Item, "comments", _types2.Comments);

_types._Item.prototype.getLikedBy = function () {
  return (0, _operations.spPost)(this.clone(_types.Item, "likedBy"));
};

_types._Item.prototype.like = function () {
  return (0, _operations.spPost)(this.clone(_types.Item, "like"));
};

_types._Item.prototype.unlike = function () {
  return (0, _operations.spPost)(this.clone(_types.Item, "unlike"));
};

_types._Item.prototype.getLikedByInformation = function () {
  return this.clone(_types.Item, "likedByInformation").expand("likedby")();
};
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../items/types":"../node_modules/@pnp/sp/items/types.js","./types":"../node_modules/@pnp/sp/comments/types.js","../operations":"../node_modules/@pnp/sp/operations.js"}],"../node_modules/@pnp/sp/clientside-pages/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientsideWebpart = exports.ClientsideText = exports.ColumnControl = exports.CanvasColumn = exports.CanvasSection = exports.CreateClientsidePage = exports.ClientsidePageFromFile = exports._ClientsidePage = exports.PromotedState = void 0;

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _common = require("@pnp/common");

var _types = require("../items/types");

var _sharepointqueryable = require("../sharepointqueryable");

var _metadata = require("../utils/metadata");

var _types2 = require("../lists/types");

var _odata2 = require("../odata");

var _types3 = require("../webs/types");

var _extractweburl = require("../utils/extractweburl");

var _types4 = require("../sites/types");

var _operations = require("../operations");

var _funcs = require("./funcs");

require("../files/web");

require("../comments/item");

var _telemetry = require("../telemetry");

/**
 * Page promotion state
 */
var PromotedState;
exports.PromotedState = PromotedState;

(function (PromotedState) {
  /**
   * Regular client side page
   */
  PromotedState[PromotedState["NotPromoted"] = 0] = "NotPromoted";
  /**
   * Page that will be promoted as news article after publishing
   */

  PromotedState[PromotedState["PromoteOnPublish"] = 1] = "PromoteOnPublish";
  /**
   * Page that is promoted as news article
   */

  PromotedState[PromotedState["Promoted"] = 2] = "Promoted";
})(PromotedState || (exports.PromotedState = PromotedState = {}));

function initFrom(o, url) {
  return ClientsidePage((0, _extractweburl.extractWebUrl)(o.toUrl()), url).configureFrom(o);
}
/**
 * Represents the data and methods associated with client side "modern" pages
 */


var _ClientsidePage =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_ClientsidePage, _super);
  /**
   * PLEASE DON'T USE THIS CONSTRUCTOR DIRECTLY, thank you 🐇
   */

  function _ClientsidePage(baseUrl, path, json, noInit, sections, commentsDisabled) {
    if (noInit === void 0) {
      noInit = false;
    }

    if (sections === void 0) {
      sections = [];
    }

    if (commentsDisabled === void 0) {
      commentsDisabled = false;
    }

    var _this = _super.call(this, baseUrl, path) || this;

    _this.json = json;
    _this.sections = sections;
    _this.commentsDisabled = commentsDisabled;
    _this._bannerImageDirty = false; // ensure we have a good url to build on for the pages api

    if (typeof baseUrl === "string") {
      _this.data.parentUrl = "";
      _this.data.url = (0, _common.combine)((0, _extractweburl.extractWebUrl)(baseUrl), path);
    } else {
      _this.assign(initFrom(baseUrl, null), path);
    } // set a default page settings slice


    _this._pageSettings = {
      controlType: 0,
      pageSettingsSlice: {
        isDefaultDescription: true,
        isDefaultThumbnail: true
      }
    }; // set a default layout part

    _this._layoutPart = _ClientsidePage.getDefaultLayoutPart();

    if (typeof json !== "undefined" && !noInit) {
      _this.fromJSON(json);
    }

    return _this;
  }

  _ClientsidePage.getDefaultLayoutPart = function () {
    return {
      dataVersion: "1.4",
      description: "Title Region Description",
      id: "cbe7b0a9-3504-44dd-a3a3-0e5cacd07788",
      instanceId: "cbe7b0a9-3504-44dd-a3a3-0e5cacd07788",
      properties: {
        authorByline: [],
        authors: [],
        layoutType: "FullWidthImage",
        showPublishDate: false,
        showTopicHeader: false,
        textAlignment: "Left",
        title: "",
        topicHeader: ""
      },
      serverProcessedContent: {
        htmlStrings: {},
        searchablePlainTexts: {},
        imageSources: {},
        links: {}
      },
      title: "Title area"
    };
  };

  Object.defineProperty(_ClientsidePage.prototype, "pageLayout", {
    get: function () {
      return this.json.PageLayoutType;
    },
    set: function (value) {
      this.json.PageLayoutType = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ClientsidePage.prototype, "bannerImageUrl", {
    get: function () {
      return this.json.BannerImageUrl;
    },
    set: function (value) {
      this.json.BannerImageUrl = value;
      this._bannerImageDirty = true;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ClientsidePage.prototype, "topicHeader", {
    get: function () {
      return (0, _common.objectDefinedNotNull)(this.json.TopicHeader) ? this.json.TopicHeader : "";
    },
    set: function (value) {
      this.json.TopicHeader = value;
      this._layoutPart.properties.topicHeader = value;

      if ((0, _common.stringIsNullOrEmpty)(value)) {
        this.showTopicHeader = false;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ClientsidePage.prototype, "title", {
    get: function () {
      return this._layoutPart.properties.title;
    },
    set: function (value) {
      this.json.Title = value;
      this._layoutPart.properties.title = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ClientsidePage.prototype, "layoutType", {
    get: function () {
      return this._layoutPart.properties.layoutType;
    },
    set: function (value) {
      this._layoutPart.properties.layoutType = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ClientsidePage.prototype, "headerTextAlignment", {
    get: function () {
      return this._layoutPart.properties.textAlignment;
    },
    set: function (value) {
      this._layoutPart.properties.textAlignment = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ClientsidePage.prototype, "showTopicHeader", {
    get: function () {
      return this._layoutPart.properties.showTopicHeader;
    },
    set: function (value) {
      this._layoutPart.properties.showTopicHeader = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ClientsidePage.prototype, "showPublishDate", {
    get: function () {
      return this._layoutPart.properties.showPublishDate;
    },
    set: function (value) {
      this._layoutPart.properties.showPublishDate = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ClientsidePage.prototype, "hasVerticalSection", {
    get: function () {
      return this.sections.findIndex(function (s) {
        return s.layoutIndex === 2;
      }) > -1;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ClientsidePage.prototype, "authorByLine", {
    get: function () {
      if ((0, _common.isArray)(this.json.AuthorByline) && this.json.AuthorByline.length > 0) {
        return this.json.AuthorByline[0];
      }

      return null;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ClientsidePage.prototype, "verticalSection", {
    get: function () {
      if (this.hasVerticalSection) {
        return this.addVerticalSection();
      }

      return null;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Add a section to this page
   */

  _ClientsidePage.prototype.addSection = function () {
    var section = new CanvasSection(this, (0, _funcs.getNextOrder)(this.sections), 1);
    this.sections.push(section);
    return section;
  };
  /**
   * Add a section to this page
   */


  _ClientsidePage.prototype.addVerticalSection = function () {
    // we can only have one vertical section so we find it if it exists
    var sectionIndex = this.sections.findIndex(function (s) {
      return s.layoutIndex === 2;
    });

    if (sectionIndex > -1) {
      return this.sections[sectionIndex];
    }

    var section = new CanvasSection(this, (0, _funcs.getNextOrder)(this.sections), 2);
    this.sections.push(section);
    return section;
  };
  /**
   * Loads this instance from the appropriate JSON data
   *
   * @param pageData JSON data to load (replaces any existing data)
   */


  _ClientsidePage.prototype.fromJSON = function (pageData) {
    this.json = pageData;
    var canvasControls = JSON.parse(pageData.CanvasContent1);
    var layouts = JSON.parse(pageData.LayoutWebpartsContent);

    if (layouts && layouts.length > 0) {
      this._layoutPart = layouts[0];
    }

    this.setControls(canvasControls);
    return this;
  };
  /**
   * Loads this page's content from the server
   */


  _ClientsidePage.prototype.load = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var item, pageData;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.getItem("Id", "CommentsDisabled")];

          case 1:
            item = _a.sent();
            return [4
            /*yield*/
            , (0, _sharepointqueryable.SharePointQueryable)(this, "_api/sitepages/pages(" + item.Id + ")")()];

          case 2:
            pageData = _a.sent();
            this.commentsDisabled = item.CommentsDisabled;
            return [2
            /*return*/
            , this.fromJSON(pageData)];
        }
      });
    });
  };
  /**
   * Persists the content changes (sections, columns, and controls) [does not work with batching]
   *
   * @param publish If true the page is published, if false the changes are persisted to SharePoint but not published [Default: true]
   */


  _ClientsidePage.prototype.save = function (publish) {
    if (publish === void 0) {
      publish = true;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var origImgUrl, site, web, imgFile, siteId_1, webId_1, imgId_1, listId_1, webUrl_1, batch, f, saveBody, updater, r;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.json.Id === null) {
              throw Error("The id for this page is null. If you want to create a new page, please use ClientSidePage.Create");
            }

            if (!this._bannerImageDirty) return [3
            /*break*/
            , 2];
            origImgUrl = this.json.BannerImageUrl;

            if ((0, _common.isUrlAbsolute)(origImgUrl)) {
              // do our best to make this a server relative url by removing the x.sharepoint.com part
              origImgUrl = origImgUrl.replace(/^https?:\/\/[a-z0-9\.]*?\.[a-z]{2,3}\//i, "/");
            }

            site = (0, _types4.Site)((0, _extractweburl.extractWebUrl)(this.toUrl()));
            web = (0, _types3.Web)((0, _extractweburl.extractWebUrl)(this.toUrl()));
            imgFile = web.getFileByServerRelativePath(origImgUrl);
            siteId_1 = "";
            webId_1 = "";
            imgId_1 = "";
            listId_1 = "";
            webUrl_1 = "";
            batch = web.createBatch();
            site.select("Id", "Url").inBatch(batch)().then(function (r1) {
              return siteId_1 = r1.Id;
            });
            web.select("Id", "Url").inBatch(batch)().then(function (r2) {
              webId_1 = r2.Id;
              webUrl_1 = r2.Url;
            });
            imgFile.listItemAllFields.select("UniqueId", "ParentList/Id").expand("ParentList").inBatch(batch)().then(function (r3) {
              imgId_1 = r3.UniqueId;
              listId_1 = r3.ParentList.Id;
            }); // we know the .then calls above will run before execute resolves, ensuring the vars are set

            return [4
            /*yield*/
            , batch.execute()];

          case 1:
            // we know the .then calls above will run before execute resolves, ensuring the vars are set
            _a.sent();

            f = (0, _sharepointqueryable.SharePointQueryable)(webUrl_1, "_layouts/15/getpreview.ashx");
            f.query.set("guidSite", "" + siteId_1);
            f.query.set("guidWeb", "" + webId_1);
            f.query.set("guidFile", "" + imgId_1);
            this.bannerImageUrl = f.toUrlAndQuery();

            if (!(0, _common.objectDefinedNotNull)(this._layoutPart.serverProcessedContent)) {
              this._layoutPart.serverProcessedContent = {};
            }

            this._layoutPart.serverProcessedContent.imageSources = {
              imageSource: origImgUrl
            };

            if (!(0, _common.objectDefinedNotNull)(this._layoutPart.serverProcessedContent.customMetadata)) {
              this._layoutPart.serverProcessedContent.customMetadata = {};
            }

            this._layoutPart.serverProcessedContent.customMetadata.imageSource = {
              listId: listId_1,
              siteId: siteId_1,
              uniqueId: imgId_1,
              webId: webId_1
            };
            this._layoutPart.properties.webId = webId_1;
            this._layoutPart.properties.siteId = siteId_1;
            this._layoutPart.properties.listId = listId_1;
            this._layoutPart.properties.uniqueId = imgId_1;
            _a.label = 2;

          case 2:
            if (!!this.json.IsPageCheckedOutToCurrentUser) return [3
            /*break*/
            , 4];
            return [4
            /*yield*/
            , (0, _operations.spPost)(initFrom(this, "_api/sitepages/pages(" + this.json.Id + ")/checkoutpage"))];

          case 3:
            _a.sent();

            _a.label = 4;

          case 4:
            saveBody = Object.assign((0, _metadata.metadata)("SP.Publishing.SitePage"), {
              AuthorByline: this.json.AuthorByline || [],
              BannerImageUrl: this.bannerImageUrl,
              CanvasContent1: this.getCanvasContent1(),
              LayoutWebpartsContent: this.getLayoutWebpartsContent(),
              Title: this.title,
              TopicHeader: this.topicHeader
            });
            updater = initFrom(this, "_api/sitepages/pages(" + this.json.Id + ")/savepage");
            return [4
            /*yield*/
            , (0, _operations.spPost)(updater, (0, _odata.headers)({
              "if-match": "*"
            }, (0, _odata.body)(saveBody)))];

          case 5:
            _a.sent();

            r = true;
            if (!publish) return [3
            /*break*/
            , 7];
            return [4
            /*yield*/
            , (0, _operations.spPost)(initFrom(this, "_api/sitepages/pages(" + this.json.Id + ")/publish"))];

          case 6:
            r = _a.sent();

            if (r) {
              this.json.IsPageCheckedOutToCurrentUser = false;
            }

            _a.label = 7;

          case 7:
            this._bannerImageDirty = false;
            return [2
            /*return*/
            , r];
        }
      });
    });
  };
  /**
   * Discards the checkout of this page
   */


  _ClientsidePage.prototype.discardPageCheckout = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var d;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.json.Id === null) {
              throw Error("The id for this page is null. If you want to create a new page, please use ClientSidePage.Create");
            }

            return [4
            /*yield*/
            , (0, _operations.spPost)(initFrom(this, "_api/sitepages/pages(" + this.json.Id + ")/discardPage"), (0, _odata.body)((0, _metadata.metadata)("SP.Publishing.SitePage")))];

          case 1:
            d = _a.sent();
            this.fromJSON(d);
            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Promotes this page as a news item
   */


  _ClientsidePage.prototype.promoteToNews = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      return (0, _tslib.__generator)(this, function (_a) {
        return [2
        /*return*/
        , this.promoteNewsImpl("promoteToNews")];
      });
    });
  }; // API is currently broken on server side
  // public async demoteFromNews(): Promise<boolean> {
  //     return this.promoteNewsImpl("demoteFromNews");
  // }

  /**
   * Finds a control by the specified instance id
   *
   * @param id Instance id of the control to find
   */


  _ClientsidePage.prototype.findControlById = function (id) {
    return this.findControl(function (c) {
      return c.id === id;
    });
  };
  /**
   * Finds a control within this page's control tree using the supplied predicate
   *
   * @param predicate Takes a control and returns true or false, if true that control is returned by findControl
   */


  _ClientsidePage.prototype.findControl = function (predicate) {
    // check all sections
    for (var i = 0; i < this.sections.length; i++) {
      // check all columns
      for (var j = 0; j < this.sections[i].columns.length; j++) {
        // check all controls
        for (var k = 0; k < this.sections[i].columns[j].controls.length; k++) {
          // check to see if the predicate likes this control
          if (predicate(this.sections[i].columns[j].controls[k])) {
            return this.sections[i].columns[j].controls[k];
          }
        }
      }
    } // we found nothing so give nothing back


    return null;
  };
  /**
   * Creates a copy of this page
   *
   * @param web The web where we will create the copy
   * @param pageName The file name of the new page
   * @param title The title of the new page
   * @param publish If true the page will be published
   */


  _ClientsidePage.prototype.copy = function (web, pageName, title, publish, promotedState) {
    if (publish === void 0) {
      publish = true;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var page, url, makeGuid, guidSite, guidWeb, guidFile, site, id, openWeb, file, props;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , CreateClientsidePage(web, pageName, title, this.pageLayout, promotedState)];

          case 1:
            page = _a.sent(); // we know the method is on the class - but it is protected so not part of the interface

            page.setControls(this.getControls());
            if (!!(0, _common.stringIsNullOrEmpty)(this.json.BannerImageUrl)) return [3
            /*break*/
            , 5];
            url = new URL(this.json.BannerImageUrl);

            makeGuid = function (s) {
              return s.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/g, "$1-$2-$3-$4-$5");
            };

            if (!(url.searchParams.has("guidSite") && url.searchParams.has("guidWeb") && url.searchParams.has("guidFile"))) return [3
            /*break*/
            , 5];
            guidSite = makeGuid(url.searchParams.get("guidSite"));
            guidWeb = makeGuid(url.searchParams.get("guidWeb"));
            guidFile = makeGuid(url.searchParams.get("guidFile"));
            site = (0, _types4.Site)((0, _extractweburl.extractWebUrl)(this.toUrl()));
            return [4
            /*yield*/
            , site.select("Id")()];

          case 2:
            id = _a.sent();
            if (!(id.Id === guidSite)) return [3
            /*break*/
            , 5];
            return [4
            /*yield*/
            , site.openWebById(guidWeb)];

          case 3:
            openWeb = _a.sent();
            return [4
            /*yield*/
            , openWeb.web.getFileById(guidFile).select("ServerRelativeUrl")()];

          case 4:
            file = _a.sent();
            props = {};

            if (this._layoutPart.properties) {
              if ((0, _common.hOP)(this._layoutPart.properties, "translateX")) {
                props.translateX = this._layoutPart.properties.translateX;
              }

              if ((0, _common.hOP)(this._layoutPart.properties, "translateY")) {
                props.translateY = this._layoutPart.properties.translateY;
              }

              if ((0, _common.hOP)(this._layoutPart.properties, "imageSourceType")) {
                props.imageSourceType = this._layoutPart.properties.imageSourceType;
              }

              if ((0, _common.hOP)(this._layoutPart.properties, "altText")) {
                props.altText = this._layoutPart.properties.altText;
              }
            }

            page.setBannerImage(file.ServerRelativeUrl, props);
            _a.label = 5;

          case 5:
            return [4
            /*yield*/
            , page.save(publish)];

          case 6:
            _a.sent();

            return [2
            /*return*/
            , page];
        }
      });
    });
  };
  /**
   * Sets the modern page banner image
   *
   * @param url Url of the image to display
   * @param altText Alt text to describe the image
   * @param bannerProps Additional properties to control display of the banner
   */


  _ClientsidePage.prototype.setBannerImage = function (url, props) {
    this.bannerImageUrl = url;
    this._layoutPart.properties.imageSourceType = 2; // this seems to always be true, so default?

    if ((0, _common.objectDefinedNotNull)(props)) {
      if ((0, _common.hOP)(props, "translateX")) {
        this._layoutPart.properties.translateX = props.translateX;
      }

      if ((0, _common.hOP)(props, "translateY")) {
        this._layoutPart.properties.translateY = props.translateY;
      }

      if ((0, _common.hOP)(props, "imageSourceType")) {
        this._layoutPart.properties.imageSourceType = props.imageSourceType;
      }

      if ((0, _common.hOP)(props, "altText")) {
        this._layoutPart.properties.altText = props.altText;
      }
    }
  };
  /**
   * Sets the authors for this page from the supplied list of user integer ids
   *
   * @param authorId The integer id of the user to set as the author
   */


  _ClientsidePage.prototype.setAuthorById = function (authorId) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var userLoginData;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _sharepointqueryable.SharePointQueryableCollection)((0, _extractweburl.extractWebUrl)(this.toUrl()), "/_api/web/siteusers").configureFrom(this).filter("Id eq " + authorId).select("LoginName")()];

          case 1:
            userLoginData = _a.sent();

            if (userLoginData.length < 1) {
              throw Error("Could not find user with id " + authorId + ".");
            }

            return [2
            /*return*/
            , this.setAuthorByLoginName(userLoginData[0].LoginName)];
        }
      });
    });
  };
  /**
   * Sets the authors for this page from the supplied list of user integer ids
   *
   * @param authorLoginName The login name of the user (ex: i:0#.f|membership|name@tenant.com)
   */


  _ClientsidePage.prototype.setAuthorByLoginName = function (authorLoginName) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var userLoginData;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _sharepointqueryable.SharePointQueryableCollection)((0, _extractweburl.extractWebUrl)(this.toUrl()), "/_api/web/siteusers").configureFrom(this).filter("LoginName eq '" + encodeURIComponent(authorLoginName) + "'").select("UserPrincipalName", "Title")()];

          case 1:
            userLoginData = _a.sent();

            if (userLoginData.length < 1) {
              throw Error("Could not find user with login name '" + authorLoginName + "'.");
            }

            this.json.AuthorByline = [authorLoginName];
            this._layoutPart.properties.authorByline = [authorLoginName];
            this._layoutPart.properties.authors = [{
              id: authorLoginName,
              name: userLoginData[0].Title,
              role: "",
              upn: userLoginData[0].UserPrincipalName
            }];
            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Gets the list item associated with this clientside page
   *
   * @param selects Specific set of fields to include when getting the item
   */


  _ClientsidePage.prototype.getItem = function () {
    var selects = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      selects[_i] = arguments[_i];
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var initer, listData, item, itemData;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            initer = initFrom(this, "/_api/lists/EnsureClientRenderedSitePagesLibrary").select("EnableModeration", "EnableMinorVersions", "Id");
            return [4
            /*yield*/
            , (0, _operations.spPost)(initer)];

          case 1:
            listData = _a.sent();
            item = (0, _types2.List)(listData["odata.id"]).configureFrom(this).items.getById(this.json.Id);
            return [4
            /*yield*/
            , item.select.apply(item, selects)()];

          case 2:
            itemData = _a.sent();
            return [2
            /*return*/
            , (0, _common.assign)((0, _types.Item)((0, _odata2.odataUrlFrom)(itemData)).configureFrom(this), itemData)];
        }
      });
    });
  };
  /**
   * Extends this queryable from the provided parent
   *
   * @param parent Parent queryable from which we will derive a base url
   * @param path Additional path
   */


  _ClientsidePage.prototype.assign = function (parent, path) {
    this.data.parentUrl = parent.data.url;
    this.data.url = (0, _common.combine)(this.data.parentUrl, path || "");
    this.configureFrom(parent);
  };

  _ClientsidePage.prototype.getCanvasContent1 = function () {
    return JSON.stringify(this.getControls());
  };

  _ClientsidePage.prototype.getLayoutWebpartsContent = function () {
    if (this._layoutPart) {
      return JSON.stringify([this._layoutPart]);
    } else {
      return JSON.stringify(null);
    }
  };

  _ClientsidePage.prototype.setControls = function (controls) {
    if (controls && controls.length) {
      for (var i = 0; i < controls.length; i++) {
        // if no control type is present this is a column which we give type 0 to let us process it
        var controlType = (0, _common.hOP)(controls[i], "controlType") ? controls[i].controlType : 0;

        switch (controlType) {
          case 0:
            // empty canvas column or page settings
            if ((0, _common.hOP)(controls[i], "pageSettingsSlice")) {
              this._pageSettings = controls[i];
            } else {
              // we have an empty column
              this.mergeColumnToTree(new CanvasColumn(controls[i]));
            }

            break;

          case 3:
            var part = new ClientsideWebpart(controls[i]);
            this.mergePartToTree(part, part.data.position);
            break;

          case 4:
            var textData = controls[i];
            var text = new ClientsideText(textData.innerHTML, textData);
            this.mergePartToTree(text, text.data.position);
            break;
        }
      }

      (0, _funcs.reindex)(this.sections);
    }
  };

  _ClientsidePage.prototype.getControls = function () {
    var _this = this; // reindex things


    (0, _funcs.reindex)(this.sections); // rollup the control changes

    var canvasData = [];
    this.sections.forEach(function (section) {
      section.columns.forEach(function (column) {
        if (column.controls.length < 1) {
          // empty column
          canvasData.push({
            displayMode: column.data.displayMode,
            emphasis: _this.getEmphasisObj(section.emphasis),
            position: column.data.position
          });
        } else {
          column.controls.forEach(function (control) {
            control.data.emphasis = _this.getEmphasisObj(section.emphasis);
            canvasData.push(control.data);
          });
        }
      });
    });
    canvasData.push(this._pageSettings);
    return canvasData;
  };

  _ClientsidePage.prototype.getEmphasisObj = function (value) {
    if (value < 1 || value > 3) {
      return {};
    }

    return {
      zoneEmphasis: value
    };
  };

  _ClientsidePage.prototype.promoteNewsImpl = function (method) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var lastPubData;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.json.Id === null) {
              throw Error("The id for this page is null.");
            }

            if (!(0, _common.stringIsNullOrEmpty)(this.json.VersionInfo.LastVersionCreatedBy)) return [3
            /*break*/
            , 2];
            lastPubData = new Date(this.json.VersionInfo.LastVersionCreated);
            if (!(lastPubData.getFullYear() < 2000)) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this.save(true)];

          case 1:
            _a.sent();

            _a.label = 2;

          case 2:
            return [4
            /*yield*/
            , (0, _operations.spPost)(initFrom(this, "_api/sitepages/pages(" + this.json.Id + ")/" + method), (0, _odata.body)((0, _metadata.metadata)("SP.Publishing.SitePage")))];

          case 3:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  };
  /**
   * Merges the control into the tree of sections and columns for this page
   *
   * @param control The control to merge
   */


  _ClientsidePage.prototype.mergePartToTree = function (control, positionData) {
    var _a, _b, _c;

    var column = null;
    var sectionFactor = 12;
    var sectionIndex = 0;
    var zoneIndex = 0;
    var layoutIndex = 1; // handle case where we don't have position data (shouldn't happen?)

    if (positionData) {
      if ((0, _common.hOP)(positionData, "zoneIndex")) {
        zoneIndex = positionData.zoneIndex;
      }

      if ((0, _common.hOP)(positionData, "sectionIndex")) {
        sectionIndex = positionData.sectionIndex;
      }

      if ((0, _common.hOP)(positionData, "sectionFactor")) {
        sectionFactor = positionData.sectionFactor;
      }

      if ((0, _common.hOP)(positionData, "layoutIndex")) {
        layoutIndex = positionData.layoutIndex;
      }
    }

    var zoneEmphasis = (_c = (_b = (_a = control.data) === null || _a === void 0 ? void 0 : _a.emphasis) === null || _b === void 0 ? void 0 : _b.zoneEmphasis) !== null && _c !== void 0 ? _c : 0;
    var section = this.getOrCreateSection(zoneIndex, layoutIndex, zoneEmphasis);
    var columns = section.columns.filter(function (c) {
      return c.order === sectionIndex;
    });

    if (columns.length < 1) {
      column = section.addColumn(sectionFactor, layoutIndex);
    } else {
      column = columns[0];
    }

    control.column = column;
    column.addControl(control);
  };
  /**
   * Merges the supplied column into the tree
   *
   * @param column Column to merge
   * @param position The position data for the column
   */


  _ClientsidePage.prototype.mergeColumnToTree = function (column) {
    var order = (0, _common.hOP)(column.data, "position") && (0, _common.hOP)(column.data.position, "zoneIndex") ? column.data.position.zoneIndex : 0;
    var layoutIndex = (0, _common.hOP)(column.data, "position") && (0, _common.hOP)(column.data.position, "layoutIndex") ? column.data.position.layoutIndex : 1;
    var section = this.getOrCreateSection(order, layoutIndex, column.data.emphasis.zoneEmphasis || 0);
    column.section = section;
    section.columns.push(column);
  };
  /**
   * Handle the logic to get or create a section based on the supplied order and layoutIndex
   *
   * @param order Section order
   * @param layoutIndex Layout Index (1 === normal, 2 === vertical section)
   * @param emphasis The section emphasis
   */


  _ClientsidePage.prototype.getOrCreateSection = function (order, layoutIndex, emphasis) {
    var section = null;
    var sections = this.sections.filter(function (s) {
      return s.order === order && s.layoutIndex === layoutIndex;
    });

    if (sections.length < 1) {
      section = layoutIndex === 2 ? this.addVerticalSection() : this.addSection();
      section.order = order;
      section.emphasis = emphasis;
    } else {
      section = sections[0];
    }

    return section;
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("csp.load")], _ClientsidePage.prototype, "load", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("csp.save")], _ClientsidePage.prototype, "save", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("csp.discardPageCheckout")], _ClientsidePage.prototype, "discardPageCheckout", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("csp.promoteToNews")], _ClientsidePage.prototype, "promoteToNews", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("csp.copy")], _ClientsidePage.prototype, "copy", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("csp.getItem")], _ClientsidePage.prototype, "getItem", null);
  return _ClientsidePage;
}(_sharepointqueryable._SharePointQueryable);

exports._ClientsidePage = _ClientsidePage;

/**
 * Invokable factory for IClientSidePage instances
 */
var ClientsidePage = function (baseUrl, path, json, noInit, sections, commentsDisabled) {
  if (noInit === void 0) {
    noInit = false;
  }

  if (sections === void 0) {
    sections = [];
  }

  if (commentsDisabled === void 0) {
    commentsDisabled = false;
  }

  return (0, _odata.invokableFactory)(_ClientsidePage)(baseUrl, path, json, noInit, sections, commentsDisabled);
};
/**
 * Loads a client side page from the supplied IFile instance
 *
 * @param file Source IFile instance
 */


var ClientsidePageFromFile = function (file) {
  return (0, _tslib.__awaiter)(void 0, void 0, void 0, function () {
    var item, page;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , file.getItem()];

        case 1:
          item = _a.sent();
          page = ClientsidePage((0, _extractweburl.extractWebUrl)(file.toUrl()), "", {
            Id: item.Id
          }, true);
          return [2
          /*return*/
          , page.configureFrom(file).load()];
      }
    });
  });
};
/**
 * Creates a new client side page
 *
 * @param web The web or list
 * @param pageName The name of the page (filename)
 * @param title The page's title
 * @param PageLayoutType Layout to use when creating the page
 */


exports.ClientsidePageFromFile = ClientsidePageFromFile;

var CreateClientsidePage = function (web, pageName, title, PageLayoutType, promotedState) {
  if (PageLayoutType === void 0) {
    PageLayoutType = "Article";
  }

  if (promotedState === void 0) {
    promotedState = 0;
  }

  return (0, _tslib.__awaiter)(void 0, void 0, void 0, function () {
    var pageInitData, newPage;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          // patched because previously we used the full page name with the .aspx at the end
          // this allows folk's existing code to work after the re-write to the new API
          pageName = pageName.replace(/\.aspx$/i, "");
          return [4
          /*yield*/
          , (0, _operations.spPost)(initFrom(web, "_api/sitepages/pages"), (0, _odata.body)(Object.assign((0, _metadata.metadata)("SP.Publishing.SitePage"), {
            PageLayoutType: PageLayoutType,
            PromotedState: promotedState
          })))];

        case 1:
          pageInitData = _a.sent();
          newPage = ClientsidePage(web, "", pageInitData);
          newPage.title = pageName;
          return [4
          /*yield*/
          , newPage.save(false)];

        case 2:
          _a.sent();

          newPage.title = title;
          return [2
          /*return*/
          , newPage];
      }
    });
  });
};

exports.CreateClientsidePage = CreateClientsidePage;

var CanvasSection =
/** @class */
function () {
  function CanvasSection(page, order, layoutIndex, columns, _emphasis) {
    if (columns === void 0) {
      columns = [];
    }

    if (_emphasis === void 0) {
      _emphasis = 0;
    }

    this.page = page;
    this.columns = columns;
    this._emphasis = _emphasis;
    this._memId = (0, _common.getGUID)();
    this._order = order;
    this._layoutIndex = layoutIndex;
  }

  Object.defineProperty(CanvasSection.prototype, "order", {
    get: function () {
      return this._order;
    },
    set: function (value) {
      this._order = value;

      for (var i = 0; i < this.columns.length; i++) {
        this.columns[i].data.position.zoneIndex = value;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(CanvasSection.prototype, "layoutIndex", {
    get: function () {
      return this._layoutIndex;
    },
    set: function (value) {
      this._layoutIndex = value;

      for (var i = 0; i < this.columns.length; i++) {
        this.columns[i].data.position.layoutIndex = value;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(CanvasSection.prototype, "defaultColumn", {
    /**
     * Default column (this.columns[0]) for this section
     */
    get: function () {
      if (this.columns.length < 1) {
        this.addColumn(12);
      }

      return this.columns[0];
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Adds a new column to this section
   */

  CanvasSection.prototype.addColumn = function (factor, layoutIndex) {
    if (layoutIndex === void 0) {
      layoutIndex = 1;
    }

    var column = new CanvasColumn();
    column.section = this;
    column.data.position.zoneIndex = this.order;
    column.data.position.layoutIndex = layoutIndex;
    column.data.position.sectionFactor = factor;
    column.order = (0, _funcs.getNextOrder)(this.columns);
    this.columns.push(column);
    return column;
  };
  /**
   * Adds a control to the default column for this section
   *
   * @param control Control to add to the default column
   */


  CanvasSection.prototype.addControl = function (control) {
    this.defaultColumn.addControl(control);
    return this;
  };

  Object.defineProperty(CanvasSection.prototype, "emphasis", {
    get: function () {
      return this._emphasis;
    },
    set: function (value) {
      this._emphasis = value;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Removes this section and all contained columns and controls from the collection
   */

  CanvasSection.prototype.remove = function () {
    var _this = this;

    this.page.sections = this.page.sections.filter(function (section) {
      return section._memId !== _this._memId;
    });
    (0, _funcs.reindex)(this.page.sections);
  };

  return CanvasSection;
}();

exports.CanvasSection = CanvasSection;

var CanvasColumn =
/** @class */
function () {
  function CanvasColumn(json, controls) {
    if (json === void 0) {
      json = JSON.parse(JSON.stringify(CanvasColumn.Default));
    }

    if (controls === void 0) {
      controls = [];
    }

    this.json = json;
    this.controls = controls;
    this._section = null;
    this._memId = (0, _common.getGUID)();
  }

  Object.defineProperty(CanvasColumn.prototype, "data", {
    get: function () {
      return this.json;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(CanvasColumn.prototype, "section", {
    get: function () {
      return this._section;
    },
    set: function (section) {
      this._section = section;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(CanvasColumn.prototype, "order", {
    get: function () {
      return this.data.position.sectionIndex;
    },
    set: function (value) {
      this.data.position.sectionIndex = value;

      for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].data.position.zoneIndex = this.data.position.zoneIndex;
        this.controls[i].data.position.layoutIndex = this.data.position.layoutIndex;
        this.controls[i].data.position.sectionIndex = value;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(CanvasColumn.prototype, "factor", {
    get: function () {
      return this.data.position.sectionFactor;
    },
    set: function (value) {
      this.data.position.sectionFactor = value;
    },
    enumerable: false,
    configurable: true
  });

  CanvasColumn.prototype.addControl = function (control) {
    control.column = this;
    this.controls.push(control);
    return this;
  };

  CanvasColumn.prototype.getControl = function (index) {
    return this.controls[index];
  };

  CanvasColumn.prototype.remove = function () {
    var _this = this;

    this.section.columns = this.section.columns.filter(function (column) {
      return column._memId !== _this._memId;
    });
    (0, _funcs.reindex)(this.section.columns);
  };

  CanvasColumn.Default = {
    controlType: 0,
    displayMode: 2,
    emphasis: {},
    position: {
      layoutIndex: 1,
      sectionFactor: 12,
      sectionIndex: 1,
      zoneIndex: 1
    }
  };
  return CanvasColumn;
}();

exports.CanvasColumn = CanvasColumn;

var ColumnControl =
/** @class */
function () {
  function ColumnControl(json) {
    this.json = json;
  }

  Object.defineProperty(ColumnControl.prototype, "id", {
    get: function () {
      return this.json.id;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ColumnControl.prototype, "data", {
    get: function () {
      return this.json;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ColumnControl.prototype, "column", {
    get: function () {
      return this._column;
    },
    set: function (value) {
      this._column = value;
      this.onColumnChange(this._column);
    },
    enumerable: false,
    configurable: true
  });

  ColumnControl.prototype.remove = function () {
    var _this = this;

    this.column.controls = this.column.controls.filter(function (control) {
      return control.id !== _this.id;
    });
    (0, _funcs.reindex)(this.column.controls);
  };

  ColumnControl.prototype.setData = function (data) {
    this.json = data;
  };

  return ColumnControl;
}();

exports.ColumnControl = ColumnControl;

var ClientsideText =
/** @class */
function (_super) {
  (0, _tslib.__extends)(ClientsideText, _super);

  function ClientsideText(text, json) {
    if (json === void 0) {
      json = JSON.parse(JSON.stringify(ClientsideText.Default));
    }

    var _this = this;

    if ((0, _common.stringIsNullOrEmpty)(json.id)) {
      json.id = (0, _common.getGUID)();
      json.anchorComponentId = json.id;
    }

    _this = _super.call(this, json) || this;
    _this.text = text;
    return _this;
  }

  Object.defineProperty(ClientsideText.prototype, "text", {
    get: function () {
      return this.data.innerHTML;
    },
    set: function (value) {
      if (!value.startsWith("<p>")) {
        value = "<p>" + value + "</p>";
      }

      this.data.innerHTML = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ClientsideText.prototype, "order", {
    get: function () {
      return this.data.position.controlIndex;
    },
    set: function (value) {
      this.data.position.controlIndex = value;
    },
    enumerable: false,
    configurable: true
  });

  ClientsideText.prototype.onColumnChange = function (col) {
    this.data.position.sectionFactor = col.factor;
    this.data.position.controlIndex = (0, _funcs.getNextOrder)(col.controls);
    this.data.position.zoneIndex = col.data.position.zoneIndex;
    this.data.position.sectionIndex = col.order;
    this.data.position.layoutIndex = col.data.position.layoutIndex;
  };

  ClientsideText.Default = {
    addedFromPersistedData: false,
    anchorComponentId: "",
    controlType: 4,
    displayMode: 2,
    editorType: "CKEditor",
    emphasis: {},
    id: "",
    innerHTML: "",
    position: {
      controlIndex: 1,
      layoutIndex: 1,
      sectionFactor: 12,
      sectionIndex: 1,
      zoneIndex: 1
    }
  };
  return ClientsideText;
}(ColumnControl);

exports.ClientsideText = ClientsideText;

var ClientsideWebpart =
/** @class */
function (_super) {
  (0, _tslib.__extends)(ClientsideWebpart, _super);

  function ClientsideWebpart(json) {
    if (json === void 0) {
      json = JSON.parse(JSON.stringify(ClientsideWebpart.Default));
    }

    return _super.call(this, json) || this;
  }

  ClientsideWebpart.fromComponentDef = function (definition) {
    var part = new ClientsideWebpart();
    part.import(definition);
    return part;
  };

  Object.defineProperty(ClientsideWebpart.prototype, "title", {
    get: function () {
      return this.data.webPartData.title;
    },
    set: function (value) {
      this.data.webPartData.title = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ClientsideWebpart.prototype, "description", {
    get: function () {
      return this.data.webPartData.description;
    },
    set: function (value) {
      this.data.webPartData.description = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ClientsideWebpart.prototype, "order", {
    get: function () {
      return this.data.position.controlIndex;
    },
    set: function (value) {
      this.data.position.controlIndex = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ClientsideWebpart.prototype, "height", {
    get: function () {
      return this.data.reservedHeight;
    },
    set: function (value) {
      this.data.reservedHeight = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ClientsideWebpart.prototype, "width", {
    get: function () {
      return this.data.reservedWidth;
    },
    set: function (value) {
      this.data.reservedWidth = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ClientsideWebpart.prototype, "dataVersion", {
    get: function () {
      return this.data.webPartData.dataVersion;
    },
    set: function (value) {
      this.data.webPartData.dataVersion = value;
    },
    enumerable: false,
    configurable: true
  });

  ClientsideWebpart.prototype.setProperties = function (properties) {
    this.data.webPartData.properties = (0, _common.assign)(this.data.webPartData.properties, properties);
    return this;
  };

  ClientsideWebpart.prototype.getProperties = function () {
    return this.data.webPartData.properties;
  };

  ClientsideWebpart.prototype.onColumnChange = function (col) {
    this.data.position.sectionFactor = col.factor;
    this.data.position.controlIndex = (0, _funcs.getNextOrder)(col.controls);
    this.data.position.zoneIndex = col.data.position.zoneIndex;
    this.data.position.sectionIndex = col.data.position.sectionIndex;
    this.data.position.layoutIndex = col.data.position.layoutIndex;
  };

  ClientsideWebpart.prototype.import = function (component) {
    var id = (0, _common.getGUID)();
    var componendId = component.Id.replace(/^\{|\}$/g, "").toLowerCase();
    var manifest = JSON.parse(component.Manifest);
    var preconfiguredEntries = manifest.preconfiguredEntries[0];
    this.setData(Object.assign({}, this.data, {
      id: id,
      webPartData: {
        dataVersion: "1.0",
        description: preconfiguredEntries.description.default,
        id: componendId,
        instanceId: id,
        properties: preconfiguredEntries.properties,
        title: preconfiguredEntries.title.default
      },
      webPartId: componendId
    }));
  };

  ClientsideWebpart.Default = {
    addedFromPersistedData: false,
    controlType: 3,
    displayMode: 2,
    emphasis: {},
    id: null,
    position: {
      controlIndex: 1,
      layoutIndex: 1,
      sectionFactor: 12,
      sectionIndex: 1,
      zoneIndex: 1
    },
    reservedHeight: 500,
    reservedWidth: 500,
    webPartData: null,
    webPartId: null
  };
  return ClientsideWebpart;
}(ColumnControl);

exports.ClientsideWebpart = ClientsideWebpart;
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","@pnp/common":"../node_modules/@pnp/common/index.js","../items/types":"../node_modules/@pnp/sp/items/types.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","../odata":"../node_modules/@pnp/sp/odata.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","../sites/types":"../node_modules/@pnp/sp/sites/types.js","../operations":"../node_modules/@pnp/sp/operations.js","./funcs":"../node_modules/@pnp/sp/clientside-pages/funcs.js","../files/web":"../node_modules/@pnp/sp/files/web.js","../comments/item":"../node_modules/@pnp/sp/comments/item.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/clientside-pages/web.js":[function(require,module,exports) {
"use strict";

var _types = require("../webs/types");

var _types2 = require("./types");

var _sharepointqueryable = require("../sharepointqueryable");

_types._Web.prototype.getClientsideWebParts = function () {
  return this.clone(_sharepointqueryable.SharePointQueryableCollection, "GetClientSideWebParts")();
};

_types._Web.prototype.addClientsidePage = function (pageName, title, layout, promotedState) {
  if (title === void 0) {
    title = pageName.replace(/\.[^/.]+$/, "");
  }

  return (0, _types2.CreateClientsidePage)(this, pageName, title, layout, promotedState);
};

_types._Web.prototype.loadClientsidePage = function (path) {
  return (0, _types2.ClientsidePageFromFile)(this.getFileByServerRelativePath(path));
};
},{"../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/clientside-pages/types.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js"}],"../node_modules/@pnp/sp/clientside-pages/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ClientsidePageFromFile", {
  enumerable: true,
  get: function () {
    return _types.ClientsidePageFromFile;
  }
});
Object.defineProperty(exports, "CreateClientsidePage", {
  enumerable: true,
  get: function () {
    return _types.CreateClientsidePage;
  }
});
Object.defineProperty(exports, "CanvasColumn", {
  enumerable: true,
  get: function () {
    return _types.CanvasColumn;
  }
});
Object.defineProperty(exports, "CanvasSection", {
  enumerable: true,
  get: function () {
    return _types.CanvasSection;
  }
});
Object.defineProperty(exports, "ClientsideText", {
  enumerable: true,
  get: function () {
    return _types.ClientsideText;
  }
});
Object.defineProperty(exports, "ClientsideWebpart", {
  enumerable: true,
  get: function () {
    return _types.ClientsideWebpart;
  }
});
Object.defineProperty(exports, "ColumnControl", {
  enumerable: true,
  get: function () {
    return _types.ColumnControl;
  }
});
Object.defineProperty(exports, "PromotedState", {
  enumerable: true,
  get: function () {
    return _types.PromotedState;
  }
});

require("./web");

var _types = require("./types");
},{"./web":"../node_modules/@pnp/sp/clientside-pages/web.js","./types":"../node_modules/@pnp/sp/clientside-pages/types.js"}],"../node_modules/@pnp/sp/folders/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Folder = exports._Folder = exports.Folders = exports._Folders = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _sharepointqueryable = require("../sharepointqueryable");

var _odata = require("../odata");

var _types = require("../items/types");

var _odata2 = require("@pnp/odata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _escapeQueryStrValue = require("../utils/escapeQueryStrValue");

var _extractweburl = require("../utils/extractweburl");

var _telemetry = require("../telemetry");

var _toResourcePath = require("../utils/toResourcePath");

var _Folders =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Folders, _super);

  function _Folders() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a folder by it's name
   *
   * @param name Folder's name
   */


  _Folders.prototype.getByName = function (name) {
    return _telemetry.tag.configure(Folder(this).concat("('" + (0, _escapeQueryStrValue.escapeQueryStrValue)(name) + "')"), "fs.getByName");
  };
  /**
   * Adds a new folder at the specified URL
   *
   * @param url
   */


  _Folders.prototype.add = function (url) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Folders, "add('" + (0, _escapeQueryStrValue.escapeQueryStrValue)(url) + "')"))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              folder: this.getByName(url)
            }];
        }
      });
    });
  };
  /**
   * Adds a new folder by path and should be prefered over add
   *
   * @param serverRelativeUrl The server relative url of the new folder to create
   * @param overwrite True to overwrite an existing folder, default false
   */


  _Folders.prototype.addUsingPath = function (serverRelativeUrl, overwrite) {
    if (overwrite === void 0) {
      overwrite = false;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Folders, "addUsingPath(DecodedUrl='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(serverRelativeUrl) + "',overwrite=" + overwrite + ")"))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              folder: Folder((0, _extractweburl.extractWebUrl)(this.toUrl()), "_api/web/getFolderByServerRelativePath(decodedUrl='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(serverRelativeUrl) + "')")
            }];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.add")], _Folders.prototype, "add", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addUsingPath")], _Folders.prototype, "addUsingPath", null);
  _Folders = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("folders")], _Folders);
  return _Folders;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Folders = _Folders;
var Folders = (0, _sharepointqueryable.spInvokableFactory)(_Folders);
exports.Folders = Folders;

var _Folder =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Folder, _super);

  function _Folder() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteableWithETag)("f");
    /**
     * Updates folder's properties
     * @param props Folder's properties to update
     */

    _this.update = _this._update("SP.Folder", function (data) {
      return {
        data: data,
        folder: _this
      };
    });
    return _this;
  }

  Object.defineProperty(_Folder.prototype, "contentTypeOrder", {
    /**
     * Specifies the sequence in which content types are displayed.
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableCollection)(this, "contentTypeOrder"), "f.contentTypeOrder");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Folder.prototype, "folders", {
    /**
     * Gets this folder's sub folders
     *
     */
    get: function () {
      return Folders(this);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Folder.prototype, "listItemAllFields", {
    /**
     * Gets this folder's list item field values
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableInstance)(this, "listItemAllFields"), "f.listItemAllFields");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Folder.prototype, "parentFolder", {
    /**
     * Gets the parent folder, if available
     *
     */
    get: function () {
      return _telemetry.tag.configure(Folder(this, "parentFolder"), "f.parentFolder");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Folder.prototype, "properties", {
    /**
     * Gets this folder's properties
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableInstance)(this, "properties"), "f.properties");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Folder.prototype, "serverRelativeUrl", {
    /**
     * Gets this folder's server relative url
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryable)(this, "serverRelativeUrl"), "f.serverRelativeUrl");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Folder.prototype, "uniqueContentTypeOrder", {
    /**
     * Gets a value that specifies the content type order.
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableCollection)(this, "uniqueContentTypeOrder"), "f.uniqueContentTypeOrder");
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Moves the folder to the Recycle Bin and returns the identifier of the new Recycle Bin item.
   */

  _Folder.prototype.recycle = function () {
    return (0, _operations.spPost)(this.clone(Folder, "recycle"));
  };
  /**
   * Gets the associated list item for this folder, loading the default properties
   */


  _Folder.prototype.getItem = function () {
    var selects = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      selects[_i] = arguments[_i];
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var q;

      var _a;

      return (0, _tslib.__generator)(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4
            /*yield*/
            , (_a = this.listItemAllFields).select.apply(_a, (0, _tslib.__spread)(selects))()];

          case 1:
            q = _b.sent();
            return [2
            /*return*/
            , (0, _common.assign)((0, _types.Item)((0, _odata.odataUrlFrom)(q)), q)];
        }
      });
    });
  };
  /**
   * Moves a folder to destination path
   *
   * @param destUrl Absolute or relative URL of the destination path
   */


  _Folder.prototype.moveTo = function (destUrl) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var _a, srcUrl, absoluteUrl, webBaseUrl, hostUrl;

      return (0, _tslib.__generator)(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4
            /*yield*/
            , this.select("ServerRelativeUrl")()];

          case 1:
            _a = _b.sent(), srcUrl = _a.ServerRelativeUrl, absoluteUrl = _a["odata.id"];
            webBaseUrl = (0, _extractweburl.extractWebUrl)(absoluteUrl);
            hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
            return [4
            /*yield*/
            , (0, _operations.spPost)(Folder(webBaseUrl, "/_api/SP.MoveCopyUtil.MoveFolder()"), (0, _odata2.body)({
              destUrl: (0, _common.isUrlAbsolute)(destUrl) ? destUrl : "" + hostUrl + destUrl,
              srcUrl: "" + hostUrl + srcUrl
            }))];

          case 2:
            _b.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Moves a folder by path to destination path
   * Also works with different site collections.
   *
   * @param destUrl Absolute or relative URL of the destination path
   * @param keepBoth Keep both if folder with the same name in the same location already exists?
   */


  _Folder.prototype.moveByPath = function (destUrl, KeepBoth) {
    if (KeepBoth === void 0) {
      KeepBoth = false;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var _a, srcUrl, absoluteUrl, webBaseUrl, hostUrl;

      return (0, _tslib.__generator)(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4
            /*yield*/
            , this.select("ServerRelativeUrl")()];

          case 1:
            _a = _b.sent(), srcUrl = _a.ServerRelativeUrl, absoluteUrl = _a["odata.id"];
            webBaseUrl = (0, _extractweburl.extractWebUrl)(absoluteUrl);
            hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
            return [4
            /*yield*/
            , (0, _operations.spPost)(Folder(webBaseUrl, "/_api/SP.MoveCopyUtil.MoveFolderByPath()"), (0, _odata2.body)({
              destPath: (0, _toResourcePath.toResourcePath)((0, _common.isUrlAbsolute)(destUrl) ? destUrl : "" + hostUrl + destUrl),
              options: {
                KeepBoth: KeepBoth,
                ResetAuthorAndCreatedOnCopy: true,
                ShouldBypassSharedLocks: true,
                __metadata: {
                  type: "SP.MoveCopyOptions"
                }
              },
              srcPath: (0, _toResourcePath.toResourcePath)((0, _common.isUrlAbsolute)(srcUrl) ? srcUrl : "" + hostUrl + srcUrl)
            }))];

          case 2:
            _b.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Copies a folder to destination path
   *
   * @param destUrl Absolute or relative URL of the destination path
   */


  _Folder.prototype.copyTo = function (destUrl) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var _a, srcUrl, absoluteUrl, webBaseUrl, hostUrl;

      return (0, _tslib.__generator)(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4
            /*yield*/
            , this.select("ServerRelativeUrl")()];

          case 1:
            _a = _b.sent(), srcUrl = _a.ServerRelativeUrl, absoluteUrl = _a["odata.id"];
            webBaseUrl = (0, _extractweburl.extractWebUrl)(absoluteUrl);
            hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
            return [4
            /*yield*/
            , (0, _operations.spPost)(Folder(webBaseUrl, "/_api/SP.MoveCopyUtil.CopyFolder()"), (0, _odata2.body)({
              destUrl: (0, _common.isUrlAbsolute)(destUrl) ? destUrl : "" + hostUrl + destUrl,
              srcUrl: "" + hostUrl + srcUrl
            }))];

          case 2:
            _b.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Copies a folder by path to destination path
   * Also works with different site collections.
   *
   * @param destUrl Absolute or relative URL of the destination path
   * @param keepBoth Keep both if folder with the same name in the same location already exists?
   */


  _Folder.prototype.copyByPath = function (destUrl, KeepBoth) {
    if (KeepBoth === void 0) {
      KeepBoth = false;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var _a, srcUrl, absoluteUrl, webBaseUrl, hostUrl;

      return (0, _tslib.__generator)(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4
            /*yield*/
            , this.select("ServerRelativeUrl")()];

          case 1:
            _a = _b.sent(), srcUrl = _a.ServerRelativeUrl, absoluteUrl = _a["odata.id"];
            webBaseUrl = (0, _extractweburl.extractWebUrl)(absoluteUrl);
            hostUrl = webBaseUrl.replace("://", "___").split("/")[0].replace("___", "://");
            return [4
            /*yield*/
            , (0, _operations.spPost)(Folder(webBaseUrl, "/_api/SP.MoveCopyUtil.CopyFolderByPath()"), (0, _odata2.body)({
              destPath: (0, _toResourcePath.toResourcePath)((0, _common.isUrlAbsolute)(destUrl) ? destUrl : "" + hostUrl + destUrl),
              options: {
                KeepBoth: KeepBoth,
                ResetAuthorAndCreatedOnCopy: true,
                ShouldBypassSharedLocks: true,
                __metadata: {
                  type: "SP.MoveCopyOptions"
                }
              },
              srcPath: (0, _toResourcePath.toResourcePath)((0, _common.isUrlAbsolute)(srcUrl) ? srcUrl : "" + hostUrl + srcUrl)
            }))];

          case 2:
            _b.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Gets the shareable item associated with this folder
   */


  _Folder.prototype.getShareable = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var d, shareable;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.clone(_sharepointqueryable.SharePointQueryableInstance, "listItemAllFields", false).select("odata.id")()];

          case 1:
            d = _a.sent();
            shareable = (0, _types.Item)((0, _odata.odataUrlFrom)(d)); // we need to handle batching

            if (this.hasBatch) {
              shareable = shareable.inBatch(this.batch);
            }

            return [2
            /*return*/
            , shareable];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("f.recycle")], _Folder.prototype, "recycle", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("f.getItem")], _Folder.prototype, "getItem", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("f.moveTo")], _Folder.prototype, "moveTo", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("f.moveByPath")], _Folder.prototype, "moveByPath", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("f.copyTo")], _Folder.prototype, "copyTo", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("f.copyByPath")], _Folder.prototype, "copyByPath", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("f.getShareable")], _Folder.prototype, "getShareable", null);
  return _Folder;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Folder = _Folder;
var Folder = (0, _sharepointqueryable.spInvokableFactory)(_Folder);
exports.Folder = Folder;
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../odata":"../node_modules/@pnp/sp/odata.js","../items/types":"../node_modules/@pnp/sp/items/types.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../utils/escapeQueryStrValue":"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js","../utils/toResourcePath":"../node_modules/@pnp/sp/utils/toResourcePath.js"}],"../node_modules/@pnp/sp/column-defaults/list.js":[function(require,module,exports) {
"use strict";

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _types = require("../lists/types");

var _types2 = require("../folders/types");

var _common = require("@pnp/common");

var _escapeQueryStrValue = require("../utils/escapeQueryStrValue");

var _logging = require("@pnp/logging");

var _operations = require("../operations");

var _all = require("../presets/all");

(0, _odata.addProp)(_types._List, "rootFolder", _types2.Folder, "rootFolder");

_types._List.prototype.getDefaultColumnValues = function () {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var pathPart, webUrl, path, baseFilePath, xml, e_1, matches, tags;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , this.rootFolder.select("ServerRelativePath")()];

        case 1:
          pathPart = _a.sent();
          return [4
          /*yield*/
          , this.select("ParentWeb/Url").expand("ParentWeb")()];

        case 2:
          webUrl = _a.sent();
          path = (0, _common.combine)("/", pathPart.ServerRelativePath.DecodedUrl, "Forms/client_LocationBasedDefaults.html");
          baseFilePath = (0, _common.combine)(webUrl.ParentWeb.Url, "_api/web", "getFileByServerRelativePath(decodedUrl='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(path) + "')");
          xml = "";
          _a.label = 3;

        case 3:
          _a.trys.push([3, 5,, 6]);

          return [4
          /*yield*/
          , (0, _types2.Folder)(baseFilePath, "$value").usingParser(new _odata.TextParser())((0, _odata.headers)({
            "binaryStringResponseBody": "true"
          }))];

        case 4:
          xml = _a.sent();
          return [3
          /*break*/
          , 6];

        case 5:
          e_1 = _a.sent(); // if this call fails we assume it is because the file is 404

          if (e_1 && e_1.status && e_1.status === 404) {
            // return an empty array
            return [2
            /*return*/
            , []];
          }

          throw e_1;

        case 6:
          matches = xml.match(/<a.*?<\/a>/ig);
          tags = matches === null ? [] : matches.map(function (t) {
            return t.trim();
          }); // now we need to turn these tags of form into objects
          // <a href="/sites/dev/My%20Title"><DefaultValue FieldName="TextField">Test</DefaultValue></a>

          return [2
          /*return*/
          , tags.map(function (t) {
            var m = /<a href="(.*?)"><DefaultValue FieldName="(.*?)">(.*?)<\/DefaultValue>/ig.exec(t); // if things worked our captures are:
            // 0: whole string
            // 1: ENCODED server relative path
            // 2: Field internal name
            // 3: Default value as string

            if (m.length < 1) {
              // this indicates an error somewhere, but we have no way to meaningfully recover
              // perhaps the way the tags are stored has changed on the server? Check that first.
              _logging.Logger.write("Could not parse default column value from '" + t + "'", 2
              /* Warning */
              );

              return null;
            } // return the parsed out values


            return {
              name: m[2],
              path: decodeURIComponent(m[1]),
              value: m[3]
            };
          }).filter(function (v) {
            return v !== null;
          })];
      }
    });
  });
};

_types._List.prototype.setDefaultColumnValues = function (defaults) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var fieldDefs, tags, xml, pathPart, webUrl, path, baseFilePath, existingReceivers;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , (0, _all.SharePointQueryableCollection)(this, "fields").select("InternalName", "TypeAsString").filter("Hidden ne true")()];

        case 1:
          fieldDefs = _a.sent();
          tags = defaults.map(function (fieldDefault) {
            var index = fieldDefs.findIndex(function (fd) {
              return fd.InternalName === fieldDefault.name;
            });

            if (index < 0) {
              throw Error("Field '" + fieldDefault.name + "' does not exist in the list. Please check the internal field name. Failed to set defaults.");
            }

            var fieldDef = fieldDefs[index];
            var value = "";

            switch (fieldDef.TypeAsString) {
              case "Boolean":
              case "Currency":
              case "Text":
              case "DateTime":
              case "Number":
              case "Choice":
              case "User":
                if ((0, _common.isArray)(fieldDefault.value)) {
                  throw Error("The type '" + fieldDef.TypeAsString + "' does not support multiple values.");
                }

                value = "" + fieldDefault.value;
                break;

              case "MultiChoice":
                if ((0, _common.isArray)(fieldDefault.value)) {
                  value = fieldDefault.value.map(function (v) {
                    return "" + v;
                  }).join(";");
                } else {
                  value = "" + fieldDefault.value;
                }

                break;

              case "UserMulti":
                if ((0, _common.isArray)(fieldDefault.value)) {
                  value = fieldDefault.value.map(function (v) {
                    return "" + v;
                  }).join(";#");
                } else {
                  value = "" + fieldDefault.value;
                }

                break;

              case "Taxonomy":
                if ((0, _common.isArray)(fieldDefault.value)) {
                  throw Error("The type '" + fieldDef.TypeAsString + "' does not support multiple values.");
                } else {
                  value = fieldDefault.value.wssId + ";#" + fieldDefault.value.termName + "|" + fieldDefault.value.termId;
                }

                break;

              case "TaxonomyMulti":
                if ((0, _common.isArray)(fieldDefault.value)) {
                  value = fieldDefault.value.map(function (v) {
                    return v.wssId + ";#" + v.termName + "|" + v.termId;
                  }).join(";#");
                }

                value = fieldDefault.value.wssId + ";#" + fieldDefault.value.termName + "|" + fieldDefault.value.termId;
                break;
            }

            return "<a href=\"" + fieldDefault.path.replace(/ /gi, "%20") + "\"><DefaultValue FieldName=\"" + fieldDefault.name + "\">" + value + "</DefaultValue></a>";
          });
          xml = "<MetadataDefaults>" + tags.join("") + "</MetadataDefaults>";
          return [4
          /*yield*/
          , this.rootFolder.select("ServerRelativePath")()];

        case 2:
          pathPart = _a.sent();
          return [4
          /*yield*/
          , this.select("ParentWeb/Url").expand("ParentWeb")()];

        case 3:
          webUrl = _a.sent();
          path = (0, _common.combine)("/", pathPart.ServerRelativePath.DecodedUrl, "Forms");
          baseFilePath = (0, _common.combine)(webUrl.ParentWeb.Url, "_api/web", "getFolderByServerRelativePath(decodedUrl='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(path) + "')", "files");
          return [4
          /*yield*/
          , (0, _operations.spPost)((0, _types2.Folder)(baseFilePath, "add(overwrite=true,url='client_LocationBasedDefaults.html')"), {
            body: xml
          })];

        case 4:
          _a.sent();

          return [4
          /*yield*/
          , this.eventReceivers.filter("ReceiverName eq 'LocationBasedMetadataDefaultsReceiver ItemAdded'").select("ReceiverId")()];

        case 5:
          existingReceivers = _a.sent();
          if (!(existingReceivers.length < 1)) return [3
          /*break*/
          , 7];
          return [4
          /*yield*/
          , (0, _operations.spPost)((0, _types.List)(this.eventReceivers, "add"), (0, _odata.body)({
            eventReceiverCreationInformation: {
              EventType: 10001,
              ReceiverAssembly: "Microsoft.Office.DocumentManagement, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c",
              ReceiverClass: "Microsoft.Office.DocumentManagement.LocationBasedMetadataDefaultsReceiver",
              ReceiverName: "LocationBasedMetadataDefaultsReceiver ItemAdded",
              SequenceNumber: 1000,
              Synchronization: 1
            }
          }))];

        case 6:
          _a.sent();

          _a.label = 7;

        case 7:
          return [2
          /*return*/
          ];
      }
    });
  });
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","../folders/types":"../node_modules/@pnp/sp/folders/types.js","@pnp/common":"../node_modules/@pnp/common/index.js","../utils/escapeQueryStrValue":"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js","@pnp/logging":"../node_modules/@pnp/logging/index.js","../operations":"../node_modules/@pnp/sp/operations.js","../presets/all":"../node_modules/@pnp/sp/presets/all.js"}],"../node_modules/@pnp/sp/column-defaults/folder.js":[function(require,module,exports) {
"use strict";

var _tslib = require("tslib");

var _odata = require("../odata");

var _extractweburl = require("../utils/extractweburl");

var _types = require("../webs/types");

require("../lists/web");

var _types2 = require("../folders/types");

_types2._Folder.prototype.getDefaultColumnValues = function () {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var folderProps, serRelPath, web, docLib;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , (0, _types2.Folder)(this, "Properties").select("vti_x005f_listname")()];

        case 1:
          folderProps = _a.sent();
          return [4
          /*yield*/
          , this.select("ServerRelativePath")()];

        case 2:
          serRelPath = _a.sent().ServerRelativePath;
          web = (0, _types.Web)((0, _extractweburl.extractWebUrl)((0, _odata.odataUrlFrom)(folderProps)));
          docLib = web.lists.getById(folderProps.vti_x005f_listname);
          return [4
          /*yield*/
          , docLib.getDefaultColumnValues()];

        case 3:
          // and we return the defaults associated with this folder's server relative path only
          // if you want all the defaults use list.getDefaultColumnValues()
          return [2
          /*return*/
          , _a.sent().filter(function (v) {
            return v.path.toLowerCase() === serRelPath.DecodedUrl.toLowerCase();
          })];
      }
    });
  });
};

_types2._Folder.prototype.setDefaultColumnValues = function (fieldDefaults, merge) {
  if (merge === void 0) {
    merge = true;
  }

  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var folderProps, web, docLib, folderPath, existingDefaults, filteredExistingDefaults;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , (0, _types2.Folder)(this, "Properties").select("vti_x005f_listname")()];

        case 1:
          folderProps = _a.sent();
          web = (0, _types.Web)((0, _extractweburl.extractWebUrl)((0, _odata.odataUrlFrom)(folderProps)));
          docLib = web.lists.getById(folderProps.vti_x005f_listname);
          return [4
          /*yield*/
          , this.select("ServerRelativePath")()];

        case 2:
          folderPath = _a.sent().ServerRelativePath.DecodedUrl;
          return [4
          /*yield*/
          , docLib.getDefaultColumnValues()];

        case 3:
          existingDefaults = _a.sent();
          filteredExistingDefaults = merge ? existingDefaults : existingDefaults.filter(function (f) {
            return f.path !== folderPath;
          }); // we update / add any new defaults from those passed to this method

          fieldDefaults.forEach(function (d) {
            var existing = filteredExistingDefaults.find(function (ed) {
              return ed.name === d.name && ed.path === folderPath;
            });

            if (existing) {
              existing.value = d.value;
            } else {
              filteredExistingDefaults.push({
                name: d.name,
                path: folderPath,
                value: d.value
              });
            }
          }); // after this operation filteredExistingDefaults should contain all the value we want to write to the file

          return [4
          /*yield*/
          , docLib.setDefaultColumnValues(filteredExistingDefaults)];

        case 4:
          // after this operation filteredExistingDefaults should contain all the value we want to write to the file
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
};

_types2._Folder.prototype.clearDefaultColumnValues = function () {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , this.setDefaultColumnValues([], false)];

        case 1:
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","../odata":"../node_modules/@pnp/sp/odata.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","../lists/web":"../node_modules/@pnp/sp/lists/web.js","../folders/types":"../node_modules/@pnp/sp/folders/types.js"}],"../node_modules/@pnp/sp/column-defaults/index.js":[function(require,module,exports) {
"use strict";

require("./list");

require("./folder");
},{"./list":"../node_modules/@pnp/sp/column-defaults/list.js","./folder":"../node_modules/@pnp/sp/column-defaults/folder.js"}],"../node_modules/@pnp/sp/comments/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Comment", {
  enumerable: true,
  get: function () {
    return _types.Comment;
  }
});
Object.defineProperty(exports, "Comments", {
  enumerable: true,
  get: function () {
    return _types.Comments;
  }
});
Object.defineProperty(exports, "Replies", {
  enumerable: true,
  get: function () {
    return _types.Replies;
  }
});

require("./item");

var _types = require("./types");
},{"./item":"../node_modules/@pnp/sp/comments/item.js","./types":"../node_modules/@pnp/sp/comments/types.js"}],"../node_modules/@pnp/sp/content-types/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldLink = exports._FieldLink = exports.FieldLinks = exports._FieldLinks = exports.ContentType = exports._ContentType = exports.ContentTypes = exports._ContentTypes = void 0;

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _sharepointqueryable = require("../sharepointqueryable");

var _decorators = require("../decorators");

var _metadata = require("../utils/metadata");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _ContentTypes =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_ContentTypes, _super);

  function _ContentTypes() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Adds an existing contenttype to a content type collection
   *
   * @param contentTypeId in the following format, for example: 0x010102
   */


  _ContentTypes.prototype.addAvailableContentType = function (contentTypeId) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(ContentTypes, "addAvailableContentType"), (0, _odata.body)({
              "contentTypeId": contentTypeId
            }))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              contentType: this.getById(data.id),
              data: data
            }];
        }
      });
    });
  };
  /**
   * Gets a ContentType by content type id
   * @param id The id of the content type to get, in the following format, for example: 0x010102
   */


  _ContentTypes.prototype.getById = function (id) {
    return _telemetry.tag.configure(ContentType(this).concat("('" + id + "')"), "cts.getById");
  };
  /**
   * Adds a new content type to the collection
   *
   * @param id The desired content type id for the new content type (also determines the parent content type)
   * @param name The name of the content type
   * @param description The description of the content type
   * @param group The group in which to add the content type
   * @param additionalSettings Any additional settings to provide when creating the content type
   *
   */


  _ContentTypes.prototype.add = function (id, name, description, group, additionalSettings) {
    if (description === void 0) {
      description = "";
    }

    if (group === void 0) {
      group = "Custom Content Types";
    }

    if (additionalSettings === void 0) {
      additionalSettings = {};
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = (0, _odata.body)(Object.assign((0, _metadata.metadata)("SP.ContentType"), {
              "Description": description,
              "Group": group,
              "Id": {
                "StringValue": id
              },
              "Name": name
            }, additionalSettings));
            return [4
            /*yield*/
            , (0, _operations.spPost)(this, postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              contentType: this.getById(data.id),
              data: data
            }];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("cts.addAvailableContentType")], _ContentTypes.prototype, "addAvailableContentType", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("cts.add")], _ContentTypes.prototype, "add", null);
  _ContentTypes = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("contenttypes")], _ContentTypes);
  return _ContentTypes;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._ContentTypes = _ContentTypes;
var ContentTypes = (0, _sharepointqueryable.spInvokableFactory)(_ContentTypes);
exports.ContentTypes = ContentTypes;

var _ContentType =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_ContentType, _super);

  function _ContentType() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteable)("ct");
    return _this;
  }

  Object.defineProperty(_ContentType.prototype, "fieldLinks", {
    /**
     * Gets the column (also known as field) references in the content type.
     */
    get: function () {
      return _telemetry.tag.configure(FieldLinks(this), "ct.fieldLinks");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ContentType.prototype, "fields", {
    /**
     * Gets a value that specifies the collection of fields for the content type.
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableCollection)(this, "fields"), "ct.fields");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ContentType.prototype, "parent", {
    /**
     * Gets the parent content type of the content type.
     */
    get: function () {
      return _telemetry.tag.configure(ContentType(this, "parent"), "ct.parent");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ContentType.prototype, "workflowAssociations", {
    /**
     * Gets a value that specifies the collection of workflow associations for the content type.
     */
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableCollection)(this, "workflowAssociations"), "ct.workflowAssociations");
    },
    enumerable: false,
    configurable: true
  });
  return _ContentType;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._ContentType = _ContentType;
var ContentType = (0, _sharepointqueryable.spInvokableFactory)(_ContentType);
exports.ContentType = ContentType;

var _FieldLinks =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_FieldLinks, _super);

  function _FieldLinks() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
  *  Gets a FieldLink by GUID id
  *
  * @param id The GUID id of the field link
  */


  _FieldLinks.prototype.getById = function (id) {
    return _telemetry.tag.configure(FieldLink(this).concat("(guid'" + id + "')"), "fls.getById");
  };

  _FieldLinks = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("fieldlinks")], _FieldLinks);
  return _FieldLinks;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._FieldLinks = _FieldLinks;
var FieldLinks = (0, _sharepointqueryable.spInvokableFactory)(_FieldLinks);
exports.FieldLinks = FieldLinks;

var _FieldLink =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_FieldLink, _super);

  function _FieldLink() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return _FieldLink;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._FieldLink = _FieldLink;
var FieldLink = (0, _sharepointqueryable.spInvokableFactory)(_FieldLink);
exports.FieldLink = FieldLink;
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/content-types/web.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../webs/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Web, "contentTypes", _types2.ContentTypes);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/content-types/types.js"}],"../node_modules/@pnp/sp/content-types/item.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../items/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Item, "contentType", _types2.ContentType, "ContentType");
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../items/types":"../node_modules/@pnp/sp/items/types.js","./types":"../node_modules/@pnp/sp/content-types/types.js"}],"../node_modules/@pnp/sp/content-types/list.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../lists/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._List, "contentTypes", _types2.ContentTypes);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","./types":"../node_modules/@pnp/sp/content-types/types.js"}],"../node_modules/@pnp/sp/content-types/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ContentType", {
  enumerable: true,
  get: function () {
    return _types.ContentType;
  }
});
Object.defineProperty(exports, "ContentTypes", {
  enumerable: true,
  get: function () {
    return _types.ContentTypes;
  }
});
Object.defineProperty(exports, "FieldLink", {
  enumerable: true,
  get: function () {
    return _types.FieldLink;
  }
});
Object.defineProperty(exports, "FieldLinks", {
  enumerable: true,
  get: function () {
    return _types.FieldLinks;
  }
});

require("./web");

require("./item");

require("./list");

var _types = require("./types");
},{"./web":"../node_modules/@pnp/sp/content-types/web.js","./item":"../node_modules/@pnp/sp/content-types/item.js","./list":"../node_modules/@pnp/sp/content-types/list.js","./types":"../node_modules/@pnp/sp/content-types/types.js"}],"../node_modules/@pnp/sp/features/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Feature = exports._Feature = exports.Features = exports._Features = void 0;

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _sharepointqueryable = require("../sharepointqueryable");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _Features =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Features, _super);

  function _Features() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Adds (activates) the specified feature
   *
   * @param id The Id of the feature (GUID)
   * @param force If true the feature activation will be forced
   */


  _Features.prototype.add = function (id, force) {
    if (force === void 0) {
      force = false;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Features, "add"), (0, _odata.body)({
              featdefScope: 0,
              featureId: id,
              force: force
            }))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              feature: this.getById(id)
            }];
        }
      });
    });
  };
  /**
   * Gets a feature from the collection with the specified guid
   *
   * @param id The Id of the feature (GUID)
   */


  _Features.prototype.getById = function (id) {
    var feature = Feature(this);
    feature.concat("('" + id + "')");
    return _telemetry.tag.configure(feature, "fes.getById");
  };
  /**
   * Removes (deactivates) a feature from the collection
   *
   * @param id The Id of the feature (GUID)
   * @param force If true the feature deactivation will be forced
   */


  _Features.prototype.remove = function (id, force) {
    if (force === void 0) {
      force = false;
    }

    return (0, _operations.spPost)(this.clone(Features, "remove"), (0, _odata.body)({
      featureId: id,
      force: force
    }));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("fes.add")], _Features.prototype, "add", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fes.remove")], _Features.prototype, "remove", null);
  _Features = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("features")], _Features);
  return _Features;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Features = _Features;
var Features = (0, _sharepointqueryable.spInvokableFactory)(_Features);
exports.Features = Features;

var _Feature =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Feature, _super);

  function _Feature() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Removes (deactivates) the feature
   *
   * @param force If true the feature deactivation will be forced
   */


  _Feature.prototype.deactivate = function (force) {
    if (force === void 0) {
      force = false;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var removeDependency, feature, promise;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            removeDependency = this.addBatchDependency();
            return [4
            /*yield*/
            , Feature(this).select("DefinitionId")()];

          case 1:
            feature = _a.sent();
            promise = this.getParent(Features, this.parentUrl, "", this.batch).remove(feature.DefinitionId, force);
            removeDependency();
            return [2
            /*return*/
            , promise];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("fe.deactivate")], _Feature.prototype, "deactivate", null);
  return _Feature;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Feature = _Feature;
var Feature = (0, _sharepointqueryable.spInvokableFactory)(_Feature);
exports.Feature = Feature;
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/features/site.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../sites/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Site, "features", _types2.Features);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../sites/types":"../node_modules/@pnp/sp/sites/types.js","./types":"../node_modules/@pnp/sp/features/types.js"}],"../node_modules/@pnp/sp/features/web.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../webs/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Web, "features", _types2.Features);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/features/types.js"}],"../node_modules/@pnp/sp/features/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Feature", {
  enumerable: true,
  get: function () {
    return _types.Feature;
  }
});
Object.defineProperty(exports, "Features", {
  enumerable: true,
  get: function () {
    return _types.Features;
  }
});

require("./site");

require("./web");

var _types = require("./types");
},{"./site":"../node_modules/@pnp/sp/features/site.js","./web":"../node_modules/@pnp/sp/features/web.js","./types":"../node_modules/@pnp/sp/features/types.js"}],"../node_modules/@pnp/sp/fields/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChoiceFieldFormatType = exports.FieldUserSelectionMode = exports.UrlFieldFormatType = exports.CalendarType = exports.AddFieldOptions = exports.DateTimeFieldFriendlyFormatType = exports.DateTimeFieldFormatType = exports.FieldTypes = exports.Field = exports._Field = exports.Fields = exports._Fields = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _common = require("@pnp/common");

var _metadata = require("../utils/metadata");

var _odata = require("@pnp/odata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _Fields =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Fields, _super);

  function _Fields() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a field from the collection by id
   *
   * @param id The Id of the list
   */


  _Fields.prototype.getById = function (id) {
    return _telemetry.tag.configure(Field(this).concat("('" + id + "')"), "fs.getById");
  };
  /**
   * Gets a field from the collection by title
   *
   * @param title The case-sensitive title of the field
   */


  _Fields.prototype.getByTitle = function (title) {
    return _telemetry.tag.configure(Field(this, "getByTitle('" + title + "')"), "fs.getByTitle");
  };
  /**
   * Gets a field from the collection by using internal name or title
   *
   * @param name The case-sensitive internal name or title of the field
   */


  _Fields.prototype.getByInternalNameOrTitle = function (name) {
    return _telemetry.tag.configure(Field(this, "getByInternalNameOrTitle('" + name + "')"), "fs.getByInternalNameOrTitle");
  };
  /**
   * Creates a field based on the specified schema
   *
   * @param xml A string or XmlSchemaFieldCreationInformation instance descrbing the field to create
   */


  _Fields.prototype.createFieldAsXml = function (xml) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (typeof xml === "string") {
              xml = {
                SchemaXml: xml
              };
            }

            postBody = (0, _odata.body)({
              "parameters": (0, _common.assign)((0, _metadata.metadata)("SP.XmlSchemaFieldCreationInformation"), xml)
            });
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Fields, "createfieldasxml"), postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              field: this.getById(data.Id)
            }];
        }
      });
    });
  };
  /**
   * Adds a new field to the collection
   *
   * @param title The new field's title
   * @param fieldType The new field's type (ex: SP.FieldText)
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */


  _Fields.prototype.add = function (title, fieldType, properties) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = (0, _odata.body)(Object.assign((0, _metadata.metadata)(fieldType), {
              "Title": title
            }, properties));

            if (!_telemetry.tag.isTagged(this)) {
              _telemetry.tag.configure(this, "fs.add");
            }

            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Fields, null), postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              field: this.getById(data.Id)
            }];
        }
      });
    });
  };
  /**
   * Adds a new SP.FieldText to the collection
   *
   * @param title The field title
   * @param maxLength The maximum number of characters allowed in the value of the field.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */


  _Fields.prototype.addText = function (title, maxLength, properties) {
    if (maxLength === void 0) {
      maxLength = 255;
    }

    var props = {
      FieldTypeKind: 2,
      MaxLength: maxLength
    };
    return this.add(title, "SP.FieldText", (0, _common.assign)(props, properties));
  };
  /**
   * Adds a new SP.FieldCalculated to the collection
   *
   * @param title The field title.
   * @param formula The formula for the field.
   * @param dateFormat The date and time format that is displayed in the field.
   * @param outputType Specifies the output format for the field. Represents a FieldType value.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */


  _Fields.prototype.addCalculated = function (title, formula, dateFormat, outputType, properties) {
    if (outputType === void 0) {
      outputType = FieldTypes.Text;
    }

    var props = {
      DateFormat: dateFormat,
      FieldTypeKind: 17,
      Formula: formula,
      OutputType: outputType
    };
    return this.add(title, "SP.FieldCalculated", (0, _common.assign)(props, properties));
  };
  /**
   * Adds a new SP.FieldDateTime to the collection
   *
   * @param title The field title
   * @param displayFormat The format of the date and time that is displayed in the field.
   * @param calendarType Specifies the calendar type of the field.
   * @param friendlyDisplayFormat The type of friendly display format that is used in the field.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */


  _Fields.prototype.addDateTime = function (title, displayFormat, calendarType, friendlyDisplayFormat, properties) {
    if (displayFormat === void 0) {
      displayFormat = DateTimeFieldFormatType.DateOnly;
    }

    if (calendarType === void 0) {
      calendarType = CalendarType.Gregorian;
    }

    if (friendlyDisplayFormat === void 0) {
      friendlyDisplayFormat = DateTimeFieldFriendlyFormatType.Unspecified;
    }

    var props = {
      DateTimeCalendarType: calendarType,
      DisplayFormat: displayFormat,
      FieldTypeKind: 4,
      FriendlyDisplayFormat: friendlyDisplayFormat
    };
    return this.add(title, "SP.FieldDateTime", (0, _common.assign)(props, properties));
  };
  /**
   * Adds a new SP.FieldNumber to the collection
   *
   * @param title The field title
   * @param minValue The field's minimum value
   * @param maxValue The field's maximum value
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */


  _Fields.prototype.addNumber = function (title, minValue, maxValue, properties) {
    var props = {
      FieldTypeKind: 9
    };

    if (minValue !== undefined) {
      props = (0, _common.assign)({
        MinimumValue: minValue
      }, props);
    }

    if (maxValue !== undefined) {
      props = (0, _common.assign)({
        MaximumValue: maxValue
      }, props);
    }

    return this.add(title, "SP.FieldNumber", (0, _common.assign)(props, properties));
  };
  /**
   * Adds a new SP.FieldCurrency to the collection
   *
   * @param title The field title
   * @param minValue The field's minimum value
   * @param maxValue The field's maximum value
   * @param currencyLocalId Specifies the language code identifier (LCID) used to format the value of the field
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */


  _Fields.prototype.addCurrency = function (title, minValue, maxValue, currencyLocalId, properties) {
    if (currencyLocalId === void 0) {
      currencyLocalId = 1033;
    }

    var props = {
      CurrencyLocaleId: currencyLocalId,
      FieldTypeKind: 10
    };

    if (minValue !== undefined) {
      props = (0, _common.assign)({
        MinimumValue: minValue
      }, props);
    }

    if (maxValue !== undefined) {
      props = (0, _common.assign)({
        MaximumValue: maxValue
      }, props);
    }

    return this.add(title, "SP.FieldCurrency", (0, _common.assign)(props, properties));
  };
  /**
   * Adds a new SP.FieldMultiLineText to the collection
   *
   * @param title The field title
   * @param numberOfLines Specifies the number of lines of text to display for the field.
   * @param richText Specifies whether the field supports rich formatting.
   * @param restrictedMode Specifies whether the field supports a subset of rich formatting.
   * @param appendOnly Specifies whether all changes to the value of the field are displayed in list forms.
   * @param allowHyperlink Specifies whether a hyperlink is allowed as a value of the field.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   *
   */


  _Fields.prototype.addMultilineText = function (title, numberOfLines, richText, restrictedMode, appendOnly, allowHyperlink, properties) {
    if (numberOfLines === void 0) {
      numberOfLines = 6;
    }

    if (richText === void 0) {
      richText = true;
    }

    if (restrictedMode === void 0) {
      restrictedMode = false;
    }

    if (appendOnly === void 0) {
      appendOnly = false;
    }

    if (allowHyperlink === void 0) {
      allowHyperlink = true;
    }

    var props = {
      AllowHyperlink: allowHyperlink,
      AppendOnly: appendOnly,
      FieldTypeKind: 3,
      NumberOfLines: numberOfLines,
      RestrictedMode: restrictedMode,
      RichText: richText
    };
    return this.add(title, "SP.FieldMultiLineText", (0, _common.assign)(props, properties));
  };
  /**
   * Adds a new SP.FieldUrl to the collection
   *
   * @param title The field title
   */


  _Fields.prototype.addUrl = function (title, displayFormat, properties) {
    if (displayFormat === void 0) {
      displayFormat = UrlFieldFormatType.Hyperlink;
    }

    var props = {
      DisplayFormat: displayFormat,
      FieldTypeKind: 11
    };
    return this.add(title, "SP.FieldUrl", (0, _common.assign)(props, properties));
  };
  /** Adds a user field to the colleciton
  *
  * @param title The new field's title
  * @param selectionMode The selection mode of the field
  * @param selectionGroup Value that specifies the identifier of the SharePoint group whose members can be selected as values of the field
  * @param properties
  */


  _Fields.prototype.addUser = function (title, selectionMode, properties) {
    var props = {
      FieldTypeKind: 20,
      SelectionMode: selectionMode
    };
    return this.add(title, "SP.FieldUser", (0, _common.assign)(props, properties));
  };
  /**
   * Adds a SP.FieldLookup to the collection
   *
   * @param title The new field's title
   * @param lookupListId The guid id of the list where the source of the lookup is found
   * @param lookupFieldName The internal name of the field in the source list
   * @param properties Set of additional properties to set on the new field
   */


  _Fields.prototype.addLookup = function (title, lookupListId, lookupFieldName, properties) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var props, postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            props = (0, _common.assign)({
              FieldTypeKind: 7,
              LookupFieldName: lookupFieldName,
              LookupListId: lookupListId,
              Title: title
            }, properties);
            postBody = (0, _odata.body)({
              "parameters": (0, _common.assign)((0, _metadata.metadata)("SP.FieldCreationInformation"), props)
            });
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Fields, "addfield"), postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              field: this.getById(data.Id)
            }];
        }
      });
    });
  };
  /**
   * Adds a new SP.FieldChoice to the collection
   *
   * @param title The field title.
   * @param choices The choices for the field.
   * @param format The display format of the available options for the field.
   * @param fillIn Specifies whether the field allows fill-in values.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */


  _Fields.prototype.addChoice = function (title, choices, format, fillIn, properties) {
    if (format === void 0) {
      format = ChoiceFieldFormatType.Dropdown;
    }

    var props = {
      Choices: {
        results: choices
      },
      EditFormat: format,
      FieldTypeKind: 6,
      FillInChoice: fillIn
    };
    return this.add(title, "SP.FieldChoice", (0, _common.assign)(props, properties));
  };
  /**
   * Adds a new SP.FieldMultiChoice to the collection
   *
   * @param title The field title.
   * @param choices The choices for the field.
   * @param fillIn Specifies whether the field allows fill-in values.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */


  _Fields.prototype.addMultiChoice = function (title, choices, fillIn, properties) {
    var props = {
      Choices: {
        results: choices
      },
      FieldTypeKind: 15,
      FillInChoice: fillIn
    };
    return this.add(title, "SP.FieldMultiChoice", (0, _common.assign)(props, properties));
  };
  /**
   * Adds a new SP.FieldBoolean to the collection
   *
   * @param title The field title.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */


  _Fields.prototype.addBoolean = function (title, properties) {
    var props = {
      FieldTypeKind: 8
    };
    return this.add(title, "SP.Field", (0, _common.assign)(props, properties));
  };
  /**
  * Creates a secondary (dependent) lookup field, based on the Id of the primary lookup field.
  *
  * @param displayName The display name of the new field.
  * @param primaryLookupFieldId The guid of the primary Lookup Field.
  * @param showField Which field to show from the lookup list.
  */


  _Fields.prototype.addDependentLookupField = function (displayName, primaryLookupFieldId, showField) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var path, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            path = "adddependentlookupfield(displayName='" + displayName + "', primarylookupfieldid='" + primaryLookupFieldId + "', showfield='" + showField + "')";
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Fields, path))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              field: this.getById(data.Id)
            }];
        }
      });
    });
  };
  /**
   * Adds a new SP.FieldLocation to the collection
   *
   * @param title The field title.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */


  _Fields.prototype.addLocation = function (title, properties) {
    var props = {
      FieldTypeKind: 33
    };
    return this.add(title, "SP.FieldLocation", (0, _common.assign)(props, properties));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.createFieldAsXml")], _Fields.prototype, "createFieldAsXml", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addText")], _Fields.prototype, "addText", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addCalculated")], _Fields.prototype, "addCalculated", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addDateTime")], _Fields.prototype, "addDateTime", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addNumber")], _Fields.prototype, "addNumber", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addCurrency")], _Fields.prototype, "addCurrency", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addMultilineText")], _Fields.prototype, "addMultilineText", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addUrl")], _Fields.prototype, "addUrl", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addUser")], _Fields.prototype, "addUser", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addLookup")], _Fields.prototype, "addLookup", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addChoice")], _Fields.prototype, "addChoice", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addMultiChoice")], _Fields.prototype, "addMultiChoice", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addBoolean")], _Fields.prototype, "addBoolean", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addDependentLookupField")], _Fields.prototype, "addDependentLookupField", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("fs.addLocation")], _Fields.prototype, "addLocation", null);
  _Fields = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("fields")], _Fields);
  return _Fields;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Fields = _Fields;
var Fields = (0, _sharepointqueryable.spInvokableFactory)(_Fields);
exports.Fields = Fields;

var _Field =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Field, _super);

  function _Field() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteable)("f");
    return _this;
  }
  /**
   * Updates this field instance with the supplied properties
   *
   * @param properties A plain object hash of values to update for the list
   * @param fieldType The type value such as SP.FieldLookup. Optional, looked up from the field if not provided
   */


  _Field.prototype.update = function (properties, fieldType) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var info, req, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(typeof fieldType === "undefined" || fieldType === null)) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this.select("FieldTypeKind")()];

          case 1:
            info = _a.sent();
            fieldType = "SP.Field" + FieldTypes[info.FieldTypeKind];
            _a.label = 2;

          case 2:
            req = (0, _odata.body)((0, _common.assign)((0, _metadata.metadata)(fieldType), properties), (0, _odata.headers)({
              "X-HTTP-Method": "MERGE"
            }));
            return [4
            /*yield*/
            , (0, _operations.spPost)(this, req)];

          case 3:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              field: this
            }];
        }
      });
    });
  };
  /**
   * Sets the value of the ShowInDisplayForm property for this field.
   */


  _Field.prototype.setShowInDisplayForm = function (show) {
    return (0, _operations.spPost)(this.clone(Field, "setshowindisplayform(" + show + ")"));
  };
  /**
   * Sets the value of the ShowInEditForm property for this field.
   */


  _Field.prototype.setShowInEditForm = function (show) {
    return (0, _operations.spPost)(this.clone(Field, "setshowineditform(" + show + ")"));
  };
  /**
   * Sets the value of the ShowInNewForm property for this field.
   */


  _Field.prototype.setShowInNewForm = function (show) {
    return (0, _operations.spPost)(this.clone(Field, "setshowinnewform(" + show + ")"));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("f.update")], _Field.prototype, "update", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("f.setShowInDisplayForm")], _Field.prototype, "setShowInDisplayForm", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("f.setShowInEditForm")], _Field.prototype, "setShowInEditForm", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("f.setShowInNewForm")], _Field.prototype, "setShowInNewForm", null);
  return _Field;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Field = _Field;
var Field = (0, _sharepointqueryable.spInvokableFactory)(_Field);
/**
 * Specifies the type of the field.
 */

exports.Field = Field;
var FieldTypes;
exports.FieldTypes = FieldTypes;

(function (FieldTypes) {
  FieldTypes[FieldTypes["Invalid"] = 0] = "Invalid";
  FieldTypes[FieldTypes["Integer"] = 1] = "Integer";
  FieldTypes[FieldTypes["Text"] = 2] = "Text";
  FieldTypes[FieldTypes["Note"] = 3] = "Note";
  FieldTypes[FieldTypes["DateTime"] = 4] = "DateTime";
  FieldTypes[FieldTypes["Counter"] = 5] = "Counter";
  FieldTypes[FieldTypes["Choice"] = 6] = "Choice";
  FieldTypes[FieldTypes["Lookup"] = 7] = "Lookup";
  FieldTypes[FieldTypes["Boolean"] = 8] = "Boolean";
  FieldTypes[FieldTypes["Number"] = 9] = "Number";
  FieldTypes[FieldTypes["Currency"] = 10] = "Currency";
  FieldTypes[FieldTypes["URL"] = 11] = "URL";
  FieldTypes[FieldTypes["Computed"] = 12] = "Computed";
  FieldTypes[FieldTypes["Threading"] = 13] = "Threading";
  FieldTypes[FieldTypes["Guid"] = 14] = "Guid";
  FieldTypes[FieldTypes["MultiChoice"] = 15] = "MultiChoice";
  FieldTypes[FieldTypes["GridChoice"] = 16] = "GridChoice";
  FieldTypes[FieldTypes["Calculated"] = 17] = "Calculated";
  FieldTypes[FieldTypes["File"] = 18] = "File";
  FieldTypes[FieldTypes["Attachments"] = 19] = "Attachments";
  FieldTypes[FieldTypes["User"] = 20] = "User";
  FieldTypes[FieldTypes["Recurrence"] = 21] = "Recurrence";
  FieldTypes[FieldTypes["CrossProjectLink"] = 22] = "CrossProjectLink";
  FieldTypes[FieldTypes["ModStat"] = 23] = "ModStat";
  FieldTypes[FieldTypes["Error"] = 24] = "Error";
  FieldTypes[FieldTypes["ContentTypeId"] = 25] = "ContentTypeId";
  FieldTypes[FieldTypes["PageSeparator"] = 26] = "PageSeparator";
  FieldTypes[FieldTypes["ThreadIndex"] = 27] = "ThreadIndex";
  FieldTypes[FieldTypes["WorkflowStatus"] = 28] = "WorkflowStatus";
  FieldTypes[FieldTypes["AllDayEvent"] = 29] = "AllDayEvent";
  FieldTypes[FieldTypes["WorkflowEventType"] = 30] = "WorkflowEventType";
})(FieldTypes || (exports.FieldTypes = FieldTypes = {}));

var DateTimeFieldFormatType;
exports.DateTimeFieldFormatType = DateTimeFieldFormatType;

(function (DateTimeFieldFormatType) {
  DateTimeFieldFormatType[DateTimeFieldFormatType["DateOnly"] = 0] = "DateOnly";
  DateTimeFieldFormatType[DateTimeFieldFormatType["DateTime"] = 1] = "DateTime";
})(DateTimeFieldFormatType || (exports.DateTimeFieldFormatType = DateTimeFieldFormatType = {}));

var DateTimeFieldFriendlyFormatType;
exports.DateTimeFieldFriendlyFormatType = DateTimeFieldFriendlyFormatType;

(function (DateTimeFieldFriendlyFormatType) {
  DateTimeFieldFriendlyFormatType[DateTimeFieldFriendlyFormatType["Unspecified"] = 0] = "Unspecified";
  DateTimeFieldFriendlyFormatType[DateTimeFieldFriendlyFormatType["Disabled"] = 1] = "Disabled";
  DateTimeFieldFriendlyFormatType[DateTimeFieldFriendlyFormatType["Relative"] = 2] = "Relative";
})(DateTimeFieldFriendlyFormatType || (exports.DateTimeFieldFriendlyFormatType = DateTimeFieldFriendlyFormatType = {}));
/**
 * Specifies the control settings while adding a field.
 */


var AddFieldOptions;
exports.AddFieldOptions = AddFieldOptions;

(function (AddFieldOptions) {
  /**
   *  Specify that a new field added to the list must also be added to the default content type in the site collection
   */
  AddFieldOptions[AddFieldOptions["DefaultValue"] = 0] = "DefaultValue";
  /**
   * Specify that a new field added to the list must also be added to the default content type in the site collection.
   */

  AddFieldOptions[AddFieldOptions["AddToDefaultContentType"] = 1] = "AddToDefaultContentType";
  /**
   * Specify that a new field must not be added to any other content type
   */

  AddFieldOptions[AddFieldOptions["AddToNoContentType"] = 2] = "AddToNoContentType";
  /**
   *  Specify that a new field that is added to the specified list must also be added to all content types in the site collection
   */

  AddFieldOptions[AddFieldOptions["AddToAllContentTypes"] = 4] = "AddToAllContentTypes";
  /**
   * Specify adding an internal field name hint for the purpose of avoiding possible database locking or field renaming operations
   */

  AddFieldOptions[AddFieldOptions["AddFieldInternalNameHint"] = 8] = "AddFieldInternalNameHint";
  /**
   * Specify that a new field that is added to the specified list must also be added to the default list view
   */

  AddFieldOptions[AddFieldOptions["AddFieldToDefaultView"] = 16] = "AddFieldToDefaultView";
  /**
   * Specify to confirm that no other field has the same display name
   */

  AddFieldOptions[AddFieldOptions["AddFieldCheckDisplayName"] = 32] = "AddFieldCheckDisplayName";
})(AddFieldOptions || (exports.AddFieldOptions = AddFieldOptions = {}));

var CalendarType;
exports.CalendarType = CalendarType;

(function (CalendarType) {
  CalendarType[CalendarType["Gregorian"] = 1] = "Gregorian";
  CalendarType[CalendarType["Japan"] = 3] = "Japan";
  CalendarType[CalendarType["Taiwan"] = 4] = "Taiwan";
  CalendarType[CalendarType["Korea"] = 5] = "Korea";
  CalendarType[CalendarType["Hijri"] = 6] = "Hijri";
  CalendarType[CalendarType["Thai"] = 7] = "Thai";
  CalendarType[CalendarType["Hebrew"] = 8] = "Hebrew";
  CalendarType[CalendarType["GregorianMEFrench"] = 9] = "GregorianMEFrench";
  CalendarType[CalendarType["GregorianArabic"] = 10] = "GregorianArabic";
  CalendarType[CalendarType["GregorianXLITEnglish"] = 11] = "GregorianXLITEnglish";
  CalendarType[CalendarType["GregorianXLITFrench"] = 12] = "GregorianXLITFrench";
  CalendarType[CalendarType["KoreaJapanLunar"] = 14] = "KoreaJapanLunar";
  CalendarType[CalendarType["ChineseLunar"] = 15] = "ChineseLunar";
  CalendarType[CalendarType["SakaEra"] = 16] = "SakaEra";
  CalendarType[CalendarType["UmAlQura"] = 23] = "UmAlQura";
})(CalendarType || (exports.CalendarType = CalendarType = {}));

var UrlFieldFormatType;
exports.UrlFieldFormatType = UrlFieldFormatType;

(function (UrlFieldFormatType) {
  UrlFieldFormatType[UrlFieldFormatType["Hyperlink"] = 0] = "Hyperlink";
  UrlFieldFormatType[UrlFieldFormatType["Image"] = 1] = "Image";
})(UrlFieldFormatType || (exports.UrlFieldFormatType = UrlFieldFormatType = {}));

var FieldUserSelectionMode;
exports.FieldUserSelectionMode = FieldUserSelectionMode;

(function (FieldUserSelectionMode) {
  FieldUserSelectionMode[FieldUserSelectionMode["PeopleAndGroups"] = 1] = "PeopleAndGroups";
  FieldUserSelectionMode[FieldUserSelectionMode["PeopleOnly"] = 0] = "PeopleOnly";
})(FieldUserSelectionMode || (exports.FieldUserSelectionMode = FieldUserSelectionMode = {}));

var ChoiceFieldFormatType;
exports.ChoiceFieldFormatType = ChoiceFieldFormatType;

(function (ChoiceFieldFormatType) {
  ChoiceFieldFormatType[ChoiceFieldFormatType["Dropdown"] = 0] = "Dropdown";
  ChoiceFieldFormatType[ChoiceFieldFormatType["RadioButtons"] = 1] = "RadioButtons";
})(ChoiceFieldFormatType || (exports.ChoiceFieldFormatType = ChoiceFieldFormatType = {}));
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/common":"../node_modules/@pnp/common/index.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/fields/web.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../webs/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Web, "fields", _types2.Fields);
(0, _odata.addProp)(_types._Web, "availablefields", _types2.Fields, "availablefields");
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/fields/types.js"}],"../node_modules/@pnp/sp/fields/list.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../lists/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._List, "fields", _types2.Fields);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","./types":"../node_modules/@pnp/sp/fields/types.js"}],"../node_modules/@pnp/sp/fields/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Fields", {
  enumerable: true,
  get: function () {
    return _types.Fields;
  }
});
Object.defineProperty(exports, "Field", {
  enumerable: true,
  get: function () {
    return _types.Field;
  }
});
Object.defineProperty(exports, "AddFieldOptions", {
  enumerable: true,
  get: function () {
    return _types.AddFieldOptions;
  }
});
Object.defineProperty(exports, "CalendarType", {
  enumerable: true,
  get: function () {
    return _types.CalendarType;
  }
});
Object.defineProperty(exports, "ChoiceFieldFormatType", {
  enumerable: true,
  get: function () {
    return _types.ChoiceFieldFormatType;
  }
});
Object.defineProperty(exports, "DateTimeFieldFormatType", {
  enumerable: true,
  get: function () {
    return _types.DateTimeFieldFormatType;
  }
});
Object.defineProperty(exports, "DateTimeFieldFriendlyFormatType", {
  enumerable: true,
  get: function () {
    return _types.DateTimeFieldFriendlyFormatType;
  }
});
Object.defineProperty(exports, "FieldTypes", {
  enumerable: true,
  get: function () {
    return _types.FieldTypes;
  }
});
Object.defineProperty(exports, "FieldUserSelectionMode", {
  enumerable: true,
  get: function () {
    return _types.FieldUserSelectionMode;
  }
});
Object.defineProperty(exports, "UrlFieldFormatType", {
  enumerable: true,
  get: function () {
    return _types.UrlFieldFormatType;
  }
});

require("./web");

require("./list");

var _types = require("./types");
},{"./web":"../node_modules/@pnp/sp/fields/web.js","./list":"../node_modules/@pnp/sp/fields/list.js","./types":"../node_modules/@pnp/sp/fields/types.js"}],"../node_modules/@pnp/sp/files/folder.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../folders/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Folder, "files", _types2.Files);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../folders/types":"../node_modules/@pnp/sp/folders/types.js","./types":"../node_modules/@pnp/sp/files/types.js"}],"../node_modules/@pnp/sp/files/item.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../items/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Item, "file", _types2.File, "file");
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../items/types":"../node_modules/@pnp/sp/items/types.js","./types":"../node_modules/@pnp/sp/files/types.js"}],"../node_modules/@pnp/sp/files/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "File", {
  enumerable: true,
  get: function () {
    return _types.File;
  }
});
Object.defineProperty(exports, "Files", {
  enumerable: true,
  get: function () {
    return _types.Files;
  }
});
Object.defineProperty(exports, "CheckinType", {
  enumerable: true,
  get: function () {
    return _types.CheckinType;
  }
});
Object.defineProperty(exports, "MoveOperations", {
  enumerable: true,
  get: function () {
    return _types.MoveOperations;
  }
});
Object.defineProperty(exports, "TemplateFileType", {
  enumerable: true,
  get: function () {
    return _types.TemplateFileType;
  }
});
Object.defineProperty(exports, "Version", {
  enumerable: true,
  get: function () {
    return _types.Version;
  }
});
Object.defineProperty(exports, "Versions", {
  enumerable: true,
  get: function () {
    return _types.Versions;
  }
});

require("./folder");

require("./item");

require("./web");

var _types = require("./types");
},{"./folder":"../node_modules/@pnp/sp/files/folder.js","./item":"../node_modules/@pnp/sp/files/item.js","./web":"../node_modules/@pnp/sp/files/web.js","./types":"../node_modules/@pnp/sp/files/types.js"}],"../node_modules/@pnp/sp/folders/item.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../items/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Item, "folder", _types2.Folder, "folder");
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../items/types":"../node_modules/@pnp/sp/items/types.js","./types":"../node_modules/@pnp/sp/folders/types.js"}],"../node_modules/@pnp/sp/folders/list.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../lists/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._List, "rootFolder", _types2.Folder, "rootFolder");
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","./types":"../node_modules/@pnp/sp/folders/types.js"}],"../node_modules/@pnp/sp/folders/web.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../webs/types");

var _types2 = require("./types");

var _escapeQueryStrValue = require("../utils/escapeQueryStrValue");

(0, _odata.addProp)(_types._Web, "folders", _types2.Folders);
(0, _odata.addProp)(_types._Web, "rootFolder", _types2.Folder, "rootFolder");

_types._Web.prototype.getFolderByServerRelativeUrl = function (folderRelativeUrl) {
  return (0, _types2.Folder)(this, "getFolderByServerRelativeUrl('" + (0, _escapeQueryStrValue.escapeQueryStrValue)(folderRelativeUrl) + "')");
};

_types._Web.prototype.getFolderByServerRelativePath = function (folderRelativeUrl) {
  return (0, _types2.Folder)(this, "getFolderByServerRelativePath(decodedUrl='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(folderRelativeUrl) + "')");
};

_types._Web.prototype.getFolderById = function (uniqueId) {
  return (0, _types2.Folder)(this, "getFolderById('" + uniqueId + "')");
};
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/folders/types.js","../utils/escapeQueryStrValue":"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js"}],"../node_modules/@pnp/sp/folders/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Folder", {
  enumerable: true,
  get: function () {
    return _types.Folder;
  }
});
Object.defineProperty(exports, "Folders", {
  enumerable: true,
  get: function () {
    return _types.Folders;
  }
});

require("./item");

require("./list");

require("./web");

var _types = require("./types");
},{"./item":"../node_modules/@pnp/sp/folders/item.js","./list":"../node_modules/@pnp/sp/folders/list.js","./web":"../node_modules/@pnp/sp/folders/web.js","./types":"../node_modules/@pnp/sp/folders/types.js"}],"../node_modules/@pnp/sp/forms/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = exports._Form = exports.Forms = exports._Forms = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _decorators = require("../decorators");

var _telemetry = require("../telemetry");

/**
 * Describes a collection of Form objects
 *
 */
var _Forms =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Forms, _super);

  function _Forms() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a form by id
   *
   * @param id The guid id of the item to retrieve
   */


  _Forms.prototype.getById = function (id) {
    return _telemetry.tag.configure(Form(this).concat("('" + id + "')"), "fos.getById");
  };

  _Forms = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("forms")], _Forms);
  return _Forms;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Forms = _Forms;
var Forms = (0, _sharepointqueryable.spInvokableFactory)(_Forms);
/**
 * Describes a single of Form instance
 *
 */

exports.Forms = Forms;

var _Form =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Form, _super);

  function _Form() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return _Form;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Form = _Form;
var Form = (0, _sharepointqueryable.spInvokableFactory)(_Form);
exports.Form = Form;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/forms/list.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../lists/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._List, "forms", _types2.Forms, "forms");
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","./types":"../node_modules/@pnp/sp/forms/types.js"}],"../node_modules/@pnp/sp/forms/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Form", {
  enumerable: true,
  get: function () {
    return _types.Form;
  }
});
Object.defineProperty(exports, "Forms", {
  enumerable: true,
  get: function () {
    return _types.Forms;
  }
});

require("./list");

var _types = require("./types");
},{"./list":"../node_modules/@pnp/sp/forms/list.js","./types":"../node_modules/@pnp/sp/forms/types.js"}],"../node_modules/@pnp/sp/hubsites/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HubSite = exports._HubSite = exports.HubSites = exports._HubSites = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _decorators = require("../decorators");

var _types = require("../sites/types");

var _telemetry = require("../telemetry");

var _HubSites =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_HubSites, _super);

  function _HubSites() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a Hub Site from the collection by id
   *
   * @param id The Id of the Hub Site
   */


  _HubSites.prototype.getById = function (id) {
    return _telemetry.tag.configure(HubSite(this, "GetById?hubSiteId='" + id + "'"), "hss.getById");
  };

  _HubSites = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("_api/hubsites")], _HubSites);
  return _HubSites;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._HubSites = _HubSites;
var HubSites = (0, _sharepointqueryable.spInvokableFactory)(_HubSites);
exports.HubSites = HubSites;

var _HubSite =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_HubSite, _super);

  function _HubSite() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets the ISite instance associated with this hubsite
   */


  _HubSite.prototype.getSite = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var d;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.select("SiteUrl")()];

          case 1:
            d = _a.sent();
            return [2
            /*return*/
            , (0, _types.Site)(d.SiteUrl)];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("hs.getSite")], _HubSite.prototype, "getSite", null);
  return _HubSite;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._HubSite = _HubSite;
var HubSite = (0, _sharepointqueryable.spInvokableFactory)(_HubSite);
exports.HubSite = HubSite;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../sites/types":"../node_modules/@pnp/sp/sites/types.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/hubsites/site.js":[function(require,module,exports) {
"use strict";

var _tslib = require("tslib");

var _types = require("../sites/types");

var _operations = require("../operations");

_types._Site.prototype.joinHubSite = function (siteId) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , (0, _operations.spPost)(this.clone(_types.Site, "joinHubSite('" + siteId + "')"))];

        case 1:
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
};

_types._Site.prototype.registerHubSite = function () {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , (0, _operations.spPost)(this.clone(_types.Site, "registerHubSite"))];

        case 1:
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
};

_types._Site.prototype.unRegisterHubSite = function () {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , (0, _operations.spPost)(this.clone(_types.Site, "unRegisterHubSite"))];

        case 1:
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sites/types":"../node_modules/@pnp/sp/sites/types.js","../operations":"../node_modules/@pnp/sp/operations.js"}],"../node_modules/@pnp/sp/hubsites/web.js":[function(require,module,exports) {
"use strict";

var _tslib = require("tslib");

var _types = require("../webs/types");

var _operations = require("../operations");

_types._Web.prototype.hubSiteData = function (forceRefresh) {
  if (forceRefresh === void 0) {
    forceRefresh = false;
  }

  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var data;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , this.clone(_types.Web, "hubSiteData(" + forceRefresh + ")")()];

        case 1:
          data = _a.sent();

          if (typeof data === "string") {
            return [2
            /*return*/
            , JSON.parse(data)];
          }

          return [2
          /*return*/
          , data];
      }
    });
  });
};

_types._Web.prototype.syncHubSiteTheme = function () {
  return (0, _operations.spPost)(this.clone(_types.Web, "syncHubSiteTheme"));
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","../operations":"../node_modules/@pnp/sp/operations.js"}],"../node_modules/@pnp/sp/hubsites/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "HubSite", {
  enumerable: true,
  get: function () {
    return _types.HubSite;
  }
});
Object.defineProperty(exports, "HubSites", {
  enumerable: true,
  get: function () {
    return _types.HubSites;
  }
});

var _rest = require("../rest");

var _types = require("./types");

require("./site");

require("./web");

Reflect.defineProperty(_rest.SPRest.prototype, "hubSites", {
  configurable: true,
  enumerable: true,
  get: function () {
    return (0, _types.HubSites)(this._baseUrl).configure(this._options);
  }
});
},{"../rest":"../node_modules/@pnp/sp/rest.js","./types":"../node_modules/@pnp/sp/hubsites/types.js","./site":"../node_modules/@pnp/sp/hubsites/site.js","./web":"../node_modules/@pnp/sp/hubsites/web.js"}],"../node_modules/@pnp/sp/navigation/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavigationService = exports._NavigationService = exports.Navigation = exports._Navigation = exports.NavigationNode = exports._NavigationNode = exports.NavigationNodes = exports._NavigationNodes = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _common = require("@pnp/common");

var _metadata = require("../utils/metadata");

var _odata = require("@pnp/odata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

/**
 * Represents a collection of navigation nodes
 *
 */
var _NavigationNodes =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_NavigationNodes, _super);

  function _NavigationNodes() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a navigation node by id
   *
   * @param id The id of the node
   */


  _NavigationNodes.prototype.getById = function (id) {
    return _telemetry.tag.configure(NavigationNode(this).concat("(" + id + ")"), "nns.getById");
  };
  /**
   * Adds a new node to the collection
   *
   * @param title Display name of the node
   * @param url The url of the node
   * @param visible If true the node is visible, otherwise it is hidden (default: true)
   */


  _NavigationNodes.prototype.add = function (title, url, visible) {
    if (visible === void 0) {
      visible = true;
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = (0, _odata.body)((0, _common.assign)((0, _metadata.metadata)("SP.NavigationNode"), {
              IsVisible: visible,
              Title: title,
              Url: url
            }));
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(NavigationNodes, null), postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              node: this.getById(data.Id)
            }];
        }
      });
    });
  };
  /**
   * Moves a node to be after another node in the navigation
   *
   * @param nodeId Id of the node to move
   * @param previousNodeId Id of the node after which we move the node specified by nodeId
   */


  _NavigationNodes.prototype.moveAfter = function (nodeId, previousNodeId) {
    var postBody = (0, _odata.body)({
      nodeId: nodeId,
      previousNodeId: previousNodeId
    });
    return (0, _operations.spPost)(this.clone(NavigationNodes, "MoveAfter"), postBody);
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("nns.add")], _NavigationNodes.prototype, "add", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("nns.moveAfter")], _NavigationNodes.prototype, "moveAfter", null);
  return _NavigationNodes;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._NavigationNodes = _NavigationNodes;
var NavigationNodes = (0, _sharepointqueryable.spInvokableFactory)(_NavigationNodes);
/**
 * Represents an instance of a navigation node
 *
 */

exports.NavigationNodes = NavigationNodes;

var _NavigationNode =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_NavigationNode, _super);

  function _NavigationNode() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteable)("nn");
    return _this;
  }

  Object.defineProperty(_NavigationNode.prototype, "children", {
    /**
     * Represents the child nodes of this node
     */
    get: function () {
      return _telemetry.tag.configure(NavigationNodes(this, "children"), "nn.children");
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Updates this node
   *
   * @param properties Properties used to update this node
   */

  _NavigationNode.prototype.update = function (properties) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = (0, _odata.body)((0, _common.assign)((0, _metadata.metadata)("SP.NavigationNode"), properties), (0, _odata.headers)({
              "X-HTTP-Method": "MERGE"
            }));
            return [4
            /*yield*/
            , (0, _operations.spPost)(this, postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              node: this
            }];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("nn.update")], _NavigationNode.prototype, "update", null);
  return _NavigationNode;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._NavigationNode = _NavigationNode;
var NavigationNode = (0, _sharepointqueryable.spInvokableFactory)(_NavigationNode);
/**
 * Exposes the navigation components
 *
 */

exports.NavigationNode = NavigationNode;

var _Navigation =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Navigation, _super);

  function _Navigation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_Navigation.prototype, "quicklaunch", {
    /**
     * Gets the quicklaunch navigation nodes for the current context
     *
     */
    get: function () {
      return _telemetry.tag.configure(NavigationNodes(this, "quicklaunch"), "n.quicklaunch");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Navigation.prototype, "topNavigationBar", {
    /**
     * Gets the top bar navigation nodes for the current context
     *
     */
    get: function () {
      return _telemetry.tag.configure(NavigationNodes(this, "topnavigationbar"), "n.topnavigationbar");
    },
    enumerable: false,
    configurable: true
  });
  _Navigation = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("navigation")], _Navigation);
  return _Navigation;
}(_sharepointqueryable._SharePointQueryable);

exports._Navigation = _Navigation;
var Navigation = (0, _sharepointqueryable.spInvokableFactory)(_Navigation);
/**
 * Represents the top level navigation service
 */

exports.Navigation = Navigation;

var _NavigationService =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_NavigationService, _super);

  function _NavigationService(path) {
    if (path === void 0) {
      path = null;
    }

    return _super.call(this, "_api/navigation", path) || this;
  }
  /**
   * The MenuState service operation returns a Menu-State (dump) of a SiteMapProvider on a site.
   *
   * @param menuNodeKey MenuNode.Key of the start node within the SiteMapProvider If no key is provided the SiteMapProvider.RootNode will be the root of the menu state.
   * @param depth Depth of the dump. If no value is provided a dump with the depth of 10 is returned
   * @param mapProviderName The name identifying the SiteMapProvider to be used
   * @param customProperties comma seperated list of custom properties to be returned.
   */


  _NavigationService.prototype.getMenuState = function (menuNodeKey, depth, mapProviderName, customProperties) {
    if (menuNodeKey === void 0) {
      menuNodeKey = null;
    }

    if (depth === void 0) {
      depth = 10;
    }

    if (mapProviderName === void 0) {
      mapProviderName = null;
    }

    if (customProperties === void 0) {
      customProperties = null;
    }

    return (0, _operations.spPost)(NavigationService("MenuState"), (0, _odata.body)({
      customProperties: customProperties,
      depth: depth,
      mapProviderName: mapProviderName,
      menuNodeKey: menuNodeKey
    }));
  };
  /**
   * Tries to get a SiteMapNode.Key for a given URL within a site collection.
   *
   * @param currentUrl A url representing the SiteMapNode
   * @param mapProviderName The name identifying the SiteMapProvider to be used
   */


  _NavigationService.prototype.getMenuNodeKey = function (currentUrl, mapProviderName) {
    if (mapProviderName === void 0) {
      mapProviderName = null;
    }

    return (0, _operations.spPost)(NavigationService("MenuNodeKey"), (0, _odata.body)({
      currentUrl: currentUrl,
      mapProviderName: mapProviderName
    }));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("ns.getMenuState")], _NavigationService.prototype, "getMenuState", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ns.getMenuNodeKey")], _NavigationService.prototype, "getMenuNodeKey", null);
  return _NavigationService;
}(_sharepointqueryable._SharePointQueryable);

exports._NavigationService = _NavigationService;

var NavigationService = function (path) {
  return new _NavigationService(path);
};

exports.NavigationService = NavigationService;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/common":"../node_modules/@pnp/common/index.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/navigation/web.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../webs/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Web, "navigation", _types2.Navigation);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/navigation/types.js"}],"../node_modules/@pnp/sp/navigation/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Navigation", {
  enumerable: true,
  get: function () {
    return _types.Navigation;
  }
});
Object.defineProperty(exports, "NavigationNode", {
  enumerable: true,
  get: function () {
    return _types.NavigationNode;
  }
});
Object.defineProperty(exports, "NavigationNodes", {
  enumerable: true,
  get: function () {
    return _types.NavigationNodes;
  }
});
Object.defineProperty(exports, "NavigationService", {
  enumerable: true,
  get: function () {
    return _types.NavigationService;
  }
});

var _rest = require("../rest");

var _types = require("./types");

require("./web");

Reflect.defineProperty(_rest.SPRest.prototype, "navigation", {
  configurable: true,
  enumerable: true,
  get: function () {
    return (0, _types.NavigationService)().configure(this._options);
  }
});
},{"../rest":"../node_modules/@pnp/sp/rest.js","./types":"../node_modules/@pnp/sp/navigation/types.js","./web":"../node_modules/@pnp/sp/navigation/web.js"}],"../node_modules/@pnp/sp/profiles/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UrlZone = exports.Profiles = exports._Profiles = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _common = require("@pnp/common");

var _metadata = require("../utils/metadata");

var _odata = require("@pnp/odata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _Profiles =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Profiles, _super);
  /**
   * Creates a new instance of the UserProfileQuery class
   *
   * @param baseUrl The url or SharePointQueryable which forms the parent of this user profile query
   */

  function _Profiles(baseUrl, path) {
    if (path === void 0) {
      path = "_api/sp.userprofiles.peoplemanager";
    }

    var _this = _super.call(this, baseUrl, path) || this;

    _this.clientPeoplePickerQuery = new ClientPeoplePickerQuery(baseUrl).configureFrom(_this);
    _this.profileLoader = new ProfileLoader(baseUrl).configureFrom(_this);
    return _this;
  }

  Object.defineProperty(_Profiles.prototype, "editProfileLink", {
    /**
     * The url of the edit profile page for the current user
     */
    get: function () {
      return this.clone(Profiles, "EditProfileLink").get();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Profiles.prototype, "isMyPeopleListPublic", {
    /**
     * A boolean value that indicates whether the current user's "People I'm Following" list is public
     */
    get: function () {
      return this.clone(Profiles, "IsMyPeopleListPublic").get();
    },
    enumerable: false,
    configurable: true
  });
  /**
   * A boolean value that indicates whether the current user is being followed by the specified user
   *
   * @param loginName The account name of the user
   */

  _Profiles.prototype.amIFollowedBy = function (loginName) {
    var q = this.clone(Profiles, "amifollowedby(@v)");
    q.query.set("@v", "'" + encodeURIComponent(loginName) + "'");
    return q.get();
  };
  /**
   * A boolean value that indicates whether the current user is following the specified user
   *
   * @param loginName The account name of the user
   */


  _Profiles.prototype.amIFollowing = function (loginName) {
    var q = this.clone(Profiles, "amifollowing(@v)");
    q.query.set("@v", "'" + encodeURIComponent(loginName) + "'");
    return q.get();
  };
  /**
   * Gets tags that the current user is following
   *
   * @param maxCount The maximum number of tags to retrieve (default is 20)
   */


  _Profiles.prototype.getFollowedTags = function (maxCount) {
    if (maxCount === void 0) {
      maxCount = 20;
    }

    return this.clone(Profiles, "getfollowedtags(" + maxCount + ")").get();
  };
  /**
   * Gets the people who are following the specified user
   *
   * @param loginName The account name of the user
   */


  _Profiles.prototype.getFollowersFor = function (loginName) {
    var q = this.clone(Profiles, "getfollowersfor(@v)");
    q.query.set("@v", "'" + encodeURIComponent(loginName) + "'");
    return q.get();
  };

  Object.defineProperty(_Profiles.prototype, "myFollowers", {
    /**
     * Gets the people who are following the current user
     *
     */
    get: function () {
      return (0, _sharepointqueryable.SharePointQueryableCollection)(this, "getmyfollowers");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Profiles.prototype, "myProperties", {
    /**
     * Gets user properties for the current user
     *
     */
    get: function () {
      return new _Profiles(this, "getmyproperties");
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Gets the people who the specified user is following
   *
   * @param loginName The account name of the user.
   */

  _Profiles.prototype.getPeopleFollowedBy = function (loginName) {
    var q = this.clone(Profiles, "getpeoplefollowedby(@v)");
    q.query.set("@v", "'" + encodeURIComponent(loginName) + "'");
    return q.get();
  };
  /**
   * Gets user properties for the specified user.
   *
   * @param loginName The account name of the user.
   */


  _Profiles.prototype.getPropertiesFor = function (loginName) {
    var q = this.clone(Profiles, "getpropertiesfor(@v)");
    q.query.set("@v", "'" + encodeURIComponent(loginName) + "'");
    return q.get();
  };

  Object.defineProperty(_Profiles.prototype, "trendingTags", {
    /**
     * Gets the 20 most popular hash tags over the past week, sorted so that the most popular tag appears first
     *
     */
    get: function () {
      var q = this.clone(Profiles, null);
      q.concat(".gettrendingtags");
      return q.get();
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Gets the specified user profile property for the specified user
   *
   * @param loginName The account name of the user
   * @param propertyName The case-sensitive name of the property to get
   */

  _Profiles.prototype.getUserProfilePropertyFor = function (loginName, propertyName) {
    var q = this.clone(Profiles, "getuserprofilepropertyfor(accountname=@v, propertyname='" + propertyName + "')");
    q.query.set("@v", "'" + encodeURIComponent(loginName) + "'");
    return q.get();
  };
  /**
   * Removes the specified user from the user's list of suggested people to follow
   *
   * @param loginName The account name of the user
   */


  _Profiles.prototype.hideSuggestion = function (loginName) {
    var q = this.clone(Profiles, "hidesuggestion(@v)");
    q.query.set("@v", "'" + encodeURIComponent(loginName) + "'");
    return (0, _operations.spPost)(q);
  };
  /**
   * A boolean values that indicates whether the first user is following the second user
   *
   * @param follower The account name of the user who might be following the followee
   * @param followee The account name of the user who might be followed by the follower
   */


  _Profiles.prototype.isFollowing = function (follower, followee) {
    var q = this.clone(Profiles, null);
    q.concat(".isfollowing(possiblefolloweraccountname=@v, possiblefolloweeaccountname=@y)");
    q.query.set("@v", "'" + encodeURIComponent(follower) + "'");
    q.query.set("@y", "'" + encodeURIComponent(followee) + "'");
    return q.get();
  };
  /**
   * Uploads and sets the user profile picture (Users can upload a picture to their own profile only). Not supported for batching.
   *
   * @param profilePicSource Blob data representing the user's picture in BMP, JPEG, or PNG format of up to 4.76MB
   */


  _Profiles.prototype.setMyProfilePic = function (profilePicSource) {
    var buffer = null;
    var reader = new FileReader();

    reader.onload = function (e) {
      return buffer = e.target.result;
    };

    reader.readAsArrayBuffer(profilePicSource);
    var request = new _Profiles(this, "setmyprofilepicture");
    return (0, _operations.spPost)(request, (0, _odata.body)(String.fromCharCode.apply(null, new Uint16Array(buffer))));
  };
  /**
   * Sets single value User Profile property
   *
   * @param accountName The account name of the user
   * @param propertyName Property name
   * @param propertyValue Property value
   */


  _Profiles.prototype.setSingleValueProfileProperty = function (accountName, propertyName, propertyValue) {
    return (0, _operations.spPost)(this.clone(Profiles, "SetSingleValueProfileProperty"), (0, _odata.body)({
      accountName: accountName,
      propertyName: propertyName,
      propertyValue: propertyValue
    }));
  };
  /**
   * Sets multi valued User Profile property
   *
   * @param accountName The account name of the user
   * @param propertyName Property name
   * @param propertyValues Property values
   */


  _Profiles.prototype.setMultiValuedProfileProperty = function (accountName, propertyName, propertyValues) {
    return (0, _operations.spPost)(this.clone(Profiles, "SetMultiValuedProfileProperty"), (0, _odata.body)({
      accountName: accountName,
      propertyName: propertyName,
      propertyValues: propertyValues
    }));
  };
  /**
   * Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only)
   *
   * @param emails The email addresses of the users to provision sites for
   */


  _Profiles.prototype.createPersonalSiteEnqueueBulk = function () {
    var emails = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      emails[_i] = arguments[_i];
    }

    return this.profileLoader.createPersonalSiteEnqueueBulk(emails);
  };

  Object.defineProperty(_Profiles.prototype, "ownerUserProfile", {
    /**
     * Gets the user profile of the site owner
     *
     */
    get: function () {
      return this.profileLoader.ownerUserProfile;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Profiles.prototype, "userProfile", {
    /**
     * Gets the user profile for the current user
     */
    get: function () {
      return this.profileLoader.userProfile;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Enqueues creating a personal site for this user, which can be used to share documents, web pages, and other files
   *
   * @param interactiveRequest true if interactively (web) initiated request, or false (default) if non-interactively (client) initiated request
   */

  _Profiles.prototype.createPersonalSite = function (interactiveRequest) {
    if (interactiveRequest === void 0) {
      interactiveRequest = false;
    }

    return this.profileLoader.createPersonalSite(interactiveRequest);
  };
  /**
   * Sets the privacy settings for this profile
   *
   * @param share true to make all social data public; false to make all social data private
   */


  _Profiles.prototype.shareAllSocialData = function (share) {
    return this.profileLoader.shareAllSocialData(share);
  };
  /**
   * Resolves user or group using specified query parameters
   *
   * @param queryParams The query parameters used to perform resolve
   */


  _Profiles.prototype.clientPeoplePickerResolveUser = function (queryParams) {
    return this.clientPeoplePickerQuery.clientPeoplePickerResolveUser(queryParams);
  };
  /**
   * Searches for users or groups using specified query parameters
   *
   * @param queryParams The query parameters used to perform search
   */


  _Profiles.prototype.clientPeoplePickerSearchUser = function (queryParams) {
    return this.clientPeoplePickerQuery.clientPeoplePickerSearchUser(queryParams);
  };

  return _Profiles;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Profiles = _Profiles;
var Profiles = (0, _sharepointqueryable.spInvokableFactory)(_Profiles);
exports.Profiles = Profiles;

var ProfileLoader =
/** @class */
function (_super) {
  (0, _tslib.__extends)(ProfileLoader, _super);

  function ProfileLoader() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only) Doesn't support batching
   *
   * @param emails The email addresses of the users to provision sites for
   */


  ProfileLoader.prototype.createPersonalSiteEnqueueBulk = function (emails) {
    return (0, _operations.spPost)(this.clone(ProfileLoaderFactory, "createpersonalsiteenqueuebulk", false), (0, _odata.body)({
      "emailIDs": emails
    }));
  };

  Object.defineProperty(ProfileLoader.prototype, "ownerUserProfile", {
    /**
     * Gets the user profile of the site owner.
     *
     */
    get: function () {
      var q = this.getParent(ProfileLoaderFactory, this.parentUrl, "_api/sp.userprofiles.profileloader.getowneruserprofile");

      if (this.hasBatch) {
        q = q.inBatch(this.batch);
      }

      return (0, _operations.spPost)(q);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ProfileLoader.prototype, "userProfile", {
    /**
     * Gets the user profile of the current user.
     *
     */
    get: function () {
      return (0, _operations.spPost)(this.clone(ProfileLoaderFactory, "getuserprofile"));
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Enqueues creating a personal site for this user, which can be used to share documents, web pages, and other files.
   *
   * @param interactiveRequest true if interactively (web) initiated request, or false (default) if non-interactively (client) initiated request
   */

  ProfileLoader.prototype.createPersonalSite = function (interactiveRequest) {
    if (interactiveRequest === void 0) {
      interactiveRequest = false;
    }

    return (0, _operations.spPost)(this.clone(ProfileLoaderFactory, "getuserprofile/createpersonalsiteenque(" + interactiveRequest + ")"));
  };
  /**
   * Sets the privacy settings for this profile
   *
   * @param share true to make all social data public; false to make all social data private.
   */


  ProfileLoader.prototype.shareAllSocialData = function (share) {
    return (0, _operations.spPost)(this.clone(ProfileLoaderFactory, "getuserprofile/shareallsocialdata(" + share + ")"));
  };

  ProfileLoader = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("_api/sp.userprofiles.profileloader.getprofileloader")], ProfileLoader);
  return ProfileLoader;
}(_sharepointqueryable._SharePointQueryable);

var ProfileLoaderFactory = function (baseUrl, path) {
  return new ProfileLoader(baseUrl, path);
};

var ClientPeoplePickerQuery =
/** @class */
function (_super) {
  (0, _tslib.__extends)(ClientPeoplePickerQuery, _super);

  function ClientPeoplePickerQuery() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Resolves user or group using specified query parameters
   *
   * @param queryParams The query parameters used to perform resolve
   */


  ClientPeoplePickerQuery.prototype.clientPeoplePickerResolveUser = function (queryParams) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var q, res;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            q = this.clone(ClientPeoplePickerFactory, null);
            q.concat(".clientpeoplepickerresolveuser");
            return [4
            /*yield*/
            , (0, _operations.spPost)(q, this.getBodyFrom(queryParams))];

          case 1:
            res = _a.sent();
            return [2
            /*return*/
            , JSON.parse(typeof res === "object" ? res.ClientPeoplePickerResolveUser : res)];
        }
      });
    });
  };
  /**
   * Searches for users or groups using specified query parameters
   *
   * @param queryParams The query parameters used to perform search
   */


  ClientPeoplePickerQuery.prototype.clientPeoplePickerSearchUser = function (queryParams) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var q, res;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            q = this.clone(ClientPeoplePickerFactory, null);
            q.concat(".clientpeoplepickersearchuser");
            return [4
            /*yield*/
            , (0, _operations.spPost)(q, this.getBodyFrom(queryParams))];

          case 1:
            res = _a.sent();
            return [2
            /*return*/
            , JSON.parse(typeof res === "object" ? res.ClientPeoplePickerSearchUser : res)];
        }
      });
    });
  };
  /**
   * Creates ClientPeoplePickerQueryParameters request body
   *
   * @param queryParams The query parameters to create request body
   */


  ClientPeoplePickerQuery.prototype.getBodyFrom = function (queryParams) {
    return (0, _odata.body)({
      "queryParams": (0, _common.assign)((0, _metadata.metadata)("SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters"), queryParams)
    });
  };

  ClientPeoplePickerQuery = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("_api/sp.ui.applicationpages.clientpeoplepickerwebserviceinterface")], ClientPeoplePickerQuery);
  return ClientPeoplePickerQuery;
}(_sharepointqueryable._SharePointQueryable);

var ClientPeoplePickerFactory = function (baseUrl, path) {
  return new ClientPeoplePickerQuery(baseUrl, path);
};
/**
 * Specifies the originating zone of a request received.
 */


var UrlZone;
exports.UrlZone = UrlZone;

(function (UrlZone) {
  /**
   * Specifies the default zone used for requests unless another zone is specified.
   */
  UrlZone[UrlZone["DefaultZone"] = 0] = "DefaultZone";
  /**
   * Specifies an intranet zone.
   */

  UrlZone[UrlZone["Intranet"] = 1] = "Intranet";
  /**
   * Specifies an Internet zone.
   */

  UrlZone[UrlZone["Internet"] = 2] = "Internet";
  /**
   * Specifies a custom zone.
   */

  UrlZone[UrlZone["Custom"] = 3] = "Custom";
  /**
   * Specifies an extranet zone.
   */

  UrlZone[UrlZone["Extranet"] = 4] = "Extranet";
})(UrlZone || (exports.UrlZone = UrlZone = {}));
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/common":"../node_modules/@pnp/common/index.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js"}],"../node_modules/@pnp/sp/profiles/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Profiles", {
  enumerable: true,
  get: function () {
    return _types.Profiles;
  }
});
Object.defineProperty(exports, "UrlZone", {
  enumerable: true,
  get: function () {
    return _types.UrlZone;
  }
});

var _rest = require("../rest");

var _types = require("./types");

Reflect.defineProperty(_rest.SPRest.prototype, "profiles", {
  configurable: true,
  enumerable: true,
  get: function () {
    return (0, _types.Profiles)(this._baseUrl);
  }
});
},{"../rest":"../node_modules/@pnp/sp/rest.js","./types":"../node_modules/@pnp/sp/profiles/types.js"}],"../node_modules/@pnp/sp/regional-settings/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeZones = exports._TimeZones = exports.TimeZone = exports._TimeZone = exports.RegionalSettings = exports._RegionalSettings = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _sharepointqueryable = require("../sharepointqueryable");

var _decorators = require("../decorators");

var _odata = require("../odata");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _RegionalSettings =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_RegionalSettings, _super);

  function _RegionalSettings() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_RegionalSettings.prototype, "installedLanguages", {
    /**
     * Gets the collection of languages used in a server farm.
     * ** Please use getInstalledLanguages instead of this method **
     */
    get: function () {
      console.warn("Deprecated: RegionalSettings.installedLanguages is deprecated, please use RegionalSettings.getInstalledLanguages");
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableCollection)(this, "installedlanguages"), "rs.installedLanguages");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_RegionalSettings.prototype, "timeZone", {
    /**
     * Gets time zone
     */
    get: function () {
      return _telemetry.tag.configure(TimeZone(this), "rs.tz");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_RegionalSettings.prototype, "timeZones", {
    /**
     * Gets time zones
     */
    get: function () {
      return _telemetry.tag.configure(TimeZones(this), "rs.tzs");
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Gets the collection of languages used in a server farm.
   */

  _RegionalSettings.prototype.getInstalledLanguages = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var results;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryableCollection)(this, "installedlanguages"), "rs.getInstalledLanguages")()];

          case 1:
            results = _a.sent();
            return [2
            /*return*/
            , results.Items];
        }
      });
    });
  };

  _RegionalSettings = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("regionalsettings")], _RegionalSettings);
  return _RegionalSettings;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._RegionalSettings = _RegionalSettings;
var RegionalSettings = (0, _sharepointqueryable.spInvokableFactory)(_RegionalSettings);
exports.RegionalSettings = RegionalSettings;

var _TimeZone =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_TimeZone, _super);

  function _TimeZone() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets an Local Time by UTC Time
   *
   * @param utcTime UTC Time as Date or ISO String
   */


  _TimeZone.prototype.utcToLocalTime = function (utcTime) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var dateIsoString, res;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (typeof utcTime === "string") {
              dateIsoString = utcTime;
            } else {
              dateIsoString = utcTime.toISOString();
            }

            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(TimeZone, "utctolocaltime('" + dateIsoString + "')"))];

          case 1:
            res = _a.sent();
            return [2
            /*return*/
            , (0, _common.hOP)(res, "UTCToLocalTime") ? res.UTCToLocalTime : res];
        }
      });
    });
  };
  /**
   * Gets an UTC Time by Local Time
   *
   * @param localTime Local Time as Date or ISO String
   */


  _TimeZone.prototype.localTimeToUTC = function (localTime) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var dateIsoString, res;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (typeof localTime === "string") {
              dateIsoString = localTime;
            } else {
              dateIsoString = (0, _common.dateAdd)(localTime, "minute", localTime.getTimezoneOffset() * -1).toISOString();
            }

            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(TimeZone, "localtimetoutc('" + dateIsoString + "')"))];

          case 1:
            res = _a.sent();
            return [2
            /*return*/
            , (0, _common.hOP)(res, "LocalTimeToUTC") ? res.LocalTimeToUTC : res];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("tz.utcToLocalTime")], _TimeZone.prototype, "utcToLocalTime", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("tz.localTimeToUTC")], _TimeZone.prototype, "localTimeToUTC", null);
  _TimeZone = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("timezone")], _TimeZone);
  return _TimeZone;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._TimeZone = _TimeZone;
var TimeZone = (0, _sharepointqueryable.spInvokableFactory)(_TimeZone);
exports.TimeZone = TimeZone;

var _TimeZones =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_TimeZones, _super);

  function _TimeZones() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets an TimeZone by id (see: https://msdn.microsoft.com/en-us/library/office/jj247008.aspx)
   *
   * @param id The integer id of the timezone to retrieve
   */


  _TimeZones.prototype.getById = function (id) {
    // do the post and merge the result into a TimeZone instance so the data and methods are available
    return (0, _operations.spPost)(this.clone(TimeZones, "GetById(" + id + ")").usingParser((0, _odata.spODataEntity)(TimeZone)));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("tzs.getById")], _TimeZones.prototype, "getById", null);
  _TimeZones = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("timezones")], _TimeZones);
  return _TimeZones;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._TimeZones = _TimeZones;
var TimeZones = (0, _sharepointqueryable.spInvokableFactory)(_TimeZones);
exports.TimeZones = TimeZones;
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../odata":"../node_modules/@pnp/sp/odata.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/regional-settings/funcs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValueForUICultureBinder = getValueForUICultureBinder;

var _sharepointqueryable = require("../sharepointqueryable");

var _operations = require("../operations");

var _odata = require("@pnp/odata");

function getValueForUICultureBinder(propName) {
  return function (cultureName) {
    return (0, _operations.spPost)(this.clone(_sharepointqueryable.SharePointQueryable, propName + "/getValueForUICulture"), (0, _odata.body)({
      cultureName: cultureName
    }));
  };
}
},{"../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../operations":"../node_modules/@pnp/sp/operations.js","@pnp/odata":"../node_modules/@pnp/odata/index.js"}],"../node_modules/@pnp/sp/regional-settings/web.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../webs/types");

var _types2 = require("./types");

var _funcs = require("./funcs");

(0, _odata.addProp)(_types._Web, "regionalSettings", _types2.RegionalSettings);
_types._Web.prototype.titleResource = (0, _funcs.getValueForUICultureBinder)("titleResource");
_types._Web.prototype.descriptionResource = (0, _funcs.getValueForUICultureBinder)("descriptionResource");
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/regional-settings/types.js","./funcs":"../node_modules/@pnp/sp/regional-settings/funcs.js"}],"../node_modules/@pnp/sp/user-custom-actions/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserCustomActionScope = exports.UserCustomActionRegistrationType = exports.UserCustomAction = exports._UserCustomAction = exports.UserCustomActions = exports._UserCustomActions = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _common = require("@pnp/common");

var _odata = require("@pnp/odata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _metadata = require("../utils/metadata");

var _UserCustomActions =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_UserCustomActions, _super);

  function _UserCustomActions() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Returns the user custom action with the specified id
   *
   * @param id The GUID id of the user custom action to retrieve
   */


  _UserCustomActions.prototype.getById = function (id) {
    return _telemetry.tag.configure(UserCustomAction(this).concat("('" + id + "')"), "ucas.getById");
  };
  /**
   * Creates a user custom action
   *
   * @param properties The information object of property names and values which define the new user custom action
   */


  _UserCustomActions.prototype.add = function (properties) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this, (0, _odata.body)((0, _common.assign)((0, _metadata.metadata)("SP.UserCustomAction"), properties)))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              action: this.getById(data.Id),
              data: data
            }];
        }
      });
    });
  };
  /**
   * Deletes all user custom actions in the collection
   */


  _UserCustomActions.prototype.clear = function () {
    return (0, _operations.spPost)(this.clone(UserCustomActions, "clear"));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("ucas.add")], _UserCustomActions.prototype, "add", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ucas.clear")], _UserCustomActions.prototype, "clear", null);
  _UserCustomActions = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("usercustomactions")], _UserCustomActions);
  return _UserCustomActions;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._UserCustomActions = _UserCustomActions;
var UserCustomActions = (0, _sharepointqueryable.spInvokableFactory)(_UserCustomActions);
exports.UserCustomActions = UserCustomActions;

var _UserCustomAction =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_UserCustomAction, _super);

  function _UserCustomAction() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteable)("uca");
    /**
    * Updates this user custom action with the supplied properties
    *
    * @param properties An information object of property names and values to update for this user custom action
    */

    _this.update = _this._update("SP.UserCustomAction", function (data) {
      return {
        data: data,
        action: _this
      };
    });
    return _this;
  }

  return _UserCustomAction;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._UserCustomAction = _UserCustomAction;
var UserCustomAction = (0, _sharepointqueryable.spInvokableFactory)(_UserCustomAction);
exports.UserCustomAction = UserCustomAction;
var UserCustomActionRegistrationType;
exports.UserCustomActionRegistrationType = UserCustomActionRegistrationType;

(function (UserCustomActionRegistrationType) {
  UserCustomActionRegistrationType[UserCustomActionRegistrationType["None"] = 0] = "None";
  UserCustomActionRegistrationType[UserCustomActionRegistrationType["List"] = 1] = "List";
  UserCustomActionRegistrationType[UserCustomActionRegistrationType["ContentType"] = 2] = "ContentType";
  UserCustomActionRegistrationType[UserCustomActionRegistrationType["ProgId"] = 3] = "ProgId";
  UserCustomActionRegistrationType[UserCustomActionRegistrationType["FileType"] = 4] = "FileType";
})(UserCustomActionRegistrationType || (exports.UserCustomActionRegistrationType = UserCustomActionRegistrationType = {}));

var UserCustomActionScope;
exports.UserCustomActionScope = UserCustomActionScope;

(function (UserCustomActionScope) {
  UserCustomActionScope[UserCustomActionScope["Unknown"] = 0] = "Unknown";
  UserCustomActionScope[UserCustomActionScope["Site"] = 2] = "Site";
  UserCustomActionScope[UserCustomActionScope["Web"] = 3] = "Web";
  UserCustomActionScope[UserCustomActionScope["List"] = 4] = "List";
})(UserCustomActionScope || (exports.UserCustomActionScope = UserCustomActionScope = {}));
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js"}],"../node_modules/@pnp/sp/regional-settings/user-custom-actions.js":[function(require,module,exports) {
"use strict";

var _types = require("../user-custom-actions/types");

var _funcs = require("./funcs");

_types._UserCustomAction.prototype.titleResource = (0, _funcs.getValueForUICultureBinder)("titleResource");
_types._UserCustomAction.prototype.descriptionResource = (0, _funcs.getValueForUICultureBinder)("descriptionResource");
},{"../user-custom-actions/types":"../node_modules/@pnp/sp/user-custom-actions/types.js","./funcs":"../node_modules/@pnp/sp/regional-settings/funcs.js"}],"../node_modules/@pnp/sp/regional-settings/list.js":[function(require,module,exports) {
"use strict";

var _types = require("../lists/types");

var _funcs = require("./funcs");

_types._List.prototype.titleResource = (0, _funcs.getValueForUICultureBinder)("titleResource");
_types._List.prototype.descriptionResource = (0, _funcs.getValueForUICultureBinder)("descriptionResource");
},{"../lists/types":"../node_modules/@pnp/sp/lists/types.js","./funcs":"../node_modules/@pnp/sp/regional-settings/funcs.js"}],"../node_modules/@pnp/sp/regional-settings/field.js":[function(require,module,exports) {
"use strict";

var _types = require("../fields/types");

var _funcs = require("./funcs");

_types._Field.prototype.titleResource = (0, _funcs.getValueForUICultureBinder)("titleResource");
_types._Field.prototype.descriptionResource = (0, _funcs.getValueForUICultureBinder)("descriptionResource");
},{"../fields/types":"../node_modules/@pnp/sp/fields/types.js","./funcs":"../node_modules/@pnp/sp/regional-settings/funcs.js"}],"../node_modules/@pnp/sp/regional-settings/content-type.js":[function(require,module,exports) {
"use strict";

var _types = require("../content-types/types");

var _funcs = require("./funcs");

_types._ContentType.prototype.titleResource = (0, _funcs.getValueForUICultureBinder)("titleResource");
_types._ContentType.prototype.descriptionResource = (0, _funcs.getValueForUICultureBinder)("descriptionResource");
},{"../content-types/types":"../node_modules/@pnp/sp/content-types/types.js","./funcs":"../node_modules/@pnp/sp/regional-settings/funcs.js"}],"../node_modules/@pnp/sp/regional-settings/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RegionalSettings", {
  enumerable: true,
  get: function () {
    return _types.RegionalSettings;
  }
});
Object.defineProperty(exports, "TimeZone", {
  enumerable: true,
  get: function () {
    return _types.TimeZone;
  }
});
Object.defineProperty(exports, "TimeZones", {
  enumerable: true,
  get: function () {
    return _types.TimeZones;
  }
});

require("./web");

require("./user-custom-actions");

require("./list");

require("./field");

require("./content-type");

var _types = require("./types");
},{"./web":"../node_modules/@pnp/sp/regional-settings/web.js","./user-custom-actions":"../node_modules/@pnp/sp/regional-settings/user-custom-actions.js","./list":"../node_modules/@pnp/sp/regional-settings/list.js","./field":"../node_modules/@pnp/sp/regional-settings/field.js","./content-type":"../node_modules/@pnp/sp/regional-settings/content-type.js","./types":"../node_modules/@pnp/sp/regional-settings/types.js"}],"../node_modules/@pnp/sp/related-items/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RelatedItemManager = exports._RelatedItemManager = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _extractweburl = require("../utils/extractweburl");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _odata = require("@pnp/odata");

var _telemetry = require("../telemetry");

var _RelatedItemManager =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_RelatedItemManager, _super);

  function _RelatedItemManager() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  _RelatedItemManager.prototype.getRelatedItems = function (sourceListName, sourceItemId) {
    var query = this.clone(RelatedItemManager, null);
    query.concat(".GetRelatedItems");
    return (0, _operations.spPost)(query, (0, _odata.body)({
      SourceItemID: sourceItemId,
      SourceListName: sourceListName
    }));
  };

  _RelatedItemManager.prototype.getPageOneRelatedItems = function (sourceListName, sourceItemId) {
    var query = this.clone(RelatedItemManager, null);
    query.concat(".GetPageOneRelatedItems");
    return (0, _operations.spPost)(query, (0, _odata.body)({
      SourceItemID: sourceItemId,
      SourceListName: sourceListName
    }));
  };

  _RelatedItemManager.prototype.addSingleLink = function (sourceListName, sourceItemId, sourceWebUrl, targetListName, targetItemID, targetWebUrl, tryAddReverseLink) {
    if (tryAddReverseLink === void 0) {
      tryAddReverseLink = false;
    }

    var query = this.clone(RelatedItemManager, null);
    query.concat(".AddSingleLink");
    return (0, _operations.spPost)(query, (0, _odata.body)({
      SourceItemID: sourceItemId,
      SourceListName: sourceListName,
      SourceWebUrl: sourceWebUrl,
      TargetItemID: targetItemID,
      TargetListName: targetListName,
      TargetWebUrl: targetWebUrl,
      TryAddReverseLink: tryAddReverseLink
    }));
  };

  _RelatedItemManager.prototype.addSingleLinkToUrl = function (sourceListName, sourceItemId, targetItemUrl, tryAddReverseLink) {
    if (tryAddReverseLink === void 0) {
      tryAddReverseLink = false;
    }

    var query = this.clone(RelatedItemManager, null);
    query.concat(".AddSingleLinkToUrl");
    return (0, _operations.spPost)(query, (0, _odata.body)({
      SourceItemID: sourceItemId,
      SourceListName: sourceListName,
      TargetItemUrl: targetItemUrl,
      TryAddReverseLink: tryAddReverseLink
    }));
  };

  _RelatedItemManager.prototype.addSingleLinkFromUrl = function (sourceItemUrl, targetListName, targetItemId, tryAddReverseLink) {
    if (tryAddReverseLink === void 0) {
      tryAddReverseLink = false;
    }

    var query = this.clone(RelatedItemManager, null);
    query.concat(".AddSingleLinkFromUrl");
    return (0, _operations.spPost)(query, (0, _odata.body)({
      SourceItemUrl: sourceItemUrl,
      TargetItemID: targetItemId,
      TargetListName: targetListName,
      TryAddReverseLink: tryAddReverseLink
    }));
  };

  _RelatedItemManager.prototype.deleteSingleLink = function (sourceListName, sourceItemId, sourceWebUrl, targetListName, targetItemId, targetWebUrl, tryDeleteReverseLink) {
    if (tryDeleteReverseLink === void 0) {
      tryDeleteReverseLink = false;
    }

    var query = this.clone(RelatedItemManager, null);
    query.concat(".DeleteSingleLink");
    return (0, _operations.spPost)(query, (0, _odata.body)({
      SourceItemID: sourceItemId,
      SourceListName: sourceListName,
      SourceWebUrl: sourceWebUrl,
      TargetItemID: targetItemId,
      TargetListName: targetListName,
      TargetWebUrl: targetWebUrl,
      TryDeleteReverseLink: tryDeleteReverseLink
    }));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("rim.getRelatedItems")], _RelatedItemManager.prototype, "getRelatedItems", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("rim.getPageOneRelatedItems")], _RelatedItemManager.prototype, "getPageOneRelatedItems", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("rim.addSingleLink")], _RelatedItemManager.prototype, "addSingleLink", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("rim.ToUrl")], _RelatedItemManager.prototype, "addSingleLinkToUrl", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("rim.FromUrl")], _RelatedItemManager.prototype, "addSingleLinkFromUrl", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("rim.deleteSingleLink")], _RelatedItemManager.prototype, "deleteSingleLink", null);
  _RelatedItemManager = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("_api/SP.RelatedItemManager")], _RelatedItemManager);
  return _RelatedItemManager;
}(_sharepointqueryable._SharePointQueryable);

exports._RelatedItemManager = _RelatedItemManager;

var RelatedItemManager = function (url) {
  return new _RelatedItemManager((0, _extractweburl.extractWebUrl)(typeof url === "string" ? url : url.toUrl()));
};

exports.RelatedItemManager = RelatedItemManager;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/related-items/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RelatedItemManager", {
  enumerable: true,
  get: function () {
    return _types.RelatedItemManager;
  }
});

var _types = require("./types");
},{"./types":"../node_modules/@pnp/sp/related-items/types.js"}],"../node_modules/@pnp/sp/search/query.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchQueryBuilder = SearchQueryBuilder;
exports.SearchResults = exports.Search = exports._Search = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _common = require("@pnp/common");

var _metadata = require("../utils/metadata");

var _odata = require("@pnp/odata");

var _operations = require("../operations");

var _decorators = require("../decorators");

var _telemetry = require("../telemetry");

var funcs = new Map([["text", "Querytext"], ["template", "QueryTemplate"], ["sourceId", "SourceId"], ["trimDuplicatesIncludeId", ""], ["startRow", ""], ["rowLimit", ""], ["rankingModelId", ""], ["rowsPerPage", ""], ["selectProperties", ""], ["culture", ""], ["timeZoneId", ""], ["refinementFilters", ""], ["refiners", ""], ["hiddenConstraints", ""], ["sortList", ""], ["timeout", ""], ["hithighlightedProperties", ""], ["clientType", ""], ["personalizationData", ""], ["resultsURL", ""], ["queryTag", ""], ["properties", ""], ["queryTemplatePropertiesUrl", ""], ["reorderingRules", ""], ["hitHighlightedMultivaluePropertyLimit", ""], ["collapseSpecification", ""], ["uiLanguage", ""], ["desiredSnippetLength", ""], ["maxSnippetLength", ""], ["summaryLength", ""]]);
var props = new Map([]);

function toPropCase(str) {
  return str.replace(/^(.)/, function ($1) {
    return $1.toUpperCase();
  });
}
/**
 * Creates a new instance of the SearchQueryBuilder
 *
 * @param queryText Initial query text
 * @param _query Any initial query configuration
 */


function SearchQueryBuilder(queryText, _query) {
  if (queryText === void 0) {
    queryText = "";
  }

  if (_query === void 0) {
    _query = {};
  }

  return new Proxy({
    query: Object.assign({
      Querytext: queryText
    }, _query)
  }, {
    get: function (self, propertyKey, proxy) {
      var pk = propertyKey.toString();

      if (pk === "toSearchQuery") {
        return function () {
          return self.query;
        };
      }

      if (funcs.has(pk)) {
        return function () {
          var value = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
          }

          var mappedPk = funcs.get(pk);
          self.query[mappedPk.length > 0 ? mappedPk : toPropCase(pk)] = value.length > 1 ? value : value[0];
          return proxy;
        };
      }

      var propKey = props.has(pk) ? props.get(pk) : toPropCase(pk);
      self.query[propKey] = true;
      return proxy;
    }
  });
}

var queryRegex = /_api\/search\/postquery$/i;
/**
 * Describes the search API
 *
 */

var _Search =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Search, _super);

  function _Search() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * @returns Promise
   */


  _Search.prototype.execute = function (queryInit) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var query, postBody, cacheKey, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            query = this.parseQuery(queryInit);
            postBody = (0, _odata.body)({
              request: (0, _common.assign)((0, _metadata.metadata)("Microsoft.Office.Server.Search.REST.SearchRequest"), Object.assign({}, query, {
                HitHighlightedProperties: this.fixArrProp(query.HitHighlightedProperties),
                Properties: this.fixArrProp(query.Properties),
                RefinementFilters: this.fixArrProp(query.RefinementFilters),
                ReorderingRules: this.fixArrProp(query.ReorderingRules),
                SelectProperties: this.fixArrProp(query.SelectProperties),
                SortList: this.fixArrProp(query.SortList)
              }))
            }); // if we are using caching with this search request, then we need to handle some work upfront to enable that

            if (this.data.useCaching) {
              // force use of the cache for this request if .usingCaching was called
              this._forceCaching = true;
              cacheKey = "PnPjs.SearchWithCaching(" + (0, _common.getHashCode)(postBody.body) + ")";

              if ((0, _common.objectDefinedNotNull)(this.data.cachingOptions)) {
                // if our key ends in the postquery url we overwrite it
                if (queryRegex.test(this.data.cachingOptions.key)) {
                  this.data.cachingOptions.key = cacheKey;
                }
              } else {
                this.data.cachingOptions = new _odata.CachingOptions(cacheKey);
              }
            }

            return [4
            /*yield*/
            , (0, _operations.spPost)(this, postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , new SearchResults(data, this.toUrl(), query)];
        }
      });
    });
  };
  /**
   * Fix array property
   *
   * @param prop property to fix for container struct
   */


  _Search.prototype.fixArrProp = function (prop) {
    if (typeof prop === "undefined") {
      return {
        results: []
      };
    }

    return {
      results: (0, _common.isArray)(prop) ? prop : [prop]
    };
  };
  /**
   * Translates one of the query initializers into a SearchQuery instance
   *
   * @param query
   */


  _Search.prototype.parseQuery = function (query) {
    var finalQuery;

    if (typeof query === "string") {
      finalQuery = {
        Querytext: query
      };
    } else if (query.toSearchQuery) {
      finalQuery = query.toSearchQuery();
    } else {
      finalQuery = query;
    }

    return finalQuery;
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("se.execute")], _Search.prototype, "execute", null);
  _Search = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("_api/search/postquery")], _Search);
  return _Search;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Search = _Search;

var Search = function (baseUrl, options) {
  if (options === void 0) {
    options = {};
  }

  return function (queryInit) {
    return new _Search(baseUrl).configure(options).execute(queryInit);
  };
};

exports.Search = Search;

var SearchResults =
/** @class */
function () {
  function SearchResults(rawResponse, _url, _query, _raw, _primary) {
    if (_raw === void 0) {
      _raw = null;
    }

    if (_primary === void 0) {
      _primary = null;
    }

    this._url = _url;
    this._query = _query;
    this._raw = _raw;
    this._primary = _primary;
    this._url = this._url.replace(queryRegex, "");
    this._raw = rawResponse.postquery ? rawResponse.postquery : rawResponse;
  }

  Object.defineProperty(SearchResults.prototype, "ElapsedTime", {
    get: function () {
      var _a;

      return ((_a = this === null || this === void 0 ? void 0 : this.RawSearchResults) === null || _a === void 0 ? void 0 : _a.ElapsedTime) || 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SearchResults.prototype, "RowCount", {
    get: function () {
      var _a, _b, _c;

      return ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.RawSearchResults) === null || _a === void 0 ? void 0 : _a.PrimaryQueryResult) === null || _b === void 0 ? void 0 : _b.RelevantResults) === null || _c === void 0 ? void 0 : _c.RowCount) || 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SearchResults.prototype, "TotalRows", {
    get: function () {
      var _a, _b, _c;

      return ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.RawSearchResults) === null || _a === void 0 ? void 0 : _a.PrimaryQueryResult) === null || _b === void 0 ? void 0 : _b.RelevantResults) === null || _c === void 0 ? void 0 : _c.TotalRows) || 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SearchResults.prototype, "TotalRowsIncludingDuplicates", {
    get: function () {
      var _a, _b, _c;

      return ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.RawSearchResults) === null || _a === void 0 ? void 0 : _a.PrimaryQueryResult) === null || _b === void 0 ? void 0 : _b.RelevantResults) === null || _c === void 0 ? void 0 : _c.TotalRowsIncludingDuplicates) || 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SearchResults.prototype, "RawSearchResults", {
    get: function () {
      return this._raw;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SearchResults.prototype, "PrimarySearchResults", {
    get: function () {
      var _a, _b, _c, _d;

      if (this._primary === null) {
        this._primary = this.formatSearchResults(((_d = (_c = (_b = (_a = this._raw) === null || _a === void 0 ? void 0 : _a.PrimaryQueryResult) === null || _b === void 0 ? void 0 : _b.RelevantResults) === null || _c === void 0 ? void 0 : _c.Table) === null || _d === void 0 ? void 0 : _d.Rows) || null);
      }

      return this._primary;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Gets a page of results
   *
   * @param pageNumber Index of the page to return. Used to determine StartRow
   * @param pageSize Optional, items per page (default = 10)
   */

  SearchResults.prototype.getPage = function (pageNumber, pageSize) {
    // if we got all the available rows we don't have another page
    if (this.TotalRows < this.RowCount) {
      return Promise.resolve(null);
    } // if pageSize is supplied, then we use that regardless of any previous values
    // otherwise get the previous RowLimit or default to 10


    var rows = pageSize !== undefined ? pageSize : (0, _common.hOP)(this._query, "RowLimit") ? this._query.RowLimit : 10;
    var query = (0, _common.assign)(this._query, {
      RowLimit: rows,
      StartRow: rows * (pageNumber - 1)
    }); // we have reached the end

    if (query.StartRow > this.TotalRows) {
      return Promise.resolve(null);
    }

    return Search(this._url)(query);
  };
  /**
   * Formats a search results array
   *
   * @param rawResults The array to process
   */


  SearchResults.prototype.formatSearchResults = function (rawResults) {
    var e_1, _a;

    var results = new Array();

    if (typeof rawResults === "undefined" || rawResults == null) {
      return [];
    }

    var tempResults = rawResults.results ? rawResults.results : rawResults;

    try {
      for (var tempResults_1 = (0, _tslib.__values)(tempResults), tempResults_1_1 = tempResults_1.next(); !tempResults_1_1.done; tempResults_1_1 = tempResults_1.next()) {
        var tempResult = tempResults_1_1.value;
        var cells = tempResult.Cells.results ? tempResult.Cells.results : tempResult.Cells;
        results.push(cells.reduce(function (res, cell) {
          Reflect.defineProperty(res, cell.Key, {
            configurable: false,
            enumerable: true,
            value: cell.Value,
            writable: false
          });
          return res;
        }, {}));
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (tempResults_1_1 && !tempResults_1_1.done && (_a = tempResults_1.return)) _a.call(tempResults_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }

    return results;
  };

  return SearchResults;
}();

exports.SearchResults = SearchResults;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/common":"../node_modules/@pnp/common/index.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../operations":"../node_modules/@pnp/sp/operations.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/search/suggest.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Suggest = exports._Suggest = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _common = require("@pnp/common");

var _decorators = require("../decorators");

var _telemetry = require("../telemetry");

var _Suggest =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Suggest, _super);

  function _Suggest() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  _Suggest.prototype.execute = function (query) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var response, mapper;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.mapQueryToQueryString(query);
            return [4
            /*yield*/
            , this.get()];

          case 1:
            response = _a.sent();
            mapper = (0, _common.hOP)(response, "suggest") ? function (s_1) {
              return response.suggest[s_1].results;
            } : function (s_2) {
              return response[s_2];
            };
            return [2
            /*return*/
            , {
              PeopleNames: mapper("PeopleNames"),
              PersonalResults: mapper("PersonalResults"),
              Queries: mapper("Queries")
            }];
        }
      });
    });
  };

  _Suggest.prototype.mapQueryToQueryString = function (query) {
    var _this = this;

    var setProp = function (q) {
      return function (checkProp) {
        return function (sp) {
          if ((0, _common.hOP)(q, checkProp)) {
            _this.query.set(sp, q[checkProp].toString());
          }
        };
      };
    };

    this.query.set("querytext", "'" + query.querytext + "'");
    var querySetter = setProp(query);
    querySetter("count")("inumberofquerysuggestions");
    querySetter("personalCount")("inumberofresultsuggestions");
    querySetter("preQuery")("fprequerysuggestions");
    querySetter("hitHighlighting")("fhithighlighting");
    querySetter("capitalize")("fcapitalizefirstletters");
    querySetter("culture")("culture");
    querySetter("stemming")("enablestemming");
    querySetter("includePeople")("showpeoplenamesuggestions");
    querySetter("queryRules")("enablequeryrules");
    querySetter("prefixMatch")("fprefixmatchallterms");
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("su.execute")], _Suggest.prototype, "execute", null);
  _Suggest = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("_api/search/suggest")], _Suggest);
  return _Suggest;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Suggest = _Suggest;

var Suggest = function (baseUrl, options) {
  if (options === void 0) {
    options = {};
  }

  return function (query) {
    return new _Suggest(baseUrl).configure(options).execute(query);
  };
};

exports.Suggest = Suggest;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/common":"../node_modules/@pnp/common/index.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/search/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchBuiltInSourceId = exports.QueryPropertyValueType = exports.ReorderingRuleMatchType = exports.SortDirection = void 0;

/**
 * defines the SortDirection enum
 */
var SortDirection;
exports.SortDirection = SortDirection;

(function (SortDirection) {
  SortDirection[SortDirection["Ascending"] = 0] = "Ascending";
  SortDirection[SortDirection["Descending"] = 1] = "Descending";
  SortDirection[SortDirection["FQLFormula"] = 2] = "FQLFormula";
})(SortDirection || (exports.SortDirection = SortDirection = {}));
/**
 * defines the ReorderingRuleMatchType  enum
 */


var ReorderingRuleMatchType;
exports.ReorderingRuleMatchType = ReorderingRuleMatchType;

(function (ReorderingRuleMatchType) {
  ReorderingRuleMatchType[ReorderingRuleMatchType["ResultContainsKeyword"] = 0] = "ResultContainsKeyword";
  ReorderingRuleMatchType[ReorderingRuleMatchType["TitleContainsKeyword"] = 1] = "TitleContainsKeyword";
  ReorderingRuleMatchType[ReorderingRuleMatchType["TitleMatchesKeyword"] = 2] = "TitleMatchesKeyword";
  ReorderingRuleMatchType[ReorderingRuleMatchType["UrlStartsWith"] = 3] = "UrlStartsWith";
  ReorderingRuleMatchType[ReorderingRuleMatchType["UrlExactlyMatches"] = 4] = "UrlExactlyMatches";
  ReorderingRuleMatchType[ReorderingRuleMatchType["ContentTypeIs"] = 5] = "ContentTypeIs";
  ReorderingRuleMatchType[ReorderingRuleMatchType["FileExtensionMatches"] = 6] = "FileExtensionMatches";
  ReorderingRuleMatchType[ReorderingRuleMatchType["ResultHasTag"] = 7] = "ResultHasTag";
  ReorderingRuleMatchType[ReorderingRuleMatchType["ManualCondition"] = 8] = "ManualCondition";
})(ReorderingRuleMatchType || (exports.ReorderingRuleMatchType = ReorderingRuleMatchType = {}));
/**
 * Specifies the type value for the property
 */


var QueryPropertyValueType;
exports.QueryPropertyValueType = QueryPropertyValueType;

(function (QueryPropertyValueType) {
  QueryPropertyValueType[QueryPropertyValueType["None"] = 0] = "None";
  QueryPropertyValueType[QueryPropertyValueType["StringType"] = 1] = "StringType";
  QueryPropertyValueType[QueryPropertyValueType["Int32Type"] = 2] = "Int32Type";
  QueryPropertyValueType[QueryPropertyValueType["BooleanType"] = 3] = "BooleanType";
  QueryPropertyValueType[QueryPropertyValueType["StringArrayType"] = 4] = "StringArrayType";
  QueryPropertyValueType[QueryPropertyValueType["UnSupportedType"] = 5] = "UnSupportedType";
})(QueryPropertyValueType || (exports.QueryPropertyValueType = QueryPropertyValueType = {}));

var SearchBuiltInSourceId =
/** @class */
function () {
  function SearchBuiltInSourceId() {}

  SearchBuiltInSourceId.Documents = "e7ec8cee-ded8-43c9-beb5-436b54b31e84";
  SearchBuiltInSourceId.ItemsMatchingContentType = "5dc9f503-801e-4ced-8a2c-5d1237132419";
  SearchBuiltInSourceId.ItemsMatchingTag = "e1327b9c-2b8c-4b23-99c9-3730cb29c3f7";
  SearchBuiltInSourceId.ItemsRelatedToCurrentUser = "48fec42e-4a92-48ce-8363-c2703a40e67d";
  SearchBuiltInSourceId.ItemsWithSameKeywordAsThisItem = "5c069288-1d17-454a-8ac6-9c642a065f48";
  SearchBuiltInSourceId.LocalPeopleResults = "b09a7990-05ea-4af9-81ef-edfab16c4e31";
  SearchBuiltInSourceId.LocalReportsAndDataResults = "203fba36-2763-4060-9931-911ac8c0583b";
  SearchBuiltInSourceId.LocalSharePointResults = "8413cd39-2156-4e00-b54d-11efd9abdb89";
  SearchBuiltInSourceId.LocalVideoResults = "78b793ce-7956-4669-aa3b-451fc5defebf";
  SearchBuiltInSourceId.Pages = "5e34578e-4d08-4edc-8bf3-002acf3cdbcc";
  SearchBuiltInSourceId.Pictures = "38403c8c-3975-41a8-826e-717f2d41568a";
  SearchBuiltInSourceId.Popular = "97c71db1-58ce-4891-8b64-585bc2326c12";
  SearchBuiltInSourceId.RecentlyChangedItems = "ba63bbae-fa9c-42c0-b027-9a878f16557c";
  SearchBuiltInSourceId.RecommendedItems = "ec675252-14fa-4fbe-84dd-8d098ed74181";
  SearchBuiltInSourceId.Wiki = "9479bf85-e257-4318-b5a8-81a180f5faa1";
  return SearchBuiltInSourceId;
}();

exports.SearchBuiltInSourceId = SearchBuiltInSourceId;
},{}],"../node_modules/@pnp/sp/search/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SearchQueryBuilder: true,
  SearchResults: true,
  Search: true,
  Suggest: true
};
Object.defineProperty(exports, "SearchQueryBuilder", {
  enumerable: true,
  get: function () {
    return _query.SearchQueryBuilder;
  }
});
Object.defineProperty(exports, "SearchResults", {
  enumerable: true,
  get: function () {
    return _query.SearchResults;
  }
});
Object.defineProperty(exports, "Search", {
  enumerable: true,
  get: function () {
    return _query.Search;
  }
});
Object.defineProperty(exports, "Suggest", {
  enumerable: true,
  get: function () {
    return _suggest.Suggest;
  }
});

var _rest = require("../rest");

var _query = require("./query");

var _suggest = require("./suggest");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

_rest.SPRest.prototype.search = function (query) {
  return (0, _query.Search)(this._baseUrl, this._options)(query);
};

_rest.SPRest.prototype.searchWithCaching = function (query, options) {
  return new _query._Search(this._baseUrl).configure(this._options).usingCaching(options).execute(query);
};

_rest.SPRest.prototype.searchSuggest = function (query) {
  return (0, _suggest.Suggest)(this._baseUrl, this._options)(typeof query === "string" ? {
    querytext: query
  } : query);
};
},{"../rest":"../node_modules/@pnp/sp/rest.js","./query":"../node_modules/@pnp/sp/search/query.js","./suggest":"../node_modules/@pnp/sp/search/suggest.js","./types":"../node_modules/@pnp/sp/search/types.js"}],"../node_modules/@pnp/sp/site-users/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SiteUser = exports._SiteUser = exports.SiteUsers = exports._SiteUsers = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _types = require("../site-groups/types");

var _common = require("@pnp/common");

var _metadata = require("../utils/metadata");

var _odata = require("@pnp/odata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _SiteUsers =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_SiteUsers, _super);

  function _SiteUsers() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a user from the collection by id
   *
   * @param id The id of the user to retrieve
   */


  _SiteUsers.prototype.getById = function (id) {
    return _telemetry.tag.configure(SiteUser(this, "getById(" + id + ")"), "sus.getById");
  };
  /**
   * Gets a user from the collection by email
   *
   * @param email The email address of the user to retrieve
   */


  _SiteUsers.prototype.getByEmail = function (email) {
    return _telemetry.tag.configure(SiteUser(this, "getByEmail('" + email + "')"), "sus.getByEmail");
  };
  /**
   * Gets a user from the collection by login name
   *
   * @param loginName The login name of the user to retrieve
   */


  _SiteUsers.prototype.getByLoginName = function (loginName) {
    return _telemetry.tag.configure(SiteUser(this).concat("('!@v::" + encodeURIComponent(loginName) + "')"), "sus.getByLoginName");
  };
  /**
   * Removes a user from the collection by id
   *
   * @param id The id of the user to remove
   */


  _SiteUsers.prototype.removeById = function (id) {
    return (0, _operations.spPost)(this.clone(SiteUsers, "removeById(" + id + ")"));
  };
  /**
   * Removes a user from the collection by login name
   *
   * @param loginName The login name of the user to remove
   */


  _SiteUsers.prototype.removeByLoginName = function (loginName) {
    var o = this.clone(SiteUsers, "removeByLoginName(@v)");
    o.query.set("@v", "'" + encodeURIComponent(loginName) + "'");
    return (0, _operations.spPost)(o);
  };
  /**
   * Adds a user to a site collection
   *
   * @param loginName The login name of the user to add  to a site collection
   *
   */


  _SiteUsers.prototype.add = function (loginName) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this, (0, _odata.body)((0, _common.assign)((0, _metadata.metadata)("SP.User"), {
              LoginName: loginName
            })))];

          case 1:
            _a.sent();

            return [2
            /*return*/
            , this.getByLoginName(loginName)];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("sus.remId")], _SiteUsers.prototype, "removeById", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sus.remLoginName")], _SiteUsers.prototype, "removeByLoginName", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sus.add")], _SiteUsers.prototype, "add", null);
  _SiteUsers = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("siteusers")], _SiteUsers);
  return _SiteUsers;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._SiteUsers = _SiteUsers;
var SiteUsers = (0, _sharepointqueryable.spInvokableFactory)(_SiteUsers);
/**
 * Describes a single user
 *
 */

exports.SiteUsers = SiteUsers;

var _SiteUser =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_SiteUser, _super);

  function _SiteUser() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteable)("su");
    /**
    * Updates this user instance with the supplied properties
    *
    * @param properties A plain object of property names and values to update for the user
    */

    _this.update = _this._update("SP.User", function (data) {
      return {
        data: data,
        user: _this
      };
    });
    return _this;
  }

  Object.defineProperty(_SiteUser.prototype, "groups", {
    /**
     * Gets the groups for this user
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _types.SiteGroups)(this, "groups"), "su.groups");
    },
    enumerable: false,
    configurable: true
  });
  return _SiteUser;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._SiteUser = _SiteUser;
var SiteUser = (0, _sharepointqueryable.spInvokableFactory)(_SiteUser);
exports.SiteUser = SiteUser;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../site-groups/types":"../node_modules/@pnp/sp/site-groups/types.js","@pnp/common":"../node_modules/@pnp/common/index.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/site-groups/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SiteGroup = exports._SiteGroup = exports.SiteGroups = exports._SiteGroups = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _types = require("../site-users/types");

var _common = require("@pnp/common");

var _metadata = require("../utils/metadata");

var _odata = require("@pnp/odata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _SiteGroups =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_SiteGroups, _super);

  function _SiteGroups() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a group from the collection by id
   *
   * @param id The id of the group to retrieve
   */


  _SiteGroups.prototype.getById = function (id) {
    return _telemetry.tag.configure(SiteGroup(this).concat("(" + id + ")"), "sgs.getById");
  };
  /**
   * Adds a new group to the site collection
   *
   * @param properties The group properties object of property names and values to be set for the group
   */


  _SiteGroups.prototype.add = function (properties) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = (0, _odata.body)((0, _common.assign)((0, _metadata.metadata)("SP.Group"), properties));
            return [4
            /*yield*/
            , (0, _operations.spPost)(_telemetry.tag.configure(this, "sgs.add"), postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              group: this.getById(data.Id)
            }];
        }
      });
    });
  };
  /**
   * Gets a group from the collection by name
   *
   * @param groupName The name of the group to retrieve
   */


  _SiteGroups.prototype.getByName = function (groupName) {
    return _telemetry.tag.configure(SiteGroup(this, "getByName('" + groupName + "')"), "sgs.getByName");
  };
  /**
   * Removes the group with the specified member id from the collection
   *
   * @param id The id of the group to remove
   */


  _SiteGroups.prototype.removeById = function (id) {
    return (0, _operations.spPost)(this.clone(SiteGroups, "removeById('" + id + "')"));
  };
  /**
   * Removes the cross-site group with the specified name from the collection
   *
   * @param loginName The name of the group to remove
   */


  _SiteGroups.prototype.removeByLoginName = function (loginName) {
    return (0, _operations.spPost)(this.clone(SiteGroups, "removeByLoginName('" + loginName + "')"));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("sgs.removeById")], _SiteGroups.prototype, "removeById", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sgs.removeByLoginName")], _SiteGroups.prototype, "removeByLoginName", null);
  _SiteGroups = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("sitegroups")], _SiteGroups);
  return _SiteGroups;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._SiteGroups = _SiteGroups;
var SiteGroups = (0, _sharepointqueryable.spInvokableFactory)(_SiteGroups);
exports.SiteGroups = SiteGroups;

var _SiteGroup =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_SiteGroup, _super);

  function _SiteGroup() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    /**
     * Updates the group with the given property values
     *
     * @param props The group properties object of property names and values to be set for the group
     */


    _this.update = _this._update("SP.Group", function (d, p) {
      var retGroup = _this;

      if ((0, _common.hOP)(p, "Title")) {
        /* tslint:disable-next-line no-string-literal */
        retGroup = _this.getParent(SiteGroup, _this.parentUrl, "getByName('" + p["Title"] + "')");
      }

      return {
        data: d,
        group: retGroup
      };
    });
    return _this;
  }

  Object.defineProperty(_SiteGroup.prototype, "users", {
    /**
     * Gets the users for this group
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _types.SiteUsers)(this, "users"), "sg.users");
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Set the owner of a group using a user id
   * @param userId the id of the user that will be set as the owner of the current group
   */

  _SiteGroup.prototype.setUserAsOwner = function (userId) {
    return (0, _operations.spPost)(this.clone(SiteGroup, "SetUserAsOwner(" + userId + ")"));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("sg.setUserAsOwner")], _SiteGroup.prototype, "setUserAsOwner", null);
  return _SiteGroup;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._SiteGroup = _SiteGroup;
var SiteGroup = (0, _sharepointqueryable.spInvokableFactory)(_SiteGroup);
exports.SiteGroup = SiteGroup;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../site-users/types":"../node_modules/@pnp/sp/site-users/types.js","@pnp/common":"../node_modules/@pnp/common/index.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/security/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PermissionKind = exports.RoleDefinition = exports._RoleDefinition = exports.RoleDefinitions = exports._RoleDefinitions = exports.RoleAssignment = exports._RoleAssignment = exports.RoleAssignments = exports._RoleAssignments = void 0;

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _odata = require("@pnp/odata");

var _sharepointqueryable = require("../sharepointqueryable");

var _types = require("../site-groups/types");

var _metadata = require("../utils/metadata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

/**
 * Describes a set of role assignments for the current scope
 *
 */
var _RoleAssignments =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_RoleAssignments, _super);

  function _RoleAssignments() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets the role assignment associated with the specified principal id from the collection.
   *
   * @param id The id of the role assignment
   */


  _RoleAssignments.prototype.getById = function (id) {
    return RoleAssignment(this).concat("(" + id + ")");
  };
  /**
   * Adds a new role assignment with the specified principal and role definitions to the collection
   *
   * @param principalId The id of the user or group to assign permissions to
   * @param roleDefId The id of the role definition that defines the permissions to assign
   *
   */


  _RoleAssignments.prototype.add = function (principalId, roleDefId) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(RoleAssignments, "addroleassignment(principalid=" + principalId + ", roledefid=" + roleDefId + ")"))];

          case 1:
            _a.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Removes the role assignment with the specified principal and role definition from the collection
   *
   * @param principalId The id of the user or group in the role assignment
   * @param roleDefId The id of the role definition in the role assignment
   *
   */


  _RoleAssignments.prototype.remove = function (principalId, roleDefId) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(RoleAssignments, "removeroleassignment(principalid=" + principalId + ", roledefid=" + roleDefId + ")"))];

          case 1:
            _a.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };

  _RoleAssignments = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("roleassignments")], _RoleAssignments);
  return _RoleAssignments;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._RoleAssignments = _RoleAssignments;
var RoleAssignments = (0, _sharepointqueryable.spInvokableFactory)(_RoleAssignments);
/**
 * Describes a role assignment
 *
 */

exports.RoleAssignments = RoleAssignments;

var _RoleAssignment =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_RoleAssignment, _super);

  function _RoleAssignment() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteable)("ra");
    return _this;
  }

  Object.defineProperty(_RoleAssignment.prototype, "groups", {
    /**
     * Gets the groups that directly belong to the access control list (ACL) for this securable object
     *
     */
    get: function () {
      return _telemetry.tag.configure((0, _types.SiteGroups)(this, "groups"), "ra.groups");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_RoleAssignment.prototype, "bindings", {
    /**
     * Gets the role definition bindings for this role assignment
     *
     */
    get: function () {
      return (0, _sharepointqueryable.SharePointQueryableCollection)(this, "roledefinitionbindings");
    },
    enumerable: false,
    configurable: true
  });
  return _RoleAssignment;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._RoleAssignment = _RoleAssignment;
var RoleAssignment = (0, _sharepointqueryable.spInvokableFactory)(_RoleAssignment);
/**
 * Describes a collection of role definitions
 *
 */

exports.RoleAssignment = RoleAssignment;

var _RoleDefinitions =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_RoleDefinitions, _super);

  function _RoleDefinitions() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets the role definition with the specified id from the collection
   *
   * @param id The id of the role definition
   *
   */


  _RoleDefinitions.prototype.getById = function (id) {
    return RoleDefinition(this, "getById(" + id + ")");
  };
  /**
   * Gets the role definition with the specified name
   *
   * @param name The name of the role definition
   *
   */


  _RoleDefinitions.prototype.getByName = function (name) {
    return RoleDefinition(this, "getbyname('" + name + "')");
  };
  /**
   * Gets the role definition with the specified role type
   *
   * @param roleTypeKind The roletypekind of the role definition (None=0, Guest=1, Reader=2, Contributor=3, WebDesigner=4, Administrator=5, Editor=6, System=7)
   *
   */


  _RoleDefinitions.prototype.getByType = function (roleTypeKind) {
    return RoleDefinition(this, "getbytype(" + roleTypeKind + ")");
  };
  /**
   * Creates a role definition
   *
   * @param name The new role definition's name
   * @param description The new role definition's description
   * @param order The order in which the role definition appears
   * @param basePermissions The permissions mask for this role definition
   *
   */


  _RoleDefinitions.prototype.add = function (name, description, order, basePermissions) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = (0, _odata.body)({
              BasePermissions: (0, _common.assign)((0, _metadata.metadata)("SP.BasePermissions"), basePermissions),
              Description: description,
              Name: name,
              Order: order,
              __metadata: {
                "type": "SP.RoleDefinition"
              }
            });
            return [4
            /*yield*/
            , (0, _operations.spPost)(this, postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              definition: this.getById(data.Id)
            }];
        }
      });
    });
  };

  _RoleDefinitions = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("roledefinitions")], _RoleDefinitions);
  return _RoleDefinitions;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._RoleDefinitions = _RoleDefinitions;
var RoleDefinitions = (0, _sharepointqueryable.spInvokableFactory)(_RoleDefinitions);
/**
 * Describes a role definition
 *
 */

exports.RoleDefinitions = RoleDefinitions;

var _RoleDefinition =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_RoleDefinition, _super);

  function _RoleDefinition() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteable)("rd");
    return _this;
    /* tslint:enable */
  }
  /**
   * Updates this role definition with the supplied properties
   *
   * @param properties A plain object hash of values to update for the role definition
   */

  /* tslint:disable no-string-literal */


  _RoleDefinition.prototype.update = function (properties) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var s, postBody, data, definition, parent_1;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            s = ["BasePermissions"];

            if ((0, _common.hOP)(properties, s[0]) !== undefined) {
              properties[s[0]] = (0, _common.assign)((0, _metadata.metadata)("SP." + s[0]), properties[s[0]]);
            }

            postBody = (0, _odata.body)((0, _common.assign)((0, _metadata.metadata)("SP.RoleDefinition"), properties), (0, _odata.headers)({
              "X-HTTP-Method": "MERGE"
            }));
            return [4
            /*yield*/
            , (0, _operations.spPost)(this, postBody)];

          case 1:
            data = _a.sent();
            definition = this;

            if ((0, _common.hOP)(properties, "Name")) {
              parent_1 = this.getParent(RoleDefinitions, this.parentUrl, "");
              definition = parent_1.getByName(properties["Name"]);
            }

            return [2
            /*return*/
            , {
              data: data,
              definition: definition
            }];
        }
      });
    });
  };

  return _RoleDefinition;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._RoleDefinition = _RoleDefinition;
var RoleDefinition = (0, _sharepointqueryable.spInvokableFactory)(_RoleDefinition);
exports.RoleDefinition = RoleDefinition;
var PermissionKind;
exports.PermissionKind = PermissionKind;

(function (PermissionKind) {
  /**
   * Has no permissions on the Site. Not available through the user interface.
   */
  PermissionKind[PermissionKind["EmptyMask"] = 0] = "EmptyMask";
  /**
   * View items in lists, documents in document libraries, and Web discussion comments.
   */

  PermissionKind[PermissionKind["ViewListItems"] = 1] = "ViewListItems";
  /**
   * Add items to lists, documents to document libraries, and Web discussion comments.
   */

  PermissionKind[PermissionKind["AddListItems"] = 2] = "AddListItems";
  /**
   * Edit items in lists, edit documents in document libraries, edit Web discussion comments
   * in documents, and customize Web Part Pages in document libraries.
   */

  PermissionKind[PermissionKind["EditListItems"] = 3] = "EditListItems";
  /**
   * Delete items from a list, documents from a document library, and Web discussion
   * comments in documents.
   */

  PermissionKind[PermissionKind["DeleteListItems"] = 4] = "DeleteListItems";
  /**
   * Approve a minor version of a list item or document.
   */

  PermissionKind[PermissionKind["ApproveItems"] = 5] = "ApproveItems";
  /**
   * View the source of documents with server-side file handlers.
   */

  PermissionKind[PermissionKind["OpenItems"] = 6] = "OpenItems";
  /**
   * View past versions of a list item or document.
   */

  PermissionKind[PermissionKind["ViewVersions"] = 7] = "ViewVersions";
  /**
   * Delete past versions of a list item or document.
   */

  PermissionKind[PermissionKind["DeleteVersions"] = 8] = "DeleteVersions";
  /**
   * Discard or check in a document which is checked out to another user.
   */

  PermissionKind[PermissionKind["CancelCheckout"] = 9] = "CancelCheckout";
  /**
   * Create, change, and delete personal views of lists.
   */

  PermissionKind[PermissionKind["ManagePersonalViews"] = 10] = "ManagePersonalViews";
  /**
   * Create and delete lists, add or remove columns in a list, and add or remove public views of a list.
   */

  PermissionKind[PermissionKind["ManageLists"] = 12] = "ManageLists";
  /**
   * View forms, views, and application pages, and enumerate lists.
   */

  PermissionKind[PermissionKind["ViewFormPages"] = 13] = "ViewFormPages";
  /**
   * Make content of a list or document library retrieveable for anonymous users through SharePoint search.
   * The list permissions in the site do not change.
   */

  PermissionKind[PermissionKind["AnonymousSearchAccessList"] = 14] = "AnonymousSearchAccessList";
  /**
   * Allow users to open a Site, list, or folder to access items inside that container.
   */

  PermissionKind[PermissionKind["Open"] = 17] = "Open";
  /**
   * View pages in a Site.
   */

  PermissionKind[PermissionKind["ViewPages"] = 18] = "ViewPages";
  /**
   * Add, change, or delete HTML pages or Web Part Pages, and edit the Site using
   * a Windows SharePoint Services compatible editor.
   */

  PermissionKind[PermissionKind["AddAndCustomizePages"] = 19] = "AddAndCustomizePages";
  /**
   * Apply a theme or borders to the entire Site.
   */

  PermissionKind[PermissionKind["ApplyThemeAndBorder"] = 20] = "ApplyThemeAndBorder";
  /**
   * Apply a style sheet (.css file) to the Site.
   */

  PermissionKind[PermissionKind["ApplyStyleSheets"] = 21] = "ApplyStyleSheets";
  /**
   * View reports on Site usage.
   */

  PermissionKind[PermissionKind["ViewUsageData"] = 22] = "ViewUsageData";
  /**
   * Create a Site using Self-Service Site Creation.
   */

  PermissionKind[PermissionKind["CreateSSCSite"] = 23] = "CreateSSCSite";
  /**
   * Create subsites such as team sites, Meeting Workspace sites, and Document Workspace sites.
   */

  PermissionKind[PermissionKind["ManageSubwebs"] = 24] = "ManageSubwebs";
  /**
   * Create a group of users that can be used anywhere within the site collection.
   */

  PermissionKind[PermissionKind["CreateGroups"] = 25] = "CreateGroups";
  /**
   * Create and change permission levels on the Site and assign permissions to users
   * and groups.
   */

  PermissionKind[PermissionKind["ManagePermissions"] = 26] = "ManagePermissions";
  /**
   * Enumerate files and folders in a Site using Microsoft Office SharePoint Designer
   * and WebDAV interfaces.
   */

  PermissionKind[PermissionKind["BrowseDirectories"] = 27] = "BrowseDirectories";
  /**
   * View information about users of the Site.
   */

  PermissionKind[PermissionKind["BrowseUserInfo"] = 28] = "BrowseUserInfo";
  /**
   * Add or remove personal Web Parts on a Web Part Page.
   */

  PermissionKind[PermissionKind["AddDelPrivateWebParts"] = 29] = "AddDelPrivateWebParts";
  /**
   * Update Web Parts to display personalized information.
   */

  PermissionKind[PermissionKind["UpdatePersonalWebParts"] = 30] = "UpdatePersonalWebParts";
  /**
   * Grant the ability to perform all administration tasks for the Site as well as
   * manage content, activate, deactivate, or edit properties of Site scoped Features
   * through the object model or through the user interface (UI). When granted on the
   * root Site of a Site Collection, activate, deactivate, or edit properties of
   * site collection scoped Features through the object model. To browse to the Site
   * Collection Features page and activate or deactivate Site Collection scoped Features
   * through the UI, you must be a Site Collection administrator.
   */

  PermissionKind[PermissionKind["ManageWeb"] = 31] = "ManageWeb";
  /**
   * Content of lists and document libraries in the Web site will be retrieveable for anonymous users through
   * SharePoint search if the list or document library has AnonymousSearchAccessList set.
   */

  PermissionKind[PermissionKind["AnonymousSearchAccessWebLists"] = 32] = "AnonymousSearchAccessWebLists";
  /**
   * Use features that launch client applications. Otherwise, users must work on documents
   * locally and upload changes.
   */

  PermissionKind[PermissionKind["UseClientIntegration"] = 37] = "UseClientIntegration";
  /**
   * Use SOAP, WebDAV, or Microsoft Office SharePoint Designer interfaces to access the Site.
   */

  PermissionKind[PermissionKind["UseRemoteAPIs"] = 38] = "UseRemoteAPIs";
  /**
   * Manage alerts for all users of the Site.
   */

  PermissionKind[PermissionKind["ManageAlerts"] = 39] = "ManageAlerts";
  /**
   * Create e-mail alerts.
   */

  PermissionKind[PermissionKind["CreateAlerts"] = 40] = "CreateAlerts";
  /**
   * Allows a user to change his or her user information, such as adding a picture.
   */

  PermissionKind[PermissionKind["EditMyUserInfo"] = 41] = "EditMyUserInfo";
  /**
   * Enumerate permissions on Site, list, folder, document, or list item.
   */

  PermissionKind[PermissionKind["EnumeratePermissions"] = 63] = "EnumeratePermissions";
  /**
   * Has all permissions on the Site. Not available through the user interface.
   */

  PermissionKind[PermissionKind["FullMask"] = 65] = "FullMask";
})(PermissionKind || (exports.PermissionKind = PermissionKind = {}));
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../site-groups/types":"../node_modules/@pnp/sp/site-groups/types.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/security/funcs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserEffectivePermissions = getUserEffectivePermissions;
exports.getCurrentUserEffectivePermissions = getCurrentUserEffectivePermissions;
exports.breakRoleInheritance = breakRoleInheritance;
exports.resetRoleInheritance = resetRoleInheritance;
exports.userHasPermissions = userHasPermissions;
exports.currentUserHasPermissions = currentUserHasPermissions;
exports.hasPermissions = hasPermissions;

var _tslib = require("tslib");

var _types = require("./types");

var _sharepointqueryable = require("../sharepointqueryable");

var _common = require("@pnp/common");

var _operations = require("../operations");

/**
* Gets the effective permissions for the user supplied
*
* @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
*/
function getUserEffectivePermissions(loginName) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var q, r;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          q = this.clone(_sharepointqueryable.SharePointQueryableInstance, "getUserEffectivePermissions(@user)");
          q.query.set("@user", "'" + encodeURIComponent(loginName) + "'");
          return [4
          /*yield*/
          , q.get()];

        case 1:
          r = _a.sent(); // handle verbose mode

          return [2
          /*return*/
          , (0, _common.hOP)(r, "GetUserEffectivePermissions") ? r.GetUserEffectivePermissions : r];
      }
    });
  });
}
/**
 * Gets the effective permissions for the current user
 */


function getCurrentUserEffectivePermissions() {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var q;
    return (0, _tslib.__generator)(this, function (_a) {
      q = this.clone(_sharepointqueryable.SharePointQueryable, "EffectiveBasePermissions");
      return [2
      /*return*/
      , q.get().then(function (r) {
        // handle verbose mode
        return (0, _common.hOP)(r, "EffectiveBasePermissions") ? r.EffectiveBasePermissions : r;
      })];
    });
  });
}
/**
 * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
 *
 * @param copyRoleAssignments If true the permissions are copied from the current parent scope
 * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
 */


function breakRoleInheritance(copyRoleAssignments, clearSubscopes) {
  if (copyRoleAssignments === void 0) {
    copyRoleAssignments = false;
  }

  if (clearSubscopes === void 0) {
    clearSubscopes = false;
  }

  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , (0, _operations.spPost)(this.clone(_sharepointqueryable.SharePointQueryable, "breakroleinheritance(copyroleassignments=" + copyRoleAssignments + ", clearsubscopes=" + clearSubscopes + ")"))];

        case 1:
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
}
/**
 * Removes the local role assignments so that it re-inherit role assignments from the parent object.
 *
 */


function resetRoleInheritance() {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , (0, _operations.spPost)(this.clone(_sharepointqueryable.SharePointQueryable, "resetroleinheritance"))];

        case 1:
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
}
/**
 * Determines if a given user has the appropriate permissions
 *
 * @param loginName The user to check
 * @param permission The permission being checked
 */


function userHasPermissions(loginName, permission) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var perms;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , getUserEffectivePermissions.call(this, loginName)];

        case 1:
          perms = _a.sent();
          return [2
          /*return*/
          , this.hasPermissions(perms, permission)];
      }
    });
  });
}
/**
 * Determines if the current user has the requested permissions
 *
 * @param permission The permission we wish to check
 */


function currentUserHasPermissions(permission) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var perms;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , getCurrentUserEffectivePermissions.call(this)];

        case 1:
          perms = _a.sent();
          return [2
          /*return*/
          , this.hasPermissions(perms, permission)];
      }
    });
  });
}
/**
 * Taken from sp.js, checks the supplied permissions against the mask
 *
 * @param value The security principal's permissions on the given object
 * @param perm The permission checked against the value
 */

/* tslint:disable:no-bitwise */


function hasPermissions(value, perm) {
  if (!perm) {
    return true;
  }

  if (perm === _types.PermissionKind.FullMask) {
    return (value.High & 32767) === 32767 && value.Low === 65535;
  }

  perm = perm - 1;
  var num = 1;

  if (perm >= 0 && perm < 32) {
    num = num << perm;
    return 0 !== (value.Low & num);
  } else if (perm >= 32 && perm < 64) {
    num = num << perm - 32;
    return 0 !== (value.High & num);
  }

  return false;
}
/* tslint:enable */
},{"tslib":"../node_modules/tslib/tslib.es6.js","./types":"../node_modules/@pnp/sp/security/types.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/common":"../node_modules/@pnp/common/index.js","../operations":"../node_modules/@pnp/sp/operations.js"}],"../node_modules/@pnp/sp/security/item.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../items/types");

var _types2 = require("./types");

var _sharepointqueryable = require("../sharepointqueryable");

var _funcs = require("./funcs");

(0, _odata.addProp)(_types._Item, "roleAssignments", _types2.RoleAssignments);
(0, _odata.addProp)(_types._Item, "firstUniqueAncestorSecurableObject", _sharepointqueryable.SharePointQueryableInstance);
_types._Item.prototype.getUserEffectivePermissions = _funcs.getUserEffectivePermissions;
_types._Item.prototype.getCurrentUserEffectivePermissions = _funcs.getCurrentUserEffectivePermissions;
_types._Item.prototype.breakRoleInheritance = _funcs.breakRoleInheritance;
_types._Item.prototype.resetRoleInheritance = _funcs.resetRoleInheritance;
_types._Item.prototype.userHasPermissions = _funcs.userHasPermissions;
_types._Item.prototype.currentUserHasPermissions = _funcs.currentUserHasPermissions;
_types._Item.prototype.hasPermissions = _funcs.hasPermissions;
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../items/types":"../node_modules/@pnp/sp/items/types.js","./types":"../node_modules/@pnp/sp/security/types.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","./funcs":"../node_modules/@pnp/sp/security/funcs.js"}],"../node_modules/@pnp/sp/security/list.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../lists/types");

var _types2 = require("./types");

var _sharepointqueryable = require("../sharepointqueryable");

var _funcs = require("./funcs");

(0, _odata.addProp)(_types._List, "roleAssignments", _types2.RoleAssignments);
(0, _odata.addProp)(_types._List, "firstUniqueAncestorSecurableObject", _sharepointqueryable.SharePointQueryableInstance);
_types._List.prototype.getUserEffectivePermissions = _funcs.getUserEffectivePermissions;
_types._List.prototype.getCurrentUserEffectivePermissions = _funcs.getCurrentUserEffectivePermissions;
_types._List.prototype.breakRoleInheritance = _funcs.breakRoleInheritance;
_types._List.prototype.resetRoleInheritance = _funcs.resetRoleInheritance;
_types._List.prototype.userHasPermissions = _funcs.userHasPermissions;
_types._List.prototype.currentUserHasPermissions = _funcs.currentUserHasPermissions;
_types._List.prototype.hasPermissions = _funcs.hasPermissions;
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","./types":"../node_modules/@pnp/sp/security/types.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","./funcs":"../node_modules/@pnp/sp/security/funcs.js"}],"../node_modules/@pnp/sp/security/web.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../webs/types");

var _types2 = require("./types");

var _sharepointqueryable = require("../sharepointqueryable");

var _funcs = require("./funcs");

(0, _odata.addProp)(_types._Web, "roleDefinitions", _types2.RoleDefinitions);
(0, _odata.addProp)(_types._Web, "roleAssignments", _types2.RoleAssignments);
(0, _odata.addProp)(_types._Web, "firstUniqueAncestorSecurableObject", _sharepointqueryable.SharePointQueryableInstance);
_types._Web.prototype.getUserEffectivePermissions = _funcs.getUserEffectivePermissions;
_types._Web.prototype.getCurrentUserEffectivePermissions = _funcs.getCurrentUserEffectivePermissions;
_types._Web.prototype.breakRoleInheritance = _funcs.breakRoleInheritance;
_types._Web.prototype.resetRoleInheritance = _funcs.resetRoleInheritance;
_types._Web.prototype.userHasPermissions = _funcs.userHasPermissions;
_types._Web.prototype.currentUserHasPermissions = _funcs.currentUserHasPermissions;
_types._Web.prototype.hasPermissions = _funcs.hasPermissions;
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/security/types.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","./funcs":"../node_modules/@pnp/sp/security/funcs.js"}],"../node_modules/@pnp/sp/security/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RoleAssignment", {
  enumerable: true,
  get: function () {
    return _types.RoleAssignment;
  }
});
Object.defineProperty(exports, "RoleAssignments", {
  enumerable: true,
  get: function () {
    return _types.RoleAssignments;
  }
});
Object.defineProperty(exports, "RoleDefinition", {
  enumerable: true,
  get: function () {
    return _types.RoleDefinition;
  }
});
Object.defineProperty(exports, "RoleDefinitions", {
  enumerable: true,
  get: function () {
    return _types.RoleDefinitions;
  }
});
Object.defineProperty(exports, "PermissionKind", {
  enumerable: true,
  get: function () {
    return _types.PermissionKind;
  }
});

require("./item");

require("./list");

require("./web");

var _types = require("./types");
},{"./item":"../node_modules/@pnp/sp/security/item.js","./list":"../node_modules/@pnp/sp/security/list.js","./web":"../node_modules/@pnp/sp/security/web.js","./types":"../node_modules/@pnp/sp/security/types.js"}],"../node_modules/@pnp/sp/sharing/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoleType = exports.SharingLinkKind = exports.SharingOperationStatusCode = exports.SharingDomainRestrictionMode = exports.SPSharedObjectType = exports.SharingRole = void 0;

/**
 * Indicates the role of the sharing link
 */
var SharingRole;
exports.SharingRole = SharingRole;

(function (SharingRole) {
  SharingRole[SharingRole["None"] = 0] = "None";
  SharingRole[SharingRole["View"] = 1] = "View";
  SharingRole[SharingRole["Edit"] = 2] = "Edit";
  SharingRole[SharingRole["Owner"] = 3] = "Owner";
})(SharingRole || (exports.SharingRole = SharingRole = {}));

var SPSharedObjectType;
exports.SPSharedObjectType = SPSharedObjectType;

(function (SPSharedObjectType) {
  SPSharedObjectType[SPSharedObjectType["Unknown"] = 0] = "Unknown";
  SPSharedObjectType[SPSharedObjectType["File"] = 1] = "File";
  SPSharedObjectType[SPSharedObjectType["Folder"] = 2] = "Folder";
  SPSharedObjectType[SPSharedObjectType["Item"] = 3] = "Item";
  SPSharedObjectType[SPSharedObjectType["List"] = 4] = "List";
  SPSharedObjectType[SPSharedObjectType["Web"] = 5] = "Web";
  SPSharedObjectType[SPSharedObjectType["Max"] = 6] = "Max";
})(SPSharedObjectType || (exports.SPSharedObjectType = SPSharedObjectType = {}));

var SharingDomainRestrictionMode;
exports.SharingDomainRestrictionMode = SharingDomainRestrictionMode;

(function (SharingDomainRestrictionMode) {
  SharingDomainRestrictionMode[SharingDomainRestrictionMode["None"] = 0] = "None";
  SharingDomainRestrictionMode[SharingDomainRestrictionMode["AllowList"] = 1] = "AllowList";
  SharingDomainRestrictionMode[SharingDomainRestrictionMode["BlockList"] = 2] = "BlockList";
})(SharingDomainRestrictionMode || (exports.SharingDomainRestrictionMode = SharingDomainRestrictionMode = {}));

var SharingOperationStatusCode;
exports.SharingOperationStatusCode = SharingOperationStatusCode;

(function (SharingOperationStatusCode) {
  /**
   * The share operation completed without errors.
   */
  SharingOperationStatusCode[SharingOperationStatusCode["CompletedSuccessfully"] = 0] = "CompletedSuccessfully";
  /**
   * The share operation completed and generated requests for access.
   */

  SharingOperationStatusCode[SharingOperationStatusCode["AccessRequestsQueued"] = 1] = "AccessRequestsQueued";
  /**
   * The share operation failed as there were no resolved users.
   */

  SharingOperationStatusCode[SharingOperationStatusCode["NoResolvedUsers"] = -1] = "NoResolvedUsers";
  /**
   * The share operation failed due to insufficient permissions.
   */

  SharingOperationStatusCode[SharingOperationStatusCode["AccessDenied"] = -2] = "AccessDenied";
  /**
   * The share operation failed when attempting a cross site share, which is not supported.
   */

  SharingOperationStatusCode[SharingOperationStatusCode["CrossSiteRequestNotSupported"] = -3] = "CrossSiteRequestNotSupported";
  /**
   * The sharing operation failed due to an unknown error.
   */

  SharingOperationStatusCode[SharingOperationStatusCode["UnknowError"] = -4] = "UnknowError";
  /**
   * The text you typed is too long. Please shorten it.
   */

  SharingOperationStatusCode[SharingOperationStatusCode["EmailBodyTooLong"] = -5] = "EmailBodyTooLong";
  /**
   * The maximum number of unique scopes in the list has been exceeded.
   */

  SharingOperationStatusCode[SharingOperationStatusCode["ListUniqueScopesExceeded"] = -6] = "ListUniqueScopesExceeded";
  /**
   * The share operation failed because a sharing capability is disabled in the site.
   */

  SharingOperationStatusCode[SharingOperationStatusCode["CapabilityDisabled"] = -7] = "CapabilityDisabled";
  /**
   * The specified object for the share operation is not supported.
   */

  SharingOperationStatusCode[SharingOperationStatusCode["ObjectNotSupported"] = -8] = "ObjectNotSupported";
  /**
   * A SharePoint group cannot contain another SharePoint group.
   */

  SharingOperationStatusCode[SharingOperationStatusCode["NestedGroupsNotSupported"] = -9] = "NestedGroupsNotSupported";
})(SharingOperationStatusCode || (exports.SharingOperationStatusCode = SharingOperationStatusCode = {}));

var SharingLinkKind;
exports.SharingLinkKind = SharingLinkKind;

(function (SharingLinkKind) {
  /**
   * Uninitialized link
   */
  SharingLinkKind[SharingLinkKind["Uninitialized"] = 0] = "Uninitialized";
  /**
   * Direct link to the object being shared
   */

  SharingLinkKind[SharingLinkKind["Direct"] = 1] = "Direct";
  /**
   * Organization-shareable link to the object being shared with view permissions
   */

  SharingLinkKind[SharingLinkKind["OrganizationView"] = 2] = "OrganizationView";
  /**
   * Organization-shareable link to the object being shared with edit permissions
   */

  SharingLinkKind[SharingLinkKind["OrganizationEdit"] = 3] = "OrganizationEdit";
  /**
   * View only anonymous link
   */

  SharingLinkKind[SharingLinkKind["AnonymousView"] = 4] = "AnonymousView";
  /**
   * Read/Write anonymous link
   */

  SharingLinkKind[SharingLinkKind["AnonymousEdit"] = 5] = "AnonymousEdit";
  /**
   * Flexible sharing Link where properties can change without affecting link URL
   */

  SharingLinkKind[SharingLinkKind["Flexible"] = 6] = "Flexible";
})(SharingLinkKind || (exports.SharingLinkKind = SharingLinkKind = {}));

var RoleType;
exports.RoleType = RoleType;

(function (RoleType) {
  RoleType[RoleType["None"] = 0] = "None";
  RoleType[RoleType["Guest"] = 1] = "Guest";
  RoleType[RoleType["Reader"] = 2] = "Reader";
  RoleType[RoleType["Contributor"] = 3] = "Contributor";
  RoleType[RoleType["WebDesigner"] = 4] = "WebDesigner";
  RoleType[RoleType["Administrator"] = 5] = "Administrator";
})(RoleType || (exports.RoleType = RoleType = {}));
},{}],"../node_modules/@pnp/sp/sharing/funcs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shareObject = shareObject;
exports.getShareLink = getShareLink;
exports.checkPermissions = checkPermissions;
exports.getSharingInformation = getSharingInformation;
exports.getObjectSharingSettings = getObjectSharingSettings;
exports.unshareObject = unshareObject;
exports.deleteLinkByKind = deleteLinkByKind;
exports.unshareLink = unshareLink;
exports.shareWith = shareWith;

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _common = require("@pnp/common");

var _sharepointqueryable = require("../sharepointqueryable");

var _extractweburl = require("../utils/extractweburl");

var _types = require("../webs/types");

var _types2 = require("./types");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _types3 = require("../security/types");

var _splibconfig = require("../splibconfig");

/**
 * Shares an object based on the supplied options
 *
 * @param options The set of options to send to the ShareObject method
 * @param bypass If true any processing is skipped and the options are sent directly to the ShareObject method
 */
function shareObject(o, options, bypass) {
  if (bypass === void 0) {
    bypass = false;
  }

  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var roleValue, userStr, postBody;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (bypass) {
            // if the bypass flag is set send the supplied parameters directly to the service
            return [2
            /*return*/
            , sendShareObjectRequest(o, options)];
          } // extend our options with some defaults


          options = (0, _common.assign)(options, {
            group: null,
            includeAnonymousLinkInEmail: false,
            propagateAcl: false,
            useSimplifiedRoles: true
          }, true);
          return [4
          /*yield*/
          , getRoleValue(options.role, options.group)];

        case 1:
          roleValue = _a.sent(); // handle the multiple input types

          if (!Array.isArray(options.loginNames)) {
            options.loginNames = [options.loginNames];
          }

          userStr = (0, _common.jsS)(options.loginNames.map(function (Key) {
            return {
              Key: Key
            };
          }));
          postBody = {
            peoplePickerInput: userStr,
            roleValue: roleValue,
            url: options.url
          };

          if (options.emailData !== undefined && options.emailData !== null) {
            postBody = (0, _common.assign)(postBody, {
              emailBody: options.emailData.body,
              emailSubject: options.emailData.subject !== undefined ? options.emailData.subject : "Shared with you.",
              sendEmail: true
            });
          }

          return [2
          /*return*/
          , sendShareObjectRequest(o, postBody)];
      }
    });
  });
}
/**
 * Gets a sharing link for the supplied
 *
 * @param kind The kind of link to share
 * @param expiration The optional expiration for this link
 */


function getShareLink(kind, expiration) {
  if (expiration === void 0) {
    expiration = null;
  } // date needs to be an ISO string or null


  var expString = expiration !== null ? expiration.toISOString() : null; // clone using the factory and send the request

  var o = _telemetry.tag.configure(this.clone(_sharepointqueryable.SharePointQueryableInstance, "shareLink"), "sh.getShareLink");

  return (0, _operations.spPost)(o, (0, _odata.body)({
    request: {
      createLink: true,
      emailData: null,
      settings: {
        expiration: expString,
        linkKind: kind
      }
    }
  }));
}
/**
 * Checks Permissions on the list of Users and returns back role the users have on the Item.
 *
 * @param recipients The array of Entities for which Permissions need to be checked.
 */


function checkPermissions(recipients) {
  var o = _telemetry.tag.configure(this.clone(_sharepointqueryable.SharePointQueryableInstance, "checkPermissions"), "sh.checkPermissions");

  return (0, _operations.spPost)(o, (0, _odata.body)({
    recipients: recipients
  }));
}
/**
 * Get Sharing Information.
 *
 * @param request The SharingInformationRequest Object.
 * @param expands Expand more fields.
 *
 */


function getSharingInformation(request, expands) {
  if (request === void 0) {
    request = null;
  }

  if (expands === void 0) {
    expands = [];
  }

  var o = _telemetry.tag.configure(this.clone(_sharepointqueryable.SharePointQueryableInstance, "getSharingInformation"), "sh.getSharingInformation");

  return (0, _operations.spPost)(o.expand.apply(o, (0, _tslib.__spread)(expands)), (0, _odata.body)({
    request: request
  }));
}
/**
 * Gets the sharing settings of an item.
 *
 * @param useSimplifiedRoles Determines whether to use simplified roles.
 */


function getObjectSharingSettings(useSimplifiedRoles) {
  if (useSimplifiedRoles === void 0) {
    useSimplifiedRoles = true;
  }

  var o = _telemetry.tag.configure(this.clone(_sharepointqueryable.SharePointQueryableInstance, "getObjectSharingSettings"), "sh.getObjectSharingSettings");

  return (0, _operations.spPost)(o, (0, _odata.body)({
    useSimplifiedRoles: useSimplifiedRoles
  }));
}
/**
 * Unshares this object
 */


function unshareObject() {
  return (0, _operations.spPost)(_telemetry.tag.configure(this.clone(_sharepointqueryable.SharePointQueryableInstance, "unshareObject"), "sh.unshareObject"));
}
/**
 * Deletes a link by type
 *
 * @param kind Deletes a sharing link by the kind of link
 */


function deleteLinkByKind(linkKind) {
  return (0, _operations.spPost)(_telemetry.tag.configure(this.clone(_sharepointqueryable.SharePointQueryableInstance, "deleteLinkByKind"), "sh.deleteLinkByKind"), (0, _odata.body)({
    linkKind: linkKind
  }));
}
/**
 * Removes the specified link to the item.
 *
 * @param kind The kind of link to be deleted.
 * @param shareId
 */


function unshareLink(linkKind, shareId) {
  if (shareId === void 0) {
    shareId = _splibconfig.emptyGuid;
  }

  return (0, _operations.spPost)(_telemetry.tag.configure(this.clone(_sharepointqueryable.SharePointQueryableInstance, "unshareLink"), "sh.unshareLink"), (0, _odata.body)({
    linkKind: linkKind,
    shareId: shareId
  }));
}
/**
 * Shares this instance with the supplied users
 *
 * @param loginNames Resolved login names to share
 * @param role The role
 * @param requireSignin True to require the user is authenticated, otherwise false
 * @param propagateAcl True to apply this share to all children
 * @param emailData If supplied an email will be sent with the indicated properties
 */


function shareWith(o, loginNames, role, requireSignin, propagateAcl, emailData) {
  if (requireSignin === void 0) {
    requireSignin = false;
  }

  if (propagateAcl === void 0) {
    propagateAcl = false;
  }

  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var userStr, roleFilter, w, def, postBody;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          // handle the multiple input types
          if (!Array.isArray(loginNames)) {
            loginNames = [loginNames];
          }

          userStr = (0, _common.jsS)(loginNames.map(function (login) {
            return {
              Key: login
            };
          }));
          roleFilter = role === _types2.SharingRole.Edit ? _types2.RoleType.Contributor : _types2.RoleType.Reader;
          w = (0, _sharepointqueryable.SharePointQueryableCollection)("_api/web", "roledefinitions");
          return [4
          /*yield*/
          , w.select("Id").filter("RoleTypeKind eq " + roleFilter).get()];

        case 1:
          def = _a.sent();

          if (!Array.isArray(def) || def.length < 1) {
            throw Error("Could not locate a role defintion with RoleTypeKind " + roleFilter);
          }

          postBody = {
            includeAnonymousLinkInEmail: requireSignin,
            peoplePickerInput: userStr,
            propagateAcl: propagateAcl,
            roleValue: "role:" + def[0].Id,
            useSimplifiedRoles: true
          };

          if (emailData !== undefined) {
            postBody = (0, _common.assign)(postBody, {
              emailBody: emailData.body,
              emailSubject: emailData.subject !== undefined ? emailData.subject : "",
              sendEmail: true
            });
          }

          return [2
          /*return*/
          , (0, _operations.spPost)(_telemetry.tag.configure(o.clone(_sharepointqueryable.SharePointQueryableInstance, "shareObject"), "sh.shareWith"), (0, _odata.body)(postBody))];
      }
    });
  });
}

function sendShareObjectRequest(o, options) {
  var w = _telemetry.tag.configure((0, _types.Web)((0, _extractweburl.extractWebUrl)(o.toUrl()), "/_api/SP.Web.ShareObject"), "sh.sendShareObjectRequest");

  return (0, _operations.spPost)(w.expand("UsersWithAccessRequests", "GroupsSharedWith"), (0, _odata.body)(options));
}
/**
 * Calculates the roleValue string used in the sharing query
 *
 * @param role The Sharing Role
 * @param group The Group type
 */


function getRoleValue(role, group) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var _a, g1, g2, roleFilter, def;

    return (0, _tslib.__generator)(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!(group !== undefined && group !== null)) return [3
          /*break*/
          , 7];
          _a = group;

          switch (_a) {
            case _types2.RoleType.Contributor:
              return [3
              /*break*/
              , 1];

            case _types2.RoleType.Reader:
              return [3
              /*break*/
              , 3];

            case _types2.RoleType.Guest:
              return [3
              /*break*/
              , 3];
          }

          return [3
          /*break*/
          , 5];

        case 1:
          return [4
          /*yield*/
          , (0, _types.Web)("_api/web", "associatedmembergroup").select("Id")()];

        case 2:
          g1 = _b.sent();
          return [2
          /*return*/
          , "group: " + g1.Id];

        case 3:
          return [4
          /*yield*/
          , (0, _types.Web)("_api/web", "associatedvisitorgroup").select("Id")()];

        case 4:
          g2 = _b.sent();
          return [2
          /*return*/
          , "group: " + g2.Id];

        case 5:
          throw Error("Could not determine role value for supplied value. Contributor, Reader, and Guest are supported");

        case 6:
          return [3
          /*break*/
          , 9];

        case 7:
          roleFilter = role === _types2.SharingRole.Edit ? _types2.RoleType.Contributor : _types2.RoleType.Reader;
          return [4
          /*yield*/
          , (0, _types3.RoleDefinitions)("_api/web").select("Id").top(1).filter("RoleTypeKind eq " + roleFilter)()];

        case 8:
          def = _b.sent();

          if (def.length < 1) {
            throw Error("Could not locate associated role definition for supplied role. Edit and View are supported");
          }

          return [2
          /*return*/
          , "role: " + def[0].Id];

        case 9:
          return [2
          /*return*/
          ];
      }
    });
  });
}
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","@pnp/common":"../node_modules/@pnp/common/index.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/sharing/types.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js","../security/types":"../node_modules/@pnp/sp/security/types.js","../splibconfig":"../node_modules/@pnp/sp/splibconfig.js"}],"../node_modules/@pnp/sp/sharing/file.js":[function(require,module,exports) {
"use strict";

var _types = require("../files/types");

var _types2 = require("./types");

var _funcs = require("./funcs");

_types._File.prototype.shareWith = function (loginNames, role, requireSignin, emailData) {
  if (role === void 0) {
    role = _types2.SharingRole.View;
  }

  if (requireSignin === void 0) {
    requireSignin = false;
  }

  return (0, _funcs.shareWith)(this, loginNames, role, requireSignin, false, emailData);
};

_types._File.prototype.getShareLink = _funcs.getShareLink;
_types._File.prototype.checkSharingPermissions = _funcs.checkPermissions;
_types._File.prototype.getSharingInformation = _funcs.getSharingInformation;
_types._File.prototype.getObjectSharingSettings = _funcs.getObjectSharingSettings;
_types._File.prototype.unshare = _funcs.unshareObject;
_types._File.prototype.deleteSharingLinkByKind = _funcs.deleteLinkByKind;
_types._File.prototype.unshareLink = _funcs.unshareLink;
},{"../files/types":"../node_modules/@pnp/sp/files/types.js","./types":"../node_modules/@pnp/sp/sharing/types.js","./funcs":"../node_modules/@pnp/sp/sharing/funcs.js"}],"../node_modules/@pnp/sp/sharing/folder.js":[function(require,module,exports) {
"use strict";

var _tslib = require("tslib");

var _types = require("../folders/types");

var _types2 = require("./types");

_types._Folder.prototype.shareWith = function (loginNames, role, requireSignin, shareEverything, emailData) {
  if (role === void 0) {
    role = _types2.SharingRole.View;
  }

  if (requireSignin === void 0) {
    requireSignin = false;
  }

  if (shareEverything === void 0) {
    shareEverything = false;
  }

  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var dependency, shareable;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          dependency = this.addBatchDependency();
          return [4
          /*yield*/
          , this.getShareable()];

        case 1:
          shareable = _a.sent();
          dependency();
          return [2
          /*return*/
          , shareable.shareWith(loginNames, role, requireSignin, shareEverything, emailData)];
      }
    });
  });
};

_types._Folder.prototype.getShareLink = function (kind, expiration) {
  if (expiration === void 0) {
    expiration = null;
  }

  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var dependency, shareable;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          dependency = this.addBatchDependency();
          return [4
          /*yield*/
          , this.getShareable()];

        case 1:
          shareable = _a.sent();
          dependency();
          return [2
          /*return*/
          , shareable.getShareLink(kind, expiration)];
      }
    });
  });
};

_types._Folder.prototype.checkSharingPermissions = function (recipients) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var dependency, shareable;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          dependency = this.addBatchDependency();
          return [4
          /*yield*/
          , this.getShareable()];

        case 1:
          shareable = _a.sent();
          dependency();
          return [2
          /*return*/
          , shareable.checkSharingPermissions(recipients)];
      }
    });
  });
};

_types._Folder.prototype.getSharingInformation = function (request, expands) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var dependency, shareable;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          dependency = this.addBatchDependency();
          return [4
          /*yield*/
          , this.getShareable()];

        case 1:
          shareable = _a.sent();
          dependency();
          return [2
          /*return*/
          , shareable.getSharingInformation(request, expands)];
      }
    });
  });
};

_types._Folder.prototype.getObjectSharingSettings = function (useSimplifiedRoles) {
  if (useSimplifiedRoles === void 0) {
    useSimplifiedRoles = true;
  }

  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var dependency, shareable;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          dependency = this.addBatchDependency();
          return [4
          /*yield*/
          , this.getShareable()];

        case 1:
          shareable = _a.sent();
          dependency();
          return [2
          /*return*/
          , shareable.getObjectSharingSettings(useSimplifiedRoles)];
      }
    });
  });
};

_types._Folder.prototype.unshare = function () {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var dependency, shareable;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          dependency = this.addBatchDependency();
          return [4
          /*yield*/
          , this.getShareable()];

        case 1:
          shareable = _a.sent();
          dependency();
          return [2
          /*return*/
          , shareable.unshare()];
      }
    });
  });
};

_types._Folder.prototype.deleteSharingLinkByKind = function (kind) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var dependency, shareable;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          dependency = this.addBatchDependency();
          return [4
          /*yield*/
          , this.getShareable()];

        case 1:
          shareable = _a.sent();
          dependency();
          return [2
          /*return*/
          , shareable.deleteSharingLinkByKind(kind)];
      }
    });
  });
};

_types._Folder.prototype.unshareLink = function (kind, shareId) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var dependency, shareable;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          dependency = this.addBatchDependency();
          return [4
          /*yield*/
          , this.getShareable()];

        case 1:
          shareable = _a.sent();
          dependency();
          return [2
          /*return*/
          , shareable.unshareLink(kind, shareId)];
      }
    });
  });
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","../folders/types":"../node_modules/@pnp/sp/folders/types.js","./types":"../node_modules/@pnp/sp/sharing/types.js"}],"../node_modules/@pnp/sp/sharing/item.js":[function(require,module,exports) {
"use strict";

var _types = require("../items/types");

var _types2 = require("./types");

var _funcs = require("./funcs");

_types._Item.prototype.shareWith = function (loginNames, role, requireSignin, emailData) {
  if (role === void 0) {
    role = _types2.SharingRole.View;
  }

  if (requireSignin === void 0) {
    requireSignin = false;
  }

  return (0, _funcs.shareWith)(this, loginNames, role, requireSignin, false, emailData);
};

_types._Item.prototype.getShareLink = _funcs.getShareLink;
_types._Item.prototype.checkSharingPermissions = _funcs.checkPermissions;
_types._Item.prototype.getSharingInformation = _funcs.getSharingInformation;
_types._Item.prototype.getObjectSharingSettings = _funcs.getObjectSharingSettings;
_types._Item.prototype.unshare = _funcs.unshareObject;
_types._Item.prototype.deleteSharingLinkByKind = _funcs.deleteLinkByKind;
_types._Item.prototype.unshareLink = _funcs.unshareLink;
},{"../items/types":"../node_modules/@pnp/sp/items/types.js","./types":"../node_modules/@pnp/sp/sharing/types.js","./funcs":"../node_modules/@pnp/sp/sharing/funcs.js"}],"../node_modules/@pnp/sp/sharing/web.js":[function(require,module,exports) {
"use strict";

var _tslib = require("tslib");

var _types = require("../webs/types");

var _types2 = require("./types");

var _sharepointqueryable = require("../sharepointqueryable");

var _extractweburl = require("../utils/extractweburl");

var _funcs = require("./funcs");

var _common = require("@pnp/common");

var _odata = require("@pnp/odata");

var _operations = require("../operations");

/**
 * Shares this web with the supplied users
 * @param loginNames The resolved login names to share
 * @param role The role to share this web
 * @param emailData Optional email data
 */
_types._Web.prototype.shareWith = function (loginNames, role, emailData) {
  if (role === void 0) {
    role = _types2.SharingRole.View;
  }

  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var dependency, web, url;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          dependency = this.addBatchDependency();
          web = new _sharepointqueryable._SharePointQueryableInstance((0, _extractweburl.extractWebUrl)(this.toUrl()), "/_api/web/url");
          return [4
          /*yield*/
          , web.get()];

        case 1:
          url = _a.sent();
          dependency();
          return [2
          /*return*/
          , this.shareObject((0, _common.combine)(url, "/_layouts/15/aclinv.aspx?forSharing=1&mbypass=1"), loginNames, role, emailData)];
      }
    });
  });
};
/**
 * Provides direct access to the static web.ShareObject method
 *
 * @param url The url to share
 * @param loginNames Resolved loginnames string[] of a single login name string
 * @param roleValue Role value
 * @param emailData Optional email data
 * @param groupId Optional group id
 * @param propagateAcl
 * @param includeAnonymousLinkInEmail
 * @param useSimplifiedRoles
 */


_types._Web.prototype.shareObject = function (url, loginNames, role, emailData, group, propagateAcl, includeAnonymousLinkInEmail, useSimplifiedRoles) {
  if (propagateAcl === void 0) {
    propagateAcl = false;
  }

  if (includeAnonymousLinkInEmail === void 0) {
    includeAnonymousLinkInEmail = false;
  }

  if (useSimplifiedRoles === void 0) {
    useSimplifiedRoles = true;
  }

  return (0, _funcs.shareObject)(this, {
    emailData: emailData,
    group: group,
    includeAnonymousLinkInEmail: includeAnonymousLinkInEmail,
    loginNames: loginNames,
    propagateAcl: propagateAcl,
    role: role,
    url: url,
    useSimplifiedRoles: useSimplifiedRoles
  });
};
/**
 * Supplies a method to pass any set of arguments to ShareObject
 *
 * @param options The set of options to send to ShareObject
 */


_types._Web.prototype.shareObjectRaw = function (options) {
  return (0, _funcs.shareObject)(this, options, true);
};
/**
 * Supplies a method to pass any set of arguments to ShareObject
 *
 * @param options The set of options to send to ShareObject
 */


_types._Web.prototype.unshareObject = function (url) {
  return (0, _operations.spPost)((0, _types.Web)(this, "unshareObject"), (0, _odata.body)({
    url: url
  }));
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/sharing/types.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","./funcs":"../node_modules/@pnp/sp/sharing/funcs.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../operations":"../node_modules/@pnp/sp/operations.js"}],"../node_modules/@pnp/sp/sharing/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SPSharedObjectType", {
  enumerable: true,
  get: function () {
    return _types.SPSharedObjectType;
  }
});
Object.defineProperty(exports, "SharingDomainRestrictionMode", {
  enumerable: true,
  get: function () {
    return _types.SharingDomainRestrictionMode;
  }
});
Object.defineProperty(exports, "SharingLinkKind", {
  enumerable: true,
  get: function () {
    return _types.SharingLinkKind;
  }
});
Object.defineProperty(exports, "SharingOperationStatusCode", {
  enumerable: true,
  get: function () {
    return _types.SharingOperationStatusCode;
  }
});
Object.defineProperty(exports, "SharingRole", {
  enumerable: true,
  get: function () {
    return _types.SharingRole;
  }
});
Object.defineProperty(exports, "RoleType", {
  enumerable: true,
  get: function () {
    return _types.RoleType;
  }
});

require("./file");

require("./folder");

require("./item");

require("./web");

var _types = require("./types");
},{"./file":"../node_modules/@pnp/sp/sharing/file.js","./folder":"../node_modules/@pnp/sp/sharing/folder.js","./item":"../node_modules/@pnp/sp/sharing/item.js","./web":"../node_modules/@pnp/sp/sharing/web.js","./types":"../node_modules/@pnp/sp/sharing/types.js"}],"../node_modules/@pnp/sp/site-designs/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SiteDesigns = exports._SiteDesigns = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _extractweburl = require("../utils/extractweburl");

var _odata = require("@pnp/odata");

var _operations = require("../operations");

var _common = require("@pnp/common");

var _telemetry = require("../telemetry");

var _SiteDesigns =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_SiteDesigns, _super);

  function _SiteDesigns(baseUrl, methodName) {
    if (methodName === void 0) {
      methodName = "";
    }

    var _this = this;

    var url = typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl();
    _this = _super.call(this, (0, _extractweburl.extractWebUrl)(url), "_api/Microsoft.Sharepoint.Utilities.WebTemplateExtensions.SiteScriptUtility." + methodName) || this;
    return _this;
  }

  _SiteDesigns.prototype.execute = function (props) {
    return (0, _operations.spPost)(this, (0, _odata.body)(props, (0, _odata.headers)({
      "Content-Type": "application/json;charset=utf-8"
    })));
  };
  /**
   * Creates a new site design available to users when they create a new site from the SharePoint home page.
   *
   * @param creationInfo A sitedesign creation information object
   */


  _SiteDesigns.prototype.createSiteDesign = function (creationInfo) {
    return this.clone(SiteDesignsCloneFactory, "CreateSiteDesign").execute({
      info: creationInfo
    });
  };
  /**
   * Applies a site design to an existing site collection.
   *
   * @param siteDesignId The ID of the site design to apply.
   * @param webUrl The URL of the site collection where you want to apply the site design.
   */


  _SiteDesigns.prototype.applySiteDesign = function (siteDesignId, webUrl) {
    return this.clone(SiteDesignsCloneFactory, "ApplySiteDesign").execute({
      siteDesignId: siteDesignId,
      "webUrl": webUrl
    });
  };
  /**
   * Gets the list of available site designs
   */


  _SiteDesigns.prototype.getSiteDesigns = function () {
    return this.clone(SiteDesignsCloneFactory, "GetSiteDesigns").execute({});
  };
  /**
   * Gets information about a specific site design.
   * @param id The ID of the site design to get information about.
   */


  _SiteDesigns.prototype.getSiteDesignMetadata = function (id) {
    return this.clone(SiteDesignsCloneFactory, "GetSiteDesignMetadata").execute({
      id: id
    });
  };
  /**
   * Updates a site design with new values. In the REST call, all parameters are optional except the site script Id.
   * If you had previously set the IsDefault parameter to TRUE and wish it to remain true, you must pass in this parameter again (otherwise it will be reset to FALSE).
   * @param updateInfo A sitedesign update information object
   */


  _SiteDesigns.prototype.updateSiteDesign = function (updateInfo) {
    return this.clone(SiteDesignsCloneFactory, "UpdateSiteDesign").execute({
      updateInfo: updateInfo
    });
  };
  /**
   * Deletes a site design.
   * @param id The ID of the site design to delete.
   */


  _SiteDesigns.prototype.deleteSiteDesign = function (id) {
    return this.clone(SiteDesignsCloneFactory, "DeleteSiteDesign").execute({
      id: id
    });
  };
  /**
   * Gets a list of principals that have access to a site design.
   * @param id The ID of the site design to get rights information from.
   */


  _SiteDesigns.prototype.getSiteDesignRights = function (id) {
    return this.clone(SiteDesignsCloneFactory, "GetSiteDesignRights").execute({
      id: id
    });
  };
  /**
   * Grants access to a site design for one or more principals.
   * @param id The ID of the site design to grant rights on.
   * @param principalNames An array of one or more principals to grant view rights.
   *                       Principals can be users or mail-enabled security groups in the form of "alias" or "alias@<domain name>.com"
   * @param grantedRights Always set to 1. This represents the View right.
   */


  _SiteDesigns.prototype.grantSiteDesignRights = function (id, principalNames, grantedRights) {
    if (grantedRights === void 0) {
      grantedRights = 1;
    }

    return this.clone(SiteDesignsCloneFactory, "GrantSiteDesignRights").execute({
      "grantedRights": grantedRights.toString(),
      "id": id,
      "principalNames": principalNames
    });
  };
  /**
   * Revokes access from a site design for one or more principals.
   * @param id The ID of the site design to revoke rights from.
   * @param principalNames An array of one or more principals to revoke view rights from.
   *                       If all principals have rights revoked on the site design, the site design becomes viewable to everyone.
   */


  _SiteDesigns.prototype.revokeSiteDesignRights = function (id, principalNames) {
    return this.clone(SiteDesignsCloneFactory, "RevokeSiteDesignRights").execute({
      "id": id,
      "principalNames": principalNames
    });
  };
  /**
   * Adds a site design task on the specified web url to be invoked asynchronously.
   * @param webUrl The absolute url of the web on where to create the task
   * @param siteDesignId The ID of the site design to create a task for
   */


  _SiteDesigns.prototype.addSiteDesignTask = function (webUrl, siteDesignId) {
    return this.clone(SiteDesignsCloneFactory, "AddSiteDesignTask").execute({
      "webUrl": webUrl,
      "siteDesignId": siteDesignId
    });
  };
  /**
   * Adds a site design task on the current web to be invoked asynchronously.
   * @param siteDesignId The ID of the site design to create a task for
   */


  _SiteDesigns.prototype.addSiteDesignTaskToCurrentWeb = function (siteDesignId) {
    return this.clone(SiteDesignsCloneFactory, "AddSiteDesignTaskToCurrentWeb").execute({
      "siteDesignId": siteDesignId
    });
  };
  /**
   * Retrieves the site design task, if the task has finished running null will be returned
   * @param id The ID of the site design task
   */


  _SiteDesigns.prototype.getSiteDesignTask = function (id) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var task;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.clone(SiteDesignsCloneFactory, "GetSiteDesignTask").execute({
              "taskId": id
            })];

          case 1:
            task = _a.sent();
            return [2
            /*return*/
            , (0, _common.hOP)(task, "ID") ? task : null];
        }
      });
    });
  };
  /**
   * Retrieves a list of site design that have run on a specific web
   * @param webUrl The url of the web where the site design was applied
   * @param siteDesignId (Optional) the site design ID, if not provided will return all site design runs
   */


  _SiteDesigns.prototype.getSiteDesignRun = function (webUrl, siteDesignId) {
    return this.clone(SiteDesignsCloneFactory, "GetSiteDesignRun").execute({
      "webUrl": webUrl,
      siteDesignId: siteDesignId
    });
  };
  /**
   * Retrieves the status of a site design that has been run or is still running
   * @param webUrl The url of the web where the site design was applied
   * @param runId the run ID
   */


  _SiteDesigns.prototype.getSiteDesignRunStatus = function (webUrl, runId) {
    return this.clone(SiteDesignsCloneFactory, "GetSiteDesignRunStatus").execute({
      "webUrl": webUrl,
      runId: runId
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.createSiteDesign")], _SiteDesigns.prototype, "createSiteDesign", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.applySiteDesign")], _SiteDesigns.prototype, "applySiteDesign", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.getSiteDesigns")], _SiteDesigns.prototype, "getSiteDesigns", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.getSiteDesignMetadata")], _SiteDesigns.prototype, "getSiteDesignMetadata", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.updateSiteDesign")], _SiteDesigns.prototype, "updateSiteDesign", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.deleteSiteDesign")], _SiteDesigns.prototype, "deleteSiteDesign", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.getSiteDesignRights")], _SiteDesigns.prototype, "getSiteDesignRights", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.grantSiteDesignRights")], _SiteDesigns.prototype, "grantSiteDesignRights", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.revokeSiteDesignRights")], _SiteDesigns.prototype, "revokeSiteDesignRights", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.addSiteDesignTask")], _SiteDesigns.prototype, "addSiteDesignTask", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.addSiteDesignTaskToCurrentWeb")], _SiteDesigns.prototype, "addSiteDesignTaskToCurrentWeb", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.getSiteDesignTask")], _SiteDesigns.prototype, "getSiteDesignTask", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.getSiteDesignRun")], _SiteDesigns.prototype, "getSiteDesignRun", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sd.getSiteDesignRunStatus")], _SiteDesigns.prototype, "getSiteDesignRunStatus", null);
  return _SiteDesigns;
}(_sharepointqueryable._SharePointQueryable);

exports._SiteDesigns = _SiteDesigns;

var SiteDesigns = function (baseUrl, methodName) {
  return new _SiteDesigns(baseUrl, methodName);
};

exports.SiteDesigns = SiteDesigns;

var SiteDesignsCloneFactory = function (baseUrl, methodName) {
  if (methodName === void 0) {
    methodName = "";
  }

  return SiteDesigns(baseUrl, methodName);
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../operations":"../node_modules/@pnp/sp/operations.js","@pnp/common":"../node_modules/@pnp/common/index.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/site-designs/web.js":[function(require,module,exports) {
"use strict";

var _types = require("../webs/types");

var _types2 = require("./types");

_types._Web.prototype.getSiteDesignRuns = function (siteDesignId) {
  return (0, _types2.SiteDesigns)(this, "").getSiteDesignRun(undefined, siteDesignId);
};

_types._Web.prototype.addSiteDesignTask = function (siteDesignId) {
  return (0, _types2.SiteDesigns)(this, "").addSiteDesignTaskToCurrentWeb(siteDesignId);
};

_types._Web.prototype.getSiteDesignRunStatus = function (runId) {
  return (0, _types2.SiteDesigns)(this, "").getSiteDesignRunStatus(undefined, runId);
};
},{"../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/site-designs/types.js"}],"../node_modules/@pnp/sp/site-designs/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SiteDesigns", {
  enumerable: true,
  get: function () {
    return _types.SiteDesigns;
  }
});

require("./web");

var _rest = require("../rest");

var _types = require("./types");

Reflect.defineProperty(_rest.SPRest.prototype, "siteDesigns", {
  configurable: true,
  enumerable: true,
  get: function () {
    return (0, _types.SiteDesigns)(this._baseUrl);
  }
});
},{"./web":"../node_modules/@pnp/sp/site-designs/web.js","../rest":"../node_modules/@pnp/sp/rest.js","./types":"../node_modules/@pnp/sp/site-designs/types.js"}],"../node_modules/@pnp/sp/site-groups/web.js":[function(require,module,exports) {
"use strict";

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _types = require("../webs/types");

var _types2 = require("./types");

var _operations = require("../operations");

var _escapeQueryStrValue = require("../utils/escapeQueryStrValue");

require("../security/web");

(0, _odata.addProp)(_types._Web, "siteGroups", _types2.SiteGroups);
(0, _odata.addProp)(_types._Web, "associatedOwnerGroup", _types2.SiteGroups, "associatedownergroup");
(0, _odata.addProp)(_types._Web, "associatedMemberGroup", _types2.SiteGroups, "associatedmembergroup");
(0, _odata.addProp)(_types._Web, "associatedVisitorGroup", _types2.SiteGroups, "associatedvisitorgroup");

_types._Web.prototype.createDefaultAssociatedGroups = function (groupNameSeed, siteOwner, copyRoleAssignments, clearSubscopes, siteOwner2) {
  if (copyRoleAssignments === void 0) {
    copyRoleAssignments = false;
  }

  if (clearSubscopes === void 0) {
    clearSubscopes = true;
  }

  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var q;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , this.breakRoleInheritance(copyRoleAssignments, clearSubscopes)];

        case 1:
          _a.sent();

          q = this.clone(_types.Web, "createDefaultAssociatedGroups(userLogin=@u,userLogin2=@v,groupNameSeed=@s)");
          q.query.set("@u", "'" + (0, _escapeQueryStrValue.escapeQueryStrValue)(siteOwner || "") + "'");
          q.query.set("@v", "'" + (0, _escapeQueryStrValue.escapeQueryStrValue)(siteOwner2 || "") + "'");
          q.query.set("@s", "'" + (0, _escapeQueryStrValue.escapeQueryStrValue)(groupNameSeed || "") + "'");
          return [2
          /*return*/
          , (0, _operations.spPost)(q)];
      }
    });
  });
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/site-groups/types.js","../operations":"../node_modules/@pnp/sp/operations.js","../utils/escapeQueryStrValue":"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js","../security/web":"../node_modules/@pnp/sp/security/web.js"}],"../node_modules/@pnp/sp/site-groups/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SiteGroup", {
  enumerable: true,
  get: function () {
    return _types.SiteGroup;
  }
});
Object.defineProperty(exports, "SiteGroups", {
  enumerable: true,
  get: function () {
    return _types.SiteGroups;
  }
});

require("./web");

var _types = require("./types");
},{"./web":"../node_modules/@pnp/sp/site-groups/web.js","./types":"../node_modules/@pnp/sp/site-groups/types.js"}],"../node_modules/@pnp/sp/site-scripts/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SiteScriptActionOutcome = exports.SiteScripts = exports._SiteScripts = void 0;

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _operations = require("../operations");

var _sharepointqueryable = require("../sharepointqueryable");

var _extractweburl = require("../utils/extractweburl");

var _telemetry = require("../telemetry");

var _escapeQueryStrValue = require("../utils/escapeQueryStrValue");

var _SiteScripts =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_SiteScripts, _super);

  function _SiteScripts(baseUrl, methodName) {
    if (methodName === void 0) {
      methodName = "";
    }

    var _this = this;

    var url = typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl();
    _this = _super.call(this, (0, _extractweburl.extractWebUrl)(url), "_api/Microsoft.Sharepoint.Utilities.WebTemplateExtensions.SiteScriptUtility." + methodName) || this;
    return _this;
  }

  _SiteScripts.prototype.execute = function (props) {
    return (0, _operations.spPost)(this, (0, _odata.body)(props));
  };
  /**
   * Gets a list of information on all existing site scripts.
   */


  _SiteScripts.prototype.getSiteScripts = function () {
    return this.clone(SiteScriptsCloneFactory, "GetSiteScripts", true).execute({});
  };
  /**
   * Creates a new site script.
   *
   * @param title The display name of the site script.
   * @param content JSON value that describes the script. For more information, see JSON reference.
   */


  _SiteScripts.prototype.createSiteScript = function (title, description, content) {
    return this.clone(SiteScriptsCloneFactory, "CreateSiteScript(Title=@title,Description=@desc)?@title='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(title) + "'&@desc='" + (0, _escapeQueryStrValue.escapeQueryStrValue)(description) + "'").execute(content);
  };
  /**
   * Gets information about a specific site script. It also returns the JSON of the script.
   *
   * @param id The ID of the site script to get information about.
   */


  _SiteScripts.prototype.getSiteScriptMetadata = function (id) {
    return this.clone(SiteScriptsCloneFactory, "GetSiteScriptMetadata").execute({
      id: id
    });
  };
  /**
   * Deletes a site script.
   *
   * @param id The ID of the site script to delete.
   */


  _SiteScripts.prototype.deleteSiteScript = function (id) {
    return this.clone(SiteScriptsCloneFactory, "DeleteSiteScript").execute({
      id: id
    });
  };
  /**
   * Updates a site script with new values. In the REST call, all parameters are optional except the site script Id.
   *
   * @param siteScriptUpdateInfo Object that contains the information to update a site script.
   *                             Make sure you stringify the content object or pass it in the second 'content' parameter
   * @param content (Optional) A new JSON script defining the script actions. For more information, see Site design JSON schema.
   */


  _SiteScripts.prototype.updateSiteScript = function (updateInfo, content) {
    if (content) {
      updateInfo.Content = JSON.stringify(content);
    }

    return this.clone(SiteScriptsCloneFactory, "UpdateSiteScript").execute({
      updateInfo: updateInfo
    });
  };
  /**
   * Gets the site script syntax (JSON) for a specific list
   * @param listUrl The absolute url of the list to retrieve site script
   */


  _SiteScripts.prototype.getSiteScriptFromList = function (listUrl) {
    return this.clone(SiteScriptsCloneFactory, "GetSiteScriptFromList").execute({
      listUrl: listUrl
    });
  };
  /**
   * Gets the site script syntax (JSON) for a specific web
   * @param webUrl The absolute url of the web to retrieve site script
   * @param extractInfo configuration object to specify what to extract
   */


  _SiteScripts.prototype.getSiteScriptFromWeb = function (webUrl, info) {
    return this.clone(SiteScriptsCloneFactory, "getSiteScriptFromWeb").execute({
      webUrl: webUrl,
      info: info
    });
  };
  /**
   * Executes the indicated site design action on the indicated web.
   *
   * @param webUrl The absolute url of the web to retrieve site script
   * @param extractInfo configuration object to specify what to extract
   */


  _SiteScripts.prototype.executeSiteScriptAction = function (actionDefinition) {
    return this.clone(SiteScriptsCloneFactory, "executeSiteScriptAction").execute({
      actionDefinition: actionDefinition
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("ss.getSiteScripts")], _SiteScripts.prototype, "getSiteScripts", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ss.createSiteScript")], _SiteScripts.prototype, "createSiteScript", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ss.getSiteScriptMetadata")], _SiteScripts.prototype, "getSiteScriptMetadata", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ss.deleteSiteScript")], _SiteScripts.prototype, "deleteSiteScript", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ss.updateSiteScript")], _SiteScripts.prototype, "updateSiteScript", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ss.getSiteScriptFromList")], _SiteScripts.prototype, "getSiteScriptFromList", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ss.getSiteScriptFromWeb")], _SiteScripts.prototype, "getSiteScriptFromWeb", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("ss.executeSiteScriptAction")], _SiteScripts.prototype, "executeSiteScriptAction", null);
  return _SiteScripts;
}(_sharepointqueryable._SharePointQueryable);

exports._SiteScripts = _SiteScripts;

var SiteScripts = function (baseUrl, methodName) {
  return new _SiteScripts(baseUrl, methodName);
};

exports.SiteScripts = SiteScripts;

var SiteScriptsCloneFactory = function (baseUrl, methodName) {
  if (methodName === void 0) {
    methodName = "";
  }

  return SiteScripts(baseUrl, methodName);
};

var SiteScriptActionOutcome;
exports.SiteScriptActionOutcome = SiteScriptActionOutcome;

(function (SiteScriptActionOutcome) {
  /**
   * The stage was deemed to have completed successfully.
   */
  SiteScriptActionOutcome[SiteScriptActionOutcome["Success"] = 0] = "Success";
  /**
   * The stage was deemed to have failed to complete successfully (non-blocking, rest of recipe
   * execution should still be able to proceed).
   */

  SiteScriptActionOutcome[SiteScriptActionOutcome["Failure"] = 1] = "Failure";
  /**
   * No action was taken for this stage / this stage was skipped.
   */

  SiteScriptActionOutcome[SiteScriptActionOutcome["NoOp"] = 2] = "NoOp";
  /**
   * There was an exception but the operation succeeded. This is analagous to the operation completing
   * in a "yellow" state.
   */

  SiteScriptActionOutcome[SiteScriptActionOutcome["SucceededWithException"] = 3] = "SucceededWithException";
})(SiteScriptActionOutcome || (exports.SiteScriptActionOutcome = SiteScriptActionOutcome = {}));
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../operations":"../node_modules/@pnp/sp/operations.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js","../utils/escapeQueryStrValue":"../node_modules/@pnp/sp/utils/escapeQueryStrValue.js"}],"../node_modules/@pnp/sp/site-scripts/web.js":[function(require,module,exports) {
"use strict";

var _types = require("../webs/types");

var _types2 = require("./types");

_types._Web.prototype.getSiteScript = function (extractInfo) {
  return (0, _types2.SiteScripts)(this.toUrl(), "").getSiteScriptFromWeb(undefined, extractInfo);
};
},{"../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/site-scripts/types.js"}],"../node_modules/@pnp/sp/site-scripts/list.js":[function(require,module,exports) {
"use strict";

var _tslib = require("tslib");

var _common = require("@pnp/common");

var _types = require("../lists/types");

var _types2 = require("./types");

require("../folders/list");

var _types3 = require("../webs/types");

var _extractweburl = require("../utils/extractweburl");

_types._List.prototype.getSiteScript = function () {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var rootFolder, web, absoluteListUrl;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , this.clone(_types.List).rootFolder.get()];

        case 1:
          rootFolder = _a.sent();
          return [4
          /*yield*/
          , (0, _types3.Web)((0, _extractweburl.extractWebUrl)(this.toUrl())).select("Url").get()];

        case 2:
          web = _a.sent();
          absoluteListUrl = (0, _common.combine)(web.Url, "Lists", rootFolder.Name);
          return [2
          /*return*/
          , (0, _types2.SiteScripts)(this, "").getSiteScriptFromList(absoluteListUrl)];
      }
    });
  });
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/common":"../node_modules/@pnp/common/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","./types":"../node_modules/@pnp/sp/site-scripts/types.js","../folders/list":"../node_modules/@pnp/sp/folders/list.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js"}],"../node_modules/@pnp/sp/site-scripts/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SiteScripts", {
  enumerable: true,
  get: function () {
    return _types.SiteScripts;
  }
});

require("./web");

require("./list");

var _rest = require("../rest");

var _types = require("./types");

Reflect.defineProperty(_rest.SPRest.prototype, "siteScripts", {
  configurable: true,
  enumerable: true,
  get: function () {
    return (0, _types.SiteScripts)(this._baseUrl);
  }
});
},{"./web":"../node_modules/@pnp/sp/site-scripts/web.js","./list":"../node_modules/@pnp/sp/site-scripts/list.js","../rest":"../node_modules/@pnp/sp/rest.js","./types":"../node_modules/@pnp/sp/site-scripts/types.js"}],"../node_modules/@pnp/sp/site-users/web.js":[function(require,module,exports) {
"use strict";

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _types = require("../webs/types");

var _types2 = require("./types");

var _odata2 = require("../odata");

var _operations = require("../operations");

(0, _odata.addProp)(_types._Web, "siteUsers", _types2.SiteUsers);
(0, _odata.addProp)(_types._Web, "currentUser", _types2.SiteUser, "currentuser");

_types._Web.prototype.ensureUser = function (logonName) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    var data;
    return (0, _tslib.__generator)(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , (0, _operations.spPost)(this.clone(_types.Web, "ensureuser"), (0, _odata.body)({
            logonName: logonName
          }))];

        case 1:
          data = _a.sent();
          return [2
          /*return*/
          , {
            data: data,
            user: (0, _types2.SiteUser)((0, _odata2.odataUrlFrom)(data))
          }];
      }
    });
  });
};

_types._Web.prototype.getUserById = function (id) {
  return (0, _types2.SiteUser)(this, "getUserById(" + id + ")");
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/site-users/types.js","../odata":"../node_modules/@pnp/sp/odata.js","../operations":"../node_modules/@pnp/sp/operations.js"}],"../node_modules/@pnp/sp/site-users/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SiteUser", {
  enumerable: true,
  get: function () {
    return _types.SiteUser;
  }
});
Object.defineProperty(exports, "SiteUsers", {
  enumerable: true,
  get: function () {
    return _types.SiteUsers;
  }
});

require("./web");

var _types = require("./types");
},{"./web":"../node_modules/@pnp/sp/site-users/web.js","./types":"../node_modules/@pnp/sp/site-users/types.js"}],"../node_modules/@pnp/sp/social/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SocialStatusCode = exports.SocialFollowResult = exports.SocialActorTypes = exports.SocialActorType = exports.MySocial = exports._MySocial = exports.Social = exports._Social = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _decorators = require("../decorators");

var _common = require("@pnp/common");

var _metadata = require("../utils/metadata");

var _odata = require("@pnp/odata");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _Social =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Social, _super);

  function _Social() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_Social.prototype, "my", {
    get: function () {
      return MySocial(this);
    },
    enumerable: false,
    configurable: true
  });

  _Social.prototype.getFollowedSitesUri = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var r;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.clone(SocialCloneFactory, "FollowedSitesUri").get()];

          case 1:
            r = _a.sent();
            return [2
            /*return*/
            , r.FollowedSitesUri || r];
        }
      });
    });
  };

  _Social.prototype.getFollowedDocumentsUri = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var r;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.clone(SocialCloneFactory, "FollowedDocumentsUri").get()];

          case 1:
            r = _a.sent();
            return [2
            /*return*/
            , r.FollowedDocumentsUri || r];
        }
      });
    });
  };

  _Social.prototype.follow = function (actorInfo) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(SocialCloneFactory, "follow"), this.createSocialActorInfoRequestBody(actorInfo))];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  };

  _Social.prototype.isFollowed = function (actorInfo) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(SocialCloneFactory, "isfollowed"), this.createSocialActorInfoRequestBody(actorInfo))];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  };

  _Social.prototype.stopFollowing = function (actorInfo) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(SocialCloneFactory, "stopfollowing"), this.createSocialActorInfoRequestBody(actorInfo))];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  };

  _Social.prototype.createSocialActorInfoRequestBody = function (actorInfo) {
    return (0, _odata.body)({
      "actor": Object.assign((0, _metadata.metadata)("SP.Social.SocialActorInfo"), {
        Id: null
      }, actorInfo)
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("soc.getFollowedSitesUri")], _Social.prototype, "getFollowedSitesUri", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("soc.getFollowedDocumentsUri")], _Social.prototype, "getFollowedDocumentsUri", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("soc.follow")], _Social.prototype, "follow", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("soc.isFollowed")], _Social.prototype, "isFollowed", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("soc.stopFollowing")], _Social.prototype, "stopFollowing", null);
  _Social = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("_api/social.following")], _Social);
  return _Social;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Social = _Social;

/**
 * Get a new Social instance for the particular Url
 */
var Social = function (baseUrl) {
  return new _Social(baseUrl);
};

exports.Social = Social;

var SocialCloneFactory = function (baseUrl, paths) {
  return new _Social(baseUrl, paths);
};
/**
 * Current user's Social instance
 */


var _MySocial =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_MySocial, _super);

  function _MySocial() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  _MySocial.prototype.followed = function (types) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var r;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.clone(MySocialCloneFactory, "followed(types=" + types + ")")()];

          case 1:
            r = _a.sent();
            return [2
            /*return*/
            , (0, _common.hOP)(r, "Followed") ? r.Followed.results : r];
        }
      });
    });
  };

  _MySocial.prototype.followedCount = function (types) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var r;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.clone(MySocialCloneFactory, "followedcount(types=" + types + ")")()];

          case 1:
            r = _a.sent();
            return [2
            /*return*/
            , r.FollowedCount || r];
        }
      });
    });
  };

  _MySocial.prototype.followers = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var r;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.clone(MySocialCloneFactory, "followers")()];

          case 1:
            r = _a.sent();
            return [2
            /*return*/
            , (0, _common.hOP)(r, "Followers") ? r.Followers.results : r];
        }
      });
    });
  };

  _MySocial.prototype.suggestions = function () {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var r;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.clone(MySocialCloneFactory, "suggestions")()];

          case 1:
            r = _a.sent();
            return [2
            /*return*/
            , (0, _common.hOP)(r, "Suggestions") ? r.Suggestions.results : r];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("msoc.followed")], _MySocial.prototype, "followed", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("msoc.followedCount")], _MySocial.prototype, "followedCount", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("msoc.followers")], _MySocial.prototype, "followers", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("msoc.suggestions")], _MySocial.prototype, "suggestions", null);
  _MySocial = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("my")], _MySocial);
  return _MySocial;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._MySocial = _MySocial;

/**
 * Invokable factory for IMySocial instances
 */
var MySocial = (0, _sharepointqueryable.spInvokableFactory)(_MySocial);
exports.MySocial = MySocial;

var MySocialCloneFactory = function (baseUrl, path) {
  return MySocial(baseUrl, path);
};
/**
 * Social actor type
 *
 */


var SocialActorType;
exports.SocialActorType = SocialActorType;

(function (SocialActorType) {
  SocialActorType[SocialActorType["User"] = 0] = "User";
  SocialActorType[SocialActorType["Document"] = 1] = "Document";
  SocialActorType[SocialActorType["Site"] = 2] = "Site";
  SocialActorType[SocialActorType["Tag"] = 3] = "Tag";
})(SocialActorType || (exports.SocialActorType = SocialActorType = {}));
/**
 * Social actor type
 *
 */

/* tslint:disable:no-bitwise */


var SocialActorTypes;
exports.SocialActorTypes = SocialActorTypes;

(function (SocialActorTypes) {
  SocialActorTypes[SocialActorTypes["None"] = 0] = "None";
  SocialActorTypes[SocialActorTypes["User"] = 1] = "User";
  SocialActorTypes[SocialActorTypes["Document"] = 2] = "Document";
  SocialActorTypes[SocialActorTypes["Site"] = 4] = "Site";
  SocialActorTypes[SocialActorTypes["Tag"] = 8] = "Tag";
  /**
   * The set excludes documents and sites that do not have feeds.
   */

  SocialActorTypes[SocialActorTypes["ExcludeContentWithoutFeeds"] = 268435456] = "ExcludeContentWithoutFeeds";
  /**
   * The set includes group sites
   */

  SocialActorTypes[SocialActorTypes["IncludeGroupsSites"] = 536870912] = "IncludeGroupsSites";
  /**
   * The set includes only items created within the last 24 hours
   */

  SocialActorTypes[SocialActorTypes["WithinLast24Hours"] = 1073741824] = "WithinLast24Hours";
})(SocialActorTypes || (exports.SocialActorTypes = SocialActorTypes = {}));
/* tslint:enable */

/**
 * Result from following
 *
 */


var SocialFollowResult;
exports.SocialFollowResult = SocialFollowResult;

(function (SocialFollowResult) {
  SocialFollowResult[SocialFollowResult["Ok"] = 0] = "Ok";
  SocialFollowResult[SocialFollowResult["AlreadyFollowing"] = 1] = "AlreadyFollowing";
  SocialFollowResult[SocialFollowResult["LimitReached"] = 2] = "LimitReached";
  SocialFollowResult[SocialFollowResult["InternalError"] = 3] = "InternalError";
})(SocialFollowResult || (exports.SocialFollowResult = SocialFollowResult = {}));
/**
 * Specifies an exception or status code.
 */


var SocialStatusCode;
exports.SocialStatusCode = SocialStatusCode;

(function (SocialStatusCode) {
  /**
   * The operation completed successfully
   */
  SocialStatusCode[SocialStatusCode["OK"] = 0] = "OK";
  /**
   * The request is invalid.
   */

  SocialStatusCode[SocialStatusCode["InvalidRequest"] = 1] = "InvalidRequest";
  /**
   *  The current user is not authorized to perform the operation.
   */

  SocialStatusCode[SocialStatusCode["AccessDenied"] = 2] = "AccessDenied";
  /**
   * The target of the operation was not found.
   */

  SocialStatusCode[SocialStatusCode["ItemNotFound"] = 3] = "ItemNotFound";
  /**
   * The operation is invalid for the target's current state.
   */

  SocialStatusCode[SocialStatusCode["InvalidOperation"] = 4] = "InvalidOperation";
  /**
   * The operation completed without modifying the target.
   */

  SocialStatusCode[SocialStatusCode["ItemNotModified"] = 5] = "ItemNotModified";
  /**
   * The operation failed because an internal error occurred.
   */

  SocialStatusCode[SocialStatusCode["InternalError"] = 6] = "InternalError";
  /**
   * The operation failed because the server could not access the distributed cache.
   */

  SocialStatusCode[SocialStatusCode["CacheReadError"] = 7] = "CacheReadError";
  /**
   * The operation succeeded but the server could not update the distributed cache.
   */

  SocialStatusCode[SocialStatusCode["CacheUpdateError"] = 8] = "CacheUpdateError";
  /**
   * No personal site exists for the current user, and no further information is available.
   */

  SocialStatusCode[SocialStatusCode["PersonalSiteNotFound"] = 9] = "PersonalSiteNotFound";
  /**
   * No personal site exists for the current user, and a previous attempt to create one failed.
   */

  SocialStatusCode[SocialStatusCode["FailedToCreatePersonalSite"] = 10] = "FailedToCreatePersonalSite";
  /**
   * No personal site exists for the current user, and a previous attempt to create one was not authorized.
   */

  SocialStatusCode[SocialStatusCode["NotAuthorizedToCreatePersonalSite"] = 11] = "NotAuthorizedToCreatePersonalSite";
  /**
   * No personal site exists for the current user, and no attempt should be made to create one.
   */

  SocialStatusCode[SocialStatusCode["CannotCreatePersonalSite"] = 12] = "CannotCreatePersonalSite";
  /**
   * The operation was rejected because an internal limit had been reached.
   */

  SocialStatusCode[SocialStatusCode["LimitReached"] = 13] = "LimitReached";
  /**
   * The operation failed because an error occurred during the processing of the specified attachment.
   */

  SocialStatusCode[SocialStatusCode["AttachmentError"] = 14] = "AttachmentError";
  /**
   * The operation succeeded with recoverable errors; the returned data is incomplete.
   */

  SocialStatusCode[SocialStatusCode["PartialData"] = 15] = "PartialData";
  /**
   * A required SharePoint feature is not enabled.
   */

  SocialStatusCode[SocialStatusCode["FeatureDisabled"] = 16] = "FeatureDisabled";
  /**
   * The site's storage quota has been exceeded.
   */

  SocialStatusCode[SocialStatusCode["StorageQuotaExceeded"] = 17] = "StorageQuotaExceeded";
  /**
   * The operation failed because the server could not access the database.
   */

  SocialStatusCode[SocialStatusCode["DatabaseError"] = 18] = "DatabaseError";
})(SocialStatusCode || (exports.SocialStatusCode = SocialStatusCode = {}));
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../decorators":"../node_modules/@pnp/sp/decorators.js","@pnp/common":"../node_modules/@pnp/common/index.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/social/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MySocial", {
  enumerable: true,
  get: function () {
    return _types.MySocial;
  }
});
Object.defineProperty(exports, "Social", {
  enumerable: true,
  get: function () {
    return _types.Social;
  }
});
Object.defineProperty(exports, "SocialActorType", {
  enumerable: true,
  get: function () {
    return _types.SocialActorType;
  }
});
Object.defineProperty(exports, "SocialActorTypes", {
  enumerable: true,
  get: function () {
    return _types.SocialActorTypes;
  }
});
Object.defineProperty(exports, "SocialFollowResult", {
  enumerable: true,
  get: function () {
    return _types.SocialFollowResult;
  }
});
Object.defineProperty(exports, "SocialStatusCode", {
  enumerable: true,
  get: function () {
    return _types.SocialStatusCode;
  }
});

var _types = require("./types");

var _rest = require("../rest");

Reflect.defineProperty(_rest.SPRest.prototype, "social", {
  configurable: true,
  enumerable: true,
  get: function () {
    return (0, _types.Social)(this._baseUrl);
  }
});
},{"./types":"../node_modules/@pnp/sp/social/types.js","../rest":"../node_modules/@pnp/sp/rest.js"}],"../node_modules/@pnp/sp/sputilities/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Utilities = exports._Utilities = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _common = require("@pnp/common");

var _odata = require("@pnp/odata");

var _odata2 = require("../odata");

var _metadata = require("../utils/metadata");

var _types = require("../files/types");

var _extractweburl = require("../utils/extractweburl");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _objectToSPKeyValueCollection = require("../utils/objectToSPKeyValueCollection");

var _Utilities =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Utilities, _super);

  function _Utilities(baseUrl, methodName) {
    var _this = this;

    var url = typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl();
    _this = _super.call(this, (0, _extractweburl.extractWebUrl)(url), "_api/SP.Utilities.Utility." + methodName) || this;
    return _this;
  }

  _Utilities.prototype.excute = function (props) {
    return (0, _operations.spPost)(this, (0, _odata.body)(props));
  };

  _Utilities.prototype.sendEmail = function (props) {
    var params = {
      properties: (0, _common.assign)((0, _metadata.metadata)("SP.Utilities.EmailProperties"), {
        Body: props.Body,
        From: props.From,
        Subject: props.Subject
      })
    };

    if (props.To && props.To.length > 0) {
      params.properties = (0, _common.assign)(params.properties, {
        To: {
          results: props.To
        }
      });
    }

    if (props.CC && props.CC.length > 0) {
      params.properties = (0, _common.assign)(params.properties, {
        CC: {
          results: props.CC
        }
      });
    }

    if (props.BCC && props.BCC.length > 0) {
      params.properties = (0, _common.assign)(params.properties, {
        BCC: {
          results: props.BCC
        }
      });
    }

    if (props.AdditionalHeaders) {
      params.properties = (0, _common.assign)(params.properties, {
        AdditionalHeaders: (0, _objectToSPKeyValueCollection.objectToSPKeyValueCollection)(props.AdditionalHeaders)
      });
    }

    return _telemetry.tag.configure(this.clone(UtilitiesCloneFactory, "SendEmail", true), "u.sendEmail").excute(params);
  };

  _Utilities.prototype.getCurrentUserEmailAddresses = function () {
    return _telemetry.tag.configure(this.clone(UtilitiesCloneFactory, "GetCurrentUserEmailAddresses", true), "u.getCurrentUserEmailAddresses").excute({});
  };

  _Utilities.prototype.resolvePrincipal = function (input, scopes, sources, inputIsEmailOnly, addToUserInfoList, matchUserInfoList) {
    if (matchUserInfoList === void 0) {
      matchUserInfoList = false;
    }

    var params = {
      addToUserInfoList: addToUserInfoList,
      input: input,
      inputIsEmailOnly: inputIsEmailOnly,
      matchUserInfoList: matchUserInfoList,
      scopes: scopes,
      sources: sources
    };
    var clone = this.clone(UtilitiesCloneFactory, "ResolvePrincipalInCurrentContext", true);
    return _telemetry.tag.configure(clone, "u.ResolvePrincipalInCurrentContext").excute(params);
  };

  _Utilities.prototype.searchPrincipals = function (input, scopes, sources, groupName, maxCount) {
    var params = {
      groupName: groupName,
      input: input,
      maxCount: maxCount,
      scopes: scopes,
      sources: sources
    };
    var clone = this.clone(UtilitiesCloneFactory, "SearchPrincipalsUsingContextWeb", true);
    return _telemetry.tag.configure(clone, "u.SearchPrincipalsUsingContextWeb").excute(params);
  };

  _Utilities.prototype.createEmailBodyForInvitation = function (pageAddress) {
    var params = {
      pageAddress: pageAddress
    };
    var clone = this.clone(UtilitiesCloneFactory, "CreateEmailBodyForInvitation", true);
    return _telemetry.tag.configure(clone, "u.CreateEmailBodyForInvitation").excute(params);
  };

  _Utilities.prototype.expandGroupsToPrincipals = function (inputs, maxCount) {
    if (maxCount === void 0) {
      maxCount = 30;
    }

    var params = {
      inputs: inputs,
      maxCount: maxCount
    };
    var clone = this.clone(UtilitiesCloneFactory, "ExpandGroupsToPrincipals", true);
    return _telemetry.tag.configure(clone, "u.ExpandGroupsToPrincipals").excute(params);
  };

  _Utilities.prototype.createWikiPage = function (info) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var clone, newPage;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            clone = this.clone(UtilitiesCloneFactory, "CreateWikiPageInContextWeb", true);
            return [4
            /*yield*/
            , _telemetry.tag.configure(clone, "u.CreateWikiPageInContextWeb").excute({
              parameters: info
            })];

          case 1:
            newPage = _a.sent();
            return [2
            /*return*/
            , {
              data: newPage,
              file: (0, _types.File)((0, _odata2.odataUrlFrom)(newPage))
            }];
        }
      });
    });
  };

  return _Utilities;
}(_sharepointqueryable._SharePointQueryable);

exports._Utilities = _Utilities;
var Utilities = (0, _sharepointqueryable.spInvokableFactory)(_Utilities);
exports.Utilities = Utilities;

var UtilitiesCloneFactory = function (baseUrl, path) {
  return Utilities(baseUrl, path);
};
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/common":"../node_modules/@pnp/common/index.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../odata":"../node_modules/@pnp/sp/odata.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","../files/types":"../node_modules/@pnp/sp/files/types.js","../utils/extractweburl":"../node_modules/@pnp/sp/utils/extractweburl.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js","../utils/objectToSPKeyValueCollection":"../node_modules/@pnp/sp/utils/objectToSPKeyValueCollection.js"}],"../node_modules/@pnp/sp/sputilities/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Utilities", {
  enumerable: true,
  get: function () {
    return _types.Utilities;
  }
});

var _rest = require("../rest");

var _types = require("./types");

Reflect.defineProperty(_rest.SPRest.prototype, "utility", {
  configurable: true,
  enumerable: true,
  get: function () {
    return (0, _types.Utilities)(this._baseUrl, "");
  }
});
},{"../rest":"../node_modules/@pnp/sp/rest.js","./types":"../node_modules/@pnp/sp/sputilities/types.js"}],"../node_modules/@pnp/sp/subscriptions/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subscription = exports._Subscription = exports.Subscriptions = exports._Subscriptions = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _odata = require("@pnp/odata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _Subscriptions =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Subscriptions, _super);

  function _Subscriptions() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
  * Returns all the webhook subscriptions or the specified webhook subscription
  *
  * @param subscriptionId The id of a specific webhook subscription to retrieve, omit to retrieve all the webhook subscriptions
  */


  _Subscriptions.prototype.getById = function (subscriptionId) {
    return _telemetry.tag.configure(Subscription(this).concat("('" + subscriptionId + "')"), "subs.getById");
  };
  /**
   * Creates a new webhook subscription
   *
   * @param notificationUrl The url to receive the notifications
   * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months)
   * @param clientState A client specific string (optional)
   */


  _Subscriptions.prototype.add = function (notificationUrl, expirationDate, clientState) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = {
              "expirationDateTime": expirationDate,
              "notificationUrl": notificationUrl,
              "resource": this.toUrl()
            };

            if (clientState) {
              postBody.clientState = clientState;
            }

            return [4
            /*yield*/
            , (0, _operations.spPost)(this, (0, _odata.body)(postBody, (0, _odata.headers)({
              "Content-Type": "application/json"
            })))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              subscription: this.getById(data.id)
            }];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("subs.add")], _Subscriptions.prototype, "add", null);
  _Subscriptions = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("subscriptions")], _Subscriptions);
  return _Subscriptions;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Subscriptions = _Subscriptions;
var Subscriptions = (0, _sharepointqueryable.spInvokableFactory)(_Subscriptions);
exports.Subscriptions = Subscriptions;

var _Subscription =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Subscription, _super);

  function _Subscription() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Renews this webhook subscription
   *
   * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months, optional)
   * @param notificationUrl The url to receive the notifications (optional)
   * @param clientState A client specific string (optional)
   */


  _Subscription.prototype.update = function (expirationDate, notificationUrl, clientState) {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = {};

            if (expirationDate) {
              postBody.expirationDateTime = expirationDate;
            }

            if (notificationUrl) {
              postBody.notificationUrl = notificationUrl;
            }

            if (clientState) {
              postBody.clientState = clientState;
            }

            return [4
            /*yield*/
            , (0, _operations.spPatch)(this, (0, _odata.body)(postBody, (0, _odata.headers)({
              "Content-Type": "application/json"
            })))];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              subscription: this
            }];
        }
      });
    });
  };
  /**
   * Removes this webhook subscription
   *
   */


  _Subscription.prototype.delete = function () {
    return (0, _operations.spDelete)(this);
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("sub.update")], _Subscription.prototype, "update", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("sub.delete")], _Subscription.prototype, "delete", null);
  return _Subscription;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Subscription = _Subscription;
var Subscription = (0, _sharepointqueryable.spInvokableFactory)(_Subscription);
exports.Subscription = Subscription;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/subscriptions/list.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../lists/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._List, "subscriptions", _types2.Subscriptions);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","./types":"../node_modules/@pnp/sp/subscriptions/types.js"}],"../node_modules/@pnp/sp/subscriptions/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Subscription", {
  enumerable: true,
  get: function () {
    return _types.Subscription;
  }
});
Object.defineProperty(exports, "Subscriptions", {
  enumerable: true,
  get: function () {
    return _types.Subscriptions;
  }
});

require("./list");

var _types = require("./types");
},{"./list":"../node_modules/@pnp/sp/subscriptions/list.js","./types":"../node_modules/@pnp/sp/subscriptions/types.js"}],"../node_modules/@pnp/sp/taxonomy/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Relation = exports._Relation = exports.Relations = exports._Relations = exports.Term = exports._Term = exports.Terms = exports._Terms = exports.TermSet = exports._TermSet = exports.TermSets = exports._TermSets = exports.TermGroup = exports._TermGroup = exports.TermGroups = exports._TermGroups = exports.TermStore = exports._TermStore = void 0;

var _tslib = require("tslib");

var _decorators = require("../decorators");

var _sharepointqueryable = require("../sharepointqueryable");

// TODO::
// import { tag } from "../telemetry";

/**
 * Describes a collection of Form objects
 *
 */
var _TermStore =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_TermStore, _super);

  function _TermStore() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_TermStore.prototype, "termGroups", {
    /**
     * Gets the term groups associated with this tenant
     */
    get: function () {
      return TermGroups(this);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_TermStore.prototype, "groups", {
    /**
     * Gets the term groups associated with this tenant
     */
    get: function () {
      return TermGroups(this, "groups");
    },
    enumerable: false,
    configurable: true
  });
  _TermStore = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("_api/v2.1/termstore")], _TermStore);
  return _TermStore;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._TermStore = _TermStore;
var TermStore = (0, _sharepointqueryable.spInvokableFactory)(_TermStore);
exports.TermStore = TermStore;

var _TermGroups =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_TermGroups, _super);

  function _TermGroups() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a term group by id
   *
   * @param id Id of the term group to access
   */


  _TermGroups.prototype.getById = function (id) {
    return TermGroup(this, id);
  };

  _TermGroups = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("termgroups")], _TermGroups);
  return _TermGroups;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._TermGroups = _TermGroups;
var TermGroups = (0, _sharepointqueryable.spInvokableFactory)(_TermGroups);
exports.TermGroups = TermGroups;

var _TermGroup =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_TermGroup, _super);

  function _TermGroup() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_TermGroup.prototype, "termSets", {
    /**
     * Gets the term sets associated with this tenant
     */
    get: function () {
      return TermSets(this);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_TermGroup.prototype, "sets", {
    /**
     * Gets the term groups associated with this tenant
     */
    get: function () {
      return TermSets(this, "sets");
    },
    enumerable: false,
    configurable: true
  });
  return _TermGroup;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._TermGroup = _TermGroup;
var TermGroup = (0, _sharepointqueryable.spInvokableFactory)(_TermGroup);
exports.TermGroup = TermGroup;

var _TermSets =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_TermSets, _super);

  function _TermSets() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a term group by id
   *
   * @param id Id of the term group to access
   */


  _TermSets.prototype.getById = function (id) {
    return TermSet(this, id);
  };

  _TermSets = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("termsets")], _TermSets);
  return _TermSets;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._TermSets = _TermSets;
var TermSets = (0, _sharepointqueryable.spInvokableFactory)(_TermSets);
exports.TermSets = TermSets;

var _TermSet =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_TermSet, _super);

  function _TermSet() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_TermSet.prototype, "terms", {
    get: function () {
      return Terms(this);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_TermSet.prototype, "parentGroup", {
    get: function () {
      return TermGroup(this, "parentGroup");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_TermSet.prototype, "children", {
    get: function () {
      return Terms(this, "children");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_TermSet.prototype, "relations", {
    get: function () {
      return Relations(this);
    },
    enumerable: false,
    configurable: true
  });
  return _TermSet;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._TermSet = _TermSet;
var TermSet = (0, _sharepointqueryable.spInvokableFactory)(_TermSet);
exports.TermSet = TermSet;

var _Terms =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Terms, _super);

  function _Terms() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a term group by id
   *
   * @param id Id of the term group to access
   */


  _Terms.prototype.getById = function (id) {
    return Term(this, id);
  };

  _Terms = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("terms")], _Terms);
  return _Terms;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Terms = _Terms;
var Terms = (0, _sharepointqueryable.spInvokableFactory)(_Terms);
exports.Terms = Terms;

var _Term =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Term, _super);

  function _Term() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_Term.prototype, "parent", {
    get: function () {
      return Term(this, "parent");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Term.prototype, "children", {
    get: function () {
      return Terms(this, "children");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Term.prototype, "relations", {
    get: function () {
      return Relations(this);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Term.prototype, "set", {
    get: function () {
      return TermSet(this, "set");
    },
    enumerable: false,
    configurable: true
  });
  return _Term;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Term = _Term;
var Term = (0, _sharepointqueryable.spInvokableFactory)(_Term);
exports.Term = Term;

var _Relations =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Relations, _super);

  function _Relations() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a term group by id
   *
   * @param id Id of the term group to access
   */


  _Relations.prototype.getById = function (id) {
    return Relation(this, id);
  };

  _Relations = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("relations")], _Relations);
  return _Relations;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Relations = _Relations;
var Relations = (0, _sharepointqueryable.spInvokableFactory)(_Relations);
exports.Relations = Relations;

var _Relation =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Relation, _super);

  function _Relation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_Relation.prototype, "fromTerm", {
    get: function () {
      return Term(this, "fromTerm");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Relation.prototype, "toTerm", {
    get: function () {
      return Term(this, "toTerm");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_Relation.prototype, "set", {
    get: function () {
      return TermSet(this, "set");
    },
    enumerable: false,
    configurable: true
  });
  return _Relation;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._Relation = _Relation;
var Relation = (0, _sharepointqueryable.spInvokableFactory)(_Relation);
exports.Relation = Relation;
},{"tslib":"../node_modules/tslib/tslib.es6.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js"}],"../node_modules/@pnp/sp/taxonomy/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TermStore", {
  enumerable: true,
  get: function () {
    return _types.TermStore;
  }
});
Object.defineProperty(exports, "TermGroup", {
  enumerable: true,
  get: function () {
    return _types.TermGroup;
  }
});
Object.defineProperty(exports, "TermGroups", {
  enumerable: true,
  get: function () {
    return _types.TermGroups;
  }
});
Object.defineProperty(exports, "TermSets", {
  enumerable: true,
  get: function () {
    return _types.TermSets;
  }
});
Object.defineProperty(exports, "TermSet", {
  enumerable: true,
  get: function () {
    return _types.TermSet;
  }
});
Object.defineProperty(exports, "Terms", {
  enumerable: true,
  get: function () {
    return _types.Terms;
  }
});
Object.defineProperty(exports, "Relation", {
  enumerable: true,
  get: function () {
    return _types.Relation;
  }
});
Object.defineProperty(exports, "Relations", {
  enumerable: true,
  get: function () {
    return _types.Relations;
  }
});
Object.defineProperty(exports, "Term", {
  enumerable: true,
  get: function () {
    return _types.Term;
  }
});

var _rest = require("../rest");

var _types = require("./types");

Reflect.defineProperty(_rest.SPRest.prototype, "termStore", {
  configurable: true,
  enumerable: true,
  get: function () {
    return (0, _types.TermStore)(this._baseUrl).configure(this._options);
  }
});
},{"../rest":"../node_modules/@pnp/sp/rest.js","./types":"../node_modules/@pnp/sp/taxonomy/types.js"}],"../node_modules/@pnp/sp/user-custom-actions/list.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../lists/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._List, "userCustomActions", _types2.UserCustomActions);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","./types":"../node_modules/@pnp/sp/user-custom-actions/types.js"}],"../node_modules/@pnp/sp/user-custom-actions/web.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../webs/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Web, "userCustomActions", _types2.UserCustomActions);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../webs/types":"../node_modules/@pnp/sp/webs/types.js","./types":"../node_modules/@pnp/sp/user-custom-actions/types.js"}],"../node_modules/@pnp/sp/user-custom-actions/site.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../sites/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._Site, "userCustomActions", _types2.UserCustomActions);
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../sites/types":"../node_modules/@pnp/sp/sites/types.js","./types":"../node_modules/@pnp/sp/user-custom-actions/types.js"}],"../node_modules/@pnp/sp/user-custom-actions/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "UserCustomAction", {
  enumerable: true,
  get: function () {
    return _types.UserCustomAction;
  }
});
Object.defineProperty(exports, "UserCustomActions", {
  enumerable: true,
  get: function () {
    return _types.UserCustomActions;
  }
});
Object.defineProperty(exports, "UserCustomActionRegistrationType", {
  enumerable: true,
  get: function () {
    return _types.UserCustomActionRegistrationType;
  }
});
Object.defineProperty(exports, "UserCustomActionScope", {
  enumerable: true,
  get: function () {
    return _types.UserCustomActionScope;
  }
});

require("./list");

require("./web");

require("./site");

var _types = require("./types");
},{"./list":"../node_modules/@pnp/sp/user-custom-actions/list.js","./web":"../node_modules/@pnp/sp/user-custom-actions/web.js","./site":"../node_modules/@pnp/sp/user-custom-actions/site.js","./types":"../node_modules/@pnp/sp/user-custom-actions/types.js"}],"../node_modules/@pnp/sp/views/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewScope = exports.ViewFields = exports._ViewFields = exports.View = exports._View = exports.Views = exports._Views = void 0;

var _tslib = require("tslib");

var _odata = require("@pnp/odata");

var _sharepointqueryable = require("../sharepointqueryable");

var _metadata = require("../utils/metadata");

var _decorators = require("../decorators");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _Views =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_Views, _super);

  function _Views() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a view by guid id
   *
   * @param id The GUID id of the view
   */


  _Views.prototype.getById = function (id) {
    return View(this).concat("('" + id + "')");
  };
  /**
   * Gets a view by title (case-sensitive)
   *
   * @param title The case-sensitive title of the view
   */


  _Views.prototype.getByTitle = function (title) {
    return View(this, "getByTitle('" + title + "')");
  };
  /**
   * Adds a new view to the collection
   *
   * @param title The new views's title
   * @param personalView True if this is a personal view, otherwise false, default = false
   * @param additionalSettings Will be passed as part of the view creation body
   */


  _Views.prototype.add = function (title, personalView, additionalSettings) {
    if (personalView === void 0) {
      personalView = false;
    }

    if (additionalSettings === void 0) {
      additionalSettings = {};
    }

    return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
      var postBody, data;
      return (0, _tslib.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            postBody = (0, _odata.body)(Object.assign((0, _metadata.metadata)("SP.View"), {
              "PersonalView": personalView,
              "Title": title
            }, additionalSettings));
            return [4
            /*yield*/
            , (0, _operations.spPost)(this.clone(Views, null), postBody)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              data: data,
              view: this.getById(data.Id)
            }];
        }
      });
    });
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("vs.add")], _Views.prototype, "add", null);
  _Views = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("views")], _Views);
  return _Views;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._Views = _Views;
var Views = (0, _sharepointqueryable.spInvokableFactory)(_Views);
exports.Views = Views;

var _View =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_View, _super);

  function _View() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.delete = (0, _sharepointqueryable.deleteable)("vw");
    /**
     * Updates this view intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the view
     */

    _this.update = _this._update("SP.View", function (data) {
      return {
        data: data,
        view: _this
      };
    });
    return _this;
  }

  Object.defineProperty(_View.prototype, "fields", {
    get: function () {
      return ViewFields(this);
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Returns the list view as HTML.
   *
   */

  _View.prototype.renderAsHtml = function () {
    return this.clone(View, "renderashtml")();
  };
  /**
   * Sets the view schema
   *
   * @param viewXml The view XML to set
   */


  _View.prototype.setViewXml = function (viewXml) {
    return (0, _operations.spPost)(this.clone(View, "SetViewXml"), (0, _odata.body)({
      viewXml: viewXml
    }));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("v.renderAsHtml")], _View.prototype, "renderAsHtml", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("v.setViewXml")], _View.prototype, "setViewXml", null);
  return _View;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._View = _View;
var View = (0, _sharepointqueryable.spInvokableFactory)(_View);
exports.View = View;

var _ViewFields =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_ViewFields, _super);

  function _ViewFields() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a value that specifies the XML schema that represents the collection.
   */


  _ViewFields.prototype.getSchemaXml = function () {
    return this.clone(ViewFields, "schemaxml")();
  };
  /**
   * Adds the field with the specified field internal name or display name to the collection.
   *
   * @param fieldTitleOrInternalName The case-sensitive internal name or display name of the field to add.
   */


  _ViewFields.prototype.add = function (fieldTitleOrInternalName) {
    return (0, _operations.spPost)(this.clone(ViewFields, "addviewfield('" + fieldTitleOrInternalName + "')"));
  };
  /**
   * Moves the field with the specified field internal name to the specified position in the collection.
   *
   * @param field The case-sensitive internal name of the field to move.
   * @param index The zero-based index of the new position for the field.
   */


  _ViewFields.prototype.move = function (field, index) {
    return (0, _operations.spPost)(this.clone(ViewFields, "moveviewfieldto"), (0, _odata.body)({
      field: field,
      index: index
    }));
  };
  /**
   * Removes all the fields from the collection.
   */


  _ViewFields.prototype.removeAll = function () {
    return (0, _operations.spPost)(this.clone(ViewFields, "removeallviewfields"));
  };
  /**
   * Removes the field with the specified field internal name from the collection.
   *
   * @param fieldInternalName The case-sensitive internal name of the field to remove from the view.
   */


  _ViewFields.prototype.remove = function (fieldInternalName) {
    return (0, _operations.spPost)(this.clone(ViewFields, "removeviewfield('" + fieldInternalName + "')"));
  };

  (0, _tslib.__decorate)([(0, _telemetry.tag)("vfs.getSchemaXml")], _ViewFields.prototype, "getSchemaXml", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("vfs.add")], _ViewFields.prototype, "add", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("vfs.move")], _ViewFields.prototype, "move", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("vfs.removeAll")], _ViewFields.prototype, "removeAll", null);
  (0, _tslib.__decorate)([(0, _telemetry.tag)("vfs.remove")], _ViewFields.prototype, "remove", null);
  _ViewFields = (0, _tslib.__decorate)([(0, _decorators.defaultPath)("viewfields")], _ViewFields);
  return _ViewFields;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._ViewFields = _ViewFields;
var ViewFields = (0, _sharepointqueryable.spInvokableFactory)(_ViewFields);
exports.ViewFields = ViewFields;
var ViewScope;
exports.ViewScope = ViewScope;

(function (ViewScope) {
  ViewScope[ViewScope["DefaultValue"] = 0] = "DefaultValue";
  ViewScope[ViewScope["Recursive"] = 1] = "Recursive";
  ViewScope[ViewScope["RecursiveAll"] = 2] = "RecursiveAll";
  ViewScope[ViewScope["FilesOnly"] = 3] = "FilesOnly";
})(ViewScope || (exports.ViewScope = ViewScope = {}));
},{"tslib":"../node_modules/tslib/tslib.es6.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","../utils/metadata":"../node_modules/@pnp/sp/utils/metadata.js","../decorators":"../node_modules/@pnp/sp/decorators.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/views/list.js":[function(require,module,exports) {
"use strict";

var _odata = require("@pnp/odata");

var _types = require("../lists/types");

var _types2 = require("./types");

(0, _odata.addProp)(_types._List, "views", _types2.Views);
(0, _odata.addProp)(_types._List, "defaultView", _types2.View, "DefaultView");

_types._List.prototype.getView = function (viewId) {
  return (0, _types2.View)(this, "getView('" + viewId + "')");
};
},{"@pnp/odata":"../node_modules/@pnp/odata/index.js","../lists/types":"../node_modules/@pnp/sp/lists/types.js","./types":"../node_modules/@pnp/sp/views/types.js"}],"../node_modules/@pnp/sp/views/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "View", {
  enumerable: true,
  get: function () {
    return _types.View;
  }
});
Object.defineProperty(exports, "ViewFields", {
  enumerable: true,
  get: function () {
    return _types.ViewFields;
  }
});
Object.defineProperty(exports, "Views", {
  enumerable: true,
  get: function () {
    return _types.Views;
  }
});
Object.defineProperty(exports, "ViewScope", {
  enumerable: true,
  get: function () {
    return _types.ViewScope;
  }
});

require("./list");

var _types = require("./types");
},{"./list":"../node_modules/@pnp/sp/views/list.js","./types":"../node_modules/@pnp/sp/views/types.js"}],"../node_modules/@pnp/sp/webparts/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebPartsPersonalizationScope = exports.WebPartDefinition = exports._WebPartDefinition = exports.WebPartDefinitions = exports._WebPartDefinitions = exports.LimitedWebPartManager = exports._LimitedWebPartManager = void 0;

var _tslib = require("tslib");

var _sharepointqueryable = require("../sharepointqueryable");

var _odata = require("@pnp/odata");

var _operations = require("../operations");

var _telemetry = require("../telemetry");

var _LimitedWebPartManager =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_LimitedWebPartManager, _super);

  function _LimitedWebPartManager() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_LimitedWebPartManager.prototype, "scope", {
    get: function () {
      return _telemetry.tag.configure((0, _sharepointqueryable.SharePointQueryable)(this, "Scope"), "f.scope");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_LimitedWebPartManager.prototype, "webparts", {
    get: function () {
      return WebPartDefinitions(this, "webparts");
    },
    enumerable: false,
    configurable: true
  });

  _LimitedWebPartManager.prototype.export = function (id) {
    return (0, _operations.spPost)(this.clone(LimitedWebPartManagerCloneFactory, "ExportWebPart"), (0, _odata.body)({
      webPartId: id
    }));
  };

  _LimitedWebPartManager.prototype.import = function (xml) {
    return (0, _operations.spPost)(this.clone(LimitedWebPartManagerCloneFactory, "ImportWebPart"), (0, _odata.body)({
      webPartXml: xml
    }));
  };

  return _LimitedWebPartManager;
}(_sharepointqueryable._SharePointQueryable);

exports._LimitedWebPartManager = _LimitedWebPartManager;

var LimitedWebPartManager = function (baseUrl, path) {
  return new _LimitedWebPartManager(baseUrl, path);
};

exports.LimitedWebPartManager = LimitedWebPartManager;

var LimitedWebPartManagerCloneFactory = function (baseUrl, path) {
  return LimitedWebPartManager(baseUrl, path);
};

var _WebPartDefinitions =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_WebPartDefinitions, _super);

  function _WebPartDefinitions() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Gets a web part definition from the collection by id
   *
   * @param id The storage ID of the SPWebPartDefinition to retrieve
   */


  _WebPartDefinitions.prototype.getById = function (id) {
    return WebPartDefinition(this, "getbyid('" + id + "')");
  };
  /**
   * Gets a web part definition from the collection by storage id
   *
   * @param id The WebPart.ID of the SPWebPartDefinition to retrieve
   */


  _WebPartDefinitions.prototype.getByControlId = function (id) {
    return WebPartDefinition(this, "getByControlId('" + id + "')");
  };

  return _WebPartDefinitions;
}(_sharepointqueryable._SharePointQueryableCollection);

exports._WebPartDefinitions = _WebPartDefinitions;
var WebPartDefinitions = (0, _sharepointqueryable.spInvokableFactory)(_WebPartDefinitions);
exports.WebPartDefinitions = WebPartDefinitions;

var _WebPartDefinition =
/** @class */
function (_super) {
  (0, _tslib.__extends)(_WebPartDefinition, _super);

  function _WebPartDefinition() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(_WebPartDefinition.prototype, "webpart", {
    /**
    * Gets the webpart information associated with this definition
    */
    get: function () {
      return (0, _sharepointqueryable.SharePointQueryableInstance)(this, "webpart");
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Saves changes to the Web Part made using other properties and methods on the SPWebPartDefinition object
   */

  _WebPartDefinition.prototype.saveChanges = function () {
    return (0, _operations.spPost)(this.clone(WebPartDefinition, "SaveWebPartChanges"));
  };
  /**
   * Moves the Web Part to a different location on a Web Part Page
   *
   * @param zoneId The ID of the Web Part Zone to which to move the Web Part
   * @param zoneIndex A Web Part zone index that specifies the position at which the Web Part is to be moved within the destination Web Part zone
   */


  _WebPartDefinition.prototype.moveTo = function (zoneId, zoneIndex) {
    return (0, _operations.spPost)(this.clone(WebPartDefinition, "MoveWebPartTo(zoneID='" + zoneId + "', zoneIndex=" + zoneIndex + ")"));
  };
  /**
   * Closes the Web Part. If the Web Part is already closed, this method does nothing
   */


  _WebPartDefinition.prototype.close = function () {
    return (0, _operations.spPost)(this.clone(WebPartDefinition, "CloseWebPart"));
  };
  /**
   * Opens the Web Part. If the Web Part is already closed, this method does nothing
   */


  _WebPartDefinition.prototype.open = function () {
    return (0, _operations.spPost)(this.clone(WebPartDefinition, "OpenWebPart"));
  };
  /**
   * Removes a webpart from a page, all settings will be lost
   */


  _WebPartDefinition.prototype.delete = function () {
    return (0, _operations.spPost)(this.clone(WebPartDefinition, "DeleteWebPart"));
  };

  return _WebPartDefinition;
}(_sharepointqueryable._SharePointQueryableInstance);

exports._WebPartDefinition = _WebPartDefinition;
var WebPartDefinition = (0, _sharepointqueryable.spInvokableFactory)(_WebPartDefinition);
exports.WebPartDefinition = WebPartDefinition;
var WebPartsPersonalizationScope;
exports.WebPartsPersonalizationScope = WebPartsPersonalizationScope;

(function (WebPartsPersonalizationScope) {
  WebPartsPersonalizationScope[WebPartsPersonalizationScope["User"] = 0] = "User";
  WebPartsPersonalizationScope[WebPartsPersonalizationScope["Shared"] = 1] = "Shared";
})(WebPartsPersonalizationScope || (exports.WebPartsPersonalizationScope = WebPartsPersonalizationScope = {}));
},{"tslib":"../node_modules/tslib/tslib.es6.js","../sharepointqueryable":"../node_modules/@pnp/sp/sharepointqueryable.js","@pnp/odata":"../node_modules/@pnp/odata/index.js","../operations":"../node_modules/@pnp/sp/operations.js","../telemetry":"../node_modules/@pnp/sp/telemetry.js"}],"../node_modules/@pnp/sp/webparts/file.js":[function(require,module,exports) {
"use strict";

var _types = require("../files/types");

var _types2 = require("./types");

_types._File.prototype.getLimitedWebPartManager = function (scope) {
  if (scope === void 0) {
    scope = _types2.WebPartsPersonalizationScope.Shared;
  }

  return (0, _types2.LimitedWebPartManager)(this, "getLimitedWebPartManager(scope=" + scope + ")");
};
},{"../files/types":"../node_modules/@pnp/sp/files/types.js","./types":"../node_modules/@pnp/sp/webparts/types.js"}],"../node_modules/@pnp/sp/webparts/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "WebPartsPersonalizationScope", {
  enumerable: true,
  get: function () {
    return _types.WebPartsPersonalizationScope;
  }
});
Object.defineProperty(exports, "WebPartDefinitions", {
  enumerable: true,
  get: function () {
    return _types.WebPartDefinitions;
  }
});
Object.defineProperty(exports, "WebPartDefinition", {
  enumerable: true,
  get: function () {
    return _types.WebPartDefinition;
  }
});
Object.defineProperty(exports, "LimitedWebPartManager", {
  enumerable: true,
  get: function () {
    return _types.LimitedWebPartManager;
  }
});

require("./file");

var _types = require("./types");
},{"./file":"../node_modules/@pnp/sp/webparts/file.js","./types":"../node_modules/@pnp/sp/webparts/types.js"}],"../node_modules/@pnp/sp/presets/all.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  sp: true,
  spODataEntity: true,
  spODataEntityArray: true
};
Object.defineProperty(exports, "spODataEntity", {
  enumerable: true,
  get: function () {
    return _odata.spODataEntity;
  }
});
Object.defineProperty(exports, "spODataEntityArray", {
  enumerable: true,
  get: function () {
    return _odata.spODataEntityArray;
  }
});
exports.sp = void 0;

var _rest = require("../rest");

var _appcatalog = require("../appcatalog");

Object.keys(_appcatalog).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _appcatalog[key];
    }
  });
});

var _attachments = require("../attachments");

Object.keys(_attachments).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _attachments[key];
    }
  });
});

var _clientsidePages = require("../clientside-pages");

Object.keys(_clientsidePages).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _clientsidePages[key];
    }
  });
});

var _columnDefaults = require("../column-defaults");

Object.keys(_columnDefaults).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _columnDefaults[key];
    }
  });
});

var _comments = require("../comments");

Object.keys(_comments).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _comments[key];
    }
  });
});

var _contentTypes = require("../content-types");

Object.keys(_contentTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _contentTypes[key];
    }
  });
});

var _features = require("../features");

Object.keys(_features).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _features[key];
    }
  });
});

var _fields = require("../fields");

Object.keys(_fields).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fields[key];
    }
  });
});

var _files = require("../files");

Object.keys(_files).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _files[key];
    }
  });
});

var _folders = require("../folders");

Object.keys(_folders).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _folders[key];
    }
  });
});

var _forms = require("../forms");

Object.keys(_forms).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _forms[key];
    }
  });
});

var _hubsites = require("../hubsites");

Object.keys(_hubsites).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hubsites[key];
    }
  });
});

var _items = require("../items");

Object.keys(_items).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _items[key];
    }
  });
});

var _lists = require("../lists");

Object.keys(_lists).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _lists[key];
    }
  });
});

var _navigation = require("../navigation");

Object.keys(_navigation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _navigation[key];
    }
  });
});

var _profiles = require("../profiles");

Object.keys(_profiles).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _profiles[key];
    }
  });
});

var _regionalSettings = require("../regional-settings");

Object.keys(_regionalSettings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _regionalSettings[key];
    }
  });
});

var _relatedItems = require("../related-items");

Object.keys(_relatedItems).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _relatedItems[key];
    }
  });
});

var _search = require("../search");

Object.keys(_search).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _search[key];
    }
  });
});

var _security = require("../security");

Object.keys(_security).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _security[key];
    }
  });
});

var _sharing = require("../sharing");

Object.keys(_sharing).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sharing[key];
    }
  });
});

var _siteDesigns = require("../site-designs");

Object.keys(_siteDesigns).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _siteDesigns[key];
    }
  });
});

var _siteGroups = require("../site-groups");

Object.keys(_siteGroups).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _siteGroups[key];
    }
  });
});

var _siteScripts = require("../site-scripts");

Object.keys(_siteScripts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _siteScripts[key];
    }
  });
});

var _siteUsers = require("../site-users");

Object.keys(_siteUsers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _siteUsers[key];
    }
  });
});

var _sites = require("../sites");

Object.keys(_sites).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sites[key];
    }
  });
});

var _social = require("../social");

Object.keys(_social).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _social[key];
    }
  });
});

var _sputilities = require("../sputilities");

Object.keys(_sputilities).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sputilities[key];
    }
  });
});

var _subscriptions = require("../subscriptions");

Object.keys(_subscriptions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _subscriptions[key];
    }
  });
});

var _taxonomy = require("../taxonomy");

Object.keys(_taxonomy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _taxonomy[key];
    }
  });
});

var _userCustomActions = require("../user-custom-actions");

Object.keys(_userCustomActions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _userCustomActions[key];
    }
  });
});

var _views = require("../views");

Object.keys(_views).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _views[key];
    }
  });
});

var _webparts = require("../webparts");

Object.keys(_webparts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _webparts[key];
    }
  });
});

var _webs = require("../webs");

Object.keys(_webs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _webs[key];
    }
  });
});

var _odata = require("../odata");

var _index = require("../index");

Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index[key];
    }
  });
});
var sp = new _rest.SPRest();
exports.sp = sp;
},{"../rest":"../node_modules/@pnp/sp/rest.js","../appcatalog":"../node_modules/@pnp/sp/appcatalog/index.js","../attachments":"../node_modules/@pnp/sp/attachments/index.js","../clientside-pages":"../node_modules/@pnp/sp/clientside-pages/index.js","../column-defaults":"../node_modules/@pnp/sp/column-defaults/index.js","../comments":"../node_modules/@pnp/sp/comments/index.js","../content-types":"../node_modules/@pnp/sp/content-types/index.js","../features":"../node_modules/@pnp/sp/features/index.js","../fields":"../node_modules/@pnp/sp/fields/index.js","../files":"../node_modules/@pnp/sp/files/index.js","../folders":"../node_modules/@pnp/sp/folders/index.js","../forms":"../node_modules/@pnp/sp/forms/index.js","../hubsites":"../node_modules/@pnp/sp/hubsites/index.js","../items":"../node_modules/@pnp/sp/items/index.js","../lists":"../node_modules/@pnp/sp/lists/index.js","../navigation":"../node_modules/@pnp/sp/navigation/index.js","../profiles":"../node_modules/@pnp/sp/profiles/index.js","../regional-settings":"../node_modules/@pnp/sp/regional-settings/index.js","../related-items":"../node_modules/@pnp/sp/related-items/index.js","../search":"../node_modules/@pnp/sp/search/index.js","../security":"../node_modules/@pnp/sp/security/index.js","../sharing":"../node_modules/@pnp/sp/sharing/index.js","../site-designs":"../node_modules/@pnp/sp/site-designs/index.js","../site-groups":"../node_modules/@pnp/sp/site-groups/index.js","../site-scripts":"../node_modules/@pnp/sp/site-scripts/index.js","../site-users":"../node_modules/@pnp/sp/site-users/index.js","../sites":"../node_modules/@pnp/sp/sites/index.js","../social":"../node_modules/@pnp/sp/social/index.js","../sputilities":"../node_modules/@pnp/sp/sputilities/index.js","../subscriptions":"../node_modules/@pnp/sp/subscriptions/index.js","../taxonomy":"../node_modules/@pnp/sp/taxonomy/index.js","../user-custom-actions":"../node_modules/@pnp/sp/user-custom-actions/index.js","../views":"../node_modules/@pnp/sp/views/index.js","../webparts":"../node_modules/@pnp/sp/webparts/index.js","../webs":"../node_modules/@pnp/sp/webs/index.js","../odata":"../node_modules/@pnp/sp/odata.js","../index":"../node_modules/@pnp/sp/index.js"}],"Utilities/PeoplePicker.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PeoplePicker = void 0;

var all_1 = require("@pnp/sp/presets/all");

function validate(key) {
  return __awaiter(this, void 0, Promise, function () {
    var siteUser, err_1, userInfo;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (typeof key === "undefined" || !key) {
            return [2
            /*return*/
            , null];
          }

          _a.label = 1;

        case 1:
          _a.trys.push([1, 3,, 7]);

          return [4
          /*yield*/
          , all_1.sp.web.siteUsers.getByLoginName(key).get()];

        case 2:
          siteUser = _a.sent();

          if (siteUser.Id) {
            return [2
            /*return*/
            , siteUser.Id];
          }

          return [3
          /*break*/
          , 7];

        case 3:
          err_1 = _a.sent();
          return [4
          /*yield*/
          , all_1.sp.web.siteGroups.getById(612).users.add(key)];

        case 4:
          siteUser = _a.sent();
          if (!siteUser) return [3
          /*break*/
          , 6];
          return [4
          /*yield*/
          , siteUser.select("Id").get()];

        case 5:
          userInfo = _a.sent();
          return [2
          /*return*/
          , userInfo.Id];

        case 6:
          return [3
          /*break*/
          , 7];

        case 7:
          return [2
          /*return*/
          ];
      }
    });
  });
}

var InitializeStandalonePeoplePicker = SPClientPeoplePicker.InitializeStandalonePeoplePicker,
    SPClientPeoplePickerDict = SPClientPeoplePicker.SPClientPeoplePickerDict;

var PeoplePicker =
/** @class */
function () {
  function PeoplePicker(payload) {
    var id = payload.id,
        schema = payload.schema,
        validator = payload.validator,
        model = payload.model,
        value = payload.value,
        required = payload.required;
    this.value = value;
    this.properties = {};
    this.properties[value + "Id"] = null;
    this.properties[value + "StringId"] = null;
    this.model = Object.assign(model, this.properties);
    this.validator = validator;
    InitializeStandalonePeoplePicker(id, null, schema);
    this.client = SPClientPeoplePickerDict[id + "_TopSpan"]; // Eventos

    this.client.OnUserResolvedClientScript = this.resolved.bind(this);
    this.client.OnValueChangedClientScript = this.changed.bind(this);

    if (required) {
      document.getElementById(this.client.HiddenInputId).setAttribute("required", "");
    }

    document.getElementById(id + "_TopSpan").classList.add("input");
  }

  PeoplePicker.getClient = function (id) {
    return SPClientPeoplePickerDict[id + "_TopSpan"];
  };

  PeoplePicker.prototype.resolved = function (elementId, users) {
    var _this = this;

    var input = document.getElementById(this.client.HiddenInputId);
    var value = this.value;
    this.model[value + "Id"] = {
      results: []
    };
    this.model[value + "StringId"] = {
      results: []
    };
    users.forEach(function (user) {
      return __awaiter(_this, void 0, void 0, function () {
        var id, err_2;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!user.IsResolved) return [3
              /*break*/
              , 4];
              _a.label = 1;

            case 1:
              _a.trys.push([1, 3,, 4]);

              return [4
              /*yield*/
              , validate(user.Key)];

            case 2:
              id = _a.sent();
              this.model[value + "Id"].results.push(id);
              this.model[value + "StringId"].results.push(id.toString());
              input.value = {};
              this.validator.validateInput(input);
              this.model.dirty = true;
              return [3
              /*break*/
              , 4];

            case 3:
              err_2 = _a.sent(); // No se pudo validar el usuario

              console.log("error validando:" + user.DisplayText);
              return [3
              /*break*/
              , 4];

            case 4:
              return [2
              /*return*/
              ];
          }
        });
      });
    });

    if (users.length === 0) {
      this.model[value + "Id"] = null;
      this.model[value + "StringId"] = null;
    }
  };

  PeoplePicker.prototype.changed = function (elementId, users) {
    var input = document.getElementById(this.client.HiddenInputId);
    var value = this.value; // Si no hay usuarios resueltos en el componente, ponemos el requerido con kendo

    if (users.length < 1) {
      input.value = ""; // Si hay más de dos usarios en el control y solo se permite uno, el modelo no es valido
    } else if (users.length > 1 && !this.client.AllowMultipleUsers) {
      input.value = "";
    }

    if (users.length == 1 && this.model[value + "Id"] == null) {
      input.value = "";
    }

    if (this.validator) {
      this.validator.validateInput(input);
    }
  };

  PeoplePicker.prototype.isRequied = function (required) {
    if (required) {
      document.getElementById(this.client.HiddenInputId).setAttribute("required", "");
    } else {
      document.getElementById(this.client.HiddenInputId).removeAttribute("required");
    }
  };

  PeoplePicker.prototype.enable = function (enable) {
    if (enable) {
      $(".sp-peoplepicker-delImage").show();
      $("#" + this.client.EditorElementId).removeProp("disabled");
      $("#" + this.client.TopLevelElementId).toggleClass("sp-peoplepicker-topLevelDisabled");
      $("#" + this.client.TopLevelElementId).removeAttr("disabled");
    } else {
      $(".sp-peoplepicker-delImage").hide();
      $("#" + this.client.EditorElementId).prop("disabled", true);
      $("#" + this.client.TopLevelElementId).toggleClass("sp-peoplepicker-topLevelDisabled");
      $("#" + this.client.TopLevelElementId).attr("disabled", "");
    }
  };

  PeoplePicker.prototype.clear = function () {
    var _this = this;

    var resolvedUsers = $(document.getElementById(this.client.ResolvedListElementId)).find("span[class='sp-peoplepicker-userSpan']");
    $(resolvedUsers).each(function (index, element) {
      _this.client.DeleteProcessedUser(element);
    });
  };

  return PeoplePicker;
}();

exports.PeoplePicker = PeoplePicker;
},{"@pnp/sp/presets/all":"../node_modules/@pnp/sp/presets/all.js"}],"Template/registro.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateDialog = exports.getTemplateUser = void 0;

var utils_1 = require("../Utilities/utils");

function getTemplateUser(item) {
  return "\n    <div class=\"divMB\">\n        <img alt=\"User\" id=\"imgMB\" src=\"" + utils_1.urls.site + "/ReqIntegrados/_layouts/15/userphoto.aspx?size=M&username=" + item.Aprobador.EMail + "\" style=\"display: inline;\">\n    </div>\n    <div class=\"divMB\">\n        " + item.Aprobador.Title + "   \n    </div>\n    ";
}

exports.getTemplateUser = getTemplateUser;

function getTemplateDialog(item) {
  return "\n    \n        <form id=\"formConf\">\n            <div class=\"se-content\">\n                <p>\xBFDesea provomer la iniciativa <b>" + item.NombreOportunidad + "</b>?</p>\n                <div style=\"text-align: center;\">\n                    <input id='tipoProyecto' style=\"width:250px\" required />\n                </div>\n            </div>  \n            <div class=\"se-footer\">\n                <button class=\"k-button k-button-icontext k-primary k-grid-update\" id=\"yesButton\">Promover</button>\n                <button class=\"k-button\" id=\"noButton\">Cancelar</button>\n            </div>            \n        </form>\n    ";
}

exports.getTemplateDialog = getTemplateDialog;
},{"../Utilities/utils":"Utilities/utils.ts"}],"Controller/ComiteValoracionController.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComiteValoracionController = void 0;

var utils_1 = require("../Utilities/utils");

var IniciativasBL_1 = require("../BusinessLogic/IniciativasBL");

var ComiteValoracionController;

(function (ComiteValoracionController) {
  function obtenerEncargados(filtro) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.EncargadosComite.items.filter(filtro).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.obtenerEncargados = obtenerEncargados;

  function validarDiligenciamientoComiteValoracion(id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.filter("Estado eq 'espera' and Fase eq 'CV' and IdIniciativa eq " + id).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.validarDiligenciamientoComiteValoracion = validarDiligenciamientoComiteValoracion;

  function validarDiligenciamientoComiteGestionDemanda(id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.filter("Estado eq 'espera' and Fase eq 'CGD' and IdIniciativa eq " + id).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.validarDiligenciamientoComiteGestionDemanda = validarDiligenciamientoComiteGestionDemanda;

  function validarDiligenciamientoComitePatrocinadores(id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.filter("Estado eq 'espera' and Fase eq 'CP' and IdIniciativa eq " + id).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.validarDiligenciamientoComitePatrocinadores = validarDiligenciamientoComitePatrocinadores;

  function validarDiligenciamientoEquipoProductividad(id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.filter("EProductividadCompletado eq 'no' and Fase eq 'EProd' and IdIniciativa eq " + id).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.validarDiligenciamientoEquipoProductividad = validarDiligenciamientoEquipoProductividad;

  function validarDiligenciamientoEquipoProyectos(id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.filter("EProyectosCompletado eq 'no' and Fase eq 'EProy' and IdIniciativa eq " + id).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.validarDiligenciamientoEquipoProyectos = validarDiligenciamientoEquipoProyectos;

  function aprobacionesComiteValoracion(id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.filter("Estado eq 'aprobado' and Fase eq 'CV' and IdIniciativa eq " + id).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.aprobacionesComiteValoracion = aprobacionesComiteValoracion;

  function aprobacionesComiteGestionDemanda(id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.filter("Estado eq 'aprobado' and Fase eq 'CGD' and IdIniciativa eq " + id).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.aprobacionesComiteGestionDemanda = aprobacionesComiteGestionDemanda;

  function aprobacionesComitePatrocinadores(id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.filter("Estado eq 'aprobado' and Fase eq 'CP' and IdIniciativa eq " + id).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.aprobacionesComitePatrocinadores = aprobacionesComitePatrocinadores;

  function aprobacionesEquipoProductividad(id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.filter("Estado eq 'aprobado' and Fase eq 'EProd' and IdIniciativa eq " + id).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.aprobacionesEquipoProductividad = aprobacionesEquipoProductividad;

  function aprobacionesEquipoProyectos(id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.filter("Estado eq 'aprobado' and Fase eq 'EProy' and IdIniciativa eq " + id).get()];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.aprobacionesEquipoProyectos = aprobacionesEquipoProyectos;

  function insertarEncargadosComiteValoracion(result, id) {
    return __awaiter(this, void 0, void 0, function () {
      var i, data;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            i = 0;
            _a.label = 1;

          case 1:
            if (!(i < result.length)) return [3
            /*break*/
            , 4];
            delete result[i].EncargadoStringId;
            data = {
              EncargadoId: {
                results: [result[i].EncargadoId]
              },
              Estado: "espera",
              IdIniciativa: id,
              Fase: "CV"
            };
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.add(data)];

          case 2:
            _a.sent();

            _a.label = 3;

          case 3:
            i++;
            return [3
            /*break*/
            , 1];

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  ComiteValoracionController.insertarEncargadosComiteValoracion = insertarEncargadosComiteValoracion;

  function insertarEncargadosComiteGestionDemanda(result, id) {
    return __awaiter(this, void 0, void 0, function () {
      var i, data;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            i = 0;
            _a.label = 1;

          case 1:
            if (!(i < result.length)) return [3
            /*break*/
            , 4];
            data = {
              EncargadoId: {
                results: [result[i].EncargadoId]
              },
              Estado: "espera",
              IdIniciativa: id,
              Fase: "CGD"
            };
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.add(data)];

          case 2:
            _a.sent();

            _a.label = 3;

          case 3:
            i++;
            return [3
            /*break*/
            , 1];

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  ComiteValoracionController.insertarEncargadosComiteGestionDemanda = insertarEncargadosComiteGestionDemanda;

  function insertarEncargadosComitePatrocinadores(result, id) {
    return __awaiter(this, void 0, void 0, function () {
      var i, data;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            i = 0;
            _a.label = 1;

          case 1:
            if (!(i < result.length)) return [3
            /*break*/
            , 4];
            data = {
              EncargadoId: {
                results: [result[i].EncargadoId]
              },
              Estado: "espera",
              IdIniciativa: id,
              Fase: "CP"
            };
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.add(data)];

          case 2:
            _a.sent();

            _a.label = 3;

          case 3:
            i++;
            return [3
            /*break*/
            , 1];

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  ComiteValoracionController.insertarEncargadosComitePatrocinadores = insertarEncargadosComitePatrocinadores;

  function insertarEquipoProductividad(result, id) {
    return __awaiter(this, void 0, void 0, function () {
      var i, data;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            i = 0;
            _a.label = 1;

          case 1:
            if (!(i < result.length)) return [3
            /*break*/
            , 4];
            data = {
              EncargadoId: {
                results: [result[i].EncargadoId]
              },
              Estado: "equipo",
              IdIniciativa: id,
              Fase: "EProd"
            };
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.add(data)];

          case 2:
            _a.sent();

            _a.label = 3;

          case 3:
            i++;
            return [3
            /*break*/
            , 1];

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  ComiteValoracionController.insertarEquipoProductividad = insertarEquipoProductividad;

  function insertarEquipoProyectos(result, id) {
    return __awaiter(this, void 0, void 0, function () {
      var i, data;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            i = 0;
            _a.label = 1;

          case 1:
            if (!(i < result.length)) return [3
            /*break*/
            , 4];
            data = {
              EncargadoId: {
                results: [result[i].EncargadoId]
              },
              Estado: "equipo",
              IdIniciativa: id,
              Fase: "EProy"
            };
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.add(data)];

          case 2:
            _a.sent();

            _a.label = 3;

          case 3:
            i++;
            return [3
            /*break*/
            , 1];

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  ComiteValoracionController.insertarEquipoProyectos = insertarEquipoProyectos;

  function insertarEncargadosCGD(result, id) {
    return __awaiter(this, void 0, void 0, function () {
      var EncargadoId, i;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            EncargadoId = [];

            for (i = 0; i < result.length; i++) {
              EncargadoId.push(result[i].EncargadoId);
            }

            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(id).update({
              ResponsablesComiteId: {
                results: EncargadoId
              }
            })];

          case 1:
            _a.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  }

  ComiteValoracionController.insertarEncargadosCGD = insertarEncargadosCGD;

  function insertarEncargadosCP(result, id) {
    return __awaiter(this, void 0, void 0, function () {
      var EncargadoId, i;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            EncargadoId = [];

            for (i = 0; i < result.length; i++) {
              EncargadoId.push(result[i].EncargadoId);
            }

            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(id).update({
              ResponsablesComiteId: {
                results: EncargadoId
              }
            })];

          case 1:
            _a.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  }

  ComiteValoracionController.insertarEncargadosCP = insertarEncargadosCP;

  function insertarEProd(result, id) {
    return __awaiter(this, void 0, void 0, function () {
      var EncargadoId, i;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            EncargadoId = [];

            for (i = 0; i < result.length; i++) {
              EncargadoId.push(result[i].EncargadoId);
            }

            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(id).update({
              ResponsablesComiteId: {
                results: EncargadoId
              }
            })];

          case 1:
            _a.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  }

  ComiteValoracionController.insertarEProd = insertarEProd;

  function insertarEProy(result, id) {
    return __awaiter(this, void 0, void 0, function () {
      var EncargadoId, i;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            EncargadoId = [];

            for (i = 0; i < result.length; i++) {
              EncargadoId.push(result[i].EncargadoId);
            }

            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(id).update({
              ResponsablesComiteId: {
                results: EncargadoId
              }
            })];

          case 1:
            _a.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  }

  ComiteValoracionController.insertarEProy = insertarEProy;

  function vaciarEncargados(id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(id).update({
              ResponsablesComiteId: {
                results: []
              }
            })];

          case 1:
            _a.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  }

  ComiteValoracionController.vaciarEncargados = vaciarEncargados;

  function update(data) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.getById(data.Id).update(data)];

          case 1:
            result = _a.sent();
            IniciativasBL_1.IniciativasEvents.NotificationSuccess("Datos ingresados con exito");
            return [2
            /*return*/
            , result];
        }
      });
    });
  }

  ComiteValoracionController.update = update;
})(ComiteValoracionController = exports.ComiteValoracionController || (exports.ComiteValoracionController = {}));
},{"../Utilities/utils":"Utilities/utils.ts","../BusinessLogic/IniciativasBL":"BusinessLogic/IniciativasBL.ts"}],"Controller/PromoteController.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromoteController = void 0;

var utils_1 = require("../Utilities/utils");

var PromoteController;

(function (PromoteController) {
  function getContextInfoPWA() {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , fetch(utils_1.urls.PWA + "/_api/contextinfo", {
              method: "POST",
              headers: new Headers({
                "Accept": "application/json; odata=verbose"
              })
            })];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteController.getContextInfoPWA = getContextInfoPWA;

  function createProject(objRegistro, FormDigestValue) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , fetch(utils_1.urls.PWA + "/_api/ProjectServer/Projects/Add", {
              method: "POST",
              body: JSON.stringify(objRegistro),
              headers: new Headers({
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": FormDigestValue,
                "Content-Type": "application/json;odata=verbose"
              })
            })];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteController.createProject = createProject;

  function checkOutProject(idPro, FormDigestValue) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , fetch(utils_1.urls.PWA + "/_api/ProjectServer/Projects('" + idPro + "')/checkOut()", {
              method: "POST",
              headers: new Headers({
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": FormDigestValue,
                "Content-Type": "application/json;odata=verbose"
              })
            })];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteController.checkOutProject = checkOutProject;

  function getProject(idPro, FormDigestValue) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , fetch(utils_1.urls.PWA + "/_api/ProjectData/Proyectos(guid'" + idPro + "')", {
              method: "GET",
              headers: new Headers({
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": FormDigestValue,
                "Content-Type": "application/json;odata=verbose"
              })
            })];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteController.getProject = getProject;

  function checkInProject(idPro, FormDigestValue) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , fetch(utils_1.urls.PWA + "/_api/ProjectServer/Projects('" + idPro + "')/Draft/publish(true)", {
              method: "POST",
              headers: new Headers({
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": FormDigestValue
              })
            })];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteController.checkInProject = checkInProject;

  function updateCustomFields(idPro, FormDigestValue, objCustomFields) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , fetch(utils_1.urls.PWA + "/_api/ProjectServer/Projects('" + idPro + "')/Draft/UpdateCustomFields", {
              method: "POST",
              body: JSON.stringify(objCustomFields),
              headers: new Headers({
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": FormDigestValue,
                "Content-Type": "application/json;odata=verbose"
              })
            })];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteController.updateCustomFields = updateCustomFields;

  function getEnterpriseProjectTypes(FormDigestValue) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , fetch(utils_1.urls.PWA + "/_api/ProjectServer/EnterpriseProjectTypes", {
              method: "GET",
              headers: new Headers({
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": FormDigestValue,
                "Content-Type": "application/json;odata=verbose"
              })
            })];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteController.getEnterpriseProjectTypes = getEnterpriseProjectTypes;
})(PromoteController = exports.PromoteController || (exports.PromoteController = {}));
},{"../Utilities/utils":"Utilities/utils.ts"}],"BusinessLogic/PromoteBL.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromoteBl = void 0;

var PromoteController_1 = require("../Controller/PromoteController");

var PromoteBl;

(function (PromoteBl) {
  function getContextInfoPWA() {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , PromoteController_1.PromoteController.getContextInfoPWA()];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteBl.getContextInfoPWA = getContextInfoPWA;

  function createProject(objRegistro, FormDigestValue) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , PromoteController_1.PromoteController.createProject(objRegistro, FormDigestValue)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteBl.createProject = createProject;

  function checkOutProject(idPro, FormDigestValue) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , PromoteController_1.PromoteController.checkOutProject(idPro, FormDigestValue)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteBl.checkOutProject = checkOutProject;

  function checkInProject(idPro, FormDigestValue) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , PromoteController_1.PromoteController.checkInProject(idPro, FormDigestValue)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteBl.checkInProject = checkInProject;

  function updateCustomFields(idPro, FormDigestValue, objCustomFields) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , PromoteController_1.PromoteController.updateCustomFields(idPro, FormDigestValue, objCustomFields)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteBl.updateCustomFields = updateCustomFields;

  function getProject(idPro, FormDigestValue) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , PromoteController_1.PromoteController.getProject(idPro, FormDigestValue)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  PromoteBl.getProject = getProject;

  function getEnterpriseProjectTypes() {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;

      return __generator(this, function (_a) {
        return [2
        /*return*/
        , new Promise(function (resolve, reject) {
          return __awaiter(_this, void 0, void 0, function () {
            var result, context, FormDigestValue, results, data;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  return [4
                  /*yield*/
                  , getContextInfoPWA()];

                case 1:
                  result = _a.sent();
                  return [4
                  /*yield*/
                  , result.json()];

                case 2:
                  context = _a.sent();
                  FormDigestValue = context.d.GetContextWebInformation.FormDigestValue;
                  return [4
                  /*yield*/
                  , PromoteController_1.PromoteController.getEnterpriseProjectTypes(FormDigestValue)];

                case 3:
                  results = _a.sent();
                  return [4
                  /*yield*/
                  , results.json()];

                case 4:
                  data = _a.sent();
                  resolve(data.d.results);
                  return [2
                  /*return*/
                  ];
              }
            });
          });
        })];
      });
    });
  }

  PromoteBl.getEnterpriseProjectTypes = getEnterpriseProjectTypes;
})(PromoteBl = exports.PromoteBl || (exports.PromoteBl = {}));
},{"../Controller/PromoteController":"Controller/PromoteController.ts"}],"BusinessLogic/IniciativasBL.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromoteProjectOnline = exports.DataGridIniciativas = exports.IniciativasEvents = exports.DataIniciativas = void 0; //Exporta Librerias para que retorne al Controlador 

var IniciativasController_1 = require("../Controller/IniciativasController");

var utils_1 = require("../Utilities/utils");

var PeoplePicker_1 = require("../Utilities/PeoplePicker");

var registro_1 = require("../Template/registro");

var PuntajeController_1 = require("../Controller/PuntajeController");

var ComiteValoracionController_1 = require("../Controller/ComiteValoracionController");

var PromoteBL_1 = require("./PromoteBL");

var DataIniciativas;

(function (DataIniciativas) {
  function ReadData(filtro) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , IniciativasController_1.DataController.readData(filtro)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  DataIniciativas.ReadData = ReadData;

  function CreateData(data) {
    return __awaiter(this, void 0, void 0, function () {
      var item, files;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            delete data.Id;
            delete data.innovacion;
            delete data.Title;
            delete data.ColaboradorStringId;
            delete data.AnalistaAsignadoStringId;
            return [4
            /*yield*/
            , PuntajeController_1.PuntajeController.createPuntaje(data)];

          case 1:
            _a.sent();

            data.ColaboradorId = data.ColaboradorId.results[0];
            data.AnalistaAsignadoId = data.AnalistaAsignadoId.results[0];
            data.Estado = "espera";
            data.Fase = "Requester";
            if (!IniciativasEvents.attach.length) return [3
            /*break*/
            , 4];
            return [4
            /*yield*/
            , IniciativasController_1.DataController.createData(data)];

          case 2:
            item = _a.sent();
            files = IniciativasEvents.attach.filter(function (item) {
              return item["content"];
            });
            return [4
            /*yield*/
            , addAttachment(item["data"]["Id"], files)];

          case 3:
            _a.sent();

            return [3
            /*break*/
            , 6];

          case 4:
            return [4
            /*yield*/
            , IniciativasController_1.DataController.createData(data)];

          case 5:
            return [2
            /*return*/
            , _a.sent()];

          case 6:
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  DataIniciativas.CreateData = CreateData;

  function addAttachment(id, data) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , IniciativasController_1.DataController.addAttachment(id, data)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  function UpDate(data) {
    return __awaiter(this, void 0, void 0, function () {
      var id, files, eliminar, i, encargados, encargadosId, i;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            id = data["Id"];
            delete data.ColaboradorStringId;
            delete data.AnalistaAsignadoStringId;
            delete data.innovacion;
            delete data.ResponsablesComiteStringId;
            delete data.ResponsablesComiteId;
            delete data.Iniciativa_x0020_Aplazada;
            delete data.Author;
            delete data.EstadoIdea;

            if (data.ColaboradorId) {
              data.ColaboradorId = data.ColaboradorId.results[0];
            }

            if (data.AnalistaAsignadoId) {
              data.AnalistaAsignadoId = data.AnalistaAsignadoId.results[0];
            }

            if (!IniciativasEvents.attach.length) return [3
            /*break*/
            , 2];
            files = IniciativasEvents.attach.filter(function (item) {
              return item["content"];
            });
            return [4
            /*yield*/
            , addAttachment(id, files)];

          case 1:
            _a.sent();

            _a.label = 2;

          case 2:
            delete data.Colaborador;
            delete data.AnalistaAsignado;
            if (!$("#cbst").prop("checked")) return [3
            /*break*/
            , 9];
            data.Notificacion = true;
            data.Fase = "Comité de Valoración";
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.filter("IdIniciativa eq " + data.Id + " and Fase eq 'CV'").get()];

          case 3:
            eliminar = _a.sent();
            if (!(eliminar.length >= 1)) return [3
            /*break*/
            , 7];
            i = 0;
            _a.label = 4;

          case 4:
            if (!(i < eliminar.length)) return [3
            /*break*/
            , 7];
            return [4
            /*yield*/
            , utils_1.lists.ComiteValoracion.items.getById(eliminar[i].Id).update({
              Fase: "Aplazada"
            })];

          case 5:
            _a.sent();

            _a.label = 6;

          case 6:
            i++;
            return [3
            /*break*/
            , 4];

          case 7:
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.obtenerEncargados("Fase eq 'CV'")];

          case 8:
            encargados = _a.sent();
            ComiteValoracionController_1.ComiteValoracionController.insertarEncargadosComiteValoracion(encargados, data.Id);
            encargadosId = [];

            for (i = 0; i < encargados.length; i++) {
              encargadosId.push(encargados[i].EncargadoId);
            }

            data.ResponsablesComiteId = {
              results: encargadosId
            };
            _a.label = 9;

          case 9:
            if ($("#promovido").prop("checked")) {
              data.Promovida = true;
              data.Fase = "Promovida";
            }

            return [4
            /*yield*/
            , IniciativasController_1.DataController.updateData(data)];

          case 10:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  DataIniciativas.UpDate = UpDate;

  function destroyData(data) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , IniciativasController_1.DataController.deleteData(data)];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  }

  DataIniciativas.destroyData = destroyData;
})(DataIniciativas = exports.DataIniciativas || (exports.DataIniciativas = {}));

var IniciativasEvents;

(function (IniciativasEvents) {
  function edit(ev) {
    return __awaiter(this, void 0, void 0, function () {
      var tabstrip, validator, Colaborador, AnalistaAsignado, textB, CBSFT, promovido, costo, attachments, created, contentReduccionCostos, contentNielDeServicios, contentInnovacion, contentEsfuerzoTiempo;

      var _this = this;

      return __generator(this, function (_a) {
        tabstrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
        IniciativasEvents.IdModel = ev.model["Id"];
        $(".k-grid-update").html("<span class='k-icon k-i-check'></span>GUARDAR");
        $(".k-grid-cancel").html("<span class='k-icon k-i-cancel'></span>CANCELAR");
        $("#tabHistorico").css("display", "none"); //Funcion Para Datos Adjuntos

        IniciativasEvents.attach = [];
        IniciativasEvents.objUpload = $("#adjuntos").kendoUpload({
          select: onSelect
        }).data("kendoUpload");
        validator = ev.container.data("kendoValidator");
        Colaborador = new PeoplePicker_1.PeoplePicker({
          id: "Colaborador",
          model: ev.model,
          schema: {
            'PrincipalAccountType': 'User',
            'SearchPrincipalSource': 15,
            'ResolvePrincipalSource': 15,
            'AllowMultipleValues': false,
            'MaximumEntitySuggestions': 50
          },
          validator: validator,
          value: "Colaborador",
          required: true
        });
        AnalistaAsignado = new PeoplePicker_1.PeoplePicker({
          id: "AnalistaAsignado",
          model: ev.model,
          schema: {
            'PrincipalAccountType': 'User',
            'SearchPrincipalSource': 15,
            'ResolvePrincipalSource': 15,
            'AllowMultipleValues': false,
            'MaximumEntitySuggestions': 50
          },
          validator: validator,
          value: "AnalistaAsignado",
          required: true
        });
        $("#promoteContent").css("display", "none");

        if (!ev.model.isNew()) {
          $("#promoteContent").css("display", "block");
          textB = "COMITÉ DE VALORACIÓN";
          CBSFT = "<div class='se-div-cbsf'><input type=\"checkbox\" id=\"cbst\" class=\"k-checkbox\"><label class=\"k-checkbox-label\" for=\"cbst\">" + textB + "</label></div>";
          ev.container.find(".k-edit-buttons").prepend(CBSFT);
          promovido = "<div style=\"display: none;\"><input type=\"checkbox\" id=\"promovido\" class=\"k-checkbox\"></div>";
          ev.container.find(".k-edit-buttons").prepend(promovido);
          costo = new Intl.NumberFormat().format(ev.model["CostoAproximado"]);
          $("#CostoAproximado").val(costo);

          if (ev.model["Attachments"]) {
            attachments = IniciativasController_1.DataController.getAttachment(ev.model["Id"]);
            listAttachments(ev);
            $("#listViewDiv").remove();
          }

          $("#tabHistorico").css("display", "block");
          $(".NumeroIdea").css("display", "block");
          $("#NumeroIdea").val(ev.model["Id"]);
          $("#NumeroIdea").attr("disabled", "disabled");
          $(".CreadoPor").css("display", "block");
          $("#CreadoPor").val(ev.model["Author"].Title);
          $("#CreadoPor").attr("disabled", "disabled");
          created = kendo.toString(kendo.parseDate(ev.model["Created"]), "dd-MM-yyyy");
          $(".FechaCreacion").css("display", "block");
          $("#FechaCreacion").val(created);
          $("#FechaCreacion").attr("disabled", "disabled");
          Colaborador.client.AddUserKeys(ev.model["Colaborador"].Name, false);
          AnalistaAsignado.client.AddUserKeys(ev.model["AnalistaAsignado"].Name, false);

          if (!(ev.model["Fase"] == "Requester" || ev.model["Fase"] == "Aplazada")) {
            $(".se-div-cbsf").css("display", "none");
          }

          if (ev.model["Promovida"] == true) {
            $("#promoteContent").css("display", "none");
            bloquearCampos();
          } else {
            $("#btnPromover").click(function () {
              PromoteProjectOnline.promoteClick(ev);
            });
          }
        } //funcion del DropDownList  tipo lista


        $("#EstadoIdea").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Id",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'EstadoIdea'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#TipoCosto").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Id",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'TipoCosto'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#UEN").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Id",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'UEN'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#Regional").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Id",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'Regional'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#QueProponer").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Id",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'QueProponer'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#Coordinacion").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Id",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'Coordinacion'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#CostoAproximado").blur(function () {
          if ($("#CostoAproximado").val() != "") {
            var costo = new Intl.NumberFormat().format(ev.model["CostoAproximado"]);
            $("#CostoAproximado").val(costo);
          }
        });
        $("#AumentoVentas").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Calificacion",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'AumentoVentas'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#EsfuerzoEnTiempo").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Calificacion",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'EsfuerzoEnTiempo'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#BeneficioEstimadoServicio").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Id",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'BeneficioEstimadoServicio'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#EsfuerzoEnCostos").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Calificacion",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'EsfuerzoEnCostos'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#BeneficioEstimadoCosto").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Id",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'BeneficioEstimadoCosto'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#IncrementoServicio").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Calificacion",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'IncrementoServicio'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#CumplimientoNormativo").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Calificacion",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'CumplimientoNormativo'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#ProyectoInnovacion").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Calificacion",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'ProyectoInnovacion'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#ReduccionCostos").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Calificacion",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'ReduccionCostos'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#TipoBeneficio").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Id",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'TipoBeneficio'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#BeneficioVenta").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Id",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'BeneficioVenta'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        $("#Area").kendoDropDownList({
          optionLabel: "Seleccione un valor",
          dataTextField: "Valor",
          dataValueField: "Id",
          autoWidth: true,
          dataSource: new kendo.data.DataSource({
            transport: {
              read: function read(ev) {
                return __awaiter(_this, void 0, void 0, function () {
                  var result;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , utils_1.lists.MetaData.items.top(10000).filter("Title eq 'Area'").get()];

                      case 1:
                        result = _a.sent();
                        ev.success(result);
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }
          })
        });
        contentReduccionCostos = "\n      <div>\n        <p><b>1</b> - de 0,1 a 20 mm</p>\n        <p><b>2</b> - de 21 a 40 mm</p>\n        <p><b>3</b> - de 41 a 60 mm</p>\n        <p><b>4</b> - de 61 a 80 mm</p>\n        <p><b>5</b> - de 81 a 100 mm</p>\n        <p><b>6</b> - de 101 a 120 mm</p>\n        <p><b>7</b> - de 121 a 140 mm</p>\n        <p><b>8</b> - de 141 a 160 mm</p>\n        <p><b>9</b> - de 161 a 180 mm</p>\n        <p><b>10</b> - Mas de 180 Millones de ahorro</p>\n      </div>\n    ";
        contentNielDeServicios = "\n      <div>\n        <p><b>1</b> - 0,10% - 0,19%</p>\n        <p><b>2</b> - 0,20% - 0,29%</p>\n        <p><b>3</b> - 0,30% - 0,39%</p>\n        <p><b>4</b> - 0,40% - 0,49%</p>\n        <p><b>5</b> - 0,50% - 0,59%</p>\n        <p><b>6</b> - 0,60% - 0,69%</p>\n        <p><b>7</b> - 0,70% - 0,79%</p>\n        <p><b>8</b> - 0,80% - 0,89%</p>\n        <p><b>9</b> - 0,90% - 0,99%</p>\n        <p><b>10</b> - Mayor a 1,00%</p>\n      </div>\n    ";
        contentInnovacion = "\n      <div>\n        <p><b>0</b> - No es un proyecto de innovaci\xF3n</p>\n        <p><b>5</b> - Es un proyecto de innovaci\xF3n</p>\n      </div>\n    ";
        $("#gridHistorico th:nth-child(3)").kendoTooltip({
          position: "",
          content: contentReduccionCostos
        }).data("kendoTooltip");
        $("#gridHistorico th:nth-child(4)").kendoTooltip({
          position: "",
          content: contentReduccionCostos
        }).data("kendoTooltip");
        $("#gridHistorico th:nth-child(5)").kendoTooltip({
          position: "",
          content: contentNielDeServicios
        }).data("kendoTooltip");
        $("#gridHistorico th:nth-child(6)").kendoTooltip({
          position: "",
          content: contentInnovacion
        }).data("kendoTooltip");
        contentEsfuerzoTiempo = "\n    <div>\n      <p><b>1</b> - Menos de un mes</p>\n      <p><b>2</b> - 2 a 4 meses</p>\n      <p><b>3</b> - 4 a 5 meses</p>\n      <p><b>4</b> - 6 a 7 meses</p>\n      <p><b>5</b> - 7 a 8 meses</p>\n      <p><b>6</b> - 8 a 9 meses</p>\n      <p><b>7</b> - 10 a 11 meses</p>\n      <p><b>8</b> - 11 a 12 meses</p>\n      <p><b>9</b> - 1 a 2 a\xF1os</p>\n      <p><b>10</b> - Mas de 2 a\xF1os</p>\n    </div>\n  ";
        $("#gridHistoricoBeneficio th:nth-child(3)").kendoTooltip({
          position: "",
          content: contentEsfuerzoTiempo
        }).data("kendoTooltip");
        $("#gridHistoricoBeneficio th:nth-child(4)").kendoTooltip({
          position: "",
          content: contentReduccionCostos
        }).data("kendoTooltip");
        validateFields();
        DataGridIniciativas.DataGridHistorico();
        DataGridIniciativas.DataGridHistoricoEsfuerzo();
        return [2
        /*return*/
        ];
      });
    });
  }

  IniciativasEvents.edit = edit;

  function bloquearCampos() {
    //Principal
    $("#EstadoIdea").attr("disabled", "disabled");
    $("#UEN").attr("disabled", "disabled");
    $("#NombreOportunidad").attr("disabled", "disabled");
    $("#Regional").attr("disabled", "disabled");
    $("#CostoAproximado ").attr("disabled", "disabled");
    $("#Colaborador_TopSpan").attr("disabled", "disabled");
    $("#Colaborador_TopSpan_ResolvedList").attr("disabled", "disabled");
    $("#Telefono").attr("disabled", "disabled");
    $("#Correo").attr("disabled", "disabled");
    $("#QueProponer").attr("disabled", "disabled");
    $("#AnalistaAsignado_TopSpan").attr("disabled", "disabled");
    $("#AnalistaAsignado_TopSpan_ResolvedList").attr("disabled", "disabled");
    $("#Continuidad").attr("disabled", "disabled");
    $(".k-upload").attr("disabled", "disabled");
    $("#btnRemove").css("pointer-events", "none"); //Beneficios

    $("#AumentoVentas").attr("disabled", "disabled");
    $("#IncrementoServicio").attr("disabled", "disabled");
    $("#CumplimientoNormativo").attr("disabled", "disabled");
    $("#EsfuerzoEnTiempo").attr("disabled", "disabled");
    $("#EsfuerzoEnCostos").attr("disabled", "disabled");
    $("#ReduccionCostos").attr("disabled", "disabled");
    $("#TipoBeneficio").attr("disabled", "disabled"); //General

    $("#Coordinacion").attr("disabled", "disabled");
    $("#ComentariosEvaluacion").attr("disabled", "disabled");
    $("#DescripcionOportunidad").attr("disabled", "disabled");
    $("#Area").attr("disabled", "disabled");
    $("#IndicadorAsociado").attr("disabled", "disabled");
    $(".sp-peoplepicker-editorInput").attr("disabled", "disabled");
    $("#Colaborador_TopSpan_ResolvedList a").attr("onclick", "");
    $("#Colaborador_TopSpan_ResolvedList a").css("cursor", "not-allowed");
    $("#AnalistaAsignado_TopSpan_ResolvedList a").attr("onclick", "");
    $("#AnalistaAsignado_TopSpan_ResolvedList a").css("cursor", "not-allowed");
    $(".k-grid-update").attr("disabled", "disabled");
  } //Function of validation fields


  function validateFields() {
    var validator = $("#tabstrip").kendoValidator().data("kendoValidator");
    $(".k-grid-update").click(function () {
      var innovacion1 = $("#innovacion1").prop("checked");
      var innovacion2 = $("#innovacion2").prop("checked"); // if(){
      // }

      var camposVaciosPrincipal = [];
      camposVaciosPrincipal.push("<b>PRINCIPAL</b>");
      var camposVaciosBeneficios = [];
      camposVaciosBeneficios.push("<b>BENEFICIOS</b>");
      var camposVaciosGeneral = [];
      camposVaciosGeneral.push("<b>GENERAL</b>"); //Campos PRINCIPAL

      if (!validator.validateInput($("input[name=EstadoIdea]"))) {
        camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Estado de la Idéa</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=UEN]"))) {
        camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>UEN</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=NombreOportunidad]"))) {
        camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Nombre de la Oportunidad</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=Regional]"))) {
        camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Regional</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=CostoAproximado]"))) {
        camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Costo Apróximado</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=Colaborador_TopSpan_HiddenInput]"))) {
        camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Colaborador</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=Telefono]"))) {
        camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Teléfono</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=Correo]"))) {
        camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Correo</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=SitioAplicacion]"))) {
        camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Sitio de Aplicación</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=QueProponer]"))) {
        camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>¿Qué quieres proponer?</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=AnalistaAsignado_TopSpan_HiddenInput]"))) {
        camposVaciosPrincipal.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Analista Asignado</b> es obligatorio");
      } //Campos BENEFICIO


      if (!validator.validateInput($("input[name=Beneficio]"))) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Beneficio</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=ReduccionCostos]"))) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Beneficio - Reducción Costos</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=BeneficioEstimadoCosto]"))) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Beneficio Estimado Costo</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=AumentoVentas]"))) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Aumento Ventas</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=IncrementoServicio]"))) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Nivel de Servicio</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=CumplimientoNormativo]"))) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Cumplimiento Normativo</b> es obligatorio");
      }

      if (innovacion1 == false && innovacion2 == false) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Proyecto Innovación</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=EsfuerzoEnTiempo]"))) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Esfuerzo Tiempo</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=EsfuerzoEnCostos]"))) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Esfuerzo Costos</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=TipoBeneficio]"))) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Tipo de Beneficio</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=BeneficioEstimadoServicio]"))) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Beneficio Estimado Servicio</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=BeneficioVenta]"))) {
        camposVaciosBeneficios.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Beneficio Venta</b> es obligatorio");
      } //Campos GENERAL


      if (!validator.validateInput($("input[name=Coordinacion]"))) {
        camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Coordinación</b> es obligatorio");
      }

      if (!validator.validateInput($("textarea[name=ComentariosEvaluacion]"))) {
        camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Comentarios de evaluación</b> es obligatorio");
      }

      if (!validator.validateInput($("textarea[name=DescripcionOportunidad]"))) {
        camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Descripción Oportunidad</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=RutaAcceso]"))) {
        camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Ruta de Acceso</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=Area]"))) {
        camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>Área a la que pertenece</b> es obligatorio");
      }

      if (!validator.validateInput($("input[name=IndicadorAsociado]"))) {
        camposVaciosGeneral.push("<span class='k-icon k-i-warning k-i-exception'></span> El campo <b>¿Tiene un Indicador Asociado? ¿Cuál?</b> es obligatorio");
      }

      if (!(camposVaciosPrincipal.length == 1)) {
        var camposObligatoriosPrincipal = camposVaciosPrincipal.join("<br><br>");
      }

      if (!(camposVaciosBeneficios.length == 1)) {
        var camposObligatoriosBeneficio = camposVaciosBeneficios.join("<br><br>");
      }

      if (!(camposVaciosGeneral.length == 1)) {
        var camposObligatoriosGeneral = camposVaciosGeneral.join("<br><br>");
      }

      if (camposVaciosPrincipal.length != 1 || camposVaciosBeneficios.length != 1 || camposVaciosGeneral.length != 1) {
        showNotificationWindow(camposObligatoriosPrincipal, camposObligatoriosBeneficio, camposObligatoriosGeneral);
      }

      if (innovacion1 == false && innovacion2 == false) {
        return false;
      }
    });
  }

  IniciativasEvents.validateFields = validateFields; //Funcion onselect Para Adjuntos 

  function onSelect(ev) {
    var allow = true;
    var arrCh = ['~', '#', '%', '&', '*', '{', '}', '\\', ':', '<', '>', '?', '/', '|', '“']; //extraer el nombre

    arrCh.forEach(function (i) {
      if (ev.files[0].name.includes(i)) {
        ev.preventDefault();
        allow = false;
      }
    }); //no Acepta Duplicados

    IniciativasEvents.attach.forEach(function (element) {
      ev.files.forEach(function (select) {
        if (element["name"] === select["name"]) {
          allow = false;
          ev.preventDefault();
        }
      });
    });

    if (allow) {
      var count_1 = 0;
      IniciativasEvents.objUpload.toggle(true);
      ev.files.forEach(function (element) {
        var reader = new window.FileReader();

        reader.onload = function (e) {
          IniciativasEvents.attach.push({
            'content': e.target.result,
            'name': element["name"]
          });
          count_1++;
          if (ev.files.length == count_1) IniciativasEvents.objUpload.toggle(true);
        };

        reader.readAsArrayBuffer(element.rawFile);
      });
    }
  }

  function listAttachments(e) {
    var currentFile;
    var documentos = utils_1.lists.Iniciativas.items.getById(e.model["Id"]).attachmentFiles.get().then(function (result) {
      currentFile = result[0];
      var listViewDiv = document.createElement("div");
      $("#listViewAttachment").append(listViewDiv);
      $(listViewDiv).kendoListView({
        dataSource: {
          data: result
        },
        remove: function remove(ev) {
          return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  ev.preventDefault();
                  kendo.ui.progress($("#listViewDiv"), true);
                  return [4
                  /*yield*/
                  , utils_1.lists.Iniciativas.items.getById(e.model["Id"]).attachmentFiles.getByName(ev.model["FileName"]).recycle()];

                case 1:
                  _a.sent();

                  $(listViewDiv).data("kendoListView").dataSource.remove(ev.model);
                  kendo.ui.progress($("#listViewDiv"), false);
                  return [2
                  /*return*/
                  ];
              }
            });
          });
        },
        template: function template(documento) {
          return "\n            <li style=\"list-style-type: decimal;margin-left: 5px; margin-top: 8px; width: auto;\">\n              <a style=\"vertical-align: middle;\" target=\"_blank\" href=\"" + documento.ServerRelativeUrl + "\"> " + documento.FileName + "</a>\n              <a id=\"btnRemove\" style=\"display:#:visi#\" class=\"k-button k-delete-button\" ><span class=\"k-icon k-i-close\"></span></a>\n            </li>\n          ";
        }
      });
    });
  }

  function NotificationSuccess(msg) {
    var popupNotification = $("#popupNotification").kendoNotification({
      position: {
        top: 20
      }
    }).data("kendoNotification");
    popupNotification.show(kendo.toString(msg), "success");
  }

  IniciativasEvents.NotificationSuccess = NotificationSuccess;

  function NotificationError(msg) {
    var popupNotification = $("#popupNotification").kendoNotification({
      position: {
        top: 20
      },
      autoHideAfter: 10000
    }).data("kendoNotification");
    popupNotification.show(kendo.toString(msg), "error");
  }

  IniciativasEvents.NotificationError = NotificationError;

  function showNotificationWindow(data1, data2, data3) {
    var div = document.createElement("div.notificaciones");
    var windowConfir = $(div).kendoWindow({
      width: "430px",
      height: "200",
      title: "Notificación",
      visible: false,
      content: {
        template: "\n        <div>\n        <div>\n          " + data1 + "\n        </div>\n\n        <hr />\n\n        <div>\n          " + data2 + "\n        </div>\n\n        <hr />\n\n        <div>\n          " + data3 + "\n        </div>\n\n      </div>\n        "
      },
      actions: ["Close"],
      close: function close() {
        windowConfir.destroy();
      }
    }).data("kendoWindow").center().open();
  }
})(IniciativasEvents = exports.IniciativasEvents || (exports.IniciativasEvents = {}));

var DataGridIniciativas;

(function (DataGridIniciativas) {
  function DataGridHistorico() {
    var _this = this;

    var dataSourceHistorico = new kendo.data.DataSource({
      pageSize: 3,
      transport: {
        read: function read(e) {
          return __awaiter(_this, void 0, void 0, function () {
            var result, index, innovacion;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  return [4
                  /*yield*/
                  , utils_1.lists.Historico.items.orderBy("Created", false).select("*", "Author/Title").expand("Author").filter("IdIniciativa eq " + IniciativasEvents.IdModel).get()];

                case 1:
                  result = _a.sent();

                  for (index = 0; index < result.length; index++) {
                    result[index].Author = result[index].Author.Title;
                  }

                  innovacion = result[0].Innovacion;

                  if (innovacion == 0) {
                    $("#innovacion1").prop("checked", true);
                  } else if (innovacion == 5) {
                    $("#innovacion2").prop("checked", true);
                  }

                  e.success(result);
                  return [2
                  /*return*/
                  ];
              }
            });
          });
        }
      },
      schema: {
        model: {
          id: "Id",
          fields: {
            Title: {
              type: "string"
            },
            Created: {
              type: "Date",
              template: "#= kendo.toString(kendo.parseDate(Created), 'dd-MM-yyyy'); #"
            }
          }
        }
      }
    });
    var grid = $("#gridHistorico").kendoGrid({
      columns: [{
        field: "Created",
        title: "Fecha",
        format: "{0: dd-MM-yyyy}"
      }, {
        field: "Author",
        title: "Autor"
      }, {
        field: "ReduccionCostos",
        title: "Reducción Costos"
      }, {
        field: "AumentoVentas",
        title: "Aumento Ventas"
      }, {
        field: "NivelDeServicio",
        title: "Nivel de Servicio"
      }, // { field: "Innovacion", title: "Innovación" },
      {
        field: "BeneficioCalculado",
        title: "Beneficio Calculado",
        attributes: {
          "class": "hola",
          style: "background: rgb(252, 220, 25); color: rgb(222, 0, 0)"
        }
      }],
      autoBind: true,
      dataSource: dataSourceHistorico,
      pageable: {
        buttonCount: 3
      },
      editable: {
        mode: "popup",
        //template: PuntajeTemplate.getTemplate(),
        window: {
          title: "Puntaje"
        }
      },
      sortable: true,
      selectable: true
    }).data("kendoGrid");
  }

  DataGridIniciativas.DataGridHistorico = DataGridHistorico;

  function DataGridHistoricoEsfuerzo() {
    var _this = this;

    var dataSourceHistoricoEsfuerzo = new kendo.data.DataSource({
      pageSize: 3,
      transport: {
        read: function read(e) {
          return __awaiter(_this, void 0, void 0, function () {
            var result, index;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  return [4
                  /*yield*/
                  , utils_1.lists.HistoricoEsfuerzo.items.orderBy("Created", false).select("*", "Author/Title").expand("Author").filter("IdIniciativa eq " + IniciativasEvents.IdModel).get()];

                case 1:
                  result = _a.sent();

                  for (index = 0; index < result.length; index++) {
                    result[index].Author = result[index].Author.Title;
                  }

                  e.success(result);
                  return [2
                  /*return*/
                  ];
              }
            });
          });
        }
      },
      schema: {
        model: {
          id: "Id",
          fields: {
            Title: {
              type: "string"
            },
            Created: {
              type: "Date",
              template: "#= kendo.toString(kendo.parseDate(Created), 'dd-MM-yyyy'); #"
            }
          }
        }
      }
    });
    var grid2 = $("#gridHistoricoBeneficio").kendoGrid({
      columns: [{
        field: "Created",
        title: "Fecha",
        format: "{0: dd-MM-yyyy}"
      }, {
        field: "Author",
        title: "Autor"
      }, {
        field: "EsfuerzoTiempo",
        title: "Esfuerzo Tiempo"
      }, {
        field: "EsfuerzoCostos",
        title: "Esfuerzo Costos"
      }, {
        field: "EsfuerzoCalculado",
        title: "Esfuerzo Calculado",
        attributes: {
          style: "background: rgb(252, 220, 25); color: rgb(222, 0, 0)"
        }
      }, {
        field: "EB",
        title: "E * B",
        attributes: {
          style: "background: rgb(252, 220, 25); color: rgb(222, 0, 0)"
        }
      }],
      autoBind: true,
      dataSource: dataSourceHistoricoEsfuerzo,
      pageable: {
        buttonCount: 3
      },
      editable: {
        mode: "popup",
        //template: PuntajeTemplate.getTemplate(),
        window: {
          title: "Puntaje"
        }
      },
      sortable: true,
      selectable: true
    }).data("kendoGrid");
  }

  DataGridIniciativas.DataGridHistoricoEsfuerzo = DataGridHistoricoEsfuerzo;
})(DataGridIniciativas = exports.DataGridIniciativas || (exports.DataGridIniciativas = {}));

var PromoteProjectOnline;

(function (PromoteProjectOnline) {
  function promoteClick(e) {
    var _this = this;

    var dataItem = e.model;
    console.log(dataItem);
    window.promoteBl = PromoteBL_1.PromoteBl;
    var div = document.createElement("div"); //window.waitDialog;

    var windowConfir = $(div).kendoWindow({
      visible: false,
      width: "430px",
      title: "Notificación",
      modal: true,
      draggable: false,
      content: {
        template: registro_1.getTemplateDialog(dataItem)
      },
      close: function close() {
        windowConfir.destroy();
      }
    }).data("kendoWindow").center().open();
    var validationForm = $("#formConf").kendoValidator().data("kendoValidator");
    $("#yesButton").click(function (btnE) {
      return __awaiter(_this, void 0, void 0, function () {
        var timer_1, idPro_1, divd, windowDialog_1, _checker_, result, context, FormDigestValue_1, objRegistro, responseProject, project;

        var _this = this;

        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              btnE.preventDefault();
              if (!validationForm.validate()) return [3
              /*break*/
              , 5];
              divd = document.createElement("div");
              windowDialog_1 = $(divd).kendoDialog({
                modal: true,
                closable: false,
                content: "\n                <p class=\"se-msn-loading\">Creando proyecto...</p>\n                "
              }).data("kendoDialog").open();

              _checker_ = function checker_1() {
                return __awaiter(_this, void 0, void 0, function () {
                  var responseCheckOut, checkOut;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        clearInterval(timer_1);
                        return [4
                        /*yield*/
                        , PromoteBL_1.PromoteBl.checkOutProject(idPro_1, FormDigestValue_1)];

                      case 1:
                        responseCheckOut = _a.sent();
                        return [4
                        /*yield*/
                        , responseCheckOut.json()];

                      case 2:
                        checkOut = _a.sent();

                        if (responseCheckOut.ok) {
                          updateCustomFields(dataItem, idPro_1, FormDigestValue_1, windowDialog_1);
                        } else {
                          timer_1 = setInterval(_checker_, 5000); //  console.log(checkOut);
                        }

                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              };

              return [4
              /*yield*/
              , PromoteBL_1.PromoteBl.getContextInfoPWA()];

            case 1:
              result = _a.sent();
              return [4
              /*yield*/
              , result.json()];

            case 2:
              context = _a.sent();
              FormDigestValue_1 = context.d.GetContextWebInformation.FormDigestValue;
              objRegistro = {
                parameters: {
                  Name: dataItem.NombreOportunidad
                }
              };
              windowConfir.destroy();
              return [4
              /*yield*/
              , PromoteBL_1.PromoteBl.createProject(objRegistro, FormDigestValue_1)];

            case 3:
              responseProject = _a.sent();
              return [4
              /*yield*/
              , responseProject.json()];

            case 4:
              project = _a.sent();

              if (!responseProject.ok) {
                if (project.error.message.value.includes("ProjectNameAlreadyExists")) {
                  IniciativasEvents.NotificationError("El proyecto ya existe en PWA.");
                  windowDialog_1.close();
                } else if (project.error.message.value.includes("ProjectNameInvalid")) {
                  IniciativasEvents.NotificationError("Nombre de proyecto no valido.");
                } else {
                  IniciativasEvents.NotificationError("Error al crear el proyecto.");
                  alert(project.error.message.value);
                }

                return [2
                /*return*/
                ];
              } //window.waitDialog.close(SP.UI.DialogResult.OK);


              IniciativasEvents.NotificationSuccess("Proyecto creado con éxito.");
              windowDialog_1.close();
              windowDialog_1.content('<p class="se-msn-loading">Actualizando campos personalizados...</p>');
              windowDialog_1.open(); //IniciativaBL.setIniciativa(dataItem.Id);

              idPro_1 = project["d"].Id; //updateCustomFields(dataItem, idPro, FormDigestValue);

              timer_1 = setInterval(_checker_, 5000);
              _a.label = 5;

            case 5:
              return [2
              /*return*/
              ];
          }
        });
      });
    });
    $("#noButton").click(function (btnE) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          btnE.preventDefault();
          windowConfir.destroy();
          return [2
          /*return*/
          ];
        });
      });
    });
    var ddltp = $("#tipoProyecto").kendoDropDownList({
      dataSource: {
        transport: {
          read: function read(e) {
            return __awaiter(_this, void 0, void 0, function () {
              var _a, _b;

              return __generator(this, function (_c) {
                switch (_c.label) {
                  case 0:
                    _b = (_a = e).success;
                    return [4
                    /*yield*/
                    , PromoteBL_1.PromoteBl.getEnterpriseProjectTypes()];

                  case 1:
                    _b.apply(_a, [_c.sent()]);

                    return [2
                    /*return*/
                    ];
                }
              });
            });
          }
        }
      },
      dataTextField: "Name",
      dataValueField: "Id",
      optionLabel: "Seleccione tipo de proyecto...",
      autoWidth: true
    }).data("kendoDropDownList");
  }

  PromoteProjectOnline.promoteClick = promoteClick;

  function updateCustomFields(data, idPro, FormDigestValue, control) {
    return __awaiter(this, void 0, void 0, function () {
      var objCustomFields, responseCustomFields, customFields, responseCheckIn, checkIn;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            objCustomFields = {
              customFieldDictionary: []
            };
            return [4
            /*yield*/
            , PromoteBL_1.PromoteBl.updateCustomFields(idPro, FormDigestValue, objCustomFields)];

          case 1:
            responseCustomFields = _a.sent();
            return [4
            /*yield*/
            , responseCustomFields.json()];

          case 2:
            customFields = _a.sent();
            if (!responseCustomFields.ok) return [3
            /*break*/
            , 5];
            return [4
            /*yield*/
            , PromoteBL_1.PromoteBl.checkInProject(idPro, FormDigestValue)];

          case 3:
            responseCheckIn = _a.sent();
            return [4
            /*yield*/
            , responseCheckIn.json()];

          case 4:
            checkIn = _a.sent();

            if (responseCheckIn.ok) {
              control.close();
              control.destroy();
              IniciativasEvents.NotificationSuccess("Campos personalizados actualizados con éxito."); //Setear el valor Promovido en el dropdown

              $("#promovido").attr("checked", "checked");
              $(".k-grid-update").trigger("click");
              $("#grid").data("kendoGrid").dataSource.read();
            }

            return [3
            /*break*/
            , 6];

          case 5:
            IniciativasEvents.NotificationError("Error actualizando los campos personalizados.");
            IniciativasEvents.NotificationError(customFields.error.message.value);
            console.log(customFields.error.message.value);
            _a.label = 6;

          case 6:
            return [2
            /*return*/
            ];
        }
      });
    });
  }
})(PromoteProjectOnline = exports.PromoteProjectOnline || (exports.PromoteProjectOnline = {}));
},{"../Controller/IniciativasController":"Controller/IniciativasController.ts","../Utilities/utils":"Utilities/utils.ts","../Utilities/PeoplePicker":"Utilities/PeoplePicker.ts","../Template/registro":"Template/registro.ts","../Controller/PuntajeController":"Controller/PuntajeController.ts","../Controller/ComiteValoracionController":"Controller/ComiteValoracionController.ts","./PromoteBL":"BusinessLogic/PromoteBL.ts"}],"Template/ComiteValoracionTemplate.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplate = void 0;

var utils_1 = require("../Utilities/utils");

var renderFieldDetail = utils_1.ui.renderFieldDetail;
var Encargado = renderFieldDetail({
  id: "Encargado",
  className: "input",
  title: "Encargado",
  type: "input",
  name: "Encargado",
  others: "",
  value: "Encargado"
});
var Estado = renderFieldDetail({
  id: "Estado",
  className: "input",
  title: "Estado",
  type: "input",
  name: "Estado",
  others: "",
  value: "Estado"
});
var Comentario = renderFieldDetail({
  id: "Comentario",
  className: "input textarea",
  title: "Comentario",
  type: "textarea",
  name: "Comentario",
  others: "",
  value: "Comentario"
});
/**
 * Funcion que pemite devolver un String
 */

function getTemplate() {
  return "\n    <div class=\"tabstrip-valoracion\" id=\"tabstrip\">\n        <ul>\n            <li class=\"k-state-active\"></li>\n        </ul>\n\n\n        <div class=\"edit-container\"><br>\n            <div class=\"columns\">\n                <div class=\"column is-6\">\n                    <div class=\"column is-10\">\n                        " + Encargado + "\n                        <span class=\"k-invalid-msg\" data-for=\"Patrocinador\"></span>\n                    </div>\n\n                    <div class=\"column is-10\">\n                        <fieldset class = \"box\"id = \"boxApprover\">\n                            <div id=\"radio-md\">\n                                <legend class=\"label\">Estado Valoraci\xF3n</legend>\n                                <div class=\"content-radio\">\n                                    <input type=\"radio\" class=\"k-radio\" id=\"aprobado\" name=\"gender1\" value=\"aprobado\">\n                                    <label for=\"aprobado\">Aprobado</label><br>\n                                </div>\n                                \n                                <div class=\"content-radio\">\n                                    <input type=\"radio\" class=\"k-radio\" id=\"rechazado\" name=\"gender1\" value=\"rechazado\">\n                                    <label for=\"rechazado\">Rechazado</label><br>\n                                </div>\n                            </div>\n                        </fieldset>\n                    </div>\n                </div>\n\n                <div class=\"column is-6\">\n\n                    <div class=\"column is-10\">\n                        " + Comentario + "\n                        <span class=\"k-invalid-msg\" data-for=\"Patrocinador\"></span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n  \n\n    <div id =\"load\"></div> \n    ";
}

exports.getTemplate = getTemplate;
},{"../Utilities/utils":"Utilities/utils.ts"}],"BusinessLogic/ComiteValoracionBL.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComiteEvents = exports.DataComite = void 0;

var ComiteValoracionController_1 = require("../Controller/ComiteValoracionController");

var utils_1 = require("../Utilities/utils");

var DataComite;

(function (DataComite) {
  function updateData(data) {
    return __awaiter(this, void 0, void 0, function () {
      var cv, cgd, cp, eprod, eproy;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            delete data.gender1;
            delete data.Title;

            if ($("#aprobado").prop("checked")) {
              data.Estado = "aprobado";
            }

            if ($("#rechazado").prop("checked")) {
              data.Estado = "rechazado";
            }

            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.update(data)];

          case 1:
            _a.sent();

            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.validarDiligenciamientoComiteValoracion(data.IdIniciativa)];

          case 2:
            cv = _a.sent();
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.validarDiligenciamientoComiteGestionDemanda(data.IdIniciativa)];

          case 3:
            cgd = _a.sent();
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.validarDiligenciamientoComitePatrocinadores(data.IdIniciativa)];

          case 4:
            cp = _a.sent();
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.validarDiligenciamientoEquipoProductividad(data.IdIniciativa)];

          case 5:
            eprod = _a.sent();
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.validarDiligenciamientoEquipoProyectos(data.IdIniciativa)];

          case 6:
            eproy = _a.sent();

            if (data.Fase == "CV") {
              if (!(cv.length >= 1)) {
                movimientoFase1(data);
              }
            }

            if (data.Fase == "CGD") {
              if (!(cgd.length >= 1)) {
                movimientoFase3(data);
              }
            }

            if (data.Fase == "CP") {
              if (!(cp.length >= 1)) {
                movimientoFase4(data);
              }
            }

            if (data.Fase == "EProd") {
              if (!(eprod.length >= 1)) {
                movimientoFase2A(data);
              }
            }

            if (data.Fase == "EProy") {
              if (!(eproy.length >= 1)) {
                movimientoFase2B(data);
              }
            }

            return [2
            /*return*/
            ];
        }
      });
    });
  }

  DataComite.updateData = updateData;

  function movimientoFase1(data) {
    return __awaiter(this, void 0, void 0, function () {
      var encargados, aprobados, porcentaje, continuidad, datos, encargadosEProd, datos, encargadosEProy, result, devolucion2, devolucion;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.obtenerEncargados("Fase eq 'CV'")];

          case 1:
            encargados = _a.sent();
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.aprobacionesComiteValoracion(data.IdIniciativa)];

          case 2:
            aprobados = _a.sent();
            porcentaje = encargados[0].Peso * aprobados.length;
            if (!(porcentaje >= encargados[0].Tope)) return [3
            /*break*/
            , 10];
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.filter("Id eq " + data.IdIniciativa).get()];

          case 3:
            continuidad = _a.sent();
            if (!(continuidad[0].Continuidad == true)) return [3
            /*break*/
            , 6];
            datos = {
              NotificacionContinuidad: true,
              Fase: "Evaluación Equipo de Productividad",
              Notificacion: true,
              Requester: false
            };
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.IdIniciativa).update(datos)];

          case 4:
            _a.sent();

            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.obtenerEncargados("Fase eq 'EProd'")];

          case 5:
            encargadosEProd = _a.sent();
            ComiteValoracionController_1.ComiteValoracionController.insertarEquipoProductividad(encargadosEProd, data.IdIniciativa);
            ComiteValoracionController_1.ComiteValoracionController.insertarEProd(encargadosEProd, data.IdIniciativa);
            return [3
            /*break*/
            , 9];

          case 6:
            datos = {
              NotificacionContinuidad: true,
              Fase: "Evaluación Equipo de Proyectos",
              Notificacion: true,
              Requester: false
            };
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.IdIniciativa).update(datos)];

          case 7:
            _a.sent();

            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.obtenerEncargados("Fase eq 'EProy'")];

          case 8:
            encargadosEProy = _a.sent();
            ComiteValoracionController_1.ComiteValoracionController.insertarEquipoProyectos(encargadosEProy, data.IdIniciativa);
            ComiteValoracionController_1.ComiteValoracionController.insertarEProy(encargadosEProy, data.IdIniciativa);
            _a.label = 9;

          case 9:
            $("#grid").data("kendoGrid").dataSource.read();
            return [3
            /*break*/
            , 15];

          case 10:
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.filter("Id eq " + data.IdIniciativa).get()];

          case 11:
            result = _a.sent();
            if (!(result[0].contador_aplazadas == true)) return [3
            /*break*/
            , 13];
            ComiteValoracionController_1.ComiteValoracionController.vaciarEncargados(data.IdIniciativa);
            devolucion2 = {
              Fase: "Cerrada",
              Requester: false,
              Estado: "descalificada"
            };
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.IdIniciativa).update(devolucion2)];

          case 12:
            _a.sent();

            $("#grid").data("kendoGrid").dataSource.read();
            return [3
            /*break*/
            , 15];

          case 13:
            devolucion = {
              Fase: "Aplazada",
              Requester: true,
              Notificacion: true,
              contador_aplazadas: true,
              Estado: "aplazada"
            };
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.IdIniciativa).update(devolucion)];

          case 14:
            _a.sent();

            $("#grid").data("kendoGrid").dataSource.read();
            _a.label = 15;

          case 15:
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  DataComite.movimientoFase1 = movimientoFase1;

  function movimientoFase2A(data) {
    return __awaiter(this, void 0, void 0, function () {
      var datos, encargados2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            DataComite.comite2 = true;
            datos = {
              NotificacionContinuidad: true,
              Notificacion: true,
              Requester: false,
              Fase: "Comité Gestión de la Demanda"
            };
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.IdIniciativa).update(datos)];

          case 1:
            _a.sent();

            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.obtenerEncargados("Fase eq 'CGD'")];

          case 2:
            encargados2 = _a.sent();
            ComiteValoracionController_1.ComiteValoracionController.insertarEncargadosComiteGestionDemanda(encargados2, data.IdIniciativa);
            ComiteValoracionController_1.ComiteValoracionController.insertarEncargadosCGD(encargados2, data.IdIniciativa);
            $("#grid").data("kendoGrid").dataSource.read();
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  DataComite.movimientoFase2A = movimientoFase2A;

  function movimientoFase2B(data) {
    return __awaiter(this, void 0, void 0, function () {
      var datos, encargados2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            DataComite.comite2 = true;
            datos = {
              NotificacionContinuidad: true,
              Notificacion: true,
              Requester: false,
              Fase: "Comité Gestión de la Demanda"
            };
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.IdIniciativa).update(datos)];

          case 1:
            _a.sent();

            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.obtenerEncargados("Fase eq 'CGD'")];

          case 2:
            encargados2 = _a.sent();
            ComiteValoracionController_1.ComiteValoracionController.insertarEncargadosComiteGestionDemanda(encargados2, data.IdIniciativa);
            ComiteValoracionController_1.ComiteValoracionController.insertarEncargadosCGD(encargados2, data.IdIniciativa);
            $("#grid").data("kendoGrid").dataSource.read();
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  DataComite.movimientoFase2B = movimientoFase2B;

  function movimientoFase3(data) {
    return __awaiter(this, void 0, void 0, function () {
      var encargados, aprobados, porcentaje, continuidad, encargadosCP, datos, result, devolucion2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.obtenerEncargados("Fase eq 'CGD'")];

          case 1:
            encargados = _a.sent();
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.aprobacionesComiteGestionDemanda(data.IdIniciativa)];

          case 2:
            aprobados = _a.sent();
            porcentaje = encargados[0].Peso * aprobados.length;
            if (!(porcentaje >= encargados[0].Tope)) return [3
            /*break*/
            , 6];
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.filter("Id eq " + data.IdIniciativa).get()];

          case 3:
            continuidad = _a.sent();
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.obtenerEncargados("Fase eq 'CP'")];

          case 4:
            encargadosCP = _a.sent();
            ComiteValoracionController_1.ComiteValoracionController.insertarEncargadosComitePatrocinadores(encargadosCP, data.IdIniciativa);
            ComiteValoracionController_1.ComiteValoracionController.insertarEncargadosCP(encargadosCP, data.IdIniciativa);
            datos = {
              NotificacionContinuidad: true,
              Fase: "Comité Patrocinador",
              Notificacion: true,
              Requester: false
            };
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.IdIniciativa).update(datos)];

          case 5:
            _a.sent();

            $("#grid").data("kendoGrid").dataSource.read();
            return [3
            /*break*/
            , 9];

          case 6:
            ComiteValoracionController_1.ComiteValoracionController.vaciarEncargados(data.IdIniciativa);
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.filter("Id eq " + data.IdIniciativa).get()];

          case 7:
            result = _a.sent();
            devolucion2 = {
              Fase: "Cerrada",
              Requester: false,
              Estado: "rechazada"
            };
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.IdIniciativa).update(devolucion2)];

          case 8:
            _a.sent();

            $("#grid").data("kendoGrid").dataSource.read();
            _a.label = 9;

          case 9:
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  DataComite.movimientoFase3 = movimientoFase3;

  function movimientoFase4(data) {
    return __awaiter(this, void 0, void 0, function () {
      var encargados2, aprobados2, porcentaje, datos, datos;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.obtenerEncargados("Fase eq 'CP'")];

          case 1:
            encargados2 = _a.sent();
            return [4
            /*yield*/
            , ComiteValoracionController_1.ComiteValoracionController.aprobacionesComitePatrocinadores(data.IdIniciativa)];

          case 2:
            aprobados2 = _a.sent();
            porcentaje = encargados2[0].Peso * aprobados2.length;
            if (!(porcentaje >= encargados2[0].Tope)) return [3
            /*break*/
            , 4];
            ComiteValoracionController_1.ComiteValoracionController.vaciarEncargados(data.IdIniciativa);
            datos = {
              Estado: "aprobada",
              Fase: "Cerrada"
            };
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.IdIniciativa).update(datos)];

          case 3:
            _a.sent();

            $("#grid").data("kendoGrid").dataSource.read();
            return [3
            /*break*/
            , 6];

          case 4:
            ComiteValoracionController_1.ComiteValoracionController.vaciarEncargados(data.IdIniciativa);
            datos = {
              Estado: "descartada",
              Fase: "Cerrada"
            };
            return [4
            /*yield*/
            , utils_1.lists.Iniciativas.items.getById(data.IdIniciativa).update(datos)];

          case 5:
            _a.sent();

            $("#grid").data("kendoGrid").dataSource.read();
            _a.label = 6;

          case 6:
            return [2
            /*return*/
            ];
        }
      });
    });
  }

  DataComite.movimientoFase4 = movimientoFase4;
})(DataComite = exports.DataComite || (exports.DataComite = {}));

var ComiteEvents;

(function (ComiteEvents) {
  function edit(ev) {
    var tabstrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
    $(".k-grid-update").html("<span class='k-icon k-i-check'></span>GUARDAR");
    $(".k-grid-cancel").html("<span class='k-icon k-i-cancel'></span>CANCELAR");
    $("#Encargado").attr("disabled", "disabled");
    $(".tabstrip-valoracion").closest(".k-window").css("transform", "translateY(-50px)");

    if (!ev.model.isNew()) {
      if (ev.model["Fase"] == "EProd" || ev.model["Fase"] == "EProy") {
        $("#boxApprover").css("display", "none");
      }

      if (ev.model["Estado"] == "aprobado") {
        $("#aprobado").prop("checked", true);
      }

      if (ev.model["Estado"] == "rechazado") {
        $("#rechazado").prop("checked", true);
      }

      $(".k-grid-cancel, .k-i-close").click(function () {
        $("#grid").data("kendoGrid").dataSource.read();
      });

      if (ev.model["Fase"] == "EProd") {
        ev.model["EProductividadCompletado"] = true;
        ev.model["Estado"] = "diligenciado";
      }

      if (ev.model["Fase"] == "EProy") {
        ev.model["EProyectosCompletado"] = true;
        ev.model["Estado"] = "diligenciado";
      }
    }
  }

  ComiteEvents.edit = edit;
})(ComiteEvents = exports.ComiteEvents || (exports.ComiteEvents = {}));
},{"../Controller/ComiteValoracionController":"Controller/ComiteValoracionController.ts","../Utilities/utils":"Utilities/utils.ts"}],"Iniciativas.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filtro = void 0;

require("./Style/Styles.css");

var IniciativaTemplate = __importStar(require("./Template/IniciativasTemplate"));

var IniciativasBL_1 = require("./BusinessLogic/IniciativasBL");

var utils_1 = require("./Utilities/utils");

var ComiteTemplate = __importStar(require("./Template/ComiteValoracionTemplate"));

var ComiteValoracionBL_1 = require("./BusinessLogic/ComiteValoracionBL");

var Url = window.location.href.split("=");

if (Url.length > 1) {
  var id = parseInt(Url[1]);
  exports.filtro = "Id eq " + "'" + id + "'";
} else {
  exports.filtro = "";
}

var dataSource = new kendo.data.DataSource({
  pageSize: 8,
  transport: {
    read: function read(ev) {
      return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4
              /*yield*/
              , IniciativasBL_1.DataIniciativas.ReadData(exports.filtro)];

            case 1:
              result = _a.sent();
              ev.success(result);
              return [2
              /*return*/
              ];
          }
        });
      });
    },
    create: function create(ev) {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4
              /*yield*/
              , IniciativasBL_1.DataIniciativas.CreateData(ev.data)];

            case 1:
              _a.sent();

              dataSource.read();
              return [2
              /*return*/
              ];
          }
        });
      });
    },
    update: function update(ev) {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4
              /*yield*/
              , IniciativasBL_1.DataIniciativas.UpDate(ev.data)];

            case 1:
              _a.sent();

              dataSource.read();
              return [2
              /*return*/
              ];
          }
        });
      });
    },
    destroy: function destroy(ev) {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4
              /*yield*/
              , IniciativasBL_1.DataIniciativas.destroyData(ev.data)];

            case 1:
              _a.sent();

              dataSource.read();
              return [2
              /*return*/
              ];
          }
        });
      });
    }
  },
  schema: {
    model: {
      id: "Id",
      fields: {
        Title: {
          type: "string"
        },
        EstadoIdeaId: {
          type: "number"
        },
        UENId: {
          type: "number"
        },
        RegionalId: {
          type: "number"
        },
        QueProponerId: {
          type: "number"
        },
        ReduccionCostosId: {
          type: "number"
        },
        AumentoVentasId: {
          type: "number"
        },
        IncrementoServicioId: {
          type: "number"
        },
        CumplimientoNormativoId: {
          type: "number"
        },
        ProyectoInnovacionId: {
          type: "number"
        },
        BeneficioEstimadoServicioId: {
          type: "number"
        },
        BeneficioEstimadoCostoId: {
          type: "number"
        },
        BeneficioVentaId: {
          type: "number"
        },
        EsfuerzoEnTiempoId: {
          type: "number"
        },
        EsfuerzoEnCostosId: {
          type: "number"
        },
        CoordinacionId: {
          type: "number"
        },
        CalificacionId: {
          type: "number"
        },
        AreaId: {
          type: "number"
        },
        Created: {
          type: "Date",
          template: '#= kendo.toString(kendo.parseDate(Created), "dd-MM-yyyy" ) #'
        }
      }
    }
  }
});
var comando = [];
utils_1.lists.GrupoIniciativas.items.filter(String.format("ResponsablesId eq '{0}' and Title eq 'Responsables Iniciativas'", _spPageContextInfo.userId)).get().then(function (result) {
  if (result.length > 0) {
    comando.push({
      name: "edit",
      text: "EDITAR",
      iconClass: "k-icon k-i-edit no-margin"
    }, {
      name: "delete",
      text: "ELIMINAR"
    });
  } else {
    comando.push({
      name: "edit",
      text: "EDITAR",
      iconClass: "k-icon k-i-edit no-margin",
      visible: function visible(dataItem) {
        if (dataItem.Fase == "Requester" && dataItem.AuthorId == _spPageContextInfo.userId) {
          return true;
        }

        if (dataItem.Fase == "Aplazada" && dataItem.AuthorId == _spPageContextInfo.userId) {
          return true;
        }

        if (dataItem.ResponsablesComiteId != null) {
          var count = 0;

          for (var i = 0; i < dataItem.ResponsablesComiteId.length; i++) {
            if (dataItem.ResponsablesComiteId[i] == _spPageContextInfo.userId) {
              count += 1;
            }
          }

          if (count > 0) {
            return true;
          } else {
            return false;
          }
        }
      }
    });
  }

  var grid = $("#grid").kendoGrid({
    columns: [{
      field: "Id",
      title: "ID",
      filterable: {
        multi: true,
        search: true
      },
      width: 150
    }, {
      field: "NombreOportunidad",
      title: "Nombre de la oportunidad",
      filterable: {
        multi: true,
        search: true
      },
      width: 600
    }, {
      field: "Estado",
      title: "Estado",
      template: templateEstado,
      filterable: {
        multi: true,
        search: true
      },
      width: 200
    }, {
      field: "Fase",
      title: "Fase",
      filterable: {
        multi: true,
        search: true
      },
      width: 400
    }, {
      command: comando
    }],
    editable: {
      mode: "popup",
      template: IniciativaTemplate.GetTemplate(),
      window: {
        title: "Iniciativas"
      }
    },
    edit: IniciativasBL_1.IniciativasEvents.edit,
    autoBind: true,
    toolbar: [{
      name: "create",
      text: "Nueva Iniciativa"
    }],
    dataSource: dataSource,
    filterable: true,
    pageable: {
      alwaysVisible: false,
      pageSizes: [6, 12, 24, 50, 100],
      buttonCount: 3
    },
    sortable: true,
    selectable: true,
    groupable: {
      messages: {
        empty: "Arrastre el encabezado de una columna y suéltelo aquí para agrupar por esa columna"
      }
    },
    detailInit: detailInit
  }).data("kendoGrid");
});

function templateEstado(item) {
  var clase;

  switch (item.Estado) {
    case "espera":
      clase = "k-i-clock";
      break;

    case "aprobada":
      clase = "k-i-check-circle";
      break;

    case "aplazada":
      clase = "k-i-clock";
      break;

    case "rechazada":
      clase = "k-i-close-circle";
      break;

    case "descartada":
      clase = "k-i-close-circle";
      break;

    case "descalificada":
      clase = "k-i-close-circle";
      break;
  }

  return String.format("<span style='font-size: 20px;' class='k-icon {0}'></span>", clase);
}

function templateEstadoComite(item) {
  var clase;

  switch (item.Estado) {
    case "espera":
      clase = "k-i-clock";
      break;

    case "aprobado":
      clase = "k-i-check-circle";
      break;

    case "rechazado":
      clase = "k-i-close-circle";
      break;

    case "equipo":
      clase = "k-i-plus-circle";
      break;

    case "diligenciado":
      clase = "k-i-plus-circle";
      break;
  }

  return String.format("<span style='font-size: 20px;' class='k-icon {0}'></span>", clase);
}

function templateFase(item) {
  var label;

  switch (item.Fase) {
    case "CV":
      label = "Comité de Valoración";
      break;

    case "CGD":
      label = "Comité Gestion Demanda";
      break;

    case "EProd":
      label = "Equipo de Productividad";
      break;

    case "EProy":
      label = "Equipo de Proyectos";
      break;

    case "Aplazada":
      label = "Comité de Valoración (Aplazada)";
      break;

    case "CP":
      label = "Comité Patrocinador";
      break;
  }

  return String.format("<span style='font-size: 16px;'>{0}</span>", label);
}

function detailInit(e) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;

    return __generator(this, function (_a) {
      $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
          transport: {
            read: function read(ev) {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4
                      /*yield*/
                      , utils_1.lists.ComiteValoracion.items.select("*", "Encargado/Title").expand("Encargado").filter("IdIniciativa eq " + e.data.Id).get().then(function (result) {
                        for (var i = 0; i < result.length; i++) {
                          if (result[i].Encargado) {
                            result[i].Encargado = result[i].Encargado[0].Title;
                          }
                        }

                        ev.success(result);
                      })];

                    case 1:
                      _a.sent();

                      return [2
                      /*return*/
                      ];
                  }
                });
              });
            },
            update: function update(ev) {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      delete ev.data.EncargadoId;
                      delete ev.data.Encargado;
                      delete ev.data.EncargadoEmail;
                      delete ev.data.EncargadoStringId;
                      return [4
                      /*yield*/
                      , ComiteValoracionBL_1.DataComite.updateData(ev.data)];

                    case 1:
                      _a.sent();

                      dataSource.read();
                      ev.success();
                      return [2
                      /*return*/
                      ];
                  }
                });
              });
            }
          },
          serverSorting: true,
          pageSize: 10,
          filter: {
            field: "IdIniciativa",
            operator: "eq",
            value: e.data.Id
          },
          schema: {
            model: {
              id: "IdIniciativa"
            }
          }
        },
        scrollable: false,
        sortable: true,
        pageable: true,
        columns: [{
          field: "Encargado",
          title: "Encargado",
          width: 350
        }, {
          field: "Estado",
          title: "Estado",
          template: templateEstadoComite,
          width: 200
        }, {
          field: "Fase",
          title: "Fase",
          template: templateFase,
          width: 250
        }, {
          field: "Comentario",
          title: "Comentario",
          width: 500
        }, {
          command: [{
            name: "edit",
            text: "EDITAR",
            iconClass: "k-icon k-i-edit",
            visible: function visible(dataItem) {
              if (dataItem.EncargadoId[0] == _spPageContextInfo.userId && dataItem.Estado == "espera") {
                return true;
              }

              if (dataItem.EncargadoId[0] == _spPageContextInfo.userId && dataItem.Estado == "equipo") {
                return true;
              }
            }
          }]
        }],
        editable: {
          mode: "popup",
          template: ComiteTemplate.getTemplate(),
          window: {
            title: "Valoración de la Iniciativa"
          }
        },
        edit: ComiteValoracionBL_1.ComiteEvents.edit
      });
      return [2
      /*return*/
      ];
    });
  });
}
},{"./Style/Styles.css":"Style/Styles.css","./Template/IniciativasTemplate":"Template/IniciativasTemplate.ts","./BusinessLogic/IniciativasBL":"BusinessLogic/IniciativasBL.ts","./Utilities/utils":"Utilities/utils.ts","./Template/ComiteValoracionTemplate":"Template/ComiteValoracionTemplate.ts","./BusinessLogic/ComiteValoracionBL":"BusinessLogic/ComiteValoracionBL.ts"}]},{},["Iniciativas.ts"], null)
//# sourceMappingURL=/Iniciativas.js.map