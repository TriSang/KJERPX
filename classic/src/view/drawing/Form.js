Ext.define('KJERP.view.drawing.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'drawingform',
	requires:[
		'Ext.form.Panel',
		'Ext.form.FieldContainer',
		'Ext.form.field.Checkbox',
		'Ext.form.field.ComboBox',
		'Ext.form.field.Radio',
		'Ext.form.field.Number',
		'Ext.form.FieldSet',
		'Ext.form.field.Hidden',
		'Ext.form.field.TextArea',
		'KJERP.view.widget.FormToolbar',
		'Ext.layout.container.Table',
		'KJERP.view.widget.CategoryComboBox',
		'KJERP.view.widget.FileComboBox',
		'KJERP.view.widget.ContactField'
	],
	title:'Drawing',
	scrollable:true,
	layout:'fit',
	authCode:'820',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-drawing'
 	},
 	config:{
 		equipmentDrawingItem:null,
 		equipmentItemRecord:null
 	},
	items:[{
		xtype:'container',
		name:'formcontainer',
		padding:_FORM.padding,
		layout: {
	        type: 'vbox',
        	align: 'stretch'
	    },			
		items:[{
			xtype:'container',
			margin:'0 0 10 0',
			layout:{
				type:'hbox',
				align:'middle'
			},
			items:[{
				// hidden field start
				xtype:'hiddenfield',
				name:'category'
			},{
				xtype:'hiddenfield',
				name:'equipmentItemIdx'
				// hidden field end
			},{
				// start row		
				xtype:'datacombo',
				labelAlign:'top',
				labelWidth:_FORM.labelWidth,
				comboData:_DATA.stateDrawing,
				name:'state',
				fieldLabel:'Status',
				flex:1,
				value:0
			},{
				xtype:'component', width:10									
			},{
				xtype:'datefield',
				labelAlign:'top',
				labelWidth:_FORM.labelWidth,
				fieldLabel:'Date',
				name:'date',
				emptyText:'Updated Date',
				flex:1,
				value: new Date(),	// later change it for 1 month...
				format: 'Y-m-d'
				//end row
			}]			
			// start row		
		},{	
			xtype:'container',
			margin:'0 0 10 0',
			layout:{
				type:'hbox',
				align:'middle'
			},
			items:[{
				xtype: 'filecombo',
				labelAlign:'top',
				labelWidth:_FORM.labelWidth,
				name:'file',
				flex:1
			},{
				xtype:'component', width:10				
			},{
				xtype:'contactfield',
				labelAlign:'top',
				labelWidth:_FORM.labelWidth,
				fieldLabel:'Designer',
				flex:1,
				emptyText:'Drawing Worker',
				name:'user'
			}]
			//end row
		},{		
//			xtype:'ckeditor', CKEDITOR 버그
			xtype:'textarea',
			labelAlign:'top',
			labelWidth:_FORM.labelWidth,
			name:'comment',
			fieldLabel: 'Comment',
			width:_FORM.fieldXWidth,
			flex:1
		}]
	}],
	applyEquipmentDrawingItem:function(newRecord) {
		var me = this;
		_FUNCTION.resetStoreAtForm(me);
		if (!newRecord) return;
		
		if (!newRecord.get('data')) {
			newRecord.set('date', new Date());
		}
		me.loadRecord(newRecord);
		var filecombo = me.down('filecombo');
		filecombo.setAppCategory(newRecord.get('category'));
		filecombo.setAppIdx(newRecord.get('equipmentItemIdx'));
		
		return newRecord;
	},
	listeners:{
		scope:this,
		activate:function(form) {
			var record = form.getRecord();
			var isEditMode = record!=null;
			var isReserved = false;		// 수정이 금지된 경우
		}
	}
});