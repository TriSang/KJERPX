Ext.define('KJERP.controller.Auth', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
		ref:'main', selector:'authmain'
   	},{
		ref:'list', selector:'authlist'
   	}, {
   		ref:'roles', selector:'authroles'
   	}, {
   		ref:'work', selector:'job [name=work]'    		
   	}
   	],
   	getForm:function() {
   		var me = this,
   			main =me.getMain();
   		return _FUNCTION.getFormFromMain(main, 'authform');
   	}, 	
   	onActivateList : function() {
		_DEBUG.log('Controller/default.js onActivateList', arguments);		
		var me = this, 
			list = me.getList();
		
		me.updateButton(list, null);
	
		/*
		var store = list.getStore();
		
		proxy = store.getProxy();
		URL = proxy.getUrl().split('=');
		serviceName = URL[1];

		store.load(
				me.checkSession(serviceName)
        );
        */
		//me.checkSession();
		return false;		

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
   			roles = me.getRoles(),
   			store = roles.getStore();
		
		_FUNCTION.resetStoreAtForm(form);
   		me.newRecord(list, form);
   		
   		KJERP.controller.Main.requestService('getAuthRoleList', null, function(ret) {
    		var rows = ret.rows;    		
    		store.loadData(rows);
    				
    	});	 		
   	},   	
   	processEdit:function() {
   		_DEBUG.log('processEdit', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   			
		_FUNCTION.resetStoreAtForm(form);   			
   		me.editRecordAtList(list, form);
		me.loadNAppendAuthRole();
   	},   	
   	processDelete:function() {
   		_DEBUG.log('processDelete', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm();
   		me.deleteRecord('deleteAuth', list, form);

   	},   
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			list = me.getList(),
   			form = me.getForm(),
   			roles = me.getRoles(),
   			store = roles.getStore(),   			
   			record = form.getRecord(),   			
   			authIdx = 0;
   			
   		if (record) {    		
    		authIdx =  record.get('authIdx');
   		}
   		
		var roles = [];
		store.each(function(record) {
			roles.push({				
		        code:record.get('code'),		        
		        name:record.get('name'),		        
		        read:record.get('read'),
		        write:record.get('write'),
		        exec:record.get('exec')
			});
		});
						
		form.down('hiddenfield[name=roles]').setValue( JSON.stringify(roles));
   		me.saveRecord('updateAuth', list, form);
   	},
   	processSearch:function() {   		
   		_DEBUG.log('authSearch', arguments);
   		var me = this,   		
   			list = me.getList();
   		me.searchRecord('getAuthList', list);
   	},
    checkAuthWrite:function(obj){
    	var store = Ext.getStore('AuthInfo'),
    	record = store.findRecord('CODE',obj),
    	authWrite = record.data.write;
    	if(authWrite == 1) return true;
    	else
    	return false;  
    },
    onActivateList:function() {
    	//override to not load autmatically
    },
    
    
    loadNAppendAuthRole:function() {
    	var me = this,
			form = me.getForm(),
    		record = form.getRecord(),    		
    		authIdx = record.get('authIdx'),
    		grid = me.getRoles(),
    		store = grid.getStore();
			
    	var data = {filters:[    		
    		{"property":'authIdx',"value":authIdx}
    	]};
    	KJERP.controller.Main.requestService('getAuthPolicyList', data, function(ret) {
    		var rows = ret.rows;    		
    		store.loadData(rows);
    				
    	});	
    	
    },
    
    
    onAddRoles:function(button) {
    	var rec = new KJERP.model.AuthRole({
            authRoleIdx: 0,
            code:'',
            name:'',
            read:0,
            write:0,
            exec:0,
            state:0,
            remakr:''	            	            
        });

    	var me = this,   		
			roles = me.getRoles();
    	roles.getStore().insert(0, rec);
    	roles.cellEditing.startEditByPosition({
            row: 0,
            column: 1
        });
    },
    onSelectionRolesChangeList:function(model, selected) {
    	var me = this,
    		roles = me.getRoles();
    	//클릭된 부분 edit 모드
    	//me.updateButton(list, selected.length == 0 ? null : selected[0]);
    },
    init:function() {
    	
    	var me = this;
    	me.control({
    		'authlist':{
    			activate:me.onActivateList,
    			itemdblclick:me.onItemDblClick,
				selectionchange:me.onSelectionChangeList    			
    		},
			'authlist button[action=search]': {
				click:me.onSearch
    		},
			'authlist button[action=add]': {
				click:me.onAdd
    		},
			'authlist button[action=edit]': {
				click:me.onEdit
    		},
			'authlist button[action=del]': {
				click:me.onDelete
    		},	
			'authlist button[action=view]': {
				click:me.onView
    		},	
    		'authlist combo[name=active]': {
    			change:me.onChangeActive
    		},    		
    		'authform':{
    			activate:me.onActivateForm
    		},
			'authform>formheader>button[action=save]': {
				click:me.onSave
    		},	
			'authform>formheader>button[action=del]': {
				click:me.onDelete
    		},	
			'authform>formheader>button[action=close]': {
				click:me.onClose
    		},	
			'authform>formheader>button[action=excel]': {
				click:me.onExcel
    		},
			'authform>formheader>button[action=reset]': {
				click:me.onReset
    		},
    		'authroles button[action=add]': {
    			click:me.onAddRoles
    		},
    		 		
    		'authroles':{
    			selectionchange:me.onSelectionRolesChangeList
    		}
    	});
    }
});
