Ext.define('KJERP.model.Vessel',{
	extend:'Ext.data.Model',
	requires:[
	],
	fields:[{
		 name:'vesselIdx'
	},{ 
		name:'HullCode'
	},{ 
		name:'HullName'
	},{ 
		name:'Remark'
	},{ 
		name:'Kind'
	},{ 
		name:'Flag'
	},{ 
		name:'Class'
	},{ 
		name:'JrcSalesNo'
	},{ 
		name:'CallSign'
	},{ 
		name:'MMSI'
	},{ 
		name:'FirstVessel'
	},{ 
		name:'ImoNo'
	},{ 
		name:'ProjectOrSeries'
	},{ 
		name:'OfficialNo'
	},{ 
		name:'GrossTonnage'
	},{ 
		name:'PortOfRegistry'
	},{ 
		name:'Notation'
	},{ 
		name:'GoogleDoc'
	},{ 
		name:'state'
	},{ 
		name:'builtYear'
	},{ 
		name:'memoIdx'
	},{ 
		name:'memo'
	},{
		name:'tag', convert:_FUNCTION.tagConverter	
	},{
		name:'yardCompanyIdx'
	},{ 
		name:'ownerCompanyIdx'
	},{ 
		name:'designCompanyIdx'
	},{
		name:'yardCompanyName'
	},{ 
		name:'ownerCompanyName'
	},
	'RDATE','RUSER','EDATE','EUSER'
	],
	validators: {
		builtYear :[{
        	type:'length', max:4
        }]
	}	
});