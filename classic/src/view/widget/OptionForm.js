Ext.define('KJERP.view.widget.OptionForm', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'optionform',
	requires:[
		'Ext.form.Panel',
		'Ext.form.FieldContainer',
		'Ext.form.field.Checkbox',
		'Ext.form.field.ComboBox',
		'Ext.form.field.Radio',
		'Ext.form.field.Number',
		'Ext.form.FieldSet',
		'Ext.form.field.Hidden',
		'Ext.ux.editor.ExTextField',
		'KJERP.view.widget.FormToolbar',
		'Ext.layout.container.Table',
		'Ext.ux.field.ExFileField',
		'KJERP.view.widget.AddressField',
		'KJERP.view.widget.CompanyComboBox',
		'KJERP.view.widget.DataComboBox'
	],
	title:'Option',
	scrollable:true,
	layout:{
		type:'hbox',
		vertical:true,
		align: _FORM.align
	},
	authCode:'400',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-option',
 		toHideTools:['save', 'del', 'close']
 	},
 	items:[{
		xtype:'container',
		name:'formcontainer',
		padding:_FORM.padding,
		layout:'column',
	    defaults:{
	    	xtype:'checkbox',
	    	allowBlank:true,
	    	columnWidth:0.5,
			minWidth:_FORM.fieldWidth,
			labelWidth:_FORM.labelWidth*2,
			margin:_FORM.fieldMargin
	    },	
		items:[{		
			fieldLabel:'Close form after save action',
			name:'closeFormAfterSave',
			inputValue:true,
			uncheckedValue:false
		},{
			fieldLabel:'Show message box after component selection',
			name:'showMessageAfterAddComponent',
			inputValue:true,
			uncheckedValue:false
		},{
			fieldLabel:'Remove component after component selection',
			name:'removeCompoentAfterAddComponent',
			inputValue:true,
			uncheckedValue:false	
		},{
			fieldLabel:'Select componet from popup window',
			name:'selectComponentFromWindow',
			inputValue:true,
			uncheckedValue:false					
		},{
			fieldLabel:'Show message box from KJERP service',
			name:'showMessageFromService',
			inputValue:true,
			uncheckedValue:false					
		}]
	}],
	listeners:{
		scope:this,
		activate:function(form) {
			var record = form.getRecord();
			var isEditMode = record!=null;
			var isReserved = false;		// 수정이 금지된 경우
		}
	},
	initComponent:function() {
		var me = this;
		me.callParent(arguments);
	}
});