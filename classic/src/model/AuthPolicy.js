Ext.define('KJERP.model.AuthPolicy',{
	extend:'Ext.data.Model',
	requires:[
	],
			
	fields:[{
		name:'authPolicyIdx'	
	},{
		name:'authIdx'
	},{
		name:'code'
	},{
		name:'name'
	},{
		name:'read',
		defaultValue:0
	},{
		name:'write',
		defaultValue:0
	},{
		name:'exec',
		defaultValue:0
	}	
	]
});