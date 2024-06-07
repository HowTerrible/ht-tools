const hiddenTelRegexp = /^(\d{3})\d{4}(\d{4})$/;

/**
 * 隐藏手机中间四位
 * @param tel 11位手机号码
 * @returns 
 */
export const Hide4DigitsOfPhoneNum = (tel: string) => {
  return tel.replace(hiddenTelRegexp, '$1****$2');
};
