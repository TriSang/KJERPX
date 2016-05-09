Ext.define('KJERP.controller.Service', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
   		ref:'work', selector:'job [name=work]'    		
   	}],
   	getMain:function() {
   		var me = this;
   		var query = 'servicemain';
   		if (me.getIsVesselContext()) {
   			query = 'vesselmain';
   		}   		
   		return Ext.ComponentQuery.query(query)[0];   		
   	},   	
   	getForm:function() {
   		var me = this,
   			main = me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'serviceform');	
   	},
   	getList:function() {
   		var me = this;
   		var query = 'servicemain servicelist';
   		if (me.getIsVesselContext()) {
   			query = 'vesselmain servicelist';
   		}   		
   		return Ext.ComponentQuery.query(query)[0];
   	},
   	getProducts:function() {
   		var me = this,
   			form = me.getForm();
   		return form.down('serviceproducts');
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
   		form.setTitle('New Service');
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
			
   		var record = form.getRecord();
   		form.setTitle('Service - '+record.get('title')+'&nbsp;#'+ _FUNCTION.getMergeValue(record.get('HullCode'), record.get('HullName')));
		form.down('vesselfield').setValue(record);
		form.down('[name=contactIdx]').setValue(_FUNCTION.getMergeValue(record.get('contactName'),  record.get('position')), 
														record.get('contactIdx'));
		form.down('[name=assignedContactIdx]').setValue(_FUNCTION.getMergeValue(record.get('assignedContactName'),  record.get('assignedPosition')), 
																		record.get('assignedContactIdx'));
		form.down('[name=workerContactIdx]').setValue(_FUNCTION.getMergeValue(record.get('workerContactName'),  record.get('workerPosition')), 
																		record.get('workerContactIdx'));
		form.down('[name=localContactIdx]').setValue(_FUNCTION.getMergeValue(record.get('localContactName'),  record.get('localPosition')), 
																		record.get('localContactIdx'));																		
		form.down('filecombo').setAppIdx(record.get('serviceIdx'));   		
		
		me.loadNAppendServiceItem();
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteService', list, form);

   	},   
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm(),
   			products = me.getProducts(),
   			store = products.getStore(),
   			root = store.getRootNode(),
   			record = form.getRecord(),
   			vesselIdx = 0,
   			serviceIdx = 0;
   			
   		if (record) {
    		serviceIdx =  record.get('serviceIdx');
   		}
   	
		var products = [];
		var order = 1;
		for (var i=0;i<root.childNodes.length;i++) {
			var product = root.childNodes[i];
			var newItem = {
				serviceIdx:serviceIdx,
				vesselIdx:vesselIdx,
				componentIdx:product.get('componentIdx'),
				itemOrder:order++,
				uniPrice:product.get('uniPrice'),
				qty:product.get('qty'),
				price:product.get('price'),
				tax:product.get('tax'),
				total:product.get('total'),
				remark:product.get('remark'),
				InterIn:product.get('InterIn'),
				InterOut:product.get('InterOut'),
				tag:_FUNCTION.getTagToStringValue(product.get('tag')),
				components:[]
			};
			var subOrder = 1;
			for (var j=0;j<product.childNodes.length;j++) {
				var component = product.childNodes[j];
				var newSubItem = {
					serviceIdx:serviceIdx,
					vesselIdx:newItem.vesselIdx,
					parentItemIdx:component.get('parentItemIdx'),
					parentComponentIdx:newItem.componentIdx,
					componentIdx:component.get('componentIdx'),
					subItemOrder:subOrder++,
					unitPrice:component.get('unitPrice'),
					qty:component.get('qty'),
					price:component.get('price'),
					tax:component.get('tax'),
					total:component.get('total'),
					remark:component.get('remark'),
					InterIn:component.get('InterIn'),
					InterOut:component.get('InterOut'),
					tag:_FUNCTION.getTagToStringValue(component.get('tag'))
				};				
				newItem.components.push(newSubItem);
			}
			
			products.push(newItem);
		}
		
		form.down('hiddenfield[name=products]').setValue( JSON.stringify(products));
   		me.saveRecord('updateService', list, form);
   	},
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getServiceList', list);
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
		var store = list.getStore();
		if (store.getCount() ==0) {
			me.processSearch(function(records) {
			    	if (records && records.length >0) {
			        	grid.getSelectionModel().select(records[0]);
			    	}
			});
		}
		me.updateButton(list, null);
			
		return false;	
    },
    onAddProduct:function(button) {
    	var me = this,
    		grid = button.up('grid,treepanel'),
    		form = me.getForm(),
    		record = form.getRecord(),
    		store = grid.getStore();
    	
    	var callback = function(selecteds) {
    		var funcNewRecord = function(selected) {
				return Ext.create('KJERP.model.Product', 
				{
					serviceIdx:0,
					vesselIdx:0,
					componentIdx:selected.get('componentIdx'),
					name:selected.get('name'),
					model:selected.get('model'),
					type:selected.get('type'),
					tag:selected.get('tag'),
					leaf:selected.get('leaf'),
					iconCls:selected.get('iconCls'),
					qty:1,
					unitPrice:(selected.get('listPrice')==0)?0:selected.get('listPrice'),
					price:(selected.get('listPrice')==0)?0:selected.get('listPrice'),					
					tax:0,
					total:(selected.get('listPrice')==0)?0:selected.get('listPrice'),
					remark:''
				});    			
    		}
    		if (_FUNCTION.appendTreePanel(store.getRootNode(), selecteds,funcNewRecord).length > 0) {
    			Ext.Msg.alert(_MESSAGE.alertTitle, 'Selected items are registerd.');
    		}
    	}
    	
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
    loadNAppendServiceItem:function() {
    	var me = this,
			form = me.getForm(),
    		record = form.getRecord(),
    		vesselIdx = record.get('vesselIdx'),    	
    		serviceIdx = record.get('serviceIdx'),
    		grid = me.getProducts(),
    		store = grid.getStore(),
			rootNode = store.getRootNode()
    	var data = {filters:[
    		{"property":'vesselIdx',"value":vesselIdx},
    		{"property":'serviceIdx',"value":serviceIdx}
    	]};
    	
    	KJERP.controller.Main.requestService('getServiceItemsX', data, function(ret) {
    		rootNode.appendChild(ret.rows);
    	});	
    	/*
    	KJERP.controller.Main.requestService('getServiceItems', data, function(ret) {
    		var rows = ret.rows;
    		//중복 확인 
			for (var i=0;i<rows.length;i++) {
				var row = rows[i];
				var newRecord = Ext.create('KJERP.model.ServiceItem', row);
				rootNode.appendChild(newRecord);
				me.loadNAppendServiceSubItem(newRecord );
			}
			if (rows.length>0) {
				rootNode.expand();
			}		
    	});	
    	*/
    },
    loadNAppendServiceSubItem:function(record) {
    	var me = this,
    		grid = me.getProducts();
    	
    	var data = {filters:[
	    		{"property":'parentComponentIdx',"value":record.get('componentIdx')},
	    		{"property":'vesselIdx',"value":record.get('vesselIdx')},
	    		{"property":'serviceIdx',"value":record.get('serviceIdx')}
			],"isLeaf":true};
			
    	KJERP.controller.Main.requestService('getServiceSubItems', data, function(ret) {
    		record.appendChild(ret.rows);
    	});	
    },      
    processCopy:function() {
		var me = this,
    		list = me.getList(),
    		selections = list.getSelectionModel().getSelection(),
    		store = list.getStore();
		
		var data = {serviceIdx:selections[0].get('serviceIdx')};
    	var callback = function() {	
	    	if (selections.length!=1) {
	    		Ext.Msg.alert(_MESSAGE.alertTitle,'Please select an item to duplicate');
	    		return;
	    	}
	    	
	    	KJERP.controller.Main.requestService('copyService', data, function(ret) {
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
    processAddToEquipment:function(cmp) {
		var me = this,
    		list = me.getList(),
    		selections = list.getSelectionModel().getSelection(),
    		store = list.getStore();
    	
		//me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		var data = {serviceIdx:selections[0].get('serviceIdx')};
		     	    		
    	var callback = function() {	
	    	if (selections.length!=1) {
	    		Ext.Msg.alert(_MESSAGE.alertTitle,'Please select an item to duplicate');
	    		return;
	    	}
	    	
	    	KJERP.controller.Main.requestService('serviceToEquipment', data, function(ret) {
	    		var rows = ret.rows;
				// insert new row  넣고 선택되게...	    		
	    	
	    	});	
    	};
    	Ext.MessageBox.confirm(_MESSAGE.alertTitle, 
    		'Confirm to Add Equipment selected service?',
			function(btnId) {
			if (btnId == 'yes') {
				callback();
			}
		});	    	
    },
   
    onDelProduct:function(button) {
    	var me = this,
    		grid = button.up('treepanel');
    	var callback = function() {
			var selections = grid.getSelection();
			for (var i=0;i<selections.length;i++) {
				selections[i].remove();
			}
		}
    	
		Ext.MessageBox.confirm(_MESSAGE.alertTitle, _MESSAGE.confirmToDelete, function(btnId) {
				if (btnId == 'yes') {
					callback();
				}
		});	    	
    },
    onSaveProduct:function(button) {
    	
    },
    onSelectionProductsChangeList:function(model, selected) {
    	var me = this,
    		list = me.getProducts();
    	
    	me.updateButton(list, selected.length == 0 ? null : selected[0]);
    },
    changeQty:function(obj, newValue, oldValue, eOpts){     	
    	var me = this;
    	var query='service';    	
    	me.onChangeQty(newValue,query);
    },
    init:function() {
    	
    	var me = this;
    	me.control({
    		'servicelist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'servicelist button[action=search]': {
				click:me.onSearch
    		},
			'servicelist button[action=add]': {
				click:me.onAdd
    		},
			'servicelist button[action=edit]': {
				click:me.onEdit
    		},
			'servicelist button[action=del]': {
				click:me.onDelete
    		},	
			'servicelist button[action=view]': {
				click:me.onView
    		},
    		'servicelist button[action=copy]': {
    			click:me.onCopy
    		}, 
    		'servicelist button[action=toEquipment]': {
    			click:me.toEquipment
    		}, 

    		'servicelist combo[name=active]': {
    			change:me.onChangeActive
    		},    		
    		'serviceform':{
    			activate:me.onActivateForm
    		},
			'serviceform>formheader>button[action=save]': {
				click:me.onSave
    		},	
			'serviceform>formheader>button[action=del]': {
				click:me.onDelete
    		},	
			'serviceform>formheader>button[action=close]': {
				click:me.onClose
    		},	
			'serviceform>formheader>button[action=excel]': {
				click:me.onExcel
    		},
			'serviceform>formheader>button[action=reset]': {
				click:me.onReset
    		},
    		'serviceform [name=vesselIdx]': {
    			change:me.onSetTitle
    		},
    		'serviceform [name=fromCompanyIdx]': {
				blur:me.onSetTitle
    		},
    		'serviceform [name=toCompanyIdx]': {
				blur:me.onSetTitle
    		},
    		'serviceproducts button[action=add]': {
    			click:me.onAddProduct
    		},
    		'serviceproducts button[action=del]': {
    			click:me.onDelProduct
    		},
    		'serviceproducts button[action=save]': {
    			click:me.onSaveProduct
    		},    		
    		'serviceproducts button[action=refresh]': {
    			click:me.onRefreshProducts
    		}, 
    		'serviceproducts button[action=addVesselProduct]': {
    			click:me.onAddVesselProduct
    		},
    		'serviceproducts':{
    			selectionchange:me.onSelectionProductsChangeList
    		}
    	});
    }
});
