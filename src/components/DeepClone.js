class StoreHelpers {
  constructor() {
    // This should never run because StoreHelpers is a class of static methods.
    // Sanity check: throw an exception if the main application tries to instantiate
    throw new Error('ERROR: Unexpected instantiation of static class StoreHelpers.');
  }


  static deepClone(obj) {
    var out, v, key;
    out = Array.isArray(obj) ? [] : {};
    for (key in obj) {
      v = obj[key];
      out[key] = (typeof v === "object") ? StoreHelpers.deepClone(v) : v;
    }
    return out;
  }

  static mergeBIntoA(a, b) {
    // helper function, merges two objects. eg. if a={prop1:10, prop2:{prop3:30}},
    // and b={prop2:20, prop2:{prop4:40}} , then the result will be {prop1:10, prop2:{prop3:30, prop4:40}},
    // which is not what object.assign() would give, which would be {prop1:10, prop2:{prop4:40}} because of
    // the collision on prop2, causing overwrite.
    var prop;
    for (prop in b) {
      // If a.property does not exist or is a value (string, number, boolean), replace it with b.property.
      // NB - we merge b into a even if a[prop] already equals b[prop] (checking first is slower than just
      // making the change).
      if (!a.hasOwnProperty(prop) || ( typeof(a[prop]) !== "object") ) {
        a[prop] = b[prop];
      }
      // If we have a nested level, recurse down to the nested level to merge children.
      if (typeof(b[prop]) === "object") {
        StoreHelpers.mergeBIntoA(a[prop], b[prop]);
      }
    }
    return a;
  }

}