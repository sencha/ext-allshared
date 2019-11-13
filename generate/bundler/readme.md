CLI Build steps:
1) Full Build: sencha compile -cl=./manifest/grid.ext.manifest.js load-app -te=./build/grid/temp -ta=App then compile -d exclude -all and include -f=Boot.js and include -r -tag=overrides and include -r -f=./manifest/grid.ext.manifest.js and exclude -f=./manifest/grid.ext.manifest.js  and concat --closure --input-js-version ES6 --js-version ES6 --compress -out=./build/grid/ext.grid.dev.js then fs minify -closure -l=NEXT -f=./build/grid/ext.grid.dev.js -t=./build/grid/ext.grid.prod.js then compile scss -appName=App -imageSearchPath=resources -themeName=triton -resourceMapBase=. -output=./build/grid/ext.grid.scss and resources --excludes=-all\*.css -out=./build/grid and resources -model=true -out=./build/grid then fashion -pwd=. -split=4095 -compress ./build/grid/ext.grid.scss ./build/grid/ext.grid.css

2) All needed Ext without styles resources: sencha compile -cl=./manifest/grid.ext.manifest.js load-app -te=./build/grid/temp -ta=App then compile -d exclude -all and include -f=Boot.js and include -r -tag=overrides and include -r -f=./manifest/grid.ext.manifest.js and exclude -f=./manifest/grid.ext.manifest.js  and concat -st --closure --input-js-version ES6 --js-version ES6 --compress -out=./build/grid/ext.grid.dev.js then fs minify -closure -l=NEXT -f=./build/grid/ext.grid.dev.js -t=./build/grid/ext.grid.prod.js

3) All styles resources: sencha compile scss -appName=App -imageSearchPath=resources -themeName=triton -resourceMapBase=. -output=./build/grid/ext.grid.scss and resources --excludes=-all\*.css -out=./build/grid and resources -model=true -out=./build/grid then fashion -pwd=. -split=4095 -compress ./build/grid/ext.grid.scss ./build/grid/ext.grid.css

4) EXT-GRID DELTA FILE BARE BONES -- only the manifest sources and what's needed for Ext.grid: Load all necessary Ext.grid namespace and recursive traversal from the manifest file, removing all Ext core (@core): sencha compile -d -cl=./manifest/grid.ext.manifest.js exclude -all and exclude -tag=core and include -namespace=Ext.grid and include -r -f=./manifest/grid.ext.manifest.js and concat -st --closure --input-js-version ES6 --js-version ES6 --compress -out=./build/grid/ext.grid.dev.js then fs minify -closure -l=NEXT -f=./build/grid/ext.grid.dev.js -t=./build/grid/ext.grid.prod.js

RECURSIVE, LARGE OUTPUT:
sencha compile -d -cl=./manifest/grid.ext.manifest.js exclude -all and exclude -tag=core and include -r -namespace=Ext.grid and include -r -f=./manifest/grid.ext.manifest.js and concat -st --closure --input-js-version ES6 --js-version ES6 --compress -out=./build/grid/ext.grid.dev.js then fs minify -closure -l=NEXT -f=./build/grid/ext.grid.dev.js -t=./build/grid/ext.grid.prod.js

5) EXT-CORE ONLY: sencha compile -d exclude -all and include -tag=core and include -tag=class and include -namespace=Ext.Base and concat -st --closure --input-js-version ES6 --js-version ES6 --compress -out=./build/core/ext.core.dev.js then fs minify -closure -l=NEXT -f=./build/core/ext.core.dev.js -t=./build/core/ext.core.prod.js

RECURSIVE WIDGET: sencha compile -d exclude -all and include -r -na=Ext.Widget and include -r -na=Ext.Data and include -r -na=Ext.data.Store and concat -st --closure --input-js-version ES6 --js-version ES6 --compress -out=./build/core/ext.core.dev.js then fs minify -closure -l=NEXT -f=./build/core/ext.core.dev.js -t=./build/core/ext.core.prod.js



sencha compile -d exclude -all and include -tag=core and include -na=Ext.Class and include -na=Ext.Base and include -na=Ext.Array and include -na=Ext.Boolean and include -na=Ext.Date and include -na=Ext.Function and include -na=Ext.Global_CSS and include -na=Ext.Number and include -na=Ext.Object and include -na=Ext.RegExp and include -na=Ext.String and concat -st --closure --input-js-version ES6 --js-version ES6 --compress -out=./build/core/ext.core.dev.js then fs minify -closure -l=NEXT -f=./build/core/ext.core.dev.js -t=./build/core/ext.core.prod.js


sencha compile include -all concat -st --closure --input-js-version ES6 --js-version ES6 --compress -out=./build/grid/ext.grid.dev.js