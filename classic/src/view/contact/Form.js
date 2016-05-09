Ext.define('KJERP.view.contact.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'contactform',
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
	title:'Contact',
	scrollable:true,
	layout:{
		type:'hbox',
		vertical:true,
		align: _FORM.align
	},
	authCode:'400',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-contact'
 	},
 	items:[{
		xtype:'container',
		name:'formcontainer',
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
			name:'contactName',
			emptyText:'name of contact',
			allowBlank:false
		},{
			xtype:'companycombo',
			fieldLabel:'Company',
			name:'companyIdx',
			queryFilters:[],	// Maker
			allowBlank:false
		},{
		// end row	
	
		// start row
			fieldLabel:'Dept.',
			name:'dept',
			emptyText:'Working Deparment'
		},{
	      	fieldLabel:'Position',
			name:'position',
			emptyText:'Working position'
		},{
		// end row	
	
		// start row		
			fieldLabel:'Mobile',
			name:'mobile',
			emptyText:'unit information'
		},{
	      	fieldLabel:'Tel.',
			name:'tel',
			emptyText:'grouping information'
		},{
		// end row	
	
		
		// start row		
			fieldLabel:'E-Mail',
			name:'email',
			emptyText:'Email address'
		},{
	      	fieldLabel:'SNS',
			name:'sns',
			emptyText:'Social network service info.'
		},{
		// end row	
	
		// start row		
			xtype: 'filecombo',
			name:'file',
			appCategory:_DATA.appCategory.contact
		},{
			xtype:'datacombo',
			comboData:_DATA.stateContact,
			name:'state',
			fieldLabel:'Status',
			value:0
		},{
		// end row	

		// start row		
			fieldLabel:'Remark',
			xtype:'extextfield',
			name:'remark',
			columnWidth:1.0
		},{
		// end row	
									
		// start hidden field	
			xtype:'hiddenfield',
			name:'contactIdx',
			value:0
		},{
			xtype:'hiddenfield',
			name:'compGroupIDX',
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