/**
 * @fileOverview
 *
 * 主菜单控制
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

KityMinder.registerUI('menu/menu', function(minder) {

    var ret = minder.getUI('eve').setup({});
    var $menutab = minder.getUI('widget/menutab');

    // 主菜单容器
    var $panel = $('<div>')
        .attr('id', 'main-menu')
        .css('display', 'none')
        .appendTo('#content-wrapper');

    // 主菜单按钮
    var $button = new FUI.Button({

        id: 'main-menu-btn',
        label: minder.getLang('ui.menu.mainmenutext')

    }).appendTo(document.getElementById('panel'));

    // 一级菜单选项卡
    var $tabs = new FUI.Tabs({
        className: 'main-menu-level1'
    }).appendTo($panel[0]);

    var timer;

    function show() {
        $panel.css('display', 'block');
        clearTimeout(timer);
        timer = setTimeout(function() {
            $panel.addClass('show');
            ret.fire('show');
        });
    }

    function hide() {
        ret.fire('hide');
        $panel.removeClass('show');
        minder.getRenderTarget().focus();
        timer = setTimeout(function() {
            $panel.css('display', 'none');
        });
    }

    function isVisible() {
        return $panel.hasClass('show');
    }

    function toggle() {
        if ($('#content-wrapper').hasClass('fullscreen')) return;
        (isVisible() ? hide : show)();
    }

    function createSub(name, asDefault) {
        var $sub = $menutab.generate($tabs, name, asDefault);
        var $h2 = $('<h2></h2>')
            .text(minder.getLang('ui.menu.' + name + 'header'))
            .appendTo($sub);
        return $sub;
    }

    function createSubMenu(name, asDefault) {
        var $sub = createSub(name, asDefault);
        var $subtabs = new FUI.Tabs().appendTo($sub);
        return {
            $tabs: $subtabs,
            createSub: function(subname, asDefault) {
                return $menutab.generate($subtabs, subname, asDefault);
            }
        };
    }

    $button.on('click', toggle);

    minder.addShortcut('esc', toggle);

    // expose
    ret.show = show;
    ret.hide = hide;
    ret.toggle = toggle;
    ret.isVisible = isVisible;
    ret.createSub = createSub;
    ret.createSubMenu = createSubMenu;
    ret.$panel = $panel;
    ret.$button = $button;
    ret.$tabs = $tabs;

    return ret;
});