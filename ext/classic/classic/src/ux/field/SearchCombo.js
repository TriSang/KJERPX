Ext.define('Ext.ux.field.SearchCombo',{
	extend:'Ext.form.field.ComboBox',
	xtype:'searchcombo',
	valueField:'value',
	displayField:'text',	
	originDisplayField:'',
	originValueField:'',
	queryMode: 'local',
	store:null,
/*	
*/	
	config:{
		queryFilterFn:null,
		queryStore:null,
		defaultValue:null,
		defaultDisplay:'모두보기',
		extraFields:null
	},
	initComponent:function() {
		var me = this;
		me.originDisplayField = me.displayField,
		me.originValueField = me.valueField;
		me.store =Ext.create('Ext.data.Store', {
			fields: ['text', 'value'],
			proxy:{
				type:'memory'
			}
		});
		me.displayField = 'text';
		me.valueField ='value';
		me.callParent();
		me.updateQueryStore();
//		me.setValue(me.getDefaultValue());
	},
	updateQueryStore:function() {
		var me = this;
		if (me.store == null) return;
		var queryStore = Ext.getStore(me.getQueryStore());
		var store = me.getStore();
		var filterFn = me.getQueryFilterFn();
		var extraFields = me.getExtraFields();
		if (extraFields != null) {
			var fields = ['text','value'];
			Ext.Array.each(extraFields, function(field) {
				fields.push(field);
			});
			var newStore = Ext.create('Ext.data.Store', {
				fields: fields,
				proxy:{
					type:'memory'
				}
			}); 
			me.bindStore(newStore);
			store = newStore;
		}
		
		store.removeAll();
		store.add({text:me.getDefaultDisplay(), value:me.getDefaultValue()});
		queryStore.each(function(record) {
			if (filterFn ==null || filterFn(record)) {
				var newRecord ={text:record.get(me.originDisplayField), value:record.get(me.originValueField)};
				if ( extraFields != null) {
					Ext.Array.each(extraFields, function(field) {
						newRecord[field] = record.get(field);	
					});
				}
				store.add(newRecord);
			}
		});
		
		if (me.getDefaultValue() != null)
			me.setValue(me.getDefaultValue());
	}
});	
