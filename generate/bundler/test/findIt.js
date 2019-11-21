const fs = require(`fs-extra`);
const path = require(`path`);
// var str = fs.readFileSync(path.resolve(`./ext.core.prod.js`)).toString()
// var str = fs.readFileSync(path.resolve(`./ext.grid.prod.js`)).toString()
var str = fs.readFileSync(path.resolve(`./ext.button.prod.js`)).toString()
var classes = []
var regex = /Ext.define\('Ext./gi
var result
while ( (result = regex.exec(str)) ) {
    var rawString = str.substring(result.index, result.index+100);
    var n = rawString.indexOf(`,`);
    var theClass = str.substring(result.index+12, result.index+n-1);
    classes.push(theClass)
}
classes.sort();
var countSorted = 0
classes.forEach(function(classSorted) {
  countSorted++;
  var zeroFilledSorted = (`000` + countSorted).substr(-3);
  console.log(zeroFilledSorted + ` ` + classSorted)
})