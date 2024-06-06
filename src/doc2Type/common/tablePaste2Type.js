/** 从表格复制出来的文档转换成tsType */
(function (global) {
  'use strict';

  /** 目前设想的此工具和其他工具不同, 此工具在初始化的时候已经开始监听, 监听到粘贴就开始执行并尝试计算结果
   * 在外部调取Output的时候只是把算好的结果返回
   */
  let result = [];

  const typeConveter = (type) => {
    // 记录字段类型
    let typestr = '';
    switch (type) {
      case 'integer':
        typestr = 'number';
        break;
      case 'integer []':
      case 'integer []':
      case 'integer[]':
        typestr = 'number[]';
        break;
      case 'object []':
      case 'object []':
      case 'object[]':
        typestr = 'object[]';
        break;
      default:
        typestr = type;
        break;
    }
    return typestr;
  };

  function PasteHandler(event) {
    result = [];
    event.clipboardData.types
      .filter((type) => type === 'text/html')
      .forEach((type) => {
        try {
          const html = event.clipboardData.getData('text/html');
          const doc = new DOMParser().parseFromString(html, 'text/html');
          // 加载所有的行
          const trs = Array.from(doc.querySelectorAll('table tr.ant-table-row'));
          const resultObj = [];
          /** td的内容分别是
           * 字段名 类型 必填 默认值 注释  */
          trs.forEach((tr) => {
            if (!tr.children || !tr.children.length) return;

            /**
             * 字段的层级, 在最后编译的时候,
             * 如果字段层级相较上一级增加, 则此字段的上一级是数组或对象, 此字段则是上一级的属性
             */
            let level = 0;
            tr.classList.forEach((item) => {
              if (item.startsWith('ant-table-row-level-')) {
                level = item.split('ant-table-row-level-')[1];
                level = level ? Number(level) : 0;
              }
            });

            const field = tr.children[0]?.textContent || '',
              type = tr.children[1]?.textContent || '',
              required = tr.children[2]?.textContent || '',
              defaultVal = tr.children[3]?.textContent || '',
              commets = tr.children[4]?.textContent || '';

            resultObj.push({
              commets,
              field,
              requiredStr: required === '必须' ? ':' : '?:',
              type: typeConveter(type),
              defaultVal: defaultVal,
              level,
            });
          });

          /** 字段栈
           * 栈中最后一个字段为当前字段的父级
           */
          let fieldStack = [];
          resultObj.reduce((prev, cur, index) => {
            if (prev) {
              if (cur.level > prev.level) {
                /** 层级递增肯定是一级一级的, 所以不需要特殊处理 */
                // 如果层级增加, 需要把上一个字段压入栈
                fieldStack.push(prev);
                result.push('{');
              } else if (cur.level < prev.level) {
                /** 层级递减有可能是多级的, 需要循环处理 */
                while (1) {
                  const laseField = fieldStack.pop();
                  if (laseField.level >= cur.level) {
                    result.push(laseField.type === 'object[]' ? '}[];' : '};');
                    if (laseField.level == cur.level) break;
                  } else {
                    break;
                  }
                }
              }
            }

            result.push(`/** ${cur.commets} */`);
            result.push(
              `${cur.field} ${cur.requiredStr} ${
                cur.type === 'object[]' || cur.type === 'object' ? '' : cur.type + ';'
              }`
            );

            /** 如果当前元素是最后一个, 需要判断类型并添加对象的反括号 */
            if (index === resultObj.length - 1) {
              fieldStack.reduceRight((prev, cur) => {
                result.push(cur.type === 'object[]' ? '}[];' : '};');
              }, null);
            }

            return cur;
          }, null);
        } catch (err) {
          console.log(err);
        }
      });
  }

  if (global.document && global.document.addEventListener) {
    global.document.removeEventListener('paste', PasteHandler);
    global.document.addEventListener('paste', PasteHandler);
  }

  function main(input) {
    return result.join('\n');
  }

  /** 工具名，会注册到window.doc2type或global.doc2type中 */
  const toolName = 'tablePaste2Type';
  const tool = {
    toolName,
    name: '直接复制的表格文档转TS',
    converter: main,
    tips: '必须要从表格复制过来的内容. 如果复制的是文本框中的原表格数据, 将无法解析. 即需要粘贴板的内容type为text/html',
  };
  global.doc2type ? (global.doc2type[toolName] = tool) : (global.doc2type = { [toolName]: tool });
})(typeof window !== 'undefined' ? window : global);

typeof global !== 'undefined' ? console.log(global.doc2type.tablePaste2Type.converter(``)) : null;
