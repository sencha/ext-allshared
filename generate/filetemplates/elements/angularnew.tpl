//import EWC{Xtype} from '../dist/ext-{xtype}.component.js';
//(new EWC{Xtype}()).properties
import EWC{Xtype} from '@sencha/ext-web-components{bundle}/dist/ext-{xtype}.component.js';
import {
    Host,
    Optional,
    SkipSelf,
    Component,
    ElementRef,
    forwardRef,
    ViewContainerRef
  } from '@angular/core';
import { EngBase } from './angularbase';

class Ext{Xtype}Component extends EngBase {
    /**
     * @param {?} eRef
     * @param {?} hostComponent
     * @param {?} vc
     */
    constructor(eRef, hostComponent, vc) {
        super(
          eRef,
          hostComponent,
          {propNames},
          (new EWC{Xtype}()).events,
          (new EWC{Xtype}()).eventnames,
          vc);
        this.xtype = '{xtype}';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.baseOnInit();
    }
    /**
     * @return {?}
     */
    public ngAfterViewInit() {
        this.baseAfterViewInit()
    }
    /**
     * @return {?}
     */
    public ngOnChanges(changes) {
        this.baseOnChanges(changes)
    }
    /**
     * @return {?}
     */
    public ngOnDestroy() {
        this.baseOnDestroy()
    }
}
Ext{Xtype}Component['decorators'] = [
    {
      type: Component,
      args: [{
        inputs: (new EWC{Xtype}()).properties,
        outputs: (new EWC{Xtype}()).eventnames,
        selector: 'Ext{Xtype}',
        providers: [{
            provide: EngBase,
            useExisting: forwardRef(() => Ext{Xtype}Component)
        }],
        template: '<ng-content></ng-content>'
    },] },
];
/** @nocollapse */
Ext{Xtype}Component['ctorParameters'] = () => [
    { type: ElementRef, },
    { type: EngBase, decorators: [{ type: Host }, { type: Optional }, { type: SkipSelf },] },
    { type: ViewContainerRef, },
];

export { Ext{Xtype}Component };
