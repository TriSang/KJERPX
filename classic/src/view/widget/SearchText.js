Ext.define('KJERP.view.widget.SearchText', {
	extend:'Ext.form.field.Text',
	name: 'ALL',
	xtype:'searchtextfield',
	enableKeyEvents: true,
	listeners:{
		keyup:function(cmp, event) {
			if(event.getKey() == event.ENTER) {
				var toolbar = cmp.up('toolbar');
				if (toolbar) {
					var searchButton = toolbar.down('button[action=search]');
					if (searchButton) {
						searchButton.fireEventArgs('click', [searchButton]);
					}
				}
		    }
		}
	}
});