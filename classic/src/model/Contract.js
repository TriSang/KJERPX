Ext.define('KJERP.model.Contract',{
	extend:'Ext.data.Model',
	requires:[
	],
	fields:[{
		name:'contractIdx'
 	},{ 
  		name:'vesselIdx'
	},{ 
  		name:'title'
 	},{ 
  		name:'saleCategory'  		
	},{ 
  		name:'poNo'
	},{ 
  		name:'docNo'
	},{ 
  		name:'delivery'
	},{ 
  		name:'payment'
	},{ 
  		name:'deliveryDate', type:'date'
	},{ 
  		name:'contractDate', type:'date'
	},{ 
  		name:'contactIdx'
	},{ 
  		name:'assignedContactIdx'
	},{ 
  		name:'currency'  		
	},{ 
  		name:'price'
	},{ 
 		name:'tax'
	},{ 
  		name:'total'
	},{ 
  		name:'priceLocked'
	},{ 
  		name:'remark'
	},{ 
  		name:'fromCompanyIdx'
	},{ 
  		name:'toCompanyIdx'
	},{ 
  		name:'state'
	},{ 
  		name:'remark'
	},{
		name:'tag', convert:_FUNCTION.tagConverter		
	},{ 
		name:'memoIdx'
	},{ 
		name:'memo'
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