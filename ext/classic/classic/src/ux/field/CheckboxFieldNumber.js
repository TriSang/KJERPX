Ext.define('Ext.ux.field.CheckboxFieldNumer', {
	extend:'Ext.form.field.Checkbox',
	xtype:'numbercheckbox',
	checkedValue:0,
    setValue: function(checked) {
        var me = this;
        me.checkedValue = checked ? 1 :0;
        me.callParent(arguments);
        return me;
    },
    getValue:function() {
    	var me = this;
    	return me.checkedValue;
    }
});