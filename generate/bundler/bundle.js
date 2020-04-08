var install = true;
let run = require("./util").run;
let writeTemplateFile = require("./util").writeTemplateFile;

var main = exports.main = (packagename) => {
    return new Promise(function(resolve, reject) {
        if (packagename == undefined) {
            console.log('packagename is missing');
            resolve(false)
        }
        var origCwd = process.cwd();
        process.chdir(__dirname);
        
        var info = {};
        info.packagename = packagename;
        info.creates = require("./npmpackage/" + packagename).getCreates();
        console.log("./npmpackage/" + packagename)

        writeTemplateFile(`./template/app.json.tpl`,`app.json`,info); console.log(`./app.json` + ' created');
        writeTemplateFile(`./template/package.json.tpl`,`package.json`,info); console.log(`./package.json` + ' created');
        writeTemplateFile(`./template/css.manifest.js.tpl`,`./manifest/${packagename}.css.manifest.js`,info); console.log(`./manifest/${packagename}.css.manifest.js` + ' created');
        writeTemplateFile(`./template/ext.manifest.js.tpl`,`./manifest/${packagename}.ext.manifest.js`,info); console.log(`./manifest/${packagename}.ext.manifest.js` + ' created');

        if (install == true) {doInstall()}
        async function doInstall() {
            await run(`npm start`);
            console.log('./dist/css.' + packagename + '.js created')
            console.log('./dist/ext.' + packagename + '.js created')
            process.chdir(origCwd);
            resolve(true)
        }
    })

}

// var packagename = process.argv[2]
// if (packagename == undefined) {
//     console.log('packagename is missing');
//     return
// }
//main(process.argv[2])
