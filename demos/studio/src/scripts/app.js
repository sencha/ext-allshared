function focusbtnClick() {
    console.log('focusbtnClick')
    document.getElementById("focus-modal").showModal(); 
}

function openTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }

window.app = {}

window.app.getInput = function(id, value) {
    console.log(id)
    console.log(value)
    //var id = e.id
    //var value = e.value
    var getFunction = 'set' + id.charAt(0).toUpperCase() + id.slice(1);
    vscode.postMessage({
        command: 'propertySet',
        data: {name: id, value: value}
    });
    window.o[getFunction](value);
}

window.app.supersReady = (event) => {
//    console.log('supersReady')
    app.supersCmp = event.detail.cmp;
    var tpl = '<div style="font-size:10px;background:#32373a;"><span style="display:inline-flex;width:90px;">{name}</span></div>'
    app.supersCmp.setItemTpl(tpl);
}

window.app.buttonReady = function(event) {
    window.app.buttonCmp = event.detail.cmp;
    window.app.buttonCmp.setText('ready')
    console.log('buttonReady')
}
window.app.buttonTap = function(event) {
    window.o.setText('tap');
    //window.app.buttonCmp.setText('tap')
    console.log('buttonClick')
}




// window.app.gridReady = (event) => {
//     console.log('gridReady')
//     app.gridCmp = event.detail.cmp;
//  //   lockedGrid.setStore(store);

//  //app.gridCmp.setPlugins={gridcellediting: {selectOnEdit: true}};
//  //plugins="{gridcellediting: {selectOnEdit: true}"

//     // app.gridCmp.setSelectable={
//     //     rows: false,
//     //     cells: true
//     // };
//     app.gridCmp.setColumns([
//         {text:'name',dataIndex:'name', flex: 1, cell: {encodeHtml: false}, 
//             renderer: function (value, record) {
//                 return '<span style=\"font-size:10px;color:white;\">' + value + '</span>'
//             }
//         },
//         {text:'value',dataIndex:'value', editable: true, cell: {encodeHtml: false}, 
//             renderer: function (value, record) {
//                 return '<span style=\"font-size:10px;color:gray;\">' + value + '</span>'
//             }
//         }
//     ]);
// }



    // var left = document.getElementById("left");
    // w = leftsideWidth;
    // h = headerHeight + footerHeight;
    // t = headerHeight;
    // l = 0;
    // left.style.width = `${w}px`;
    // left.style.height = `calc(100% - ${h}px)`;
    // left.style.top = `${t}px`;
    // left.style.left = `${l}px`;


    // window.app.listReady = (event) => {
//     console.log('listReady')
//     app.listCmp = event.detail.cmp;

//     var tpl = `
//             <tr data-field="element1" class="text">
//                 <td>element 1</td>
//                 <td class="text">
//                     <input type="text">
//                     <div class="hint">hint</div>
//                 </td>
//             </tr>
//    `
//     var tpl2 = `
//     <div style="font-size:10px;background:#32373a;"><span style="display:inline-flex;width:90px;">{configName}</span> <span>{type}</span>
//         <input type="text" id="{configName}" value="{value}" oninput="app.getInput(this)">
//     </div>
//    `
//     app.listCmp.setItemTpl(tpl);
// }
