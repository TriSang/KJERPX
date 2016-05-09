Ext.define('KJERP.controller.User', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
		ref:'main', selector:'usermain'
   	},{
		ref:'list', selector:'userlist'
   	}, {
   		ref:'work', selector:'job [name=work]' 
   	}
   	],
   	getForm:function() {
   		var me = this,
   			main = me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'userform');	
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
   		
   		form.setTitle('New User');
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
			
		record = form.getRecord0;
		form.down('field[name=email]').setReadOnly(isEditMode);
		form.setTitle('User - '+record.get('email'));		
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteUser', list, form);
   	},   	
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm(),
   			values = form.getValues();
   			
   		// 저장전 비밀번호 확인
   		if (values.pw  && values.pw != values.pw2) {
   			KJERP.controller.Main.showAlert('Passwords are differernt');
   			return;
   		}
   		
   		// 길이 확인
   		if (values.pw && values.pw2 && values.pw.length<6) {
   			KJERP.controller.Main.showAlert('Passwords shall be longer than 6 character');
   			return;
   		}

   		if (values.userIdx ==0 ) {
	   		// 신규 저장시 이메일 중복 확인
			KJERP.controller.Main.requestService('checkEmail', {email:values.email}, function(result) {
	   			if (KJERP.controller.Main.isInValidResult(result)) return;    	
		   		me.saveRecord('updateUser', list, form);
			});
   		} else {
   			me.saveRecord('updateUser', list, form);
   		}
   	},
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getUserList', list);
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
    		'userlist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'userlist button[action=search]': {
				click:me.onSearch
    		},
			'userlist button[action=add]': {
				click:me.onAdd
    		},
			'userlist button[action=edit]': {
				click:me.onEdit
    		},
			'userlist button[action=del]': {
				click:me.onDelete
    		},	
			'userlist button[action=view]': {
				click:me.onView
    		},	
    		'userlist combo[name=active]': {
    			change:me.onChangeActive
    		},    		
    		'userform':{
    			activate:me.onActivateForm
    		},
			'userform button[action=save]': {
				click:me.onSave
    		},	
			'userform button[action=del]': {
				click:me.onDelete
    		},	
			'userform button[action=close]': {
				click:me.onClose
    		},	
			'userform button[action=excel]': {
				click:me.onExcel
    		},
			'userform button[action=reset]': {
				click:me.onReset
    		}	    		
    	});
    }
});
