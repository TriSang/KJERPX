Ext.define('Ext.ux.field.ExFileField', {
	extend:'Ext.form.FieldContainer',
	requires:['Ext.form.field.File'],
	xtype:'exfilefield',
	layout:{
		type:'hbox'
	},
	config:{
		fileField:{},
		fieldName:'file',
		callback:null,
		showPath:false
	},
	initComponent:function() {
		var me = this;
		me.items=[
			Ext.Object.merge(
				{
					xtype:'filefield', 
					flex:1,
					buttonOnly:true,
					buttonText:'파일',
					submitValue:false,
					name:me.getFieldName()+'upload',					
					listeners:{
						change:me.onFileSelect,
						//activate:me.AbleButton,
						scope:me
					}
				}, 
				me.getFileField()
		)
		, { xtype:'textfield', value:'', readOnly:true, name:me.getFieldName(), hidden:true, flex:1, 
			listeners:{
				change:function(cmp,newValue){me.setUrl(newValue)}
			}
		}
		, { xtype:'button', text:'삭제', action:'deletefile', handler:function(){
			me.setUrl('');
			var callback = me.getCallback();
			if (callback) {
				callback('');
			}	
		}, hidden:true,  margin:'0 0 0 10'}
		];
		me.callParent(arguments);
		
	},
	onFileSelect:function() {		
		var me = this;
		var form = me.up('form').getForm();		
		var fieldname = me.down('filefield').getName();
		var callback = function(url) {
			me.setUrl(url);
			var callback = me.getCallback();
			if (callback) {
				callback(url);
			}			
		}		
//		callback2('http://www.sencha.com/img/20110215-feat-html5.png');
        form.submit({
            url: _GLOBAL.EXT_UPLOAD+'?fieldname='+fieldname,
            waitMsg: 'Uploading file...',
            success: function(fp, ret) {
            	console.log(ret.result);
            	if (ret.result.success==false)
            		me.showErrorMessage(ret.message);
            	else
                	callback(ret.result.url);                	
            },
            failure: function(fp, ret) {
                switch (ret.failureType) {
                case Ext.form.Action.CLIENT_INVALID:
                    Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                    break;
                case Ext.form.Action.CONNECT_FAILURE:
                    Ext.Msg.alert('Failure', 'Ajax communication failed');
                    break;
                case Ext.form.Action.SERVER_INVALID:
                    Ext.Msg.alert('Failure', ret.result.msg);
                    break;
                default:
                    Ext.Msg.alert('Failure', ret.result.msg);
                    break;
            }
            }            
        });
	},
	onAbleButton:function(){
		var me = this,
			button = me.down('button[action=deletefile]');					
	},
	setUrl:function(url) {
		var me = this,
			fileField = me.down('filefield'),
			textField = me.down('textfield[name='+me.getFieldName()+']'),
			delButton = me.down('[action=deletefile]');
		if (me.getShowPath())
			textField.setVisible(true);
		else
			textField.setVisible(false);
		textField.setValue(url);
		delButton.setVisible(url);
		fileField.setVisible(!url);

	},
	showErrorMessage:function(msg) {
		Ext.MessageBox.alert('에러', msg);
	}
});