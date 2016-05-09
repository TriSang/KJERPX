Ext.define('KJERP.view.service.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'serviceform',
	requires:[
	    'KJERP.view.service.Products',
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
	title:'Service',
	scrollable:true,
	layout:'fit',
	authCode:'840',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-service'
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
					emptyText:'title of service',
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
					xtype:'contactfield',
					fieldLabel:'Contact',
					emptyText:'Contact of service',
					name:'contactIdx'			
				},{
				// end row	
					
				// start row		
					xtype:'datacombo',
					comboData:_DATA.serviceType,
					name:'serviceType',
					fieldLabel:'Service Type',
					value:0		
				},{
					xtype:'datacombo',
					comboData:_DATA.serviceCategory,
					name:'serviceCategory',
					fieldLabel:'Service Category',
					value:0
				},{
				// end row	
					
				// start row		
					xtype:'datefield',
					fieldLabel:'Requsted',
					name:'requestDate',
					emptyText:'Date of service requested',
					value: new Date(),	// later change it for 1 month...
					format: 'Y-m-d'
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
					xtype:'contactfield',
					fieldLabel:'Engineer',
					emptyText:'Contact of service',
					name:'workerContactIdx'
				},{
					xtype:'companycombo',
					name:'workerCompanyIdx',
					value:_DATA.companyKJE,
					fieldLabel:'Service Company',
					queryFilters:[]
				},{
				// end row	
					
				// start row		
					xtype:'datacombo',
					comboData:_DATA.saleCategory,
					name:'saleCategory',
					fieldLabel:'Vessel Category',
					value:0		
				},{
					xtype:'contactfield',
					fieldLabel:'Assigned',
					hidden:true,
					name:'assignedContactIdx'
				},{
				// end row	
			
					
				// start row		
					xtype:'datacombo',
					comboData:_DATA.stateService,
					name:'state',
					fieldLabel:'Status',
					value:0
				},{
					// start row		
					xtype:'fieldcontainer',
					fieldLabel:'Start/Finish',
					layout:{
						type:'hbox',
						align:'middle'
					},
					items:[{		
						xtype:'datefield',
						fieldLabel:'',
						name:'serviceSDate',
						emptyText:'Estimated Time of Departure',
						value: new Date(),	// later change it for 1 month...
						format: 'Y-m-d',
						flex:1
					},{
						xtype:'label',
						text:'/',
						margin:'0 5 0 5'		
					},{
						xtype:'datefield',
						fieldLabel:'',
						name:'serviceEDate',
						emptyText:'Estimated Time of Arrival ',
						value: new Date(),	// later change it for 1 month...
						format: 'Y-m-d',
						flex:1
					}]
				},{
				// end row	
				
				
				// start row		
					fieldLabel:'Vessel Location',
					name:'location',
					emptyText:'Location of Vessel'
				},{
					// start row		
					xtype:'fieldcontainer',
					fieldLabel:'ETA/ETD',
					layout:{
						type:'hbox',
						align:'middle'
					},
					items:[{		
						xtype:'datefield',
						fieldLabel:'',
						name:'vesselETA',
						emptyText:'Estimated Vessel Arrival',
						format: 'Y-m-d',
						flex:1
					},{
						xtype:'label',
						text:'/',
						margin:'0 5 0 5'		
					},{
						xtype:'datefield',
						fieldLabel:'',
						name:'vesselETD',
						emptyText:'Estimated Vessel Departure',
						format: 'Y-m-d',
						flex:1
					}]
				},{
				// end row	
				
				
			// start row		
				xtype:'contactfield',
				fieldLabel:'Agency Contact',
				emptyText:'Local Agency Contact',
				name:'localContactIdx'
			},{
				xtype:'companycombo',
				name:'localCompanyIdx',
				value:_DATA.companyKJE,
				fieldLabel:'Agency Company',
				queryFilters:[]
			},{
			// end row	
				
			// start row		
				xtype:'extextfield',
		      	fieldLabel:'Service Order',
				name:'serviceOrder',			
				emptyText:'Order of service'
			},{
				xtype:'extextfield',
		      	fieldLabel:'Service Report',
				name:'serviceReport',			
				emptyText:'Report of service'
			},{
			// end row	
				
			// start row		
				xtype: 'filecombo',
				name:'file',
				appCategory:_DATA.appCategory.service
			},{
				xtype:'kjerptag',
				allowBlank:true			
			},{
			// end row
				
			// start row		
				xtype:'pricetaxtotalfield',
				columnWidth:1.0
			},{
			// end row	
				
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
				name:'serviceIdx',
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
				value:_DATA.appCategory.service
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
			xtype:'serviceproducts',
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