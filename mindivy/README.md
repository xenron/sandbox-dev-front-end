mindivy
=======

一个纯 JavaScript / HTML5 实现的思维导图编辑器 <br/>
如果问什么是思维导图的话。。一般来说用过 mindmanager 的朋友就知道。<br/>
如果不知道的话可以去搜索引擎找找介绍。算是比较有用的知识工具。


#### 开发进展

###### 2014.9.30

- 完成了基本的节点选择，文字编辑事件处理
- 完成了基本的节点布局算法

###### 2014.10.1

- 优化了文字编辑时的输入体验
- 优化了节点布局算法

#### js 库依赖

- sea.js <br/>
  http://seajs.org/docs/ <br/>
  用于组织 js 代码

- state-machine.js <br/>
  https://github.com/jakesgordon/javascript-state-machine <br/>
  有限状态机

- jquery-drag.js <br/>
  https://github.com/cloudcome/jquery-drag
  拖拽

- http://coffeescript.org/extras/coffee-script.js

- http://code.jquery.com/jquery-2.1.1.min.js

#### run
ruby -run -e httpd . -p 4000
