Ext.define('KJERP.view.quotation.List', {
	extend:'Ext.grid.Panel',
	requires:[
		'Ext.toolbar.Spacer',
		'KJERP.model.Quotation',
		'Ext.grid.column.Action',
		'Ext.ux.grid.ComponentColumn',
		'Ext.data.proxy.JsonP',
		'Ext.grid.column.RowNumberer',
		'Ext.grid.feature.Summary',
		'Ext.ux.field.SearchCombo',
		'KJERP.view.widget.*'
	],
	xtype:'quotationlist',
	emptyText:_GRID.emptyText,
	header:{
		title:'Quotation Management',
		iconCls:'my-panel-icon-quotation'
	},
	config:{
		authCode:'810',
		popupSelectionMode:false,
		toHideFields:[],
		toHideColumns:[],
		callbackOnSelect:null		
	},
	dockedItems:[{
		xtype:'toolbar',
		items:[{
				xtype:'searchtextfield',
				name: 'ALL',
	        	emptyText: 'Title/HullCode/HullName/CompanyName...'
			}, {
				xtype:'datacombo',
				fieldLabel:'',
				name:'state',
				width:_LIST.queryFieldWidth,
				comboData:_DATA.stateQuotation,
				emptyText:'Status'	       
			}, {
				xtype:'kjerptag',
				fieldLabel:'',
				name:'tag',
				emptyText:'Tag'	 			
			}, {
				xtype:'button', tooltip:_TOOLBAR.tooltip.search, text:_TOOLBAR.label.search, action:'search', glyph:_GLYPH.toolbar.search
			}, {
				xtype:'button', tooltip:_TOOLBAR.tooltip.excel, text:_TOOLBAR.label.excel, action:'excel', glyph:_GLYPH.toolbar.excel
			}, { 
				xtype:'tbspacer', flex:1 
			},{
				xtype:'button', tooltip:_TOOLBAR.tooltip.toEquipment, text:_TOOLBAR.label.toEquipment, action:'toEquipment', glyph:_GLYPH.toolbar.transfer, disabled:false
			},{
				xtype:'button', tooltip:_TOOLBAR.tooltip.quotationToContract, text:_TOOLBAR.label.quotationToContract, action:'transfer', glyph:_GLYPH.toolbar.transfer, disabled:false
			},{
				xtype:'button', tooltip:_TOOLBAR.tooltip.copy, text:_TOOLBAR.label.copy, action:'copy', glyph:_GLYPH.toolbar.copy, disabled:false
			}, {
				xtype:'tbseparator'
			},{
				xtype:'button', tooltip:_TOOLBAR.tooltip.add, text:_TOOLBAR.label.add, action:'add', glyph:_GLYPH.toolbar.add, disabled:false
			},{
				xtype:'button', tooltip:_TOOLBAR.tooltip.edit, text:_TOOLBAR.label.edit, action:'edit', glyph:_GLYPH.toolbar.edit, disabled:true
			},{
				xtype:'button', tooltip:_TOOLBAR.tooltip.view, text:_TOOLBAR.label.view, action:'view', glyph:_GLYPH.toolbar.view, hidden:true, disabled:true
			}, {
				xtype:'button', tooltip:_TOOLBAR.tooltip.del, text:_TOOLBAR.label.del, action:'del', glyph:_GLYPH.toolbar.del, disabled:true
			}, {
				xtype:'button', tooltip:_TOOLBAR.tooltip.select, text:_TOOLBAR.label.select, action:'select', glyph:_GLYPH.toolbar.add, hidden:true, disabled:false
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
    	if (!selectedMode) selectedMode = true;
    	
		this.down('button[action=add]').setHidden(selectedMode);
		this.down('button[action=excel]').setHidden(selectedMode);
		this.down('button[action=del]').setHidden(selectedMode);
		this.down('button[action=edit]').setHidden(selectedMode);
		this.down('button[action=select]').setHidden(!selectedMode);
		
		this.down('button[action=copy]').setHidden(!selectedMode);
		this.down('button[action=transfer]').setHidden(!selectedMode);
    },

	selType: 'checkboxmodel',
	initComponent:function() {
		var me = this;		
		me.store = new Ext.data.Store({
            model:'KJERP.model.Quotation',
            remoteSort: false,
            pageSize: _GRID.pageRow,
            proxy: _AJAX.proxy          
        });		
		me.columns = [
		{
			text:'Title',
			dataIndex:'title',
			width:120,
			summaryType: 'count',
			summaryRenderer: function(value, summaryData, dataIndex) {
	           return Ext.String.format('Total: {0}', value);
	        }
		}, {
			text:'Vessel',
			dataIndex:'vesselIdx',
			renderer:_RENDER.vesselName,
			width:100		  
		}, {
			text:'Contract',
			dataIndex:'contractIdx',
			renderer:_RENDER.showLinkedApp,
			align:'center',
			width:80		  
		}, {
			text:'Vessel<br/>Category',
			dataIndex:'saleCategory',
			renderer:_RENDER.saleCategory			
		}, {
			text:'Doc No.',
			dataIndex:'docNo',
			hidden:true,
			width:100		 			
		}, {
			text:'F.Company',
			dataIndex:'fromCompanySName',
			renderer:_RENDER.companySName,
			width:100	
		}, {
			text:'T.Company',
			dataIndex:'toCompanySName',
			renderer:_RENDER.companySName,
			width:100		    
		}, {
			text:'Tag',
			dataIndex:'tag',
			width:200					
		}, {
			text:'CUR',
			dataIndex:'currency',
			width:50		    
		}, {
			text:'Total',
			dataIndex:'total',
			align:'right',
			renderer:_RENDER.toMoneyWithDecimal,
			width:100	
		}, {
			text:'Payment',
			dataIndex:'payment',
			width:100	
		}, {
			text:'Delivery',
			dataIndex:'delivery',
			width:100				
		}, {
			text:'Status',
			dataIndex:'state',
			renderer:_RENDER.stateQuotation,
			width:100
		}, {
			text:'Remark',
			dataIndex:'remark',
			width:100
		}, {
			text:'Edited',
			dataIndex:'eDate',
			renderer:_RENDER.dateYmd,
			width:90	
		}, {
			text:'Editor',
			dataIndex:'eUser',
			width:80	
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
		me.callParent(arguments); //initQuotation 부모의 실행한다. 		
		
		var items = me.getToHideColumns();
		for(i=0;i<items.length;i++){
			this.down('[dataIndex='+items[i]+']').setHidden(true);
		}
	}
});



