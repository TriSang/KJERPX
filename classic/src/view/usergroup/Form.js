Ext.define('KJERP.view.usergroup.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'usergroupform',
	requires:[
		'Ext.form.Panel',
		'Ext.form.FieldContainer',
		'Ext.form.field.Checkbox',
		'Ext.form.field.ComboBox',
		'Ext.form.field.Radio',
		'Ext.form.field.Number',
		'Ext.form.FieldSet',
		'Ext.form.field.Hidden',
		'Ext.ux.editor.CKEditor',
		'KJERP.view.widget.FormToolbar',
		'Ext.layout.container.Table'
	],
	title:'Group',
	scrollable:true,
	layout:{
		type:'hbox',
		vertical:true,
		align: _FORM.align
	},
	authCode:'920',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-users'
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
			name:'userGroupName',
			emptyText:'name of usergroup',
			allowBlank:false
		},{			
			xtype:'combo',
			fieldLabel:'Auth',
			name:'authIdx',
			editable:false,
			emptyText:'Select Auth',
			displayField:'name',
			valueField:'authIdx',
			value:'',
			queryMode: 'local',	
			store:'Auth',
			allowBlank:false
		},{
		// end row				
		
		// start row		
			xtype:'datacombo',
			fieldLabel:'Status',
			name:'state',
			value:0,
			comboData:_DATA.stateUserGroup
		},{
			xtype:'component', width:10	
		},{
		// end row			

		// start row		
			fieldLabel:'Remark',
			name:'remark',
			emptyText:'Type Remark',
			allowBlank:true,
			columnWidth:1.0
		},{
		// end row	
									
		// start hidden field	
			xtype:'hiddenfield',
			name:'userGroupIdx',
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
		},
		deactivate:function(form) {
			_FUNCTION.resetStoreAtForm(form);
		}
	},
	initComponent:function() {
		var me = this;
		me.callParent(arguments);
	}
});
