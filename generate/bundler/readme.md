-------------------------------------------------------
-------------------------------------------------------
WORKING ASSETS
-------------------------------------------------------
-------------------------------------------------------

# EXT-ALL FROM MANIFEST: 
```
sencha compile -d -cl=Ext concat -st --closure --input-js-version ES6 --js-version ES6 --compress -out=./build/all/ext.all.dev.js then fs minify -closure -l=NEXT -f=./build/all/ext.all.dev.js -t=./build/all/ext.all.prod.js
```

# EXT GRID DELTA FILE:
sencha compile -d exclude -all and include -r -na=Ext.grid and exclude -tag=core and exclude -r -na=Ext.Widget and exclude -na=Ext.data.request.Base and exclude -na=Ext.data.flash.BinaryXhr and exclude -na=Ext.data.request.Ajax and exclude -na=Ext.data.request.Form and exclude -na=Ext.data.Connection and exclude -na=Ext.Ajax and exclude -na=Ext.util.BasicFilter and exclude -na=Ext.util.Filter and exclude -na=Ext.util.AbstractMixedCollection and exclude -na=Ext.util.Sorter and exclude -na=Ext.util.Sortable and exclude -na=Ext.util.MixedCollection and exclude -na=Ext.util.CollectionKey and exclude -na=Ext.util.Grouper and exclude -na=Ext.util.Collection and exclude -na=Ext.data.Range and exclude -na=Ext.util.ObjectTemplate and exclude -na=Ext.data.schema.Role and exclude -na=Ext.data.schema.Association and exclude -na=Ext.data.schema.OneToOne and exclude -na=Ext.data.schema.ManyToOne and exclude -na=Ext.data.schema.ManyToMany and exclude -na=Ext.util.Inflector and exclude -na=Ext.data.schema.Namer and exclude -na=Ext.data.schema.Schema and exclude -na=Ext.data.AbstractStore and exclude -na=Ext.data.Error and exclude -na=Ext.data.ErrorCollection and exclude -na=Ext.data.operation.Operation and exclude -na=Ext.data.operation.Create and exclude -na=Ext.data.operation.Destroy and exclude -na=Ext.data.operation.Read and exclude -na=Ext.data.operation.Update and exclude -na=Ext.data.SortTypes and exclude -na=Ext.data.validator.Validator and exclude -na=Ext.data.field.Field and exclude -na=Ext.data.field.Boolean and exclude -na=Ext.data.field.Date and exclude -na=Ext.data.field.Integer and exclude -na=Ext.data.field.Number and exclude -na=Ext.data.field.String and exclude -na=Ext.data.identifier.Generator and exclude -na=Ext.data.identifier.Sequential and exclude -na=Ext.data.Model and exclude -na=Ext.data.ResultSet and exclude -na=Ext.data.reader.Reader and exclude -na=Ext.data.writer.Writer and exclude -na=Ext.data.proxy.Proxy and exclude -na=Ext.data.proxy.Client and exclude -na=Ext.data.proxy.Memory and exclude -na=Ext.data.ProxyStore and exclude -na=Ext.util.Group and exclude -na=Ext.data.Group and exclude -na=Ext.data.LocalStore and exclude -na=Ext.data.proxy.Server and exclude -na=Ext.data.proxy.Ajax and exclude -na=Ext.data.reader.Json and exclude -na=Ext.data.writer.Json and exclude -na=Ext.util.SorterCollection and exclude -na=Ext.util.FilterCollection and exclude -na=Ext.util.GroupCollection and exclude -na=Ext.data.Store and exclude -na=Ext.data.reader.Array and exclude -na=Ext.data.ArrayStore and exclude -na=Ext.data.StoreManager and exclude -na=Ext.util.ItemCollection and exclude -na=Ext.mixin.Queryable and exclude -na=Ext.mixin.Container and exclude -na=Ext.util.KeyMap and exclude -na=Ext.util.KeyNav and exclude -na=Ext.mixin.FocusableContainer and exclude -na=Ext.Container and exclude -na=Ext.mixin.Hookable and exclude -na=Ext.util.Wrapper and exclude -na=Ext.layout.wrapper.BoxDock and exclude -na=Ext.layout.wrapper.Inner and exclude -na=Ext.layout.Auto and exclude -na=Ext.Indicator and exclude -na=Ext.layout.card.fx.Abstract and exclude -na=Ext.layout.card.fx.Style and exclude -na=Ext.layout.card.fx.Cover and exclude -na=Ext.layout.card.fx.Cube and exclude -na=Ext.layout.card.fx.Serial and exclude -na=Ext.layout.card.fx.Fade and exclude -na=Ext.layout.card.fx.Flip and exclude -na=Ext.layout.card.fx.Pop and exclude -na=Ext.layout.card.fx.Reveal and exclude -na=Ext.layout.card.fx.Scroll and exclude -na=Ext.layout.card.fx.ScrollCover and exclude -na=Ext.layout.card.fx.ScrollReveal and exclude -na=Ext.layout.card.fx.Slide and exclude -na=Ext.layout.Card and exclude -na=Ext.viewport.Default and exclude -na=Ext.viewport.Ios and exclude -na=Ext.viewport.Android and exclude -na=Ext.viewport.WindowsPhone and exclude -na=Ext.viewport.Viewport and exclude -na=Ext.data.Batch and exclude -na=Ext.util.Fly and exclude -na=Ext.parse.Tokenizer and exclude -na=Ext.parse.Symbol and exclude -na=Ext.parse.symbol.Constant and exclude -na=Ext.parse.symbol.Infix and exclude -na=Ext.parse.symbol.InfixRight and exclude -na=Ext.parse.symbol.Paren and exclude -na=Ext.parse.symbol.Prefix and exclude -na=Ext.parse.Parser and exclude -na=Ext.app.bind.Parser and exclude -na=Ext.data.ChainedStore and exclude -na=Ext.direct.Manager and exclude -na=Ext.data.Request and exclude -na=Ext.data.Validation and exclude -na=Ext.util.TextMetrics and exclude -na=Ext.Button and exclude -na=Ext.Title and exclude -na=Ext.Spacer and exclude -na=Ext.layout.Box and exclude -na=Ext.Toolbar and exclude -na=Ext.panel.Buttons and exclude -na=Ext.Tool and exclude -na=Ext.mixin.Toolable and exclude -na=Ext.Panel and exclude -na=Ext.LoadMask and exclude -na=Ext.tip.ToolTip and exclude -na=Ext.panel.Title and exclude -na=Ext.panel.Header and concat -st --closure --input-js-version ES6 --js-version ES6 --compress -out=./test/ext.grid.dev.js then fs minify -closure -l=NEXT -f=./test/ext.grid.dev.js -t=./test/ext.grid.prod.js

# EXT RECURSIVE WIDGET CORE FILE:
sencha compile -d -cl=Ext exclude -all and include -r -na=Ext.Widget and include -tag=core and include -na=Ext.Class and include -na=Ext.Base and include -na=Ext.Array and include -na=Ext.Boolean and include -na=Ext.Date and include -na=Ext.Function and include -na=Ext.Global_CSS and include -na=Ext.Number and include -na=Ext.Object and include -na=Ext.RegExp and include -na=Ext.String and include -r -na=Ext.app and concat -st --closure --input-js-version ES6 --js-version ES6 --compress -out=./test/ext.widget.dev.js then fs minify -closure -l=NEXT -f=./test/ext.widget.dev.js -t=./test/ext.widget.prod.js

# EXT CORE FILE:
sencha compile -d -cl=Ext exclude -all and include -r -na=Ext.app and concat -st --closure --input-js-version ES6 --js-version ES6 --compress -out=./test/ext.core.dev.js then fs minify -closure -l=NEXT -f=./test/ext.core.dev.js -t=./test/ext.core.prod.js

# HTML TESTING TEMPLATE:
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">
  <title>Title</title>

  <!-- Ext JS -->
  <!-- <script src="./ext-modern-all-debug.js"></script> -->
  <script src="./ext.all.prod.js"></script>

  <!-- Ext JS Theme -->
  <link href="/resources/theme-material-all-debug.css" rel="stylesheet" />
</head>
<body>
  <script>
    Ext.application({
      name: 'MyApp',
      launch: function () {
        var store = Ext.create('Ext.data.Store', {
            fields: ['name', 'email', 'phone'],
            data: [
                { 'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
                { 'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
                { 'name': 'Homer', "email":"home@simpsons.com",  "phone":"555-222-1244"  },
                { 'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
            ]
        });

        Ext.Viewport.add({
            xtype: 'grid',
            title: 'Test Grid',
            store: store,
            columns: [
                { text: 'Name',  dataIndex: 'name', width: 200 },
                { text: 'Email', dataIndex: 'email', width: 250 },
                { text: 'Phone', dataIndex: 'phone', width: 120 }
            ],
            height: 200,
            layout: 'fit',
            fullscreen: true
        });
      }
    });
  </script>
</body>
</html>

-------------------------------------------------------
-------------------------------------------------------
OLD STUFF
-------------------------------------------------------
-------------------------------------------------------
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

