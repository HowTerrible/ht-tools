# 文件上传插件

文件夹中的js文件均由对应ts文件生成.

此插件的开发目的是为了替换项目中的 plupload 插件，故 api 主要参考自 plupload。

如需要预览，请先下载依赖，再使用 node 启动此目录下的 server.ts 文件，由于 demo 中的相对路径的原因，直接预览 server 中的 html 部分操作将无效。(由于懒，暂不支持自动重启)

工程中的 js 文件是为了直接在浏览器中运行而手动生成的。

此插件主要分为两个部分

- core.ts
  核心代码实现了如下功能

  1. 基础的文件上传功能
  2. 将封装后的文件及其他参数放入 FormData 中
  3. 设置文件的上传状态
  4. 设置文件的进度（虚拟进度）

初始化时需要自行设置上传方法
需要自行提供input:file, 并在其change回调中使用此方法
使用案例参见 ./server/core.html

  提供如下回调：

     - SetUploadFileCallback 上传文件（必须回调）
           由于核心代码不封装 ajax，需要回调调用，同时应注意上传需要设置如下

       - 请求超时时间设为无限
       - headers 设置{ "content-type": "multipart/form-data" }

     - onFileStatusChanged 文件状态变化时
     - onFileUploaded 文件上传完成时
     - onFilePercentChanged 文件百分比变化时
     - onFileUploadError 文件上传出错时

- file-uploader.ts
  继承自上面的核心代码

支持input:type控件封装, 不需要绑定其onchange事件. 只需要在初始化的时候传入其id或dom元素即可.

使用案例参见 ./server/file-uploader.html

    支持
    - 多文件上传
    - 文件上传百分比进度

    在核心的基础上增加了如下回调：

    - BeforeUploaderDisplay 文件上传弹窗打开前
    - onBeforeFileAdd 文件添加到上传队列前
    - onFilesAdded 文件添加到上传队列后
    - onAllFileUpload 全部文件上传完毕时
