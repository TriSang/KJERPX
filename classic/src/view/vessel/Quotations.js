Ext.define('KJERP.view.vessel.Quotations', {
	extend: 'KJERP.view.quotation.List',
	requires:[
	],
	xtype:'vesselquotations',
	title:'Quotation',
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
			me.setTitle('Quotation ('+store.getCount()+')');
		});
	}
});