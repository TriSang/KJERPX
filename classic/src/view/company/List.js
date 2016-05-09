Ext.define('KJERP.view.company.List', {
	extend:'Ext.grid.Panel',
	requires:[
		'Ext.toolbar.Spacer',
		'KJERP.model.Company',
		'Ext.grid.column.Action',
		'Ext.ux.grid.ComponentColumn',
		'Ext.data.proxy.JsonP',
		'Ext.grid.column.RowNumberer',
		'Ext.grid.feature.Summary',
		'Ext.ux.field.SearchCombo',
		'KJERP.view.widget.*'
	],
	xtype:'companylist',
	emptyText:_GRID.emptyText,
	header:{
		title:'Company Management',
		iconCls:'my-panel-icon-company'
	},
	config:{
		authCode:'300',
		popupSelectionMode:false,
		toHideFields:[],
		callbackOnSelect:null		
	},
	dockedItems:[{
		xtype:'toolbar',
		items:[{
				xtype:'searchtextfield',
				name: 'ALL',
				
	        	emptyText: 'Name/CEO Name ...'
			}, {
				xtype:'categorycombo',
				fieldLabel:'',
				name:'category',
				emptyText:'Category',
				width:_LIST.queryFieldWidth,
				queryFilters:[{property:'categoryType', value:'CP'}]	// Company Category		
			}, {
				xtype:'datacombo',
				fieldLabel:'',
				name:'state',
				width:_LIST.queryFieldWidth,
				comboData:_DATA.stateCompany,
				width:_LIST.queryFieldWidth,
				emptyText:'Status'	       
			}, {
				xtype:'kjerptag',
				fieldLabel:'',
				name:'tag',
				emptyText:'Tag'	 				
			}, {
				xtype:'button', text:_TOOLBAR.label.search, action:'search', glyph:_GLYPH.toolbar.search
			}, {
				xtype:'button', text:_TOOLBAR.label.excel, action:'excel', glyph:_GLYPH.toolbar.excel
			}, { 
				xtype:'tbspacer', flex:1 
			}, {
				xtype:'tbseparator'
			},{
				xtype:'button', text:_TOOLBAR.label.add, action:'add', glyph:_GLYPH.toolbar.add, disabled:false
			},{
				xtype:'button', text:_TOOLBAR.label.edit, action:'edit', glyph:_GLYPH.toolbar.edit, disabled:true
			},{
				xtype:'button', text:_TOOLBAR.label.view, action:'view', glyph:_GLYPH.toolbar.view, hidden:false, disabled:true
			}, {
				xtype:'button', text:_TOOLBAR.label.del, action:'del', glyph:_GLYPH.toolbar.del, disabled:true
			}, {
				xtype:'button', text:_TOOLBAR.label.select, action:'select', glyph:_GLYPH.toolbar.add, hidden:true, disabled:false
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
		
		//선택 팝업의 경우 숨길 필드 지정 
		var toHideFields = [];
		for(i=0;i<fields.length;i++){
			this.down('[dataIndex='+toHideFields[i]+']').setHidden(selectedMode);
		}
    },

	selType: 'checkboxmodel',
	
	initComponent:function() {
		var me = this;		
		me.store = new Ext.data.Store({
            model:'KJERP.model.Company',
            remoteSort: false,
            pageSize: _GRID.pageRow,
            proxy: _AJAX.proxy
        });		
       // me.store = store;
		me.columns = [
		{
			text:'Name',
			dataIndex:'companyName',
			width:140,
			summaryType: 'count',
			summaryRenderer: function(value, summaryData, dataIndex) {
	           return Ext.String.format('Total: {0}', value);
	        }			
		}, {
			text:'Shorten',
			dataIndex:'companySName',
			width:120	
		}, {
			text:'CEO',
			dataIndex:'ceoName',
			width:100	
		}, {
			text:'Tag',
			dataIndex:'tag',
			width:200	
		}, {
			text:'Register No.',
			dataIndex:'registerNo',
			width:100
		}, {
			text:'Country',
			dataIndex:'country',
			width:100	
		}, {
			text:'Postal',
			dataIndex:'postCode',
			width:100
		}, {
			text:'DHL/Fedex',
			dataIndex:'dhlCode',
			width:100
		}, {
			text:'Address',
			dataIndex:'address',
			width:150
		}, {
			text:'E-Mail',
			dataIndex:'email',
			width:100
		}, {
			text:'Tel.',
			dataIndex:'tel',
			width:100
		}, {
			text:'Fax.',
			dataIndex:'fax',
			width:100			
		}, {
			text:'SNS',
			dataIndex:'social',
			width:100	
		}, {
			text:'Status',
			dataIndex:'state',
			renderer:_RENDER.stateCompany,
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
		me.callParent(arguments); //initCompany 부모의 실행한다. 		
	}
});



