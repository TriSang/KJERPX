describe('Login UI', function() {
	var mainView, form, fieldId, fieldPw, btnLogin, dashboard;
	beforeAll(function() {
		mainView = Ext.ComponentQuery.query('app-main')[0];
		form = mainView.down('loginform');
		fieldId = form.down('[name=MEM_ID]');
		fieldPw = form.down('[name=MEM_PW]');
		btnLogin = form.down('button[action=login]');
		
		mainView.items.each(function(item) {
			item.setHidden(false);
		});
  	});
	
	afterAll(function() {
		// hide application for view
		mainView.items.each(function(item) {
			item.setHidden(true);
		});
  	});
  	
  	beforeEach(function(done) {
  		fieldId.setValue('');
		fieldPw.setValue('');
		dashboard = null;
		done();
	});
	
	afterEach(function(done) {
		if (dashboard) {
			KJERP.app.getController('KJERP.controller.Main').logout();
		}
		setTimeout( function() {
			Ext.Function.defer(function(){
			    Ext.ComponentQuery.query('messagebox').every( function(item) { 
					if (item.isVisible()) {
						item.close();
					}
					return true;
				});
			}, 500);
			done();
		}, 500);
	});
	
	it("valid user and show dashboard", function(done) {
		fieldId.setValue('sang@kjeng.kr');
		fieldPw.setValue('kjeng5650');
		btnLogin.fireEventArgs('click', [btnLogin]);  		
		setTimeout(function() {
			dashboard = mainView.down('dashboardmain');
			expect(dashboard).not.toBe(null);
			done();
		}, 500);
	});
	
	it("invalid password and show message", function(done) {
		fieldId.setValue('sang@kjeng.kr');
		fieldPw.setValue('gdfg');
		btnLogin.fireEventArgs('click', [btnLogin]);  		
		setTimeout(function() {
			dashboard = mainView.down('dashboardmain');
			expect(dashboard).toBe(null);
			done();
		}, 500);
	});
});  