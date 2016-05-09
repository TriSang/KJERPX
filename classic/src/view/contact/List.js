Ext.define('KJERP.view.contact.List', {
	extend:'Ext.grid.Panel',
	requires:[
		'Ext.toolbar.Spacer',
		'KJERP.model.Contact',
		'Ext.grid.column.Action',
		'Ext.ux.grid.ComponentColumn',
		'Ext.data.proxy.JsonP',
		'Ext.grid.column.RowNumberer',
		'Ext.grid.feature.Summary',
		'Ext.ux.field.SearchCombo',
		'KJERP.view.widget.CompanyComboBox',
		'KJERP.view.widget.DataComboBox'
	],
	xtype:'contactlist',
	emptyText:_GRID.emptyText,
	header:{
		title:'Contact Management',
		iconCls:'my-panel-icon-contact'
	},
	config:{
		authCode:'400',
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
			},{
				xtype:'searchtextfield',
				name: 'ALL',
	        	emptyText: 'Name/Dept/Position/CompanyName...'
//			}, {
//				xtype:'datacombo',
//				fieldLabel:'',
//				name:'state',
//				comboData:_DATA.stateComponent,
//				emptyText:'Status'
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
            model:'KJERP.model.Contact',
            remoteSort: false,
            pageSize: _GRID.pageRow,
            proxy: _AJAX.proxy
        });		
        me.header = popupSelectionMode?false:me.header;	// hide title if popup
		me.columns = [
		{
			text:'Name',
			dataIndex:'contactName',
			width:120,
			summaryType: 'count',
			summaryRenderer: function(value, summaryData, dataIndex) {
	           return Ext.String.format('Total: {0}', value);
	        }				
		}, {
			text:'Company',
			dataIndex:'companyName',
			width:100	
		}, {
			text:'Dept.',
			dataIndex:'dept',
			width:80
		}, {
			text:'Position',
			dataIndex:'position',
			width:80	
		}, {
			text:'Phone',
			dataIndex:'tel',
			width:120
		}, {
			text:'Mobile',
			dataIndex:'mobile',
			width:120
		}, {
			text:'E-Mail',
			dataIndex:'email',
			width:120
		}, {
			text:'SNS',
			dataIndex:'sns',
			width:120
		}, {
			text:'Remark',
			dataIndex:'remark',
			width:150			
		}, {
			text:'Status',
			dataIndex:'state',
			width:80,
			renderer:_RENDER.stateContact
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



