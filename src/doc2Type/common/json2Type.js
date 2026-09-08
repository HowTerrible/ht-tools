/** 尝试根据json解析出ts的类型 */
(function (global) {
  'use strict';

  const { ConvertError } = global.doc2type.helpers;
  const indent = (level) => '  '.repeat(level);

  function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
  }

  /**
   * 递归生成 ts 类型，用于属性行（不含缩进）
   * @param {any} data
   * @param {Number} level 该属性当前的缩进层级（行内内容在此层级之上）
   * @returns {String}
   */
  function typeOf(data, level) {
    if (data === null || data === undefined) return 'any';
    if (Array.isArray(data)) {
      if (data.length === 0) return 'any[]';
      const first = data.find((item) => item !== null && item !== undefined);
      if (first === undefined) return 'any[]';
      if (isPlainObject(first)) {
        // 对象数组 -> Array<{ ... }>
        return `Array<{\n${objectBody(first, level + 1)}\n${indent(level)}}>`;
      }
      return `${typeOf(first, level)}[]`;
    }
    if (isPlainObject(data)) {
      return `{\n${objectBody(data, level + 1)}\n${indent(level)}}`;
    }
    return typeof data;
  }

  /**
   * 生成对象内各属性行，已带缩进
   * @param {Object} data
   * @param {Number} level 对象体自身的缩进层级
   * @returns {String}
   */
  function objectBody(data, level) {
    const keys = Object.keys(data);
    if (!keys.length) return '';
    return keys
      .map((key) => `${indent(level)}${key}: ${typeOf(data[key], level)};`)
      .join('\n');
  }

  function main(input) {
    if (!input || typeof input !== 'string') return '';

    let data = null;
    try {
      try {
        data = JSON.parse(input);
      } catch (e) {
        data = new Function('return ' + input)();
      }
    } catch (e) {
      throw new ConvertError('输入无法解析为对象/JSON，请确认粘贴的是合法内容');
    }

    if (data === null || data === undefined) return '';
    if (typeof data === 'string') return 'string';
    if (typeof data === 'number') return 'number';
    if (typeof data === 'boolean') return 'boolean';
    if (Array.isArray(data)) return typeOf(data, 0);
    if (isPlainObject(data)) {
      const body = objectBody(data, 1);
      return body ? `{\n${body}\n}` : '{}';
    }
    return 'any';
  }

  /** 工具名，会注册到window.doc2type或global.doc2type中 */
  const toolName = 'json2Type';
  const tool = {
    toolName,
    name: '从JSON中分析TS内容',
    converter: main,
    tips: '支持粘贴 JSON 或 JS 对象字面量；数组取首项推断结构',
  };

  global.doc2type ? (global.doc2type[toolName] = tool) : (global.doc2type = { [toolName]: tool });
})(typeof window !== 'undefined' ? window : global);
