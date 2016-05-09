Ext.define('KJERP.view.user.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.user.List',
		'KJERP.view.user.Form'
	],
	xtype:'usermain',
	layout:'card',
	items:[{
		xtype:'userlist'
	}]
});