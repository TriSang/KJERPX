Ext.define('KJERP.view.company.Contacts', {
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
		'Ext.grid.plugin.CellEditing'
	],
	xtype:'companycontacts',
	emptyText:_GRID.emptyText,
	header:false,
	style:_GRID.borderStyle,
	config:{
		authCode:'300'
	},
	dockedItems:[{
		xtype:'toolbar',
		items:[
			{
				xtype:'label',
				action:'count',
				text:'Contacts'
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
            model:'KJERP.model.Contact'
        });		
		me.columns = [
		{
			text:'Name',
			dataIndex:'contactName',
			width:150,
			editor:{
				allowBlank:false
			},
			summaryType: 'count',
			summaryRenderer: function(value, summaryData, dataIndex) {
	           return Ext.String.format('Total: {0}', value);
	        }				
		}, {
			text:'Department',
			dataIndex:'dept',
			width:120,
			editor:{
				allowBlank:true
			}
		}, {
			text:'Position',
			dataIndex:'position',
			width:120,
			editor:{
				allowBlank:true
			}
		}, {
			text:'Tel.',
			dataIndex:'tel',
			width:120,
			editor:{
				allowBlank:true
			}
		}, {
			text:'Mobile',
			dataIndex:'mobile',
			width:120,
			editor:{
				allowBlank:true
			}
		}, {
			text:'Email',
			dataIndex:'email',
			width:140,
			editor:{
				allowBlank:true
			}
		}, {
			text:'SNS',
			dataIndex:'sns',
			width:120,
			editor:{
				allowBlank:true
			}
		}, {
			text:'Remark',
			dataIndex:'remark',
			width:200,
			editor:{
				allowBlank:true
			}
		}, {
			text:'Status',
			dataIndex: 'state',
            width: 120,
            renderer:_RENDER.stateContact,
            editor: new Ext.form.field.ComboBox({
                 editable:false,
                 triggerAction: 'all',
                 displayField:'text',
                 valueField:'value',
                 store: {
                	 fields:['text','value'],
                	 data:_DATA.stateContact
                 },
                 value:0
             })
		}];
		
		me.callParent(arguments); //initProduct 부모의 실행한다. 
		
		var countLabel = me.down('label[action=count]');
		me.store.on('datachanged', function(store) {
			countLabel.setText('Contacts ('+store.getCount()+')');
		});
	}
});