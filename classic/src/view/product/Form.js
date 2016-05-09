Ext.define('KJERP.view.product.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'productform',
	requires:[
	    'KJERP.view.product.Components',
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
		'KJERP.view.widget.Tag',
		'KJERP.view.widget.ComponentTreeGroupField'				
	],
	title:'Product',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-product'
 	},	
	scrollable:true,
	layout:{
		type:'vbox',
		vertical:true,
		align: _FORM.align
		
	},
	authCode:'600',
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
                text: 'Component',
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
	//		name:'formcontainer',
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
				emptyText:'name of product',
				allowBlank:false
			},{
		      	fieldLabel:'Model',
				name:'model',
				emptyText:'model number',
				allowBlank:false
			},{
			// end row	
		
			// start row		
				xtype:'companycombo',
				fieldLabel:'Maker',
				name:'companyIdx',
				value:_DATA.companyJRC,
				queryFilters:[{property:'categoryGroup', value:20}]	// Maker
			},{
		      	fieldLabel:'Type',
				name:'type',
				emptyText:'type information',
				allowBlank:true
			},{
			// end row	
		
			// start row		
				fieldLabel:'Unit',
				name:'unit',
				emptyText:'unit information',
				allowBlank:true
			},{
		      	fieldLabel:'Group',
		      	xtype:'componenttreegroupfield',
				allowBlank:true
			},{
			// end row	
		
			
			// start row		
				fieldLabel:'JRC Code',
				name:'JRCOrderCode',
				emptyText:'JRC Odering Code',
				allowBlank:true
			},{
		      	fieldLabel:'HSCode',
				name:'HSCode',
				emptyText:'HS Code',
				allowBlank:true
			},{
			// end row	
				
			// start row		
				fieldLabel:'IHM',
				name:'IHM',
				emptyText:'IHM',
				allowBlank:true
			},{
		      	fieldLabel:'shipdexCode',
				name:'shipdexCode',
				emptyText:'Shipdex DM Code',
				allowBlank:true
			},{
			// end row	
		
			// start row		
				fieldLabel:'Barcode',
				name:'barcode',
				emptyText:'',
				allowBlank:true
			},{
				xtype:'datacombo',
				fieldLabel:'Status',
				name:'state',
				value:0,
				comboData:_DATA.stateComponent
			},{
			// end row	
	
			// start row		
				xtype: 'filecombo',
				name:'file',
				appCategory:_DATA.appCategory.component,
				fileAppCategorys:['MNL','STE','SPC','BRC','DRW','ETC']
			},{
				xtype:'kjerptag',
				allowBlank:true
			},{
	
		
			// start row		
				xtype:'fieldcontainer',
				fieldLabel:'Color/Mass',
				layout:{
					type:'hbox',
					align:'middle'
				},
				items:[{			
					xtype:'textfield',
					name:'color',
					emptyText:'Color of component',
					flex:1				
				}, {
					xtype:'label',
					text:'/',
					margin:'0 5 0 5'
				}, {
					xtype:'numberfield',
					name:'mass',
					emptyText:'Mass',
					fieldStyle: 'text-align:right;',
					value:0,
					flex:1
				}, {
					xtype:'label',
					text:'KG',
					margin:'0 5 0 5'				
				}]
			},{
				fieldLabel:'Volume(LWH)',
				name:'volume',
				emptyText:'Length x Width x Height'
			},{
			// end row	
				
				xtype:'fieldcontainer',
				fieldLabel:'Price',
				allowBlank:false,
				columnWidth:1.0,
				layout:{
					type:'hbox',
					align:'middle'
				},
				items:[{			
					xtype:'currencycombo',
					name:'currency',
					width:100,
					fieldLabel:''
				}, {
					xtype:'label',
					text:'Purchase',
					margin:'0 5 0 5'
				}, {
					xtype:'numberfield',
					name:'purchasePrice',
					emptyText:'Purchase price',
					fieldStyle: 'text-align:right;',
					value:0,
					flex:1
				}, {
					xtype:'label',
					text:'List',
					margin:'0 5 0 5'
				}, {
					xtype:'numberfield',
					name:'listPrice',
					fieldStyle: 'text-align:right;',
					emptyText:'List price',
					value:0,
					flex:1
				}, {
					xtype:'label',
					text:'Discount',
					margin:'0 5 0 5'
				}, {
					xtype:'numberfield',
					name:'discountPrice',
					fieldStyle: 'text-align:right;',
					emptyText:'Discount price',
					value:0,
					flex:1
				}]		
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
				name:'componentIdx',
				value:0
			},{
				xtype:'hiddenfield',
				name:'components',
				type:'json',
				value:[]
			},{
				xtype:'hiddenfield',
				name:'isProduct',
				value:1
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
				value:_DATA.appCategory.product
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
			xtype:'productcomponents',
			
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
	}
});