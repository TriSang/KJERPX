Ext.define('KJERP.model.BBS',{
	extend:'Ext.data.Model',
	requires:[
	'Ext.data.validator.Length',
	'Ext.data.validator.Presence'
	],
	fields:[
	{
		name:'bbsIdx'				
	},{
		name:'bbsTitle'
	}, {
		name:'bbsContent'
	}, {
		name:'bbsCategory'
	}, {
		name:'state'
	},  'RDATE','RUSER','EDATE','EUSER'
	],
	validators: {
		bbsTitle: [{
			type:'presence'
		},{
			type:'length', max:255
        }],
        bbsContent :[{
        	type:'presence'
        }]
	}	
});