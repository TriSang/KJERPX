Ext.define('Ext.ux.editor.TextEditor', {
	extend:'Ext.window.Window',
	requires:[
		'Ext.form.field.TextArea'
	],
	xtype:'texteditor',
	header: {
		titlePosition: 2,
		titleAlign: 'center'
	},	
	title:'Note',
	closable: true,
	closeAction: 'destroy',
	width: 400,
    height: 300,
    modal:true,
	layout:{
		type:'vbox'
	},
	config:{
		value:'',
		editable:true,
		callbackSave:null,
		callbackCancel:null
	},
	
	initComponent:function() {
		var me = this;
		me.dockedItems=[{
			xtype:'toolbar',
			items:[{
				text:'Save',
				action:'save',
				icon:'resources/images/icon/save.png',
				disabled:!me.getEditable(),
				handler:function() {
					var callback = me.getCallbackSave();
					if (callback!=null) {
						callback(me.down('textarea').getValue());
					}
					me.close();
				}
			}, {
				text:'Reset',
				icon:'resources/images/icon/reset.png',
				action:'reset',
				disabled:!me.getEditable(),
				handler:function() {
					me.down('textarea').setValue('');
				}				
			}, {
				xtype:'tbseparator', flex:1
			}, {
				text:'Close',
				icon:'resources/images/icon/close.png',
				action:'close',
				handler:function() {
					var callback = me.getCallbackCancel();
					if (callback!=null) {
						callback();
					}
					me.close();
				}
	        }]
		}];
		me.items=[{
			xtype:'textareafield',
			margin:'0 5 5 5',
			editable:me.getEditable(),
			flex:1,
			value:me.getValue(),
			width:'100%'
		}];		
		me.callParent();
	}
});