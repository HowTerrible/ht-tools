/**
 * 基于setTimeout的不丢帧并修复了timeout误差的循环器
 * reference: https://segmentfault.com/a/1190000040397253
 * author: echeverra
 */

/** 循环器回调 type
 * 会在循环到达时触发. 参数是当前循环次数, 返回false将停止循环.
 */
export type IntervalCallbackType = (intervalIndex: number) => undefined | boolean;

/** 循环器配置 type */
export type IntervalOptionsType = {
  /** 时间间隔，默认1000ms */
  duration?: number;
  /** timeout 更新时会触发此事件
   * @param {number} timeoutKey timeout的key，可在定时器外部销毁定时器
   */
  onTimeoutChange?: (timeoutKey: number) => void;
};

/**
 * 不丢帧并修复了timeout误差的循环器
 * @param {function} callback 会在循环到达时触发. 参数是当前循环次数, 返回false将停止循环.
 * @param {object} options
 */
export function startInterval(callback: IntervalCallbackType, options?: IntervalOptionsType) {
  if (typeof callback !== 'function') {
    throw new Error("interval's callback must be function");
  }
  /* 倒计时任务执行次数 用来计算误差 */
  let countIndex = 1;
  /* 时间间隔1秒 */
  const timeout = (options && Number(options.duration)) || 1000;
  /* 计算误差用的倒计时开始时间 */
  const startTime = new Date().getTime();
  /** 记录timeout的返回值, 控制终止循环 */
  let timeoutKey = -1;

  countdown(timeout);

  /** 倒计时循环器，只负责循环，不操作内容 */
  function countdown(interval) {
    timeoutKey = setTimeout(function () {
      /* 计算误差用的倒计时当前时间 */
      const endTime = new Date().getTime();

      //误差
      const deviation = endTime - (startTime + countIndex * timeout);
      countIndex++;

      if (callback(countIndex) === false) {
        clearTimeout(timeoutKey);
        return;
      }
      //执行下一次倒计时，去除误差的影响
      countdown(timeout - deviation);
    }, interval);
  }
  options && typeof options.onTimeoutChange === 'function' && options.onTimeoutChange(timeoutKey);
}
