JSONInstanceMethods = 
  to_json: ->
    obj = @data(@root_topic)
    JSON.stringify obj


  data: (topic)->
    if topic.is_root()
      return {
        text: topic.text
        img_url: topic.img_url
        children: topic.children.map (child)=> @data child
        is_root: true
      }

    return {
      text: topic.text
      img_url: topic.img_url
      children: topic.children.map (child)=> @data child
      side: topic.side
      is_closed: topic.is_closed()
    }


JSONClassMethods =
  from_json: (string)->
    mindmap = new Mindmap jQuery('.mindmap')
    data = JSON.parse string

    mindmap.init()
    mindmap.root_topic.text = data.text
    mindmap.root_topic.img_url = data.img_url

    @_r mindmap.root_topic, data

    return mindmap


  # 遍历读取数据
  _r: (topic, data)->
    for child_data in data.children
      topic.insert_topic()
      child_topic = topic.last_child()
      child_topic.text    = child_data.text
      child_topic.img_url = child_data.img_url
      child_topic.side    = child_data.side

      # if child_data.is_closed
      #   child_topic.oc_fsm.close()

      @_r child_topic, child_data


class ContextMenu
  constructor: (@mindmap)->
    @MENU_HEIGHT = 168 # 菜单 dom 高度

    @init_dom()
    @bind_events()

  # 初始化右键菜单的 dom
  init_dom: ->
    @$el = jQuery '<div>'
      .addClass 'mindmap-context-menu'
      .hide()
      .appendTo @mindmap.$topics_area

    # 新增子节点
    @$op_insert = jQuery '<div>'
      .addClass 'op'
      .appendTo @$el
      .append jQuery('<i>').addClass('fa').addClass('fa-plus')
      .append jQuery('<span>').html('新增节点')

    # 删除节点
    @$op_delete = jQuery '<div>'
      .addClass 'op'
      .appendTo @$el
      .append jQuery('<i>').addClass('fa').addClass('fa-trash')
      .append jQuery('<span>').html('删除')

    # 编辑节点文字
    @$op_edit = jQuery '<div>'
      .addClass 'op'
      .appendTo @$el
      .append jQuery('<i>').addClass('fa').addClass('fa-pencil')
      .append jQuery('<span>').html('编辑')

    # 节点图片
    @$op_image = jQuery '<div>'
      .addClass 'op'
      .appendTo @$el
      .append jQuery('<i>').addClass('fa').addClass('fa-image')
      .append jQuery('<span>').html('附加图片')


  bind_events: ->
    @$op_insert.on 'click', =>
      @hide()
      @topic?.handle_context_menu_insert()

    @$op_delete.on 'click', =>
      @hide()
      @topic?.handle_context_menu_delete()

    @$op_edit.on 'click', =>
      @hide()
      @topic?.handle_context_menu_edit()

    @$op_image.on 'click', =>
      @hide()
      @topic?.open_image_dialog()


  show_on: (topic)->
    # 计算节点下边缘到编辑区域底端的距离，便于确定菜单显示的方向
    # 是向上，还是向下
    # 节点距离编辑区底边的距离长度
    distance = topic.distance_of_bottom()

    if distance >= @MENU_HEIGHT
      left = topic.layout_left
      top  = topic.layout_top + topic.layout_height
      klass = 'down'
    else
      left = topic.layout_left
      top  = topic.layout_top - @MENU_HEIGHT
      klass = 'up'

    @$el
      .removeClass 'up'
      .removeClass 'down'
      .addClass klass
      .css
        'left': left
        'top': top
      .show()

    @topic = topic
    @topic?.fsm?.select()

  hide: ->
    @$el.hide()


class Mindmap extends Module
  @include JSONInstanceMethods
  @extend JSONClassMethods

  constructor: (@$el)->
    @ZOOM_SCALES = [10, 25, 33, 50, 67, 75, 90, 100, 110, 125, 150, 175, 200, 250, 300]
    @scale = 100

    @$topics_area = @$el.find('.topics-area')
    @$bottom_area = @$el.find('.bottom-area')

    @basic_layout = new BasicLayout @
    @content_menu = new ContextMenu @

    @bind_topics_events()
    @bind_drag_events()

  init: ->
    @root_topic = Topic.generate_root @
    return @

  # 重新对所有节点布局
  # 增加或修改节点后调用此方法
  # 并且触发本地自动保存
  layout: ->
    # 本地自动保存
    @save_local()

    # 布局
    @basic_layout.go()
    @basic_layout.draw_lines()


  save_local: ->
    json = @to_json()
    localStorage['mindmap'] = json


  # 使得指定的节点在编辑器界面内居中显示
  center_to_root: ->
    @$topics_area
      .addClass 'with-animate'
      .css
        'margin-left': 0
        'margin-top': 0

    setTimeout =>
      @$topics_area
        .removeClass 'with-animate'
    , 300

  # 整体移动
  # 参数： x 和 y 方向移动的距离
  move: (xmove, ymove)->
    @$topics_area
      .addClass 'with-animate'
      .css
        'margin-left': "+=#{xmove}"
        'margin-top': "+=#{ymove}"

    setTimeout =>
      @$topics_area
        .removeClass 'with-animate'
    , 300

  # scale 缩小
  zoom_out: ->
    level = @ZOOM_SCALES.indexOf @scale
    return if level is 0

    @scale = @ZOOM_SCALES[level - 1]

    @$topics_area
      .addClass 'with-animate'
      .css
        'transform': "scale(#{@scale / 100.0})"

    setTimeout =>
      @$topics_area
        .removeClass 'with-animate'
    , 300

  # scale 放大
  zoom_in: ->
    level = @ZOOM_SCALES.indexOf @scale
    return if level is @ZOOM_SCALES.length - 1

    @scale = @ZOOM_SCALES[level + 1]

    @$topics_area
      .addClass 'with-animate'
      .css
        'transform': "scale(#{@scale / 100.0})"

    setTimeout =>
      @$topics_area
        .removeClass 'with-animate'
    , 300

  # 在选择的节点上新增子节点
  insert_topic: ->
    if not @active_topic
      console.log '没有选中任何节点，无法增加子节点'
      return

    @active_topic.insert_topic()
    @layout()


  get_editor_size: ->
    width = @$el.width()
    height = @$el.height()

    return {
      width: width
      height: height
    }


  # 设置导图节点事件
  bind_topics_events: ->
    that = this


    # 单击节点
    @$el.delegate '.topic', 'click', (evt)->
      that.content_menu.hide()
      evt.stopPropagation()
      topic = Topic.get jQuery(this).data('id')
      topic.handle_click()


    @$el.delegate '.topic .joint', 'click', (evt)->
      that.content_menu.hide()
      evt.stopPropagation()
      topic = Topic.get jQuery(this).closest('.topic').data('id')
      topic.handle_joint_click()


    # 右键单击节点
    @$el.delegate '.topic', 'contextmenu', (evt)->
      evt.preventDefault()
      # console.log '右键菜单'
      topic = Topic.get jQuery(this).data('id')
      that.content_menu.show_on topic
            

      
    # 点击节点外区域
    @$el.delegate '.bottom-area', 'click', (evt)=>
      @content_menu.hide()
      @active_topic.handle_click_out() if @active_topic


    # 节点文字编辑框的键盘响应
    @$el.delegate '.topic textarea.text-ipter', 'keydown', (evt)=>
      @active_topic.text_ipter.handle_keydown(evt) if @active_topic

    
    # 全局按键事件
    jQuery(document).on 'keydown', (evt)=>
      # console.log "keyCode: " + evt.keyCode

      if @active_topic  
        switch evt.keyCode
          when 32 # spacebar
            evt.preventDefault()
            @active_topic.handle_space_keydown()
          when 45 # insert
            evt.preventDefault()
            @active_topic.handle_insert_keydown()
          when 13 # enter
            evt.preventDefault()
            @active_topic.handle_enter_keydown()
          when 46 # delete
            evt.preventDefault()
            @active_topic.handle_delete_keydown()
          when 38 # ↑
            evt.preventDefault()
            @active_topic.handle_arrow_keydown('up')
          when 40 # ↓
            evt.preventDefault()
            @active_topic.handle_arrow_keydown('down')
          when 37 # ←
            evt.preventDefault()
            @active_topic.handle_arrow_keydown('left')
          when 39 # →
            evt.preventDefault()
            @active_topic.handle_arrow_keydown('right')

        if evt.keyCode is 73 and evt.shiftKey
          # console.log '打开添加图片对话框'
          evt.preventDefault()
          @active_topic.open_image_dialog()


  # 设置拖拽移动事件
  bind_drag_events: ->
    @$bottom_area.drag 'start', (evt, dd)=>
      mindmap_offsetX = parseInt @$topics_area.css 'margin-left'
      mindmap_offsetY = parseInt @$topics_area.css 'margin-top'

      @dom_beginX = mindmap_offsetX
      @dom_beginY = mindmap_offsetY

      @content_menu.hide()

      # console.log @dom_beginX, @dom_beginY

    , { distance: 10 }

    @$bottom_area.drag (evt, dd)=>
      mouseX = @mouse_beginX + dd.deltaX
      mouseY = @mouse_beginY + dd.deltaY

      domX = @dom_beginX + dd.deltaX
      domY = @dom_beginY + dd.deltaY

      @$topics_area
        .css
          'margin-left': domX
          'margin-top': domY


# 用调试代码初始化思维导图
prepare_mindmap = ->
  mindmap = new Mindmap jQuery('.mindmap')
  mindmap.init()

  mindmap.root_topic.img_url = 'http://mindpin.oss-cn-hangzhou.aliyuncs.com/image_service/images/cuefn8bR/cuefn8bR.jpg'

  mindmap.root_topic
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()


  mindmap.root_topic.children[0]
    .insert_topic()
    .insert_topic()

  mindmap.root_topic.children[1]
    .insert_topic()
    .insert_topic()

  mindmap.root_topic.children[1].children[1]
    .insert_topic()
    .insert_topic()


  mindmap.root_topic.children[2]
    .insert_topic()
    .insert_topic()
    .insert_topic()

  mindmap.root_topic.children[2].children[1]
    .insert_topic()
    .insert_topic()
    .insert_topic()

  mindmap.root_topic.children[2].children[2]
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()
    .insert_topic()

  mindmap.root_topic.children[0].children[0]
    .insert_topic()
    .insert_topic()

  mindmap.root_topic.children[3]
    .insert_topic()

  mindmap.root_topic.children[3].children[0]
    .insert_topic()
    .insert_topic()

  mindmap.layout()

  bind_events mindmap


# 通过读入JSON字符串初始化思维导图
json_to_mindmap = ->
  jQuery.ajax
    url: '../fixture/2.json?' + Math.random()
    type: 'GET'
    contentType: "application/json; charset=utf-8"
    success: (string)->
      mindmap = Mindmap.from_json string
      mindmap.layout()
      bind_events mindmap

read_textarea = ->
  string = jQuery('textarea.data').val()
  mindmap = Mindmap.from_json string
  mindmap.layout()
  bind_events mindmap  

bind_events = (mindmap)->
  window.mindmap = mindmap

  # 设置工具按钮操作事件
  # 导图居中显示
  jQuery(document).delegate '.mindmap-ops a.op.center', 'click', =>
    mindmap.center_to_root()

  jQuery(document).delegate '.mindmap-ops a.op.to-json', 'click', =>
    console.log mindmap.to_json()

  jQuery(document).delegate '.mindmap-ops a.op.zoom-out', 'click', =>
    mindmap.zoom_out()
    jQuery('.mindmap-ops .scale span.value').html mindmap.scale

  jQuery(document).delegate '.mindmap-ops a.op.zoom-in', 'click', =>
    mindmap.zoom_in()
    jQuery('.mindmap-ops .scale span.value').html mindmap.scale


# jQuery(document).ready ->
#   # mindmap = prepare_mindmap mindmap
#   # json_to_mindmap()
#   if false #json = localStorage['mindmap']
#     # console.log json
#     mindmap = Mindmap.from_json json
#     mindmap.layout()
#     bind_events mindmap
#   else
#     # json_to_mindmap()
#     read_textarea()


window.Mindmap = Mindmap
window.ANIMATE_DURATION = 200