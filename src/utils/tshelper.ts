export type EnumType<K> = { [propName: string]: K };

/** 默认的组装结果 type */
export type CommonOptionsType<K> = {
  /** 选项label */
  label: string;
  /** 选项值 */
  value: K;
  /** 选项禁用 */
  disabled?: boolean;
}[];

/** 转换器选项 type */
export type ConvertOptionsType<K> = {
  /** 需要排除的项目, 值为枚举键的数组 */
  exclude?: Array<string>;
  /** 选项文本替换, 值为对象, 其中键为原文本, 值为替换后文本 */
  labelConvert?: { [label: string]: string };
  /** 需要禁用的选项的键, 值为枚举键的数组 */
  disabledValues?: Array<string | number>;
};

// #region 枚举转数组
/** 枚举转选项
 * 此方法处理了参数options中的配置, 并返回转换后的选项
 */
const EnumToOptionsCore = <T extends EnumType<K>, K extends number | string>(
  enumType: T,
  /** 枚举中的key, 主要是过滤了数字枚举的数字键 */
  filteredKeys: Array<string>,
  options?: ConvertOptionsType<K>
): CommonOptionsType<K> => {
  let tempKeys = filteredKeys;
  /** 第二步
   * 如果设置了排除项,则过滤掉排除项
   */
  if (options && options.exclude && options.exclude.length) {
    tempKeys = tempKeys.filter((key) => !options.exclude?.includes(key));
  }

  let disabledValues: Array<string | number> | null = null,
    needConvert: { [label: string]: string } = {};

  if (options) {
    disabledValues =
      options.disabledValues && options.disabledValues.length ? options.disabledValues : null;
    needConvert = options.labelConvert || {};
  }

  return tempKeys.map((item) => {
    return {
      label: needConvert[item] ? needConvert[item] : item,
      value: enumType[item],
      disabled: disabledValues ? Boolean(disabledValues.indexOf(enumType[item]) >= 0) : false,
    };
  });
};

/** 枚举转成选项数组
 * 和下面的版本相比仅少了一行对数字的过滤
 * @param enumType 必须 需要被转换的枚举
 * @param options 非必须 额外选项
 * @returns
 */
export const EnumToOptions = <T extends EnumType<K>, K extends string>(
  enumType: T,
  options?: ConvertOptionsType<K>
): CommonOptionsType<K> => {
  let filteredKeys = Object.keys(enumType);

  return EnumToOptionsCore<T, K>(enumType, filteredKeys, options);
};

/** value是数字类型的枚举 转成选项数组
 * @param enumType 必须 需要被转换的枚举
 * @param options 非必须 额外选项
 * @returns
 */
export const NumEnumToOptions = <T extends EnumType<K>, K extends number | string>(
  enumType: T,
  options?: ConvertOptionsType<K>
): CommonOptionsType<K> => {
  /** 第一步
   * 获取枚举的键构成的数组,
   * 并过滤掉键为数字的内容
   */
  let filteredKeys = Object.keys(enumType).filter((key) => isNaN(Number(key)));

  return EnumToOptionsCore<T, K>(enumType, filteredKeys, options);
};
//#endregion 枚举转数组
