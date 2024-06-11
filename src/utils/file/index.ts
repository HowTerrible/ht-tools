import { debounce } from '../';
export * from './download';
export * from './preview';

/**
 * 字节大小转换成展示用的文本
 * 参数如果不是数字将返回空字符串
 * @param(Number) bytes
 * @returns(String) 转换后的文本
 */
export const ByteNumConvert2DisplayText = function (bytes: number): string {
  if (isNaN(bytes)) return '';

  const symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  const base = 1024; // 每个单位的基数
  const exp = Math.floor(Math.log(bytes) / Math.log(base)); // 计算指数
  const convertedValue = bytes / Math.pow(base, exp); // 转换值

  return convertedValue.toFixed(2) + ' ' + symbols[exp];
};


declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

/**
 * 获取文件扩展名
 * @param {string} fileName 文件名
 * @returns {string} 扩展名
 */
export const GetFileExt = (fileName: string) => {
  return fileName.substring(fileName.lastIndexOf('.') + 1);
};

//#region 文件常见扩展名 用来判断文件类型
const imageArr: string[] = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'tiff'];
const videoArr: string[] = ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'];
const audioArr: string[] = ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'];
const xlsArr: string[] = ['xls', 'xlsx'];
const pptArr: string[] = ['ppt', 'pptx'];
const pdfArr: string[] = ['pdf'];
const docArr: string[] = ['doc', 'docx'];
const zipArr: string[] = ['zip', 'rar', 'jar', 'tar', 'gzip'];
const txtArr: string[] = ['txt'];
//#endregion

/** 文件类型映射 */
export enum FileTypeEnum {
  'IMAGE' = 'image',
  'VIDEO' = 'video',
  'EXCEL' = 'xls',
  'PPT' = 'ppt',
  'PDF' = 'pdf',
  'DOC' = 'doc',
  'AUDIO' = 'audio',
  'ZIP' = 'zip',
  'TXT' = 'txt',
}

/**
 * 根据文件名获得文件类型
 * @param name 文件名或文件全路径
 */
export const GetFileType: (name: string) => FileTypeEnum | '' = (name) => {
  if (!name) return '';

  const ext = GetFileExt(name);
  // eslint-disable-next-line no-irregular-whitespace
  if (imageArr.indexOf(ext.toLowerCase()) !== -1) {
    return FileTypeEnum.IMAGE;
  } else if (videoArr.indexOf(ext.toLowerCase()) !== -1) {
    return FileTypeEnum.VIDEO;
  } else if (xlsArr.indexOf(ext.toLowerCase()) !== -1) {
    return FileTypeEnum.EXCEL;
  } else if (pptArr.indexOf(ext.toLowerCase()) !== -1) {
    return FileTypeEnum.PPT;
  } else if (pdfArr.indexOf(ext.toLowerCase()) !== -1) {
    return FileTypeEnum.PDF;
  } else if (docArr.indexOf(ext.toLowerCase()) !== -1) {
    return FileTypeEnum.DOC;
  } else if (audioArr.indexOf(ext.toLowerCase()) !== -1) {
    return FileTypeEnum.AUDIO;
  } else if (zipArr.indexOf(ext.toLowerCase()) !== -1) {
    return FileTypeEnum.ZIP;
  } else if (txtArr.indexOf(ext.toLowerCase()) !== -1) {
    return FileTypeEnum.TXT;
  } else {
    return '';
  }
};

/** 文件过滤器类型 */
export type FileFilterType = {
  title: string;
  extensions: string;
};

/**
 * 文件上传过滤器
 * 用上传文件的mime校验
 * 如需增加更多的格式，需要和后端沟通
 */
export const FileFilterMap: Record<FileTypeEnum, FileFilterType> = {
  [FileTypeEnum.IMAGE]: {
    title: 'Image files',
    extensions: 'png,jpg,jpeg,bmp',
    // extensions: "png,jpg,jpeg,bmp,gif,webp,psd,svg,tiff"
  },
  [FileTypeEnum.VIDEO]: {
    title: 'Video files',
    extensions: 'mp4,rmvb,avi,mkv,flv,swf,m3u8',
    // extensions: "mp4,m3u8,rmvb,avi,swf,3gp,mkv,flv"
  },
  [FileTypeEnum.AUDIO]: {
    title: 'Audio files',
    extensions: 'mp3,wav,wma,ogg',
    // extensions: "mp3,wav,wma,ogg,aac,flac"
  },
  [FileTypeEnum.EXCEL]: {
    title: 'xls files',
    extensions: 'xls,xlsx',
  },
  [FileTypeEnum.PPT]: {
    title: 'ppt files',
    extensions: 'ppt,pptx',
  },
  [FileTypeEnum.PDF]: {
    title: 'pdf files',
    extensions: 'pdf',
  },
  [FileTypeEnum.DOC]: {
    title: 'doc files',
    extensions: 'doc,docx',
  },
  [FileTypeEnum.ZIP]: {
    title: 'zip files',
    // extensions: "zip,rar,jar,tar,gzip"
    extensions: 'zip,rar,7z',
  },
  [FileTypeEnum.TXT]: {
    title: 'text files',
    extensions: 'txt,csv',
  },
};

/**
 * 获得浏览器api需要的文件过滤器
 * 仅为逻辑封装.
 * 如果传入了过滤器, 则返回过滤器传入值; 如果未传入过滤器, 则返回默认的
 * @param filters 用户配置的过滤器, 如果未配置将使用 全部过滤器
 * @returns
 */
function GetFileFilters(filters?: FileFilterType[]): FileFilterType[] {
  let result; // 没有设置过滤器，就用默认的
  if (!filters || filters.length === 0) {
    result = Object.values(FileFilterMap);
  } else {
    result = filters;
  }
  return result;
}

/**
 * 生成浏览器api的accept
 * @param options filters: 过滤器; fileTypes: 文件类型. 两个属性只能穿一个. 如果不传则会返回包含所有文件类型的accept
 * @returns
 */
export function GenerateFileAccept(
  options?:
    | {
        filters: FileFilterType[];
        fileTypes: undefined;
      }
    | {
        filters: undefined;
        fileTypes: FileTypeEnum[];
      }
) {
  let accept = '',
    filters: FileFilterType[] = [];

  if (!options) {
    filters = GetFileFilters();
  } else {
    if (options.filters) {
      filters = GetFileFilters(options.filters);
    } else if (options.fileTypes) {
      filters = GetFileFilters(options.fileTypes.map((item) => FileFilterMap[item]));
    }
  }

  accept = filters.reduce((prev, cur) => {
    const curExt = cur.extensions
      .split(',')
      .map((item) => `.${item}`)
      .join(',');
    return prev ? `${prev},${curExt}` : `${curExt}`;
  }, '');
  return accept;
}

//#region 打开弹窗
/** 设置默认的弹出浏览器窗口失败消息 */
export function SetDefaultOpenWindowFailedMsg(msg: string) {
  Message_OpenWindowFailed = msg;
}

/** 打开弹窗失败的消息
 * 您下载的文件被浏览器或者插件拦截，请在浏览器中添加信任后重新下载
 */
export let Message_OpenWindowFailed =
  'The file you try to download has been blocked by browser or plugins. please add trust in your browser before downlaod.';

  /**
   * 设置默认的打开窗口失败时的消息提示器
   * @param messager 消息提示器
   */
export function SetOpenWindowFailedMessager(messager: Function) {
  if (type messager !== 'function') {
    console.log("Messager must be a Function")
  }
  defaultMessager = messager;
}

let defaultMessager: Function = console.error;

/** 通知打开弹窗失败 */
const notifyDownloadFailed = debounce(
  () => {
    defaultMessager.call(this, Message_OpenWindowFailed, 0);
  },
  100000,
  { leading: true }
);

/** 新窗口打开状态 枚举
 * 0|undefined: 打开成功; 1: 浏览器拦截; 2: 打开时报错(可能是插件拦截)
 */
export enum OpenWindowStatusEnum {
  success = 0,
  browserBlock = 1,
  error = 2,
}

/**
 * 打开新页面可能会被浏览器拦截，统一在此处理
 * @param url 打开窗口的地址
 * @returns {success, window}
 * success 成功与被拦截状态。0：成功，1：浏览器拦截，2：插件拦截
 * window 新打开的window对象
 */
export const HandleOpenNewWindow = (url = ''): OpenWindowType => {
  let temp: OpenWindowType = {
    success: false,
    window: null,
    status: OpenWindowStatusEnum.error,
  };
  try {
    const openedWindow = window.open(url || '');
    if (openedWindow) {
      temp = {
        success: true,
        window: openedWindow,
      };
    } else {
      temp.success = false;
      temp.status = OpenWindowStatusEnum.browserBlock;
      notifyDownloadFailed();
    }
  } catch (ex) {
    // window.open 报错有可能是被插件拦截
    temp.success = false;
    temp.status = OpenWindowStatusEnum.error;
    notifyDownloadFailed();
  }
  return temp;
};

export type OpenWindowType =
  // 成功打开window的情况下，可以没有status
  | { success: true; window: Window; status?: OpenWindowStatusEnum.success }
  | {
      success: false;
      window: null;
      status: OpenWindowStatusEnum.browserBlock | OpenWindowStatusEnum.error;
    };

//#endregion
