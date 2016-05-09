Ext.define('KJERP.controller.Default', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.exporter.Exporter', 
		'Ext.window.Toast',
		'KJERP.view.widget.PDFViewer'
	],
	refs : [{
		
   	}],
   	config:{
   		isVesselContext:null	
   	},
   	checkSession:function(serviceName){   		   		
		var callback = function(result) {
    		if (KJERP.controller.Main.isInValidResult(result)) return;    		    		
    		
    		if(result.operation==false){
    			_SESSION_ID = '';
    			
    			//me.logout();
    			Ext.ComponentQuery.query('app-main')[0].layout.setActiveItem(0);					
    		}
		};
   		
		var filters = [];		
		filters.push({property:'sessionID', value:_SESSION_ID});
		filters.push({property : "userID",value : _USER.info.email});
		filters.push({property : "serviceName",value : serviceName});
		
		//KJERP.controller.Main.requestService('checkSession', {'filters':filters}, callback);
		return false;		
	},
	onExcel : function(cmp) {
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
			
		var grid = cmp.up('gridpanel');
		var workbook = "\ufeff"
				+ Ext.ux.exporter.Exporter.exportAny(grid, 'csv', null);
		var blob = new Blob([workbook], {
					type : "text/plain;charset=utf-8"
				});
		saveAs(blob, "report.csv");
	},
	onReset : function(cmp) {
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		
		var  form = me.getForm();
		Ext.Array.each(form.query('field'), function(field) {
					if (field.isVisible()) { // 숨겨진 필드에는 미리 정의된 값이 있으므로...
						field.reset();
					}
				});
		var grid = form.down('grid,treepanel');
		if (grid) {
			grid.getStore().removeAll();
		}
	},
	onActivateList : function(cmp) {
		_DEBUG.log('Controller/default.js onActivateList', arguments);		
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		
		var list = me.getList();		
		
		me.updateButton(list, null);
		
		var store = list.getStore();		

		proxy = store.getProxy();
		URL = proxy.getUrl().split('=');
		serviceName = URL[1];
		me.checkSession(serviceName);
		return false;		
	},
	onActivateForm : function(cmp) {
		_DEBUG.log('Controller/default.js onActivateForm', arguments);
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		
		var form = me.getForm();
		form.setModified(false);
		me.updateButton(form, form.getRecord());
							
		//me.checkSession(me.moduleClassName +' formActivate');
		
		return false;
	},
	onSelectionChangeList : function(model, selected) {
		_DEBUG.log('Controller/default.js onSelectionChangeList', arguments);
		var me = this, list = me.getList();
		me.updateButton(list.view.grid, selected.length == 0 ? null : selected[0]);
	},
	getRights : function(container, record) {	
		
		_DEBUG.log('Controller/default.js getRights', arguments);
		var me = this;
		var authStore = Ext.getStore('AuthInfo'), 
				authCode = container.getAuthCode(), 
				authInfo = null, right = {
			edit : false,
			del : false,
			reset : false,
			add : false,
			save : false,
			excel : false,
			view : false,
			print : false,
			copy : false,
			transfer : false
		};
		
		// view 의 autoCode 가져옴
		if (authCode) {
			authInfo = authStore.findRecord('code', authCode);
		}
		if (!authCode || !authInfo) { //코드가  없는 경우 기본 권한 리턴 
			return right;
		}
		/*
		if (record) {// 폼이 선택 되었을 때, 리스트에서 raw가 선택 될 때.
			
			if (authInfo) {
				if (authInfo.get('write')==1) { //true 인 버튼만 보인다.
					right.add = true;					
					right.edit = true;
					right.del = true;
					right.save = true;
					right.reset = true;
				}else{
					me.readMode(container);	
				}
				if (authInfo.get('read')==1) {
					right.view = true;
					//right.excel = true;
				}
				if (authInfo.get('exec')==1) {
					right.print = true;
				}
			}
		} else {//리스트 일			
			if (authInfo.get('AUTH_WRITE')==1) {
				right.save = true;
				right.reset = true;
				right.add = true;														
			}
			if (authInfo.get('AUTH_READ')==1) {
				right.excel = true;
			}
			if (authInfo.get('AUTH_EXEC')==1) {
				right.print = true;
			}
		}
		*/
		if (authInfo.get('write')==1) { //true 인 버튼만 보인다.
			right.add = true;					
			right.edit = true;
			right.del = true;
			right.save = true;
			right.reset = true;
			right.copy = true;
			right.transfer = true;
			right.toEquipment = true;
		}else{
			me.readMode(container);	
		}
		if (authInfo.get('read')==1) {
			right.view = true;
			//right.excel = true;
		}
		if (authInfo.get('exec')==1) {
			right.print = true;
		}
		return right;
	},
	updateButton : function(container, record) {	
		
		var me = this,
			auths = ['reset', 'del', 'view','edit', 'add','excel', 'save','transfer',
			        'copy', 'publish', 'appProgram', 'printCert', 'certHistory', 'stdCert', 'deleteSite', 'contract', 
			        'eduAccept', 'eduUpload', 'eduResultView','toEquipment'
			        ];
		rights = me.getRights(container, record);		
		
		for (var i=0;i<auths.length;i++) {
			if (container.down('button[action='+auths[i]+']') != null) {
				container.down('button[action='+auths[i]+']').setDisabled(!rights[auths[i]]);
			}
		}
	},
	readMode : function(form) {		
		
		var chform = form.getId().indexOf('form')
		if(chform < 0) return;
		
		form.query('textfield').every(function (cmp) { cmp.setEditable(false); return true; });
		form.query('button').every(function (cmp) { cmp.setDisabled(true); return true; });
		form.query('button[action=close]').every(function (cmp) { cmp.setDisabled(false); return true; });
		form.query('combo').every(function (cmp) { cmp.setDisabled(true); return true; });
		form.query('radiofield').every(function (cmp) { cmp.setDisabled(true); return true; });
		//datefield 추가.
		form.query('datefield').every(function (cmp) { cmp.setDisabled(true); return true; })
		
		// shall apply extextfield's auth in last, it has own button and textfield
		form.query('extextfield').every(function (cmp) { 
			cmp.setEditable(false); 
			return true; 
		});
	},
	onSearch : function(cmp) {
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		me.processSearch();			
	},
	onItemDblClick : function(cmp, record, item, index) {
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		var grid = cmp.up('grid, treepanel');
		if (grid.getPopupSelectionMode && grid.getPopupSelectionMode()) {	// if selection mode, select
			var button = grid.down('button[action=select]');
			button.fireEventArgs('click',[button]);
		} else {
			me.processEdit();
		}
	},
	printCert : function(service, list, form) {		
		
		var me = this, 
			store = list.getStore(), 
			model = store.model, 
			//form = window.down('form'), 
			selections = list.getSelectionModel().getSelection();
		me.checkSession(me.moduleClassName+' printCert');
		//증서 발급에 필요한 데이터 생성  selections.getData() 값을 확인 한다.	
		selectedData =[];
				
		
		Ext.Array.each(selections, function(record) {			
			selectedData.push(record.getData());
		});
				
		var callback = function(result) {
			if (KJERP.controller.Main.isInValidResult(result))
				return;								
			
			var ret = result.d.split('/');
			var fileName = ret[ret.length-1]			
			var url = _GLOBAL.CERT_URL+fileName;
			window.open(url,'Cerification','width=300','height=400');
			
			Ext.Array.each(selections, function(record) {			
				record.set('PRINT','1');
			});
			
//			Ext.widget('pdfviewer',{
//				items : [{
//					xtype:'panel',
//					header:null,
//					items: { 
//			            xtype: 'box', 
//			            autoEl: { 
//			                tag: 'iframe', 
//			                style: 'height: 100%; width: 100%' ,
//			                src: url
//			            } 
//			        } 
//				}],			
//				callbackStart:function() {				
//					var me = this;						
//					me.down('panel');									
//				}
//			
//			}).show();				

		};
		KJERP.controller.Main.requestService(service, selectedData, callback);				
	
	},
	test:function(){
		Ext.Msg.alert('Msg','aaaa');
	},
	searchRecord : function(service, list, form, callbackFunc) {
		var me = this,
			store = list.getStore(), 
			proxy = store.getProxy(), 
			filters = [],
			toolbar = list.query('toolbar');
		
		if (service) { // service가 지정되어 있으면
			proxy.setUrl(_GLOBAL.URL_SERVICE+'?service='+service);
		}
		
		me.checkSession(service);
		
		//json.stringify date 형식이 바뀜. 
		
		toolbar.forEach( 
			function(element, index, array){							
					if(element == null) return true;		
					var fields = element.query('field');
					
					Ext.Array.each(fields, function(field) {
						var value = field.getValue();
						if (!value && (value === '' || value === null))	// if combo...
							return true;						
						var name = field.getName();
						if(name=="fromDate"||name=="toDate"){
							filters.push({
										property :name,
										value : _FUNCTION.getTimeStamp(value)
							});
						}else{
							filters.push({
										property : name,
										value : value
							});
						}
				});
		});				
		
		var strData = _Base64.encodeJson({
			'filters':filters,
			'session': 
			{
				sessionID:_SESSION_ID,
				userID:_USER.info.email
			}
		});
		
		proxy.setExtraParam('data', strData);
		
		_DEBUG.log('Controller/default.js searchRecord', filters);
		
		store.load({                               
	            callback: function (records, operation, success) {
	            	if (store.hasOwnProperty('root')) {
	            		store.getRoot().expand();
	            	}
	            	
	               	if(operation._response.operation==false){
	               		Ext.Msg.alert(_MESSAGE.alertTitle,operation._response.message);
	               		_SESSION_ID = '';    			
	    				Ext.ComponentQuery.query('app-main')[0].layout.setActiveItem(0);
	               	}    
	               	
	               	if (callbackFunc) callbackFunc(records);
	            },
	            failure: function () {                         	
	            	_DEBUG.log('Controller/default.js searchRecord', 'falield');
            		if (callbackFunc) callbackFunc(null);
	            }
	        });
	},
	
	onAdd : function(cmp) {
		_DEBUG.log('Controller/default.js onAdd', arguments);
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
			
		me.processAdd();
	},
	newRecord : function(list, form) {
		_DEBUG.log('Controller/default.js newRecord', arguments);
		var me = this, store = list.getStore(), model = store.model, work = me.getWork();
		me.checkSession(me.moduleClassName +' newRecord');
		form.up('container').setActiveItem(form);
	},
	onEdit : function(cmp) {
		_DEBUG.log('Controller/default.js onEdit', arguments);
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		me.processEdit();
	},
	onCopy : function(cmp) {
		_DEBUG.log('Controller/default.js onCopy', arguments);
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		me.processCopy();
	},
	onTransfer : function(cmp) {
		_DEBUG.log('Controller/default.js onCopy', arguments);
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		me.processTransfer();
	},
	toEquipment : function(cmp) {
		_DEBUG.log('Controller/default.js onCopy', arguments);
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		me.processAddToEquipment();
	},
	editRecordAtList : function(list, form, callback) {
		_DEBUG.log('Controller/default.js editRecordAtList', arguments);

		var me = this, 
			store = list.getStore(), 
			model = store.model, 
			work = me.getWork()
			selections = list.getSelectionModel().getSelection();
		
		me.checkSession(me.moduleClassName +' editRecordAtList');
		
		if (selections.length == 0)
			return;

		// if childnode bring show parent node	
		var selected = selections[0];
		if (selected.get('leaf')) {
			selected = selected.parentNode;
		}
		
		if (selected) {
			form.loadRecord(selected);
			form.up('container').setActiveItem(form);
		}
		
		if (callback) {
			callback();
		}
	},
	editRecord : function(record, form, callback) {
		_DEBUG.log('Controller/default.js editRecordAtList', arguments);

		var me = this, 
			work = me.getWork();
		
		me.checkSession(me.moduleClassName +' editRecordAtList');
		
		if (!record) return;

		form.loadRecord(record);
		
		var parentContainer = form.up('container');
		if (parentContainer && parentContainer.getLayout().type==='card') {
			parentContainer.setActiveItem(form);
		}
		
		if (callback) {
			callback();
		}
	},
	onDelete : function(button) {
		_DEBUG.log('Controller/default.js onDelete', arguments);
		
    	// form의 하위 그리드이면 그리드에서 삭제함
    	var me = this,
    		grid = button.up('grid,treepanel'),
    		callback = null,
    		indexOfSubGridInForms = -1;
    		
    	var subGridInForms = [
    		'productcomponents', 'companycontacts', 'vesselequipments'
    	];

    	if (grid) {
    		indexOfSubGridInForms = subGridInForms.indexOf(grid.getXType());
    	}
    		
    	if (indexOfSubGridInForms != -1) {
    		// when tree, using remove 
    		if (grid.getXTypes().indexOf('treepanel') > 0) {
    			callback = function() {
	    			var selections = grid.getSelection();
	    			for (var i=0;i<selections.length;i++) {
	    				selections[i].remove();
	    			}
    			}
    		} else {
		    	callback = function() {
		    		var selections = grid.getSelection();
		    		var store = grid.getStore();
		    		store.remove(selections);
		    	};
    		}
    		
    	} else {
	    	callback = function() {
	    		me.processDelete();
	    	};	
    	}
    	
		Ext.MessageBox.confirm(_MESSAGE.alertTitle, _MESSAGE.confirmToDelete, function(btnId) {
				if (btnId == 'yes') {
					callback();
				}
		});		

	},
	deleteRecord : function(service, list, form, callback) {
		_DEBUG.log('Controller/default.js deleteRecord', arguments);
		var me = this, 
			store = list.getStore(), 
			model = store.model, 
			selections = list.getSelectionModel().getSelection();
				
		me.checkSession(service);	
		
		if (selections.length == 0)
			return;
		var selected = selections[0];
		var callback2 = function(result) {
			if (KJERP.controller.Main.isInValidResult(result))
				return;
			
			store.remove(selected);
			
			if (typeof(form) != 'undefined' && form != null)
				me.closeForm();
			if (callback) {
				callback(selected);
			}
		};
		KJERP.controller.Main.requestService(service, selected.getData(),callback2);
	},
	onView : function(cmp) {
		_DEBUG.log('Controller/default.js onView', arguments);
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false),
		me.processEdit();
	},
	onSave : function(cmp) {
		_DEBUG.log('Controller/default.js', arguments);
		var me = this,
			list = me.getList(),
			form = me.getForm();
			
		me.setIsVesselContext(cmp.up('vesselmain')?true:false);
		
		if (list) {
			store = list.getStore();
			model = store.model, 
			values = _FUNCTION.getFormContainerValues(form), 
			newRecord = model.create(values);
			
			var errors = newRecord.validate();
			
			if (!errors.isValid()) {
				var errorMessage = '';
				Ext.Array.each(errors.items, function(item) {
					_DEBUG.log('Error!! ' + item.field + ':'
									+ item.message);
					if (!errorMessage) {
						var fistErrorLabel = me.getFieldLabel(form,
								errors.items[0].field)
						errorMessage = fistErrorLabel + ':' + item.message;
					}
				});
				Ext.toast(errorMessage, _MESSAGE.alertTitle, 't')
				form.getForm().markInvalid(errors);
				return;
			}
		}

		me.processSave();
	},
	saveRecord : function(service, list, form, callback) {
		_DEBUG.log('Controller/default.js : saveRecord', arguments);
		var me = this, 
			store = list.getStore(), 
			model = store.model, 
			data = _FUNCTION.getFormContainerValues(form);
	    
		// JSON field value process
		form.query('field[type=json]').every(function(field) {
			data[field.getName()] = JSON.parse(field.getValue());
		});
			
		me.checkSession(me.moduleClassName +' saveRecord');
		var callbackUpdateGrid = function(isNew,selectedRecord) {
			if (isNew == true) {
				store.add(selectedRecord);
			} else {
				// remove old and insert new one
				var toRemoveRecord = form.getRecord();
				var toRemoveIndex = store.indexOf(toRemoveRecord) ;
				store.remove(toRemoveRecord);
				store.insert(toRemoveIndex, selectedRecord);
			}
			selectedRecord.commit();
			
			if (_OPTION.config.closeFormAfterSave == true) {
				me.closeForm();
			}
			
			// goto row
			list.getSelectionModel().deselectAll();
			list.getSelectionModel().select([selectedRecord]);
			list.getView().focusRow(selectedRecord);			
		};
		var callbackUpdateTree = function(isNew,selectedRecord) {
			var root = store.getRoot();
			if (isNew == true) {
				root.insertChild(0, selectedRecord);				
			} else {
				// remove old and insert new one
				var toRemoveRecord = form.getRecord();
				var toRemoveIndex = root.indexOf(toRemoveRecord) ;
				root.removeChild(toRemoveRecord);
				root.insertChild(toRemoveIndex, selectedRecord);				
			}
			selectedRecord.commit();	//need to update
			
			if (_OPTION.config.closeFormAfterSave == true) {
				me.closeForm();
			}
			
			// goto row
			list.getSelectionModel().deselectAll();
			list.getSelectionModel().select([selectedRecord]);
			list.getView().focusRow(selectedRecord);			
		};		
		
		var callback2 = function(result) {
			if (KJERP.controller.Main.isInValidResult(result))
				return;
			var savedRecord = model.create(result.rows[0]);
			//form.loadRecord(savedRecord);
			if (list.getXTypes().indexOf('treepanel')<0) {
				callbackUpdateGrid(result.isNew, savedRecord);
			} else {
				callbackUpdateTree(result.isNew, savedRecord);
			}
		
			if (callback) {
				callback(selectedRecord);
			}
		};
		KJERP.controller.Main.requestService(service, data, callback2);
	},
	onSetTitle:function() {		
    	var me = this,
    		form = me.getForm();    		   	
    	_FUNCTION.setTitle(form);
    },
	onClose : function(cmp) {
		_DEBUG.log('Controller/default.js onClose', arguments);
		var me = this;
		me.setIsVesselContext(cmp.up('vesselmain')?true:false),
		me.closeForm();
	},
	closeForm : function() {
		_DEBUG.log('Controller/default.js closeForm', arguments);
		var me = this, 
			list = me.getList(), 
			form = me.getForm(),
			closeCallback = form.getCloseCallback();
		
		var callback = function() {
			if (closeCallback) {
				closeCallback();
			} else {
				var parentContainer = form.up('container');
				if (parentContainer) {
					if (parentContainer.getLayout().type==='card') {
						parentContainer.setActiveItem(list);
						parentContainer.remove(form, true);
					} else {
						if (parentContainer.getXType()==='window') {
							parentContainer.close();
						}
					}
				}
			}
		}
		if (form.getModified()) {
			Ext.MessageBox.confirm(_MESSAGE.alertTitle, _MESSAGE.confirmToCloseWihoutSave, function(btnId) {
				if (btnId == 'yes') {
						callback();
				}
			});
		} else {
			callback();
		}
	},	
	getFieldLabel : function(form, name) {
		var label = '';
		if (form) {
			var field = form.down('[name=' + name + ']');
			if (field) {
				if (field.isHidden())
					label = name;
				else
					label = field.getFieldLabel();
			}
		}
		return label;
	},
	onRefreshProducts:function(button) {
		var dataView = button.up('panel').down('dataview');
		if (dataView) {
			dataView.refresh();
		}
	},
	onAddVesselProduct:function(button) {
    	var me = this,
    		grid = button.up('grid,treepanel'),
    		form = me.getForm(),
    		record = form.getRecord(),
    		store = grid.getStore();
    
    	//if check vessel productlist and remove it	
    	if (Ext.ComponentQuery.query('[name=productlist]').length>0) {
    		var productList = Ext.ComponentQuery.query('[name=productlist]')[0];
    		if (_OPTION.config.selectComponentFromWindow) {
    			productList.close();
    		} else {
    			button.up('panel').removeDocked(productList);
    		}
    	}
    	
    	if (Ext.ComponentQuery.query('[name=equipmentlist]').length>0) {
    		var productList = Ext.ComponentQuery.query('[name=equipmentlist]')[0];
    		if (_OPTION.config.selectComponentFromWindow) {
    			productList.close();
    		} else {
    			button.up('panel').removeDocked(productList);
    		}
    		return; 	// if already exist
    	}
    	
    	
    	var vesselIdx = form.down('vesselfield [name=vesselIdx]').value;
    	    	
    	if(vesselIdx==null||vesselIdx==0||vesselIdx==''){
    		Ext.Msg.alert(_MESSAGE.alertTitle, 'At first Select Vessel.');
    		return;
    	}
    	
    	var callback = function(selecteds) {    		
    		var funcNewRecord = function(selected) {
    			
				return Ext.create('KJERP.model.Product', 
				{
					quotationIdx:0,
					vesselIdx:0,
					componentIdx:selected.get('componentIdx'),
					name:selected.get('name'),
					model:selected.get('model'),
					type:selected.get('type'),
					tag:selected.get('tag'),
					leaf:selected.get('leaf'),
					iconCls:selected.get('iconCls'),
					qty:1,
					unitPrice:(selected.get('listPrice')==0)?0:selected.get('listPrice'),
					price:(selected.get('listPrice')==0)?0:selected.get('listPrice'),					
					tax:0,
					total:(selected.get('listPrice')==0)?0:selected.get('listPrice'),
					remark:''
				});    			
    		}
    		
    		if (_FUNCTION.appendTreePanel(store.getRootNode(), selecteds,funcNewRecord).length>0) {
    			
    			Ext.Msg.alert(_MESSAGE.alertTitle, 'Selected items are registerd.');
    		}
    	}
    	if (_OPTION.config.selectComponentFromWindow) {
	    	var productList = Ext.create('Ext.window.Window', {
	    		title:'Equipment',
	    		layout:_POPUP.layout,
	    		closable:_POPUP.closable,
	    		closeAction:_POPUP.closeAction,
	    		width:_POPUP.width,
	    		height:_POPUP.height,
	    		modal:_POPUP.modal,
	    		resizable:_POPUP.resizable,
	    		name:'equipmentlist',
	    		items:[{
	    			xtype:'vesselproductlist',
	    			popupSelectionMode:true,
	    			toHideFields:[],
	    			callbackOnSelect:callback,
	    			vesselIdx: vesselIdx
	    		}]
	    	});
	    	productList.show();
    	} else {
    		var productList = Ext.create('Ext.Panel', {
	    		title:'Equipment',
	    		name:'equipmentlist',
	    		layout:_POPUP.layout,
	    		closable:_POPUP.closable,
	    		closeAction:_POPUP.closeAction,
	    		height:_POPUP.height,
	    		dock:'bottom',
	    		items:[{
	    			xtype:'vesselproductlist',
	    			popupSelectionMode:true,
	    			toHideFields:[],
	    			callbackOnSelect:callback,
	    			vesselIdx: vesselIdx
	    		}]
	    	});
	    	button.up('panel').addDocked(productList);    	
    	}
    },
	init : function() {
		var me = this;
	}
});
