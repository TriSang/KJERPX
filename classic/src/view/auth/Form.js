Ext.define('KJERP.view.auth.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'authform',
	requires:[
	    'KJERP.view.auth.Roles',
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
		'Ext.layout.container.Table'
	
	],
	title:'Auth',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-auth'
 	},	
	scrollable:true,
	layout:{
		type:'vbox',
		vertical:true,
		align: _FORM.align
		
	},
	authCode:'930',
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
			emptyText:'name of auth',
			allowBlank:false
		},{
			xtype:'datacombo',
			fieldLabel:'Status',
			name:'state',
			value:0,
			comboData:_DATA.stateAuth
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
			name:'authIdx',
			value:0
		},{
			xtype:'hiddenfield',
			name:'roles',
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
		xtype:'authroles',
		
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
