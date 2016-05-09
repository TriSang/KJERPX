Ext.define('KJERP.view.main.Job', {
    extend: 'Ext.container.Container',
    requires:[
    	'KJERP.view.main.MenuTree',
    	'Ext.layout.container.Border'
    ],
    xtype: 'job',
    flex:1,
    layout: {
        type: 'border'
    },
    items: [{
    	region: 'west',
        xtype: 'menutree',
        split:true,
        collapsible: true,
        header:{
        	title: 'KJERP',
        	icon:'resources/images/icon/menu.png'
        },
        width: 150,
        layout: 'fit'
    },{
        xtype:'container',
        region: 'center',
        name:'work',
        layout:'card',
        items:[{
        	xtype:'component',
        	html:'dummy'
        }]
    }]
});