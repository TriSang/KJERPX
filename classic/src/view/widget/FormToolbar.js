Ext.define('KJERP.view.widget.FormToolbar', {			
	extend:'Ext.toolbar.Toolbar',
	xtype:'formtoolbar',
	style: {
		background:'#EEE'
	},	
	items:[{
		text:'Save',
		action:'save',
		icon:'resources/images/icon/save.png'
	}, {
		text:'Delete',
		action:'del',
		glyph:_GLYPH.toolbar.del,
		disabled:true
	}, {
		text:'Reset',
		icon:'resources/images/icon/reset.png',
		action:'reset'
	}, {
		xtype:'tbseparator', flex:1
	}, {
		text:'Close',
		icon:'resources/images/icon/close.png',
		action:'close'
    }]
 });
 