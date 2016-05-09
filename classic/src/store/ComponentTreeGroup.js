Ext.define('KJERP.store.ComponentTreeGroup', {
	extend:'Ext.data.TreeStore',
	autoLoad:true,
	fields:['groupIdx', 'groupParentIdx', 'groupName'],
	proxy: {
		type:_AJAX.proxy.type,
 		url: _GLOBAL.URL_SERVICE+'?service=getDictionaryList',
        enablePaging: false,
		actionMethods : _AJAX.proxy,
        noCache:_AJAX.proxy.noCache,
        useDefaultXhrHeader:_AJAX.proxy.useDefaultXhrHeader,             
        reader:_AJAX.proxy.reader,
        root: {
            name: 'rows',
            expanded: true
    	},
		extraParams:{
			data:_Base64.encodeJson({
				table:'X_TreeGroupSet',
				column:'groupIdx, groupParentIdx, groupName',
				where:'groupParentIdx=0',
				orderby:'groupParentIdx ASC, groupName ASC'				
			})
		}
	},
	listeners:{
        beforeload: function(store, operation, eOpts) {
			var node = operation.node,
				proxy = store.getProxy();
				
           	if (node === store.getRootNode()) return;
           	proxy.setExtraParams({
           		data:_Base64.encodeJson({
					table:'X_TreeGroupSet',
					column:'groupIdx, groupParentIdx, groupName, \'true\' as leaf',
					actionMethods:{create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'},
					where:('groupParentIdx='+node.get('groupIdx')),
					orderby:'groupName ASC'				
				})
           	});
        }
	}
}); 