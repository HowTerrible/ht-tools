/**
 * 公共工具方法，注册到 doc2type.helpers
 */
(function (global) {
  'use strict';

  /**
   * 将文档中的字段类型映射为 ts 类型
   * @param {String} type 源类型文本
   * @returns {String} ts 类型
   */
  function normalizeType(type) {
    if (!type) return '';
    type = String(type).trim().replace(/\s+/g, '');
    const map = {
      integer: 'number',
      'integer[]': 'number[]',
      number: 'number',
      'number[]': 'number[]',
      long: 'number',
      'long[]': 'number[]',
      double: 'number',
      float: 'number',
      string: 'string',
      'string[]': 'string[]',
      boolean: 'boolean',
      bool: 'boolean',
      object: 'object',
      'object[]': 'object[]',
      array: 'any[]',
      file: 'any',
      'file[]': 'any[]',
      any: 'any',
    };
    // 兜底：未识别的、但形如 xxx[] 的类型保持为 xxx[]
    return map[type] || (type.endsWith('[]') ? type : type);
  }

  /**
   * 从形如 `1: 狗, 2: 猫` 或 `1：狗 2：猫` 的注释文本中解析出枚举
   * 由于后端开发的规范性问题，枚举值和枚举键之间的分隔符多种多样，现在支持【.。,，:：、】方括号中的内容和空白符(\s)
   * 返回 { label: value, ... }，value 为数字字符串
   * @param {String} input
   * @returns {Object}
   */
  const InlineTypeReg =
    /(\d+)\s*[.。,，:：\s、]\s*([^\n]*?)(?=\d+\s*[.。,，:：\s、]|$)/g;

  function parseEnumComment(input) {
    const inlineData = {};
    if (input && typeof input === 'string') {
      input.replace(InlineTypeReg, function (...args) {
        const dataValue = args[1];
        const dataLabel = args[2]
          .replace(/[,，、;；\s]+$/g, '')
          .trim();
        if (dataValue && dataLabel) {
          inlineData[dataLabel] = dataValue;
        }
      });
    }
    return inlineData;
  }

  /**
   * 输入异常时向前端抛出的提示
   */
  class ConvertError extends Error {
    constructor(msg) {
      super(msg);
      this.name = 'ConvertError';
    }
  }

  /**
   * 对象/枚举键需要作为标识符直接输出时，若含特殊字符则加上引号
   * @param {String} key
   * @returns {String}
   */
  function quoteKey(key) {
    // 允许字母、数字、下划线、$ 以及中日韩等 unicode 标识符字符
    if (key && /^[A-Za-z_$\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af][A-Za-z0-9_$\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]*$/.test(key)) {
      return key;
    }
    return `'${key}'`;
  }

  const helpers = { normalizeType, parseEnumComment, ConvertError, quoteKey };

  global.doc2type
    ? (global.doc2type.helpers = helpers)
    : (global.doc2type = { helpers });
})(typeof window !== 'undefined' ? window : global);
