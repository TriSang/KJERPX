Ext.define('KJERP.view.widget.ContactField', {
	extend:'Ext.form.FieldContainer',
	requires:[
		'Ext.form.field.*',
		'KJERP.view.contact.List'
	],
	xtype:'contactfield',
	readOnly:false,
	layout:{
		type:'hbox',
		align:'middle'
	},
	config:{
		name:'contactIdx'
	},
	fieldLabel:'Contact',
	setValue:function(display,value) {
		var me = this;
		if (!display) {
			display ='';
		}	
		me.down('[name=display]').setValue(display);
		me.down('[name='+me.getName()+']').setValue(value);		
	},	
	selectItem:function() {
    	var me = this;
    	
    	var callback = function(selecteds) {
    		if (selecteds && selecteds.length>0) {
    			var record = selecteds[0];
    			me.setValue(_FUNCTION.getMergeValue(record.get('contactName'),  record.get('position')), 
																record.get('contactIdx'));
    			popup.close();
    		}
    	};
    	var popup = Ext.create('Ext.window.Window', {
    		title:'Contact',
    		layout:_POPUP.layout,
    		closable:_POPUP.closable,
    		closeAction:_POPUP.closeAction,
    		width:_POPUP.width,
    		height:_POPUP.height,
    		modal:_POPUP.modal,
    		resizable:_POPUP.resizable,
    		items:[{
    			xtype:'contactlist',
    			popupSelectionMode:true,
    			toHideFields:[],
    			callbackOnSelect:callback
    		}]
    	});
    	
    	popup.show();			
	},
	initComponent:function() {
		var me = this;
		var readOnly = me.readOnly;
		me.items = [{
			xtype:'hiddenfield',
			name:me.getName(),
			emptyText:'Select Contact...'
		},{
			xtype:'textfield',
			name:'display',
			emptyText:'Name of Contact',
			readOnly:true,
			flex:1
		},{
			xtype:'button',
			disabled:readOnly,
			margin:'0 0 0 5',			
			text:'...',
			handler:function(cmp) {
				me.selectItem();
			}
		}];
		me.callParent();
	}
});