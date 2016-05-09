Ext.define('KJERP.view.company.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'companyform',
	requires:[
	    'KJERP.view.company.Contacts',
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
		'KJERP.view.widget.AddressField',
		'KJERP.view.widget.CategoryComboBox',
		'KJERP.view.widget.FileComboBox',
		'KJERP.view.widget.Tag'
	],
	title:'Company',
	scrollable:true,
	layout:{
		type:'vbox',
		vertical:true,
		align: _FORM.align
		
	},
	authCode:'300',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-company'
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
			name:'companyName',
			emptyText:'name of company',
			allowBlank:false
		},{
			xtype:'categorycombo',
			fieldLabel:'Category',
			name:'category',
			emptyText:'name..',
			allowBlank:false,
			value:20,	//	default as Maker
			queryFilters:[{property:'categoryType', value:'CP'}]	// Company Category			
		},{
		// end row	
	
		// start row		
	      	fieldLabel:'Shorten Name',
			name:'companySName',
			emptyText:'',
			allowBlank:true
		},{
			fieldLabel:'CEO',
			name:'ceoName',
			emptyText:'Name of CEO',
			allowBlank:true
		},{
		// end row	
	
		// start row		
			xtype:'combo',
			fieldLabel:'Country',
			name:'country',
			editable:false,
			emptyText:'Headquater Location',
			displayField:'CountryByEng',
			valueField:'CountryByEng',
			value:'KOREA, REPUBLIC OF',
			queryMode: 'local',	
			store:'CountryCode',
			allowBlank:true
		},{
	      	fieldLabel:'Registger No.',
			name:'registerNo',
			emptyText:'Registere Number',
			allowBlank:true
		},{
		// end row	

		// start row		
			fieldLabel:'Addresss',
			name:'address',
			emptyText:'',
			allowBlank:true	
		},{
	      	fieldLabel:'Postal Code',
			name:'postCode',
			emptyText:'Postal Code',
			allowBlank:true
		},{
		// end row	

		// start row		
			fieldLabel:'DHL/Fedex',
			name:'dhlCode',
			emptyText:'Type DHL/Fedex',
			allowBlank:true
		},{
	      	fieldLabel:'Email',
			name:'email',
			emptyText:'Email Address',
			allowBlank:true
		},{
		// end row	
			
		// start row		
			fieldLabel:'Tel.',
			name:'tel',
			emptyText:'tyoe Tel',
			allowBlank:true
		},{
	      	fieldLabel:'Fax.',
			name:'fax',
			emptyText:'Shipdex DM Code',
			allowBlank:true
		},{
		// end row	
			
		// start row		
			fieldLabel:'SNS',
			name:'social',
			emptyText:'SNS Information',
			allowBlank:true
		},{
			xtype:'datacombo',
			fieldLabel:'Status',
			name:'state',
			value:0,
			comboData:_DATA.stateCompany
		},{
		// end row	

		// start row		
			xtype: 'filecombo',
			name:'file',
			appCategory:_DATA.appCategory.company,
			fileAppCategorys:[]
		},{
			xtype:'kjerptag',
			allowBlank:true
		},{
			
		// start row		
			fieldLabel:'Remark',
			xtype:'extextfield',
			name:'remark',
			columnWidth:1.0,
			margin:'5 10 10 0' //(top, right, bottom, left).
		},{
		// end row	
										
		// start hidden field	
			xtype:'hiddenfield',
			name:'companyIdx',
			value:0
		},{
			xtype:'hiddenfield',
			name:'contacts',
			type:'json',
			value:[]
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
	},{
		xtype:'companycontacts',
		flex:1
	}],
	listeners:{
		scope:this,
		activate:function(form) {
			var record = form.getRecord();
			var isEditMode = record!=null;
			var isReserved = false;		// 수정이 금지된 경우
		}
	}
});