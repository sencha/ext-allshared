const reset = "\x1b[0m"
const bright = "\x1b[1m"
const dim = "\x1b[2m"
const underscore = "\x1b[4m"
const blink = "\x1b[5m"
const reverse = "\x1b[7m"
const hidden = "\x1b[8m"

const black = "\x1b[30m"
const red = "\x1b[31m"
const green = "\x1b[32m"
const yellow = "\x1b[33m"
const blue = "\x1b[34m"
const magenta = "\x1b[35m"
const cyan = "\x1b[36m"
const white = "\x1b[37m"

const BGblack = "\x1b[40m"
const BGred = "\x1b[41m"
const BGgreen = "\x1b[42m"
const BGyellow = "\x1b[43m"
const BGblue = "\x1b[44m"
const BGmagenta = "\x1b[45m"
const BGcyan = "\x1b[46m"
const BGwhite = "\x1b[47m"




function color(s) {
//  var boldredcolor = `\x1b[31m\x1b[1m`
  var endMarker = `\x1b[0m`
  return (`${magenta}${s}${endMarker}`)
}

exports.run = (parm, cwd) => {
  var all = parm.split(' ')
  var command = all[0]
  var args = all.slice(1)
  if (cwd == undefined) {cwd = process.cwd()}
  return promise = new Promise((resolve, reject) => {
    let options = {cwd: cwd, stdio: 'inherit', encoding: 'utf-8'}
    console.log(color(command + ' ' + args.toString().replace(',', ' ')) + ' in ' + cwd)
    let child = require('child_process').spawn(command, args, options)
    child.on('close', (code, signal) => {resolve({code, signal})})
    child.on('error', (error) => {reject(error)})
  })
}

exports.writeTemplateFile =(tplFile, outFile, vars) => {
    require("./XTemplate");
    var path = require("path");
    var fs = require("fs-extra");
    //var tpl = new Ext.XTemplate(fs.readFileSync(path.resolve(tplFile)).toString());
    var tpl = new Ext.XTemplate(fs.readFileSync(tplFile));

    //console.log(tplFile)
    //console.log(path.resolve(tplFile)).toString()
    var t = tpl.apply(vars);
    fs.writeFileSync(outFile, t);
    //console.log(outFile)
    delete tpl;
}

exports.getCreatesForPackage = (xtypes, classes) => {
    var creates = ''
    var i;
    for (i = 0; i < xtypes.length; i++) {
        creates += 'Ext.create({"xtype":"' + xtypes[i] + '"});' + '\n';
    }
    for (i = 0; i < classes.length; i++) {
        creates += 'Ext.create("' + classes[i] + '",{});' + '\n';
    }
    return creates;
}
