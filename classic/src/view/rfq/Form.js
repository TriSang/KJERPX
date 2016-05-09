Ext.define('KJERP.view.rfq.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'rfqform',
	requires:[
		'Ext.form.Panel',
		'Ext.form.FieldContainer',
		'Ext.form.field.Checkbox',
		'Ext.form.field.ComboBox',
		'Ext.form.field.Radio',
		'Ext.form.field.Number',
		'Ext.form.FieldSet',
		'Ext.form.field.Hidden',
		'KJERP.view.widget.FormToolbar',
		'Ext.layout.container.Table',
		'Ext.ux.editor.ExTextField',
		'KJERP.view.widget.CategoryComboBox',
		'KJERP.view.widget.FileComboBox',
		'KJERP.view.widget.CurrencyComboBox',
		'KJERP.view.widget.VesselField',
		'KJERP.view.widget.ContactField',
		'KJERP.view.widget.Tag'
	],
	title:'RFQ(Requsted For Quotation)',
	scrollable:true,
	layout:{
		type:'vbox',
		vertical:true,
		align: _FORM.align
	},
	authCode:'800',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-rfq'
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
				xtype:'vesselfield',
				allowBlank:false
			},{
				xtype:'fieldcontainer',
				fieldLabel:'From/To',
				allowBlank:false,
				layout:{
					type:'hbox',
					align:'middle'
				},
				items:[{
					xtype:'companycombo',
					name:'fromCompanyIdx',
					value:_DATA.companyKJE,
					fieldLabel:'',
					queryFilters:[],
					flex:1
				}, {
					xtype:'label',
					text:'/',
					margin:'0 5 0 5'
				}, {
					xtype:'companycombo',
					name:'toCompanyIdx',
					fieldLabel:'',
					queryFilters:[],
					flex:1
				}]
			}, {	
			// end row			
				
			
		// start row		
			fieldLabel:'Title',
			name:'rfqTitle',
			emptyText:'title of RFQ',
			allowBlank:false
		},{
			fieldLabel:'Doc No.',
			name:'docNo',
			emptyText:'Document No'
		},{
		// end row	
	
		// start row		
			xtype:'datefield',
			fieldLabel:'Requested',
			name:'requestedDate',
			emptyText:'Type requested RFQ',
			value: new Date(),
			format: 'Y-m-d'		
		},{
			xtype:'datefield',
			fieldLabel:'Due',
			name:'dueDate',
			emptyText:'Due date of RFQ',
			value: new Date(),
			format: 'Y-m-d'
		},{
		// end row	
			
	
		// start row		
			xtype:'contactfield',
			fieldLabel:'Contact',
			name:'requestContactIdx',
			emptyText:'Client\'s contact'
		},{
			xtype:'contactfield',
			fieldLabel:'Assigned',
			name:'assignedContactIdx',
			hidden:true,
			emptyText:'Assigned contact'
		},{
		// end row	
			
		// start row		
			xtype:'datacombo',
			comboData:_DATA.saleCategory,
			name:'saleCategory',
			fieldLabel:'Vessel Category',
			value:0
		},{
			xtype:'datacombo',
			comboData:_DATA.stateRFQ,
			name:'state',
			fieldLabel:'Status',
			value:0
		},{
		// start row		
			xtype:'kjerptag',
			allowBlank:true
		},{
			xtype: 'filecombo',
			name:'file',
			appCategory:_DATA.appCategory.rfq
		},{
		// end row	

		// start row					
			fieldLabel:'Remark',
			xtype:'extextfield',
			name:'remark',
			columnWidth:1.0,
			margin:'0 10 10 0'
		},{
		// end row	
			
		// start hidden field	
			xtype:'hiddenfield',
			name:'rfqIdx',
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
	}
});