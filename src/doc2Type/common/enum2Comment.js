/** 将枚举转换成字符串(通常用于注释) */
/** 枚举类型注释转ts的Enum内容 */
(function (global) {
  'use strict';

  function main(input) {
    if (!input || typeof input !== 'string') return '';
    input = input.replace(/,/g, '');
    /** 
      aaa = 1,
      bbb = 2,
      转换成
      1: aaa, 2: bbb,
     */

    const data = [];
    input.split('\n').forEach((item) => {
      item = item.trim();
      item
        ? data.push(
            item
              .split('=')
              .map((item) => item.trim())
              .reverse()
              .join(': ')
          )
        : null;
    });
    return data && data.length ? data.join(', ') : '';
  }

  /** 工具名，会注册到window.doc2type或global.doc2type中 */
  const toolName = 'enum2Comments';
  const tool = {
    toolName,
    name: '枚举转注释',
    converter: main,
  };
  global.doc2type ? (global.doc2type[toolName] = tool) : (global.doc2type = { [toolName]: tool });
})(typeof window !== 'undefined' ? window : global);

typeof global !== 'undefined'
  ? console.log(
      global.doc2type.enum2Comments.converter(
        `
    aaa = 1,
    bbb = 2,
    ccc = 3,
    ddd = 4,
    eee = 5,
    fff = 6,
    `
      )
    )
  : null;
