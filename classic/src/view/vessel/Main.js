Ext.define('KJERP.view.vessel.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.vessel.List',
		'KJERP.view.vessel.Form',
		'KJERP.view.quotation.Form',
		'KJERP.view.shipping.Form',
		'KJERP.view.contract.Form',
		'KJERP.view.service.Form',
		'KJERP.view.drawing.Form'
	],
	xtype:'vesselmain',
	layout:'card',
	initComponent:function() {
		var me = this;
		me.items = [{
			xtype:'vessellist'
		}];
		me.callParent();
	}
});