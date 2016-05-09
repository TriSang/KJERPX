Ext.define('KJERP.view.contact.Main', {
	extend:'Ext.container.Container',
	requires:[
		'KJERP.view.contact.List',
		'KJERP.view.contact.Form'
	],
	xtype:'contactmain',
	layout:'card',
	items:[{
		xtype:'contactlist'
	}]
});