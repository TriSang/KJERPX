Ext.define('KJERP.view.vessel.Services', {
	extend: 'KJERP.view.service.List',
	requires:[
	],
	xtype:'vesselservices',
	title:'Service',
	header:false,
	style:_GRID.borderStyle,
	toHideColumns:['vesselIdx'],
	initComponent:function() {
		var me = this; 
		me.callParent(arguments); //initProduct 부모의 실행한다. 
		
		me.down('toolbar').add({
			xtype:'hiddenfield',
			name:'vesselIdx',
			value:0
		});
				
		me.store.on('datachanged', function(store) {
			me.setTitle('Service ('+store.getCount()+')');
		});
	}
});