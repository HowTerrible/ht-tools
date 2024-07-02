const map_type = [
  'Boolean',
  'Number',
  'String',
  'Function',
  'Array',
  'Date',
  'RegExp',
  'Object',
  'Error',
  'Symbol',
];
const class2Type = {};
/**
 * Object.property.toString 检测数据类型
 */
const toString = class2Type.toString;
/**
 * 获取当前对象的原型链__proto__
 */
const getProto = Object.getPrototypeOf;
/**
 * 检查是否私有属性
 */
const hasOwn = class2Type.hasOwnProperty;
/**
 * Function.property.toString 将函数转换成字符串
 */
const fnToString = hasOwn.toString;
/**
 * function Object() {[native code]}
 */
const ObjectFunctionString = fnToString.call(Object);
map_type.forEach((item) => (class2Type['[object ' + item + ']'] = item.toLocaleLowerCase()));

/** 判断函数
 * typeof document.getElementByTagName("object") => function
 * @param {Object} obj
 */
export function isFunction(obj: any) {
  return typeof obj === 'function' || typeof obj.nodeType !== 'number';
}

/** 判断window
 * @param {Object} obj
 */
export function isWindow(obj: any) {
  return obj != null && obj === obj.window;
}

/** 获取类型
 * @param data
 * @returns
 */
export const getType = function getType(data: any) {
  if (data == null) {
    // null or undefined
    return data + '';
  } else {
    return typeof data === 'object' || typeof data === 'function'
      ? class2Type[toString.call(data)] || 'object'
      : typeof data;
  }
};

/** 检查类数组
 * @param obj
 * @returns
 */
export const isArrayLike = function isArrayLike(obj: any) {
  // 强制转换成bool类型， 其中 ''/null/ undefined/false/0 转成bool是false,
  // 不是false 则获取length
  const length = !!obj && 'length' in obj && obj.length,
    type = getType(obj);
  if (isFunction(obj) || isWindow(obj)) return false;
  // &&：优先级7；||：优先级6
  return (
    type === 'array' ||
    length === 0 ||
    // 非空类数组 有length属性并且最大索引在对象中
    (typeof length === 'number' && length > 0 && length - 1 in obj)
  );
};

/** 检测是否是存粹对象
 * @param {Object} obj
 */
export const isPlainObject = function isPlainObject(obj: any) {
  let proto, Ctor;
  if (!obj || toString.call(obj) !== '[object Object]') return false;
  proto = getProto(obj);
  // Object.create(null); => 创造出来的对象没有原型
  if (!proto) {
    return true;
  }
  // Ctor存储原型对象上的constructor属性，没有这个属性就是false
  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
  // 条件成立说明原型上的constructor构造函数是Object
  return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString;
};

/** 检测空对象
 * @param {Object} obj
 */
export const isEmptyObject = function isEmptyObject(obj: any) {
  if (obj == null) return false;
  // 存储所有的键
  let keys: any[] = Object.keys(obj);
  if (hasOwn.call(Object, 'getOnPropertySymbols')) {
    keys = keys.concat(Object.getOwnPropertySymbols(obj));
  }
  return keys.length === 0;
};

/** 判断有效数字
 * @param {Object} obj
 */
export const isNumeric = function isNumeric(obj: any) {
  const type = getType(obj);
  return (
    (type === 'number' || type === 'string') &&
    // 如果obj和 parseFloat 有一个不是有效数字，运算结果都是NaN
    !isNaN(+obj)
  );
};

export default {
  getType,
  isFunction,
  isWindow,
  isArrayLike,
  isPlainObject,
  isEmptyObject,
  isNumeric,
};
