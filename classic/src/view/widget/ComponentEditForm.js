Ext.define('KJERP.view.widget.ComponentEditForm', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'componenteditform',
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
		'KJERP.view.widget.Tag',
		'KJERP.view.widget.DataComboBox',
		'KJERP.view.widget.ImageGallery',
		'KJERP.view.widget.ComponentTreeGroupField'		
	],
	title:'Component',
	scrollable:true,
	layout:{
		type:'vbox',
		vertical:true,
		align: _FORM.align
	},
	config:{
  //  	toHideFields:[],
    	callbackOnSelect:null
    },
	//authCode:'500', 	
	dockedItems:[{ 
		xtype:'tbspacer', flex:1 
	},{
		xtype:'button', text:_TOOLBAR.label.edit, action:'edit', glyph:_GLYPH.toolbar.edit,  disabled:false
    }], 	
 	
	items:[{
		xtype:'container',
		padding:_FORM.padding,
		layout:'column',
	    defaults:{
	    	xtype:'textfield',
	    	allowBlank:true,
	    	columnWidth:0.5,
			minWidth:_FORM.fieldWidth,
			labelWidth:_FORM.labelWidth,
			margin:_FORM.fieldMargin
	    },			    
		items:[{		
			// start row		
			fieldLabel:'Name',
			name:'name',
			emptyText:'name of component',
			allowBlank:false,
			readOnly:true
		},{
	      	fieldLabel:'Model',
			name:'model',
			emptyText:'model number',
			allowBlank:false,
			readOnly:true
		},{
		// end row	
	
		
	      	fieldLabel:'Type',
			name:'type',
			emptyText:'type information',
			allowBlank:true,
			readOnly:true
		},{
		// end row	
										
			xtype:'kjerptag',
			allowBlank:true
		},{
			
		// end row
			xtype:'numberfield',
			fieldLabel:'Unit Price',
			name:'unitPrice',
			fieldStyle: 'text-align:right;',
			emptyText:'Unit price',						
			allowBlank:true
		},{
			// end row
			xtype:'numberfield',
			fieldLabel:'QTY',
			name:'qty',
			fieldStyle: 'text-align:right;',
			emptyText:'Qty',							
			allowBlank:true
		},{	
			// end row
			xtype:'numberfield',
			fieldLabel:'Price',
			name:'price',
			fieldStyle: 'text-align:right;',
			emptyText:'Price',								
			allowBlank:true
		},{
			// end row
			xtype:'numberfield',
			fieldLabel:'Tax',
			name:'tax',
			fieldStyle: 'text-align:right;',
			emptyText:'Tax',				
			allowBlank:true
			
		},{	
			// end row
			xtype:'numberfield',
			fieldLabel:'Total',
			name:'total',
			fieldStyle: 'text-align:right;',
			emptyText:'total',
			allowBlank:true				
		},{	
			xtype:'extextfield',
			fieldLabel:'Interface In..',
			name:'InterIn',
			emptyText:'Type Interface In',
			columnWidth:1.0,
			margin:'5 10 0 0',
			allowBlank:true
		},{
			xtype:'extextfield',
			fieldLabel:'Interface Out..',
			name:'InterOut',
			emptyText:'Type Interface Out',
			columnWidth:1.0,
			margin:'5 10 0 0',
			allowBlank:true
		},{			
			fieldLabel:'Remark',
			xtype:'extextfield',
			name:'remark',
			columnWidth:1.0,
			margin:'5 10 0 0',
			allowBlank:true
		},{
		// end row
			
		// start hidden field	
			xtype:'hiddenfield',
			name:'componentIdx',
			value:0
		},{
			xtype:'hiddenfield',
			name:'isProduct',
			value:0
		},{
	      	xtype:'hiddenfield',
			name:'RDATE'
		},{
	      	xtype:'hiddenfield',
			name:'RUSER'
		},{
	      	xtype:'hiddenfield',
			name:'EDATE'
		},{
	      	xtype:'hiddenfield',
			name:'EUSER'
		// end hidden field		
		}]
 	
	}],
	setRowValue:function(record){		
		var me = this;
		me.loadRecord(record);
	},	
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
				
		/*
		me.down('button[action=edit]').on(
				'click',
				function() {
					var callback = me.getCallbackOnSelect();
					if (!callback) return;
					callback(me.getRecord());
				},
				me
		);
		*/
		me.callParent(arguments);
	}
});