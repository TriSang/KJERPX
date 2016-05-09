Ext.define('KJERP.view.widget.FileUploadWindow', { 
	extend:'Ext.window.Window',
	title:'Upload a File',
	layout:_POPUP.layout,
	closable:_POPUP.closable,
	closeAction:_POPUP.closeAction,
	width:400,
	resizable:_POPUP.resizable,
	config:{
		appIdx:null,	
		appCategory:null,
		callback:null,
		fileCategoryStore:null
	},
	initComponent:function() {
		var me= this,
			callback = me.getCallback(),
			fileCategoryStore = me.getFileCategoryStore();
			
		me.items=[{
			xtype:'form',
			standardSubmit:false,
		    bodyPadding: 10,
		    layout:{
		    	type:'vbox',
		    	align:'stretch'
		    },
		    defaults:{
		    	labelWidth:_FORM.labelWidth,
		        msgTarget: 'side'			    	
		    },
		    items: [{
		        xtype: 'filefield',
		        name: 'file',
		        fieldLabel: 'File',
		        allowBlank: false,
		        anchor: '100%',
		        buttonText: 'Select...'
		    },{
		    	xtype:'combo',
				fieldLabel:'Category',
				displayField: 'text',
				valueField: 'value',
				name:'fileCategory',
				queryMode: 'local',
				editable:false,
				emptyText:'Select file category',
		        allowBlank: false,
		        value:fileCategoryStore.data[0].value,
				store:fileCategoryStore
		    },{
		    	xtype:'textfield',
				fieldLabel:'Remark',
				name:'fileRemark',
				emptyText:'',
				allowBlank:true
		    }],
		    buttons: [{
		        text: 'Upload',
		        handler: function(cmp) {
		        	var form = cmp.up('form');
		        	
		            if(form.isValid()){
		                form.submit({
		                    url: _GLOBAL.FILE_SERVICE,
				            method:'POST',
				            disableCaching:true,
						    cors: true,
							useDefaultXhrHeader : false,
					        waitMsg: 'Uploading your file...',
					        params:{
					        	'appIdx':me.getAppIdx(),
					        	'appCategory':me.getAppCategory()
					        },
							success: function(form, action) {
								var rows = action.result.rows;
								if (callback) callback(rows);
						    },
						    failure: function(form, action) {
						        switch (action.failureType) {
						            case Ext.form.action.Action.CLIENT_INVALID:
						                Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
						                break;
						            case Ext.form.action.Action.CONNECT_FAILURE:
						                Ext.Msg.alert('Failure', 'Ajax communication failed');
						                break;
						            case Ext.form.action.Action.SERVER_INVALID:
						               Ext.Msg.alert('Failure', action.result.msg);
								}
								if (callback) callback(null);
						    }
		                });
		            }
		        }
		    }]
		    //end form
		}]
		me.callParent(arguments);
	}
});
