Ext.define('KJERP.controller.Shipping', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
   		ref:'work', selector:'job [name=work]'    		
   	}],
   	getMain:function() {
   		var me = this;
   		var query = 'shippingmain';
   		if (me.getIsVesselContext()) {
   			query = 'vesselmain';
   		}   		
   		return Ext.ComponentQuery.query(query)[0];   		
   	},   	
   	getForm:function() {
   		var me = this,
   			main = me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'shippingform');		
   	},
   	getList:function() {
   		var me = this;
   		var query = 'shippingmain shippinglist';
   		if (me.getIsVesselContext()) {
   			query = 'vesselmain shippinglist';
   		}   		
   		return Ext.ComponentQuery.query(query)[0];
   	},
   	getProducts:function() {
   		var me = this,
   			form = me.getForm();
   		return form.down('shippingproducts');
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
   		form.setTitle('New Shipping');
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
   		form.setTitle('Shipping - '+record.get('title')+'&nbsp;#'+ _FUNCTION.getMergeValue(record.get('HullCode'), record.get('HullName')));
   		
		form.down('vesselfield').setValue(record);
		form.down('[name=contactIdx]').setValue(_FUNCTION.getMergeValue(record.get('contactName'),  record.get('position')), 
														record.get('contactIdx'));

		form.down('[name=assignedContactIdx]').setValue(_FUNCTION.getMergeValue(record.get('assignedContactName'),  record.get('assignedPosition')), 
																		record.get('assignedContactIdx'));
														
		form.down('filecombo').setAppIdx(record.get('shippingIdx'));   		
		me.loadNAppendShippingItem();
   	},   	
   	processSetContract:function(record) {
   		_DEBUG.log('processSetContract', arguments);   		
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		
		_FUNCTION.resetStoreAtForm(form);   			
		if (record)
			me.editRecord(record, form);
		else
			me.editRecordAtList(list, form);
			
   		//var record = form.getRecord();
   		
   		form.setTitle('Shipping - '+record.get('title')+'&nbsp;#'+ _FUNCTION.getMergeValue(record.get('HullCode'), record.get('HullName')));
   		
		form.down('vesselfield').setValue(record);
		form.down('[name=contactIdx]').setValue(_FUNCTION.getMergeValue(record.get('contactName'),  record.get('position')), 
														record.get('contactIdx'));

		form.down('[name=assignedContactIdx]').setValue(_FUNCTION.getMergeValue(record.get('assignedContactName'),  record.get('assignedPosition')), 
																		record.get('assignedContactIdx'));																
		me.loadNAppendContractItem();
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteShipping', list, form);
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
   			shippingIdx = 0;
   			
   		if (record) {
    		vesselIdx = record.get('vesselIdx'),
    		shippingIdx =  record.get('shippingIdx');
   		}
   	
		var products = [];
		var order = 1;
		for (var i=0;i<root.childNodes.length;i++) {
			var product = root.childNodes[i];
			var newItem = {
				shippingIdx:shippingIdx,
				vesselIdx:vesselIdx,
				componentIdx:product.get('componentIdx'),
				itemOrder:order++,
				price:product.get('uniPrice'),
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
					shippingIdx:shippingIdx,
					vesselIdx:newItem.vesselIdx,
					parentComponentIdx:newItem.componentIdx,
					parentItemIdx:component.get('parentItemIdx'),
					componentIdx:component.get('componentIdx'),
					subItemOrder:subOrder++,
					price:component.get('unitPrice'),
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
		
		console.log('service');
   		me.saveRecord('updateShipping', list, form);
   	},
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getShippingList', list);
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
					shippingIdx:0,
					vesselIdx:0,
					componentIdx:selected.get('componentIdx'),
					name:selected.get('name'),
					model:selected.get('model'),
					type:selected.get('type'),
					tag:selected.get('tag'),
					leaf:selected.get('leaf'),
					iconCls:selected.get('iconCls'),
					serialNo:'',
					qty:1,
					//unitPrice:0,
					//price:0,
					//tax:0,
					//total:0,
					unitPrice:(selected.get('listPrice')==0)?0:selected.get('listPrice'),
					price:(selected.get('listPrice')==0)?0:selected.get('listPrice'),									
					tax:0,
					total:(selected.get('listPrice')==0)?0:selected.get('listPrice'),
					remark:'',
					InterIn:selected.get('InterIn'),
					InterOut:selected.get('InterOut')
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
    loadNAppendContractItem:function() {
    	var me = this,
			form = me.getForm(),
    		record = form.getRecord(),
    		vesselIdx = record.get('vesselIdx'),    	
    		contractIdx = record.get('contractIdx'),
    		grid = me.getProducts(),
    		store = grid.getStore(),
			rootNode = store.getRootNode()
    	var data = {filters:[
    		{"property":'contractIdx',"value":contractIdx}
    	]};
    	KJERP.controller.Main.requestService('getContractItemsX', data, function(ret) {
    		rootNode.appendChild(ret.rows);
    	});	
    	
    },
    loadNAppendShippingItem:function() {
    	var me = this,
			form = me.getForm(),
    		record = form.getRecord(),
    		vesselIdx = record.get('vesselIdx'),    	
    		shippingIdx = record.get('shippingIdx'),
    		grid = me.getProducts(),
    		store = grid.getStore(),
			rootNode = store.getRootNode()
    	var data = {filters:[
    		{"property":'shippingIdx',"value":shippingIdx}
    	]};
    	
    	KJERP.controller.Main.requestService('getShippingItemsX', data, function(ret) {
    		rootNode.appendChild(ret.rows);
    	});	
    	/*
    	KJERP.controller.Main.requestService('getShippingItems', data, function(ret) {
    		var rows = ret.rows;
    		//중복 확인 
			for (var i=0;i<rows.length;i++) {
				var row = rows[i];
				var newRecord = Ext.create('KJERP.model.ShippingItem', row);
				rootNode.appendChild(newRecord);
				me.loadNAppendShippingSubItem(newRecord );
			}
			if (rows.length>0) {
				rootNode.expand();
			}		
    	});	
    	*/
    },
    loadNAppendShippingSubItem:function(record) {
    	var me = this,
    		grid = me.getProducts();
    	
    	var data = {filters:[
	    		{"property":'parentComponentIdx',"value":record.get('componentIdx')},
	    		{"property":'vesselIdx',"value":record.get('vesselIdx')},
	    		{"property":'shippingIdx',"value":record.get('shippingIdx')}
			],"isLeaf":true};
			
    	KJERP.controller.Main.requestService('getShippingSubItems', data, function(ret) {
    		record.appendChild(ret.rows);
    	});	
    },      
    processCopy:function(cmp) {
		var me = this,
    		list = me.getList(),
    		selections = list.getSelectionModel().getSelection(),
    		store = list.getStore();
    		
		//me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		
		var data = {shippingIdx:selections[0].get('shippingIdx')};
		
    	var callback = function() {	
	    	if (selections.length!=1) {
	    		Ext.Msg.alert(_MESSAGE.alertTitle,'Please select an item to duplicate');
	    		return;
	    	}
	    	
	    	KJERP.controller.Main.requestService('copyShipping', data, function(ret) {
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
		
		var data = {shippingIdx:selections[0].get('shippingIdx')};
		     	    		
    	var callback = function() {	
	    	if (selections.length!=1) {
	    		Ext.Msg.alert(_MESSAGE.alertTitle,'Please select an item to duplicate');
	    		return;
	    	}
	    	
	    	KJERP.controller.Main.requestService('shippingToEquipment', data, function(ret) {
	    		var rows = ret.rows;
				// insert new row  넣고 선택되게...	    		
	    	
	    	});	
    	};
    	Ext.MessageBox.confirm(_MESSAGE.alertTitle, 
    			'Confirm to Add Equipment selected shipping?',
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
    	var query='shipping';    	
    	me.onChangeQty(newValue,query);
    },
    init:function() {
    	
    	var me = this;
    	me.control({
    		'shippinglist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'shippinglist button[action=search]': {
				click:me.onSearch
    		},
			'shippinglist button[action=add]': {
				click:me.onAdd
    		},
			'shippinglist button[action=edit]': {
				click:me.onEdit
    		},
			'shippinglist button[action=del]': {
				click:me.onDelete
    		},	
			'shippinglist button[action=view]': {
				click:me.onView
    		},	
    		'shippinglist button[action=copy]': {
    			click:me.onCopy
    		}, 
    		'shippinglist button[action=toEquipment]': {
    			click:me.toEquipment
    		}, 
    		'shippinglist combo[name=active]': {
    			change:me.onChangeActive
    		},    		
    		
    		'shippingform':{
    			activate:me.onActivateForm
    		},
			'shippingform>formheader>button[action=save]': {
				click:me.onSave
    		},	
			'shippingform>formheader>button[action=del]': {
				click:me.onDelete
    		},	
			'shippingform>formheader>button[action=close]': {
				click:me.onClose
    		},	
			'shippingform>formheader>button[action=excel]': {
				click:me.onExcel
    		},
			'shippingform>formheader>button[action=reset]': {
				click:me.onReset
    		},
    		'shippingform [name=vesselIdx]': {
    			change:me.onSetTitle
    		},
    		'shippingform [name=fromCompanyIdx]': {
				blur:me.onSetTitle
    		},
    		'shippingform [name=toCompanyIdx]': {
				blur:me.onSetTitle
    		},
    		'shippingproducts button[action=add]': {
    			click:me.onAddProduct
    		},
    		'shippingproducts button[action=del]': {
    			click:me.onDelProduct
    		},
    		'shippingproducts button[action=save]': {
    			click:me.onSaveProduct
    		},    		
    		'shippingproducts button[action=refresh]': {
    			click:me.onRefreshProducts
    		},
    		'shippingproducts button[action=addVesselProduct]': {
    			click:me.onAddVesselProduct
    		},
    		'shippingproducts':{
    			selectionchange:me.onSelectionProductsChangeList
    		}
    	});
    }
});
