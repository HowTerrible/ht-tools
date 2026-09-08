/** EXCEL转换后的参数字符串转tsType */
(function (global) {
  'use strict';

  function main(input) {
    if (!input || typeof input !== 'string') return '';
    const fields = input
      .split('\n')
      .filter((item) => item && item.trim())
      .map((item) => {
        const splitted = item.split('\t');
        const field = (splitted[0] || '').trim();
        const required = splitted[2] !== '非必须';
        const des = (splitted[4] || '').trim();
        return {
          field,
          type: global.doc2type.helpers.normalizeType(splitted[1]),
          required,
          des,
        };
      });

    return fields
      .filter((item) => item.field)
      .map(
        (item) =>
          `/** ${item.des || ''} */\n${item.field} ${item.required ? '' : '?'}: ${item.type || 'any'};`
      )
      .join('\n');
  }

  /** 工具名，会注册到window.doc2type或global.doc2type中 */
  const toolName = 'docExcel2Type';
  const tool = {
    toolName,
    name: 'Excel转换后的文档转TS',
    converter: main,
  };
  global.doc2type ? (global.doc2type[toolName] = tool) : (global.doc2type = { [toolName]: tool });
})(typeof window !== 'undefined' ? window : global);
