/** 从表格复制出来的文档转换成tsType */
(function (global) {
  'use strict';

  /**
   * 解析粘贴的 html 中的 ant-table 行，转换为字段数组
   * @param {String} html
   * @returns {Array}
   */
  function parseHtmlTable(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const trs = Array.from(doc.querySelectorAll('table tr.ant-table-row'));
    const resultObj = [];
    /** td的内容分别是 字段名 类型 必填 默认值 注释 */
    trs.forEach((tr) => {
      if (!tr.children || !tr.children.length) return;

      /** 字段的层级, 在最后编译的时候,
       * 如果字段层级相较上一级增加, 则此字段的上一级是数组或对象, 此字段则是上一级的属性 */
      let level = 0;
      tr.classList.forEach((item) => {
        if (item.startsWith('ant-table-row-level-')) {
          level = item.split('ant-table-row-level-')[1];
          level = level ? Number(level) : 0;
        }
      });

      const field = tr.children[0]?.textContent || '';
      const type = tr.children[1]?.textContent || '';
      const required = tr.children[2]?.textContent || '';
      const defaultVal = tr.children[3]?.textContent || '';
      const commets = tr.children[4]?.textContent || '';

      resultObj.push({
        commets: commets.trim(),
        field: field.trim(),
        requiredStr: required === '必须' ? ':' : '?:',
        type: global.doc2type.helpers.normalizeType(type),
        defaultVal: defaultVal.trim(),
        level,
      });
    });
    return resultObj;
  }

  /**
   * 根据字段层级将字段数组编译为 ts 接口
   * @param {Array} resultObj
   * @returns {Array} 输出行
   */
  function compileFields(resultObj) {
    const result = [];
    /** 字段栈, 栈中最后一个字段为当前字段的父级 */
    const fieldStack = [];
    resultObj.forEach((cur, index) => {
      const prev = index > 0 ? resultObj[index - 1] : null;
      if (prev) {
        if (cur.level > prev.level) {
          /** 层级递增肯定是一级一级的, 所以不需要特殊处理 */
          fieldStack.push(prev);
          result.push('{');
        } else if (cur.level < prev.level) {
          /** 层级递减有可能是多级的, 需要循环处理 */
          while (fieldStack.length) {
            const lastField = fieldStack.pop();
            result.push(lastField.type === 'object[]' || lastField.type === 'object'
              ? `${lastField.type === 'object[]' ? '}[];' : '};'}`
              : `${lastField.field} ${lastField.requiredStr} ${lastField.type};`);
            if (lastField.level <= cur.level) break;
          }
        }
      }

      result.push(`/** ${cur.commets} */`);
      const isObjectLike =
        cur.type === 'object[]' || cur.type === 'object';
      result.push(
        `${cur.field} ${cur.requiredStr} ${isObjectLike ? '' : (cur.type || 'any') + ';'}`
      );

      /** 如果是最后一个元素, 需要将栈中剩余的对象关闭 */
      if (index === resultObj.length - 1) {
        while (fieldStack.length) {
          const lastField = fieldStack.pop();
          result.push(lastField.type === 'object[]' ? '}[];' : '};');
        }
      }
    });
    return result;
  }

  function main(input) {
    if (!input || typeof input !== 'string') return '';
    const html = input.trim();
    if (!html.toLowerCase().includes('<table')) {
      throw new global.doc2type.helpers.ConvertError(
        '未检测到表格 html，请从 YApi 页面直接复制表格内容（需为 text/html）'
      );
    }
    const resultObj = parseHtmlTable(html);
    if (!resultObj.length) return '';
    return compileFields(resultObj).join('\n');
  }

  /** 工具名，会注册到window.doc2type或global.doc2type中 */
  const toolName = 'tablePaste2Type';
  const tool = {
    toolName,
    name: '直接复制的表格文档转TS',
    converter: main,
    tips: '需要粘贴从 YApi 表格直接复制（text/html）的内容',
  };
  global.doc2type
    ? (global.doc2type[toolName] = tool)
    : (global.doc2type = { [toolName]: tool });
})(typeof window !== 'undefined' ? window : global);
