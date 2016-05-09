Ext.define('KJERP.controller.BBS', {
	extend: 'KJERP.controller.Default',
    requires:['KJERP.view.bbs.Form',
    	'Ext.data.proxy.JsonP',
    	'KJERP.view.bbs.List'
    ],
    refs: [{
		ref:'main', selector:'bbsmain'
   	},{ 	
		ref:'list', selector:'bbslist'
   	}, {
   		ref:'work', selector:'job [name=work]' 
   	}
   	],
   	getForm:function() {
   		var me = this,
   			main =me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'bbsform');
   	}, 	
   	onActivateList : function() {
   		_DEBUG.log('Controller/default.js onActivateList over override', arguments);		
   		
		var me = this, 
			list = me.getList(),
			grid = list.down('grid');
			
		var store = grid.getStore();
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
   	processAdd:function() {
   		_DEBUG.log('processAdd', arguments);
   		var me = this,
   			list = me.getList(),
   			window = me.getForm();
   		me.newRecord(list, window);
   	},   	
   	processEdit:function(record) {
   		_DEBUG.log('processEdit', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   			
		if (record)
			me.editRecord(record, form);
		else
			me.editRecordAtList(list, form);
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			window = me.getForm();
   		var callback = function(record) {
   			me.updateContent(null);
   			var store = list.getStore();
   			// try select first
   			if (store.getCount()>0) {
   				list.getSelectionModel().select(store.getAt(0));
   			}
   		}   		
   		me.deleteRecord('deleteBBS', list, window, callback);
   	},   	
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			list = me.getList(),
   			window = me.getForm();
   		var callback = function(record) {
   			me.updateContent(record);
   			list.getSelectionModel().select(record);
   		}
   		// update content view after update
   		me.saveRecord('updateBBS', list, window, callback);
   	},
   	processSearch:function(callbackFunc) {   		
   		_DEBUG.log('processSearch', arguments);
   		var me = this,
   			list = me.getList();
   		me.searchRecord('getBBSList', list, null,callbackFunc);
   	},
    checkAuthWrite:function(obj){
    	var store = Ext.getStore('AuthInfo'),
    	record = store.findRecord('CODE',obj),
    	authWrite = record.data.AUTH_WRITE;
    	if(authWrite == 1) return true;
    	else
    	return false;  
    },
	onSelectionChangeList : function(model, selected) {
		_DEBUG.log('Controller/bbs.js onSelectionChangeList', arguments);
		var me = this,
			list = me.getList();
		me.updateButton(list, selected.length == 0 ? null : selected[0]);
		if (selected.length>0) {
			me.updateContent(selected[0]);
		} 
	},    
	updateContent:function(record) {
		var me = this,
			list = me.getList(),
			title = list.down('[name=title]'),
			content = list.down('[name=content]');
		if (record) {
			var titleText = '['+_RENDER.bbsCategory(record.get('bbsCategory'))+']&nbsp;'+record.get('bbsTitle');
			title.update(titleText);
			content.update(record.get('bbsContent'));		
		} else {
			title.update('');
			content.update('');
		}
	},
    init:function() {
    	var me = this;
    	me.control({
    		'bbslist':{
    			activate:me.onActivateList
    		},
    		'bbslist grid':{
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'bbslist button[action=search]': {
				click:me.onSearch
    		},
			'bbslist button[action=add]': {
				click:me.onAdd
    		},
			'bbslist button[action=edit]': {
				click:me.onEdit
    		},
			'bbslist button[action=del]': {
				click:me.onDelete
    		},	
			'bbslist button[action=view]': {
				click:me.onView
    		},	
    		'bbsform':{
    			activate:me.onActivateForm
    		},
			'bbsform button[action=save]': {
				click:me.onSave
    		},	
			'bbsform button[action=del]': {
				click:me.onDelete
    		},	
			'bbsform button[action=close]': {
				click:me.onClose
    		},	
			'bbsform button[action=reset]': {
				click:me.onReset
    		}	    		
    	});
    }
});
