Ext.define('KJERP.view.widget.IFrame', {
	extend:'Ext.Component',
	xtype:'myiframe',
	config:{
		src:null	
	},
	layout:'fit',
	config:{
		src:'resources/blank.html',
		blankSrc:'resources/blank.html'
	},
	applySrc:function(newValue) {
		var me = this;
		if (me.autoEl && me.getEl()) {
			if (!newValue) newValue = me.getBlankSrc();
			me.getEl().dom.src=newValue;
		}
		return newValue;
	},
	initComponent:function() {
		var me = this;
		me.autoEl = {
			tag: 'iframe',
			style: 'height: 100%; width: 100%; border: none',
			src: me.src
		};
		me.callParent();
		
		me.on('afterrender', function() {
			if (me.autoEl && me.getEl()) {
				var src = me.getSrc();
				if (!src) src = me.getBlankSrc();
				me.getEl().dom.src=src;
			}
		});
	}
});