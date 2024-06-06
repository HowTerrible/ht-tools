/** 尝试根据json解析出ts的类型 */
(function (global) {
  'use strict';

  /**
   * 将数据保存进结果中
   * @param {String} key 键
   * @param {Object} data 数据
   * @param {Array} result 结果
   * @param {Number} parentLevel 调用此函数处数据的层级
   */
  function handleData(key, data, result, currentLevel) {
    if (Array.isArray(data)) {
      parseArray(key, data, result, currentLevel);
    } else if (data === null) {
      result.push({
        key,
        type: 'any',
        level: currentLevel,
      });
    } else if (typeof data === 'object') {
      parseObj(key, data, result, currentLevel);
    } else {
      result.push({
        key,
        type: typeof data,
        level: currentLevel,
      });
    }
  }

  /**
   * 解析对象
   * @param {String} key 键
   * @param {Object} data 数据
   * @param {Array} result 结果
   * @param {Number} parentLevel 调用此函数处数据的层级
   */
  function parseObj(key, data, result, currentLevel) {
    result.push({
      key,
      type: typeof data,
      level: currentLevel,
    });
    Object.entries(data).forEach((prop) => {
      handleData(prop[0], prop[1], result, currentLevel + 1);
    });
  }

  const arrayPropKey = '';

  /**
   * 解析数组
   * @param {String} key 键
   * @param {Array} data 数据
   * @param {Array} result 结果
   * @param {Number} parentLevel 调用此函数处数据的层级
   */
  function parseArray(key, data, result, currentLevel) {
    result.push({
      key,
      type: 'array',
      level: currentLevel,
    });
    data.forEach((item, index) => {
      if (index === 0) handleData(arrayPropKey, item, result, currentLevel + 1);
      else {
        // 第一项直接记录，之后的比对
        // 暂时不写
        return;
      }
    });
  }

  const resultStack = [];
  const lineSuffix = ';';

  function assembleResult(result, output) {
    result.reduce((prev, cur, index) => {
      // console.log(prev, cur);
      if (prev && prev.level < cur.level) {
        resultStack.push(prev);
      }
      /** 如果前一项和当前项同级且前一项是对象或者数组，需要关闭括号 */
      if (prev && prev.level === cur.level) {
        switch (prev.type) {
          case 'object':
            output.push('}' + lineSuffix);
            break;
          case 'array':
            output.push('any>' + lineSuffix);
            break;
        }
      }

      /** 前一个属性比后一个大, 即层级往左 */
      if (prev && cur.level < prev.level) {
        while (1) {
          const lowlevel = resultStack.pop();
          switch (lowlevel.type) {
            case 'object':
              output.push('}');
              break;
            case 'array':
              output.push('>');
              break;
          }
          if (lowlevel.level <= cur.level) {
            break;
          }
        }
      }

      /**
       * 有key是对象内的属性，没有是数组内的
       */
      if (cur.type === 'object') {
        output.push(cur.key ? `${cur.key}: {` : '{');
      } else if (cur.type === 'array') {
        output.push(cur.key ? `${cur.key}: Array<` : 'Array<');
      } else {
        // 基础数据类型
        output.push(cur.key ? `${cur.key}: ${cur.type};` : cur.type);
      }

      return cur;
    }, null);

    if (resultStack.length) {
      do {
        const lowlevel = resultStack.pop();
        switch (lowlevel.type) {
          case 'object':
            output.push('}');
            break;
          case 'array':
            output.push('>');
            break;
        }
      } while (resultStack.length);
    }
  }

  function main(input) {
    try {
      let data = null;
      /** 将对象复制到网页上的文本框中，可能是JS对象模式而不是JSON，
       * 需要先用JSON尝试解析一次，如果能解析就用，不能解析就用Function转一遍 */
      try {
        data = JSON.parse(input);
      } catch (e) {
        data = new Function('return ' + input)();
      }

      if (!data) return '';

      const result = [],
        output = [];

      /** 接口返回值除了基础数据类型就是数组对象。基础数据类型在尝试解析的时候会爆炸所以不用考虑 */
      Array.isArray(data) ? parseArray('', data, result, 0) : parseObj('', data, result, 0);

      assembleResult(result, output);
      return output.join('\n');
    } catch (error) {
      console.error('input cannot convert to json. please check input is base type or not', error);
    }
  }

  /** 工具名，会注册到window.doc2type或global.doc2type中 */
  const toolName = 'json2Type';
  const tool = {
    toolName,
    name: '从JSON中分析TS内容',
    converter: main,
    tips: '',
  };

  global.doc2type ? (global.doc2type[toolName] = tool) : (global.doc2type = { [toolName]: tool });
})(typeof window !== 'undefined' ? window : global);

typeof global !== 'undefined'
  ? console.log(
      global.doc2type.json2Type.converter(
        JSON.stringify({
          id: '123',
          name: '456',
          age: 78,
          children: [
            {
              name: 'aaa',
              job: 'ccc',
            },
          ],
        })
      )
    )
  : null;
