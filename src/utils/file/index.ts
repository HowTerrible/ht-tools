/**
 * 字节大小转换成展示用的文本
 * 参数如果不是数字将返回空字符串
 * @param(Number) bytes
 * @returns(String) 转换后的文本
 */
export const byteConvert = function (bytes: number): string {
  if (isNaN(bytes)) return '';

  const symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  const base = 1024; // 每个单位的基数
  const exp = Math.floor(Math.log(bytes) / Math.log(base)); // 计算指数
  const convertedValue = bytes / Math.pow(base, exp); // 转换值

  return convertedValue.toFixed(2) + ' ' + symbols[exp];
};
