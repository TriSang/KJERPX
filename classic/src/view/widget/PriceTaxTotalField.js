Ext.define('KJERP.view.widget.PriceTaxTotalField', {
	extend:'Ext.form.FieldContainer',
	requires:[
		'Ext.form.field.Number',
		'Ext.form.Label',
		'Ext.ux.field.CheckboxFieldNumer',
		'KJERP.view.widget.CurrencyComboBox'
	],
	xtype:'pricetaxtotalfield',
	fieldLabel:'Price/Tax/Total',
	layout:{
		type:'hbox',
		align:'middle'
	},
	defaults:{
		xtype:'textfield',
		textAlign:'right'
	},
	updateTotal:function() {
		var me = this,
			price = me.down('[name=price]').getValue(),
			tax =  me.down('[name=tax]').getValue();
		
		me.s	
		
	},
	initComponent:function() {
		var me = this;
		me.items = [{
			xtype:'currencycombo',
			name:'currency'	,
			fieldLabel:'',
			width:80,
			margin:'0 5 0 0'
		} ,{
			xtype:'numberfield',
			name:'price',
			emptyText:'Price',
			fieldStyle: 'text-align:right;',
			value:0,
			flex:1
		}, {
			xtype:'label',
			text:'/',
			margin:'0 5 0 5'
		}, {
			xtype:'numberfield',
			name:'tax',
			fieldStyle: 'text-align:right;',
			emptyText:'Tax',
			value:0,
			flex:1
		}, {
			xtype:'label',
			text:'/',
			margin:'0 5 0 5'
		}, {
			xtype:'numberfield',
			name:'total',
			fieldStyle: 'text-align:right;',
			value:0,
			emptyText:'Total of price and tax',
			flex:1
		},{
			xtype:'numbercheckbox',
			name:'priceLocked',
			boxLabel:'Locked',
			margin:'0 0 0 5',
			inputAttrTpl: " data-qtip='Lock from modification' "
		}];
		
		me.callParent(arguments)
		var price = me.down('[name=price]'),
			tax =  me.down('[name=tax]'),
			total =  me.down('[name=total]'),
			lock = me.down('[name=priceLocked]')
			
		var updateCallback = function() {	
			total.setValue(price.getValue()+tax.getValue());
		};
		
		var lockCallback = function(cnp, newValue) {
			price.setReadOnly(newValue);
			tax.setReadOnly(newValue);
			total.setReadOnly(newValue);
		};
		
		price.on('change', updateCallback);
		tax.on('change', updateCallback);
		lock.on('change', lockCallback);
	}
});