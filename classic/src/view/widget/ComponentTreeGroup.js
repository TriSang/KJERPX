Ext.define('KJERP.view.widget.ComponentTreeGroupField', {
	extend:'Ext.form.FieldContainer',
	requires:[
		'Ext.form.field.*',
		'KJERP.view.contact.List'
	],
	xtype:'componenttreegroupfield',
	readOnly:false,
	layout:{
		type:'hbox',
		align:'middle'
	},
	config:{
		name:'compGroupIdx'
	},
	fieldLabel:'Group',
	setValue:function(display,value) {
		var me = this;		
		if (!display) {
			display ='';			
			if (value) {
				var store = Ext.getStore('ComponentTreeGroup');
				var record = store.findRecord('groupIdx', value);
				if (record)
					display = record.get('groupName');
			}
		}	
		me.down('[name=display]').setValue(display);
		me.down('[name='+me.getName()+']').setValue(value);		
	},	
	selectItem:function() {
    	var me = this;
    	
    	var callback = function(selecteds) {
    		if (selecteds && selecteds.length>0) {
    			var record = selecteds[0];
    			me.setValue(record.get('groupName'),  record.get('groupIdx'));
    		}
    	};
    	var popup = Ext.create('Ext.window.Window', {
    		title:'Component Group',
    		layout:_POPUP.layout,
    		closable:_POPUP.closable,
    		closeAction:_POPUP.closeAction,
    		width:_POPUP.width,
    		height:_POPUP.height,
    		modal:_POPUP.modal,
    		resizable:_POPUP.resizable,
    		items:[{
    			xtype:'treepanel',
    			header:false,
				rootVisible: false,
				multiSelect: false,    			
    			store:'ComponentTreeGroup',
    			columns:[{
					xtype: 'treecolumn',
					label:'Group',
					dataIndex:'groupName',
					flex:1
    			},{
				 	width: 100,		 	
				 	align:'center',
				    sortable: false,
				    text:_GRID.label.action,
				    menuDisabled: true,
	    			dataIndex:'equipmentItemIdx',
					width:60,
					align:'center',
					renderer:function(value, meta, record) {
						var html = '';
						if (record.isLeaf()) {
							html = '<a href="#" title="select a item" class="select noDecoration"><span class="my-tree-icon-add"></span></a>'
						}
						return html;
					}	
    			}],
	    		listeners:{
	    			itemdblclick:function( view, record, item, index, e, eOpts ) {
						var me = view.up('window');
						if (record.isLeaf()) {
							callback([record]);
							me.close();	    	
						}
	    			},
	    			itemclick:function( view, record, item, index, event, eOpts ) {
						if (event.getTarget('a.select')) {
							event.stopEvent();
							var me = view.up('window');
							callback([record]);
							me.close();
						}
	    			}
	    		}
    		}]
    	});
    	popup.show();			
	},
	initComponent:function() {
		var me = this;
		var readOnly = me.readOnly;
		me.items = [{
			xtype:'hiddenfield',
			name:me.getName()
		},{
			xtype:'textfield',
			name:'display',
			emptyText:'Name of Group',
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