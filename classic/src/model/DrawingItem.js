Ext.define('KJERP.model.DrawingItem',{
	extend:'Ext.data.Model',
	fields:[
	{
		name:'equipmentItemIdx'				
	},{
		name:'date', type:'date'
	}, {
		name:'category'
	}, {
		name:'comment'
	}, {
		name:'state',
		defaultValue:0
	}, {
		name:'user'
	}]
});