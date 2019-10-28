<!DOCTYPE HTML>
<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<script src="z-tabs.js"></script>

</head>
<body>

<H1>{xtype}</H1>
{text200}
<br><br>

<div style="height:900px;">
    <z-tabs>
        <z-tabpanel tabname="usage">
            <div class="flex-container">


<H3>package.json</H3>
<pre class="code">
  "dependencies": {
    "@sencha/ext-elements-all": "~7.1.0",

  },
</pre>



            </div>
        </z-tabpanel>

        <z-tabpanel tabname="properties">
            <div class="flex-container">
               {ewcProperties}
            </div>
        </z-tabpanel>
        <z-tabpanel tabname="methods">
            <div class="flex-container">
                b
            </div>
        </z-tabpanel>

        <z-tabpanel tabname="events">
            <div class="flex-container">
                {ewcEvents}
            </div>
        </z-tabpanel>

        <z-tabpanel tabname="React">
            <div class="flex-container">

<pre class="code">
import React, { Component } from 'react';
import Ext{Xtype} from '@sencha/ext-elements/react/Ext{Xtype}';

export default class App extends Component {

    {xtype}Ready = ({detail: {cmp, cmpObj}}) => {
        this.{Xtype}Cmp = cmp;
    }

    render() {
        return (
            &lt;Ext{Xtype}
                {xtype}Ready={this.{xtype}Ready}
            &gt
            &lt;/Ext{Xtype}&gt
        )
    }

}
</pre>

            </div>
        </z-tabpanel>


        <z-tabpanel tabname="Web Components">
            <div class="flex-container">

<pre class="code">
import '@sencha/ext-elements/dist/ext-{xtype}.component';

{xtype}Ready = ({detail: {cmp, cmpObj}}) => {
    this.{Xtype}Cmp = cmp;
}

&lt;ext-{xtype}&gt;&lt;/ext-{xtype}&gt;
</pre>

            </div>
        </z-tabpanel>




    </z-tabs>
</div>




<H2>Properties</H2>

{ewcProperties}

<H2>Events</H2>
{ewcEvents}








{allXtypes}

{Xtype}

{propertiesDocs}
{methodsDocs}

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

</body>
</html>