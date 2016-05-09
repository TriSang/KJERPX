Ext.define('KJERP.view.main.MenuTree', {
    extend: 'Ext.Panel',
    requires:['Ext.tree.Panel'],
    xtype: 'menutree',
    layout: {
        type: 'fit'
    },
    items:[{
    	xtype:'treepanel',
    	flex:1,
        rootVisible: false,
        useArrows:true,
        lines: false,
        store:{
        	root:{
	        	expanded: true,
				fields: [{
			        	name:'menu',type:'string'
			        }, { name: 'text', type: 'string', mapping: 'text' 
			        }, { name: 'leaf', type: 'boolean', mapping: 'leaf' 
			        }, { name: 'expanded', defaultValue: true }
	 			],
	 			children: [{
		    		text:'Dashboard',
		    		code:'100',
		    		menu:'dashboardmain', //xtype
		    		controller : 'KJERP.controller.BBS',
		    		iconCls:'my-tree-icon-dashboard',
		    		qtip:'show brief status of working',
		    		leaf: true
	 			},{
	 				text:'News',
		    		code:'200',
		    		menu:'bbsmain', //xtype
		    		controller:'BBS',
		    		iconCls:'my-tree-icon-news',
		    		qtip:'write official notice',
		    		leaf: true
		    	},{
		    		text:'Company',
		    		code:'300',
		    		menu:'companymain', //xtype
		    		controller : 'KJERP.controller.Company',
		    		qtip:'manage yard and shipping company',
		    		iconCls:'my-tree-icon-company',
		    		leaf: true
		    	},{
		    		text:'Contact',
		    		code:'400',
		    		menu:'contactmain', //xtype
		    		controller : 'KJERP.controller.Contact',
		    		qtip:'manage address and contact of worker',
		    		iconCls:'my-tree-icon-contact',
		    		leaf: true
		    	},{
		    		text:'Component',
		    		code:'500',
		    		menu:'componentmain', //xtype
		    		controller : 'KJERP.controller.Component',
		    		qtip:'manage basic component of vessel',
		    		iconCls:'my-tree-icon-component',
		    		leaf: true
	    		},{
		    		text:'Product',
		    		code:'600',
		    		menu:'productmain', //xtype
		    		controller : 'KJERP.controller.Product',
		    		qtip:'manage product of components',
		    		iconCls:'my-tree-icon-product',
		    		leaf: true		    			
	    		},{
		    		text:'Vessel',
		    		code:'700',
		    		menu:'vesselmain', //xtype
		    		controller : 'KJERP.controller.Vessel',
		    		qtip:'manage vessel and projects',
		    		iconCls:'my-tree-icon-vessel',
		    		leaf: true		    			
	    		},{
		    		text:'RFQ',
		    		code:'800',
		    		menu:'rfqmain', //xtype
		    		controller : 'KJERP.controller.RFQ',
		    		qtip:'manage Requrest for Quotation',
		    		iconCls:'my-tree-icon-rfq',
		    		leaf: true		    		
	    		},{
		    		text:'Quotation',
		    		code:'810',
		    		menu:'quotationmain', //xtype
		    		controller : 'KJERP.controller.Quotation',
		    		qtip:'manage quotations',
		    		iconCls:'my-tree-icon-quotation',
		    		leaf: true		    	
	    		},{
		    		text:'Contract',
		    		code:'820',
		    		menu:'contractmain', //xtype
		    		controller : 'KJERP.controller.Contract',
		    		qtip:'manage contracts',
		    		iconCls:'my-tree-icon-contract',
		    		leaf: true		 		    		
	    		},{
		    		text:'Shipping',
		    		code:'830',
		    		menu:'shippingmain', //xtype
		    		controller : 'KJERP.controller.Shipping',
		    		qtip:'manage shipping',
		    		iconCls:'my-tree-icon-shipping',
		    		leaf: true		 		    		
	    		},{
		    		text:'Service',
		    		code:'840',
		    		menu:'servicemain', //xtype
		    		controller : 'KJERP.controller.Service',
		    		qtip:'manage services',
		    		iconCls:'my-tree-icon-service',
		    		leaf: true		 		    		
	    		},{
		    		text:'Bug Report',
		    		code:'110',
		    		menu:'buglist', //xtype
		    		controller : 'KJERP.controller.Main',
		    		qtip:'report bug and issue of KJERP',
		    		leaf: true		    			
		    	},{
		    		text:'Admin',
		    		code:'900',
		    		leaf: false,
		    		children:[{
			    		text:'User',
			    		code:'910',
			    		menu:'usermain',
			    		iconCls:'my-tree-icon-user',
			    		controller : 'KJERP.controller.User',
			    		qtip:'manage users of KJERP',
			    		leaf: true
		    		},{
			    		text:'Group',
			    		code:'920',
			    		menu:'usergroupmain', //xtype
			    		controller : 'KJERP.controller.UserGroup',
			    		iconCls:'my-tree-icon-users',
			    		qtip:'manage group of KJERP',
			    		leaf: true		    		
		    		
		    		},{
			    		text:'Authority',
			    		code:'930',
			    		menu:'authmain', //xtype
			    		iconCls:'my-tree-icon-auth',
			    		controller : 'KJERP.controller.Auth',
			    		qtip:'manage authority of user',
			    		leaf: true		    			
		    		}]		    		
	    		},{
		    		text:'Option',
		    		code:'110',
		    		menu:'optionform', //xtype
		    		iconCls:'my-tree-icon-option',
		    		controller : 'KJERP.controller.Option',
		    		qtip:'configure user settings',
		    		leaf: true				    		
				},{		    		
		    		text:'<span style="color:red;">Logout</span>',
		    		code:'999',
		    		menu:'logout',
		    		iconCls:'my-tree-icon-logout',
		    		leaf: true		    		
		    	}
		    	]
        	}
        },
		dockedItems:[{
			dock:'top',
			xtype:'container',
			padding:'5 5 5 5',
			layout:{
				type:'vbox',
				align:'right'
			},
			items:[{
				xtype:'label',
				name:'version'
			},{
				xtype:'component',
				name:'user',
				listeners: {
		       		el: {
		            	click: function() {
		                  alert('edit profile');
		              	},
		            	scope: this
					}
		     	}
			}]
		}]
    }],
    initComponent: function() {
    	var me = this;
        this.callParent();
        
        // update user info
        me.down('label[name=version]').setText(_GLOBAL.VERSION);
        me.down('[name=user]').setHtml([
        '<a href="#" title="edit profile" class="noDecoration">',
	        '<span class="my-tree-icon-user"></span>&nbsp;',
	         _USER.info.name,
         '</a>'
        ].join('')
       );
    }
});
