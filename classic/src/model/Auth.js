Ext.define('KJERP.model.Auth',{
	extend:'Ext.data.Model',
	requires:[
	],
			
	fields:[{
		name:'authIdx',
		defaultValue:0
 	},{ 
  		name:'name'
	},{ 
  		name:'state'
 	},{ 
  		name:'remark'  		
	},
	'RDATE','RUSER','EDATE','EUSER'
	],
	validators: {
		authIdx: [{
			type:'presence'
        }],
        name: [{
			type:'presence'
        }]        
	}	
});