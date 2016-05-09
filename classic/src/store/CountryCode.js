Ext.define('KJERP.store.CountryCode', {
	extend:'Ext.data.Store',
	autoLoad:true,
	fields:['CountryByEng', 'CodeByThree'],
	proxy: {
		type:_AJAX.proxy.type,
 		url: _GLOBAL.URL_SERVICE+'?service=getDictionaryList',
        enablePaging: false,
		actionMethods : _AJAX.proxy,
        noCache:_AJAX.proxy.noCache,
        useDefaultXhrHeader:_AJAX.proxy.useDefaultXhrHeader,             
        reader:_AJAX.proxy.reader,
		extraParams:{
			data:JSON.stringify({
				table:'X_CountryCode',
				column:'CountryByEng,CodeByThree',
				orderby:'CountryByEng'				
			})
		}            
	}
}); 