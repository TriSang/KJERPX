Ext.define('KJERP.controller.Contact', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
		ref:'main', selector:'contactmain'
    },{
		ref:'form', selector:'contactform'
   	}, {
   		ref:'work', selector:'job [name=work]' 
   	}],
   	getForm:function() {
   		var me = this,
   			main =me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'contactform');
   	},      	
   	getList:function() {
   		var me = this;
   		var list = Ext.ComponentQuery.query('contactlist[popupSelectionMode=true]')[0]; //select popup first
   		if  (!list){
   			list = Ext.ComponentQuery.query('contactlist')[0];
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
   	processAdd:function() {
   		_DEBUG.log('processAdd', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   			
		_FUNCTION.resetStoreAtForm(form);   			
   		me.newRecord(list, form);
   		
   		form.down('filecombo').setAppIdx(0);
   		form.setTitle('New Contact');
   	},   	
   	processEdit:function(record) {
   		_DEBUG.log('processEdit', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		
   		_FUNCTION.resetStoreAtForm(form);		
		if (record)
			me.editRecord(record, form);
		else
			me.editRecordAtList(list, form);
		
		record = form.getRecord();
		form.down('filecombo').setAppIdx(record.get('contactIdx'));
		form.setTitle('Contact - '+ record.get('contactName'));
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteContact', list, form);
   	},   	
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.saveRecord('updateContact', list, form);
   		//me.saveRecordTest('updateContact', list, form);
   	},
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getContactList', list);
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
    		'contactlist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'contactlist button[action=search]': {
				click:me.onSearch
    		},
			'contactlist button[action=add]': {
				click:me.onAdd
    		},
			'contactlist button[action=edit]': {
				click:me.onEdit
    		},
			'contactlist button[action=del]': {
				click:me.onDelete
    		},	
			'contactlist button[action=view]': {
				click:me.onView
    		},	
    		'contactlist combo[name=active]': {
    			change:me.onChangeActive
    		},    		
    		'contactform':{
    			activate:me.onActivateForm
    		},
			'contactform button[action=save]': {
				click:me.onSave
    		},	
			'contactform button[action=del]': {
				click:me.onDelete
    		},	
			'contactform button[action=close]': {
				click:me.onClose
    		},	
			'contactform button[action=excel]': {
				click:me.onExcel
    		},
			'contactform button[action=reset]': {
				click:me.onReset
    		}	    		
    	});
    }
});
