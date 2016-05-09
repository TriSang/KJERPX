Ext.define('KJERP.view.quotation.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.quotation.List',
		'KJERP.view.quotation.Form'
	],
	xtype:'quotationmain',
	layout:'card',
	items:[{
		xtype:'quotationlist'
	}]
});