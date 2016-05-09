Ext.define('KJERP.controller.Drawing', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
		ref:'list', selector:'drawinglist'    	
   	},{
		ref:'form', selector:'drawingform'
   	}
   	],
   	
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
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteDrawing', list, form);

   	},   
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			form = me.getForm(),
   			fileCombo = form.down('filecombo'),
   			fileStore = fileCombo.getStore(),
   			fileArray = _FUNCTION.storeToArray(fileStore,1, -1);
   			equipmentItemRecord = form.getEquipmentItemRecord();
   			
	    var data = _FUNCTION.getFormContainerValues(form);
		// JSON field value process
		form.query('field[type=json]').every(function(field) {
			data[field.getName()] = JSON.parse(field.getValue());
		});
			
		me.checkSession(me.moduleClassName +' saveRecord');
		var callback = function(result) {
			if (KJERP.controller.Main.isInValidResult(result))
				return;
			if (data.category === 'DAP') {
				equipmentItemRecord.set('dwApproveState', data.state);
				equipmentItemRecord.set('dwApproveComment', data.comment);
				equipmentItemRecord.set('dwApproveUser', _USER.info.name);
				equipmentItemRecord.set('dwApproveFiles', fileArray);
				equipmentItemRecord.set('dwApproveDate', data.date);
			} else if (data.category === 'DWK') {
				equipmentItemRecord.set('dwWorkingState', data.state);
				equipmentItemRecord.set('dwWorkingComment', data.comment);
				equipmentItemRecord.set('dwWorkingUser', _USER.info.name);
				equipmentItemRecord.set('dwWorkingFiles', fileArray);
				equipmentItemRecord.set('dwWorkingDate', data.date);				
			} else if (data.category === 'DFI') {
				equipmentItemRecord.set('dwFinalState', data.state);
				equipmentItemRecord.set('dwFinalComment', data.comment);
				equipmentItemRecord.set('dwFinalUser', _USER.info.name);
				equipmentItemRecord.set('dwFinalFiles', fileArray);
				equipmentItemRecord.set('dwFinalDate', data.date);				
			}
			me.closeForm();
		};
   		KJERP.controller.Main.requestService('updateEquipmentDrawing', data, callback);
   	},  	
    checkAuthWrite:function(obj){
    	var store = Ext.getStore('AuthInfo'),
    	record = store.findRecord('CODE',obj),
    	authWrite = record.data.AUTH_WRITE;
    	if(authWrite == 1) return true;
    	else
    	return false;  
    },
    init:function() {
    	
    	var me = this;
    	me.control({
    		'drawingform':{
    			activate:me.onActivateForm
    		},
			'drawingform>formheader>button[action=save]': {
				click:me.processSave
    		},	
			'drawingform>formheader>button[action=del]': {
				click:me.onDelete
    		},	
			'drawingform>formheader>button[action=close]': {
				click:me.onClose
    		},	
			'drawingform>formheader>button[action=excel]': {
				click:me.onExcel
    		},
			'drawingform>formheader>button[action=reset]': {
				click:me.onReset
    		}
    	});
    }
});