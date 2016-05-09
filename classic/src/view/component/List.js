Ext.define('KJERP.view.component.List', {
	extend:'Ext.grid.Panel',
	requires:[
		'Ext.toolbar.Spacer',
		'KJERP.model.Component',
		'Ext.grid.column.Action',
		'Ext.ux.grid.ComponentColumn',
		'Ext.data.proxy.JsonP',
		'Ext.grid.column.RowNumberer',
		'Ext.grid.feature.Summary',
		'Ext.ux.field.SearchCombo',
		'KJERP.view.widget.*'
	],
	xtype:'componentlist',
	emptyText:_GRID.emptyText,
	header:{
		title:'Component Management',
		iconCls:'my-panel-icon-component'
	},
	config:{
		authCode:'500',
		popupSelectionMode:false,
		toHideFields:[],
		callbackOnSelect:null
	},	
	dockedItems:[{
		xtype:'toolbar',
		items:[
			{
				xtype:'hiddenfield',
				name:'isProduct',
				value:'0'	// bring not product company
			},
			{
				xtype:'searchtextfield',
				name: 'ALL',
	        	emptyText: 'Name/Model/Company Name...'
			}, {
				xtype:'datacombo',
				fieldLabel:'',
				name:'state',
				width:_LIST.queryFieldWidth,
				comboData:_DATA.stateComponent,
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
				xtype:'button', text:_TOOLBAR.label.view, action:'view', glyph:_GLYPH.toolbar.view, disabled:true, hidden:true
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
            model:'KJERP.model.Component',
            remoteSort: false,
            pageSize: _GRID.pageRow,
            proxy: _AJAX.proxy
        });		
        me.header = popupSelectionMode?false:me.header;	// hide title if popup
        me.columns = [
		{
			text:'Name',
			dataIndex:'name',
			width:200,
			summaryType: 'count',
			summaryRenderer: function(value, summaryData, dataIndex) {
	           return Ext.String.format('Total: {0}', value);
	        }				
		}, {
			text:'Model',
			dataIndex:'model',
			renderer:_RENDER.infoComponent,
			width:120	
		}, {
			text:'Type',
			dataIndex:'type',
			width:100
		}, {
			text:'Group',
			dataIndex:'compGroupName',
			width:120	
		}, {
			text:'Maker',
			dataIndex:'companySName',
			renderer:_RENDER.companySName,
			width:120
		}, {
			text:'Tag',
			dataIndex:'tag',
			width:200			
		}, {
			text:'Mass',
			dataIndex:'mass',
			width:60			
		}, {
			text:'Color',
			dataIndex:'color',
			width:60			
		}, {
			text:'Volume',
			dataIndex:'volume',
			width:80			
		}, {
			text:'CUR',
			dataIndex:'currency',
			width:50				
		}, {
			text:'Purchase<br/>Price',
			dataIndex:'purchasePrice',
			width:100			
		}, {
			text:'List<br/>Price',
			dataIndex:'listPrice',
			width:100			
		}, {
			text:'Discount<br/>Price',
			dataIndex:'discountPrice',
			width:100			
		}, {
			text:'Unit',
			dataIndex:'unit',
			width:100			
		}, {
			text:'Remark',
			dataIndex:'remark',
			width:200			
		}, {
			text:'Status',
			dataIndex:'state',
			renderer:_RENDER.stateComponent,
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
		me.on('itemclick', function( view, record, item, index, event, eOpts ) {
			if (event.getTarget('a.infoComponent')) {
				event.stopEvent();
				_FUNCTION.showInfoComponent(record.get('componentIdx'));
			}
		});
		me.enableSelectionMode(popupSelectionMode);
	}
});



