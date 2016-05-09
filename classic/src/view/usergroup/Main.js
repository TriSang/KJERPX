Ext.define('KJERP.view.usergroup.Main', {
	
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.usergroup.List',
		'KJERP.view.usergroup.Form'
	],
	xtype:'usergroupmain',
	layout:'card',
	items:[{
		xtype:'usergrouplist'
	}]
});