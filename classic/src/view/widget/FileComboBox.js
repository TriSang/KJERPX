Ext.define('KJERP.view.widget.FileComboBox',{
	extend:'Ext.form.field.ComboBox',
	xtype:'filecombo',
	displayField: 'fileName',
  	valueField: 'fileIdx',
  	fieldLabel:'Files (0)',
	queryMode: 'local',
	editable:false,
	name:'file',
	collapseOnSelect:true,
	emptyText:'Select File',
	forceSelection: false,
	requires:[
		'KJERP.model.File'
	],
	config:{
		appIdx:0,
		isTmpAppIdx:false,
		tmpAppIdx:0,
		tmpAppCategory:_DATA.fileTmpCategory,
		appCategory:null,
		fileAppCategorys:null,
		callbackFileLoader:null
	},
	reset:function() {
		var me = this,
			store = me.getStore();
		me.setReadOnly(false);
		me.setTmpAppIdx(0);
		me.clearValue();
		for (var i=store.getCount(); i>0;i--) {
			store.removeAt(i-1);
		}
		me.setFieldLabel('Files');
	},
	setReadOnly:function(readOnly) {
		var me = this;
		me.readOnly = readOnly;
		return false;
	},
	applyAppIdx:function(newValue) {
		var me = this,
			store = me.getStore();
		if (!store) return;
		if (store.getCount()>0) store.loadData([], false);
		
		if (!me.readOnly) {
			store.add(
				Ext.create('KJERP.model.File',{
				fileIdx:0, fileName:'New File'
			}));
		}
		me.setIsTmpAppIdx(newValue?false:true);
		
		if (newValue) {
			me.loadNAppendFiles(newValue);
		}
		return newValue;
	},
	loadNAppendFiles:function(appIdx) {
		var me = this;
			store =me.getStore(),
			callbackFileLoader = me.getCallbackFileLoader(),
			appCategory = me.getIsTmpAppIdx()?me.getTmpAppCategory():me.getAppCategory();
    	var data = {filters:[
    		{"property":'appIdx',"value":appIdx},
    		{"property":'appCategory',"value":appCategory}
		]};
			
    	KJERP.controller.Main.requestService('getFileList', data, function(ret) {
    		var rows = ret.rows;
    		
    		// edit mode...
    		for (var i=0;i<rows.length;i++) {
    			rows[i].editable = me.readOnly?false:true;
    		}
			store.add(rows);
			if (callbackFileLoader) {
				callbackFileLoader(rows)
			}
    	});	
	},
	listConfig: {
            itemTpl: new Ext.XTemplate(
             '<tpl if="fileIdx == 0">',
            	 '<div><span data-qtip="upload new file">New File</span><img src="/resources/images/icon/file_add.png" class="file-combo-add" data-qtip="add file"></img></div>',
            '<tpl else>',
        		'<div>',
            		'<span data-qtip="{fileRemark}">',
		        	'<a href="{[this.getFileUrl(values.fileIdx)]}" style="text-decoration: none;" download="{fileName}">',
	            		'<img src="/resources/images/icon/file_down.png" class="file-combo-down" />',
	            		'{[this.getCategory(values.fileCategory)]}:&nbsp;{fileName}&nbsp; {[this.getFileSize(values.fileSize)]}</span>',
		            '</a>',	
            		 '<tpl if="editable == true">',
            			'<img src="/resources/images/icon/file_drop.png" class="file-combo-drop" data-qtip="delete file"></img>',
            		'</tpl>',
            	'</div>',
            '</tpl>', {
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
					var serviceUrl = _GLOBAL.URL_SERVICE+'?service=fileDownloadByIdx&fileIdx='+fileIdx;
					return serviceUrl;
            	}                	
            }
        ),
        listeners: {
            itemclick: function(list,  record, item, index, event, eOpt) {
                var combo = list.up('combobox');
                
                if (event.getTarget('img.file-combo-drop')) {
                	combo.dropFile(record);
                } else if (record.get('fileIdx') == 0) {
                	combo.addFile();
                } else {
//                	combo.downFile(record); use href link..
                }
            }
        }
    },
	dropFile:function(record) {
		var me= this;
		
	   	var callback = function(result) {
	   		me.clearValue();
	   		me.getStore().remove(record);
	   	}
	   	Ext.MessageBox.confirm(_MESSAGE.alertTitle, _MESSAGE.confirmToDelete, function(btnId) {
			if (btnId == 'yes') {
				KJERP.controller.Main.requestService('fileDelete', record.getData(), callback);
			}
		});	
	},
	downFile:function(record) {
		var me= this;
	   	me.clearValue();

	   	KJERP.controller.Main.requestFile(record.get('fileIdx'));		
	},
	addFile:function() {
		var me = this,
			fileAppCategorys = me.getFileAppCategorys();
		me.clearValue();
		var appIdx = me.getAppIdx();
        var appCategory = me.getAppCategory();
        if (me.getIsTmpAppIdx()) {
        	appCategory = me.getTmpAppCategory();
        	appIdx = me.getTmpAppIdx();
        }
        
		var fileCategoryStore = _FUNCTION.getComboStore(_DATA.fileCategory, {field:'value', filters:fileAppCategorys});
		var popup = Ext.create('KJERP.view.widget.FileUploadWindow', {
			'appIdx':appIdx,
			'appCategory':appCategory,
			'fileCategoryStore':fileCategoryStore,
			callback: function(rows) {
				if (rows && rows.length >0) {
					var row = rows[0];
					row['editable']=true;
					if (me.getIsTmpAppIdx()) {
						me.setTmpAppIdx(row.appIdx)
					}
					me.appendFile(row);
				}
				popup.close();	
		    }	
		});
    	popup.show();	
	},
	appendFile:function(newFile) {
		var me = this,
			store = me.getStore();
			
		me.clearValue();
		store.add(newFile);
	},
	initComponent:function() {
		var me = this;
		me.store =Ext.create('Ext.data.Store', {
			model:'KJERP.model.File',
			proxy:{
				type:'memory'
			},
			listeners:{
				datachanged:function(store) {
					var dummyItem = me.readOnly?0:1;
					me.setFieldLabel('Files ('+(store.getCount()-dummyItem)+')');
				}
			}
		});
		me.callParent(arguments);
		me.reset();
	}
});	