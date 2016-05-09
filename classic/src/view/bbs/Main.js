Ext.define('KJERP.view.bbs.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.bbs.List',
		'KJERP.view.bbs.Form'
	],
	xtype:'bbsmain',
	layout:'card',
	items:[{
		xtype:'bbslist'
	}]
});