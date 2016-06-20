
# RMD

RMD 是一个开源的、使用 React 构建的 Markdown 编辑器。

### 特性

- 完整的Markdown语法支持
- 即时预览
- 代码语法高亮
- Emoji 支持
- LaTeX 公式支持
- 流程图、时序图支持
- TODO List 支持

### 技术栈

- [React](https://github.com/facebook/react) - 构建界面
- [Redux](https://github.com/rackt/redux) - 代码组织方式
- [Ace](https://github.com/ajaxorg/ace) - 编辑器
- [marked](https://github.com/chjj/marked) - Markdown 解析引擎
- [Mathjax](https://github.com/mathjax/MathJax) - 公式解析引擎
- [mermaid](https://github.com/knsv/mermaid) - 流程图、时序图解析引擎
- [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) - 预览样式

### 开发

```
$ git clone https://github.com/progrape/rmd.git
$ cd rmd
$ npm install
$ npm start
```

### TODO

- [ ] 改进同步滚动
- [ ] FontAwesome 图标
- [x] Emoji支持
- [x] 全屏编辑
- [ ] 更换主题风格
- [x] 导出`md`
- [x] 导出`html`
- [ ] 导出`pdf`
- [ ] 持久化保存数据

### License

The MIT License(http://opensource.org/licenses/MIT) 

请自由地享受和参与开源