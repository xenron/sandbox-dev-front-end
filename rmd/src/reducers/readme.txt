# RMD
RMD 是一个开源的、使用 React 构建的 Markdown 编辑器:smile:。

### 特性
- 完整的 Markdown 语法支持
- 即时预览
- 代码语法高亮
- Emoji 支持
- LaTeX 公式支持
- 流程图、甘特图、时序图支持
- TODO List 支持

### 技术栈
- [React](https://github.com/facebook/react) - 构建界面
- [Redux](https://github.com/rackt/redux) - 代码组织方式
- [Ace](https://github.com/ajaxorg/ace) - 编辑器
- [marked](https://github.com/chjj/marked) - Markdown 解析引擎
- [Mathjax](https://github.com/mathjax/MathJax) - 公式解析引擎
- [mermaid](https://github.com/knsv/mermaid) - 流程图、甘特图、时序图解析引擎
- [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) - 预览样式

### 代码
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render((
    <App/>
), document.getElementById('root'));
```

### emoji

支持插入 emoji :joy:，支持的 emoji 详见 http://www.emoji-cheat-sheet.com/

### 公式
$$2H_2 + O_2 = 2H_2O$$

### 流程图
```mermaid
graph LR;
    A --> B
    B --> C
    B --> D
    C --> E
    D --> E
```

### 甘特图
```mermaid
gantt
    dateFormat  YYYY-MM-DD
    title Adding GANTT diagram functionality to mermaid
    section A section
    Completed task            :done,    des1, 2014-01-06,2014-01-08
    Active task               :active,  des2, 2014-01-09, 3d
    Future task               :         des3, after des2, 5d
    Future task2               :         des4, after des3, 5d
    section Critical tasks
    Completed task in the critical line :crit, done, 2014-01-06,24h
    Implement parser and jison          :crit, done, after des1, 2d
    Create tests for parser             :crit, active, 3d
    Future task in critical line        :crit, 5d
    Create tests for renderer           :2d
    Add to mermaid                      :1d
```

### 时序图
```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
```

流程图、甘特图、时序图详细语法参考 http://knsv.github.io/mermaid/

### TODO List

- [ ] 改进同步滚动
- [ ] FontAwesome 图标
- [x] Emoji支持
- [x] 全屏编辑
- [ ] 更换主题风格
- [x] 导出`md`
- [x] 导出`html`
- [ ] 导出`pdf`
- [ ] 持久化保存数据

### 表格
|文字|日期|数字|
|-----|:-----:|-----:|
|rmd|2016-01-08|20|

### License

The MIT License(http://opensource.org/licenses/MIT)

请自由地享受和参与开源