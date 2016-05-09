Ext.define('KJERP.view.widget.HTMLViewer', {
	extend:'Ext.window.Window',
	xtype:'htmlviewer',
	title:'HTML',
	height:_POPUP.height,
    width:_POPUP.width,
    modal : false,
	closeAction:'destory',
    titleAlign : 'left',
    layout : 'fit',
	bodyPadding:'10 10 10 10',
	scrollable:true,
	initComponent:function(){
		var me = this;
		me.callParent();
	}
});