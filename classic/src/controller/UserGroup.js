Ext.define('KJERP.controller.UserGroup', {
	extend: 'KJERP.controller.Default',
    requires:['KJERP.view.usergroup.Form',
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
		ref:'main', selector:'usergroupmain'
   	},{
		ref:'list', selector:'usergrouplist'
   	}, {
   		ref:'work', selector:'job [name=work]' 
   	}
   	],
   	getForm:function() {
   		var me = this,
   			main = me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'usergroupform');	
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
   		me.newRecord(list, form);
   		
   		form.setTitle('New UserGroup');
   	},   	
   	processEdit:function(record) {
   		_DEBUG.log('processEdit', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   			
		if (record)
			me.editRecord(record, form);
		else
			me.editRecordAtList(list, form);
			
		record = form.getRecord();
		form.setTitle('UserGroup - '+ record.get('userGroupName'));
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteGroup', list, form);
   	},   	
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.saveRecord('updateGroup', list, form);
   		//me.saveRecordTest('updateComponent', list, form);
   	},
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getGroupList', list);
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
    		'usergrouplist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'usergrouplist button[action=search]': {
				click:me.onSearch
    		},
			'usergrouplist button[action=add]': {
				click:me.onAdd
    		},
			'usergrouplist button[action=edit]': {
				click:me.onEdit
    		},
			'usergrouplist button[action=del]': {
				click:me.onDelete
    		},	
			'usergrouplist button[action=view]': {
				click:me.onView
    		},	
    		'usergrouplist combo[name=active]': {
    			change:me.onChangeActive
    		},    		
    		'usergroupform':{
    			activate:me.onActivateForm
    		},
			'usergroupform button[action=save]': {
				click:me.onSave
    		},	
			'usergroupform button[action=del]': {
				click:me.onDelete
    		},	
			'usergroupform button[action=close]': {
				click:me.onClose
    		},	
			'usergroupform button[action=excel]': {
				click:me.onExcel
    		},
			'usergroupform button[action=reset]': {
				click:me.onReset
    		}	    		
    	});
    }
});
