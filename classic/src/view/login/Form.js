Ext.define('KJERP.view.login.Form', {
    extend: 'Ext.form.Panel',
    xtype:'loginform',
    requires:[
              'Ext.form.Panel',
              'KJERP.model.Login',
      		  'Ext.button.Button',
     		  'Ext.form.field.Checkbox',
      		  'Ext.form.Label'
    ],
	layout:{
		type:'vbox',
		align:'middle'
	},
	width:'100%',
	bodyPadding: 10,
	model:'KJERP.model.Login',
    items: [{
    	xtype:'container',
    	width:'100%',
    	layout:{
    		type:'hbox',
    		align:'middle'
    	},
    	items:[{
    		xtype:'label',
        	text:'New KJERP - '+_GLOBAL.VERSION
    	},{
    		xtype:'component',
    		flex:1
    	},{
			xtype:'button',
			text:'<div style="color:black;">Register</div>',
			cls: 'ts-tbutton',
			border:false,
			action:'register',
			margin:'0 5 0 0'
    	},{
			xtype:'button',
			text:'<div style="color:black;">Find ID</div>',
			tooltip:'Lost your ID?',
			cls: 'ts-tbutton',
			border:false,
			action:'forgetID',
			margin:'0 5 0 0'
		}, {
			xtype:'button',
			text:'<div style="color:black;">Find password</div>',
			tooltip:'Lost your password?',
			cls: 'ts-tbutton',
			border:false,
			action:'forgetPW'    			
    	}]
    }, {
    	xtype:'form',
    	header:false,
		width:250,
		margin:'50 0 0 0',
		title:'Login',
		layout:{
			type:'vbox',
			align:'center',
			pack:'center'
		},
		bodyPadding:'5 10 5 10',
		defaults:{
		},
		items:[{
			xtype:'image',
			src:'resources/images/logo.png',
			height:80,
			width:100,
			margin:'0 0 20 0'
		},{
			xtype:'textfield',		
			width:'100%',
			fieldLabel:'ID',
			value:'tech@kjeng.kr',
			name:'MEM_ID'
		},{
			xtype:'textfield',		
			width:'100%',
			fieldLabel:'Password',
			value:'kjeng5650',
			inputType:'password',
			enableKeyEvents:true,
			name:'MEM_PW'
		},{
			xtype:'container',
			layout:{
				type:'hbox',
				pack:'center'
			},
			defaults:{
				xtype:'checkboxfield',
				flex:1
			},
			items:[{
				xtype:'checkboxfield',
				boxLabel:'Save ID',
				name:'save_id'
			},{
				boxLabel:'Save Password',
				name:'save_passwd'
			}]
		}, {
			xtype:'container',
			width:'100%',
			margin:'10 0 10 0',
			layout:{
				type:'hbox',
				pack:'center'
			},
			items:[{
				xtype:'button',
				text:'Submit',
				width:100,
				action:'login'
			}]
		}]
	},{
		xtype:'label',
		name:'chrome',
		hidden:true,
		width:300,
		html:'KJERP is optimized for Chorome and IE9<a href="http://www.google.com/intl/ko/chrome/">Chrome Installation</a>'
		
    }],
	resetForm:function(isPartialReset) {
		var me = this;
		Ext.Array.each(me.query('field'), function(field) {
				field.reset();
	    });
	}
});