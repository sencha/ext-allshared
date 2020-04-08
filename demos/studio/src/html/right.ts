export default function right() {
    var html = `
    <div style="margin-bottom:10px;">xtype: <span id="xtype" ></span></div>
    <z-tabs>
        <z-tabpanel tabname="allconfigs">
            <z-props id="allconfigs"></z-props>
        </z-tabpanel>
    </z-tabs>
    <z-tabs>
        <z-tabpanel tabname="superclasses">
            <z-props id="supers"></z-props>
        </z-tabpanel>
    </z-tabs>
    `

    return html;
}