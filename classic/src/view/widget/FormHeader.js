Ext.define('KJERP.view.widget.FormHeader', {
	extend:'Ext.panel.Header',
	xtype: 'formheader',
    titlePosition: 0,
    defaults:{
    	xtype:'button',
    	padding: '1 3 1 3',
    	margin:0,
    	border:false
    },
    config:{
    	toHideTools:[],
    	toShowTools:[]
    },
	initComponent:function() {
		var me = this,
			toHideTools = me.getToHideTools(),
			toShowTools = me.getToShowTools();
		var menuItems = [{
            xtype: 'component',
			flex: 1
		},{
			text:'Save',
			glyph:_GLYPH.toolbar.save,
			action:'save'
		},{
			text:'Reset',
			glyph:_GLYPH.toolbar.reset,
			action:'reset'
		},{		
			text:'Delete',
			action:'del',
			glyph:_GLYPH.toolbar.del,
			disabled:true		
		},{		
			text:'Edit',
			action:'edit',
			glyph:_GLYPH.toolbar.edit,
			hidden:true
		},{
			text:'Close',
			glyph:_GLYPH.toolbar.close,
			action:'close'			
		}];

		me.items = [];
		for (var i=0;i<menuItems.length;i++) {
			
			if (toHideTools.indexOf(menuItems[i].action)<0) {
				me.items.push(menuItems[i]);
			}
			
			if (toShowTools.indexOf(menuItems[i].action)>=0) {
				menuItems[i].hidden=false;				
			}
		}
		
		me.callParent(arguments);
	}
});