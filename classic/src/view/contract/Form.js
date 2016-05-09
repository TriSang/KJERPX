Ext.define('KJERP.view.contract.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'contractform',
	requires:[
	    'KJERP.view.contract.Products',
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
		'KJERP.view.widget.AddressField',
		'KJERP.view.widget.CategoryComboBox',
		'KJERP.view.widget.FileComboBox',
		'KJERP.view.widget.VesselField',
		'KJERP.view.widget.ContactField',
		'KJERP.view.widget.PriceTaxTotalField'
	],
	title:'Contract',
	scrollable:true,
	layout:'fit',
	authCode:'820',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-contract'
 	},
 	dockedItems:[{
		xtype:'toolbar',
		width:'100%',
        items: [{
            xtype: 'segmentedbutton',
            items: [{
                text: 'General',
                handler:function(cmp) {
                	cmp.up('form').down('[name=formcontainer]').setActiveItem(0);
                }
            }, {
                text: 'Item',
                handler:function(cmp) {
                	cmp.up('form').down('[name=formcontainer]').setActiveItem(1);
                }
            }]
        }]		
	}],
	items:[{
		xtype: 'container',
		name:'formcontainer',
	    plain: true,	
		layout:'card',
	    defaults: {
	        scrollable: true
	    },
		items:[{
			xtype:'container',
		//	name:'formcontainer',
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
				name:'title',
				emptyText:'title of contract',
				allowBlank:false
			},{
				fieldLabel:'Doc No.',
				name:'docNo',
				hidden:true,
				emptyText:'Document No'	
			},{
			// end row	
				
			// start row		
				fieldLabel:'PO No.',
				name:'poNo',
				emptyText:'Purchase Order No.'
			},{
				xtype:'datefield',
				fieldLabel:'Delivery',
				name:'deliveryDate',
				emptyText:'Delivery date',
				value: new Date(),	// later change it for 1 month...
				format: 'Y-m-d'
			},{
			// end row	
				
			// start row		
				xtype:'contactfield',
				fieldLabel:'Contact',
				emptyText:'Contact of contract',
				name:'contactIdx'
			},{
				xtype:'datefield',
				fieldLabel:'Contracted',
				name:'contractDate',
				emptyText:'Date of contract',
				value: new Date(),	// later change it for 1 month...
				format: 'Y-m-d'
			},{
			// end row	
				
			// start row		
				xtype:'contactfield',
				fieldLabel:'Assigned',
				hidden:true,
				name:'assignedContactIdx'
			},{
			// end row	
		
			// start row		
				xtype:'extextfield',
		      	fieldLabel:'Delivery',
				name:'delivery',			
				emptyText:'Terms of Delivery'
			},{
				xtype:'datacombo',
				comboData:_DATA.paymentCategory,
				name:'payment',
				fieldLabel:'Payment',
				editable:true	,
				emptyText:'Terms of Payment'
			},{
			// end row	
							
			// start row		
				xtype: 'filecombo',
				name:'file',
				appCategory:_DATA.appCategory.contract,
				fileAppCategorys:['CON','INV','ETC']
			},{
				xtype:'kjerptag',
				allowBlank:true			
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
				comboData:_DATA.stateContract,
				name:'state',
				fieldLabel:'Status',
				value:0
			},{
			// end row	
				
			// start row		
				xtype:'pricetaxtotalfield',
				columnWidth:1.0,
				margin:'5 10 5 0'
			},{
			// end row	
				
			// start row		
				fieldLabel:'Remark',
				xtype:'extextfield',
				name:'remark',
				columnWidth:1.0,
				margin:'0 10 10 0' //(top, right, bottom, left).
			},{
			// end row	
				
			// start hidden field	
				xtype:'hiddenfield',
				name:'contractIdx',
				value:0
			},{
				xtype:'hiddenfield',
				name:'products',
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
			},{						
				// hidden
				xtype:'hiddenfield',
				name:'appCategory',
				value:_DATA.appCategory.contract
			}, {						
			// hidden
				xtype:'hiddenfield',
				name:'memoIdx',
				value:0
			}, {
				
			// start row		
				xtype:'textareafield',
				name:'memo',
				emptyText:'Write Private Memo',
				grow: true,
				allowBlank:false,
				columnWidth:1.0,
				height:240
			}]
		},{
			xtype:'contractproducts',
			height: '98%',
			flex:1
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
