const fs = require("fs-extra");
const path = require("path");
var str = fs.readFileSync(path.resolve('../GeneratedFolders/button/ext-angular-button/ext-runtime/button.js')).toString()
//console.log(s)

//var items = []
var classes = []
var regex = /Ext.define\('Ext./gi, result
var count = 0
while ( (result = regex.exec(str)) ) {
    var rawString = str.substring(result.index, result.index+100);
    //console.log(rawString)
    var n = rawString.indexOf(',');

    var theClass = str.substring(result.index+12, result.index+n-1);
    //console.log(theClass)
    classes.push(theClass)
    count++;
    //console.log(count)
    //var zeroFilled = ('000' + count).substr(-3)
      //console.log(zeroFilled + ' ' + theClass)

    //}
    //.push(str.substring(result.index, result.index+n));
}
//console.log(items)
//console.log(itemsAll)
//console.log(count)

//console.log(classes)

classes.sort();
var countSorted = 0
classes.forEach(function(classSorted) {
  countSorted++;
  var zeroFilledSorted = ('000' + countSorted).substr(-3);
  console.log(zeroFilledSorted + ' ' + classSorted)

})

//console.log(classes.sort());