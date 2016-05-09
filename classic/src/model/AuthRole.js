Ext.define('KJERP.model.AuthRole',{
	extend:'Ext.data.Model',
	requires:[
	],
			
	fields:[{
		name:'authRoleIdx'	
	},{
		name:'name'
	},{
		name:'remark',
		defaultValue:''
	},
	'RDATE','RUSER','EDATE','EUSER'
	]
});