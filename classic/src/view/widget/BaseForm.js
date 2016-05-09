Ext.define('KJERP.view.widget.BaseForm',{
	extend:'Ext.form.Panel',
	config:{
		authCode:'100',
		callerForm:null,
		closeCallback:null,
		modified:false
	},
	isModified:function() {
		return false;
	}
});