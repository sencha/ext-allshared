/* global Ext */
import React, { Component } from 'react';
import '@sencha/ext-web-components';
import { set } from './ewc';
import { SampleData } from './SampleData';
class App extends Component {

  columns = [
    {"text": "Name", "width": "250", "dataIndex": "name"},
    {"text": "Email Address", "flex": "1", "dataIndex": "email"},
    {"text": "Phone Number", "width": "250", "dataIndex": "phone"}
  ]

  readyGrid = (event) => {
    this.gridCmp = event.detail.cmp
    this.store = Ext.create('Ext.data.Store', {
      fields: ['name', 'email', 'phone', 'hoursTaken', 'hoursRemaining'],
      data: new SampleData(50).data
    });
    this.gridCmp.setStore(this.store)
  }

  onSearch = (event) => {
    const query = event.detail.newValue.toLowerCase();
    this.store.clearFilter();
    if (query.length) this.store.filterBy(record => {
      const { name, email, phone } = record.data;
      return name.toLowerCase().indexOf(query) !== -1 ||
        email.toLowerCase().indexOf(query) !== -1 ||
        phone.toLowerCase().indexOf(query) !== -1;
    });
  }

  render() {
    return (
      <ext-panel title="Sencha ExtWebComponents 7.0 in React" layout="vbox" fitToParent="true" padding="10">
        <div style={{textAlign:'center',marginTop:'20px',marginBottom:'25px','fontSize':'24px'}}>
          <img width="150" alt="React" src="react.png"/>
          <div>React</div>
        </div>
        <ext-grid 
          flex="1"
          title="Employees"
          shadow="true"
          ref={set({
            columns: this.columns,
            onready: this.readyGrid
          })}
        >
        <ext-toolbar docked="top">
          <ext-searchfield 
            ui="faded" 
            placeholder="Search..."
            ref={set({
              onchange: this.onSearch
            })}
          >
          </ext-searchfield>
        </ext-toolbar>
        </ext-grid>
      </ext-panel>
    );
  };
}

export default App;
