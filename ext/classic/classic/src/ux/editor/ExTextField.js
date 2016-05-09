Ext.define('Ext.ux.editor.ExTextField', {
	extend:'Ext.form.FieldContainer',
	requires:[
      'Ext.form.field.TextArea',
      'Ext.form.field.Text',
      'Ext.ux.editor.TextEditor'
	],
	xtype:'extextfield',
	layout:{
		type:'hbox'
	},
	tip:null,
	config:{
//		fieldLabel:'',
		name:'',
		multiLine:true,
		emptyText:'',
		editable:true
	},
	margin:'0 0 5 0',	
	setValue:function(newValue) {
		var me = this;
		me.value = newValue;
		if (me.items == null || typeof(me.items)=='undefined') return;
		me.down('field').setValue(newValue)
	},
	getValue:function() {
		var me = this;
		return me.down('field').getValue();
	},	
	applyEditable:function(value) {
		var me = this,
			type = me.getMultiLine()?'textarea':'textfield';
		me.editable = value;
		if (me.items == null || typeof(me.items)=='undefined') return;
		me.down(type).setEditable(false);
		me.down('button').setDisabled(false);
	},
	initComponent:function() {
		var me = this,
			type = me.getMultiLine()?'textarea':'textfield';
		me.items = [{
			xtype:type,
			name:me.getName(),
			emptyText:me.getEmptyText(),
			editable:me.getEditable(),
			fieldStyle:{
				minHeight:'30px !important'
			},
			flex:1,
			listeners:{
				blur:function() {
					me.updateTip();
				},
				destroy:function() {
					if (me.tip) {
						Ext.destroy(me.tip);
					}
				}
			}
		}, {
			xtype:'button',
			margin:'0 0 0 5',	
			text:'...',
			handler:function() {
				var text = me.down('field');
				var window = Ext.create('Ext.ux.editor.TextEditor',{
					width:600,
					height:400,
					editable:me.getEditable(),
					value:text.getValue(),
					callbackSave:function(newValue) {
						text.setValue(newValue);
						me.updateTip();
					}
				});
				window.show();
			}
		}];
		me.callParent(arguments);
	},
	listeners:{
	   afterrender: function(c) {
		   var me = this,
		   	field = me.down('field');
		   me.tip = Ext.create('Ext.tip.ToolTip', {
			    target: field.id,
			    disabled:true
		   });
		   me.updateTip();
	    }
	},
	updateTip:function() {
		var me = this,
		   	field = me.down('field'),
		   	text = field.getValue();
		if (me.tip !=null) {
			var disabled = text.indexOf('\n')==-1;	//멀티라인 일때만 보여
			if (!disabled) {
				text = text.replace(/\n/gi,'<br />');
				me.tip.setHtml(text);
			}
			me.tip.setDisabled(disabled);
		}
	}
});