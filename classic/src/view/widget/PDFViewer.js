Ext.define('KJERP.view.widget.PDFViewer', {
	extend:'Ext.window.Window',
	xtype:'pdfviewer',
	height:500,
    width:700,
    modal : true,
    autoShow : false,
    titleAlign : 'center',
    layout : 'fit',	
	callbackStart:null,
	//callbackSelect:null,
//	items:[{
//		xtype:'panel',
//		header:null		
//	}]
	config:{
		src:null
	},
	initComponent:function(){
		var me = this;
		me.callParent();
		me.callbackStart();		
	}
});