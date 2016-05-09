Ext.define('KJERP.store.Auth', {
	extend:'Ext.data.Store',
	autoLoad:true,
	fields:['name', 'authIdx'],
	proxy: {
		type:_AJAX.proxy.type,
 		url: _GLOBAL.URL_SERVICE+'?service=getAuthList',
        enablePaging: false,
		actionMethods : _AJAX.proxy,
        noCache:_AJAX.proxy.noCache,
        useDefaultXhrHeader:_AJAX.proxy.useDefaultXhrHeader,             
        reader:_AJAX.proxy.reader          
	}
}); 