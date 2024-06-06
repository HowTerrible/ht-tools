/**
 * 通用模板
 */
/** 尝试根据json解析出ts的类型 */

(function (global) {
  'use strict';

  /**
   * 接受输入，返回输出
   * @param {any} input 输入
   * @returns
   */
  function main(input) {
    return '';
  }

  /** 工具名，会注册到window.doc2type或global.doc2type中 */
  const toolName = '';

  const tool = {
    toolName,
    /** 工具的名字，将会被显示在单选中 */
    name: '',
    /** 转换器 */
    converter: main,
    /** 提示消息 */
    tips: '',
  };

  global.doc2type ? (global.doc2type[toolName] = tool) : (global.doc2type = { [toolName]: tool });
})(typeof window !== 'undefined' ? window : global);

typeof global !== 'undefined' ? console.log(global.doc2type['toolName'].converter()) : null;
