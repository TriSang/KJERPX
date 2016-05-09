Ext.define('KJERP.view.shipping.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.shipping.List',
		'KJERP.view.shipping.Form'
	],
	xtype:'shippingmain',
	layout:'card',
	items:[{
		xtype:'shippinglist'
	}]
});