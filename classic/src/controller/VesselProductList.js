Ext.define('KJERP.controller.VesselProductList', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
		ref:'list', selector:'vesselproductlist'
   	},{
   		ref:'work', selector:'job [name=work]' 
   	}],
   		
   	getList:function() {
   		var me = this;
   		var list = Ext.ComponentQuery.query('vesselproductlist[popupSelectionMode=true]')[0]; //select popup first
   		if  (!list){
   			list = Ext.ComponentQuery.query('vesselproductlist')[0];
   		}
   		return list;
   	},   	
    onChangeActive:function(cbo, newValue, oldValue, eOpts ) {
    	var record = cbo.record;
    		data = {table:'KJERP', no:record.get('no'), field:'active', value:newValue, mid:_USER.no};
    	cbo.setDisabled(true);
    	KJERP.controller.Main.requestService('updateField', data, function(ret) {
    		cbo.setDisabled(false);
    	});
    },   	
     
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getEquipmentItems', list);
   	},
   	searchRecord : function(service, list, form, callbackFunc) {
		var me = this,
			store = list.getStore(), 
			proxy = store.getProxy(), 
			filters = [],
			toolbar = list.query('toolbar');
		
		if (service) { // service가 지정되어 있으면
			proxy.setUrl(_GLOBAL.URL_SERVICE+'?service='+service);
		}
		
		me.checkSession(service);
		
		//json.stringify date 형식이 바뀜. 
		
		toolbar.forEach( 
			function(element, index, array){							
					if(element == null) return true;		
					var fields = element.query('field');
					
					Ext.Array.each(fields, function(field) {
						var value = field.getValue();
						if (!value && (value === '' || value === null))	// if combo...
							return true;						
						var name = field.getName();
						if(name=="fromDate"||name=="toDate"){
							filters.push({
										property :name,
										value : _FUNCTION.getTimeStamp(value)
							});
						}else{
							filters.push({
										property : name,
										value : value
							});
						}
				});
		});				
				
		
		filters.push({
			property : 'vesselIdx',
			value : list.getVesselIdx()
		});
		
		var strData = _Base64.encodeJson({
			'filters':filters,
			'session': 
			{
				sessionID:_SESSION_ID,
				userID:_USER.info.email
			}
		});
		
		proxy.setExtraParam('data', strData);
		
		_DEBUG.log('Controller/default.js searchRecord', filters);
		
		store.load({                               
	            callback: function (records, operation, success) {
	            	if (store.hasOwnProperty('root')) {
	            		store.getRoot().expand();
	            	}
	            	
	               	if(operation._response.operation==false){
	               		Ext.Msg.alert(_MESSAGE.alertTitle,operation._response.message);
	               		_SESSION_ID = '';    			
	    				Ext.ComponentQuery.query('app-main')[0].layout.setActiveItem(0);
	               	}    
	               	
	               	if (callbackFunc) callbackFunc(records);
	            },
	            failure: function () {                         	
	            	_DEBUG.log('Controller/default.js searchRecord', 'falield');
            		if (callbackFunc) callbackFunc(null);
	            }
	        });
	},
    checkAuthWrite:function(obj){
    	var store = Ext.getStore('AuthInfo'),
    	record = store.findRecord('CODE',obj),
    	authWrite = record.data.AUTH_WRITE;
    	if(authWrite == 1) return true;
    	else
    	return false;  
    },
    onActivateList:function() {
    	//override to not load autmatically
    	_DEBUG.log('Controller/default.js onActivateList over override', arguments);		
		var me = this, 
			list = me.getList();
		
		me.updateButton(list, null);
			
		return false;	
    },
    
    init:function() {
    	
    	var me = this;
    	me.control({
    		'vesselproductlist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},    		
    		'vesselproductlist button[action=search]': {
    			click:me.onSearch
    		},    			
    		'vesselproductlist combo[name=active]': {
    			change:me.onChangeActive
    		}    		
    		    		
    	});
    }
});
