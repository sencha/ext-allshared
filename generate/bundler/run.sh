sencha -sdk /Volumes/BOOTCAMP/aaExt/ext-7.0.0.156 compile ^
exclude -all and ^
include -r -namespace Ext.grid and ^
include -r -namespace Ext.form.field.ComboBox and ^
include -r -namespace Ext.tip and ^
include -r -namespace Ext.data.JsonStore and ^
exclude -namespace Ext.grid.feature and ^
exclude -namespace Ext.grid.plugin.Clipboard and ^
exclude -namespace Ext.grid.plugin.DragDrop and ^
exclude -namespace Ext.grid.plugin.RowEditing and ^
exclude -namespace Ext.grid.plugin.RowExpander and ^
exclude -namespace Ext.grid.plugin.HeaderResizer and ^
exclude -namespace Ext.grid.plugin.HeaderReorderer and ^
exclude -namespace Ext.grid.filters and ^
exclude -namespace Ext.grid.column.Widget and ^
exclude -namespace Ext.grid.column.Date and ^
exclude -namespace Ext.grid.locking and ^
exclude -namespace Ext.grid.RowEditor and ^
exclude -namespace Ext.grid.RowEditorButtons and ^
exclude -namespace Ext.grid.header.DragZone and ^
exclude -namespace Ext.grid.header.DropZone and ^
exclude -namespace Ext.window and ^
exclude -namespace Ext.fx and ^
include -namespace Ext.fx.Manager and ^
include -namespace Ext.fx.target and ^
include -namespace Ext.fx.Queue and ^
exclude -namespace Ext.toolbar and ^
exclude -namespace Ext.picker and ^
exclude -namespace Ext.menu and ^
exclude -namespace Ext.resizer and ^
exclude -namespace Ext.Ajax and ^
exclude -namespace Ext.dd and ^
include -namespace Ext.dd.DragDropManager and ^
include -namespace Ext.dd.ScrollManager and ^
exclude -namespace Ext.ProgressBar and ^
exclude -namespace Ext.form.field.Date and ^
exclude -namespace Ext.form.field.TextArea and ^
exclude -namespace Ext.form.action and ^
exclude -namespace Ext.data.Session and ^
exclude -namespace Ext.data.session and ^
exclude -namespace Ext.Widget and ^
exclude -namespace Ext.plugin.AbstractClipboard and ^
exclude -namespace Ext.tab and ^
-debug=false concat -strip ext-custom.debug.js and ^
-debug=false concat -yui ext-custom.js