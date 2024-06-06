/** EXCEL转换后的参数字符串转tsType */
(function (global) {
  'use strict';

  function main(input) {
    const fieldsArr = input.split('\n');

    const fields = [];
    fieldsArr.forEach((item) => {
      if (!item) return;
      const splitted = item.split('\t');

      let fieldType = '';
      switch (splitted[1].trim()) {
        case 'integer':
          fieldType = 'number';
          break;
        default:
          fieldType = splitted[1];
          break;
      }

      fields.push({
        field: splitted[0],
        type: fieldType,
        required: splitted[2] !== '非必须',
        des: splitted[4],
      });
    });

    return fields
      .filter((item) => item.field)
      .map((item) => `/** ${item.des} */\n${item.field} ${item.required ? '' : '?'}: ${item.type};`)
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

typeof global !== 'undefined'
  ? console.log(
      global.doc2type.docExcel2Type.converter(`					
aaa	string	非必须		机构id	
bbb	string	非必须		机构名称	
ccc	integer	非必须		机构状态：1：正常，2：停用	
ddd	integer	非必须		地址：省代码	
eee	string	非必须		地址：省	
fff	integer	非必须			
`)
    )
  : null;
