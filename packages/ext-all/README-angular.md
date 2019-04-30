## Getting Started with ExtWebComponents and Angular

  Note:  This approach does not utilize @sencha/ext-webpack-plugin

  1 - run Angular CLI

      npm install -g @angular/cli

      ng new ewc-angular-app
        Would you like to add Angular routing? N
        Which stylesheet format would you like to use? CSS
      
      cd ewc-angular-app

  2 - add to package.json:

        - in 'scripts' section:

    "install": "node ./node_modules/@sencha/ext-all/install-angular.js",

      -  in 'dependencies' section: 

    "@sencha/ext-web-components": "~7.0.0",
    "@sencha/ext-all": "~7.0.0",

  3 - run 'npm install' (for lerna: run 'npm install' at the root)

  4 - run 'ng serve'
