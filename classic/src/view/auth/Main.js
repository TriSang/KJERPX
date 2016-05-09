Ext.define('KJERP.view.auth.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.auth.List',
		'KJERP.view.auth.Form'
	],
	xtype:'authmain',
	layout:'card',
	items:[{
		xtype:'authlist'
	}]
});