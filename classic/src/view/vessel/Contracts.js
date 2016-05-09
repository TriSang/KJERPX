Ext.define('KJERP.view.vessel.Contracts', {
	extend: 'KJERP.view.contract.List',
	requires:[
	],
	xtype:'vesselcontracts',
	title:'Contracts',
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
			me.setTitle('Contracts ('+store.getCount()+')');
		});
	}
});