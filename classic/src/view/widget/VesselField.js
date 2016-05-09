Ext.define('KJERP.view.widget.VesselField', {
	extend:'Ext.form.FieldContainer',
	requires:[
		'Ext.form.field.*'
	],
	xtype:'vesselfield',
	readOnly:false,
	layout:{
		type:'hbox',
		align:'middle'
	},
	config:{
		name:'vesselIdx'
	},
	fieldLabel:'Vessel',
	setDisabled:function(isDisabled) {
		var me = this;
		me.down('button').setDisabled(isDisabled);
	},
	setValue:function(record) {
		var me = this;
		var hullName = record.get('HullName');
		var hullCode = record.get('HullCode');
		var name = '';
		
		if (hullName && hullCode)
			name = hullName+' /'+hullCode;
		else if (hullName)
			name = hullName;
		else (hullCode)
			name = hullCode;
		
		me.down('[name=display]').setValue(name);
		me.down('[name='+me.getName()+']').setValue(record.get('vesselIdx'));		
	},
	selectVessel:function() {
    	var me = this;
    	
    	var callback = function(selecteds) {
    		if (selecteds && selecteds.length>0) {
    			me.setValue(selecteds[0]);
    			popup.close();
    		}
    	};
    	var popup = Ext.create('Ext.window.Window', {
    		title:'Vessel',
    		layout:_POPUP.layout,
    		closable:_POPUP.closable,
    		closeAction:_POPUP.closeAction,
    		width:_POPUP.width,
    		height:_POPUP.height,
    		modal:_POPUP.modal,
    		resizable:_POPUP.resizable,
    		items:[{
    			xtype:'vessellist',
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
			emptyText:'Select Vessel...'
		},{
			xtype:'textfield',
			name:'display',
			emptyText:'Reference Vessel',
			emptyText:'Select Vessel...',
			readOnly:true,
			flex:1
		},{
			xtype:'button',
			margin:'0 0 0 5',
			disabled:readOnly,
			text:'...',
			handler:function(cmp) {
				me.selectVessel();
			}
		}];
		me.callParent();
	}
});