Ext.define('KJERP.view.bbs.List', {
	extend:'Ext.Panel',
	requires:[
		'Ext.toolbar.Spacer',
		'KJERP.model.BBS',
		'Ext.grid.column.Action',
		'Ext.ux.grid.ComponentColumn',
		'Ext.data.proxy.JsonP',
		'Ext.grid.column.RowNumberer',
		'KJERP.view.widget.PageBar'
	],
	xtype:'bbslist',
	header:{
		title:'News',
		iconCls:'my-panel-icon-news'
	},
	config:{
		authCode:'200',
		popupSelectionMode:false,
		toHideFields:[],
		toHideColumns:[],
		callbackOnSelect:null				
	},
	getStore:function() {
		var me = this;
		return me.down('grid').getStore();
	},
	getSelectionModel:function() {
		var me = this;
		return me.down('grid').getSelectionModel();
	},
	layout: {
		type:'vbox',
		align:'stretch'
	},
	items:[{
		xtype:'component',
		name:'title',
		html:'',
		padding:'10 10 10 10',
		style:{
			color:'black',
			fontWeight:'bold'
		}
	},{
		xtype:'component',
		name:'content',
		width:'100%',
		padding:'10 10 10 10',
		autoScroll:true,
		flex:1,
		html:''
	}, {
		xtype:'grid',
		header:false,
		height:250,
		style:_GRID.borderStyle,
		dockedItems:[{
			xtype:'toolbar',
			border:1,
			items:[{
				xtype: 'textfield',
				name: 'ALL',
	        	emptyText: 'Title/Content...'
			}, {
				xtype:'button', text:'Search', action:'search', glyph:_GLYPH.toolbar.search
			}, { 
				xtype:'tbspacer', flex:1 
			}, {
				xtype:'tbseparator'
			}, {
				xtype:'button', text:'New', action:'add', glyph:_GLYPH.toolbar.add, disabled:false
			}, {
				xtype:'button', text:'Edit', action:'edit', glyph:_GLYPH.toolbar.edit, disabled:true
			}, {
				xtype:'button', text:'View', action:'view', glyph:_GLYPH.toolbar.view, hidden:true, disabled:true
			}, {
				xtype:'button', text:'Del', action:'del', glyph:_GLYPH.toolbar.del, disabled:true
			}]
		}],
		columns: [{
			text : 'No',
			xtype : 'rownumberer',
			width : 40,
			align : 'center'
		}, {			
			text:'Title',			
			flex:1,
			dataIndex:'bbsTitle',
			sortable:true,
			align:'left'
		}, {			
			text:'Category',
			dataIndex:'bbsCategory',
			renderer:_RENDER.bbsCategory,
			width:100
		}, {
			text:'Editor',
			dataIndex:'rUser',			
			width:80,
			sortable:true,
			align:'left'
		}, {	
			text:'Date',			
			width:150,
			dataIndex:'rDate',
			sortable:true,
			align:'left'
		}],
		store:{
            model:'KJERP.model.BBS',
            remoteSort: false,
            pageSize: _GRID.pageRow,
            proxy: JSON.parse(JSON.stringify(_AJAX.proxy))
        }		
	}],
	initComponent:function() {
		var me = this;		
		me.callParent(arguments);			
		var items = me.getToHideColumns();
		for(i=0;i<items.length;i++){
			me.down('[dataIndex='+items[i]+']').setHidden(true);
		}
    			
	}
});
