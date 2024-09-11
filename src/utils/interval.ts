/**
 * 基于setTimeout的不丢帧并修复了timeout误差的循环器
 * reference: https://segmentfault.com/a/1190000040397253
 * author: echeverra
 *
 * reference: https://segmentfault.com/a/1190000041208181
 * author: wxp686
 */

/** 循环器回调 type
 * 会在循环到达时触发. 参数是当前循环次数, 返回false将停止循环.
 */
export type IntervalCallbackType = (
  // 当前循环次数, 从1开始
  intervalIndex: number
) => undefined | boolean;

/**
 * 不丢帧并修复了timeout误差的循环器
 * 此方法返回一个停止方法, 调用此方法可终止循环
 * 第一个参数callback如果返回false, 也将停止循环
 * @param {function} callback 会在循环到达时触发. 参数是当前循环次数, 返回false将停止循环.
 * @param {duration} duration 循环器间隔时间, 默认1000
 * @returns {function} stopper 停止定时器方法
 */
export function StartInterval(callback: IntervalCallbackType, duration = 1000) {
  if (typeof callback !== 'function') {
    throw new Error("interval's callback must be function");
  }

  /* 时间间隔1秒 */
  let timeout = 1000;
  if (duration && Number(duration)) {
    timeout = Number(duration);
  } else {
    console.log('Duration is not a number. Will reset to 1000');
  }

  /* 倒计时任务执行次数 用来计算误差 */
  let countIndex = 1;
  /* 计算误差用的倒计时开始时间 */
  const startTime = new Date().getTime();
  /** 记录timeout的返回值, 控制终止循环 */
  let timeoutKey: any = -1;

  let stopFlag = false;
  /** 循环停止方法, 将被此方法返回 */
  function stopper() {
    stopFlag = true;
  }

  /** 倒计时循环器, 只负责循环, 不操作内容 */
  function countdown(interval: number) {
    timeoutKey = setTimeout(function () {
      /* 计算误差用的倒计时当前时间 */
      const endTime = new Date().getTime();

      //误差
      const deviation = endTime - (startTime + countIndex * timeout);

      if (stopFlag || callback(countIndex) === false) {
        clearTimeout(timeoutKey);
        return;
      }
      countIndex++;

      //执行下一次倒计时, 去除误差的影响
      countdown(timeout - deviation);
    }, interval);
  }

  countdown(timeout);

  return stopper;
}
