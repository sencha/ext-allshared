import {
  Injectable,
  Host,
  Optional,
  SkipSelf,
  Output,
  OnInit,
  AfterContentInit,
  OnChanges,
  Component,
  ElementRef,
  forwardRef
} from '@angular/core';
import { base } from './base';
export class treeMetaData {
  public static XTYPE: string = 'tree';
    public static PROPERTIESOBJECT: string[] = [
    "activeChildTabIndex": "Number",
    "activeItem": "Ext.Component/Object/String/Number",
    "allowFocusingDisabledChildren": "Boolean",
    "alwaysOnTop": "Boolean/Number",
    "ariaAttributes": "Object",
    "ariaDescribedBy": "String",
    "ariaLabel": "String",
    "ariaLabelledBy": "String",
    "associatedData": "Boolean/Object",
    "autoDestroy": "Boolean",
    "autoSize": "Boolean",
    "axisLock": "Boolean",
    "bind": "Object/String",
    "border": "Boolean",
    "bottom": "Number/String",
    "bufferSize": "Number",
    "cardSwitchAnimation": "String/Object/Boolean",
    "centered": "Boolean",
    "cls": "String/String[]",
    "columnLines": "Boolean",
    "columnMenu": "Object",
    "columnResize": "Boolean",
    "columns": "Ext.grid.column.Column[]",
    "columnsMenuItem": "Ext.grid.menu.Columns",
    "constrainAlign": "String/Ext.util.Region/Ext.dom.Element",
    "contentEl": "Ext.dom.Element/HTMLElement/String",
    "control": "Object",
    "controller": "String/Object/Ext.app.ViewController",
    "data": "Object",
    "defaultFocus": "String",
    "defaultListenerScope": "Boolean",
    "defaults": "Object",
    "defaultType": "Ext.enums.Widget",
    "deferEmptyText": "Boolean",
    "deselectOnContainerClick": "Boolean",
    "disabled": "Boolean",
    "disableSelection": "Boolean",
    "disclosureProperty": "String",
    "displayed": "Boolean",
    "docked": "String",
    "draggable": "Boolean/Object/Ext.drag.Source",
    "emptyItemText": "String",
    "emptyState": "Boolean",
    "emptyText": "String/Boolean",
    "emptyTextDefaults": "Object/Ext.Component",
    "emptyTextProperty": "String",
    "expanderFirst": "Boolean",
    "expanderOnly": "Boolean",
    "flex": "Number/String/Object",
    "floated": "Boolean",
    "focusableContainer": "Boolean",
    "focusCls": "String",
    "folderSort": "Boolean",
    "fullscreen": "Boolean",
    "grouped": "Boolean",
    "groupFooter": "Object/Ext.dataview.ItemHeader",
    "groupHeader": "Object/Ext.dataview.ItemHeader",
    "height": "Number/String",
    "hidden": "Boolean",
    "hideAnimation": "String/Mixed",
    "hideHeaders": "Boolean",
    "hideMode": "'clip'/'display'/'offsets'/'opacity'/'visibility'",
    "hideOnMaskTap": "Boolean",
    "hideScrollbar": "Boolean",
    "horizontalOverflow": "any",
    "html": "String/Ext.dom.Element/HTMLElement",
    "id": "String",
    "inactiveChildTabIndex": "Number",
    "indexBar": "Boolean/Object/Ext.dataview.IndexBar",
    "infinite": "Boolean",
    "inline": "Boolean/Object",
    "innerCls": "String",
    "innerCtHeight": "any",
    "innerWidth": "any",
    "instanceCls": "String/String[]",
    "itemButtonMode": "boolean",
    "itemCls": "String",
    "itemConfig": "Object/Ext.grid.Row",
    "itemContentCls": "String",
    "itemDataMap": "Object",
    "itemId": "String",
    "itemInnerCls": "String",
    "itemRipple": "Boolean/Object",
    "items": "Array/Object",
    "itemsFocusable": "any",
    "itemTpl": "String/String[]/Ext.XTemplate",
    "keyMap": "Object",
    "keyMapEnabled": "Boolean",
    "keyMapTarget": "String",
    "layout": "Object/String",
    "left": "Number/String",
    "listeners": "Object",
    "loadingHeight": "Number",
    "loadingText": "String/Boolean",
    "maintainChildNodes": "Boolean",
    "manageBorders": "Boolean",
    "margin": "Number/String",
    "markDirty": "Boolean",
    "masked": "Boolean/String/Object/Ext.Mask/Ext.LoadMask",
    "maxHeight": "Number/String",
    "maxItemCache": "Number",
    "maxWidth": "Number/String",
    "minHeight": "Number/String",
    "minimumBufferDistance": "Number",
    "minWidth": "Number/String",
    "modal": "Boolean",
    "modelValidation": "Boolean",
    "multiColumnSort": "Boolean",
    "name": "String",
    "nameable": "Boolean",
    "nameHolder": "Boolean",
    "onItemDisclosure": "Boolean/Function/String/Object",
    "padding": "Number/String",
    "pinFooters": "Boolean",
    "pinHeaders": "Boolean",
    "pinnedFooter": "Object",
    "pinnedFooterHeight": "any",
    "pinnedHeader": "Object",
    "pinnedHeaderHeight": "any",
    "plugins": "Array/Ext.enums.Plugin/Object/Ext.plugin.Abstract",
    "pressedDelay": "Number",
    "preventSelectionOnDisclose": "Boolean",
    "preventSelectionOnTool": "Boolean",
    "publishes": "String/String[]/Object",
    "record": "Ext.data.Model",
    "reference": "String",
    "referenceHolder": "Boolean",
    "relative": "Boolean",
    "renderTo": "Ext.dom.Element",
    "reserveScrollbar": "Boolean",
    "resetFocusPosition": "Boolean",
    "right": "Number/String",
    "ripple": "Boolean/Object/String",
    "rowLines": "Boolean",
    "rowNumbers": "Boolean/Object",
    "scrollable": "Boolean/String/Object",
    "scrollDock": "'start'/'emd'",
    "scrollToTopOnRefresh": "Boolean",
    "selectable": "Ext.grid.selection.Model",
    "selection": "Ext.data.Model",
    "selectOnExpander": "Boolean",
    "selfAlign": "String",
    "session": "Boolean/Object/Ext.data.Session",
    "shadow": "Boolean",
    "shareableName": "Boolean",
    "shim": "Boolean",
    "showAnimation": "String/Mixed",
    "singleExpand": "Boolean",
    "sortable": "Boolean",
    "stateful": "Boolean/Object/String[]",
    "statefulDefaults": "Object/String[]",
    "stateId": "String",
    "store": "Ext.data.Store/Object",
    "striped": "Boolean",
    "style": "String/Object",
    "tabIndex": "Number",
    "title": "String",
    "titleBar": "Object",
    "toFrontOnShow": "Boolean",
    "tooltip": "String/Object",
    "top": "Number/String",
    "topRenderedIndex": "any",
    "touchAction": "Object",
    "tpl": "String/String[]/Ext.Template/Ext.XTemplate[]",
    "tplWriteMode": "String",
    "translatable": "Object",
    "triggerCtEvent": "'tap'/'singletap'",
    "triggerEvent": "'childtap'/'childsingletap'/'childdoubletap'/'childswipe'/'childtaphold'/'childlongpress'",
    "twoWayBindable": "String/String[]/Object",
    "ui": "String/String[]",
    "userCls": "String/String[]",
    "userSelectable": "Boolean/String/Object",
    "variableHeights": "Boolean",
    "verticalOverflow": "Boolean",
    "viewModel": "String/Object/Ext.app.ViewModel",
    "visibleHeight": "Number",
    "visibleLeft": "any",
    "visibleTop": "Number",
    "visibleWidth": "any",
    "weight": "Number",
    "weighted": "Boolean",
    "width": "Number/String",
    "x": "Number",
    "xtype": "String",
    "y": "Number",
    "zIndex": "Number",
    "platformConfig": "Object",
    "responsiveConfig": "Object",
    "align": "Obyect",
    "fitToParent": "Boolean",
    "config": "Object",
];
  public static PROPERTIES: string[] = [
    'activeChildTabIndex',
    'activeItem',
    'allowFocusingDisabledChildren',
    'alwaysOnTop',
    'ariaAttributes',
    'ariaDescribedBy',
    'ariaLabel',
    'ariaLabelledBy',
    'associatedData',
    'autoDestroy',
    'autoSize',
    'axisLock',
    'bind',
    'border',
    'bottom',
    'bufferSize',
    'cardSwitchAnimation',
    'centered',
    'cls',
    'columnLines',
    'columnMenu',
    'columnResize',
    'columns',
    'columnsMenuItem',
    'constrainAlign',
    'contentEl',
    'control',
    'controller',
    'data',
    'defaultFocus',
    'defaultListenerScope',
    'defaults',
    'defaultType',
    'deferEmptyText',
    'deselectOnContainerClick',
    'disabled',
    'disableSelection',
    'disclosureProperty',
    'displayed',
    'docked',
    'draggable',
    'emptyItemText',
    'emptyState',
    'emptyText',
    'emptyTextDefaults',
    'emptyTextProperty',
    'expanderFirst',
    'expanderOnly',
    'flex',
    'floated',
    'focusableContainer',
    'focusCls',
    'folderSort',
    'fullscreen',
    'grouped',
    'groupFooter',
    'groupHeader',
    'height',
    'hidden',
    'hideAnimation',
    'hideHeaders',
    'hideMode',
    'hideOnMaskTap',
    'hideScrollbar',
    'horizontalOverflow',
    'html',
    'id',
    'inactiveChildTabIndex',
    'indexBar',
    'infinite',
    'inline',
    'innerCls',
    'innerCtHeight',
    'innerWidth',
    'instanceCls',
    'itemButtonMode',
    'itemCls',
    'itemConfig',
    'itemContentCls',
    'itemDataMap',
    'itemId',
    'itemInnerCls',
    'itemRipple',
    'items',
    'itemsFocusable',
    'itemTpl',
    'keyMap',
    'keyMapEnabled',
    'keyMapTarget',
    'layout',
    'left',
    'listeners',
    'loadingHeight',
    'loadingText',
    'maintainChildNodes',
    'manageBorders',
    'margin',
    'markDirty',
    'masked',
    'maxHeight',
    'maxItemCache',
    'maxWidth',
    'minHeight',
    'minimumBufferDistance',
    'minWidth',
    'modal',
    'modelValidation',
    'multiColumnSort',
    'name',
    'nameable',
    'nameHolder',
    'onItemDisclosure',
    'padding',
    'pinFooters',
    'pinHeaders',
    'pinnedFooter',
    'pinnedFooterHeight',
    'pinnedHeader',
    'pinnedHeaderHeight',
    'plugins',
    'pressedDelay',
    'preventSelectionOnDisclose',
    'preventSelectionOnTool',
    'publishes',
    'record',
    'reference',
    'referenceHolder',
    'relative',
    'renderTo',
    'reserveScrollbar',
    'resetFocusPosition',
    'right',
    'ripple',
    'rowLines',
    'rowNumbers',
    'scrollable',
    'scrollDock',
    'scrollToTopOnRefresh',
    'selectable',
    'selection',
    'selectOnExpander',
    'selfAlign',
    'session',
    'shadow',
    'shareableName',
    'shim',
    'showAnimation',
    'singleExpand',
    'sortable',
    'stateful',
    'statefulDefaults',
    'stateId',
    'store',
    'striped',
    'style',
    'tabIndex',
    'title',
    'titleBar',
    'toFrontOnShow',
    'tooltip',
    'top',
    'topRenderedIndex',
    'touchAction',
    'tpl',
    'tplWriteMode',
    'translatable',
    'triggerCtEvent',
    'triggerEvent',
    'twoWayBindable',
    'ui',
    'userCls',
    'userSelectable',
    'variableHeights',
    'verticalOverflow',
    'viewModel',
    'visibleHeight',
    'visibleLeft',
    'visibleTop',
    'visibleWidth',
    'weight',
    'weighted',
    'width',
    'x',
    'xtype',
    'y',
    'zIndex',
    'platformConfig',
    'responsiveConfig',
    'align',
    'fitToParent',
    'config'
];
  public static EVENTS: any[] = [
		{name:'activate',parameters:'newActiveItem,tree,oldActiveItem'},
		{name:'activeItemchange',parameters:'sender,value,oldValue'},
		{name:'add',parameters:''},
		{name:'added',parameters:'sender,container,index'},
		{name:'beforeactiveItemchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforebottomchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforecenteredchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforedisabledchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforedockedchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforeheightchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforehiddenchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforehide',parameters:'sender'},
		{name:'beforeleftchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforeload',parameters:'store,operation'},
		{name:'beforemaxHeightchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforemaxWidthchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforeminHeightchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforeminWidthchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforenodecollapse',parameters:'node,record'},
		{name:'beforenodeexpand',parameters:'row,record'},
		{name:'beforeorientationchange',parameters:''},
		{name:'beforerightchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforescrollablechange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforeselectionextend',parameters:'grid,An,extension'},
		{name:'beforeshow',parameters:'sender'},
		{name:'beforestorechange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforetofront',parameters:'tree'},
		{name:'beforetopchange',parameters:'sender,value,oldValue,undefined'},
		{name:'beforewidthchange',parameters:'sender,value,oldValue,undefined'},
		{name:'blur',parameters:'tree,event'},
		{name:'bottomchange',parameters:'sender,value,oldValue'},
		{name:'cellselection',parameters:'grid,selection'},
		{name:'centeredchange',parameters:'sender,value,oldValue'},
		{name:'childdoubletap',parameters:'tree,location'},
		{name:'childlongpress',parameters:'tree,location'},
		{name:'childmouseenter',parameters:'tree,location'},
		{name:'childmouseleave',parameters:'tree,location'},
		{name:'childsingletap',parameters:'tree,location'},
		{name:'childtap',parameters:'tree,location'},
		{name:'childtaphold',parameters:'tree,location'},
		{name:'childtouchcancel',parameters:'tree,location'},
		{name:'childtouchend',parameters:'tree,location'},
		{name:'childtouchmove',parameters:'tree,location'},
		{name:'childtouchstart',parameters:'tree,location'},
		{name:'columnadd',parameters:'tree,column,index'},
		{name:'columnhide',parameters:'tree,column'},
		{name:'columnmenucreated',parameters:'grid,column,menu'},
		{name:'columnmove',parameters:'tree,column,fromIndex,toIndex'},
		{name:'columnremove',parameters:'tree,column'},
		{name:'columnresize',parameters:'tree,column,width'},
		{name:'columnselection',parameters:'grid,selection'},
		{name:'columnshow',parameters:'tree,column'},
		{name:'columnsort',parameters:'tree,column,direction'},
		{name:'deactivate',parameters:'oldActiveItem,tree,newActiveItem'},
		{name:'deselect',parameters:'tree,records'},
		{name:'destroy',parameters:''},
		{name:'disabledchange',parameters:'sender,value,oldValue'},
		{name:'disclose',parameters:'list,record,target,index,event'},
		{name:'dockedchange',parameters:'sender,value,oldValue'},
		{name:'erased',parameters:'sender'},
		{name:'floatingchange',parameters:'sender,positioned'},
		{name:'focus',parameters:'tree,event'},
		{name:'focusenter',parameters:'tree,event'},
		{name:'focusleave',parameters:'tree,event'},
		{name:'fullscreen',parameters:'sender'},
		{name:'heightchange',parameters:'sender,value,oldValue'},
		{name:'hiddenchange',parameters:'sender,value,oldValue'},
		{name:'hide',parameters:'sender'},
		{name:'initialize',parameters:'sender'},
		{name:'itemaction',parameters:'tree,index,record,action'},
		{name:'itemdoubletap',parameters:'tree,index,target,record,e'},
		{name:'itemlongpress',parameters:'tree,index,target,record,e'},
		{name:'itemmouseenter',parameters:'tree,index,target,record,e'},
		{name:'itemmouseleave',parameters:'tree,index,target,record,e'},
		{name:'itemsingletap',parameters:'tree,index,target,record,e'},
		{name:'itemswipe',parameters:'tree,index,target,record,e'},
		{name:'itemtap',parameters:'tree,index,target,record,e'},
		{name:'itemtaphold',parameters:'tree,index,target,record,e'},
		{name:'itemtouchcancel',parameters:'tree,index,target,record,e'},
		{name:'itemtouchend',parameters:'tree,index,target,record,e'},
		{name:'itemtouchmove',parameters:'tree,index,target,record,e'},
		{name:'itemtouchstart',parameters:'tree,index,target,record,e'},
		{name:'leftchange',parameters:'sender,value,oldValue'},
		{name:'load',parameters:'tree,records,successful,operation,node'},
		{name:'maxHeightchange',parameters:'sender,value,oldValue'},
		{name:'maxWidthchange',parameters:'sender,value,oldValue'},
		{name:'minHeightchange',parameters:'sender,value,oldValue'},
		{name:'minWidthchange',parameters:'sender,value,oldValue'},
		{name:'move',parameters:''},
		{name:'moved',parameters:'sender,container,toIndex,fromIndex'},
		{name:'navigate',parameters:'tree,to,from'},
		{name:'nodecollapse',parameters:'node,record'},
		{name:'nodeexpand',parameters:'row,record'},
		{name:'orientationchange',parameters:''},
		{name:'painted',parameters:'sender,element'},
		{name:'positionedchange',parameters:'sender,positioned'},
		{name:'refresh',parameters:'tree'},
		{name:'remove',parameters:''},
		{name:'removed',parameters:'sender,container,index'},
		{name:'renderedchange',parameters:'tree,item,rendered'},
		{name:'resize',parameters:'element,info'},
		{name:'rightchange',parameters:'sender,value,oldValue'},
		{name:'scrollablechange',parameters:'sender,value,oldValue'},
		{name:'select',parameters:'tree,selected'},
		{name:'selectionextenderdrag',parameters:'grid,An,extension'},
		{name:'show',parameters:'sender'},
		{name:'storechange',parameters:'sender,value,oldValue'},
		{name:'tofront',parameters:'tree'},
		{name:'topchange',parameters:'sender,value,oldValue'},
		{name:'updatedata',parameters:'sender,newData'},
		{name:'widthchange',parameters:'sender,value,oldValue'},
		{name:'ready',parameters:''}
];
  public static EVENTNAMES: string[] = [
		'activate',
		'activeItemchange',
		'add',
		'added',
		'beforeactiveItemchange',
		'beforebottomchange',
		'beforecenteredchange',
		'beforedisabledchange',
		'beforedockedchange',
		'beforeheightchange',
		'beforehiddenchange',
		'beforehide',
		'beforeleftchange',
		'beforeload',
		'beforemaxHeightchange',
		'beforemaxWidthchange',
		'beforeminHeightchange',
		'beforeminWidthchange',
		'beforenodecollapse',
		'beforenodeexpand',
		'beforeorientationchange',
		'beforerightchange',
		'beforescrollablechange',
		'beforeselectionextend',
		'beforeshow',
		'beforestorechange',
		'beforetofront',
		'beforetopchange',
		'beforewidthchange',
		'blur',
		'bottomchange',
		'cellselection',
		'centeredchange',
		'childdoubletap',
		'childlongpress',
		'childmouseenter',
		'childmouseleave',
		'childsingletap',
		'childtap',
		'childtaphold',
		'childtouchcancel',
		'childtouchend',
		'childtouchmove',
		'childtouchstart',
		'columnadd',
		'columnhide',
		'columnmenucreated',
		'columnmove',
		'columnremove',
		'columnresize',
		'columnselection',
		'columnshow',
		'columnsort',
		'deactivate',
		'deselect',
		'destroy',
		'disabledchange',
		'disclose',
		'dockedchange',
		'erased',
		'floatingchange',
		'focus',
		'focusenter',
		'focusleave',
		'fullscreen',
		'heightchange',
		'hiddenchange',
		'hide',
		'initialize',
		'itemaction',
		'itemdoubletap',
		'itemlongpress',
		'itemmouseenter',
		'itemmouseleave',
		'itemsingletap',
		'itemswipe',
		'itemtap',
		'itemtaphold',
		'itemtouchcancel',
		'itemtouchend',
		'itemtouchmove',
		'itemtouchstart',
		'leftchange',
		'load',
		'maxHeightchange',
		'maxWidthchange',
		'minHeightchange',
		'minWidthchange',
		'move',
		'moved',
		'navigate',
		'nodecollapse',
		'nodeexpand',
		'orientationchange',
		'painted',
		'positionedchange',
		'refresh',
		'remove',
		'removed',
		'renderedchange',
		'resize',
		'rightchange',
		'scrollablechange',
		'select',
		'selectionextenderdrag',
		'show',
		'storechange',
		'tofront',
		'topchange',
		'updatedata',
		'widthchange',
		'ready'
];
}
@Component({
  selector: 'tree', 
  inputs: treeMetaData.PROPERTIES,
  outputs: treeMetaData.EVENTNAMES,
  providers: [{provide: base, useExisting: forwardRef(() => ExtTreeComponent)}],
  template: '<ng-template></ng-template>'
})
export class ExtTreeComponent extends base implements OnInit,AfterContentInit,OnChanges {
  constructor(
    eRef:ElementRef, @Host() @Optional() @SkipSelf() public hostComponent : base) {
      super(eRef.nativeElement,treeMetaData,hostComponent)
    }
  public ngOnInit() {
    this.baseOnInit(treeMetaData)
  }
  public ngAfterContentInit() {
    this.baseAfterContentInit()
    //this['ready'].emit(this)
  }
  //public ngOnChanges(changes: SimpleChanges) {this.baseOnChanges(changes)}

}