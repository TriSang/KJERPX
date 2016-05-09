Ext.define('KJERP.controller.ComponentEditForm', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
		ref:'form', selector:'componenteditform'
   	},{
   		ref:'work', selector:'job [name=work]' 
   	}],
   		
   	getForm:function() {   		
   		var form = Ext.ComponentQuery.query('componenteditform')[0]; //select popup first
   		return form;
   	},   	
    checkAuthWrite:function(obj){
    	var store = Ext.getStore('AuthInfo'),
    	record = store.findRecord('CODE',obj),
    	authWrite = record.data.AUTH_WRITE;
    	if(authWrite == 1) return true;
    	else
    	return false;  
    },
    onEdit:function(obj){
    	
    	var me=this,
    	form = me.getForm();
    	
    },
    onClose:function(obj){
    	  
    	var me=this,
    	form = me.getForm();
    	form.close();
    },
    init:function() {
    	
    	var me = this;
    	me.control({
    		'componenteditform':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},    		
    		'componenteditform button[action=close]': {
    			click:me.onClose
    		},    			
    		'componenteditform button[action=edit]': {
    			click:me.onEdit
    		}    		
    		    		
    	});
    }
});
