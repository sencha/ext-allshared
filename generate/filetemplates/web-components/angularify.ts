import assign from 'object-assign';
//import pascalCase from 'pascal-case';
import {
    Component,
    ElementRef
  } from '@angular/core';

export default function (CustomElement) {

    var sel = ''

    console.log('default function')
    //opts = assign({}, defaults, opts);
    if (typeof CustomElement !== 'function') {
        throw new Error('Given element is not a valid constructor');
    }
    var tagName = (new CustomElement()).tagName;
    console.log('after CustomElement: ' + tagName)

    function toPascalCase(s) {
        return s.match(/[a-z]+/gi)
          .map(function (word) {
            return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
          })
          .join('')
      }

      var pascalName = toPascalCase(tagName)


    //tagName = tagName.replace(/(\w)(\w*)/g,
    //function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});


    //const displayName = pascalCase(tagName);
    console.log(pascalName)


    //console.log(CustomElement)




    @Component({
        selector: pascalName,
        //inputs: ExtButtonMetaData.PROPERTIES,
        //outputs: ExtButtonMetaData.EVENTNAMES,
        template: '<ng-template></ng-template>'
      })
      class ExtComponent {
          xtype: string;
          newDiv: any;
          node: any;
          constructor(eRef: ElementRef){
              this.node = eRef.nativeElement;
              //this.xtype = 'button';
              console.log('constructor')
          }

          public ngOnInit() {

          }

          public ngAfterViewInit() {
              this.newDiv = document.createElement(tagName);
              //var t = document.createTextNode(sel);
              //this.newDiv.appendChild(t);
              //console.log(this.node)
              this.node.insertAdjacentElement('beforebegin', this.newDiv);
          }

          public ngOnChanges(changes) {

          }

          public ngOnDestroy() {

          }
      }

      return ExtComponent

}