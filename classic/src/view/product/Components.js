Ext.define('KJERP.view.product.Components', {
	extend:'Ext.grid.Panel',
	requires:[
		'Ext.toolbar.Spacer',
		'KJERP.model.ProductComponent',
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
	xtype:'productcomponents',
	emptyText:_GRID.emptyText,
	header:false,
	style:_GRID.borderStyle,
	sortableColumns:false,
	viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            dragText: 'Drag and drop to reorganize',
            enableDrag:true,
            enableDrop:true
        }
    },
	config:{
		authCode:'600'
	},
	dockedItems:[{
		xtype:'toolbar',
		items:[
			{
				xtype:'label',
				action:'count',
				text:'Components'
			}, {
				xtype:'tbspacer', flex:1 
			},{
				xtype:'button', text:_TOOLBAR.label.add, action:'add', glyph:_GLYPH.toolbar.add, disabled:false
			},{
				xtype:'button', text:_TOOLBAR.label.edit, action:'edit', glyph:_GLYPH.toolbar.edit, disabled:true, hidden:true
			},{
				xtype:'button', text:_TOOLBAR.label.view, action:'view', glyph:_GLYPH.toolbar.view, disabled:true, hidden:true
			}, {
				xtype:'button', text:_TOOLBAR.label.del, action:'del', glyph:_GLYPH.toolbar.del, disabled:true
        }]
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
	plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
	initComponent:function() {
		var me = this;		
		this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
		
		me.store = new Ext.data.Store({
            model:'KJERP.model.ProductComponent'
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
			renderer:_RENDER.infoComponent,			
			summaryType: 'count',
			summaryRenderer: function(value, summaryData, dataIndex) {
	           return Ext.String.format('Total: {0}', value);
	        }				
		}, {
			text:'Model',
			dataIndex:'model',
			width:120	
		}, {
			text:'Maker',
			dataIndex:'companySName',
			renderer:_RENDER.companySName,
			width:120				
		}, {
			text:'Type',
			dataIndex:'type',
			width:120	
		}, {
			text:'Qty',
			dataIndex:'qty',
			width:80,
			align:'center',			
			editor:{
				xtype:'numberfield',
				allowBlank:false
			}
		}, {
			text:'Unit',
			dataIndex:'unit',
			width:80
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
			text:'Tag',
			dataIndex:'tag',
			width:200,
			editor:{
				xtype:'kjerptag',
				fieldLabel:'',
				allowBlank:true
			}	
		}, {
			text:'Remark',
			dataIndex: 'remark',
            width: 300,
            editor:{				
				allowBlank:false
			}
		}];
		
		me.callParent(arguments); //initProduct 부모의 실행한다. 
		
		me.on('itemclick', function( view, record, item, index, event, eOpts ) {
			if (event.getTarget('a.infoComponent')) {
				event.stopEvent();
				_FUNCTION.showInfoComponent(record.get('componentIdx'));
			}
		});
		
		var countLabel = me.down('label[action=count]');
		me.store.on('datachanged', function(store) {
			countLabel.setText('Components ('+store.getCount()+')');
		});
		me.on('drop',function(node, data, overModel, dropPosition, eOpts) {
			me.getView().refresh(); // renew order number
		});		
	}
});