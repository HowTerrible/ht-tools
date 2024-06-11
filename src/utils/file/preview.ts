import { FileTypeEnum, GetFileType, HandleOpenNewWindow } from '.';

/**
 * 判断文件是否允许预览
 * 目前仅支持 图片、pdf、视频、音频、Doc
 * @param fileName
 * @returns
 */
export const CanFilePreview = (fileName: string): boolean => {
  const fileType = GetFileType(fileName);
  return (
    fileType === FileTypeEnum.IMAGE ||
    fileType === FileTypeEnum.PDF ||
    fileType === FileTypeEnum.VIDEO ||
    fileType === FileTypeEnum.AUDIO ||
    fileType === FileTypeEnum.DOC
  );
};
/**
 * 通过Base64浏览PDF
 * @param base64
 */
export const PreviewFile_PDF_Base64 = (base64: string) => {
  const fileStr = `<iframe  src="data:application/pdf;base64,${decodeURI(
    base64
  )}" width="100%" height="100%" type="application/pdf"></iframe>`;
  const str = `<!DOCTYPE html><html style='height: 100%; margin: 0; padding: 0'>
    <body style='height: 100%; margin: 0; padding: 0'>
      ${fileStr}
      </body>
      </html>`;
  const a = window.open('') as any;
  a.document.write(str);
};
/**
 * 通过文件地址浏览PDF
 * @param url
 */
export const PreviewFile_PDF_Url = (url: string) => {
  HandleOpenNewWindow(url);
};
/**
 * 普通文件预览
 * 普通是区别于pdf
 * @param fileUrl 要预览的文件对象地址
 * @param fileType 要预览的文件对象类型
 */
export const PreviewFile_Url = (fileUrl: string, fileName: string) => {
  let dom = '';
  const fileType = GetFileType(fileName);
  switch (fileType) {
    case FileTypeEnum.IMAGE:
      dom = `<img src="${fileUrl}" />`;
      break;
    case FileTypeEnum.VIDEO:
      dom = `<video id="media" controls  width="600px" height="600px" src="${fileUrl}"></video>`;
      break;
    case FileTypeEnum.PDF:
      dom = `
        <object data="${fileUrl}" type="application/pdf" width="100%" height="100%">
          <p><b>返回内容</b>: 该浏览器不支持PDF. 请点击查看:
          <a href="${fileUrl}">下载PDF文件</a>.</p>
        </object>
        `;
      break;
    case FileTypeEnum.AUDIO:
      dom =
        '<audio controls="controls" src="' + fileUrl + '">您的浏览器不支持 audio 标签。</audio>';
      break;
  }
  const document = `<!DOCTYPE html>
    <html style='height: 100%; margin: 0; padding: 0'>
      <body style='height: 100%; margin: 0; padding: 0'>
        ${dom}
      </body>
    </html>
    `;
  const a = HandleOpenNewWindow('');
  if (a.success) a.window.document.write(document);
};
