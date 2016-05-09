Ext.define('KJERP.model.Company',{
	extend:'Ext.data.Model',
	requires:[
	],
			
	fields:[
	{
		name:'companyIdx'				
	},{
		name:'companyName'
	},{
		name:'category'
	}, {
		name:'companySName'
	}, {
		name:'ceoName'
	}, {
		name:'registerNo'
	}, {
		name:'country'
	}, {
		name:'postCode'
	}, {
		name:'dhlCode'
	}, {
		name:'address' 
	}, {
		name:'email'
	}, {
		name:'tel'
	}, {
		name:'fax'
	}, {
		name:'social'
	}, {
		name:'remark'
	}, {
		name:'categoryName'
	}, {
		name:'tag', convert:_FUNCTION.tagConverter
	}, {
		name:'state'
	},  'RDATE','RUSER','EDATE','EUSER'
	],
	validators: {
        companyName: [{
			type:'presence'
        }]
  	}	
});