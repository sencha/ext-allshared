exports.angular = (what, info) => {
    var r = ''
    switch(what) {

case 'module':
r =
`
import { ExtAngularPivotModule } from '@sencha/ext-angular-pivot';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ExtAngularPivotModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
`
break;

case 'component':
r = `
declare var Ext: any;

const regions = {
    "Belgium": 'Europe',
    "Netherlands": 'Europe',
    "United Kingdom": 'Europe',
    "Canada": 'North America',
    "United States": 'North America',
    "Australia": 'Australia'
};

const model = Ext.define(null, {
  extend: 'Ext.data.Model',
  fields: [
    {name: 'id',        type: 'int'},
    {name: 'company',   type: 'string'},
    {name: 'country',   type: 'string'},
    {name: 'person',    type: 'string'},
    {name: 'date',      type: 'date', dateFormat: 'c'},
    {name: 'value',     type: 'float'},
    {name: 'quantity',  type: 'float'},
    {
      name: 'year',
      calculate: function(data){
        return parseInt(Ext.Date.format(data.date, "Y"), 10);
      }
    },
    {
      name: 'month',
      calculate: function(data){
        return parseInt(Ext.Date.format(data.date, "m"), 10) - 1;
      }
    },
    {
      name: 'continent',
      calculate: function(data){
        return regions[data.country];
      }
    }
  ]
})

let rand = 37;
const companies = ['Google', 'Apple', 'Dell', 'Microsoft', 'Adobe'],
      countries = ['Belgium', 'Netherlands', 'United Kingdom', 'Canada', 'United States', 'Australia'],
      persons = ['John', 'Michael', 'Mary', 'Anne', 'Robert'];

const randomItem =  function (data) {
  const k = rand % data.length;
  rand = rand * 1664525 + 1013904223;
  rand &= 0x7FFFFFFF;
  return data[k];
};

const randomDate = function (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime() ));
}

const generateData = function generateData(items=500) {
  const data = [];
  for(let i=0; i<items; i++) {
    data.push({
      company:    randomItem(companies),
      country:    randomItem(countries),
      person:     randomItem(persons),
      date:       randomDate(new Date(2012, 0, 1), new Date()),
      value:      Math.random() * 1000 + 1,
      quantity:   Math.floor(Math.random() * 30 + 1)
    });
  }
  return data;
}

import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: \`
<ext-pivotgrid
    (ready)="onPivotGridRead($event)"
    shadow="true"
    [selectable]="{ cells: true }"
    [startRowGroupsCollapsed]="false"
    [startColGroupsCollapsed]="false"
    [matrix]="pivotgridMatrix"
>
</ext-pivotgrid>
\`,
    styles: []
})
export class AppComponent {

    store = Ext.create('Ext.data.Store', {
        model: model,
        data: generateData()
    });

    pivotgrid: any;

    onPivotGridRead = function(event) {
        this.pivotgrid = event.detail.cmp;
    }

    expandAll = () => { this.pivotgrid.expandAll() }
    collapseAll = () => { this.pivotgrid.collapseAll() }

    pivotgridMatrix = {
        type: 'local',
        store: this.store,
        viewLayoutType: 'outline',
        aggregate: [{
            dataIndex: 'value',
            header: 'Total',
            aggregator: 'sum',
            width: 110
        }],
        leftAxis: [{
            dataIndex: 'person',
            header: 'Person',
            width: 150
        }, {
            dataIndex: 'company',
            header: 'Company',
            sortable: false,
            width: 150
        }, {
            dataIndex: 'country',
            header: 'Country',
            width: 150
        }],
        topAxis: [{
            dataIndex: 'year',
            header: 'Year'
        }]
    };

}
`
break;

default:
r = ``
break;

    }
    return r
}
