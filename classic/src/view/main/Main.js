Ext.define('KJERP.view.main.Main', {
    extend: 'Ext.container.Container',
    requires:['Ext.layout.container.Card',
    			'Ext.plugin.Viewport',
              'KJERP.view.login.Form',
              'KJERP.view.main.Job'
    ],
    xtype: 'app-main',
    layout: {
        type: 'card'
    },
	bodyPadding:10,
    items: [{
    	xtype:'loginform'
    }]
});