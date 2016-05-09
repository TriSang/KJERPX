Ext.define('KJERP.view.component.Main', {
	
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.component.List',
		'KJERP.view.component.Form'
	],
	xtype:'componentmain',
	layout:'card',
	items:[{
		xtype:'componentlist'
	}]
});