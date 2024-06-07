/**
 * 将金额转换为中文的大写数字
 * 上限千亿，两位小数
 * 参数将会尝试转换为数字, 如果转换失败直接返回空字符串
 * @method cnMoneyFormat
 * @param {Number} money 数字
 * @returns 转换后的字符串
 */
function Money2CnUppercaseNumbers(input: number | string) {
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
    money = money.substring(0, intPos) + money.substring(intPos + 1, intPos + 3);
  }
  strUnit = strUnit.substring(strUnit.length - money.length);
  for (let i = 0; i < money.length; i++) {
    const numChar = Number(money.substring(i, i + 1));
    strOutput +=
      '零壹贰叁肆伍陆柒捌玖'.substring(numChar, numChar + 1) + strUnit.substring(i, i + 1);
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
