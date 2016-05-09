Ext.define('KJERP.controller.Component', {
	extend: 'KJERP.controller.Default',
    requires:['KJERP.view.component.Form',
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
		ref:'main', selector:'componentmain'
   	}, {
   		ref:'work', selector:'job [name=work]' 
   	}],
   	getForm:function() {
   		
   		var me = this,
   			main =me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'componentform');
   	},   	
   	getList:function() {
   		var me = this;
   		var list = Ext.ComponentQuery.query('componentlist[popupSelectionMode=true]')[0]; //select popup first
   		if  (!list){
   			list = Ext.ComponentQuery.query('componentlist')[0];
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
   		form.setTitle('New Component');
   	},   	
   	processEdit:function(record, form, readOnly ) {
   		_DEBUG.log('processEdit', arguments);
   		var me = this,
   			list = me.getList();
   		
   		if (!form)
   			form = me.getForm();
   		
   		_FUNCTION.resetStoreAtForm(form);
   		
		if (record)
			me.editRecord(record, form);
		else
			me.editRecordAtList(list, form);
			
		record = form.getRecord();
		
		var gallery = form.down('imagegallery'),
   			fileCombo = form.down('filecombo'),
			galleryStore = gallery.down('dataview').getStore();
   			
		galleryStore.removeAll();
		fileCombo.setCallbackFileLoader(function(rows) {
			_FUNCTION.appendImageGallery(galleryStore, rows);
		});
		fileCombo.setAppIdx(record.get('componentIdx'));
		form.down('componenttreegroupfield').setValue(record.get('compGroupName'), record.get('compGroupIdx'));
		form.setTitle('Component - ' + _FUNCTION.getMergeValue(record.get('name'), record.get('model')));
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteComponent', list, form);
   	},   	
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.saveRecord('updateComponent', list, form);
   		//me.saveRecordTest('updateComponent', list, form);
   	},
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getComponentList', list);
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
    		'componentlist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'componentlist button[action=search]': {
				click:me.onSearch
    		},
			'componentlist button[action=add]': {
				click:me.onAdd
    		},
			'componentlist button[action=edit]': {
				click:me.onEdit
    		},
			'componentlist button[action=del]': {
				click:me.onDelete
    		},	
			'componentlist button[action=view]': {
				click:me.onView
    		},	
    		'componentlist combo[name=active]': {
    			change:me.onChangeActive
    		},    		
    		'componentform':{
    			activate:me.onActivateForm
    		},
			'componentform button[action=save]': {
				click:me.onSave
    		},	
			'componentform button[action=del]': {
				click:me.onDelete
    		},	
			'componentform button[action=close]': {
				click:me.onClose
    		},	
			'componentform button[action=excel]': {
				click:me.onExcel
    		},
			'componentform button[action=reset]': {
				click:me.onReset
    		}	    		
    	});
    }
});
