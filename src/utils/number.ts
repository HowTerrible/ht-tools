/** 转百分比 */
export function ToPercent(num: number | string) {
  const temp = Number(num);
  if (isNaN(temp)) return '';

  return Math.round(temp * 10000) / 100 + '%';
}
