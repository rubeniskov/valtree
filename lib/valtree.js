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
*   obj("bar.apple", obj("bar.pear", obj("bar.apple"), true))
*
*/

var und,
    ext = {};

module.exports = function valtree(obj, key, val, last) {
    if (!obj)
        throw new TypeError('obj must be an Object instance');
    if (key != null)
        return valtree(obj)(key, val, last);
    return function(key, val, last) {
        var keys = key instanceof Array
              ? key
              : key == null
                ? []
                : ('' + key).split(/\./);
            key = keys.shift();
        return key == null
            ? und
            : keys.length > 0
              ? valtree(val !== und && obj[key] == null
                ? obj[key] = ((/^([0-9]+)$/ig).test(keys[0]) ? [] : {})
                : obj[key] || {}, keys, val, last)
              : (val !== und && (keys=obj[key]) !== ext
                ? (obj[key] = val) !== ext && (last ? keys : val)
                : obj[key]);
    }
}
