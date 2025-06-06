/** 枚举类型注释转ts的Enum内容 */
(function (global) {
  'use strict';

  const InlineTypeReg =
    /((\d+)[.。,，:：\s、]+)(\D[^,，.。;；:：、\(（\s\d]*)[.。,，:：\s、]?(\D*)/g;
  const NameReg = /^(\D*)/;

  function main(input) {
    let inlineData = {};
    input.replace(InlineTypeReg, function (...[a, b, dataValue, dataLabel]) {
      //console.log(dataValue, dataLabel)
      if (dataValue && dataLabel) {
        inlineData[dataLabel] = dataValue;
      }
    });
    return `${input.match(NameReg)[0].trim()} ${Object.entries(inlineData)
      .map((item) => `${item[1]}: ${item[0]}`)
      .join(', ')} */

${Object.entries(inlineData)
  .map((item) => `${item[0]} = ${item[1]},`)
  .join('\n')}`;
  }

  /** 工具名，会注册到window.doc2type或global.doc2type中 */
  const toolName = 'parseComments';
  const tool = {
    toolName,
    name: '解析注释',
    converter: main,
    tips: '会生成格式化后的注释和枚举',
  };

  global.doc2type
    ? (global.doc2type[toolName] = tool)
    : (global.doc2type = { [toolName]: tool });
})(typeof window !== 'undefined' ? window : global);

typeof global !== 'undefined'
  ? console.log(
      global.doc2type.parseComments.converter(
        'text parse comment: 1: aaa; 2: bbb; 3: ccc; 4: ddd; 5: eee'
      )
    )
  : null;
