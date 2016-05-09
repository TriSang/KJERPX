Ext.define('KJERP.view.widget.DateFields', {
	extend:'Ext.form.FieldContainer',
	xtype:'datefields',		
	width:350,	
	layout:'hbox',	
	items:[{ xtype: 'datefield',             
		    name: 'fromDate',
		    format: 'Y-m-d',
		    value: new Date(),
		    maxValue: new Date()  // limited to the current date or prior		    		   
		}, {
		    xtype: 'datefield',         
		    name: 'toDate',
		    format: 'Y-m-d',
		    value: new Date() // defaults to today		   
	}]
});
/*Ext.define('KJERP.view.widget.DateFields', {
	extend:'Ext.container.Container	',	
	requires:['Ext.form.field.Date'],
	xtype:'datefields',	
	enableKeyEvents: true,
	layout:'hbox',	
	items:[{
	        xtype:'fieldcontainer',
			items: [{
			       xtype:'container',
			       items:[{
			        
					    xtype: 'datefield',             
					    name: 'from_date',
					    format: 'Y-m-d',
					    maxValue: new Date()  // limited to the current date or prior
					}, {
					    xtype: 'datefield',         
					    name: 'to_date',
					    format: 'Y-m-d',
					    value: new Date()  // defaults to today
					}]
			}]
	}],	
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
*/