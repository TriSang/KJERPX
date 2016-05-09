Ext.define('KJERP.controller.Company', {
	extend: 'KJERP.controller.Default',
    requires:['KJERP.view.company.Form',
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
		ref:'main', selector:'companymain'
   	}, {
   		ref:'contacts', selector:'companymain companycontacts'
   	}, {
   		ref:'work', selector:'job [name=work]'    		
   	}],
   	getForm:function() {
   		var me = this,
   			main =me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'companyform');
   	},     	
   	getList:function() {
   		var me = this;
   		var list = Ext.ComponentQuery.query('companylist[popupSelectionMode=true]')[0]; //select popup first
   		if  (!list){
   			list = Ext.ComponentQuery.query('companylist')[0];
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
   		form.setTitle('New Company');
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
   		form.setTitle('Company - ' + record.get('companyName'));	
   		form.down('filecombo').setAppIdx(record.get('companyIdx'));
   		me.loadContacts();   		
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteCompany', list, form);

   	},   
   	loadContacts:function() {
   		_DEBUG.log('loadContacts', arguments);
   		var me = this,
   		   form = me.getForm(),
   		   record = form.getRecord(),
   		   grid = form.down('grid'),
   		   store = grid.getStore();
   		   
			var data = {
   		   		filters:[
   		   			{property:'companyIdx', value:record.get('companyIdx')}
   		   		]
   		   	};
   		   	var callback = function(result) {
   		   		store.add(result.rows);
   		   	}
   		   	KJERP.controller.Main.requestService('getContactList', data, callback);
   	},
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
		
		var contactsStore = form.down('grid').getStore();
		var contacts = [];
		contactsStore.each(function(record) {
			contacts.push({
				companyIdx:0,
		        name:record.get('name'),
		        dept:record.get('dept'),
		        position:record.get('position'),
		        tel:record.get('tel'),
		        mobile:record.get('mobile'),
		        email:record.get('email'),
		        sns:record.get('sns'),
		        remark:record.get('remark'),
		        state:record.get('state')
			});
		});
		
		form.down('hiddenfield[name=contacts]').setValue( JSON.stringify(contacts));
   		me.saveRecord('updateCompany', list, form);
   	},
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getCompanyList', list);
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
    onAddContact:function(button) {
    	var me = this,
    		grid = button.up('grid'),
    		store = grid.getStore();
			var newRecord = Ext.create('KJERP.model.Contact', 
			{
				name:'New...',
				state:0
			});
			// select and scroll to
			grid.getSelectionModel().deselectAll();
			store.insert(0, newRecord);

			grid.getSelectionModel().select([newRecord]);
			grid.getView().focusRow(newRecord);
    },
    onSelectionContactsChangeList:function(model, selected) {
    	var me = this,
    		list = me.getContacts();
    	
    	me.updateButton(list, selected.length == 0 ? null : selected[0]);
    },
    onWriteSName:function(textfield, event, eOpts) {    	
    	var me = this,    	
    	form = me.getForm();    	
    	
    	var companySName = form.down('[name = companySName]');
    	if(companySName.value =='') companySName.setValue(textfield.value);
    	
    },
    init:function() {
    	
    	var me = this;
    	me.control({
    		'companylist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'companylist button[action=search]': {
				click:me.onSearch
    		},
			'companylist button[action=add]': {
				click:me.onAdd
    		},
			'companylist button[action=edit]': {
				click:me.onEdit
    		},
			'companylist button[action=del]': {
				click:me.onDelete
    		},	
			'companylist button[action=view]': {
				click:me.onView
    		},	
    		'companylist combo[name=active]': {
    			change:me.onChangeActive
    		},    		
    		'companyform':{
    			activate:me.onActivateForm
    		},
			'companyform button[action=save]': {
				click:me.onSave
    		},	
			'companyform button[action=del]': {
				click:me.onDelete
    		},	
			'companyform button[action=close]': {
				click:me.onClose
    		},	
			'companyform button[action=excel]': {
				click:me.onExcel
    		},
			'companyform button[action=reset]': {
				click:me.onReset
    		},
    		'companyform textfield[name=companyName]': {
				blur:me.onWriteSName
    		},
    		'companymain companycontacts button[action=add]': {
    			click:me.onAddContact
    		},
    		'companymain companycontacts':{
    			selectionchange:me.onSelectionContactsChangeList
    		}
    	});
    }
});
