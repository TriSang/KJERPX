Ext.define('KJERP.view.vessel.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'vesselform',
	requires:[
		'Ext.form.Panel',
		'Ext.form.FieldContainer',
		'Ext.form.field.Checkbox',
		'Ext.form.field.ComboBox',
		'Ext.form.field.Radio',
		'Ext.form.field.Number',
		'Ext.form.FieldSet',
		'Ext.form.field.Hidden',
		'Ext.form.FormPanel',
		'KJERP.view.widget.FormHeader',
		'Ext.layout.container.Table',
		'Ext.ux.editor.ExTextField',
		'KJERP.view.widget.FileComboBox',
		'KJERP.view.vessel.Equipments',
		'KJERP.view.vessel.Quotations',
		'KJERP.view.vessel.Contracts',
		'KJERP.view.vessel.Shippings',
		'KJERP.view.vessel.RFQs',
		'KJERP.view.vessel.Services',	
		'KJERP.view.widget.CompanyComboBox',
		'KJERP.view.widget.IFrame',
		'KJERP.view.widget.Tag'
	],
	title:'Vessel',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-vessel'
 	},
	layout:{
		type:'vbox',
		vertical:true,
		align: _FORM.align
	},
	authCode:'700',
	dockedItems:[{
		xtype:'toolbar',
		width:'100%',
        items: [{
            xtype: 'segmentedbutton',
            items: [{
                text: 'Building',
                pressed: true,
                handler:function(cmp) {
                	cmp.up('form').down('[name=formcontainer]').setActiveItem(0);
                }
            }, {
                text: 'General',
                handler:function(cmp) {
                	cmp.up('form').down('[name=formcontainer]').setActiveItem(1);
                }
            }, {
                text: 'Memo',
                handler:function(cmp) {
                	cmp.up('form').down('[name=formcontainer]').setActiveItem(2);
                }
            }]
        }]		
	}],
	items:[{
		xtype: 'container',
		name:'formcontainer',
	    plain: true,
		height:260,
		layout:'card',
	    defaults: {
	        scrollable: true
	    },
	    items: [{
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
			// hidden
				xtype:'hiddenfield',
				name:'vesselIdx',
				value:0
			}, {
				
			// start row		
				fieldLabel:'Hull No.',
				name:'HullCode',
				emptyText:'Hull Number',
				allowBlank:false
			},{
				xtype:'companycombo',
				fieldLabel:'Shipyard',
				name:'yardCompanyIdx',
				emptyText:'Yard Company',
				queryFilters:[{property:'categoryName', value:'YARD'}]	
			},{
			// end row	
				
			// start row		
				fieldLabel:'Name.',
				name:'HullName',
				emptyText:'Name of Vessel'
			},{
				xtype:'companycombo',
				fieldLabel:'Owner',
				name:'ownerCompanyIdx',
				emptyText:'Owner Company',
				queryFilters:[{property:'categoryName', value:'OWNER'}]	
			},{
			// end row	
				
			// start row		
				fieldLabel:'JRC No.',
				name:'JrcSalesNo',
				emptyText:'JRC Sales Number'
			},{
				xtype:'companycombo',
				fieldLabel:'Design',
				name:'designCompanyIdx',
				emptyText:'Design Company',
				queryFilters:[]	// Yard
			},{
			// end row	
				
			// start row
				xtype:'fieldcontainer',
				fieldLabel:'Series/First',
				layout:{
					type:'hbox',
					align:'middle'
				},
				items:[{
					xtype:'textfield',
					name:'ProjectOrSeries',
					flex:1,
					emptyText:'Name of Series/Project'
				}, {
					xtype:'label',
					text:'/',
					margin:'0 5 0 5'
				}, {
					xtype:'textfield',
					name:'FirstVessel',
					emptyText:'First Vessel',
					flex:1
				}]
				
			},{
				xtype:'fieldcontainer',
				fieldLabel:'Class/Notation.',
				layout:{
					type:'hbox',
					align:'middle'
				},
				items:[{
					//xtype:'textfield',
					//name:'Class',
					//flex:1,
					//emptyText:'Class'
					xtype:'datacombo',
					comboData:_DATA.vesselClass,
					name:'Class',					
					editable:true	,
					emptyText:'Class'
				}, {
					xtype:'label',
					text:'/',
					margin:'0 5 0 5'
				}, {
					//xtype:'textfield',
					//name:'ClassNo',
					//emptyText:'Class No',
					xtype:'datacombo',
					comboData:_DATA.vesselNotation,
					name:'Notaion',					
					editable:true	,
					emptyText:'Notation',
					flex:1
				}]
			}, {	
			// end row			
				
			// start row		
				xtype: 'filecombo',
				name:'file',
				appCategory:_DATA.appCategory.vessel
			},{
				xtype:'kjerptag',
				allowBlank:true,
				appCategory:['vessel']
			},{
			// end row	
				
			// start row		
				fieldLabel:'Remark',
				xtype:'extextfield',
				name:'remark',
				columnWidth:1.0
			// end row		
				
			}]
	    }, {   //General start
	        xtype:'container',
			padding:_FORM.padding,
			layout:'column',	        
		    defaults:{
		    	xtype:'textfield',
		    	columnWidth:0.5,
				minWidth:_FORM.fieldWidth,
				labelWidth:_FORM.labelWidth,
				margin:_FORM.fieldMargin
		    },	
			items:[{		
			// start row		
				fieldLabel:'IMO No..',
				name:'ImoNo',
				emptyText:'IMO Registration No'
			},{				
				xtype:'datacombo',
				comboData:_DATA.typeVessel,
				name:'Kind',
				fieldLabel:'Vessel Type',
				editable:true	,
				emptyText:'Type of Vessel'
			},{
			// end row	
				
			// start row		
				fieldLabel:'Call Sign.',
				name:'CallSign',
				emptyText:'Radio Call Sign'
			},{
				fieldLabel:'MMSI',
				name:'MMSI',
				emptyText:'MMSI'
			},{
			// end row	
				
			// start row		
				fieldLabel:'Offical No',
				name:'OfficialNo',
				emptyText:''
			},{
				fieldLabel:'Port',
				name:'PortOfRegistry',
				emptyText:'Port of Registry'
			},{
			// end row	
				
			// start row		
				fieldLabel:'Web Link',
				name:'GoogleDoc',
				emptyText:'Google/Web'
			},{
				xtype:'datacombo',
				comboData:_DATA.stateVessel,
				name:'state',
				fieldLabel:'Status',
				value:0
			},{
			// end row	
				
			// start row		
				xtype:'datacombo',
				comboData:_DATA.flagVessel,
				name:'Flag',
				fieldLabel:'Flag',
				editable:true	,
				emptyText:'Flag of Vessel'
			},{
				fieldLabel:'G.T.',
				name:'GrossTonnage',
				emptyText:'Gross Tonnage'
			// end row	
			
			},{
				fieldLabel:'Built Year',
				name:'builtYear',
				emptyText:'Year of Built ex)2016'
			// end row	
			
			}]
	    	
		}, {  // general end, memo start 
	        xtype:'container',
			padding:_FORM.padding,
			layout:'column',	        
		    defaults:{
		    	xtype:'textfield',
		    	columnWidth:0.5,
				minWidth:_FORM.fieldWidth,
				labelWidth:_FORM.labelWidth,
				margin:_FORM.fieldMargin
		    },	
			items:[{						
			// hidden
				xtype:'hiddenfield',
				name:'appCategory',
				value:_DATA.appCategory.vessel
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
	    	
		}] //formcontainer item end.
	},{
		xclass: 'Ext.tab.Panel',
		name:'subappcontainer',
	    flex:1,
	    defaults: {
	        scrollable: true
	    },
	    items: [{
	        xtype:'vesselequipments'
	    }, {
	    	title: 'RFQ',
	        xtype:'vesselrfqs'
	    }, {
	        title: 'Quotation',
	        xtype:'vesselquotations'
	    }, {
	        title: 'Contract',
	        xtype:'vesselcontracts'
	    }, {
	        title: 'Shipping',
	        xtype:'vesselshippings'
	    }, {
	        title: 'Service',
	        xtype:'vesselservices'
	    }, {
	        title: 'GoogleDoc',
	        xtype:'myiframe'
	    }]
	}],  // formcontainer end
	listeners:{
		scope:this,
		activate:function(form) {
			var record = form.getRecord();
			var isEditMode = record!=null;
			var isReserved = false;		// 수정이 금지된 경우
			// 수정 보기 일때만 하위 메뉴 표시
			form.down('tabpanel').setHidden(!isEditMode);				
		}
	},
	initComponent:function() {
		var me = this;
		me.callParent(arguments);
	}
});
