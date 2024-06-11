/**
 * 防抖
 * @param {Function} callback
 * @param {Obejct} options 包含两个参数, wait: 等待时间; leading: true: 触发后立即调用; false: 触发后等待时间后调用
 * @returns 返回可被调用的函数
 */
export function debounce(
  func,
  options: {
    wait?: number;
    leading?: boolean;
  } = {
    wait: 300,
    leading: false,
  }
) {
  let timer: number | undefined = undefined;
  return function anonymoous(...params) {
    let now = options.leading && !timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      !options.leading ? func.call(this, ...params) : null;
    }, options.wait);
    now ? func.call(this, ...params) : null;
  };
}

/**
 * 节流
 * @param {Function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 */
export function throttle(func, wait = 300) {
  if (typeof func !== 'function') throw new TypeError('Func must be a function');
  let timer: number | undefined = undefined,
    previous = 0;
  return function proxy(...params) {
    let now = Number(new Date()),
      self = this,
      remain = wait - (now - previous);
    if (remain <= 0) {
      clearTimeout(timer);
      timer = undefined;
      previous = now;
      func.call(self, ...params);
    } else if (!timer) {
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = undefined;
        previous = Number(new Date());
        func.call(self, ...params);
      }, remain);
    }
  };
}

export default { debounce, throttle };
