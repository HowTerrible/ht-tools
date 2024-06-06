/** 枚举类型注释转ts的Enum内容 */
(function (global) {
  'use strict';

  const InlineTypeReg =
    /((\d+)[.。,，:：\s、]+)(\D[^,，.。;；:：、\(（\s\d]*)[.。,，:：\s、]?(\D*)/g;

  function main(input) {
    let inlineData = {};
    input.replace(InlineTypeReg, function (...[a, b, dataValue, dataLabel]) {
      //console.log(dataValue, dataLabel)
      if (dataValue && dataLabel) {
        inlineData[dataLabel] = dataValue;
      }
    });
    return Object.entries(inlineData)
      .map((item) => `${item[0]} = ${item[1]},`)
      .join('\n');
  }

  /** 工具名，会注册到window.doc2type或global.doc2type中 */
  const toolName = 'comments2Enum';
  const tool = {
    toolName,
    name: '注释转枚举',
    converter: main,
  };
  global.doc2type ? (global.doc2type[toolName] = tool) : (global.doc2type = { [toolName]: tool });
})(typeof window !== 'undefined' ? window : global);

typeof global !== 'undefined'
  ? console.log(global.doc2type.comments2Enum.converter('aaa：1：bbb 2：ccc 3：ddd 4：eee'))
  : null;
