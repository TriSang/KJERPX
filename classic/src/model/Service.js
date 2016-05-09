Ext.define('KJERP.model.Service',{
	extend:'Ext.data.Model',
	requires:[
	],
	fields:[{
		name:'serviceIdx'
 	},{ 
  		name:'vesselIdx'
	},{ 
  		name:'title'
 	},{ 
  		name:'saleCategory'  		
 	},{ 
  		name:'serviceType'  		
 	},{ 
  		name:'serviceCategory'  		
	},{ 
  		name:'poNo'
	},{ 
  		name:'docNo'
	},{ 
  		name:'payment'
	},{ 
  		name:'serviceSDate', type:'date'
	},{ 
  		name:'serviceEDate', type:'date'
	},{ 
  		name:'requestDate', type:'date'
	},{ 
  		name:'contactIdx'
	},{ 
  		name:'assignedContactIdx'
	},{ 
  		name:'workerContactIdx'
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
  		name:'workerCompanyIdx'  		
	},{ 
  		name:'state'
	},{ 
  		name:'remark'
	},{ 
  		name:'serviceReport'  		
	},{ 
  		name:'serviceOrder'  		
	},{ 
  		name:'location'  		
	},{ 
  		name:'vesselETA' , type:'date' 		
	},{ 
  		name:'vesselETD' , type:'date' 		
	},{ 
  		name:'localCompanyIdx'  		
	},{ 
  		name:'localContactIdx'  		
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