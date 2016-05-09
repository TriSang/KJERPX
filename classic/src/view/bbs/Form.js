Ext.define('KJERP.view.bbs.Form', {
	extend:'KJERP.view.widget.BaseForm',
	xtype:'bbsform',
	requires:[
		'Ext.form.Panel',
		'Ext.form.FieldContainer',
		'Ext.form.FieldSet',
		'Ext.form.field.Hidden',
		'Ext.ux.editor.CKEditor',
		'KJERP.view.widget.DataComboBox'
	],
	title:'News',
	layout:'fit',
	code:'200',
 	header:{
 		xtype:'formheader',
 		iconCls:'my-panel-icon-news'
 	},
	items: [{
		xtype:'container',
		padding:'5 5 5 5',
		layout: {
	        type: 'vbox',
	        align: 'stretch'
	    },		
	    defaults:{
	    	xtype:'textfield',
	      	labelAlign:'top',
			labelWidth:50
	    },	    
		items:[{
	      	fieldLabel:'Title',
			name:'bbsTitle',
			emptyText:'Type title'
		},{		
			xtype:'datacombo',
			comboData:_DATA.bbsCategory,
			name:'bbsCategory',
			fieldLabel:'News Category',
			value:0
		},{		
			xtype:'ckeditor',
			name:'bbsContent',
			flex:1,
			fieldLabel: 'Content'
		},{
			xtype:'hiddenfield',
			name:'bbsIdx'
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

