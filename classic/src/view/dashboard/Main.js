Ext.define('KJERP.view.dashboard.Main', {
    extend: 'Ext.Panel',
    requires:[
    	'KJERP.view.dashboard.Panel',
    	'Ext.layout.container.Column',
    	'Ext.button.Segmented',
    	'Ext.tab.Panel'
    ],
	xtype:'dashboardmain',
	header:false,
	layout:'column',
	defaults:{
		xtype:'dashboardpanel',
		columnWidth:0.5,
		maxWidth:600
	},
	bodyPadding:'10 20 10 10',
	items:[{
		xtype:'container',
		margin:'10 10 10 10',
		layout:{
			xtype:'hbox'
		},
		maxWidth:2048,
		columnWidth:1.0,
		items:[{
			xtype: 'segmentedbutton',
            items: [{
                text: 'Recent',
                pressed: true,
                tooltip:'show summarized work order by date',
                handler:function(cmp) {
                }
            }, {
                text: 'Priority',
                tooltip:'show summarized work order by prority',
                handler:function(cmp) {
                }
            }]
		}]
	},{
		title:'Latest News',
	    iconCls:'my-panel-icon-news',
		appMenu:'bbsmain',
		appController:'BBS',	    
		subApp:null,
		serviceName:'getBBSDashboard',
		stateRenderer:_RENDER.bbsCategory,
		actionItemHandler:function(grid, rowIndex, colIndex, item, e) {			// vesselform 핸들러
			e.stopEvent();
    		var me = this;
        	var record = grid.getStore().getAt(rowIndex);
        	var data = ({
				'filters':[{property:'bbsIdx', value:record.get('appIdx')}],
				'session': {
					sessionID:_SESSION_ID,
					userID:_USER.info.id
				}
			});
        	KJERP.controller.Main.requestService('getBBSList', data, function(ret) {
        		var rows = ret.rows;
        		if (ret.rows && ret.rows.length==1) {
        			var appRecord = Ext.create('KJERP.model.BBS', rows[0]);
        			Ext.widget('htmlviewer', {
        				title:'['+_RENDER.bbsCategory(appRecord.get('bbsCategory'))+']&nbsp;'+appRecord.get('bbsTitle'),
        				html:appRecord.get('bbsContent')
        			}).show();
        		}
	    	});
		}		
	},{
		title:'New Vessels',
		iconCls:'my-panel-icon-vessel',
		appMenu:'vesselmain',
		appController:'KJERP.controller.Vessel',		
		subApp:null,
		stateRenderer:function(value) {			
			return _RENDER.stateVessel(value);	
		},
		serviceName:'getVesselDashboard'
	},{		
		title:'RFQ',
		iconCls:'my-panel-icon-rfq',
		serviceName:'getRFQDashboard',
		appMenu:'vesselmain',
		appController:'KJERP.controller.Vessel',
		stateRenderer:function(value) {			
			return _RENDER.stateRFQ(value);	
		},
		subApp:'vesselrfqs'
	},{
		title:'Quotation',
		iconCls:'my-panel-icon-quotation',
		serviceName:'getQuotationDashboard',
		appMenu:'vesselmain',
		appController:'KJERP.controller.Vessel',	
		stateRenderer:function(value) {			
			return _RENDER.stateQuotation(value);	
		},
		subApp:'vesselquotationss'
	},{
		title:'Contract',
		iconCls:'my-panel-icon-contract',
		serviceName:'getContractDashboard',
		appMenu:'vesselmain',
		appController:'KJERP.controller.Vessel',		
		stateRenderer:function(value) {					
			return _RENDER.stateContract(value);	
		},
		subApp:'vesselcontracts'
	},{
		title:'Shipping',
		iconCls:'my-panel-icon-shipping',
		serviceName:'getShippingDashboard',
		appMenu:'vesselmain',
		appController:'KJERP.controller.Vessel',		
		stateRenderer:function(value) {			
			return _RENDER.stateShipping(value);	
		},
		subApp:'vesselshippings'
	},{
		title:'Service',
		iconCls:'my-panel-icon-service',
		serviceName:'getServiceDashboard',
		appMenu:'vesselmain',
		appController:'KJERP.controller.Vessel',	
		stateRenderer:function(value) {			
			return _RENDER.stateService(value);	
		},
		subApp:'vesselservices'		
	},{
		title:'Drawing',
		iconCls:'my-panel-icon-drawing',
		appMenu:'vesselmain',
		appController:'KJERP.controller.Vessel',		
		serviceName:'getDrawingDashboard',
		stateRenderer:function(value,meta) {		
			
			var arr = value.split('/');
			var data = "AP:"+_RENDER.stateDrawing(arr[0]) + "/WK:"+_RENDER.stateDrawing(arr[1])+ "/FI:"+ _RENDER.stateDrawing(arr[2]);	
			meta.tdAttr = 'data-qtip="' + data + '"';
			return data;
		},				
		subApp:'vesselequipments'		
	}]
});