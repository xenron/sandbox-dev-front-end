Utils =
  generate_id: ->
    str = 'abcdefghijklmnopqrstuvwxyz0123456789'
    l = str.length
    re = ''

    for i in [0...7]
      r = ~~(Math.random() * l)
      re = re + str[r]

    return re

  # 返回一个数组中间的元素
  center_elm_of: (array)->
    if length = array.length
      idx = ~~((length - 1) / 2)
      return array[idx]
    return null

class Module
  @moduleKeywords: ['extended', 'included']
  @extend: (obj) ->
    for key, value of obj when key not in @moduleKeywords
      @[key] = value

    obj.extended?.apply(@)
    this

  @include: (obj) ->
    for key, value of obj when key not in @moduleKeywords
      # Assign properties to the prototype
      @::[key] = value

    obj.included?.apply(@)
    this


window.Utils = Utils
window.Module = Module