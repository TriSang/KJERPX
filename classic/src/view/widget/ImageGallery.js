 Ext.define('KJERP.view.widget.ImageGallery', {
 	extend:'Ext.Container',
 	xtype:'imagegallery',
 	layout:'fit',
	frame: true,
	margin:'10 10 10 10',
	config:{
		callbackStoreUpdate:null	
	},
 	items:[{
 		xtype:'dataview',
        collapsible: true,
        scrollable:'vertical',
        emptyText: 'No images available',
        store:{
        	model:'KJERP.model.File',
			proxy:{
				type:'memory'
			}        	
        },
        trackOver: true,
        itemTpl: new Ext.XTemplate(
            '<tpl for=".">',
            	'<div style="width:100%;">',
	        		'<span class="image-gallery-category">[{[this.getCategory(values.fileCategory)]}] &nbsp;</span>',
	            	'<span class="image-gallery-name">{fileName}</span>',
	            	'<span style="float:right;"><a href="{[this.getFileUrl(values.fileIdx)]}" title="click to download">download</a></span>',
	            '</div>',
	            '<div style="margin-bottom:10px;">',
	            	'<img style="max-width:100%;height:auto;" src="{[this.getFileUrl(values.fileIdx)]}" title="{fileRemark}"></img>',
	            '</div>',
            '</tpl>'                
           , {
            	getFileSize:function(size) {
            		var ret = size+'B';
            		if (size > 1024*1024) {
            			ret =Ext.util.Format.round(size/(1024.0*1024), 1)+'MB';
            		} else if (size > 1024) {
            			ret =Ext.util.Format.round(size/1024.0, 1)+'KB';
            		}
            		return ret;
            	},
            	getCategory:function(category) {
            		return _RENDER.fileCategory(category);
            	},
            	getFileUrl:function(fileIdx) {
					var data={filters:[{
				   		property:'fileIdx', value:fileIdx
				   	}]};
		   			var strData = JSON.stringify(data);
		   			strData =  (_AJAX.base64Encode?_Base64.encode(strData):strData);
		   			
					var serviceUrl = _GLOBAL.URL_SERVICE+'?service=fileDownloadByIdx&fileIdx='+fileIdx;
					return serviceUrl;
            	}      
           }
        ),
        multiSelect: true,
        trackOver: true,
        overItemCls: 'x-item-over',
        itemSelector: 'div.thumb-wrap',
        emptyText: 'No images to display',
        listeners: {
            selectionchange: function(dv, nodes ){
            }
        }
 	}],
	initComponent:function() {
		var me = this;
		me.callParent(arguments);
		var store = me.down('dataview').getStore();
		store.on('datachanged', function(store) {
			var callback = me.getCallbackStoreUpdate();
			if (callback) {
				callback(me, store);
			}
		});
	}
});