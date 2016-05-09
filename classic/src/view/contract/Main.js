Ext.define('KJERP.view.contract.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.contract.List',
		'KJERP.view.contract.Form'
	],
	xtype:'contractmain',
	layout:'card',
	items:[{
		xtype:'contractlist'
	}]
});