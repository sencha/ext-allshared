Ext.define('Ext.Button', {
    extend: Ext.Component,
    xtype: 'button',
    isButton: true,
    cachedConfig: {
        buttonType: 'button',
        iconCls: null,
        textAlign: null,
        menuAlign: 'tl-bl?',
        destroyMenu: true,
        stretchMenu: false
    },
    config: {
        allowDepress: true,
        badgeText: null,
        text: null,
        icon: false,
        iconAlign: 'left',
        pressedDelay: 0,
        menu: {
            lazy: true,
            $value: null
        },
        arrow: null,
        arrowAlign: 'right',
        handler: null,
        toggleHandler: null,
        scope: null,
        autoEvent: null,
        ui: null,
        enableToggle: false,
        value: null
    },
    eventedConfig: {
        pressed: false
    },
    preventDefaultAction: true,
    isMenuOwner: true,
    baseCls: Ext.baseCSSPrefix + 'button',
    hasMenuCls: Ext.baseCSSPrefix + 'has-menu',
    hoveredCls: Ext.baseCSSPrefix + 'hovered',
    pressedCls: Ext.baseCSSPrefix + 'pressed',
    pressingCls: Ext.baseCSSPrefix + 'pressing',
    hasBadgeCls: Ext.baseCSSPrefix + 'has-badge',
    hasIconCls: Ext.baseCSSPrefix + 'has-icon',
    hasTextCls: Ext.baseCSSPrefix + 'has-text',
    hasArrowCls: Ext.baseCSSPrefix + 'has-arrow',
    noArrowCls: Ext.baseCSSPrefix + 'no-arrow',
    defaultBindProperty: 'text',
    publishes: [
        'pressed'
    ],
    element: {
        reference: 'element',
        listeners: {
            click: 'onClick'
        }
    },
    focusable: true,
    focusEl: 'buttonElement',
    ariaEl: 'buttonElement',
    backgroundColorEl: 'innerElement',
    focusClsEl: 'el',
    initialize: function() {
        var me = this,
            el = me.el;
        me.callParent();
        if (me.getConfig('menu', true)) {
            me.addCls(me.hasMenuCls);
        }
        el.on({
            scope: me,
            touchstart: 'onPress'
        });
        el.addClsOnOver(me.hoveredCls, me.isEnabled, me);
    },
    getTemplate: function() {
        return [
            {
                reference: 'innerElement',
                cls: Ext.baseCSSPrefix + 'inner-el',
                children: [
                    {
                        reference: 'bodyElement',
                        cls: Ext.baseCSSPrefix + 'body-el',
                        children: [
                            {
                                cls: Ext.baseCSSPrefix + 'icon-el ' + Ext.baseCSSPrefix + 'font-icon',
                                reference: 'iconElement'
                            },
                            {
                                reference: 'textElement',
                                cls: Ext.baseCSSPrefix + 'text-el'
                            }
                        ]
                    },
                    {
                        reference: 'arrowElement',
                        cls: Ext.baseCSSPrefix + 'arrow-el ' + Ext.baseCSSPrefix + 'font-icon'
                    }
                ]
            },
            {
                reference: 'badgeElement',
                cls: Ext.baseCSSPrefix + 'badge-el'
            },
            this.getButtonTemplate()
        ];
    },
    getButtonTemplate: function() {
        return {
            tag: 'button',
            reference: 'buttonElement',
            cls: Ext.baseCSSPrefix + 'button-el',
            listeners: {
                focus: 'handleFocusEvent',
                blur: 'handleBlurEvent'
            }
        };
    },
    shouldRipple: function() {
        var me = this,
            ui = me.getUi(),
            ripple = me.getRipple(),
            isFab = ui ? ui.split(" ").indexOf("fab") >= 0 : false,
            text, icon;
        if (!isFab && ripple && ripple.bound === undefined) {
            text = me.getText();
            icon = me.getIconCls();
            if ((!text || text.length === 0) && icon) {
                ripple = Ext.clone(ripple);
                ripple.bound = false;
                ripple.measureSelector = 'x-icon-el';
            }
        }
        return ripple;
    },
    isPressed: function() {
        return Boolean(this.getPressed());
    },
    toggle: function() {
        this.setPressed(!this.isPressed());
    },
    updateBadgeText: function(badgeText) {
        var me = this,
            el = me.el,
            badgeElement = me.badgeElement,
            hasBadgeCls = me.hasBadgeCls;
        if (badgeText) {
            badgeElement.setText(badgeText);
            el.addCls(hasBadgeCls);
        } else {
            el.removeCls(hasBadgeCls);
        }
    },
    updateButtonType: function(buttonType) {
        this.buttonElement.dom.setAttribute('type', buttonType);
    },
    updateText: function(text) {
        this.textElement.setHtml(text);
        this.toggleCls(this.hasTextCls, !!text);
    },
    updateHtml: function(html) {
        this.setText(html);
    },
    applyPressed: function(pressed) {
        return Boolean(pressed);
    },
    updatePressed: function(pressed) {
        var me = this,
            toggleHandler = me.getToggleHandler();
        if (toggleHandler && !me.isConfiguring) {
            Ext.callback(toggleHandler, me.getScope(), [
                me,
                pressed
            ], 0, me);
        }
        me.element.toggleCls(me.pressedCls, pressed);
    },
    updateIcon: function(icon) {
        var me = this,
            element = me.iconElement,
            hasIconCls = me.hasIconCls;
        if (icon) {
            me.addCls(hasIconCls);
            element.setStyle('background-image', 'url(' + icon + ')');
        } else {
            element.setStyle('background-image', '');
            if (!me.getIconCls()) {
                me.removeCls(hasIconCls);
            }
        }
    },
    updateIconCls: function(iconCls, oldIconCls) {
        var me = this,
            element = me.iconElement,
            hasIconCls = me.hasIconCls;
        if (iconCls) {
            me.addCls(hasIconCls);
            element.replaceCls(oldIconCls, iconCls);
        } else {
            element.removeCls(oldIconCls);
            if (!me.getIcon()) {
                me.removeCls(hasIconCls);
            }
        }
    },
    updateIconAlign: function(iconAlign, oldIconAlign) {
        var el = this.el,
            prefix = Ext.baseCSSPrefix + 'icon-align-';
        el.removeCls(prefix + oldIconAlign);
        el.addCls(prefix + iconAlign);
    },
    _textAlignCls: {
        left: Ext.baseCSSPrefix + 'text-align-left',
        right: Ext.baseCSSPrefix + 'text-align-right',
        center: ''
    },
    updateTextAlign: function(textAlign, oldTextAlign) {
        var textAlignClasses = this._textAlignCls,
            add = textAlignClasses[textAlign || 'center'],
            remove = textAlignClasses[oldTextAlign || 'center'];
        this.replaceCls(remove, add);
    },
    updateArrowAlign: function(align, oldAlign) {
        var element = this.element,
            cls = Ext.baseCSSPrefix + 'arrow-align-';
        if (oldAlign) {
            element.removeCls(cls + oldAlign);
        }
        element.addCls(cls + align);
    },
    applyMenu: function(menu) {
        if (menu) {
            if (!menu.isMenu) {
                if (Ext.isArray(menu)) {
                    menu = {
                        items: menu
                    };
                }
                if (!menu.xtype) {
                    menu.xtype = 'menu';
                }
                menu.ownerCmp = this;
                menu = Ext.widget(menu);
            }
            this.menuMinWidth = menu.getMinWidth();
        }
        return menu;
    },
    updateMenu: function(menu, oldMenu) {
        var listener = {
                scope: this,
                hide: 'onMenuHide'
            };
        if (oldMenu && !oldMenu.destroyed) {
            if (this.getDestroyMenu()) {
                oldMenu.destroy();
            } else if (oldMenu.isMenu) {
                oldMenu.un(listener);
            }
        }
        this.toggleCls(this.hasMenuCls, !!menu);
        if (menu && menu.isMenu) {
            menu.on(listener);
        }
    },
    updateArrow: function(arrow) {
        this.toggleCls(this.noArrowCls, !arrow);
        this.toggleCls(this.hasArrowCls, !!arrow);
    },
    applyAutoEvent: function(autoEvent) {
        var me = this;
        if (typeof autoEvent === 'string') {
            autoEvent = {
                name: autoEvent,
                scope: me.scope || me
            };
        }
        return autoEvent;
    },
    updateAutoEvent: function(autoEvent) {
        var name = autoEvent.name,
            scope = autoEvent.scope;
        this.setHandler(function() {
            scope.fireEvent(name, scope, this);
        });
        this.setScope(scope);
    },
    applyPressedDelay: function(delay) {
        if (Ext.isNumber(delay)) {
            return delay;
        }
        return (delay) ? 100 : 0;
    },
    enableFocusable: function() {
        this.buttonElement.dom.disabled = false;
        this.callParent();
    },
    disableFocusable: function() {
        this.callParent();
        this.buttonElement.dom.disabled = true;
    },
    findEventTarget: function() {
        return this.element;
    },
    onPress: function(e) {
        var me = this,
            element = this.findEventTarget(e),
            pressedDelay = me.getPressedDelay(),
            pressingCls = me.pressingCls;
        if (!me.getDisabled() && !e.button) {
            if (pressedDelay > 0) {
                me.pressedTimeout = Ext.defer(function() {
                    delete me.pressedTimeout;
                    if (element) {
                        element.addCls(pressingCls);
                    }
                }, pressedDelay);
            } else {
                element.addCls(pressingCls);
            }
            Ext.GlobalEvents.setPressedComponent(me, e);
        }
    },
    onRelease: function(e) {
        this.fireAction('release', [
            this,
            e
        ], 'doRelease');
    },
    doRelease: function(me, e) {
        var element = me.findEventTarget(e);
        if (!me.getDisabled()) {
            if (me.hasOwnProperty('pressedTimeout')) {
                Ext.undefer(me.pressedTimeout);
                delete me.pressedTimeout;
            } else {
                if (element) {
                    element.removeCls(me.pressingCls);
                }
            }
        }
    },
    onClick: function(e) {
        return this.onTap(e);
    },
    onTap: function(e) {
        if (this.getDisabled()) {
            return false;
        }
        this.fireAction('tap', [
            this,
            e
        ], 'doTap');
    },
    doTap: function(me, e) {
        var menu = me.getMenu(),
            handler = me.getHandler();
        if (e && e.preventDefault && me.preventDefaultAction) {
            e.preventDefault();
        }
        if (menu) {
            me.toggleMenu(e, menu);
        } else {
            if ((me.getToggleHandler() || me.getEnableToggle()) && (me.getAllowDepress() || !me.isPressed())) {
                me.toggle();
            }
            if (handler) {
                Ext.callback(handler, me.getScope(), [
                    me,
                    e
                ], 0, me);
            }
        }
    },
    onEnterKey: function(e) {
        this.onTap(e);
        e.stopEvent();
        return false;
    },
    onDownKey: function(e) {
        var menu = this.getMenu();
        if (menu && !this.getDisabled()) {
            this.showMenu(e, menu);
            e.stopEvent();
            return false;
        }
    },
    onEscKey: function(e) {
        var menu = this.getMenu();
        if (menu && !this.getDisabled() && menu.isVisible()) {
            menu.hide();
            e.stopEvent();
            return false;
        }
    },
    onFocus: function(e) {
        if (!this.keyHandlersAdded) {
            this.setKeyMap({
                scope: 'this',
                SPACE: 'onEnterKey',
                ENTER: 'onEnterKey',
                DOWN: 'onDownKey',
                ESC: 'onEscKey'
            });
            this.keyHandlersAdded = true;
        }
        this.callParent([
            e
        ]);
    },
    onMenuHide: function(menu) {
        if (menu.isMenu && !this.$buttonWasPressed) {
            this.setPressed(false);
        }
    },
    toggleMenu: function(e, menu) {
        var me = this;
        menu = menu || me.getMenu();
        if (menu) {
            if (menu.isVisible()) {
                me.hideMenu(e, menu);
            } else {
                me.showMenu(e, menu);
            }
        }
    },
    hideMenu: function(e, menu) {
        menu = menu || this.getMenu();
        if (menu) {
            menu.hide();
        }
    },
    showMenu: function(e, menu) {
        var me = this,
            isPointerEvent = !e || e.pointerType,
            pressed;
        menu = menu || me.getMenu();
        me.setupMenuStretch(menu);
        if (menu) {
            if (menu.isVisible()) {
                if (isPointerEvent) {
                    menu.hide();
                } else {
                    menu.focus();
                }
            } else {
                menu.autoFocus = !isPointerEvent;
                if (menu.isMenu) {
                    me.$buttonWasPressed = pressed = me.getPressed();
                    menu.showBy(me.element, me.getMenuAlign());
                    if (!pressed) {
                        me.setPressed(true);
                    }
                } else if (menu.isViewportMenu) {
                    menu.setDisplayed(!menu.getDisplayed());
                } else {
                    menu.show();
                }
            }
        }
    },
    doDestroy: function() {
        var me = this;
        if (me.hasOwnProperty('pressedTimeout')) {
            Ext.undefer(me.pressedTimeout);
        }
        me.setMenu(null);
        me.callParent();
    },
    getFocusClsEl: function() {
        return this.element;
    },
    privates: {
        setupMenuStretch: function(menu) {
            var me = this;
            if (!me.menuMinWidth) {
                if (me.getStretchMenu()) {
                    menu.setMinWidth(me.el.measure('w'));
                } else {
                    menu.setMinWidth(null);
                }
            }
        }
    }
});

