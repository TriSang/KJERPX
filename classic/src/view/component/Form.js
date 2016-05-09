Ext.define('KJERP.view.component.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'componentform',
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
		type:'hbox',
		vertical:true,
		align: _FORM.align
	},
	config:{
    	toHideFields:[]    
    },
	authCode:'500',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-component'
 	},
	dockedItems:[{
		xtype:'toolbar',
		width:'100%',
        items: [{
            xtype: 'segmentedbutton',
            defaults:{
            	width:100	
            },
            items: [{
                text: 'Information',
                pressed: true,
                handler:function(cmp) {
                	cmp.up('form').down('[name=formcontainer]').setActiveItem(0);
                }
            }, {
                text: 'Image (0)',
                action:'gallery',
                handler:function(cmp) {
                	cmp.up('form').down('[name=formcontainer]').setActiveItem(1);
                }
            }]
        }]		
	}], 	
 	items:[{
		xtype:'container',
		name:'formcontainer',
	    plain: true,
		layout:'card',
	    defaults: {
	        scrollable: true
	    },		
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
		      	name:'componenttreegroupfield',
				allowBlank:true
			},{
			// end row	
		
			
			// start row		
				fieldLabel:'JRC Code',
				name:'JRCOrderCode',
				emptyText:'JRC Odering Code',
				allowBlank:true
			},{					
				fieldLabel:'IMO No..',
				name:'ImoNo',
				emptyText:'IMO Registration No',
				allowBlank:true
			},{					
			// end row	
			
			// start row
				
				fieldLabel:'Interface In',
				name:'InterIn',
				emptyText:'Type Interface In',
				allowBlank:true
			},{
				fieldLabel:'Interface Out',
				name:'InterOut',
				emptyText:'Type Interface Out',
				allowBlank:true
			},{
			// end row	
				
			
			// start row				
			
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
			// end row
		
			// start row		
				xtype:'fieldcontainer',
				name:'colormass',
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
				margin:'5 10 0 0'
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
	 	},{
			xtype: 'imagegallery',
			callbackStoreUpdate:function(gallery, store) {
				var galleryButton = gallery.up('componentform').down('button[action=gallery]');
				galleryButton.setText('Image ('+store.getCount()+')');
			}
 		}]
	}],
	setReadOnly:function(bTrue) {
		var me = this;
		me.query('field').every(function(field) {
			field.setReadOnly(bTrue);
			return true;
		});
	},
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
				
		me.callParent(arguments);
	}
});