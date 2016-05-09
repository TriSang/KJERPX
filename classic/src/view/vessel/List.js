Ext.define('KJERP.view.vessel.List', {
	extend:'Ext.grid.Panel',
	requires:[
		'Ext.toolbar.Spacer',
		'KJERP.model.Vessel',
		'Ext.grid.column.Action',
		'Ext.ux.grid.ComponentColumn',
		'Ext.data.proxy.JsonP',
		'Ext.grid.column.RowNumberer',
		'Ext.grid.feature.Summary',
		'Ext.ux.field.SearchCombo',
		'KJERP.view.widget.*'
	],
	xtype:'vessellist',
	emptyText:_GRID.emptyText,
	header:{
		title:'Vessel Management',
		iconCls:'my-panel-icon-vessel'
	},
	config:{
		authCode:'700',
		popupSelectionMode:false,
		toHideFields:[],
		callbackOnSelect:null
	},
	dockedItems:[{
		xtype:'toolbar',
		items:[{
				xtype:'searchtextfield',
				name: 'ALL',
	        	emptyText: 'Hull/Name...'
			}, {
				xtype:'datacombo',
				fieldLabel:'',
				name:'state',
				width:_LIST.queryFieldWidth,
				comboData:_DATA.stateVessel,
				emptyText:'Status'	       
			}, {
				xtype:'kjerptag',
				fieldLabel:'',
				name:'tag',
				emptyText:'Tag'	 		        	
			}, {
				xtype:'button',tooltip:_TOOLBAR.tooltip.select,  text:_TOOLBAR.label.search, action:'search', glyph:_GLYPH.toolbar.search
			}, {
				xtype:'button',tooltip:_TOOLBAR.tooltip.excel,  text:_TOOLBAR.label.excel, action:'excel', glyph:_GLYPH.toolbar.excel
			}, { 
				xtype:'tbspacer', flex:1 
			}, {
				xtype:'button',tooltip:_TOOLBAR.tooltip.copy,   text:_TOOLBAR.label.copy, action:'copy', glyph:_GLYPH.toolbar.copy, disabled:false
			},{
				xtype:'tbseparator'
			},{
				xtype:'button',tooltip:_TOOLBAR.tooltip.add,  text:_TOOLBAR.label.add, action:'add', glyph:_GLYPH.toolbar.add, disabled:false
			},{
				xtype:'button',tooltip:_TOOLBAR.tooltip.edit,  text:_TOOLBAR.label.edit, action:'edit', glyph:_GLYPH.toolbar.edit, disabled:true
			},{
				xtype:'button',tooltip:_TOOLBAR.tooltip.view,  text:_TOOLBAR.label.view, action:'view', glyph:_GLYPH.toolbar.view, disabled:true, hidden:true
			}, {
				xtype:'button',tooltip:_TOOLBAR.tooltip.del,  text:_TOOLBAR.label.del, action:'del', glyph:_GLYPH.toolbar.del, disabled:true
			}, {
				xtype:'button',tooltip:_TOOLBAR.tooltip.select,  text:_TOOLBAR.label.select, action:'select', glyph:_GLYPH.toolbar.add, hidden:true, disabled:false
        }]
	}],
    features:[{
    	id:'summary',
        ftype:'summary',
        dock:'bottom',
        name:'summary'
    }],
	//선택 팝업
    enableSelectionMode:function(selectedMode) {
    	var me = this;
    	
    	me.down('button[action=add]').setHidden(selectedMode);
    	me.down('button[action=excel]').setHidden(selectedMode);
    	me.down('button[action=del]').setHidden(selectedMode);
		me.down('button[action=edit]').setHidden(selectedMode);
		me.down('button[action=view]').setHidden(selectedMode);
		me.down('button[action=select]').setHidden(!selectedMode);
		
		//선택 팝업의 경우 숨길 필드 지정 
		if (selectedMode) {
			var toHideFields = me.getToHideFields();
			for(i=0;i<toHideFields.length;i++){
				me.down('[dataIndex='+toHideFields[i]+']').setHidden(selectedMode);
			}
		} else {
			
		}
    },

	selType: 'checkboxmodel',
	
	initComponent:function() {
		var me = this,
			popupSelectionMode = me.getPopupSelectionMode();
		
		me.store = new Ext.data.Store({
            model:'KJERP.model.Vessel',
            remoteSort: false,
            pageSize: _GRID.pageRow,
            proxy: _AJAX.proxy
        });		
        me.header = popupSelectionMode?false:me.header;	// hide title if popup
		me.columns = [
		{
			text:'HULL',
			dataIndex:'HullCode',
			width:100,
			summaryType: 'count',
			summaryRenderer: function(value, summaryData, dataIndex) {
	           return Ext.String.format('Total: {0}', value);
	        }				
		}, {
			text:'Shipyard',
			dataIndex:'yardCompanyName',
			width:100		
		}, {
			text:'Vessel Name',
			dataIndex:'HullName',
			renderer:_RENDER.textNull,
			width:140	
		}, {
			text:'Owner',
			dataIndex:'ownerCompanyName',
			width:120	
		}, {
			text:'Class',
			dataIndex:'Class',
			width:80
		}, {
			text:'Series',
			dataIndex:'ProjectOrSeries',
			width:100			
		}, {
			text:'JRC No.',
			dataIndex:'JrcSalesNo',
			width:120	
		}, {
			text:'Tag',
			dataIndex:'tag',
			width:200				
		}, {
			text:'Flag',
			dataIndex:'Flag',
			width:100
		}, {
			text:'MMSI',
			dataIndex:'MMSI',
			width:120	
		}, {
			text:'IMO',
			dataIndex:'ImoNo',
			width:100		
		}, {
			text:'Status',
			dataIndex:'state',
			renderer:_RENDER.stateVessel,
			width:100				
		}, {
			xtype:'actioncolumn',
		 	width: 60,		 	
		 	hidden:_GRID.actionMenuHidden,
		 	align:'center',
		    sortable: false,
		    text:_GRID.label.action,
		    menuDisabled: true,
		    items: [{
		       glyph:_GLYPH.toolbar.edit,
		        iconCls:'action_icon',
		        tooltip: _GRID.label.tipEdit,
		        scope: this,
		        handler: function(grid, rowIndex, colIndex) {				        	
		       		_DEBUG.log('action edit!!');
		       		grid.setSelection(rowIndex);
		       		KJERP.controller.Main.shortWindowMenu(grid,'edit');			       		
				}
		    }, {
		        icon: _ICON.toolbar.del,
		        iconCls:'action_icon',
		        tooltip: _GRID.label.tipDel,
		        scope: this,
		        handler: function(grid, rowIndex, colIndex) {
		        	_DEBUG.log('action delete!!');
		        	grid.setSelection(rowIndex);
		       		KJERP.controller.Main.shortWindowMenu(grid,'del');
			        	
				}		    	
		    }] 						
		}];
		me.callParent(arguments);
		me.down('button[action=select]').on(
				'click',
				function() {
					var callback = me.getCallbackOnSelect();
					if (!callback) return;
					callback(me.getSelection());
				},
				me
		);
		me.enableSelectionMode(popupSelectionMode);
	}
});



