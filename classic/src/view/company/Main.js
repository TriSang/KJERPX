Ext.define('KJERP.view.company.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.company.List',
		'KJERP.view.company.Form'
	],
	xtype:'companymain',
	layout:'card',
	items:[{
		xtype:'companylist'
	}]
});