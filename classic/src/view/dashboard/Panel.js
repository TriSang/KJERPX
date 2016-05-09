Ext.define('KJERP.view.dashboard.Panel', {
	extend:'Ext.grid.Panel',
	requires:[
		'Ext.grid.column.Action'
	],
	xtype:'dashboardpanel',
    title: '',
	collapsed: false,
    collapsible: true,
    width: _DASHBOARD.panel.width,
    height: _DASHBOARD.panel.height,
    border:true,
    margin:'10 10 10 10',
    emptyText:_GRID.emptyText,
    tools: [{ 
    	type:'refresh',
    	tooltip: 'Refresh Data',
	    handler: function(event, toolEl, panelHeader) {
	    	panelHeader.up('grid').getStore().reload();
	    }
    }],
	viewConfig: {
	    padding: '2 2 2 2'
	},
    scrollable:'vertical',
    hideHeaders: true,
    config:{
    	serviceName:null,			// dashboard ajax service name
    	subApp:null,					// 호출한 폼의 하위 tab panel 선택 대상 (vesselform), null이면 활성화 하지 않음
    	appController:null,			// 폼제어 컨트롤러
    	appMenu:null,				// 폼 관련 메뉴
    	actionItemHandler:function(grid, rowIndex, colIndex, item, e) {			// vesselform 핸들러
    		var me = this;
        	var record = grid.getStore().getAt(rowIndex);
        	var data = ({
				'filters':[{property:'vesselIdx', value:record.get('vesselIdx')}],
				'session': {
					sessionID:_SESSION_ID,
					userID:_USER.info.id
				}
			});
        	KJERP.controller.Main.requestService('getVesselList', data, function(ret) {
        		var rows = ret.rows;
        		
        		if (ret.rows && ret.rows.length==1) {        			
        			var appRecord = Ext.create('KJERP.model.Vessel', rows[0]);
        			var appController = KJERP.getApplication().getController(me.getAppController());
        			var subapp = me.getSubApp();
        			var callback = function(menuView) {
			    		appController.processEdit(record);
			    		if (subapp) {
			    			var subAppContainer = menuView.down('[name=subappcontainer]');
			    			if (subAppContainer) {
			    				subAppContainer.setActiveItem(subAppContainer.down(subapp));
			    			}
			    		}
	    			};
        			KJERP.getApplication().getController('Main').selectAppForm(me.getAppMenu(), callback);
        		}
	    	});
        	
		},
		stateRenderer:function(value, record) {
			return value;
		}
    },
	initComponent:function() {
		var me = this;
		me.columns =[{
			text:'Title',			
			dataIndex:'title',
			align:'left',
			renderer:function(value, meta, record) {
				var title = value;
				if (!record.get('eUser')) {	// eUser가 있는 경우는 글을 읽었음
					title = '<span style="color:orange;" class="my-tree-icon-bell"></span>&nbsp;'+title;
				}
				return title;
			},
			flex:1
		}, {			
			text:'Status',
			dataIndex:'state',
			align:'center',
			renderer:me.stateRenderer,			
			width:100
		}, {
			xtype:'actioncolumn',
		 	width: 60,		 	
		 	align:'center',
		    items: [{
		        iconCls:'my-tree-icon-eye',
		        tooltip: _GRID.label.tipSee,
		        scope: this,
		        handler:me.getActionItemHandler()
		    }] 								
		}];
		
		me.store = new Ext.data.Store({
            model:'KJERP.model.RFQ',
            fields:['title','appIdx','state','remark', 'vesselIdx', 'appCategory', 'eUser'],
            autoLoad:true,
            remoteSort: false,
			proxy:  JSON.parse(JSON.stringify(_AJAX.proxy))
        });		
        me.store.proxy.url = _GLOBAL.URL_SERVICE+'?service='+me.getServiceName();//getRFQDashboard';
        /*
		me.store={
			fields:['title', 'vessel', 'state'],
			data:[{
				title:'KJ RADIO, H1903, Hyundai Ecopia, 3037', state:'urgent', appIdx:1, remark:'hello',vesselIdx:141
			},{
				title:'KJ RADIO, H1903, Hyundai Ecopia, 3037', state:'urgent', appIdx:3, remark:'hello',vesselIdx:141
			},{
				title:'KJ RADIO, H1903, Hyundai Ecopia, 3037', state:'urgent', appIdx:3, remark:'hello',vesselIdx:141
			},{
				title:'KJ RADIO, H1903, Hyundai Ecopia, 3037', state:'urgent', appIdx:3, remark:'hello',vesselIdx:141
			},{
				title:'KJ RADIO, H1903, Hyundai Ecopia, 3037', state:'urgent', appIdx:3, remark:'hello',vesselIdx:141
			}]
		};
		*/
		me.callParent(arguments);
	}
});