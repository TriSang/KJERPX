Ext.define('KJERP.view.widget.CompanyComboBox', {
	extend:'Ext.form.field.ComboBox',
	requires:[
	],
	xtype:'companycombo',
	config:{
		queryFilters:[]
	},
	editable:false,
	fieldLabel:'Company',
	displayField:'companySName',
	valueField:'companyIdx',
	queryMode: 'local',		//오픈시 다시 부르지 않음		
	editable:true,
	forceSelection:true,
	store: {
        type: 'remote-states'
    },
	listConfig: {
        itemTpl: new Ext.XTemplate(                 
	        '<tpl>',
	    		'<div>',
	        		'<span data-qtip="{companyName}">',//	        	            		
	            		'{companyName}:&nbsp;{categoryName} </span>',	                    		 
	        	'</div>',
	        '</tpl>'
        )    	  
	},
	initComponent:function() {
		var me = this;		
		var data = {
			'filters':me.getQueryFilters(),
			'column':'companyName,companyIdx,companySName,categoryName'
		};
		var strData =JSON.stringify(data);			
		
		me.store = {
			fields:['companyName', 'companyIdx','companySName','categoryName'],
			autoLoad:true,	// 부모에서 직접 호출
            proxy: JSON.parse(JSON.stringify(_AJAX.proxy))
		};		
		me.store.proxy.url = _GLOBAL.URL_SERVICE+'?service=getCompanyList';
		me.store.proxy.extraParams = {
          		data:_AJAX.base64Encode?_Base64.encode(strData):strData
		};
		
        me.callParent(arguments); //initProduct 부모의 실행한다.
        //me.setIsTmpAppIdx(newValue?false:true);
	}
});