Ext.define('KJERP.view.shipping.Products', {
	extend: 'Ext.tree.Panel',
	requires:[
		'Ext.toolbar.Spacer',
		'KJERP.model.ShippingItem',
		'Ext.grid.column.Action',
		'Ext.ux.grid.ComponentColumn',
		'Ext.data.proxy.JsonP',
		'Ext.grid.column.RowNumberer',
		'Ext.grid.feature.Summary',
		'Ext.ux.field.SearchCombo',
		'Ext.grid.plugin.CellEditing',
        'Ext.data.*',
        'Ext.tree.*'		
	],
	xtype:'shippingproducts',
	title:'Products',
	header:false,
	style:_GRID.borderStyle,
	useArrows: true,
	rootVisible: false,
	multiSelect: false,
	singleExpand: false,		
	layout : 'fit',
	config:{
		authCode:'830'
	},
	viewConfig: {
        plugins: {
			ptype: 'treeviewdragdrop',
            containerScroll: true,
            dragText: 'Drag and drop to reorganize',
            enableDrag:true,
            enableDrop:true
        },
		listeners: {
            nodedragover: _FUNCTION.treeNodeDragOverProduct,
            drop:_FUNCTION.treeNodeDropProduct
		}
    },		
	dockedItems:[{
		xtype:'toolbar',
		items:[{
				xtype:'label',
				action:'count',
				text:'Products (0)'
			}, {
				xtype:'tbspacer', flex:1 
			}, {
				xtype:'button', text:_TOOLBAR.label.refresh, action:'refresh', glyph:_GLYPH.toolbar.refresh, disabled:false, tooltip:_TOOLBAR.tooltip.refresh
			}, {
				xtype:'button', text:_TOOLBAR.label.addEquipment, action:'addVesselProduct', glyph:_GLYPH.toolbar.add, disabled:false,tooltip:_TOOLBAR.tooltip.addEquipment
			},{
				xtype:'button', text:_TOOLBAR.label.addComponent, action:'add', glyph:_GLYPH.toolbar.add, disabled:false, tooltip:_TOOLBAR.tooltip.addComponent
			},{
				xtype:'button', text:_TOOLBAR.label.edit, action:'edit', glyph:_GLYPH.toolbar.edit, disabled:true, hidden:true, tooltip:_TOOLBAR.tooltip.edit
			},{
				xtype:'button', text:_TOOLBAR.label.view, action:'view', glyph:_GLYPH.toolbar.view, disabled:true, hidden:true, tooltip:_TOOLBAR.tooltip.view
			}, {
				xtype:'button', text:_TOOLBAR.label.del, action:'del', glyph:_GLYPH.toolbar.del, disabled:true, tooltip:_TOOLBAR.tooltip.del
			}, {
				xtype:'button', text:_TOOLBAR.label.save, action:'save', icon:_ICON.toolbar.save, disabled:false, hidden:true, tooltip:_TOOLBAR.tooltip.save	
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
	listeners:{
		edit:_FUNCTION.updateGridPriceTaxTotal
	},
	updatePrice:function() {
		var me = this,
			form = me.up('form'),
			store = me.getStore(),
			priceLocked = form.down('[name=priceLocked]');
	
		if (priceLocked.getValue()) return; // if locked, pass modification
		_FUNCTION.updateFormPriceTaxTotal(form, store);
	},
	initComponent:function() {
		var me = this;		
		this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
		
		me.store = new Ext.data.TreeStore({
            model:'KJERP.model.ShippingItem',
            remoteSort: false,
            autoLoad:false,
            autoDestroy:false,
			defaultRootProperty:'rows',
			root: {
                name: 'rows',
                expanded: true
        	},			
			proxy:{
				type:'memory'
			}
        });	
        
        me.columns = [{
			text:'No',
			xtype: 'rownumberer',
			width:40,
			align:'center',
			renderer:_RENDER.treeRowNumber
		}, {        	
			xtype: 'treecolumn',
			text:'Name',
			dataIndex:'name',
			width:200	
		}, {
			text:'Model',
			dataIndex:'model',
			renderer:_RENDER.infoComponent,			
			width:120	
		}, {
			text:'Serial No',
			dataIndex:'serialNo',
			width:150,
			editor: {
                xtype: 'textfield',
                allowBlank: true
            }			
		}, {
			text:'Maker',
			dataIndex:'companySName',
			renderer:_RENDER.companySName,
			hidden:true,
			width:100	
		}, {
			text:'Type',
			dataIndex:'type',
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
		},{			
			text:'Unit Price',
			dataIndex:'unitPrice',
			width:100,
			align:'right',
			editor: {
                xtype: 'numberfield',
                allowBlank: false,
                value: 0
            }
		}, {
			text:'Qty',
			dataIndex:'qty',
			width:60,
			align:'center',
			editor: {
                xtype: 'numberfield',
                name: 'qty',
                allowBlank: false,
                value: 1
            }
		}, {
			text:'Price',
			dataIndex:'price',
			width:100,
			align:'right',
			editor:{
                xtype: 'numberfield',
                allowBlank: false,
                value: 0
			}
		}, {
			text:'Tax',
			dataIndex:'tax',
			width:100,
			align:'right',
			editor: {
                xtype: 'numberfield',
                allowBlank: false,
                value: 0
            }
		}, {
			text:'Total',
			dataIndex:'total',
			width:100,
			align:'right',
			editor: {
                xtype: 'numberfield',
                allowBlank: false,
                value: 0
            }			
		}, {
			text:'Interface In',
			dataIndex:'InterIn',
			editor:{
				xtype:'textarea',
				fieldLabel:'',
				allowBlank:true
			},			
			width:280				
		}, {
			text:'Interface Out',
			dataIndex:'InterOut',
			editor:{
				xtype:'textarea',
				fieldLabel:'',
				allowBlank:true
			},			
			width:280			
		}, {
			text:'Remark',
			dataIndex:'remark',
			editor:{
				xtype:'textarea',
				fieldLabel:'',
				allowBlank:false
			},			
			flex:1					
		}];
		
		me.callParent(arguments); //initProduct 부모의 실행한다. 
		
		var countLabel = me.down('label[action=count]');
		me.store.on('datachanged', function(store) {
			var count = _FUNCTION.getTreeItemCount(store);
			countLabel.setText('Items ('+count+')');
			me.updatePrice();
		});
		me.store.on('update', function(store,record, operation, modifiedFieldNames, details, eOpts ) {
			if (modifiedFieldNames && modifiedFieldNames.length==1 && modifiedFieldNames[0]=='total') {
				me.updatePrice();
			}
		});		
		me.on('itemclick', function( view, record, item, index, event, eOpts ) {
			if (event.getTarget('a.infoComponent')) {
				event.stopEvent();
				_FUNCTION.showInfoComponent(record.get('componentIdx'));
			}
		});				
	}
});