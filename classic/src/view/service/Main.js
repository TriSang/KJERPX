Ext.define('KJERP.view.service.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.service.List',
		'KJERP.view.service.Form'
	],
	xtype:'servicemain',
	layout:'card',
	items:[{
		xtype:'servicelist'
	}]
});