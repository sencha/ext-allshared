# ext-angular-grid

This npm package contains the minimum files that are needed to provide for the ext-grid ExtAngular element for an Angular application

The npm package also contains a 'demo' folder with code that can be used to create a demo Angular CLI generated app that utilizes the ExtAngular ext-grid component

## test with an Angular CLI generated app

### install Angular CLI

```sh
npm install -g @angular/cli
```

should be @angular/cli@8.2.1

### create a new Angular CLI application

```sh
ng new projname
```

click enter for each of the prompts (2 of them)

### add ExtAngular to the generated Angular CLI application

```sh
cd projname
npm install @sencha/ext-angular-grid
npm install http-server
code .
```

in package.json under scripts, add the following:

```sh
"http": "npx http-server dist/projname -g -o",
```

note: replace 'projname' with actual project name

### copy demo from npm package

```sh
cp -R ./node_modules/@sencha/ext-angular-grid/demo/src ./
cp -R ./node_modules/@sencha/ext-angular-grid/demo/assets ./src
```

### run a production build

```sh
npm run build
npm run http
```

the ExtAngular application will load in a browser - the application is a simple grid

----------------

#### steps to build npm package

```sh
cd ~/_git/sencha/ext-allshared/generators/grid
npm install
npm run packagr; cp -R demo/ dist/demo/; cd dist; npm publish -force
```

#### steps for local npm build

```sh
npm pack (used to build a local zip package)
cp -R  ./sencha-ext-angular-grid-7.0.0.tgz   ../../../../ext-angular/packages/
cp -R  ./sencha-ext-angular-grid-7.0.0.tgz   /Volumes/BOOTCAMP/aaPlayground/
cd /Volumes/BOOTCAMP/aaPlayground/

npm install ../sencha-ext-angular-grid-7.0.0.tgz

(results in...)
"@sencha/ext-angular-grid": "file:../sencha-ext-angular-grid-7.0.0.tgz",
```