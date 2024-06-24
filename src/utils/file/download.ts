/**
 * 下载相关工具
 * 文件类型建议使用三方库mime
 */
import { HandleOpenNewWindow } from '.';

export type DownloadOptionsType = {
  /** 是否使用新窗口下载 */
  downloadWithNewWindow?: boolean;
  /** 下载后关闭新窗口, 仅在[downloadWithNewWindow]为true时启用 */
  closeAfterDownload?: boolean;
  /** 下载后等待多长时间关闭新窗口, 仅在[downloadWithNewWindow]和[closeAfterDownload]都为true时启用, 缺省值1000ms */
  closeDuration?: number;
};

function downloadFileBlobByUrl(
  url: string,
  fileName: string,
  fileMime: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  options: DownloadOptionsType
) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    var file = new Blob([xhr.response], {
      type: fileMime,
    });
    DownloadFile_Blob(file, fileName, fileMime, options);
  };
  xhr.onerror = function () {
    console.error('could not download file');
  };
  xhr.send();
}

/**
 * 文件下载
 * @param file 要下载的文件对象 包括文件名和文件url
 * @param closeAfterDownload 是否在下载完成后关闭新窗口
 * @returns
 */
export const DownloadFile_Url = (
  fileUrl: string,
  fileName: string,
  fileMime: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  options: DownloadOptionsType
) => {
  downloadFileBlobByUrl(fileUrl, fileName, fileMime, options);
};

/**
 * 下载blob格式文件
 * @param data blob
 * @param fileName 文件名
 * @param mime 文件mime
 * @param closeAfterDownload 是否在下载完成后关闭新窗口
 * @returns
 */
export const DownloadFile_Blob = (
  data: any,
  fileName: string,
  fileMime: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  options: DownloadOptionsType
) => {
  if (!data) return;

  let blob;
  /** 如果返回的是blob格式, 直接使用
   * 如果不是blob格式, 可能是字节流字符串, 需要转成blob
   */
  if (Object.prototype.toString.call(data) === '[object Blob]') {
    blob = data;
  } else {
    blob = new Blob([data], { type: fileMime });
  }

  /** 默认使用当前页面的window */
  let newWindow: Window = window;
  if (options && options.downloadWithNewWindow) {
    const temp = HandleOpenNewWindow();
    if (!temp.success) return temp;
    /** 如果新窗口打开失败, 返回打开结果 */
    newWindow = temp.window;
  }
  const document = newWindow.document;

  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a');
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('click');
    elink.download = fileName; //+ ".xlsx";
    elink.href = URL.createObjectURL(blob);
    // elink.dispatchEvent(evt);
    elink.style.display = 'none';
    elink.click();
    (newWindow as any).URL.revokeObjectURL(elink.href); // 释放URL 对象
    if (options && options.downloadWithNewWindow && options.closeAfterDownload) {
      setTimeout(() => {
        newWindow.close();
      }, (options && options.downloadWithNewWindow && options.closeAfterDownload && options.closeDuration) || 1000);
    }
  } else {
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    }
  }
};

export default { DownloadFile_Blob, DownloadFile_Url };
