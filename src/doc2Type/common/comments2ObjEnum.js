/** 注释转对象类型的枚举 并附带注释 */

(function (global) {
  'use strict';

  /**
   * 接受输入，返回输出
   * @param {any} input 输入
   * @returns
   */
  function main(input) {
    const temp = global.doc2type.helpers.parseEnumComment(input);
    const quoteKey = global.doc2type.helpers.quoteKey;

    return `/** ${Object.entries(temp)
      .map((item) => `${item[0]}: ${item[1]}; `)
      .join('')}*/
const unknowEnum = {
${Object.entries(temp)
  .map((item) => `${quoteKey(item[0])}: ${item[1]},`)
  .join('\n')}
};`;
  }

  /** 工具名，会注册到window.doc2type或global.doc2type中 */
  const toolName = 'comments2ObjEnum';

  const tool = {
    toolName,
    /** 工具的名字，将会被显示在单选中 */
    name: '注释转对象枚举',
    /** 转换器 */
    converter: main,
    /** 提示消息 */
    tips: '',
  };

  global.doc2type ? (global.doc2type[toolName] = tool) : (global.doc2type = { [toolName]: tool });
})(typeof window !== 'undefined' ? window : global);
