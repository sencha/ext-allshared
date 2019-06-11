export default function left() {
    var html = `

    <z-tabs style="flex:2">
        <z-tabpanel tabname="view configs">
            <z-props id="viewconfigs"></z-props>
        </z-tabpanel>
        <z-tabpanel tabname="ultimate">
            <z-props id="ultimateconfigs"></z-props>
        </z-tabpanel>
        <z-tabpanel tabname="initial">
            <z-props id="initialconfigs"></z-props>
        </z-tabpanel>
    </z-tabs>

    <z-tabs style="flex:1">
        <z-tabpanel tabname="drag">
            <ol>
                <li id="grid" draggable="true" ondragstart="left.dragstart(event)">Grid</li>
                <li id="column" draggable="true" ondragstart="left.dragstart(event)">Column</li>
                <li id="button" draggable="true" ondragstart="left.dragstart(event)">Button</li>
            </ol>
        </z-tabpanel>
    </z-tabs>

    `
    return html;
}
