{
	// 실행시간측정
	var _TEST = {
		isOn:false,
		specs:[],
		start:function() {
    		var specs = _TEST.specs, index = 0;

    		var callback = function() {
    			Ext.Loader.loadScript( {
	    			url:specs[index++],
	    			onLoad:function() {
	    				if (index<specs.length) {
	    					callback();
	    				} else {
	    					var jasmineEnv = jasmine.getEnv ();
	    					jasmineEnv.execute();
	    				}
	    			},
	    			onError:function() {
	    				console.log('Error, Not found spec:'+specs[index--])
;	    			}
    			});
    		};
    		callback(index);
		},
		startTime : 0,
		startTimer : function() {
			this.startTime = new Date().getTime();
		},
		endTimer : function() {
			var diff = new Date().getTime() - this.startTime;
			_DEBUG.log("TEST >> TIME: " + diff / 1000);
		}
	};
	var _OPTION = {
		config:{
		},
		defaultConfig:{
			showMessageFromService:true,
			selectComponentFromWindow:true,
			removeCompoentAfterAddComponent:false,
			showMessageAfterAddComponent:true,
			closeFormAfterSave:true				// 폼 저장 후 닫기 여부
		},
		load:function() {
			var config = localStorage.getItem('config');
			if (config) {
				config = JSON.parse(config);
				for (property in _OPTION.defaultConfig) {
					if (!config.hasOwnProperty(property)) {
						config[property] = _OPTION.defaultConfig[property];
					}
		        }
			} else {
				config = JSON.parse(JSON.stringify(_OPTION.defaultConfig));
			}
			_OPTION.config = config;
		},
		setConfig:function(newConfig) {
			_OPTION.config = newConfig;
			_OPTION.save();
		},
		save:function() {
			 localStorage.setItem('config', JSON.stringify(_OPTION.config));
		}
	};
		
	_OPTION.load(); //load stored option
	
	var _GLOBAL = {
		URL_SERVICE : 'http://localhost:4389/webService.aspx', // 서비스 파일 위치
		FILE_SERVICE : 'http://localhost:4389/fileService.aspx', // 서비스 파일 위치
		JSONP_REQUEST : false, // true JSONP, false AJAX
		CK_UPLOAD : 'http://localhost:4389/ckFileService.aspx', // CKEDIT Upload
																// path
		CERT_URL : 'http://edutechhhu.cafe24.com/EDUCENTER/test/server/files/',
		VERSION : 'ver. 20160422-03' // 버전 정보
	};

	var _FORM = {
		labelWidth : 110, // 폼 필드의 Label Width
		fieldWidth :380, // 폼 필드의 Width
		fieldXWidth : (380 * 2) + 10, // 폼 필드의 Width
		fieldMargin : '5 10 0 0',
		padding : '10 10 0 10',
		innerPadding : '0 10 0 10',
		align : 'stretch', // middle
		screenHeight : screen.height * 0.9	
	};

	
	var _AJAX = {
		ajax_timeout : 10000, // JSONP, AJAX 서비스 요청 후 대기 시간 ms, 설정시간이 지나면 time
								// out error
		base64Encode : false,
		proxy : {
			type : 'ajax',
			url : null,
			enablePaging : false,
			actionMethods : {
				create : 'POST',
				read : 'POST',
				update : 'POST',
				destroy : 'POST'
			},
			noCache : true,
			useDefaultXhrHeader : false,
			reader : {
				rootProperty : 'rows',
				totalProperty : 'totalCount'
			}
		},
		reader : {
			method : 'POST',
			disableCaching : true,
			useDefaultXhrHeader : false,
			rootProperty : 'rows',
			totalProperty : 'totalCount'
		}
	};
	var _DASHBOARD = {
		panel : {
			width : 400,
			height : 165
		}
	};

	var _MESSAGE = {
		alertTitle : 'Message',
		confirmToDelete : 'Confirm to delete?',
		confirmToCloseWihoutSave : 'Some values are changed. Confirm to close without saving?'
	};

	var _GLYPH = {
		toolbar : {
			add : 'xf067@FontAwesome',
			edit : 'xf044@FontAwesome',
			view : 'xf06e@FontAwesome',
			del : 'xf1f8@FontAwesome',
			close : 'xf00d@FontAwesome',
			reset : 'xf12d@FontAwesome',
			save : 'xf0c7@FontAwesome',
			search : 'xf002@FontAwesome',
			excel : 'xf019@FontAwesome',
			copy : 'xf0c5@FontAwesome',
			transfer : 'xf14d@FontAwesome',
			find : 'xf217@FontAwesome',
			refresh : 'xf021@FontAwesome'
		}
	};
	var _ICON = {
		toolbar : {
			add : 'resources/images/icon/add.png',
			edit : 'resources/images/icon/edit.png',
			view : 'resources/images/icon/view.png',
			del : 'resources/images/icon/delete.png',
			close : 'resources/images/icon/close.png',
			reset : 'resources/images/icon/reset.png',
			save : 'resources/images/icon/save.png'
		}
	};

	var _POPUP = {
		layout : 'fit',
		width : _FORM.fieldXWidth + 50,
		height : 600,
		closable : true,
		closeAction : 'destroy',
		modal : false,		
		resizable : true		
	};
	var _LIST = {
		queryFieldWidth : 120
	};

	var _FUNCTION = {
		removeSelectedNode:function(selecteds) {
			for (var i=0; i<selecteds.length; i++) {
				selecteds[i].remove(false);
			}
		},
		updateSelectedField:function(destStore,srcStore, destNode,  srcNode) {	// dest application, src product 
			if (!destNode) destNode = destStore.getRootNode();
			if (!srcNode) srcNode = srcStore.getRootNode();
			
			for (var i=0;i<srcNode.childNodes.length;i++) {
				var node = srcNode.childNodes[i];
				if (destNode.findChild('componentIdx', node.get('componentIdx'))) {
					node.set('selected', true);
				}
				//if it has child
				for (var j=0; j<node.childNodes.length;j++) {
					var childNode = node.childNodes[j];
					if (destNode.findChild('componentIdx', childNode.get('componentIdx'))) {
						childNode.set('selected', true);
					}
				}
			}
			
		},
		getTimeStamp:function(d) {	    	 
			if(d==''||d==null) d = new Date();
		    var s =
		        leadingZeros(d.getFullYear(), 4) + '-' +
		        leadingZeros(d.getMonth() + 1, 2) + '-' +
		        leadingZeros(d.getDate(), 2);		    
		    return s;
		},	 
		leadingZeros:function(n, digits) {
		    var zero = '';
		    n = n.toString();
		 
		    if (n.length < digits) {
		        for (i = 0; i < digits - n.length; i++)
		            zero += '0';
		    }
		    return zero + n;
		},	
		getFormFromMain:function(main, formXType) {
	   		var form = Ext.ComponentQuery.query('window '+ formXType)[0]; // select popup first
	   		if  (!form){
	   			form = main.down(formXType);
	   			if (!form) {
	   				form = Ext.widget(formXType);
	   				main.insert(form);
	   			}
	   		}
	   		if (main && main.getXType() === 'vesselmain') {	// vessel 인 경우 
	   			var vesselInnerForms = ['contractform', 'quotationform', 'shippingform', 'serviceform', 'rfqform'];
	   			if (vesselInnerForms.indexOf(form.getXType())!==-1) {
		   			var vesselCloseCallback = function() {
						main.setActiveItem(main.down('vesselform'));
						main.remove(form, true);
					};
					
					form.setCallerForm(vesselCloseCallback);
					form.down('vesselfield').setDisabled(true);
					form.setCloseCallback(vesselCloseCallback);
	   			}
	   		}
	   		
	   		return form;			
		},
		showFileDownMenu:function(record, fieldName, event, isAddable, appIdx, appCategory, fileAppCategorys) {
			var files = record.get(fieldName);
			if (!files) files = [];
			var fileItems = [];
			
			if (isAddable) {
				fileItems.push({
					iconCls:'my-tree-icon-add',
					text: 'New File',
					handler:function() {
						var fileCategoryStore = _FUNCTION.getComboStore(_DATA.fileCategory, {field:'value', filters:fileAppCategorys});
						var popup = Ext.create('KJERP.view.widget.FileUploadWindow', {
							'appIdx':appIdx,
							'appCategory':appCategory,
							'fileCategoryStore':fileCategoryStore,
							callback: function(rows) {
								if (rows && rows.length >0) {
									var row = rows[0];
									files.push(row);
									record.set(fieldName, files);
									record.commit();
								}
								popup.close();	
						}	
						});
						popup.show();	
					}
				});
				if (files.length>0) {
					fileItems.push({
						xtype: 'menuseparator'
					});
				}
			}
		      
			for (var i=0;i<files.length;i++) {
				(function(q){
					var file = files[q];
					var serviceUrl = _GLOBAL.URL_SERVICE+'?service=fileDownloadByIdx&fileIdx='+file.fileIdx;
					fileItems.push({
						iconCls:'my-tree-icon-file',
							text: [
								'[',
								_RENDER.fileCategory(file.fileCategory),
								']',
								'&nbsp;',
								file.fileName
							].join(''),
							menu:{
								items:[{
									text: (file.fileName+'&nbsp;('+_FUNCTION.getFileSize(file.fileSize)+')'),
									plain:true
								},{
									xtype: 'menuseparator'								
								},{
									iconCls:'my-tree-icon-download',
									href:serviceUrl,
									text:'download file'
								},{
									iconCls:'my-tree-icon-trash',
									text:'drop file',
									handler:function() {
										var callback = function(result) {
											var pos = files.indexOf(file);
											files.splice(pos, 1);
											record.set(fieldName, files);
											record.commit();
									 	}
									 	Ext.MessageBox.confirm(_MESSAGE.alertTitle, _MESSAGE.confirmToDelete, function(btnId) {
											if (btnId == 'yes') {
												KJERP.controller.Main.requestService('fileDelete', file, callback, null, false);
											}
										});									
									}
								}]
							}
					});
				})(i)
		      }

		      var menu = new Ext.menu.Menu({
		          items:fileItems
		      }).showAt(event.getXY());
		},
	    updateRecordFiles:function(records, appIdxFieldName, filesFieldName, appCategory) {
	    	var appIdxs = [];
	    	var appCategorys = [];
	    	for (var i=0;i<records.length;i++) {
	    		appIdxs.push(records[i].get(appIdxFieldName));
	    		appCategorys.push(appCategory);
	    	}
    	
			var data = {'appIdxs':appIdxs, 'appCategorys':appCategorys};
			
	    	KJERP.controller.Main.requestService('getFileListX', data, function(ret) {
	    		var rows = ret.rows;
	    		for (var i=0;i<rows.length;i++) {
    				var row = rows[i];
	    			var findRecord = null;
	    			for (var j=0;j<records.length;j++) {
	    				var record = records[j];
	    				if (row.appIdx == record.get(appIdxFieldName)) {
	    					findRecord = record;
	    					break;
	    				}
	    			}
	    			if (findRecord) {
						record.set(filesFieldName, row.rows);
						record.commit();
	    			}
	    		}	    		
	    	});		    	
	    },		
		getAppIdxArray:function(selectedRecords, appIdxFieldName) {
			var appIdxs = [];
	    	for (var i=0;i<selectedRecords.length;i++) {
	    		var record = selectedRecords[i];
	    		appIdxs.push(record.get(appIdxFieldName));
	    	}
	    	return appIdxs;
		},
		isSameVesselSeleted:function(selectedRecords) {
			var isSame = true;
			var vesselIdx = 0;
	    	// check if same vessel
	    	for (var i=0;i<selectedRecords.length;i++) {
	    		var record = selectedRecords[i];
	    		if (vesselIdx ==0) {
	    			vesselIdx = record.get('vesselIdx');
	    		} else if (vesselIdx !=  record.get('vesselIdx')) {
	    			isSame = false;
	    			break;
	    		}
	    	}	
	    	return isSame;
		},
	   	appendImageGallery:function(galleryStore, fileRows) {
	   		var imageFiles = [];
	   		for (var i=0;i<fileRows.length;i++) {
	   			var row = fileRows[i];
	   			var fileName = row.fileName;
	   			var dotPos = fileName.lastIndexOf('.');
	   			
	   			if (dotPos !=-1) {
	   				if (_DATA.imageFileExt.indexOf(fileName.substring(dotPos+1).toLowerCase()) != -1) {
	   					imageFiles.push(row);
	   				}
	   			}
	   		}
	   		galleryStore.add(imageFiles);
	   	},		
		showInfoComponent : function(componentIdx) {
			var callback = function(record) {
				var popup = Ext.create('Ext.window.Window', {
							header : false,
							layout : _POPUP.layout,
							closable : _POPUP.closable,
							closeAction : _POPUP.closeAction,
							width : _POPUP.width,
							height : _POPUP.height,
							modal : _POPUP.modal,
							resizable : _POPUP.resizable,
							items : [{
										xtype : 'componentform',
										header : {
											xtype : 'formheader',
											toHideTools : ['save', 'reset', 'del'],											
											iconCls : 'my-panel-icon-component'
										}
									}]
						});
				var form = popup.down('componentform');
				KJERP.app.getController('KJERP.controller.Component').processEdit(record, form,
						true);
				form.setReadOnly(true);
				popup.show();
			}

			var data = {
				filters : [{
							"property" : 'componentIdx',
							"value" : componentIdx
						}]
			};
			
			KJERP.controller.Main.requestService('getComponentList', data,
					function(ret) {
						var rows = ret.rows;
						if (rows.length == 1) {
							var record = Ext.create('KJERP.model.Component',
									rows[0]);
							callback(record);
						}
					});
		},
		showEditComponent : function(record) {		
			
			var callback = function(formData) {    	
				
			
			}
			
			var popup = Ext.create('Ext.window.Window', {
						//header : false,
						title: 'Component-'+record.get('model'),
						layout : _POPUP.layout,
						closable : _POPUP.closable,
						closeAction : _POPUP.closeAction,
						width : _POPUP.width,
						height : _POPUP.height,
						modal : _POPUP.modal,
						resizable : _POPUP.resizable,
						items : [{
									xtype : 'componenteditform'
					//				callbackOnSelect:callback
									/*
									header : {
										xtype : 'formheader',
										toHideTools : ['save', 'reset', 'del'],
										toShowTools : ['edit'],									
										iconCls : 'my-panel-icon-component'
									}*/
								}]
					});
						
			var form = popup.down('componenteditform');
			//KJERP.app.getController('KJERP.controller.Component').processEdit(record, form, true);
			//form.setReadOnly(true);
			//var fields = ['companyIdx','Maker','componenttreegroupfield','JRCOrderCode','ImoNo','HSCode','IHM','shipdexCode','barcode','state','file','colormass','volume'];
			//form.setHiddenFields(fields);
			form.setRowValue(record);
			popup.show();			
			
		},
		getTreeItemCount : function(store) {
			// only count product
			var count = 0;
			var rootNode = store.getRootNode();
			store.each(function(record) {
						count += (record.parentNode == rootNode ? 1 : 0);
					});
			return count;
		},
		treeNodeDropProduct : function( node, data, overModel, dropPosition, eOpts) {
//			data.view.refresh(); performance issue, disable by osh
		},
		treeNodeDragOverProduct : function(targetNode, position, dragData) {
			var isDragOver = false;
			isTargetProduct = !targetNode.isLeaf(), isDragProduct = false;

			for (var i = 0; i < dragData.records.length; i++) { // 선택된 것 중 하나라도
																// 있으면..
				if (!dragData.records[i].isLeaf()) {
					isDragProduct = true;
					break;
				}
			}

			if (!isDragProduct) {
				isDragOver = true;
			} else if (isDragProduct && isTargetProduct
					&& position !== 'append') {
				isDragOver = true;
			}

			return isDragOver;
		},
		appendTreePanel : function(rootNode, selecteds, funcNewRecord) {
			var appendItemNodes = [];
			if (!selecteds || selecteds.length == 0)
				return appendItemNodes;
			
			var appendedNodes = [];
			var j = 0;
			for (var i = 0; i < selecteds.length; i++) {
				var appendedNode = null;
				var selected = selecteds[i];
				var childDestNodes = [];
				var newRecord = funcNewRecord(selected);

				// 넣을 넘이 이미 넣은 것중의 자식인지 확인
				for (j = 0; j < appendedNodes.length; j++) {
					if (selected.parentNode == appendedNodes[j].srcNode) {
						appendedNode = appendedNodes[j].destNode
								.appendChild(newRecord);
						break;
					}
				}
				if (appendedNode)
					continue;

				// 이미 넣은 것 중에 새로 넣을 넘의 자식이 있는지 확인
				for (j = 0; j < appendedNodes.length; j++) {
					if (selected == appendedNodes[j].srcNode.parentNode) {
						childDestNodes.push(j);
					}
				}

				appendedNode = rootNode.appendChild(newRecord);
				appendItemNodes.push(appendedNode);
				
				appendedNodes.push({
							srcNode : selected,
							destNode : appendedNode
						});

				for (var k = 0; k < childDestNodes.length; k++) {
					var toRemoveNode = rootNode.removeChild(appendedNodes[childDestNodes[k]].destNode);
					
					var toRemovePos = appendItemNodes.indexOf(toRemoveNode);
					appendItemNodes.splice(toRemovePos,1);
					
					appendedNode.appendChild(toRemoveNode);
				}
			}
			rootNode.expand();
			return appendItemNodes;
		},
		arrayIcon : function(value, data) {
			var ret = '';
			for (var i = 0; i < data.length; i++) {
				if (value == data[i].value) {
					ret = data[i].icon;
					break;
				}
			}
			return ret;
		},
		storeToArray : function(store, fromIndex, toIndex) {
			var ar = [];
			if (!fromIndex)
				fromIndex = 0;
			if (!toIndex)
				toIndex = -1;
				
			toIndex = toIndex==-1?store.getCount():toIndex;
			
			for (var i = fromIndex; i < toIndex && i < store.getCount(); i++) {
				ar.push(store.getAt(i).getData());
			}

			return ar;
		},
		getFileSize : function(size) {
			var ret = size + 'B';
			if (size > 1024 * 1024) {
				ret = Ext.util.Format.round(size / (1024.0 * 1024), 1) + 'MB';
			} else if (size > 1024) {
				ret = Ext.util.Format.round(size / 1024.0, 1) + 'KB';
			}
			return ret;
		},
		getMergeValue : function(first, second) {
			var display = '';
			if (first && second)
				display = first + ' /' + second;
			else if (first)
				display = first;
			else if (second)
				display = second;

			return display;
		},
		tagConverter : function(value) {
			var newValues = [];
			if (typeof(value) === 'object')
				newValues = value;
			else {
				if (value) {
					newValues = value.split(',');
				}
			}
			return newValues;
		},
		updateGridPriceTaxTotal : function(editor, context) {
			
			var record = context.record, value = context.value, unitPrice = record
					.get('unitPrice'), qty = record.get('qty'), price = record
					.get('price'), tax = record.get('tax'), total = record
					.get('total');

			if (context.field == 'unitPrice') {
				unitPrice = value;
				price = qty * unitPrice;
				total = tax + price;
			} else if (context.field == 'qty') {
				qty = value;
				price = qty * unitPrice;
				total = tax + price;
			} else if (context.field == 'price') {
				total = tax + price;
			} else if (context.field == 'tax') {
				tax = value;
				total = tax + price;
			}

			record.set('uniPrice', unitPrice);
			record.set('qty', qty);
			record.set('price', price);
			record.set('tax', tax);
			record.set('total', total);

			if (record.isLeaf()) {
				// calculate whole child price
				/*
				var parentNode = record.parentNode;
				var price = 0;
				var unitPrice = 0;
				var total = 0;
				var tax = 0;
				for (var i = 0; i < parentNode.childNodes.length; i++) {
					var child = parentNode.childNodes[i];
					unitPrice += child.get('price');
					tax += child.get('tax');
					total += child.get('total');
				}
				price = unitPrice * parentNode.get('qty');
				parentNode.set('unitPrice', unitPrice);
				parentNode.set('price', price);
				parentNode.set('tax', tax);
				parentNode.set('total', price + tax);
				*/
			} else {
				if (context.field == 'qty') {
					for (var i = 0; i < record.childNodes.length; i++) {
						var child = record.childNodes[i];
						var childValue = child.get('qty');
						var setValue = (childValue/context.originalValue)*qty;
						child.set('qty', setValue, {
							silent:true
						});
					}				
				}
			}
			context.store.sync();
		},
		updateFormPriceTaxTotal : function(form, store) {
			var priceLocked = form.down('[name=priceLocked]');

			if (priceLocked.getValue())
				return; // if locked, pass modification

			var formcontainer = form.down('container[name=formcontainer]'), priceField = formcontainer
					.down('[name=price]'), taxField = formcontainer
					.down('[name=tax]'), totalField = formcontainer
					.down('[name=total]'), sumTax = 0, sumPrice = 0;

			store.each(function(record) {
						if (record.isLeaf() == 0) {
							sumPrice += record.get('total');
							sumTax += record.get('tax');
						}
					});

			priceField.setValue(sumPrice);
			taxField.setValue(sumTax);
			totalField.setValue(sumPrice + sumTax);
		},
		getFormContainerValues : function(form) {
			var container = form.down('container[name=formcontainer]');
			var values = {};
			if (container) {
				container.query('field').every(function(field) {
							values[field.getName()] = field.getValue();
							return true;
						});

				container.query('filecombo').every(function(field) {

							if (field.getIsTmpAppIdx() && field.getTmpAppIdx()) {
								values[field.getName()] = {
									appIdx : field.getTmpAppIdx(),
									appCategory : field.getAppCategory()
								}
							} else {
								values[field.getName()] = null;
							}
							return true;
						});
			} else {
				values = form.getValues();
			}

			values.tag = _FUNCTION.getTagToStringValue(values.tag);
			return values;
		},
		getTagToStringValue : function(tagValue) {
			if (typeof(tagValue) === 'string')
				return tagValue;
			if (tagValue === undefined)
				return '';
			if (tagValue === null)
				return '';

			if (tagValue.length > 0)
				tagValue = tagValue.toString();
			else
				tagValue = '';

			return tagValue;
		},
		getComboStore : function(data, filter) {
			var filteredData = [];
			
			if (filter && filter.filters && filter.filters.length>0) {
				var destCategorys = filter.filters;
				for (var i=0; i<data.length;i++) {
					if (destCategorys.indexOf(data[i][filter.field]) != -1) {
						filteredData.push(data[i]);
					}
				}
			} else {
				filteredData = data;
			}
			return {
				'fields' : ['text', 'value'],
				'data' : filteredData
			};
		},
		resetStoreAtForm : function(form) {
			form.getForm().reset(true); // bug shall call
			form.query('grid').every(function(grid) {
						grid.getStore().removeAll()
					});
			form.query('treepanel').every(function(grid) {
						grid.getStore().getRoot().removeAll();
					});
		},
		setTitle:function(form) {    			
			var vessel = form.down('[name=display]').value;
			var from = form.down('[name=fromCompanyIdx]').rawValue;
			var to = form.down('[name=toCompanyIdx]').rawValue;
			
			form.down('[name=title]').setValue(vessel+'-'+from+'-'+to+'-'+Ext.Date.format(new Date(),'Y-m-d'))
	    }
	}
	// 콤보박스 및 그리드 데이터 표시때 사용하는 배열
	var _DATA = {
		fileTmpCategory : 'TMP',
		companyJRC : 268,
		companyKJE : 288,
		imageFileExt : ['jpg', 'jpeg', 'png', 'bmp'],
		appCategory : {
			quotation : 'QTN',
			company : 'CPY',
			component : 'CPN',
			equipment : 'EQP',
			shipping : 'SHP',
			contract : 'CNT',
			service : 'SRV',
			contact : 'CON',
			vessel : 'VSL',
			rfq : 'RFQ',
			serviceReport:'SRP',
			product:'PDT'
		},
		//Class: KR, LR, DNV, NK,GL, ABS, BL
		vesselClass:[
			{text:'KR', value:'KR'}	,
			{text:'LR', value:'LR'},
			{text:'DNV', value:'DNV'},
			{text:'NK', value:'NK'},
			{text:'GL', value:'GL'},
			{text:'ABS', value:'ABS'},
			{text:'BL', value:'BL'}	
		],
		//Notation: N/A, NAUT-OC, NAUT-AW, NBL, NBLES, NIBS, NBS1, NBS2, NAV1, IBS, SYS-NEQ, SYS-IBS 
		vesselNotation:[
			{text:'N/A', value:'N/A'}	,
			{text:'NAUT-OC', value:'NAUT-OC'},
			{text:'NAUT-AW', value:'NAUT-AW'},
			{text:'NBL', value:'NBL'},
			{text:'NBLES', value:'NBLES'},
			{text:'NIBS', value:'NIBS'},
			{text:'NBS1', value:'NBS1'},
			{text:'NBS2', value:'NBS2'},
			{text:'NAV1', value:'NAV1'},
			{text:'IBS', value:'IBS'},
			{text:'SYS-NEQ', value:'SYS-NEQ'},
			{text:'SYS-IBS', value:'SYS-IBS'}
		],
		xDefault : [{
					text : 'Valid',
					value : 0
				}, {
					text : 'Invalid',
					value : 1
				}],
		role : [{
					text : 'O',
					value : 1
				}, {
					text : 'X',
					value : 0
				}],
		tags : [{
					text : 'standard',
					value : '#standard',
					appCategory : ['product']
				}, {
					text : 'option',
					value : '#option',
					appCategory : ['product']
				}, {
					text : 'spare',
					value : '#spare',
					appCategory : ['product']
				}, {
					text : 'part',
					value : '#part',
					appCategory : ['product']
				}, {
					text : 'scanner',
					value : '#scanner',
					appCategory : ['product']
				}, {
					text : 'display',
					value : '#display',
					appCategory : ['product']
				}, {
					text : 'battery',
					value : '#battery',
					appCategory : ['product']
				}, {
					text : 'BAM',
					value : '#BAM',
					appCategory : ['vessel']
				}, {
					text : 'antenna',
					value : '#antenna',
					appCategory : ['product']					
				}],
		currency : [{
					text : 'USD',
					value : 'USD'
				}, {
					text : 'KRW',
					value : 'KRW'
				}, {
					text : 'JSP',
					value : 'JSP'
				}, {
					text : 'EUR',
					value : 'EUR'
				}, {
					text : 'GBP',
					value : 'GBP'
				}],
		bbsCategory : [{
					text : 'GENERAL',
					value : 0
				}, {
					text : 'UPDATE',
					value : 10
				}, {
					text : 'RELEASE',
					value : 20
				}, {
					text : 'Brochure',
					value : 30
				}, {
					text : 'RULES',
					value : 40
				}, {
					text : 'CERT',
					value : 50
				}],
		paymentCategory : [{
					text : 'N/C',
					value : 'N/C'
				}, {
					text : 'L/C',
					value : 'L/C'
				}, {
					text : 'ADVANCE',
					value : 'ADVANCE'
				}, {
					text : '30 DAYS T/T',
					value : '30 DAYS T/T'
				}, {
					text : 'ETC',
					value : 'ETC'
				}],
		fileCategory : [{
					text : 'Manual',
					value : 'MNL'
				}, {
					text : 'Software',
					value : 'STE'
				}, {
					text : 'Specification',
					value : 'SPC'
				}, {
					text : 'Brochure',
					value : 'BRC'
				}, {
					text : 'Invoice',
					value : 'INV'
				}, {
					text : 'Contract',
					value : 'CON'
				}, {
					text : 'Quotation',
					value : 'QOT'
				}, {
					text : 'Shipping',
					value : 'SHP'
				}, {
					text : 'O/F Letter',
					value : 'OFL'
				}, {
					text : 'Drawing',
					value : 'DRW'
				}, {
					text : 'Service Report',
					value : 'SRP'					
				}, {
					text : 'Etc',
					value : 'ETC'
				}],
		saleCategory : [{
					text : 'New Vessel',
					value : 0
				}, {
					text : 'Exist Vessel',
					value : 1
				}, {
					text : 'Other',
					value : 2
				}],
		serviceCategory : [{
					text : 'New Ship',
					value : 0
				}, {
					text : 'Repair Ship',
					value : 10
				}, {
					text : 'Service',
					value : 20
				}, {
					text : 'ETC',
					value : 30
				}],
		serviceType : [{
					text : 'Commissioning',
					value : 0
				}, {
					text : 'Sea Trial Test',
					value : 10
				}, {
					text : 'Installation',
					value : 20
				}, {
					text : 'Repair',
					value : 30
				}, {
					text : 'Other',
					value : 40
				}],
		delivery : [{
					text : '1 Month',
					value : '1 Month'
				}, {
					text : '3 Month',
					value : '3 Month'
				}, {
					text : '6 Month',
					value : '6 Month'
				}, {
					text : '9 Month',
					value : '9 Month'
				}, {
					text : '12 Month',
					value : '12 Month'
				}, {
					text : '24 Month',
					value : '24 Month'
				}],
		validity : [{
					text : '1 Month',
					value : '1 Month'
				}, {
					text : '2 Month',
					value : '2 Month'
				}, {
					text : '3 Month',
					value : '3 Month'
				}],
		userGroupCategory : [{
					text : 'Owner',
					value : 10
				}, {
					text : 'Engineer',
					value : 20
				}, {
					text : 'Sales',
					value : 30
				}, {
					text : 'Manager',
					value : 40
				}, {
					text : 'Admin',
					value : 99
				}],
		stateUserGroup : [{
					text : 'Valid',
					value : 0
				}, {
					text : 'Invalid',
					value : 1
				}],
		stateAuth : [{
					text : 'Valid',
					value : 0
				}, {
					text : 'Invalid',
					value : 1
				}],
		stateUser : [{
					text : 'Valid',
					value : 0
				}, {
					text : 'Invalid',
					value : 1
				}, {
					text : 'Waiting',
					value : 2
				}],
		stateRFQ : [{
					text : 'Requested',
					value : 0
				}, {
					text : 'Reviewed',
					value : 10
				}, {
					text : 'Processing',
					value : 20
				}, {
					text : 'Completed',
					value : 30
				}],
		stateQuotation : [{
					text : 'On Going',
					value : 0
				}, {
					text : 'Contracted',
					value : 10
				}, {
					text : 'failed',
					value : 20
				}],
		stateContract : [{
					text : 'Completed',
					value : 0
				}, {
					text : 'Amended',
					value : 10
				}, {
					text : 'Shipped',
					value : 20
				}, {
					text : 'Cancelled',
					value : 30
				}],
		stateService : [{
					text : 'Scheduled',
					value : 0
				}, {
					text : 'Working',
					value : 10
				}, {
					text : 'Completed',
					value : 20
				}, {
					text : 'Cancel',
					value : 30
				}],
		stateShipping : [{
					text : 'Shipped',
					value : 0
				}, {
					text : 'Moving',
					value : 10
				}, {
					text : 'Arrived',
					value : 20
				}, {
					text : 'Approved',
					value : 30
				}, {
					text : 'Cancel',
					value : 40
				}],
		stateContact : [{
					text : 'Employeed',
					value : 0
				}, {
					text : 'Retired',
					value : 10
				}, {
					text : 'Resigned',
					value : 10
				}],
		stateComponent : [{
					text : 'Normal',
					value : 0
				}, {
					text : 'Discontinued',
					value : 10
				}, {
					text : 'Temporay Not Avaible',
					value : 20
				}],
		stateCompany : [{
					text : 'Normal',
					value : 0
				}, {
					text : 'Not Used',
					value : 10
				}],
		stateVessel : [{
					text : 'Sailing',
					value : 0
				}, {
					text : 'Desgin',
					value : 10
				}, {
					text : 'Building',
					value : 20
				}, {
					text : 'Demolished',
					value : 30
				}],
		flagVessel : [{
					text : 'Liberia',
					value : 'Liberia'
				}, {
					text : 'Singapore',
					value : 'Singapore'
				}, {
					text : 'Greece',
					value : 'Greece'
				}, {
					text : 'Bahamas',
					value : 'Bahamas'
				}, {
					text : 'Panama',
					value : 'Panama'
				}, {
					text : 'USA',
					value : 'USA'
				}, {
					text : 'Malta',
					value : 'Malta'
				}, {
					text : 'Norway',
					value : 'Norway'
				}],
		typeVessel : [{
					text : 'BULK',
					value : 'BULK'
				}, {
					text : 'PC',
					value : 'PC'
				}, {
					text : 'COT',
					value : 'COT'
				}, {
					text : 'CNT',
					value : 'CNT'
				}, {
					text : 'LNG',
					value : 'LNG'
				}, {
					text : 'LPG',
					value : 'LPG'
				}, {
					text : 'PSV',
					value : 'PSV'
				}, {
					text : 'RIG',
					value : 'RIG'
				}, {
					text : 'DRILL',
					value : 'DRILL'
				}],
		stateDrawing : [{
					text : 'Pending',
					value : 0,
					icon : 'resources/images/icon/step1.png'
				}, {
					text : 'Drawing',
					value : 10,
					icon : 'resources/images/icon/step2.png'
				}, {
					text : 'Completed',
					value : 20,
					icon : 'resources/images/icon/step3.png'
				}, {
					text : 'Cancel',
					value : 30,
					icon : 'resources/images/icon/step9.png'
				}],
		productComponentCategory : [{
					text : 'Standard',
					value : 0
				}, {
					text : 'Option',
					value : 10
				}, {
					text : 'Spare',
					value : 20
				}, {
					text : 'Install',
					value : 30
				}],
		productComponentGroup : [{
					text : 'General',
					value : 0
				}, {
					text : 'Scanner',
					value : 10
				}, {
					text : 'Display',
					value : 20
				}, {
					text : 'Batery',
					value : 30
				}, {
					text : 'Etc',
					value : 40
				}]
	};

	var _GRID = {
		pageRow : 0, // Page 어댑터 사용시
		emptyText : 'No results',
		actionMenuHidden : true, // grid acion menu
		height:'100%',
		label : {
			action : 'Action',
			tipEdit : 'edit selected row',
			tipDel : 'delete selected row',
			tipSee : 'see selected row',
			tipSelect : 'select a item'
		},
		borderStyle : {
			borderColor : 'rgb(208,208,208)',
			borderStyle : 'solid',
			borderWidth : '1px 0 0 0'
		}
	};

	var _TOOLBAR = {
		label : {
			add : '',
			edit : '',
			del : '',
			search : '',
			view : '',
			select : '',
			excel : '',
			save : '',
			copy : '',
			refresh : '',
			find : 'Find In Vessel',
			addComponent : 'Component',
			addEquipment: 'Equipment',
			quotationToContract:'Contract',
			contractToShipping:'Shipping',
			toEquipment:'Equipment'
		},
		tooltip : {
			add : 'Create new item',
			edit : 'Edit selected item',
			del : 'Delete selected item',
			search : 'Run query',
			view : 'View selected item',
			select : 'Select item...',
			excel : 'Download excel file',
			save : 'Save...',
			addComponent : 'Add from components',
			addEquipment: 'Add from vessel equipments',			
			copy : 'Duplicate selected item',
			refresh : 'Refresh items',
			quotationToContract:'Transfer selected quotation to contract',
			contractToShipping:'Transfer selected contract to shipping',
			toEquipment:'Transfer selected items to vessel equipment'
		}

	}

	var _SESSION_ID = "";

	var _FLAG = {
		AUTHBUTTON : ""
	};

	// leadingZeros(12, 3) -> '012'
	function leadingZeros(n, digits) {

		var zero = '';

		n = n.toString();

		if (n.length < digits) {
			for (i = 0; i < digits - n.length; i++) {

				zero += '0';
			}
		}

		return zero + n;
	}

	// grid column renderer
	var _RENDER = {
		ARRAY_RENDER : function(value, data) {
			var ret = '';
			for (var i = 0; i < data.length; i++) {
				if (value == data[i].value) {
					ret = data[i].text;
					break;
				}
			}
			return ret;
		},
		files:function(files, fileMenu) {
			if (!files) files=[];
			var html =  [
				'<a href="#" style="text-decoration: none;" class="',fileMenu,'"  title="Click to add/download file">',
					'<span class="my-tree-icon-file"></span>',
					'&nbsp; (',files.length,')', 
				'</a>'
			].join('');
			
			return html;
		},
		showLinkedApp: function(value, meta, record) {
			var html ='<img src="resources/images/icon/uncheck.png" title="Contract is not yet linked"></img>';
			if (value) {
				html ='<img src="resources/images/icon/check.png" title="Contract is linked"></img>'; 
			}
			return html;
		},		
		infoComponent : function(value, meta, record) {
			var html = [
					'<a href="#" class="infoComponent"  title="see information">',
					'<span class="my-tree-icon-info"></span>',
					value,
					'</a>'
					].join('');
			return html;
		},
		
		/*
		infoComponent : function(value, meta, record) {
			var html = [
					'<a href="#" class="editComponent"  title="edit row">',
					'<span class="my-tree-icon-info"></span>',
					'</a>',
					'|',
					'<a href="#" class="infoComponent"  title="see information">',
					'<span class="my-tree-icon-info"></span>',
					value,
					'</a>'
					].join('');
			return html;
		},
		*/
		companySName : function(value, meta, record) {			
			var companyName = meta.column.dataIndex.replace('SName','Name');			
			if(!value=='') return value;													
			return record.get(companyName);
		},		
		toMoneyWithDecimal : function(value) {
			return Ext.util.Format.number(value, '0,000.00')
		},
		toMoney : function(value) {
			return Ext.util.Format.number(value, '0,000')
		},
		toDate : function(value) {
			var date= new Date();
			if(value==null || value=='') return Ext.Date.format(dt,'Y-m-d');
			return value;
		},
		vesselName : function(value, meta, record) {
			var name = '';
			var hullCode = record.get('HullCode'), hullName = record
					.get('HullName'), name = '';
			if (hullCode && hullName) {
				name = hullCode + '/' + hullName;
			} else if (hullCode) {
				name = hullCode
			} else if (hullName) {
				name = hullName;
			}
			return name;
		},
		selectedComponent:function(value) {
			var html = '';
			if (value) 	
				html = '<span class="my-tree-icon-selected"></span>';
			return html;
		},
		fileCategory : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.fileCategory);
		},
		saleCategory : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.saleCategory);
		},
		productComponentCategory : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.productComponentCategory);
		},
		productComponentGroup : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.productComponentGroup);
		},
		stateDrawing : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateDrawing);
		},
		stateContact : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateContact);
		},
		stateVessel : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateVessel);
		},
		stateCompany : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateCompany);
		},
		stateComponent : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateComponent);
		},
		stateQuotation : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateQuotation);
		},
		stateContract : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateContract);
		},
		stateShipping : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateShipping);
		},
		stateService : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateService);
		},
		stateUser : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateUser);
		},
		stateUserGroup : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateUserGroup);
		},
		stateAuth : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateAuth);
		},
		xDefault : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.xDefault);
		},
		role : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.role);
		},
		stateRFQ : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.stateRFQ);
		},
		serviceCategory : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.serviceCategory);
		},
		bbsCategory : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.bbsCategory);
		},
		serviceType : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.serviceType);
		},
		userGroupCategory : function(value, meta, record) {
			return _RENDER.ARRAY_RENDER(value, _DATA.userGroupCategory);
		},
		treeRowNumber:function(value, metaData, record, rowIndex, colIndex, store, view) {
			var root = store.getRootNode(),
				index = root.indexOf(record);
				
			if (index<0) {
				var parentNode = record.parentNode;
				index = parentNode.indexOf(record);
				metaData.css = 'subItemRow';
			}
			
			return ++index;
		},
		dateYmd : function(value) {
			if (typeof(value) == 'string')
				return value.substring(0, 10);
			else
				return Ext.Date.format(value, 'Y-m-d');
		},
		dateYmdHis : function(value) {
			if (typeof(value) == 'string')
				return value.substring(0, 10);
			else
				return Ext.Date.format(value, 'Y-m-d / H:i:s');
		},
		dateYmdByToday : function(value) {					
			if (value==null||value=='')				
				return Ext.Date.format(new Date(), 'Y-m-d');
			else if (typeof(value) == 'object')
				return Ext.Date.format(value, 'Y-m-d');
			else if (typeof(value) == 'string')
				return value.substring(0, 10);
			else
				return Ext.Date.format(new Date(), 'Y-m-d');
		}
	}

	// login 사용자의 정보를 담는다
	var _USER = {
		info : {}
	};

	// 디버깅
	var _DEBUG = {
		log : function() {
		console.log(arguments)
		}
	};

	var _DateDiff = {
		inDays : function(d1, d2) {
			var t2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
			var t1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());

			return parseInt((t2 - t1) / (24 * 3600 * 1000));
		},
		inWeeks : function(d1, d2) {
			var t2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
			var t1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());

			return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
		},
		inMonths : function(d1, d2) {
			var d1Y = d1.getFullYear();
			var d2Y = d2.getFullYear();
			var d1M = d1.getMonth();
			var d2M = d2.getMonth();

			return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
		},
		inYears : function(d1, d2) {
			return d2.getFullYear() - d1.getFullYear();
		}
	}

	var _Base64 = {
		// private property
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		encodeJson : function(data) {
			if (_AJAX.base64Encode)
				return this.encode(JSON.stringify(data));
			else
				return JSON.stringify(data);
		},
		// public method for encoding
		decodeToJson : function(data) {
			return eval('(' + TestbedAdmin.libs.Base64.decode(data) + ')');
		},
		encode : function(input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;

			input = this._utf8_encode(input);

			while (i < input.length) {

				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output + this._keyStr.charAt(enc1)
						+ this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3)
						+ this._keyStr.charAt(enc4);

			}

			return output;
		},

		// public method for decoding
		decode : function(input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;

			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			while (i < input.length) {

				enc1 = this._keyStr.indexOf(input.charAt(i++));
				enc2 = this._keyStr.indexOf(input.charAt(i++));
				enc3 = this._keyStr.indexOf(input.charAt(i++));
				enc4 = this._keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

			}

			output = this._utf8_decode(output);

			return output;

		},

		// private method for UTF-8 encoding
		_utf8_encode : function(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		},

		// private method for UTF-8 decoding
		_utf8_decode : function(utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;

			while (i < utftext.length) {

				c = utftext.charCodeAt(i);

				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if ((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i + 1);
					c3 = utftext.charCodeAt(i + 2);
					string += String.fromCharCode(((c & 15) << 12)
							| ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		}
	};
}
