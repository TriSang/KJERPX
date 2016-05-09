Ext.define('KJERP.model.User',{
	extend:'Ext.data.Model',
	requires:[
	],
			
	fields:[
	{
		name:'userIdx'				
	},{
		name:'email'
	}, {
		name:'name'
	}, {
		name:'pw',
		convert:function(value) {return '';}
	}, {
		name:'pw2'		
	}, {
		name:'companyIdx'
	}, {
		name:'userGroupIdx'
	}, {
		name:'userGroupName'
	}, {
		name:'tel'
	}, {
		name:'mobile'
	}, {
		name:'remark'
	}, {
		name:'state',		// 0: employeed
		defaultValue:0
	},  'RDATE','RUSER','EDATE','EUSER'
	],
	validators: {
        email: [{
			type:'presence'
        }],
        name: [{
			type:'presence'
        }],        
        companyIdx:[{
			type:'presence'
        }]
  	}	
});