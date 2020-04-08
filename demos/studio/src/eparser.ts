var esprima = require('esprima');
var escodegen = require('escodegen');

export default class Eparser {

    program
    ast
    className
    properties
    itemsArray
    columnsArray

    constructor(program) {
        this.program = program;
        this.ast = esprima.parse(program)
        this.className = this.ast.body[0].expression.arguments[0].value
        if (this.ast.body[0].expression.arguments[1] == 'ObjectExpression') {
            throw 'Second parameter of Ext.define not a Javascript object'
        }
        this.properties = this.ast.body[0].expression.arguments[1].properties

        var items = this.properties.find(o => o.key.name === 'items')
        if (items != undefined) {
            if (items.value.type != 'ArrayExpression') {
                throw 'items is not an array of objects'
            }
            this.itemsArray = items.value.elements
        }

        var columns = this.properties.find(o => o.key.name === 'columns')
        if (columns != undefined) {
            if (columns.value.type != 'ArrayExpression') {
                throw 'columns is not an array of objects'
            }
            this.columnsArray = columns.value.elements
        }


    }

    setProperty(name, value) {
        let obj = this.properties.find(o => o.key.name === name);
        obj.value.value = value
        obj.value.raw = value
        return 0 //need to fix this
    }

    addColumn(text, dataIndex) {
        try {
            var newCol = this.getColumnString(text, dataIndex);
            this.columnsArray.push(JSON.parse(newCol));
            return 0;
        }
        catch(e) {
            return -1
        }
    }

    getProperty(name) {
        let obj = this.properties.find(o => o.key.name === name);
        return obj.value.value
    }


    addRootProperty(name, value) {
        this.properties.push(this.getPropertyString(name, value));
    }

    generate() {
        return escodegen.generate(this.ast);
    }



    getColumnString(text, dataIndex) {
        var textProperty = this.getPropertyString('text', text)
        var dataIndexProperty = this.getPropertyString('dataIndex', dataIndex)

        var obj = `{
            "type": "ObjectExpression",
            "properties": [
                ${textProperty},
                ${dataIndexProperty}
            ]
        }`
        return obj
    }

    getPropertyString(key, value) {
        var obj = `{
            "type": "Property",
            "key": {
                "type": "Identifier",
                "name": "${key}"
            },
            "computed": false,
            "value": {
                "type": "Literal",
                "value": "${value}",
                "raw": "'${value}'"
            },
            "kind": "init",
            "method": false,
            "shorthand": false
        }`
        return obj
    }
    
    changeRootProperty(name, value) {
        let obj = this.properties.find(o => o.key.name === name);
        obj.value.value = value
        obj.value.raw = value
    }

}