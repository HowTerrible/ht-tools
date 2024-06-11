/** 注释转对象类型的枚举 */

(function (global) {
  'use strict';

  const InlineTypeReg =
    /((\d+)[.。,，:：\s、]+)(\D[^,，.。;；:：、\(（\s\d]*)[.。,，:：\s、]?(\D*)/g;

  /**
   * 接受输入，返回输出
   * @param {any} input 输入
   * @returns
   */
  function main(input) {
    const temp = {};

    input.replace(InlineTypeReg, (...[a, b, dataValue, dataLabel]) => {
      temp[dataLabel] = dataValue;
    });

    return `/** ${Object.entries(temp)
      .map((item) => `${item[0]}: ${item[1]}; `)
      .join('')}*/
const unknowEnum = {
${Object.entries(temp)
  .map((item) => `${item[0]}: ${item[1]},`)
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

typeof global !== 'undefined'
  ? console.log(global.doc2type['comments2ObjEnum'].converter(' aa:1, bb:2, cc:3'))
  : null;
