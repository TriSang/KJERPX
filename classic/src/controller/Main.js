Ext.define('KJERP.controller.Main', {
    extend: 'Ext.app.Controller',
    requires:[
		'Ext.data.JsonP',
		'Ext.ux.exporter.Exporter',
		'Ext.form.action.StandardSubmit'
    ],    
    refs: [{
		ref:'main', selector:'app-main'
   	},{
		ref:'loginForm', selector:'loginform'   			
   	},{
		ref:'menuTree', selector:'menutree'
   	},{
   		ref:'work', selector:'job [name=work]' 
   	}
   	],
//   	routes : {
//            'users' : 'findUser'
//        },
//    findUser:function(){
//    	
//    	//Ext.Msg.alert('Msg11','test');
//    	var me = this,
//    	main = me.getMain(),
//    	son = main.down('[name=route]');
//    	//a.showJobMask(true);
//    	
//    	main.getLayout().setActiveItem(son);
//    	son.down('popuptest').show();
//    },    
    init:function() {
    	var me = this;
    	me.control({
    		'menutree > treepanel': {
    			select:me.onTreeMenuItemSelect
    		},
    		'field': {
                beforerender: me.markMandatoryFields
            }    		
    	});
    },   	
   	loadMask:null,
   	refreshTimer:null,
   	statics:{
   		shortWindowMenu:function( grid, action){   		
   			//action (edit, delete)에 따른 이벤트 수행.
       		var editButton = grid.up('gridpanel').down('button[action='+action+']');
       		editButton.fireEventArgs('click',[editButton]);
   		},
   		showJobMask:function(bShow) {
   		//ExtJS Window Modal 표시 때 탭 포커스 오류 생김, 그래서 부모 뷰에 마스크 만들어 모달 흉내
   			
   		var job = Ext.ComponentQuery.query('job')[0];
   		if(job==null){
   			return;
   		}
   		if (bShow) job.mask();
   		else job.unmask();
   		},
   		showAlert:function(msg) {
   			Ext.Msg.alert(_MESSAGE.alertTitle, msg);
   		},   		
   		isInValidResult:function(result) {
   			var ret  = true;
   			if (result==null) {
   				ret = false;
   				KJERP.controller.Main.showAlert("Result is null");
   			} else {
   				if (result.hasOwnProperty('operation')) {
   					if (result.operation == false) {
   						ret = false;
   						if (result.hasOwnProperty('msg') && result.msg != '') {
   							KJERP.controller.Main.showAlert(result.msg);
   						}
   					}
   				} else {
   					KJERP.controller.Main.showAlert("Result is abnomal");
   					ret = false;
   				}
   				
   			}
   			return !ret;
   		},
   	   	showMask:function() {
   	   		var me = this;
   			if (me.loadMask == null) {
   				var panel = Ext.ComponentQuery.query('job');
   				if (panel.length === 1) {
   					me.loadMask = new Ext.LoadMask( {target:panel[0], msg:"Please wait..."});
   				}
   			} else {
   				me.loadMask.show();
   			}
   	   	},
   	   	hideMask:function() {
   	   		var me = this;
	   	   	if (me.loadMask != null)
	   	   		me.loadMask.hide();
   	   	}, 
   	   	requestExcel:function(service, data) {
			var strData = _Base64.encodeJson(filters);
	   		window.open(_GLOBAL.URL_SERVICE+'?service='+service+'&excel=true&data='+strData,'_self');
   	   	},
   		requestJsonPService:function(service, data, callback,server,mask) {
   			_DEBUG.log(this.$className+'>>>'+'requestService', service, data);
   			var me = this;   			
   			
			var serverUrl = _GLOBAL.URL_SERVICE;
			var maskShow = true;
			if (typeof(server) != 'undefined')
				serverUrl = server;
			if (typeof(mask) != 'undefined')
				maskShow = mask;
			
			if (maskShow) {
				me.showMask();
			}
			//session 정보 넣기.
			data["session"]={userID:_USER.email,sessionID:_USER.sessionID};
			var strData = JSON.stringify(data);			
			var url = serverUrl+'?service='+service;
			Ext.data.JsonP.request({
	            timeout:_AJAX.timeout,
	            url: url,
	            callbackKey: 'callback',
	          	params: {
	          		data:_AJAX.base64Encode?_Base64.encode(strData):strData	          		
	            },            
	            method:'POST',
	            success: function(result, request) { 	            	
	            	_DEBUG.log('Controller/Main.js responseService', result);
	            	if (maskShow) me.hideMask();
	                
	                if (typeof(_GLOBAL.DEBUG)!='undefined') console.log('result', result);
	              
					if (result.operation == true) {
	               		if (result.msg) {
							Ext.Msg.alert(_MESSAGE.alertTitle, result.msg+'<br/>', function() {
								if (callback!=null) callback(result);
							});
	               		} else {
			               	if (callback!=null) callback(result);
	               		}
	               	} else {
	               		ret = result;
	               	
	               		if (result.msg) {
							Ext.Msg.alert(_MESSAGE.alertTitle, result.msg+'<br/>', function() {
								if (callback!=null) callback(result);
							});
							_SESSION_ID = '';    			
    						Ext.ComponentQuery.query('app-main')[0].layout.setActiveItem(0);
							//me.logout();
	               		}
	               		
	               	}
	            },
	            failure: function(response) {
	            	_DEBUG.log("Controller/Main.js " + this.$className+'>>>'+'responseService', response);
	                if (maskShow) me.hideMask();
		        	if (callback!=null) callback(null);
		        	Ext.Msg.alert(_MESSAGE.alertTitle, 'fail to load '+url, Ext.emptyFn);
			    }
	        });		
		},  
		
		requestService:function(service, data, callback,server,mask) {			
			return _GLOBAL.JSONP_REQUEST?
					this.requestJsonPService(service, data, callback,server,mask):
					this.requestAjaxService(service, data, callback,server,mask);
		},
		requestFile:function(fileIdx) {
			var data={filters:[{
		   		property:'fileIdx', value:fileIdx
		   	}]};
		   	var strData = JSON.stringify(data);
			var serviceUrl = _GLOBAL.URL_SERVICE+'?service=fileDownload';
		    var form = Ext.create('Ext.form.Panel', {
		    	url:serviceUrl,
		        standardSubmit: true,
	            method:'POST',
	            disableCaching:true,
		        useDefaultXhrHeader:false
		    });
		
		    form.submit({
		        target: '_blank', // Avoids leaving the page. 
		        params: {
	          		data:_AJAX.base64Encode?_Base64.encode(strData):strData
	            }
		    });
		    Ext.defer(function(){
		        form.close();
		    }, 100);
		},
   		requestAjaxService:function(service, data, callback,server,mask) {
   			_DEBUG.log("Controller/Main.js "+this.$className+'>>>'+'requestService', service, data);
   			var me = this;   			
			var serverUrl = _GLOBAL.URL_SERVICE;
			var maskShow = true;
			if (server && typeof(server) != 'undefined')
				serverUrl = server;
			if (mask || typeof(mask) != 'undefined')
				maskShow = mask;
			
			if (maskShow) {
				me.showMask();
			}
			//session정보 넣기 
			
			data["session"]={userID:_USER.info.email,sessionID:_USER.info.sessionID};
			var strData = JSON.stringify(data);
			//console.log(strData);
			var url = serverUrl+'?service='+service;
			Ext.Ajax.request({
	            timeout:_AJAX.timeout,
	            url: url,
	          	params: {
	          		data:_AJAX.base64Encode?_Base64.encode(strData):strData
	            },            
	            method:'POST',
	            disableCaching:true,
		        useDefaultXhrHeader:false,
	            success: function(result, request) { 
	            	_DEBUG.log('Controller/Main.js responseService', result);

	            	result = JSON.parse(result.responseText);
	            	if (maskShow) me.hideMask();
	                
	                if (typeof(_GLOBAL.DEBUG)!='undefined') console.log('result', result);
					if (result.operation == true) {
	               		if (result.msg && _OPTION.config.showMessageFromService && !_TEST.isOn) {
							Ext.Msg.alert(_MESSAGE.alertTitle, result.msg+'<br/>', function() {
								if (callback!=null) callback(result);
							});
	               		} else {
			               	if (callback!=null) callback(result);
	               		}
	               	} else {
	               		if (result.msg && _OPTION.config.showMessageFromService && !_TEST.isOn) {
							Ext.Msg.alert(_MESSAGE.alertTitle, result.msg+'<br/>', function() {
								if (callback!=null) callback(result);
							});
	               		} else {
			               	if (callback!=null) callback(result);
	               		}
	               		//me.logout();
	               		_SESSION_ID = '';    			
	               	}
	            },
	            failure: function(result) {
	            	result = JSON.parse(result.responseText);
	            	_DEBUG.log("Controller/Main.js"+this.$className+'>>>'+'responseService', response);
	                if (maskShow) me.hideMask();
		        	if (callback!=null) callback(null);
		        	Ext.Msg.alert(_MESSAGE.alertTitle, 'fail to load '+url, Ext.emptyFn);
			    }
	        });		
		},  
		loadByBase64JSON:function(service,data,store, callback) {
	    	var callback2 = function(result) {
	    		var rows = result.rows;
	    		if (rows == null) return;
	    		
	    		store.removeAll();
	    		if (rows.length > 0) {
	    			store.loadData(rows);
	    		}
	    		
	    		if (typeof(callback)!='undefined' && callback != null) {
	    			callback(store);
	    		}
	    	}
	    	this.requestService(service, data, callback2);	
	    }	   		
   	},
   	/*
   	 * Event Handler
   	 */
    onTreeMenuItemSelect:function(cmp, record, index, eOpts) {
    	var me = this;
    	if (record.get('leaf')) {
	    	_DEBUG.log('Controller/Main.js onTreeMenuItemSelect', record.get('menu'));
    		me.selectMenu(record.get('menu'), null, record.get('controller'));
    	}
    },
    selectAppForm:function(menu, callback) {
    	
    	var me = this,
    		tree =  me.getMenuTree().down('treepanel'),
    		menuStore = tree.getStore(),
    		menuItem = menuStore.getRoot().findChild('menu', menu);
    		
    	tree.getSelectionModel().select(menuItem, false, true); // select ui
    	
    	me.selectMenu(menu, callback);
    },
	selectMenu:function(menu, callback, controller) {
		
		var me = this,
			app = me.getApplication(),
			work = me.getWork();
		
		// close any window before move menu
		Ext.ComponentQuery.query('window').every(function(item) {
			if (item.isVisible()) {
				item.close();
			}
			return true;
		});
			
		if (menu == 'logout') {
   			me.logout();			
			return;
		} 
		/* don't use load controller dynamically
		if (controller) {	// load controller dynamically
			me.getApplication().getController(controller);
		}
		*/
		var menuView = work.down(menu);
		if (!menuView) {
			menuView = Ext.widget(menu);
			work.insert(menuView);
		}
		work.layout.setActiveItem(menuView);
		// remove from card layout, if it doesn't need memory
		var toDestroyItem = ['buglist', 'dashboardmain', 'bbsmain', 'usermain', 'usergroupmain', 'authmain', 'optionform'];
		work.items.each(function(view) { 
			if (view != menuView && toDestroyItem.indexOf(view.getXType())!=-1 ) {
				work.remove(view,true);
			}
		});
		if (callback) {
			callback(menuView);
		}
	},
    /*
     * Procedure
     */
    logout:function() {
    	var me = this,
    		main = me.getMain(),
    		job = main.down('job'),
    		login = main.down('loginform');    	
    		
    	var callback = function(result) {
    		if (KJERP.controller.Main.isInValidResult(result)) return;    		
    		KJERP.controller.Main.loadMask = null;
    		_SESSION_ID = "";
    		// destroy main
    		_USER.info={};
    		main.layout.setActiveItem(login);
    		main.remove(job, true);
		};
		var data = {filters:[]};
		data.filters.push({property:'sessionID', value:_SESSION_ID});	
		KJERP.controller.Main.requestService('logoutSession', data, callback);
		return false;    
    	
    },
 	markMandatoryFields: function(field, options) {
        if (field && field.isFieldLabelable && field.fieldLabel && field.allowBlank == false) {
            field.labelSeparator = '<span class="req" style="color:red">*</span>:';
        }
    }    
});
