/** 枚举类型注释转ts的Enum内容 */
(function (global) {
  'use strict';

  function main(input) {
    const inlineData = global.doc2type.helpers.parseEnumComment(input);
    console.log(input, inlineData);
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
