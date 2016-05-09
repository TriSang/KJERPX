Ext.define('KJERP.controller.Product', {
	extend: 'KJERP.controller.Default',
    requires:['KJERP.view.product.Form',
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
		ref:'main', selector:'productmain'
   	},{
		ref:'components', selector:'productcomponents'		
   	}, {
   		ref:'work', selector:'job [name=work]' 
   	}],
   	getForm:function() {   		
   		var me = this,
   			main = me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'productform');	
   	},   	
   	getList:function() {
   		var me = this;
   		var list = Ext.ComponentQuery.query('productlist[popupSelectionMode=true]')[0]; //select popup first
   		if  (!list){
   			list = Ext.ComponentQuery.query('productlist')[0];
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
   		form.setTitle('New Product');
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
		form.down('filecombo').setAppIdx(record.get('componentIdx'));
		form.down('componenttreegroupfield').setValue(record.get('compGroupName'), record.get('compGroupIdx'));
		form.setTitle('Product  - ' + _FUNCTION.getMergeValue(record.get('name'), record.get('model')));
   		me.loadComponents();   		
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteProduct', list, form);

   	},   
   	loadComponents:function() {
   		_DEBUG.log('loadComponents', arguments);
   		var me = this,
   		   form = me.getForm(),
   		   record = form.getRecord(),
   		   grid = form.down('grid'),
   		   store = grid.getStore();
   		   
			var data = {
   		   		filters:[
   		   			{property:'componentIdx', value:record.get('componentIdx')}
   		   		]
   		   	};
   		   	var callback = function(result) {
   		   		
   		   		store.clearData();
   		   		store.add(result.rows);
   		   	}
   		   	KJERP.controller.Main.requestService('getProductComponents', data, callback);
   	},
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
		var componentsStore = form.down('grid').getStore();
		var components = [];
		var order = 1;
		componentsStore.each(function(record) {
			components.push({
				componentIdx:0,
		        subComponentIdx:record.get('subComponentIdx'),
		        componentOrder:order++,
		        qty:record.get('qty'),
		        tag:_FUNCTION.getTagToStringValue(record.get('tag')),
		        componentTypeIdx:record.get('componentTypeIdx'),
		        componentCategoryIdx:record.get('componentCategoryIdx'),
		        componentQty:record.get('componentQty'),
		        remark:record.get('remark')
			});
		});
		
   		if (components.length >0) { 
   			form.down('hiddenfield[name=components]').setValue( JSON.stringify(components));
	   		me.saveRecord('updateProduct', list, form);
   		} else {
   			KJERP.controller.Main.showAlert('Components are empty');
   		}
   	},
   	processSearch:function() {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,   		
   			list = me.getList(),
   			callback = null;
   		me.searchRecord('getProductList', list, null, callback);
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
    onAddComponent:function(button) {
    	var me = this,
    		grid = button.up('grid'),
    		store = grid.getStore();
    	
    	var callback = function(selecteds) {
    		if (selecteds && selecteds.length>0) {
    			//중복 확인 
    			var duplicateds=[];
    			
    			for (var i=0;i<selecteds.length;i++) {
    				var selected = selecteds[i];
    				if (store.findExact('subComponentIdx', selected.get('componentIdx')) != -1) {
    					var duplicatedComponent = selected.get('name')+'/'+selected.get('model');
    					duplicateds.push('<br />&nsbp;-'+duplicatedComponent);
    				}
    				
    				var newRecord = Ext.create('KJERP.model.ProductComponent', 
    				{
    					subComponentIdx:selected.get('componentIdx'),
    					name:selected.get('name'),
    					companyName:selected.get('companyName'),
    					model:selected.get('model'),
    					qty:1,
    					tag:selected.get('tag'),
    					type:selected.get('type'),
    					remark:selected.get('remark'),
    					componentTypeIdx:0,
    					componentCategoryIdx:0
    				});
    				store.add(newRecord);
    			}
    			popup.close();
				
				if (duplicateds.length>0) {
					var message = duplicateds.toString();
					message = 'Below components are registered as duplicated.'+ message;
					Ext.Msg.alert(_MESSAGE.alertTitle, message);
				}
    			
    		}
    	};
    	var popup = Ext.create('Ext.window.Window', {
    		title:'Component',
    		layout:_POPUP.layout,
    		closable:_POPUP.closable,
    		closeAction:_POPUP.closeAction,
    		width:_POPUP.width,
    		height:_POPUP.height,
    		modal:_POPUP.modal,
    		resizable:_POPUP.resizable,
    		items:[{
    			xtype:'componentlist',
    			popupSelectionMode:true,
    			toHideFields:[],
    			callbackOnSelect:callback
    		}]
    	});
    	
    	popup.show();	
    },
    onSelectionComponentsChangeList:function(model, selected) {
    	var me = this,
    		list = me.getComponents();
    	
    	me.updateButton(list, selected.length == 0 ? null : selected[0]);
    },    
    init:function() {
    	
    	var me = this;
    	me.control({
    		'productlist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'productlist button[action=search]': {
				click:me.onSearch
    		},
			'productlist button[action=add]': {
				click:me.onAdd
    		},
			'productlist button[action=edit]': {
				click:me.onEdit
    		},
			'productlist button[action=del]': {
				click:me.onDelete // not extended
    		},	
			'productlist button[action=view]': {
				click:me.onView
    		},	
    		'productlist combo[name=active]': {
    			change:me.onChangeActive
    		},    		
    		'productform':{
    			activate:me.onActivateForm
    		},
			'productform button[action=save]': {
				click:me.onSave
    		},	
			'productform button[action=del]': {
				click:me.onDelete
    		},	
			'productform button[action=close]': {
				click:me.onClose
    		},	
			'productform button[action=excel]': {
				click:me.onExcel
    		},
			'productform button[action=reset]': {
				click:me.onReset
    		},
    		'productmain productcomponents button[action=add]': {
    			click:me.onAddComponent
    		},
    		'productmain productcomponents':{
    			selectionchange:me.onSelectionComponentsChangeList
    		}    		
    	});
    }
});
