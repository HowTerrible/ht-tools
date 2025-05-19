/** 日期格式化字符串 YYYY-MM-DD HH:mm:ss */
export const DateTimeFormat_YMDHMS = 'YYYY-MM-DD HH:mm:ss';

/** 日期格式化字符串 YYYY-MM-DD HH:mm */
export const DateTimeFormat_YMDHM = 'YYYY-MM-DD HH:mm';

/** 日期格式化字符串 YYYY-MM-DD */
export const DateFormat_YMD = 'YYYY-MM-DD';

/**
 * 将天数转换成展示用的文本
 * 例如 1年2个月4天. 年数少于1 只显示月天; 月少于1 只显示天.
 * @param dayCnt 天数
 * @param {Boolean} returnCnt 设置是否直接返回年月日的数字. 默认为 false. 如果为 true, 将返回数组[年, 月, 日]
 * @returns returnCnt 为 false 时返回拼接好的字符串. returnCnt 为 true 时返回数组[年, 月, 日]
 */
function ConvertDayCountToDisplayStr(dayCnt: string | number, returnCnt?: false): string;
function ConvertDayCountToDisplayStr(dayCnt: string | number, returnCnt: true): number[];
function ConvertDayCountToDisplayStr(dayCnt: string | number, returnCnt?: boolean) {
  let _day = Number(dayCnt);
  if (isNaN(_day)) return '';
  if (_day === 0) {
    return '0天';
  }
  const year = parseInt(String(_day / 365));
  const remainder = _day % 365;
  const month = parseInt(String(remainder / 30));
  const date = parseInt(String(remainder % 30));
  let result: string[] = [];

  if (returnCnt) {
    return [year, month, date];
  } else {
    if (year > 1) result.push(`${year}年`);
    if (month > 1) result.push(`${month}个月`);
    result.push(`${date}天`);
    return result.join('');
  }
}

export const ConvertDayCntToDisplayStr = ConvertDayCountToDisplayStr;

/**
 * 为日期增加时间后缀
 * 此函数不校验格式, 仅添加后缀
 * @param date 日期字符串
 * @param {Object} options timeSuffix 添加到日期字符串之后的时间. 默认 00:00:00. start
 */
export const AppendTimeToDateStr = (
  date: string,
  /** 配置
   * 不传则自动拼接时间后缀'00:00:00'
   * 配置及优先级如下
   * 1. timeSuffix: 时间后缀, 默认'00:00:00'
   * 2. startOfDay: 一天的开始, 即'00:00:00'
   * 3. endOfDay: 一天的结束, 即'23:59:59'
   */
  options: { timeSuffix?: string; startOfDay?: false; endOfDay?: false } = {
    timeSuffix: '00:00:00',
  }
) => {
  /** 如果日期格式是YYYY-MM-DD，则长度为10 */
  if (date.length !== 10) {
    return;
  }
  if (options.timeSuffix) {
    return date + ' ' + options.timeSuffix;
  }
  if (options.startOfDay) {
    return date + ' 00:00:00';
  }
  if (options.endOfDay) {
    return date + ' 23:59:59';
  }
  return date;
};
