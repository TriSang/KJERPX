Ext.define('KJERP.controller.Vessel', {
	extend: 'KJERP.controller.Default',
    requires:['KJERP.view.vessel.Form',
    	'Ext.data.proxy.JsonP',
    	'KJERP.model.EquipmentItem'
    ],
    refs: [{
		ref:'main', selector:'vesselmain'
   	},{
   		ref:'work', selector:'job [name=work]' 
   	},{
		ref:'equipments', selector:'vesselequipments'		   		
   	},{
		ref:'quotations', selector:'vesselquotations'
   	},{
		ref:'contracts', selector:'vesselcontracts'
   	},{
		ref:'shippings', selector:'vesselshippings'
   	},{
		ref:'services', selector:'vesselservices'
   	},{
		ref:'RFQs', selector:'vesselrfqs'				
  	}],
   	getForm:function() {
   		var me = this,
   			main =me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'vesselform');
   	},
   	getList:function() {
   		var me = this;
   		var list = Ext.ComponentQuery.query('vessellist[popupSelectionMode=true]')[0]; //select popup first
   		if  (!list){
   			list = Ext.ComponentQuery.query('vessellist')[0];
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
   		form.setTitle('New Vessel');
   	},   	
   	processEdit:function(record) {
   		_DEBUG.log('processEdit', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   			
   		_FUNCTION.resetStoreAtForm(form);
   		
		if (record) {
			me.editRecord(record, form);
		}
		else
			me.editRecordAtList(list, form);
   		
   		var record = form.getRecord();
		form.setTitle('Vessel - ' + _FUNCTION.getMergeValue(record.get('HullCode'), record.get('HullName')));	
		
		form.down('filecombo').setAppIdx(record.get('vesselIdx'));
		form.down('myiframe').setSrc(record.get('GoogleDoc'));
   		
   		me.loadNAppendEquipmentItem();
   		me.loadSubAppplication(me.getQuotations());
   		me.loadSubAppplication(me.getRFQs());
   		me.loadSubAppplication(me.getShippings());
   		me.loadSubAppplication(me.getContracts());
   		me.loadSubAppplication(me.getServices());
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteVessel', list, form);
   	},   	
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.saveRecord('updateVessel', list, form);
   	},
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getVesselList', list);
   	},
    checkAuthWrite:function(obj){
    	var store = Ext.getStore('AuthInfo'),
    	record = store.findRecord('CODE',obj),
    	authWrite = record.data.AUTH_WRITE;
    	if(authWrite == 1) return true;
    	else
    	return false;  
    },
    loadSubAppplication:function(grid) {
    	var me = this,
			form = me.getForm(),
    		record = form.getRecord(),
    		vesselIdx = grid.down('[name=vesselIdx]'),
    		searchBtn = grid.down('button[action=search]');
    		vesselIdx.setValue(record.get('vesselIdx'));
    		searchBtn.fireEventArgs('click', [searchBtn]);    	
    },
    loadNAppendEquipmentItem:function() {
    	var me = this,
			form = me.getForm(),
    		record = form.getRecord(),
    		vesselIdx = record.get('vesselIdx'),    	
    		grid = me.getEquipments(),
    		store = grid.getStore(),
			rootNode = store.getRootNode();
			
    	var data = {filters:[{"property":'vesselIdx',"value":vesselIdx}]};
    	KJERP.controller.Main.requestService('getEquipmentItemsX', data, function(ret) {
			rootNode.appendChild(ret.rows);
			me.updateDrawingItem(rootNode.childNodes);
			_FUNCTION.updateRecordFiles(rootNode.childNodes,'equipmentItemIdx', 'reportFiles', 'SRP');
    	});	
    },
    updateDrawingItem:function(records) {
    	_DEBUG.log('updateDrawingItem', arguments);
    	
    	var appIdxs = [];
    	for (var i=0;i<records.length;i++) {
    		if (records[i].get('dwOrder') !=1 ) return;
    		appIdxs.push(records[i].get('equipmentItemIdx'));
    	}

    	var updateDrawingFile= function(appIdxs, appCategory, fieldName) { 
    		var appCategorys =[];
    		for (var i=0;i<appIdxs.length;i++) {
    			appCategorys.push(appCategory);
    		}
			var data = {'appIdxs':appIdxs, 'appCategorys':appCategorys};
				
	    	KJERP.controller.Main.requestService('getFileListX', data, function(ret) {
	    		var rows = ret.rows;
	    		for (var i=0;i<rows.length;i++) {
    				var row = rows[i];
	    			var findRecord = null;
	    			for (var j=0;j<records.length;j++) {
	    				var record = records[j];
	    				if (row.appIdx == record.get('equipmentItemIdx')) {
	    					findRecord = record;
	    					break;
	    				}
	    			}
	    			if (findRecord) {
						record.set(fieldName, row.rows);
	    			}
	    		}	    		
	    	},
	    	null,
	    	false);
    	}
    	updateDrawingFile(appIdxs, 'DAP', 'dwApproveFiles');
    	updateDrawingFile(appIdxs, 'DWK', 'dwWorkingFiles');
    	updateDrawingFile(appIdxs, 'DFI', 'dwFinalFiles');
    },
    loadNAppendEquipmentSubItem:function(record) {
    	var me = this,
    		grid = me.getEquipments();
    	
    	var data = {filters:[
	    		{"property":'parentComponentIdx',"value":record.get('componentIdx')},
	    		{"property":'vesselIdx',"value":record.get('vesselIdx')}
			],"isLeaf":true};
			
    	KJERP.controller.Main.requestService('getEquipmentSubItems', data, function(ret) {
    		console.log('getEquipmentSubItems completed');
    		record.appendChild(ret.rows);
    	});	
    	
    },   
    onActivateList:function() {
    	//override to not load autmatically
    	_DEBUG.log('Controller/default.js onActivateList over override', arguments);		
		var me = this, 
			list = me.getList();
		
		me.updateButton(list, null);
			
		return false;	
    },
    onDelEquipment:function(button) {
		_DEBUG.log('Controller/default.js onDelete', arguments);
    	var me = this,
    		form = me.getForm(),    	
    		grid = button.up('treepanel');
    	var callback = function() {
			var selections = grid.getSelection();
			for (var i=0;i<selections.length;i++) {
				selections[i].remove();
				form.setIsModified(true);
			}
		}
    	
		Ext.MessageBox.confirm(_MESSAGE.alertTitle, _MESSAGE.confirmToDelete, function(btnId) {
				if (btnId == 'yes') {
					callback();
				}
		});		    	
    },
    onAddEquipment:function(button) {
    	var me = this,
    		grid = button.up('grid,treepanel'),
    		form = me.getForm(),
    		record = form.getRecord(),
    		vesselIdx = record.get('vesselIdx'),
    		store = grid.getStore();
    		
    	var callback = function(selecteds) {
    		var funcNewRecord = function(selected) {
				return Ext.create('KJERP.model.Product', 
				{
						vesselIdx:vesselIdx,
						equipmentItemIdx:0,
    					componentIdx:selected.get('componentIdx'),
    					name:selected.get('name'),
    					model:selected.get('model'),
    					type:selected.get('type'),
    					tag:selected.get('tag'),
    					
    					dwOrder:1,
						dwApproveState:0,
						dwApproveDate:null,
						dwApproveComment:'',
						dwApproveUser:'',

						dwWorkingState:0,
						dwWorkingDate:null,
						dwWorkingComment:'',
						dwWorkingUser:'',

						dwFinalState:0,
						dwFinalDate:null,
						dwFinalComment:'',
						dwFinalUser:'',
				
    					qty:1,
    					serialNo:'',
    					remark:''
				});    			
    		}
    		var appendItemNodes = _FUNCTION.appendTreePanel(store.getRootNode(), selecteds,funcNewRecord);
    		//if (appendItemNodes && appendItemNodes.length >0) {
    		if (appendItemNodes.length >0) {
    			form.setModified(true);
    			Ext.Msg.alert(_MESSAGE.alertTitle, 'Selected items are registerd.');
    		}
    	};
    	var popup = Ext.create('Ext.window.Window', {
    		title:'Product',
    		layout:_POPUP.layout,
    		closable:_POPUP.closable,
    		closeAction:_POPUP.closeAction,
    		width:_POPUP.width,
    		height:_POPUP.height,
    		modal:_POPUP.modal,
    		resizable:_POPUP.resizable,
    		items:[{
    			xtype:'productlist',
    			popupSelectionMode:true,
    			toHideFields:[],
    			callbackOnSelect:callback
    		}]
    	});
    	
    	popup.show();	
    },    
    deleteEquipmentItem:function(selectedNodes) {
		var products = [];
		var order = 1;
		for (var i=0;i<selectedNodes.length;i++) {
			var product = selectedNodes[i];
			if (!product.get('equipmentItemIdx')) continue; // request delete if saved before
			var newItem = {
				vesselIdx:vesselIdx,
				equipmentItemIdx:product.get('equipmentItemIdx'),
				componentIdx:product.get('componentIdx'),
				itemOrder:order++,
				qty:product.get('qty'),
				serialNo:product.get('serialNo'),
				remark:product.get('remark'),
				tag:_FUNCTION.getTagToStringValue(product.get('tag')),
				
				dwOrder:product.get('dwOrder'),
				
				dwApproveState:product.get('dwApproveState'),
				dwApproveDate:product.get('dwApproveDate'),
				dwApproveComment:product.get('dwApproveComment'),
				dwApproveUser:product.get('dwApproveUser'),
				
				dwWorkingState:product.get('dwWorkingState'),
				dwWorkingDate:product.get('dwWorkingDate'),
				dwWorkingComment:product.get('dwWorkingComment'),
				dwWorkingUser:product.get('dwWorkingUser'),
				
				dwFinalState:product.get('dwFinalState'),
				dwFinalDate:product.get('dwFinalDate'),
				dwFinalComment:product.get('dwFinalComment'),
				dwFinalUser:product.get('dwFinalUser'),
				
				components:[]
			};
			products.push(newItem);
		}
		form.setModified(true);
    },
	onSaveEquipment:function(button) {
    	var me = this,
    		grid = button.up('grid,treepanel'),
    		form = me.getForm(),
    		record = form.getRecord(),
    		vesselIdx = record.get('vesselIdx'),
    		store = grid.getStore(),
    		root = store.getRootNode();
    		
		var products = [];
		var order = 1;
		for (var i=0;i<root.childNodes.length;i++) {
			var product = root.childNodes[i];
			var newItem = {
				vesselIdx:vesselIdx,
				equipmentItemIdx:product.get('equipmentItemIdx'),
				componentIdx:product.get('componentIdx'),
				itemOrder:order++,
				qty:product.get('qty'),
				serialNo:product.get('serialNo'),
				remark:product.get('remark'),
				tag:_FUNCTION.getTagToStringValue(product.get('tag')),
				
				dwOrder:product.get('dwOrder'),
				
				dwApproveState:product.get('dwApproveState'),
				dwApproveDate:product.get('dwApproveDate'),
				dwApproveComment:product.get('dwApproveComment'),
				dwApproveUser:product.get('dwApproveUser'),
				
				dwWorkingState:product.get('dwWorkingState'),
				dwWorkingDate:product.get('dwWorkingDate'),
				dwWorkingComment:product.get('dwWorkingComment'),
				dwWorkingUser:product.get('dwWorkingUser'),
				
				dwFinalState:product.get('dwFinalState'),
				dwFinalDate:product.get('dwFinalDate'),
				dwFinalComment:product.get('dwFinalComment'),
				dwFinalUser:product.get('dwFinalUser'),
				
				components:[]
			};
			var subOrder = 1;
			for (var j=0;j<product.childNodes.length;j++) {
				var component = product.childNodes[j];
				var newSubItem = {
					vesselIdx:newItem.vesselIdx,
					parentItemIdx:component.get('parentItemIdx'),
					parentComponentIdx:newItem.componentIdx,
					componentIdx:component.get('componentIdx'),
					subItemOrder:subOrder++,
					qty:component.get('qty'),
					serialNo:component.get('serialNo'),
					remark:component.get('remark'),
					tag:_FUNCTION.getTagToStringValue(component.get('tag'))
				};				
				newItem.components.push(newSubItem);
			}
			
			products.push(newItem);
		}
		var data = {vesselIdx:vesselIdx, products:products};
    	KJERP.controller.Main.requestService('updateEquipment', data, function(ret) {
    		form.setModified(false);
    	});	
    },        
    onSelectionSubGridChangeList:function(list, selected) {
    	var me = this;    	
    	me.updateButton(list.view.grid, selected.length == 0 ? null : selected[0]);
    },     
    onQuotationItemDblClick:function() {
    	
    },
    processCopy:function(cmp) {
		var me = this,
    		list = me.getList(),
    		selections = list.getSelectionModel().getSelection(),
    		store = list.getStore();
    	
    	//me.setIsVesselContext(cmp.up('vesselmain')?true:false);
    	
		var data = {vesselIdx:selections[0].get('vesselIdx')};
    	var callback = function() {	
	    	if (selections.length!=1) {
	    		Ext.Msg.alert(_MESSAGE.alertTitle,'Please select an item to duplicate');
	    		return;
	    	}
	    	
	    	KJERP.controller.Main.requestService('copyVessel', data, function(ret) {
	    		var rows = ret.rows;
				// insert new row  넣고 선택되게...
	    		store.add(rows);	    		
	    		// goto row
				list.getSelectionModel().deselectAll();				
				list.getSelectionModel().select(store.last());
				list.getView().focusRow(store.last());	
	    	});	
    	};
    	Ext.MessageBox.confirm(_MESSAGE.alertTitle, 
			'Confirm to duplicate selected item?',
			function(btnId) {
			if (btnId == 'yes') {
				callback();
			}
		});	    	
    },
    init:function() {
    	var me = this;
    	me.control({
    		'vessellist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'vessellist button[action=search]': {
				click:me.onSearch
    		},
    		'vessellist button[action=copy]': {
    			click:me.onCopy
    		}, 
			'vessellist button[action=add]': {
				click:me.onAdd
    		},
			'vessellist button[action=edit]': {
				click:me.onEdit
    		},
			'vessellist button[action=del]': {
				click:me.onDelete
    		},	
			'vessellist button[action=view]': {
				click:me.onView
    		},	
    		'vessellist combo[name=active]': {
    			change:me.onChangeActive
    		},    		
    		'vesselform':{
    			activate:me.onActivateForm
    		},
			'vesselform>formheader>button[action=save]': {
				click:me.onSave
    		},	
			'vesselform>formheader>button[action=del]': {
				click:me.onDelete
    		},	
			'vesselform>formheader>button[action=close]': {
				click:me.onClose
    		},	
			'vesselform>formheader>button[action=excel]': {
				click:me.onExcel
    		},
			'vesselform>formheader>button[action=reset]': {
				click:me.onReset
			},
    		'vesselmain vesselequipments button[action=add]': {
    			click:me.onAddEquipment
    		},
    		'vesselmain vesselequipments button[action=del]': {
    			click:me.onDelEquipment
    		},
    		'vesselmain vesselequipments button[action=save]': {
    			click:me.onSaveEquipment
    		},
    		'vesselmain vesselequipments':{
    			selectionchange:me.onSelectionSubGridChangeList
    		},			
    		'vesselmain vesselquotations':{
    			selectionchange:me.onSelectionSubGridChangeList
    		},			
    		'vesselmain vesselquotations':{
    			selectionchange:me.onSelectionSubGridChangeList,
    			itemdblclick:me.onQuotationItemDblClick
    		}		
    	});
    }
});
