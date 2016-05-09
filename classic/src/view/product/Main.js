Ext.define('KJERP.view.product.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.product.List',
		'KJERP.view.product.Form'
	],
	xtype:'productmain',
	layout:'card',
	items:[{
		xtype:'productlist'
	}]
});