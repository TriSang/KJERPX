Ext.define('KJERP.model.Component',{
	extend:'Ext.data.Model',
	requires:[
	],
			
	fields:[{
		name:'componentIdx'	
	},{
		name:'companyIdx'
	},{
		name:'name'
	},{
		name:'model'
	},{
		name:'type'
	},{
		name:'barcode'			
	},{
		name:'compGroupIDX'
	},{
		name:'isProduct'
	},{		
		name:'compGroupName'
	},{
		name:'unit'
	},{
		name:'companyName'
	},{
		name:'JRCOrderCode'
	},{
		name:'HSCode'
	},{
		name:'IHM'
	},{
		name:'shipdexCode'
	},{
		name:'remark'
	},{
		name:'mass'
	},{
		name:'color'		
	},{
		name:'volume'
	},{
		name:'currency', defaultValue:'USD'
	},{
		name:'purchasePrice'		
	},{
		name:'listPrice'		
	},{
		name:'discountPrice'		
	},{
		name:'InterIn'		
	},{
		name:'InterOut'		
	},{
		name:'ImoNo'
	},{
		name:'tag', convert:_FUNCTION.tagConverter
	},{
		name:'state', defaultValue:0			
	},
	'RDATE','RUSER','EDATE','EUSER'
	],
	validators: {
        name: [{
			type:'presence'
        }] ,
        HSCode :[{
        	type:'length', max:2
        }]
  }	
});