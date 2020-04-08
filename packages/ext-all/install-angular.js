const path = require('path')
const fs = require('fs-extra')

console.log('Running install-angular')

var nodeDir = path.resolve(__dirname)
var currDir = process.cwd()

var pkg = (fs.existsSync(currDir + '/package.json') && JSON.parse(fs.readFileSync(currDir + '/package.json', 'utf-8')) || {});
var isAngular = pkg.devDependencies['@angular/cli']

if (isAngular != undefined) {
  fs.copy(path.resolve(nodeDir, 'common', 'public'), path.resolve(currDir, 'src', 'assets'), function (err) {
    if (err){
      console.log('An error occured while copying the common/public folder')
      return console.error(err)
    }
  })
  fs.copy(path.resolve(nodeDir, 'angular', 'src'), path.resolve(currDir, 'src'), function (err) {
    if (err){
      console.log('An error occured while copying the angular/src folder')
      return console.error(err)
    }
  });
  console.log('Install completed');
  // fs.copy(path.resolve(nodeDir, 'angular', 'src', 'app'), path.resolve(currDir, 'src', 'app'), function (err) {
  //   if (err){
  //     console.log('An error occured while copying the angular/src/app folder')
  //     return console.error(err)
  //   }
  //   console.log('Install completed')
  // });
}
else {
  console.log('Install NOT completed')
}
