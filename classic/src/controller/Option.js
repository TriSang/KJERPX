Ext.define('KJERP.controller.Option', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'Ext.data.proxy.JsonP'
    ],
    refs: [{
		ref:'form', selector:'optionform'
   	}, {
   		ref:'work', selector:'job [name=work]' 
   	}],
   	getList:function() {
   		return null;
   	},
   	processSave:function() {
   		_DEBUG.log('prcessSave', arguments);
   		var me = this,
   			form = me.getForm(),
   			value = form.getValues();
   		_OPTION.setConfig(value);	
   	},
   	onReset : function(cmp) {
   		var me = this;
   		me.loadOption(_OPTION.defaultConfig);
   	},
   	loadOption:function(newConfig) {
   		var me = this,
   			form = me.getForm();
   		form.query('field').every(function(field)  {
   			field.setValue(newConfig[field.getName()]);
   			return true;
   		});
   	},
   	onActivateForm:function() {
   		var me = this;
   		me.loadOption(_OPTION.config);
   	},
    init:function() {
    	var me = this;
    	me.control({
    		'optionform':{
    			activate:me.onActivateForm	
    		},
    		'optionform field':{
    			change:me.processSave	
    		},
			'optionform button[action=save]': {
				click:me.onSave
    		},	
			'optionform button[action=close]': {
				click:me.onClose
    		},	
			'optionform button[action=reset]': {
				click:me.onReset
    		}	    		
    	});
    }
});
