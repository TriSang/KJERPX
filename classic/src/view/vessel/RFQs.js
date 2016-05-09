Ext.define('KJERP.view.vessel.RFQs', {
	extend: 'KJERP.view.rfq.List',
	requires:[
	],
	xtype:'vesselrfqs',
	title:'RFQ (0)',
	header:false,
	style:_GRID.borderStyle,
	toHideColumns:['vesselIdx'],
	initComponent:function() {
		var me = this; 
		me.callParent(arguments); //initProduct 부모의 실행한다. 
		
//		insert vesselIdx for search
		me.down('toolbar').add({
			xtype:'hiddenfield',
			name:'vesselIdx',
			value:0
		});
				
		me.store.on('datachanged', function(store) {
			me.setTitle('RFQ ('+store.getCount()+')');
		});
	}
});