Ext.define('KJERP.controller.RFQ', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
   		ref:'work', selector:'job [name=work]'    		
   	}],
   	getMain:function() {
   		var me = this;
   		var query = 'rfqmain';
   		if (me.getIsVesselContext()) {
   			query = 'vesselmain';
   		}   		
   		return Ext.ComponentQuery.query(query)[0];   		
   	},     	
   	getForm:function() {
   		var me = this,
   			main = me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'rfqform');	
   	},
   	getList:function() {
   		var me = this;
   		var query = 'rfqmain rfqlist';
   		if (me.getIsVesselContext()) {
   			query = 'vesselmain rfqlist';
   		}   		
   		return Ext.ComponentQuery.query(query)[0];
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
   			form = me.getForm(),
   			vesselForm = list.up('vesselform');
		
		_FUNCTION.resetStoreAtForm(form);
   		me.newRecord(list, form);
   		
   		if (vesselForm) {
   			var record = vesselForm.getRecord();
			form.down('vesselfield').setValue(record);
   		}   		
   		
   		form.down('filecombo').setAppIdx(0);
   		form.setTitle('New RFQ');
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
		form.down('vesselfield').setValue(record);
		form.down('[name=requestContactIdx]').setValue(_FUNCTION.getMergeValue(record.get('requestContactName'),  record.get('requestContactPosition')), 
																		record.get('requestContactIdx'));
		form.down('[name=assignedContactIdx]').setValue(_FUNCTION.getMergeValue(record.get('assignContactName'),  record.get('assignPosition')), 
																		record.get('assignedContactIdx'));
		form.down('filecombo').setAppIdx(record.get('rfqIdx'));		
		form.setTitle('RFQ - '+record.get('rfqTitle')+'&nbsp;#'+ _FUNCTION.getMergeValue(record.get('HullCode'), record.get('HullName')));
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteRFQ', list, form);

   	},   
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   			
   		me.saveRecord('updateRFQ', list, form);
   	},
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getRFQList', list);
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
    		'rfqlist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'rfqlist button[action=search]': {
				click:me.onSearch
    		},
			'rfqlist button[action=add]': {
				click:me.onAdd
    		},
			'rfqlist button[action=edit]': {
				click:me.onEdit
    		},
			'rfqlist button[action=del]': {
				click:me.onDelete
    		},	
			'rfqlist button[action=view]': {
				click:me.onView
    		},	
    		'rfqlist combo[name=active]': {
    			change:me.onChangeActive
    		},    		
    		'rfqform':{
    			activate:me.onActivateForm
    		},
			'rfqform>formheader>button[action=save]': {
				click:me.onSave
    		},	
			'rfqform>formheader>button[action=del]': {
				click:me.onDelete
    		},	
			'rfqform>formheader>button[action=close]': {
				click:me.onClose
    		},	
			'rfqform>formheader>button[action=excel]': {
				click:me.onExcel
    		},
			'rfqform>formheader>button[action=reset]': {
				click:me.onReset
    		}
    	});
    }
});
