Ext.define('KJERP.model.ContractItem',{
	extend:'Ext.data.TreeModel',
	requires:[
	],
			
	fields:[{
		name:'contractIdx',
		defaultValue:0
	},{
		name:'componentIdx'	
	},{
		name:'name'
	},{
		name:'model'
	},{
		name:'type'		
	},{
		name:'qty'
	},{
		name:'unitPrice'
	},{
		name:'price'
	},{
		name:'tax'
	},{
		name:'shippingDate', type:'date'
	},{
		name:'total'
	},{
		name:'tag', convert:_FUNCTION.tagConverter	
	},{
		name:'remark',
		defaultValue:''
	},
	'RDATE','RUSER','EDATE','EUSER'
	]
});