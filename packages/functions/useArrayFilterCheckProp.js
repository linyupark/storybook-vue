/**
 * 数组过滤中将符合对象属性条件的提取出来 （Currying）
 * 举例：
 * const candies = [
    {"soft":true, "flavour":"strawberry"},
    {"soft":false, "flavour":"strawberry"},
    {"soft":false, "flavour":"cherry"},
    {"soft":true, "flavour":"orange"},
    {"soft":false, "flavour":"lemon"},
  ];
  candies.filter( useArrayFilterCheckProp("soft")(true) )
  --- output ---
  [ { soft: true, flavour: 'strawberry' },
  { soft: true, flavour: 'orange' } ]
 */
export default (propName) => expectedValue => object => object[propName] === expectedValue;