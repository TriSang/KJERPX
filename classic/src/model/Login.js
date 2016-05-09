Ext.define('KJERP.model.Login',{
	extend:'Ext.data.Model',
	requires:[
	],
	
	fields:[
	{
		name:'MEM_ID'				
	},{
		name:'MEM_PW'
	}
	],
	validators: {
		PW :[{
        	type:'format' , matcher: /^%a-zA-Z0-9-ㄱ-ㅎㅏ-ㅣ가-힣\\-\\_\\s,?&@./
        }]
	}
});