import { HandleOpenNewWindow } from '.';

function downloadFileBlobByUrl(
  url: string,
  fileName: string,
  fileMime: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  closeAfterDownload: boolean = true
) {
  var oReq = new XMLHttpRequest();
  oReq.open('GET', url, true);
  oReq.responseType = 'blob';
  oReq.onload = function () {
    var file = new Blob([oReq.response], {
      type: fileMime,
    });
    DownloadFile_Blob(file, fileName, fileMime, closeAfterDownload);
  };
  oReq.send();
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
  closeAfterDownload: boolean = true
) => {
  downloadFileBlobByUrl(fileUrl, fileName, fileMime, closeAfterDownload);
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
  closeAfterDownload: boolean = true
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

  const temp = HandleOpenNewWindow();
  if (!temp.success) return temp;
  /** 如果新窗口打开失败, 返回打开结果 */
  const newWindow = temp.window;
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
    if (closeAfterDownload) {
      setTimeout(() => {
        newWindow.close();
      }, 1000);
    }
  } else {
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    }
  }
};

export default { DownloadFile_Blob, DownloadFile_Url };
