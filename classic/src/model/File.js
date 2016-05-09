Ext.define('KJERP.model.File',{
	extend:'Ext.data.TreeModel',
	requires:[
	],
	fields: ['fileIdx', 'fileName', 'fileRemark', 'fieSize', 'fileCategory', 'fileUrl', 'appIdx', 'appCategory',
	'RDATE','RUSER','EDATE','EUSER'
	]
});