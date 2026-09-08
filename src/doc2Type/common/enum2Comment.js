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
      if (!item) return;
      const [name, value] = item
        .split('=')
        .map((part) => part.trim());
      if (name && value) data.push(`${value}: ${name}`);
    });
    return data.length ? data.join(', ') : '';
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
