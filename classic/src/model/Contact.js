Ext.define('KJERP.model.Contact',{
	extend:'Ext.data.Model',
	requires:[
	],
			
	fields:[
	{
		name:'contactIdx'				
	},{
		name:'companyIdx'
	}, {
		name:'contactName'
	}, {
		name:'dept'
	}, {
		name:'position'
	}, {
		name:'tel'
	}, {
		name:'mobile'
	}, {
		name:'email'
	}, {
		name:'sns'		
	}, {
		name:'files'		
	}, {
		name:'remark'
	},{
		name:'tag', convert:_FUNCTION.tagConverter	
	}, {
		name:'state',		// 0: employeed
		defaultValue:0
	},  'RDATE','RUSER','EDATE','EUSER'
	],
	validators: {
        name: [{
			type:'presence'
        }],
        companyIdx:[{
			type:'presence'
        }]
  	}	
});