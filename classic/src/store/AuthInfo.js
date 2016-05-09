Ext.define('KJERP.store.AuthInfo', {
	extend:'Ext.data.Store',
	model:'KJERP.model.AuthPolicy',	
	autoLoad:false,
	proxy: {
		type: 'memory'
	}
}); 