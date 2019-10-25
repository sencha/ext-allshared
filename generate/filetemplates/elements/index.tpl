<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">
    <script type="text/javascript" src="./node_modules/@sencha/ext-elements-all/ext/css.all.js"></script>
    <script type="text/javascript" src="./node_modules/@sencha/ext-elements-all/ext/ext.all.js"></script>
    <script type="text/javascript" src="./node_modules/@sencha/ext-elements-all/src/ElementCell.js"></script>
    <script type="module" src="./node_modules/@sencha/ext-elements-all/src/ext-grid.component.js"></script>
    <script type="module" src="./node_modules/@sencha/ext-elements-all/src/ext-gridcolumn.component.js"></script>
    <script type="module" src="./node_modules/@sencha/ext-elements-all/src/ext-button.component.js"></script>
    <script type="module" src="./node_modules/@sencha/ext-elements-all/src/ext-panel.component.js"></script>
</head>

<script>
    window.main = {}
    window.main.onReady = function(event) {
        console.log('ready')
        console.log(event)

        // event.detail.ext.setData([
        //     {"name": "Lisa3", "email": "lisa@simpsons.com", "phone": "555-111-1224"},
        //     {"name": "Bart", "email": "bart@simpsons.com", "phone": "555-222-1234"},
        //     {"name": "Homer", "email": "homer@simpsons.com", "phone": "555-222-1244"},
        //     {"name": "Marge", "email": "marge@simpsons.com", "phone": "555-222-1254"}
        // ])


        var element = document.getElementById('button');
        element.innerHTML = '<ext-button text="hello"></ext-buton>';
        theButton = element.querySelector('ext-button');

        theButton.addEventListener("tap", function (event) {
            console.log(event.detail)
            console.log('hi')
            theButton.text = "h2"
        });
    }
    window.main.onTap = function() {
        console.log('tap')
    }
</script>

<body>

    <div style="height:500px;width:300px;">
        <ext-panel fitToParent="true" onready="main.onReady" title="the panel" layout="hbox" shadow="true">
            <ext-button text="1"></ext-button>
            <div>element 2</div>
            <div>element 3</div>
            <ext-button text="4"></ext-button>
            <div>element 5</div>
        </ext-panel>
    </div>





    <!-- <ext-grid
        onready="main.onReady"
        title="the grid"
        height="250px"
        xcolumns='[
            {"text": "Name", "width": "250", "dataIndex": "name"},
            {"text": "Email Address", "flex": "1", "dataIndex": "email"},
            {"text": "Phone Number", "width": "250", "dataIndex": "phone"}
        ]'
        xdata='[
            {"name": "Lisa", "email": "lisa@simpsons.com", "phone": "555-111-1224"},
            {"name": "Bart", "email": "bart@simpsons.com", "phone": "555-222-1234"},
            {"name": "Homer", "email": "homer@simpsons.com", "phone": "555-222-1244"},
            {"name": "Marge", "email": "marge@simpsons.com", "phone": "555-222-1254"}
        ]'
    >
        <ext-gridcolumn width="250px" text="Name" dataIndex="name"></ext-gridcolumn>
        <ext-gridcolumn flex="1" text="Email Address" dataIndex="email"></ext-gridcolumn>
        <ext-gridcolumn  width="250px" text="Phone Number" dataIndex="phone"></ext-gridcolumn>
    </ext-grid> -->
    <div id="button"></div>
</body>

</html>
