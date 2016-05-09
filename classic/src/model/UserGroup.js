Ext.define('KJERP.model.UserGroup',{
	extend:'Ext.data.Model',
	requires:[
	],
			
	fields:[{
		name:'userGroupIdx'	
	},{
		name:'userGroupName'
	},{
		name:'authIdx'
	},{
		name:'authName'
	},{
		name:'remark'
	},{
		name:'state'			
	},
	'RDATE','RUSER','EDATE','EUSER'
	]
	
});