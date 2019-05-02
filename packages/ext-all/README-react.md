## Getting Started with ExtWebComponents and React.js

  Note:  This approach does not utilize @sencha/ext-webpack-plugin

  1 - run create-react-app

      npx create-react-app ewc-react-app
      cd ewc-react-app

  2 - add to package.json:

      - in 'scripts' section:

    "install": "node ./node_modules/@sencha/ext-all/install-react.js",

      -  in 'dependencies' section: 

    "@sencha/ext-web-components": "~7.0.0",
    "@sencha/ext-all": "~7.0.0",

  3 - run 'npm install' (for lerna: run 'npm install' at the root)

  4 - run 'npm start'
