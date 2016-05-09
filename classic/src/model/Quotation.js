Ext.define('KJERP.model.Quotation',{
	extend:'Ext.data.Model',
	requires:[
	],
			
	fields:[{
		name:'quotationIdx'
 	},{ 
  		name:'vesselIdx'
	},{ 
  		name:'title'
 	},{ 
  		name:'saleCategory'  		
	},{ 
  		name:'docNo'
	},{ 
  		name:'delivery'
	},{ 
  		name:'payment'
	},{ 
  		name:'rfqIdx'
	},{ 
  		name:'contactIdx'
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
  		name:'fromCompanyIdx'
	},{ 
  		name:'toCompanyIdx'
	},{ 
  		name:'state'
	},{ 
  		name:'remark'
	},{ 
		name:'memoIdx'
	},{ 
		name:'memo'
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