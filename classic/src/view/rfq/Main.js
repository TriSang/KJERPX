Ext.define('KJERP.view.rfq.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.rfq.List',
		'KJERP.view.rfq.Form'
	],
	xtype:'rfqmain',
	layout:'card',
	items:[{
		xtype:'rfqlist'
	}]
});