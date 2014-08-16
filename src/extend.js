var _ = require('underscore');

function isPlainObject(obj){
  var ctor, key;
  if (typeof obj != 'object' || !obj || toString.call(obj) != '[object Object]') {
    return false;
  }
  ctor = typeof obj.constructor == 'function' && obj.constructor.prototype;
  if (!ctor || !hasOwnProperty.call(ctor, 'isPrototypeOf')) {
    return false;
  }
  for (key in obj) {}
  return key === void 0 || hasOwnProperty.call(obj, key);
}

module.exports = function extend() {
    var src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !_.isFunction(target) ) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if ( length === i ) {
        target = this;
        --i;
    }

    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) !== null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = _.isArray(copy)) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && _.isArray(src) ? src : [];

                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = extend( deep, clone, copy );

                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};