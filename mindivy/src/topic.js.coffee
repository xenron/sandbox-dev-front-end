class ImageDialog
  constructor: (@topic)->
    @img_url = @topic.img_url

  render: ->
    @$overlay = jQuery '<div>'
      .addClass 'image-dialog-overlay'
      .appendTo @topic.mindmap.$el

    @$dialog = jQuery '<div>'
      .addClass 'image-dialog'
      .appendTo @topic.mindmap.$el


    $ops = jQuery '<div>'
      .addClass 'image-dialog-ops'
      .appendTo @$dialog


    @$ok = jQuery '<div>'
      .addClass 'btn ok'
      .html '确定'
      .appendTo $ops

    @$cancel = jQuery '<div>'
      .addClass 'btn cancel'
      .html '取消'
      .appendTo $ops


    @$delete = jQuery '<div>'
      .addClass 'btn delete'
      .html '删除图片'
      .appendTo $ops


    @$url_ipter = jQuery '<input>'
      .attr 'type', 'text'
      .attr 'placeholder', '输入图片 URL'
      .addClass 'url-ipter'
      .appendTo @$dialog

    @$image_loading_area = jQuery '<div>'
      .addClass 'image-loading-area'
      .appendTo @$dialog

    if @img_url
      @$url_ipter.val @img_url
      @_show_img @img_url

    @bind_events()

  bind_events: ->
    @$overlay.on 'click', (evt)=>
      @destroy()

    @$cancel.on 'click', (evt)=>
      @destroy()

    @$url_ipter.on 'input', (evt)=>
      url = @$url_ipter.val()
      @_show_img url

    @$ok.on 'click', (evt)=>
      url = @$url_ipter.val()
      @topic.set_image_url url
      @destroy()

    @$delete.on 'click', (evt)=>
      @topic.set_image_url null
      @destroy()

  destroy: ->
    @$overlay.remove()
    @$dialog.remove()

  _show_img: (url)->
    @$image_loading_area
      .css 'background-image', "url(#{url})"


class TextInputer
  constructor: (@topic)->
    @$topic_text = @topic.$text
    @render()

  render: ->
    # 此区域用来给 textarea 提供背景色
    @$textarea_box = jQuery '<div>'
      .addClass 'text-ipter-box'
      .css
        'left': 0
        'bottom': 0
      .appendTo @topic.$el

    # 复制一个 text dom 用来计算高度
    @$text_measure = @$topic_text.clone()
      .css 
        'position': 'absolute'
        'display': 'none'
      .appendTo @$textarea_box

    # textarea 左下角固定
    @$textarea = jQuery '<textarea>'
      .addClass 'text-ipter'
      .css
        'left': 0
        'bottom': 0
      .val @topic.text
      .appendTo @$textarea_box
      .select()
      .focus()

    @_copy_text_size()
    return @

  # 获取 textarea 中的值，并进行必要的转换
  text: ->
    # 把末尾的换行符添加一个空格，以便于 pre 自适应高度
    @$textarea.val().replace /\n$/, "\n "

  destroy: ->
    @$textarea_box.remove()

  _adjust_text_ipter_size: ->
    setTimeout =>
      @$text_measure.text @text()
      @_copy_text_size()

  # 将 text pre dom 的宽高复制给 textarea 和它的外框容器
  _copy_text_size: ->
    [w, h] = [@$text_measure.width(), @$text_measure.height()]

    # 记录初始宽高值，使得编辑节点内容时，编辑框的宽高不会小于初始值
    # 目前不确定是否需要这个体验特性，先注释掉
    # if not @$textarea_box.data 'origin-width'
    #   @$textarea_box.data 'origin-width', w
    #   @$textarea_box.data 'origin-height', h
    # else
    #   w = Math.max w, @$textarea_box.data 'origin-width'
    #   h = Math.max h, @$textarea_box.data 'origin-height'

    @$textarea_box.css
      'width':  w
      'height': h

    @$textarea.css
      'width':  w
      'height': h

  # 响应键盘事件
  # 为了执行效率和节约内存，事件绑定使用全局的 delegate
  handle_keydown: (evt)->
    # 停止冒泡，防止触发全局快捷键
    evt.stopPropagation()
    
    # 调整 textarea 大小
    @_adjust_text_ipter_size()

    if evt.keyCode is 13 and not evt.shiftKey
      # 按下回车时，结束编辑，保存当前文字，阻止原始的回车事件
      evt.preventDefault()
      @topic.fsm.stop_edit()
    else
      # 按下 shift + 回车时，换行
      # do nothing 执行 textarea 原始事件


ModuleTopicNav =
  # 判断是否是根节点
  is_root: ->
    return @depth is 0

  # 获取当前节点的下一个同级节点，如果没有的话，返回 null
  next: ->
    return null if @is_root()

    if @depth is 1
      if @side is 'left'
        left_children = @parent.left_children()
        idx = left_children.indexOf @
        return left_children[idx + 1]

      if @side is 'right'
        right_children = @parent.right_children()
        idx = right_children.indexOf @
        return right_children[idx + 1]

    else
      idx = @parent.children.indexOf @
      return @parent.children[idx + 1]

  # 返回当前节点的上一个同级节点，如果没有的话，返回 null
  prev: ->
    return null if @is_root()

    if @depth is 1
      if @side is 'left'
        left_children = @parent.left_children()
        idx = left_children.indexOf @
        return left_children[idx - 1]

      if @side is 'right'
        right_children = @parent.right_children()
        idx = right_children.indexOf @
        return right_children[idx - 1]

    idx = @parent.children.indexOf @
    return @parent.children[idx - 1]

  # 找到同级的上一个节点，不管是不是同一个父节点
  # 需要结合节点的折叠状态来判断
  visible_prev: ->
    return null if @is_root()
    return @prev() if @prev()

    p = @parent
    while p = p.visible_prev()
      return p.last_child() if p.has_children() and p.is_opened()

    return null

  # 找到同级的下一个节点，不管是不是同一个父节点
  # 需要结合节点的折叠状态来判断
  visible_next: ->
    return null if @is_root()
    return @next() if @next()

    p = @parent
    while p = p.visible_next()
      return p.first_child() if p.has_children() and p.is_opened()

    return null

  # 第一个子节点，如果没有子节点，返回 null
  first_child: ->
    return @children[0]

  # 最后一个子节点，如果没有子节点，返回 null
  last_child: ->
    return @children[@children.length - 1]

  # 判断该子节点是否有子节点
  has_children: ->
    !!@children.length

  # 返回节点上的左侧子节点数组
  # 对右侧节点调用此方法时永远返回空
  left_children: ->
    return (child for child in @children when child.side is 'left')

  # 返回节点上的右侧子节点数组
  # 对左侧子节点调用此方法时永远返回空
  right_children: ->
    return (child for child in @children when child.side is 'right')

  # 对左侧子节点进行遍历操作
  left_children_each: (func)->
    i = 0
    for child in @children
      func(i++, child) if child.side is 'left'

  # 对右侧子节点进行遍历操作
  right_children_each: (func)->
    i = 0
    for child in @children
      func(i++, child) if child.side is 'right'

  # 对所有子节点进行遍历操作
  children_each: (func)->
    i = 0
    for child in @children
      func(i++, child)


  # 判断当前节点是否是传入的 topic 的祖先 
  is_ancestor_of: (topic)->
    p = topic
    while p
      return true if @ is p.parent
      p = p.parent

    return false


ModuleTopicState =
  is_opened: ->
    return true if @is_root()
    return @oc_fsm.is 'opened'

  is_closed: ->
    return false if @is_root()
    return @oc_fsm.is 'closed'


ModuleTopicDistance =
  # 和编辑区下边缘的距离
  distance_of_bottom: ->
    # 节点的 bottom
    bottom1 = @$el.offset().top + @layout_height
    # 编辑区域的 bottom
    bottom2 = @mindmap.$bottom_area.offset().top + @mindmap.$bottom_area.height()
    return bottom2 - bottom1


  # 和编辑区上边缘的距离
  distance_of_top: ->
    top1 = @$el.offset().top
    top2 = @mindmap.$bottom_area.offset().top
    return top1 - top2


  # 和编辑区左边缘的距离
  distance_of_left: ->
    left1 = @$el.offset().left
    left2 = @mindmap.$bottom_area.offset().left
    return left1 - left2

  # 和编辑区下边缘的距离
  distance_of_right: ->
    right1 = @$el.offset().left + @layout_width
    right2 = @mindmap.$bottom_area.offset().left + @mindmap.$bottom_area.width()
    return right2 - right1


class Area
  constructor: (@left, @right, @top, @bottom)->
    #.. .

  # 判断指定的坐标是否在当前区域内
  is_contain: (x, y)->
    if @left < x and x < @right and @top < y and y < @bottom
      return true

    return false


class Topic extends Module
  @include ModuleTopicNav
  @include ModuleTopicState
  @include ModuleTopicDistance

  @HASH: {}

  @ROOT_TOPIC_TEXT : 'Central Topic'
  @LV1_TOPIC_TEXT  : 'Main Topic'
  @LV2_TOPIC_TEXT  : 'Subtopic'

  @STATES: ['common', 'active', 'editing']

  # 创建根节点
  @generate_root: (mindmap)->
    root = new Topic @ROOT_TOPIC_TEXT, mindmap
    root.depth = 0
    @set root
    return root

  # 将指定节点存入 hash
  @set: (topic)->
    @HASH[topic.id] = topic

  @get: (id)->
    @HASH[id]

  @each: (func)->
    for id, topic of @HASH
      func(id, topic)

  constructor: (@text, @mindmap)->
    @init_fsm()
    @init_open_close_fsm()

    @id = Utils.generate_id()
    @children = []
  
  init_fsm: ->
    @fsm = StateMachine.create
      initial: 'common'
      events: [
        { name: 'select',   from: 'common', to: 'active'}
        { name: 'unselect', from: 'active', to: 'common'}

        { name: 'start_edit', from: 'active',  to: 'editing' }
        { name: 'stop_edit',  from: 'editing', to: 'active' }
      ]


    # 切换与退出选中状态
    @fsm.onbeforeselect = =>
      if @mindmap.active_topic and @mindmap.active_topic != @
        @mindmap.active_topic.handle_click_out()


      @mindmap.active_topic = @
      @$el.addClass('active')
      

      dt = @distance_of_top()
      db = @distance_of_bottom()
      dl = @distance_of_left()
      dr = @distance_of_right()

      # console.log "距离上：#{dt}"
      # console.log "距离下：#{db}"
      # console.log "距离左：#{dl}"
      # console.log "距离右：#{dr}"

      if dr < 0
        xmove = dr - 10

      if dl < 0
        xmove = - dl + 10

      if dt < 0
        ymove = - dt + 10

      if db < 0
        ymove = db - 10

      @mindmap.move(xmove, ymove)


    @fsm.onbeforeunselect = =>
      @mindmap.active_topic = null
      @$el.removeClass('active')


    # 切换与退出编辑状态
    @fsm.onenterediting = =>
      @mindmap.editing_topic = @
      @$el.addClass 'editing'
      @text_ipter = new TextInputer(@)


    @fsm.onleaveediting = =>
      @mindmap.editing_topic = null
      @$el.removeClass 'editing'

      @set_text @text_ipter.text()
      @text_ipter.destroy()
      delete @text_ipter
      @recalc_size()
      @mindmap.layout()


  init_open_close_fsm: ->
    @oc_fsm = StateMachine.create
      initial: 'opened'
      events: [
        { name: 'open',  from: 'closed', to: 'opened'}
        { name: 'close', from: 'opened', to: 'closed'}
      ]

    @oc_fsm.onenteropened = =>
      @$el.addClass 'opened'

    @oc_fsm.onleaveopened = =>
      @$el.removeClass 'opened' if @$el

    @oc_fsm.onenterclosed = =>
      @$el.addClass 'closed' if @$el

    @oc_fsm.onleaveclosed = =>
      @$el.removeClass 'closed'

    _open_r = (topic)=>
      for child in topic.children
        # child.$el.show()
        child.$el.removeClass 'closing'
        child.$el.css
          'opacity': 1
        
        continue if child.is_closed()
        child.$canvas.show() if child.$canvas
        _open_r child

    @oc_fsm.onbeforeopen = =>
      # console.log '展开子节点'
      @$canvas.show()
      _open_r @

    _close_r = (topic)=>
      for child in topic.children
        # child.$el.hide()
        child.$el.addClass 'closing'
        child.$el.css
          'opacity': 0
          'left': @layout_left
          'top': @layout_top


        # 当节点被折叠时，解除 active 状态
        child.fsm.stop_edit() if child.fsm.can 'stop_edit'
        child.fsm.unselect() if child.fsm.can 'unselect'

        continue if child.is_closed()
        child.$canvas.hide() if child.$canvas
        _close_r child

    @oc_fsm.onbeforeclose = =>
      # console.log '折叠子节点'
      @$canvas.hide() if @$canvas
      _close_r @


  # 设置节点文字
  set_text: (text)->
    @$text.text text
    @text = text


   # 输入文字的同时动态调整 textarea 的大小
  adjust_text_ipter_size: ->
    @text_ipter._adjust_text_ipter_size()


  # 闪烁动画
  flash_animate: ->
    @$el
      .addClass 'flash-highlight'

    setTimeout =>
      @$el.removeClass 'flash-highlight'
    , 500

    # 增加节点时，父节点显示 +1 效果
    $float_num = jQuery '<div>'
      .addClass 'float-num'
      .addClass 'plus'
      .html '+1'
      .appendTo @parent.$el

      .animate
        'top': '-=20'
        'opacity': '0'
      , 600, ->
        $float_num.remove()


  # 生成节点 dom 只会调用一次
  render: ->
    if not @rendered
      @rendered = true

      # 当前节点 dom
      @$el = jQuery '<div>'
        .addClass 'topic'
        .addClass 'opened'
        .data 'id', @id

      @$el.addClass 'root' if @is_root()

      # 节点上的图片
      @$image = jQuery '<div>'
        .addClass 'image'
        .appendTo @$el

      # 节点上的文字
      @$text = jQuery '<pre>'
        .addClass 'text'
        .text @text
        .appendTo @$el

      # 折叠展开的操作区域
      @$joint = jQuery '<div>'
        .addClass 'joint'
        .appendTo @$el

      @$el.appendTo @mindmap.$topics_area

      if @flash
        @flash_animate()

      if not @is_root()
        @bind_drag_event()

    # 根据折叠展开状态调整样式
    if not @is_root()
      if @is_closed()
        @$el.removeClass('opened').addClass('closed')
      else
        @$el.removeClass('closed').addClass('opened')

    # 标记叶子节点
    if @has_children()
      @$el.removeClass 'leaf'
    else
      @$el.addClass 'leaf'


    # 显示图片
    if @img_url
      @$el.addClass 'with-image'
      @$image.css 'background-image', "url(#{@img_url})"
    else
      @$el.removeClass 'with-image'


    # 根据节点是左侧节点还是右侧节点，给予相应的 className
    @$el.removeClass('left-side').removeClass('right-side')
    @$el.addClass('left-side')  if @side is 'left'
    @$el.addClass('right-side') if @side is 'right'


    # 重新计算尺寸
    @recalc_size()

    return @$el


  # 重新计算节点布局宽高
  recalc_size: ->
    @layout_width  = @$el.outerWidth()
    @layout_height = @$el.outerHeight()

  # 绑定拖拽事件
  bind_drag_event: ->
    @$el.drag 'start', (evt, dd)=>
      mindmap_offset = @mindmap.$topics_area.offset()
      mindmap_offsetX = mindmap_offset.left
      mindmap_offsetY = mindmap_offset.top

      offsetX = dd.offsetX
      offsetY = dd.offsetY

      startX = dd.startX
      startY = dd.startY

      @dom_beginX = offsetX - mindmap_offsetX
      @dom_beginY = offsetY - mindmap_offsetY

      @mouse_beginX = startX - mindmap_offsetX
      @mouse_beginY = startY - mindmap_offsetY

      # console.log @dom_beginX, @dom_beginY, @mouse_beginX, @mouse_beginY

      @$el.addClass 'ondrag'
      @$drag_placeholder = jQuery '<div>'
        .addClass 'drag-placeholder'
        .css
          'left'  : @layout_left
          'top'   : @layout_top
          'width' : @layout_width
          'height': @layout_height
        .appendTo @mindmap.$topics_area


      # 计算所有节点的拖拽触发区域
      @_calc_drag_trigger_area_r @mindmap.root_topic

    , { distance: 20 }


    @$el.drag (evt, dd)=>
      mouseX = @mouse_beginX + dd.deltaX
      mouseY = @mouse_beginY + dd.deltaY

      domX = @dom_beginX + dd.deltaX
      domY = @dom_beginY + dd.deltaY

      @$drag_placeholder
        .css
          'left': domX
          'top': domY

      Topic.each (id, topic)=>
        return if @ is topic # 不能放置在当前节点自己身上
        return if @is_ancestor_of(topic) # 不能放置在子节点上

        # 三种情况
        # 1. 拖拽到根节点上
        # 2. 拖拽到子节点之后
        # 3. 拖拽到一组节点之间

        if topic.is_root()
          # 放置于根节点的拖拽提示
          return

        topic.$el
          .removeClass 'will-drop-prev'
          .removeClass 'will-drop-next'
          .removeClass 'will-drop-on'

        if topic.prev_sibling_drag_area?.is_contain mouseX, mouseY
          topic.$el.addClass 'will-drop-prev'
        if topic.next_sibling_drag_area?.is_contain mouseX, mouseY
          topic.$el.addClass 'will-drop-next'
        if topic.leaf_topic_drag_area?.is_contain mouseX, mouseY
          topic.$el.addClass 'will-drop-on'


    @$el.drag 'end', (evt, dd)=>
      mouseX = @mouse_beginX + dd.deltaX
      mouseY = @mouse_beginY + dd.deltaY

      @$el.removeClass 'ondrag'
      @$drag_placeholder.remove()

      Topic.each (id, topic)=>
        topic.$el
          .removeClass 'will-drop-prev'
          .removeClass 'will-drop-next'
          .removeClass 'will-drop-on'

        return if @ is topic # 不能放置在当前节点自己身上
        return if @is_ancestor_of(topic) # 不能放置在子节点上

        if topic.prev_sibling_drag_area?.is_contain mouseX, mouseY
          @move_to_prev_of topic
        if topic.next_sibling_drag_area?.is_contain mouseX, mouseY
          @move_to_next_of topic
        if topic.leaf_topic_drag_area?.is_contain mouseX, mouseY
          @move_to_child_of topic

  # 计算节点的拖拽触发区域
  _calc_drag_trigger_area_r: (topic)->
    topic.prev_sibling_drag_area = null
    topic.next_sibling_drag_area = null
    topic.leaf_topic_drag_area = null

    if topic.is_root()
      # return
    else
      # 如果有n个子节点，那么计算2n个区域
      # 图示参考：http://img.teamkn.com/image_service/images/UvtosYTy/UvtosYTy.png
      half_padding = 10 # 垂直间距的一半
      x_padding = 50 # 水平间距

      if topic.side is 'right'
        left  = topic.layout_left - x_padding
        right = topic.layout_x_center

      if topic.side is 'left'
        left  = topic.layout_x_center
        right = topic.layout_right + x_padding

      top0 = topic.layout_top - half_padding
      top1 = topic.layout_y_center
      top2 = topic.layout_bottom + half_padding

      topic.prev_sibling_drag_area = new Area(left, right, top0, top1)
      topic.next_sibling_drag_area = new Area(left, right, top1, top2)

      if not topic.has_children()
        # 叶子节点，计算子节点拖拽触发区域
        if topic.side is 'left'
          left  = topic.layout_left - 60
          right = topic.layout_x_center

        if topic.side is 'right'
          left  = topic.layout_x_center
          right = topic.layout_right + 60

        top    = topic.layout_top
        bottom = topic.layout_bottom
        topic.leaf_topic_drag_area = new Area(left, right, top, bottom)

    
    for child in topic.children
      @_calc_drag_trigger_area_r child


  move_to_child_of: (topic)->
    # console.log "#{@id} 拖拽到 #{topic.id}"

    # 从父节点的 children 中移除当前节点
    @__remove_from_parent()
    
    # 修改父节点引用
    @parent = topic
    @depth = @parent.depth + 1
    topic.children.push @

    @mindmap.layout()

  move_to_prev_of: (topic)->
    # 从父节点的 children 中移除当前节点
    @__remove_from_parent()

    # 修改父节点引用
    @side = topic.side
    @parent = topic.parent
    @depth = @parent.depth + 1

    parent_children = @parent.children
    idx = parent_children.indexOf topic

    arr0 = parent_children[0 ... idx]
    arr1 = parent_children[idx .. -1]

    arr0.push @
    parent_children = arr0.concat arr1

    @parent.children = parent_children

    @mindmap.layout()

  move_to_next_of: (topic)->
    # 从父节点的 children 中移除当前节点
    @__remove_from_parent()

    # 修改父节点引用
    @side = topic.side
    @parent = topic.parent
    @depth = @parent.depth + 1

    parent_children = @parent.children
    idx = parent_children.indexOf topic

    arr0 = parent_children[0 .. idx]
    arr1 = parent_children[idx + 1 .. -1]

    arr0.push @
    parent_children = arr0.concat arr1

    @parent.children = parent_children

    @mindmap.layout()


  # 从父节点的 children 中移除当前节点，并处理数据结构变化
  __remove_from_parent: ->
    parent_children = @parent.children
    idx = parent_children.indexOf @
    arr0 = parent_children[0 ... idx]
    arr1 = parent_children[idx + 1 .. -1]
    parent_children = arr0.concat arr1
    @parent.children = parent_children


  # 计算节点的尺寸，便于其他计算使用
  size: ->
    return {
      width: @layout_width
      height: @layout_height
    }


  # 在当前节点增加一个新的子节点
  # options
  #   flash: 新增节点时是否有闪烁效果
  #   after: 新增的节点在哪个同级节点的后面，如果不传的话默认最后一个

  # 如果当前节点是根节点：
  #   当左边的一级子节点较多（或相等），新增的一级子节点排在右边
  #   当右边的一级子节点较多，新增的一级子节点排在左边

  insert_topic: (options)->
    options ||= {}
    flash = options.flash
    after = options.after

    if @is_root()
      text = Topic.LV1_TOPIC_TEXT
    else
      text = Topic.LV2_TOPIC_TEXT

    child_topic = new Topic text, @mindmap
    child_topic.depth = @depth + 1
    child_topic.flash = flash

    if @is_root()
      if after?
        child_topic.side = @children[after].side
      else
        c_left  = @left_children().length
        c_right = @right_children().length
        # console.log "left: #{c_left}, right: #{c_right}"
        if c_left >= c_right
          child_topic.side = 'right'
        else
          child_topic.side = 'left'

    if not after?
      @children.push child_topic
    else
      arr0 = @children[0..after]
      arr1 = @children[after + 1..@children.length]
      @children = (arr0.concat [child_topic]).concat arr1
      # console.log @children

    child_topic.parent = @

    Topic.set child_topic
    return @

  # 删除当前节点以及所有子节点
  delete_topic: ->
    # 删除节点后，重新定位当前的 active_topic
    # 如果有后续同级节点，选中后续同级节点
    # 如果有前置同级节点，选中前置同级节点
    if @next()
      # console.log @next()
      @next().fsm.select()
    else if @prev()
      @prev().fsm.select()
    else
      @parent.fsm.select()


    # 删除 dom
    # 遍历，清除所有子节点 dom
    @_delete_r @
    
    # 清除父子关系
    parent_children = @parent.children
    idx = parent_children.indexOf @
    arr0 = parent_children[0 ... idx]
    arr1 = parent_children[idx + 1 .. -1]
    parent_children = arr0.concat arr1
    @parent.children = parent_children

    # console.log arr0, arr1, @parent.children

    if @parent.children.length is 0
      @parent.$canvas.remove()

    # 删除节点时，父节点显示 -1 效果
    $pel = @parent.$el

    $float_num = jQuery '<div>'
      .addClass 'float-num'
      .addClass 'minus'
      .html '-1'
      .appendTo $pel.css 'z-index', '2'

      .animate
        'bottom': '-=20'
        'opacity': '0'
      , 600, =>
        $float_num.remove()
        $pel.css 'z-index', ''
    
    @parent = null


  _delete_r: (topic)->
    for child in topic.children
      @_delete_r child

    topic.$canvas.remove() if topic.$canvas
    topic.$el.remove()


  # 处理节点点击事件
  handle_click: ->
    return @fsm.select() if @fsm.can 'select'
    return @fsm.start_edit() if @fsm.can 'start_edit'

  # 处理节点折叠点点击事件
  handle_joint_click: ->
    if @is_closed()
      @oc_fsm.open()
    else if @is_opened()
      @oc_fsm.close()
    @mindmap.layout()


  # 处理节点外点击事件
  handle_click_out: ->
    @fsm.stop_edit() if @fsm.can 'stop_edit'
    @fsm.unselect() if @fsm.can 'unselect'


  # 处理空格按下事件
  handle_space_keydown: ->
    @fsm.start_edit() if @fsm.can 'start_edit'

  handle_context_menu_edit: ->
    @fsm.select() if @fsm.can 'select'
    @fsm.start_edit() if @fsm.can 'start_edit'

  # 处理 insert 按键按下事件
  handle_insert_keydown: ->
    return if not @fsm.is 'active'

    @insert_topic {flash: true}
    @mindmap.layout()
    @last_child().fsm.select()

  # 处理右键菜单的 “新增节点” 按下
  handle_context_menu_insert: ->
    @insert_topic {flash: true}
    @mindmap.layout()
    @last_child().fsm.select()


  # 处理回车键按下事件
  handle_enter_keydown: ->
    return if not @fsm.is 'active'

    if @is_root()
      @insert_topic {flash: true}
      @mindmap.layout()
      return

    @parent.insert_topic {
      flash: true
      after: @parent.children.indexOf @
    }
    @mindmap.layout()

    idx = @parent.children.indexOf @
    next = @parent.children[idx + 1]
    next.fsm.select()


  # 处理 delete 键按下事件
  handle_delete_keydown: ->
    return if not @fsm.is 'active'
    if not @is_root()
      @delete_topic()
      @mindmap.layout()

  handle_context_menu_delete: ->
    if not @is_root()
      @delete_topic()
      @mindmap.layout()


  handle_arrow_keydown: (direction)->
    return @_handle_arrow_keydown_root(direction) if @is_root()
    return @_handle_arrow_keydown_lvn(direction) #if @depth is 1

  _handle_arrow_keydown_root: (direction)->
    switch direction
      when 'left'
        left_children = @left_children()
        Utils.center_elm_of(left_children).fsm.select() if left_children.length

      when 'right'
        right_children = @right_children()
        Utils.center_elm_of(right_children).fsm.select() if right_children.length

  _handle_arrow_keydown_lvn: (direction)->
    if @side is 'left'
      switch direction
        when 'up'
          topic = @visible_prev()
          topic.fsm.select() if topic

        when 'down'
          topic = @visible_next()
          topic.fsm.select() if topic

        when 'left'
          if @is_opened()
            Utils.center_elm_of(@children).fsm.select() if @children.length
          # else # TODO jinhan13789 提的建议
          #   @oc_fsm.open()
          #   @mindmap.layout()

        when 'right'
          @parent.fsm.select()

    if @side is 'right'
      switch direction
        when 'up'
          topic = @visible_prev()
          topic.fsm.select() if topic

        when 'down'
          topic = @visible_next()
          topic.fsm.select() if topic

        when 'left'
          @parent.fsm.select()

        when 'right'
          if @is_opened()
            Utils.center_elm_of(@children).fsm.select() if @children.length


  open_image_dialog: ->
    new ImageDialog(@).render()

  # 根据 url 设置节点图片，如果传入的值是 null，则去除图片
  set_image_url: (url)->
    @img_url = url
    @mindmap.layout()


window.Topic = Topic
window.Utils = Utils