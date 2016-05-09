describe('Login Service', function() {
	var mainView;
	beforeAll(function() {
		mainView = Ext.ComponentQuery.query('app-main')[0];
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

   	beforeEach(function() {
	});
	afterEach(function() { 
	});
	
	it('valid user login', function(done) {
		var data = {"email":"sang@kjeng.kr","pw":"kjeng5650","session":{}};
		var callback = function(result) {
			expect(result.operation).toBe(true);
			done();
		}
		KJERP.controller.Main.requestService('login', data, callback,null,false)
	});	
	
	it('invalid user login', function(done) {
		var data = {"email":"sang@kjeng.kr","pw":"kjengfdsf5650","session":{}};
		var callback = function(result) {
			expect(result.operation).toBe(false);
			done();
		}
		KJERP.controller.Main.requestService('login', data, callback,null,false)
	});	
});