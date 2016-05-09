Ext.define('KJERP.store.UserGroup', {
	extend:'Ext.data.Store',
	autoLoad:true,
	model:'KJERP.model.UserGroup',
	proxy: {
		type:_AJAX.proxy.type,
 		url: _GLOBAL.URL_SERVICE+'?service=getGroupList',
        enablePaging: false,
		actionMethods : _AJAX.proxy,
        noCache:_AJAX.proxy.noCache,
        useDefaultXhrHeader:_AJAX.proxy.useDefaultXhrHeader,             
        reader:_AJAX.proxy.reader        
	}
}); 