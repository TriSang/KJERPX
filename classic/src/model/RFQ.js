Ext.define('KJERP.model.RFQ',{
	extend:'Ext.data.Model',
	requires:[
	],
			
	fields:[{
		name:'rfqIdx'
 	},{ 
  		name:'saleCategory'
	},{ 
  		name:'rfqTitle'
	},{ 
  		name:'vesselIdx'
	},{ 
  		name:'docNo'
	},{ 
  		name:'fromCompanyIdx'
	},{ 
  		name:'toCompanyIdx'
	},{ 
  		name:'requestDate',type:'date'
	},{ 
  		name:'requestContactIdx'
	},{ 
  		name:'assignedContactIdx'
	},{ 
 		name:'dueDate',type:'date'
	},{ 
  		name:'tag'
	},{ 
  		name:'state'
	},{ 
  		name:'remark'
	},{
		name:'tag', convert:_FUNCTION.tagConverter		
	},{
		name:'state'			
	},
	'RDATE','RUSER','EDATE','EUSER'
	],
	validators: {
        vesselIdx: [{
			type:'presence'
        }],
        fromCompanyIdx: [{
			type:'presence'
        }],
        toCompanyIdx: [{
			type:'presence'
        }],
        title: [{
			type:'presence'
        }]
	}	
});