/**
 * 将金额转换为中文的大写数字
 * 上限千亿，两位小数
 * 参数将会尝试转换为数字, 如果转换失败直接返回空字符串
 * @method cnMoneyFormat
 * @param {Number} money 数字
 * @returns 转换后的字符串
 */
export function Money2CnUppercaseNumbers(input: number | string) {
  if (!isNaN(Number(input))) {
    console.error('input must be a number');
    return '';
  }

  let cnMoney = '零元整',
    strOutput = '',
    strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分',
    money = input + '00',
    intPos = money.indexOf('.');
  if (intPos >= 0) {
    money =
      money.substring(0, intPos) + money.substring(intPos + 1, intPos + 3);
  }
  strUnit = strUnit.substring(strUnit.length - money.length);
  for (let i = 0; i < money.length; i++) {
    const numChar = Number(money.substring(i, i + 1));
    strOutput +=
      '零壹贰叁肆伍陆柒捌玖'.substring(numChar, numChar + 1) +
      strUnit.substring(i, i + 1);
  }
  cnMoney = strOutput
    .replace(/零角零分$/, '整')
    .replace(/零[仟佰拾]/g, '零')
    .replace(/零{2,}/g, '零')
    .replace(/零([亿|万])/g, '$1')
    .replace(/零+元/, '元')
    .replace(/亿零{0,3}万/, '亿')
    .replace(/^元/, '零元');
  return cnMoney;
}
/** Money2CnUppercaseNumbers 测试代码
for (let i = 0; i < 12; i++) {
  const temp = String(2).padEnd(i + 1, '4') + '.35';
  console.log(Money2CnUppercaseNumbers(temp));
}
console.log(Money2CnUppercaseNumbers('1234567890.12'));
console.log(Money2CnUppercaseNumbers('1234567890.00'));
console.log(Money2CnUppercaseNumbers('00.00'));
console.log(Money2CnUppercaseNumbers('00.34'));
console.log(Money2CnUppercaseNumbers(0.34));
console.log(Money2CnUppercaseNumbers(999999999999));
 */

/**
 * 将金额转换为展示版本
 * 如果输入为空或者非数字, 将返回字符串0
 * XXX亿 XXX万
 * @param value 需要转行的值
 * @param digit 保留位数
 */
export const MoneyToDisplayText = (money?: number | string, digit = 2) => {
  const value = Number(money);

  if (!value || isNaN(value)) return '0';
  // 此处需要判断取绝对值,数据有可能为负数
  if (Math.abs(value) < 10000) return Math.abs(value).toFixed(digit);
  if (Math.abs(value) >= 10000 && Math.abs(value) < 10000 * 10000)
    return (Math.abs(value) / 10000).toFixed(digit) + '万';
  else return (Math.abs(value) / 10000 / 10000).toFixed(digit) + '亿';
};

/** 移除金额字符串中的逗号 */
export const RemoveCommaFromMoneyStr = (money?: string) =>
  money && typeof money === 'string' ? money.replace(/,/g, '') : money;

/**
 * 给金额加分隔符
 * @param money 金额 数字会被转成字符串
 * @param commaPosition 逗号位置 千分位为3, 万分位为4
 * @returns
 */
export function MoneyAddComma(money: string | number, commaPosition = 3) {
  if (money && Number(money)) {
    return String(money).replace(
      new RegExp(`(\\d)(?=(\\d{${commaPosition}})+\\.)`, 'g'),
      '$1,'
    );
  }
  return String(money);
}

type moneyStrType = string | undefined;

//#region MoneyCent2Yuan
/** 金额转换
 * 后端返回的金额单位为分, 前端展示需要转换为元
 * @param money 金额
 * @param hasUnit hasUnit 是否添加单位 默认添加
 * @param hasComma hasComma 是否添加逗号 此方法多用于展示，故 默认添加逗号
 * @returns
 */
function doCent2Yuan(money: string, hasUnit?: true, hasComma?: true) {
  // 此方法不公开, money由 MoneyCent2Yuan 校验
  // if (!money || isNaN(Number(money))) return '0';

  if (money === '0') return '0';

  let value = '';
  // 不能用toFixed的形式，可能会出现超出js数字范围的情况，尤其是后台计算总额的时候返回的字符串
  if (typeof money === 'number') {
    value = (money as number).toString();
  }
  if (money.indexOf('.') < 0) {
    // 如果没有小数点后两位，加上.
    const arr = money.split('');
    if (!/\d/.test(arr[arr.length - 1])) {
      return money;
    }
    if (!/\d/.test(arr[arr.length - 2]) && !/\d/.test(arr[arr.length - 3])) {
      // 个位数，倒数第二第三都不是数字
      arr.splice(arr.length - 1, 0, '0');
      arr.splice(arr.length - 1, 0, '0');
    }
    if (/\d/.test(arr[arr.length - 2]) && !/\d/.test(arr[arr.length - 3])) {
      // 十位数，倒数第三不是数字
      arr.splice(arr.length - 2, 0, '0');
    }

    arr.splice(arr.length - 2, 0, '.');
    value = arr.join('');
  }

  let result = '0';
  if (value !== '0.00') {
    result = hasComma ? MoneyAddComma(value) : value;
  }

  result = hasUnit ? '￥' + result : result;
  return result;
}

/**
 * 金额单位转换
 * 即金额除100 100分=>1元
 * @param value
 * @param hasUnit hasUnit 是否添加单位 默认添加
 * @param hasComma hasComma 是否添加逗号 此方法多用于展示，故 默认添加逗号
 */
export const MoneyCent2Yuan: (
  value?: number | string,
  hasUnit?: true,
  hasComma?: true
) => moneyStrType = (value, hasUnit = true, hasComma = true) => {
  // 考虑到会有控制显示其他默认字符串的请开给你
  // 0 "" null undefined 都不处理直接返回
  if (!value) return value as moneyStrType;

  let data = typeof value === 'number' ? value : Number(value);

  if (!isNaN(data)) {
    return doCent2Yuan(String(value), hasUnit, hasComma);
  } else {
    // data 是NaN
    console.warn('MoneyCent2Yuan: The converted value is NaN.');
    // 返回原内容
    return value as moneyStrType;
  }
};
//#endregion

//#region MoneyYuan2Cent
/** 仅处理金额X100
 *
 * 不处理错误情况 参数由 MoneyYuan2Cent 校验
 *
 * 修改此工具时必须通过的测试用例
 * [19.9, 35.41, 265818.84, 34.2, 14.6+86.05]
 */
const doYuan2Cent = (money: string | number): string => {
  // 此方法不公开, money由 MoneyYuan2Cent 校验
  // if (!money || !Number(money)) return money;

  if (money === '0') return '0';

  let result = String(money);

  const temp = result.split('.');
  if (!temp[1]) result = temp[0] + '00';
  else {
    if (temp[1].length === 1) result = temp[0] + temp[1] + '0';

    if (temp[1].length === 2) result = temp[0] + temp[1];
  }

  return result;
};

/**
 * 金额单位转换
 * 即金额*100 1元=>100分
 * 此方法一般为前端计算或者调用接口时使用
 *
 * 如果参数为空或者不是一个数字，将原样返回
 * @param value 金额，支持带逗号的字符串输入
 */
export const MoneyYuan2Cent: (value?: number | string) => moneyStrType = (
  value?: number | string
) => {
  // 0 "" null undefined 都不处理直接返回‘0’
  if (!value) return value as moneyStrType;

  let data = 0;

  if (typeof value === 'string') {
    data = Number(RemoveCommaFromMoneyStr(value));
  } else {
    data = value;
  }

  if (!isNaN(data)) {
    return String(doYuan2Cent(data));
  } else {
    // data 是NaN
    console.warn('MoneyYuan2Cent: The converted value is NaN.');
    // 返回原内容
    return value as moneyStrType;
  }
};
//#endregion
