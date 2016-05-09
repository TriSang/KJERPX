Ext.define('KJERP.view.widget.DataComboBox', {
	extend:'Ext.form.field.ComboBox',
	requires:[
	],
	xtype:'datacombo',
	config:{
		comboData:null	
	},
	editable:false,
	fieldLabel:'',
	displayField:'text',
	valueField:'value',
	queryMode: 'local',	
	initComponent:function(){
		var me = this;
			me.store = _FUNCTION.getComboStore(me.getComboData());
		me.callParent();
	}
});