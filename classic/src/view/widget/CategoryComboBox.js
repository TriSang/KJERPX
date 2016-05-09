Ext.define('KJERP.view.widget.CategoryComboBox', {
	extend:'Ext.form.field.ComboBox',
	requires:[
	],
	xtype:'categorycombo',
	config:{
		queryFilters:[]
	},
	editable:false,
	fieldLabel:'Category',
	displayField:'categoryName',
	valueField:'categoryValue',
	queryMode: 'local',		//오픈시 다시 부르지 않음
	initComponent:function() {
		var me = this;		
		var data = {
			'filters':me.getQueryFilters(),
			'column':'categoryName,categoryValue'
		};
		var strData =JSON.stringify(data);			
		
		me.store = {
			fields:['categoryName', 'categoryValue'],
			autoLoad:true,	// 부모에서 직접 호출
            proxy: JSON.parse(JSON.stringify(_AJAX.proxy))
		};
		me.store.proxy.url = _GLOBAL.URL_SERVICE+'?service=getCategorySetList';
		me.store.proxy.extraParams = {
          		data:_AJAX.base64Encode?_Base64.encode(strData):strData
		};
        me.callParent(arguments); //initProduct 부모의 실행한다. 
        me.store.load();
	}
});