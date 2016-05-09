Ext.define('KJERP.view.user.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'userform',
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
		'KJERP.view.widget.AddressField',
		'KJERP.view.widget.CompanyComboBox',
		'KJERP.view.widget.DataComboBox'
	],
	title:'User',
	scrollable:true,
	layout:{
		type:'hbox',
		vertical:true,
		align: _FORM.align
	},
	authCode:'910',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-user'
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
			fieldLabel:'Email/Account',
			name:'email',
			emptyText:'Email is used for user account',
			allowBlank:false
		},{
			xtype:'fieldcontainer',
			fieldLabel:'Password',
			allowBlank:false,
			layout:{
				type:'hbox',
				align:'middle'
			},
			defaults:{
				xtype:'textfield',
				inputType: 'password'
			},			
			items:[{
				name:'pw',
				emptyText:'Type password',
				flex:1,
				allowBlank:false
			}, {
				xtype:'label',
				text:'/',
				margin:'0 5 0 5'				
			}, {
				name:'pw2',
				emptyText:'Confirm password',
				flex:1,
				allowBlank:false
			}]
		},{
		// end row	
	
		// start row
			fieldLabel:'Name',
			name:'name',
			emptyText:'User name',
			allowBlank:false
		},{
			xtype:'companycombo',
			fieldLabel:'Company',
			name:'companyIdx',
			value:_DATA.companyKJE,
			queryFilters:[]
		},{
		// end row	
	
		// start row					
			xtype:'combo',
			fieldLabel:'Group',
			name:'userGroupIdx',
			editable:false,
			emptyText:'Select Group',
			displayField:'userGroupName',
			valueField:'userGroupIdx',
			value:'',
			queryMode: 'local',	
			store:'UserGroup',
			allowBlank:true
		},{
			xtype:'datacombo',
			comboData:_DATA.stateUser,
			name:'state',
			fieldLabel:'Status',
			value:0
		},{
		// end row	
	
		
		// start row		
	      	fieldLabel:'Phone.',
			name:'tel',
			emptyText:'Telephone number'
		},{
	      	fieldLabel:'Mobile',
			name:'mobile',
			emptyText:'Mobile number'
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
			name:'userIdx',
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
