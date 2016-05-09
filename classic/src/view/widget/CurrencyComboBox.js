Ext.define('KJERP.view.widget.CurrencyComboBox', {
	extend:'KJERP.view.widget.DataComboBox',
	requires:[
	],
	xtype:'currencycombo',
	fieldLabel:'Currency',
	comboData:_DATA.currency,
	value:'USD',
	editable:false,
	initComponent:function() {
		var me = this;
		me.callParent();
	}
});