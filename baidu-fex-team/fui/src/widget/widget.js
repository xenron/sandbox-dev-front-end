/*jshint camelcase:false*/
/**
 * widget对象
 * 所有的UI组件都是widget对象
 */

define( function ( require ) {

    var prefix = '_fui_',
        uid = 0,
        CONF = require( "base/sysconf" ),
        FUI_NS = require( "base/ns" ),
        $ = require( "base/jquery" ),
        Utils = require( "base/utils" );

    var Widget = Utils.createClass( "Widget", {

        constructor: function ( options ) {

            var defaultOptions = {
                id: null,
                className: '',
                disabled: false,
                preventDefault: false,
                text: '',
                value: null,
                hide: false,
                width: null,
                height: null
            };

            this.__widgetType = 'widget';
            this.__tpl = '';
            this.__compiledTpl = '';
            this.__options = {};
            this.__element = null;
            // 禁止获取焦点
            this.__allow_focus = !!CONF.allowFocus;

            this.widgetName = 'Widget';

            this.__extendOptions( defaultOptions, options );

            this.__initOptions();
            this.__render();
            this.__initEvent();
            this.__initWidgets && this.__initWidgets();

        },

        getId: function () {
            return this.id;
        },

        getValue: function () {
            return this.__options.value;
        },

        getOptions: function () {
            return this.__options;
        },

        setValue: function ( value ) {
            this.__options.value = value;
            return this;
        },

        show: function () {
            this.__show();
            return this;
        },

        hide: function () {
            this.__hide();
            return this;
        },

        addClass: function ( className ) {
            $( this.__element ).addClass( className );
            return this;
        },

        removeClass: function ( className ) {
            $( this.__element ).removeClass( className );
            return this;
        },

        setStyle: function() {
            $.fn.css.apply($(this.__element), arguments);
            return this;
        },

        getStyle: function() {
            return $.fn.css.apply($(this.__element), arguments);
        },

        /**
         * 当前构件是否是处于禁用状态
         * @returns {boolean|disabled|jsl.$.disabled|id.disabled}
         */
        isDisabled: function () {
            return this.__options.disabled;
        },

        /**
         * 启用当前构件
         * @returns {Widget}
         */
        enable: function () {
            this.__options.disabled = false;
            $( this.__element ).removeClass( CONF.classPrefix + "disabled" );
            return this;
        },

        /**
         * 禁用当前构件
         * @returns {Widget}
         */
        disable: function () {
            this.__options.disabled = true;
            $( this.__element ).addClass( CONF.classPrefix + "disabled" );
            return this;
        },

        cloneElement: function () {
            return this.__element.cloneNode( true );
        },

        /**
         * 获取
         * @returns {null}
         */
        getElement: function () {
            return this.__element;
        },

        appendTo: function ( container ) {

            if ( Utils.isElement( container ) ) {

                container.appendChild( this.__element );

            } else if ( container instanceof Widget ) {

                container.__appendChild( this );

            } else {

                throw new Error( 'TypeError: Widget.appendTo()' );

            }

            return this;

        },

        remove: function () {

            var parent = this.__element.parentNode;

            if ( parent ) {
                parent.removeChild( this.__element );
            }

            return this;

        },

        off: function ( type, cb ) {

            $( this.__element ).off( cb && cb.__fui_listener );

            return this;

        },

        on: function ( type, cb ) {

            if ( !this.__options.preventDefault ) {
                this.__on( type, cb );
            }

            return this;

        },

        __initOptions: function () {},

        /**
         * 根据模板渲染构件, 如果该构件已经渲染过, 则不会进行二次渲染
         * @returns {Widget}
         */
        __render: function () {

            var $ele = null,
                tpl = this.__tpl,
                opts = this.__options,
                className = null;

            this.id = this.__id();

            // 向NS注册自己
            FUI_NS.__registerInstance( this );

            this.__compiledTpl = Utils.Tpl.compile( tpl, opts );
            this.__element = $( this.__compiledTpl )[ 0 ];
            this.__element.setAttribute( "id", this.id );

            $ele = $( this.__element );

            if ( opts.disabled ) {
                $ele.addClass( CONF.classPrefix + "disabled" );
            }

            $ele.addClass( CONF.classPrefix + "widget" );

            // add custom class-name
            className = opts.className;
            if ( className.length > 0 ) {
                if ( $.isArray( className ) ) {
                    $ele.addClass( className.join( " " ) );
                } else {
                    $ele.addClass( className );
                }
            }

            this.__initBasicEnv();

            if ( opts.hide ) {
                this.__hide();
            }

            if ( opts.style ) {
                this.setStyle( opts.style );
            }

            return this;

        },

        /**
         * 该方法将被appendTo调用， 用于根据各组件自身的规则插入节点,  子类可根据需要覆盖该方法
         * @param childWidget 将被追加的子构件对象
         */
        __appendChild: function ( childWidget ) {

            return this.__element.appendChild( childWidget.getElement() );

        },

        __initEvent: function () {

            this.on( "mousedown", function ( e ) {

                var tagName = e.target.tagName.toLowerCase();

                if ( !CONF.control[ tagName ] && !this.__allowFocus() ) {
                    e.preventDefault();
                } else {
                    e.stopPropagation();
                }

            } );

        },

        __on: function ( type, cb ) {

            var _self = this;

            cb.__fui_listener = function ( e, widget ) {

                var params = [];

                for ( var i = 0, len = arguments.length; i < len; i++ ) {

                    if ( i !== 1 ) {
                        params.push( arguments[ i ] );
                    }

                }

                e.widget = widget;

                if ( !_self.isDisabled() ) {
                    return cb.apply( _self, params );
                }

            };

            $( this.__element ).on( type, cb.__fui_listener );

            return this;

        },

        trigger: function ( type, params ) {

            if ( !this.__options.preventDefault ) {
                this.__trigger.apply( this, arguments );
            }

            return this;

        },

        __allowShowTitle: function () {
            return true;
        },

        __allowFocus: function () {
            return !!this.__allow_focus;
        },

        __trigger: function ( type, params ) {

            var args = [].slice.call( arguments, 1 );

            $( this.__element ).trigger( type, [ this ].concat( args ) );

            return this;

        },

        __triggerHandler: function ( type, params ) {

            var args = [ this ].concat( [].slice.call( arguments, 1 ) );

            return $( this.__element ).triggerHandler( type, args );

        },

        /**
         * 同__trigger，都触发某事件，但是该方法触发的事件会主动触发before和after，
         * 同时如果before事件返回false，则后续handler都不会执行，且后续事件也不会再触发。
         * @param type 事件类型
         * @param handler 该事件所需要执行的函数句柄， 且该函数的返回值将作为该事件的参数发送给事件监听器
         * */
        __fire: function ( type, handler ) {

            var result = {
                cancel: false
            };

            if ( /^(before|after)/.test( type ) ) {
                return this;
            }

            this.__trigger( "before" + type, result );

            if ( result.cancel === true ) {
                return this;
            }

            result = handler.call( this, type );
            this.__trigger( type );

            this.__trigger( "after" + type, result );

            return this;

        },

        __extendOptions: function () {

            var args = [ {}, this.__options ],
                params = [ true ];

            args = args.concat( [].slice.call( arguments, 0 ) );

            for ( var i = 0, len = args.length; i < len; i++ ) {
                if ( typeof args[ i ] !== "string" ) {
                    params.push( args[ i ] );
                }
            }

            this.__options = $.extend.apply( $, params );

        },

        __hide: function () {

            $( this.__element ).addClass( CONF.classPrefix + "hide" );

        },

        __show: function () {
            $( this.__element ).removeClass( CONF.classPrefix + "hide" );
        },

        __initBasicEnv: function () {

            if ( this.__options.text && this.__allowShowTitle() ) {
                this.__element.setAttribute( "title", this.__options.text );
            }

            if ( this.__options.width ) {
                this.__element.style.width = this.__options.width + 'px';
            }

            if ( this.__options.height ) {
                this.__element.style.height = this.__options.height + 'px';
            }

            if ( this.widgetName ) {
                this.__element.setAttribute( "rule", this.widgetName );
            }

        },

        __id: function () {
            return this.__options.id || generatorId();
        }

    } );

    // 为widget生成唯一id
    function generatorId () {

        return prefix + ( ++uid );

    }

    return Widget;

} );
