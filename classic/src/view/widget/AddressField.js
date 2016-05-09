Ext.define('KJERP.view.widget.AddressField', {
	extend:'Ext.container.Container',
	xtype:'addressfield',
	layout:{
		type:'vbox',
		align:'stretch'
	},
	items:[{
		xtype:'fieldcontainer',
		fieldLabel:'주소',
		items:[{
			xtype:'container',
			layout:{
				type:'hbox'
			},
			items:[{
					xtype:'textfield',
					name:'ZIP_CODE',
					emptyText: '우편번호(xxx-xxx)',
					width:165
				},{
					xtype:'button',
					margin:'0 10 0 10',
					name:'findAddr',
					text:'주소찾기',
					handler : function(){											
						var win = Ext.create("Ext.window.Window",{
	                            height:600,
	                            width:500,
	                            modal : false,
	                            autoShow : false,
	                            titleAlign : 'center',
	                            layout : 'fit',
	                            items : [{
	                                 xtype: 'component',
	                                 id : 'ext_address'
	                             }]
	                        });
						win.show(undefined,function(){
	                            new daum.Postcode({
	                                oncomplete: function(data) {
										
										var form = Ext.ComponentQuery.query('addressfield')[0];
										form.up('container').down('[name=ZIP_CODE]').setValue(data.postcode1+"-"+data.postcode2);
										form.up('container').down('[name=ADDR_DEFAULT]').setValue(data.address);
										form.up('container').down('[name=ADDR_DETAIL]').focus();
										
	                                    win.destroy();
	                                },
	                                width : '100%',
	                                height : '100%'
	                            }).embed(Ext.get('ext_address'));
	                        });
					}
				},{				
					xtype:'textfield',				
					name:'ADDR_DEFAULT',
					emptyText: '주소입력',
					flex:1
				}]
		},{
			xtype:'component', height:5							
		},{
			xtype:'container',
			layout:{
				type:'hbox'
			},
			items:[{
				xtype:'textfield',				
				name:'ADDR_DETAIL',	
				emptyText: '상세주소 입력',
				flex:1
			}]
		}]
	}]
});