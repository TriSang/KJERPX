/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
//Ext.Loader.setConfig({ enabled: true });
//Ext.Loader.setPath('KJERP', 'classic/src');
//Ext.Loader.setPath('EXT', 'classic/src');
Ext.define('KJERP.Application', {
    extend: 'Ext.app.Application',
    name: 'KJERP',
    stores: [
        'Auth',
        'AuthInfo',
        'UserGroup',
        'CountryCode',
        'ComponentTreeGroup'
    ],
    requires:[
		'KJERP.view.dashboard.Main',
		'KJERP.view.component.Main',
		'KJERP.view.product.Main',		
		'KJERP.view.company.Main',
		'KJERP.view.contact.Main',
		'KJERP.view.vessel.Main',
		'KJERP.view.user.Main',
		'KJERP.view.report.BugList',
		'KJERP.view.bbs.Main',
		'KJERP.view.rfq.Main',
		'KJERP.view.quotation.Main',
		'KJERP.view.contract.Main',
		'KJERP.view.shipping.Main',
		'KJERP.view.service.Main',
		'KJERP.view.usergroup.Main',
		'KJERP.view.auth.Main',
		'KJERP.view.widget.OptionForm',
		'KJERP.view.widget.VesselProductList'
		
    ],
    views:[
    ],
	init: function() {
	},    
    launch: function () {
    	if (_TEST.isOn) _TEST.start();
    	if (Ext.get('page-loader')) {
        	Ext.get('page-loader').remove();
        }
    },
    controllers:[
    	'Main',
    	'Login',
    	'Vessel',
    	'Product',
    	'Component',
    	'Company',
    	'BBS',
    	'Quotation',
    	'Contact',
    	'User',
		'UserGroup',
		'RFQ',
		'Contract',
		'Shipping',
		'Service',
		'Auth',
		'Drawing',
		'Option',
		'VesselProductList'
		
    ],

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
