Ext.define('KJERP.view.auth.Roles', {
	extend:'Ext.grid.Panel',
	requires:[
		'Ext.toolbar.Spacer',
		'KJERP.model.AuthRole',
		'Ext.grid.column.Action',
		'Ext.ux.grid.ComponentColumn',
		'Ext.data.proxy.JsonP',
		'Ext.grid.column.RowNumberer',
		'Ext.grid.feature.Summary',
		'Ext.ux.field.SearchCombo',
		'Ext.grid.plugin.CellEditing',
		'KJERP.view.widget.DataComboBox',
		'KJERP.view.widget.Tag'
	],
	xtype:'authroles',
	emptyText:_GRID.emptyText,
	header:false,
	style:_GRID.borderStyle,
	sortableColumns:false,
	
	config:{
		authCode:'930'
	},
	dockedItems:[{
		xtype:'toolbar',
		items:[
			{
				xtype:'label',
				action:'count',
				text:'Roles'
			}, {
				xtype:'tbspacer', flex:1 
			},{
				xtype:'button', text:_TOOLBAR.label.add, action:'add', glyph:_GLYPH.toolbar.add,  disabled:false
        }]
	}],
	//선택 팝업
    enableSelectionMode:function(selectedMode) {
    	if (!selectedMode) selectedMode = true;
    
		this.down('button[action=add]').setHidden(selectedMode);
		
		//선택 팝업의 경우 숨길 필드 지정 
		var toHideFields = [];
		for(i=0;i<fields.length;i++){
			this.down('[dataIndex='+toHideFields[i]+']').setHidden(selectedMode);
		}
    },

	selType: 'checkboxmodel',
	plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
	initComponent:function() {
		var me = this;		
		this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
		
		me.store = new Ext.data.Store({
            model:'KJERP.model.AuthRole'
        });		
		me.columns = [{
			text:'No',
			xtype: 'rownumberer',
			width:40,
			align:'center'
		}, {			
			text:'Name',
			dataIndex:'name',
			width:200,
			editor:{				
				allowBlank:true
			},	
			summaryType: 'count',
			summaryRenderer: function(value, summaryData, dataIndex) {
	           return Ext.String.format('Total: {0}', value);
	        }				
		}, {
			text:'code',
			dataIndex:'code',
			editor:{				
				allowBlank:true
			},	
			width:120	
		}, {
			text:'Read',
			dataIndex:'read',
			renderer:_RENDER.role,
			editor:{				
				xtype:'datacombo',				
				comboData:_DATA.role
			},	
			width:100				
		}, {
			text:'Write',
			dataIndex:'write',
			renderer:_RENDER.role,
			editor:{				
				xtype:'datacombo',				
				comboData:_DATA.role
			},	
			width:100	
		}, {
			text:'Exec',
			dataIndex:'exec',
			renderer:_RENDER.role,
			editor:{			
				xtype:'datacombo',				
				comboData:_DATA.role
			},	
			width:100	
		}, {
			text:'Status',
			dataIndex:'state',
			renderer:_RENDER.stateAuth,
			editor:{			
				xtype:'datacombo',				
				comboData:_DATA.stateAuth
			},
			width:100			
		}, {
			text:'Remark',
			dataIndex: 'remark',
			editor:{				
				allowBlank:true
			},	
            flex:1
		}];
		
		me.callParent(arguments); //initAuth 부모의 실행한다. 
		
		var countLabel = me.down('label[action=count]');
		me.store.on('datachanged', function(store) {
			countLabel.setText('Roles ('+store.getCount()+')');
		});
				
	}
});