# 接口相关内容转ts

增加更多工具请使用模板 template.js

- helpers 公共方法（字段类型归一化 normalizeType、枚举注释解析 parseEnumComment、错误类型 ConvertError），需最先引用
- tablePaste2Type 从YApi页面上直接复制的接口参数转ts接口
- parseComments 解析枚举类型的接口注释, 输出格式化后的注释及ts枚举
- json2Type 尝试根据接口返回的json分析ts的类型
- docExcel2Type 将接口文档复制到excel后再解析的初代转换工具
- commets2Enum 单纯的注释转枚举
- enum2Comment 单纯的枚举转格式化后的注释
- comments2ObjEnum 注释转对象类型的枚举 并附带注释

如果使用了template.js中的规范, 在index.html中引用即可使用（helpers.js 需放在最前面）
