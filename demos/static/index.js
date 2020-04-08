// //import Ext_Evented_Component from './Ext/Evented';
// const Evented = require('./Ext/Evented')

// var e = new Evented()

/**
 * Classes and Inheritance
 * Code Example from http://www.es6fiddle.net/
 */
class Polygon {

    extendObject(obj, src) {
        if (obj == undefined) {obj = {}}
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    }

    extendArray(obj, src) {
        if (obj == undefined) {obj = []}
        Array.prototype.push.apply(obj,src);
        return obj;
    }

    constructor(height, width, propertiesobject) { //class constructor
//        console.log('polygon constructor')
//        console.dir(propertiesobject)
//        console.dir(Polygon.PROPERTIESOBJECT)
      this.PROPERTIESOBJECT = this.extendObject(propertiesobject, Polygon.PROPERTIESOBJECT());
//console.dir(this.PROPERTIESOBJECT)
      //this.name = 'Polygon';
      //this.height = height;
      //this.width = width;
    }


    static PROPERTIESOBJECT() { return {
        "p1":["boolean"],
        "p2":["boolean"]
    }}

    static get observedAttributes() {
        //console.log('Polygon observedAttributes')
        var attrs = []
        for (var property in Polygon.PROPERTIESOBJECT()) {
            attrs.push(property)
        }
        // this.EVENTS().forEach(function (eventparameter, index, array) {
        //     attrs.push('on' + eventparameter.name)
        // })
        // attrs.push('on' + 'ready')
 //       console.log(attrs)
        return attrs
    }



    sayName() { //class method
      //console.log('Hi, I am a', this.name + '.');
    }
  }

  class Square extends Polygon {

    static PROPERTIESOBJECT() { return {
        "p3":["boolean"],
        "p4":["boolean"]
    }}

    static get observedAttributes() {
//        console.log('Square observedAttributes')
        //var p = super.observedAttributes
//        console.log('p')
//        console.log(p)
        var attrs = super.observedAttributes
        for (var property in Square.PROPERTIESOBJECT()) {
            attrs.push(property)
        }


        // this.EVENTS().forEach(function (eventparameter, index, array) {
        //     attrs.push('on' + eventparameter.name)
        // })
        // attrs.push('on' + 'ready')
        return attrs
    }

    constructor(length=10) { // ES6 features Default Parameters
        //console.log('square constructor')
        super(length, length, Square.PROPERTIESOBJECT()); //call the parent method with super
      this.PROPERTIESOBJECT = this.extendObject(this.PROPERTIESOBJECT, Square.PROPERTIESOBJECT());


      this.name = 'Square';
    }

    get area() { //calculated attribute getter
      return this.height * this.width;
    }
  }


  let a = Square.observedAttributes
  console.log('static')
  console.log(a)

  //let s = new Square(5);

  //s.sayName(); // => Hi, I am a Square.
  //console.log(s.area); // => 25

  //console.log(new Square().area); // => 100