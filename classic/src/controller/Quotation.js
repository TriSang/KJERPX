Ext.define('KJERP.controller.Quotation', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
   		ref:'work', selector:'job [name=work]'    		
   	}],
   	getMain:function() {
   		var me = this;
   		var query = 'quotationmain';
   		if (me.getIsVesselContext()) {
   			query = 'vesselmain';
   		}   		
   		return Ext.ComponentQuery.query(query)[0];   		
   	},   	
   	getForm:function() {
   		var me = this,
   			main = me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'quotationform');	 		
   	},
   	getList:function() {
   		var me = this;
   		var query = 'quotationmain quotationlist';
   		if (me.getIsVesselContext()) {
   			query = 'vesselmain quotationlist';
   		}   		
   		return Ext.ComponentQuery.query(query)[0];
   	},
   	getProducts:function() {
   		var me = this,
   			form = me.getForm();
   		return form.down('quotationproducts');
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
   		form.setTitle('New Quotation');
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
 		form.setTitle('Quotation - '+ record.get('title')+'&nbsp;#'+ _FUNCTION.getMergeValue(record.get('HullCode'), record.get('HullName')));
		form.down('vesselfield').setValue(record);
		form.down('[name=contactIdx]').setValue(_FUNCTION.getMergeValue(record.get('contactName'),  record.get('position')), 
														record.get('contactIdx'));
		form.down('filecombo').setAppIdx(record.get('quotationIdx'));
		
		me.loadNAppendQuotationItem();
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteQuotation', list, form);

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
   			quotationIdx = 0;
   			
   		if (record) {
    		vesselIdx = record.get('vesselIdx'),
    		quotationIdx =  record.get('quotationIdx');
   		}
   	
		var products = [];
		var order = 1;
		for (var i=0;i<root.childNodes.length;i++) {
			var product = root.childNodes[i];
			var newItem = {
				quotationIdx:quotationIdx,
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
					quotationIdx:quotationIdx,
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
   		me.saveRecord('updateQuotation', list, form);
   	},
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getQuotationList', list);
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
    	
    	//if check vessel productlist and remove it	
    	if (Ext.ComponentQuery.query('[name=equipmentlist]').length>0) {
    		var productList = Ext.ComponentQuery.query('[name=equipmentlist]')[0];
    		if (_OPTION.config.selectComponentFromWindow) {
    			productList.close();
    		} else {
    			button.up('panel').removeDocked(productList);
    		}
    	}
    	
    	if (Ext.ComponentQuery.query('[name=productlist]').length>0) {
    		var productList = Ext.ComponentQuery.query('[name=productlist]')[0];
    		if (_OPTION.config.selectComponentFromWindow) {
    			productList.close();
    		} else {
    			button.up('panel').removeDocked(productList);
    		}
    		return; 	// if already exist
    	}
    		
    	var callback = function(selecteds) {    		
    		var funcNewRecord = function(selected) {
    			
				return Ext.create('KJERP.model.Product', 
				{
					quotationIdx:0,
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
					remark:'',
					InterIn:selected.get('InterIn'),
					InterOut:selected.get('InterOut')
				});    			
    		}
    		
    		if (_FUNCTION.appendTreePanel(store.getRootNode(), selecteds,funcNewRecord).length>0) {
    			if (_OPTION.config.removeCompoentAfterAddComponent) {
    				_FUNCTION.removeSelectedNode(selecteds);
    			}
    			
    			if (_OPTION.config.showMessageAfterAddComponent) {
    				Ext.Msg.alert(_MESSAGE.alertTitle, 'Selected items are registerd.');
    			}
    		}
    	}
    	
    	if (_OPTION.config.selectComponentFromWindow) {
	    	var productList = Ext.create('Ext.window.Window', {
	    		title:'Product',
	    		name:'productlist',
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
	    			popupDestStore:store,
	    			isUpdateSelected:true,
	    			toHideFields:[],
	    			callbackOnSelect:callback
	    		}]
	    	});
	    	productList.show();	
    	} else {
    		var productList = Ext.create('Ext.Panel', {
	    		title:'Product',
	    		name:'productlist',
	    		layout:_POPUP.layout,
	    		closable:_POPUP.closable,
	    		closeAction:_POPUP.closeAction,
	    		height:_POPUP.height,
	    		dock:'bottom',
	    		items:[{
	    			xtype:'productlist',
	    			popupSelectionMode:true,
	    			popupDestStore:store,
	    			isUpdateSelected:true,
	    			toHideFields:[],
	    			callbackOnSelect:callback
	    		}]
	    	});
	    	button.up('panel').addDocked(productList);
    	}
    },
    
    loadNAppendQuotationItem:function() {
    	var me = this,
			form = me.getForm(),
    		record = form.getRecord(),
    		vesselIdx = record.get('vesselIdx'),    	
    		quotationIdx = record.get('quotationIdx'),
    		grid = me.getProducts(),
    		store = grid.getStore(),
			rootNode = store.getRootNode()
    	var data = {filters:[
    		{"property":'quotationIdx',"value":quotationIdx}
    	]};
    	KJERP.controller.Main.requestService('getQuotationItemsX', data, function(ret) {
    		rootNode.appendChild(ret.rows);
    	});	
    },
    loadNAppendQuotationSubItem:function(record) {
    	var me = this,
    		grid = me.getProducts();
    	
    	var data = {filters:[
	    		{"property":'parentComponentIdx',"value":record.get('componentIdx')},
	    		{"property":'vesselIdx',"value":record.get('vesselIdx')},
	    		{"property":'quotationIdx',"value":record.get('quotationIdx')}
			],"isLeaf":true};
			
    	KJERP.controller.Main.requestService('getQuotationSubItems', data, function(ret) {
    		record.appendChild(ret.rows, true);
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
    processCopy:function(cmp) {
		var me = this,
    		list = me.getList(),
    		selections = list.getSelectionModel().getSelection(),
    		store = list.getStore();
    		
    	//me.setIsVesselContext(cmp.up('vesselmain')?true:false);
    	
		var data = {quotationIdx:selections[0].get('quotationIdx')};
		     	    		
    	var callback = function() {	
	    	if (selections.length!=1) {
	    		Ext.Msg.alert(_MESSAGE.alertTitle,'Please select an item to duplicate');
	    		return;
	    	}
	    	
	    	KJERP.controller.Main.requestService('copyQuotation', data, function(ret) {
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
    processTransfer:function(cmp) {
    	var me = this,
    		list = me.getList(),
    		selections = list.getSelectionModel().getSelection();
    		
		//me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		
    	var callback = function() {	
	    	if (selections.length==0) {
	    		Ext.Msg.alert(_MESSAGE.alertTitle,'Please select item to make a Contract');
	    		return;
	    	}
	    	
	    	// check if same vessel
	    	if (_FUNCTION.isSameVesselSeleted(selections)== false) {
	    		Ext.Msg.alert(_MESSAGE.alertTitle,'Selected item shall have same vessel');
	    		return;
	    	}
	    	
	    	var appIdxs = _FUNCTION.getAppIdxArray(selections, 'quotationIdx');
			var data = {
				contractIdx:0,
				quotations:appIdxs
			};
			
	    	KJERP.controller.Main.requestService('updateQuotationToContract', data, function(ret) {
	    		var rows = ret.rows;
	
	    	});	
    	};
    	Ext.MessageBox.confirm(_MESSAGE.alertTitle, 
			'Confirm to transfer selected quotation to a contract?',
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
		
		var data = {quotationIdx:selections[0].get('quotationIdx')};
		     	    		
    	var callback = function() {	
	    	if (selections.length!=1) {
	    		Ext.Msg.alert(_MESSAGE.alertTitle,'Please select an item to duplicate');
	    		return;
	    	}
	    	
	    	KJERP.controller.Main.requestService('quotationToEquipment', data, function(ret) {
	    		var rows = ret.rows;
				// insert new row  넣고 선택되게...	    		
	    	
	    	});	
    	};
    	Ext.MessageBox.confirm(_MESSAGE.alertTitle, 
    			'Confirm to Add Equipment selected quotation?',
			function(btnId) {
			if (btnId == 'yes') {
				callback();
			}
		});	    	
    },   
    changeQty:function(obj, listitem, eOpts){     
    	
    	var me = this;
    	var query='quotation';    	
    	console.log("newValue : "+newValue);
    	me.onChangeQty(newValue,query);
    },
    init:function() {
    	var me = this;
    	me.control({
    		'quotationlist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'quotationlist button[action=search]': {
				click:me.onSearch
    		},
			'quotationlist button[action=add]': {
				click:me.onAdd
    		},
			'quotationlist button[action=edit]': {
				click:me.onEdit
    		},
			'quotationlist button[action=del]': {
				click:me.onDelete
    		},	
			'quotationlist button[action=view]': {
				click:me.onView
    		},	
    		'quotationlist button[action=copy]': {
    			click:me.onCopy
    		},   
    		'quotationlist button[action=toEquipment]': {
    			click:me.toEquipment
    		}, 
    		'quotationlist button[action=transfer]': {
    			click:me.onTransfer
    		},        		
    		'quotationlist combo[name=active]': {
    			click:me.onChangeActive
    		},    		
    		'quotationform':{
    			activate:me.onActivateForm
    		},
			'quotationform>formheader>button[action=save]': {
				click:me.onSave
    		},	
			'quotationform>formheader>button[action=del]': {
				click:me.onDelete
    		},	
			'quotationform>formheader>button[action=close]': {
				click:me.onClose
    		},	
			'quotationform>formheader>button[action=excel]': {
				click:me.onExcel
    		},
			'quotationform>formheader>button[action=reset]': {
				click:me.onReset
    		},
    		'quotationform [name=vesselIdx]': {
    			change:me.onSetTitle
    		},
    		'quotationform [name=fromCompanyIdx]': {
				blur:me.onSetTitle
    		},
    		'quotationform [name=toCompanyIdx]': {
				blur:me.onSetTitle
    		},
    		'quotationproducts button[action=add]': {
    			click:me.onAddProduct
    		},
    		'quotationproducts button[action=addVesselProduct]': {
    			click:me.onAddVesselProduct
    		},
    		
    		'quotationproducts button[action=del]': {
    			click:me.onDelProduct
    		},
    		'quotationproducts button[action=save]': {
    			click:me.onSaveProduct
    		},    		
    		'quotationproducts button[action=refresh]': {
    			click:me.onRefreshProducts
    		},    		
    		'quotationproducts':{
    			selectionchange:me.onSelectionProductsChangeList
    		}
    	});
    }
});
