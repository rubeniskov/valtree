/**
* Returns a function that will itself return the value property of object passed by param.
*
* @method valtree( obj )
* @param obj {Object}
* @return {Function}
* @example
*
*   const valtree = require('valtree');

*   const json    = {
*     'foo': [
*         'apple',
*         'pear'
*     ],
*     'bar': {
*         'apple': 0,
*         'pear': 1
*      }
*   };
*
*   var obj = valtree(json);
*
*   obj("foo.0") // 'apple'
*   obj("foo.1") // 'pear'
*   obj("bar.apple") // '0'
*   obj("bar.pear") // '1'
*
*   obj("bar.apple", 1) // '0'
*   obj("bar.pear", 0) // '1'
*
*   obj("bar.apple", obj("bar.pear", obj("bar.apple"))
*
*/

var und,
    ext = {};

module.exports = function valtree(obj, key, val) {
    if (key != null)
        return valtree(obj)(key, val);
    return function(key, val) {
        if (!obj)
            throw new TypeError('obj must be an Object instance');
        var last,
            keys = key instanceof Array ? key : ('' + key).split(/\./);
            key = keys.shift();
        return key == null
            ? void 0
            : keys.length > 0
              ? valtree(obj[key], keys, val)
              : (val !== und && (last=obj[key]) !== ext
                ? (obj[key] = val) !== ext && last
                : obj[key]);
    }
}
