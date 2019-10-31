<!DOCTYPE HTML>
<html>
<head>
<style>
body{
  margin: 0;
  color: #fff;
}
.wrapper{
  min-height: 100vh;
  background: #ccc;
  display: flex;
  flex-direction: column;
}
.header, .footer{
  height: 50px;
  background: #666;
}
.content {
  flex: 1;
  background: #999;
  display: flex;
  color: #000;
}
.columns{
  display: flex;
  flex: 1;
}
.main{
  flex: 1;
  background: #eee;
  position: relative;
}
.sidebar{
  width: 300px;
  background: #ccc;
  position: relative;
}

.left{

    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    overflow-x: hidden;
}

.right{
    width: 100%;
    height: 100%;
}


</style>

<script>
function selectDoc(xtype) {
    console.log(xtype)
    //var xtype = 'accordion'
    //var theFrame = '<iframe width="560" height="315" src="http://127.0.0.1:5501/generators/ext-component-creator/GeneratedFolders/ext-ewc/src/lib/ext-' + xtype + '.doc.html" frameborder="0" allowfullscreen></iframe>'
    var theFrame = '<iframe class="right" xstyle="position: absolute;bottom: 0;" src="ext-' + xtype + '.doc.html" frameborder="0" allowfullscreen></iframe>'
    console.log(theFrame)
    var frame = document.getElementById( "contentFrame" )
    frame.innerHTML = theFrame
}
</script>



</head>
<body>

<div class="wrapper">
    <header class="header">Header: Fixed height</header>
    <section class="content">
        <div class="columns">
            <aside class="sidebar">
                <div class="left">{includedxtypes}</div>
            </aside>
            <main class="main" id="contentFrame">

            </main>
        </div>
    </section>
    <footer class="footer">Footer: Fixed height</footer>
</div>

</body>
</html>