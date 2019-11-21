<!DOCTYPE HTML>
<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<script src="z-tabs.js"></script>

<script>
function changeProperty() {
  var x = document.getElementById("propertiesDocs").value;
  document.getElementById("property").innerHTML = x;
}
function changeMethod() {
  var x = document.getElementById("methodsDocs").value;
  document.getElementById("method").innerHTML = x;
}
function changeEvent() {
  var x = document.getElementById("eventsDocs").value;
  document.getElementById("event").innerHTML = x;
}
</script>

</head>
<body>

<div>
{allXtypes}





<!--
<div class="heading">&lt;ext-{xtype}&gt;&lt;/ext-{xtype}&gt;</div>
-->

<div class="heading">ext-{xtype}</div>
<br>
<pre>{text200}...</pre>
<br>
<div><b>JavaScript:</b></div>

<pre class="code">
import '@sencha/ext-web-components/lib/ext-{xtype}.component';

{xtype}Ready(event) {
  this.{Xtype}Cmp = event.detail.cmp;
}
</pre>

<div><b>HTML:</b></div>
<pre class="code">
&lt;ext-{xtype} onready="{xtype}Ready"&gt;&lt;/ext-{xtype}&gt;
</pre>


<!--
<pre class="code">
import '@sencha/ext-web-components/lib/ext-{xtype}.component';

class {Xtype}ComponentExample {

  on{Xtype}Ready(event) {
    this.{Xtype}Cmp = event.detail.cmp;
  }

}

window.{Xtype}Example = new {Xtype}ComponentExample();
</pre>

<div><b>HTML:</b></div>
<pre class="code">
&lt;ext-{xtype} onready="{Xtype}Example.on{Xtype}Ready"&gt;
...
&lt;/ext-{xtype}&gt;
</pre>
-->

<div style="height:300px;">
    <z-tabs>
        <z-tabpanel tabname="properties">
<div class="flex-container">
  <div id="propertylist" class="thelist"><div>properties:</div>{propertiesDocs}</div>
  <div id="property" class="thetext"></div>
</div>
        </z-tabpanel>
        <z-tabpanel tabname="methods">
<div class="flex-container">
  <div id="methodlist" class="thelist"><div>methods:</div>{methodsDocs}</div>
  <div id="method" class="thetext"></div>
</div>
        </z-tabpanel>
        <z-tabpanel tabname="events">
<div class="flex-container">
  <div id="eventlist" class="thelist"><div>events:</div>{eventsDocs}</div>
  <div id="event" class="thetext"></div>
</div>
        </z-tabpanel>
    </z-tabs>
</div>

<p>
------------------
<pre>{text}</pre>

<span><b>Ext JS name:</b></span>
<br>
<span>{name}</span>
<br><br>
<span><b>others:</b></span>
extend: {extend}
extenders: {extenders}
mixed: {mixed}
mixins: {mixins}
requires: {requires}
src: {src}



</div>

</body>
</html>