Ext.define('KJERP.controller.Login', {
	extend: 'KJERP.controller.Default',
    requires:[
    	'KJERP.view.login.Form'
    	/*
    	'KJERP.view.popup.RegistMember',
    	'KJERP.view.popup.FindID',
    	'KJERP.view.popup.FindPW',
    	'KJERP.view.widget.AgreementForm'
    	*/
    ],
    refs: [{
    	ref:'form', selector:'loginform'
    },{
   		ref:'work', selector:'job [name=work]' 
   	}, {
   		ref:'main', selector:'app-main'
   	}, {
   		ref:'menu', selector:'menutree'
   	}
   	],
	onActivate:function() {
		var me = this,
			form = me.getForm();
		form.down('label[name=chrome]').setVisible(!Ext.isChrome);
		me.loadLoginInfo();
	}, 
	loadLoginInfo:function() {			
		var me = this,
			form = me.getForm(),
			chkSaveId = form.down('[name=save_id]'),
			chkSavePass = form.down('[name=save_passwd]'),
			userId = form.down('[name=MEM_ID]'),
			userPass = form.down('[name=MEM_PW]');
		var save_id = localStorage.getItem('save_id');
		var save_passwd = localStorage.getItem('save_passwd');
		save_id = save_id==null?'':save_id;
		save_passwd = save_passwd==null?'':save_passwd;
		
		userId.setValue(save_id!=''?save_id:'');
		userPass.setValue(save_passwd!=''?save_passwd:'');
		
		chkSaveId.setValue(save_id!='');
		chkSavePass.setValue(save_passwd!='');
	},
	saveLoginInfo:function() {		
		var me = this,
			form = me.getForm(),
			chkSaveId = form.down('[name=save_id]'),
			chkSavePass = form.down('[name=save_passwd]'),
			userId = form.down('[name=MEM_ID]'),
			userPass = form.down('[name=MEM_PW]');
		
		localStorage.setItem('save_id',chkSaveId.getValue()?userId.getValue():'');
		localStorage.setItem('save_passwd',chkSavePass.getValue()?userPass.getValue():'');
	},
	saveAuthInfo:function(auth) {		
		store = Ext.getStore('AuthInfo');		
		store.loadData(auth.rows)
	},
	saveMemberInfo:function(member) {		
		//전역 변수에 가지고 있는다. 	\
		_USER.info = { 
				email:member.email,
				name:member.name,
				userGroupIdx:member.userGroupIdx, 
				companyName:member.companyName, 
				cpyIdx:member.companyIdx,						
				sessionID:member.sessionID
	    };
		
	},
	Menufilter:function(store){
					
	},
	initMenuNSelectFirst:function(result, selectFirst){				
		var me = this;
		//권한 정보를 저장함. 
		if (result) {
			me.saveAuthInfo(result);
		}
		main = me.getMain();			
		menu = me.getMenu();
		
		tree = menu.down('treepanel'),
		store = tree.getStore(),						
		rootNode = store.getRootNode();
		var showMenuCode=["999"];
				
		//var showAllMenu = true; // show for temporary
		
		var showAllMenu = false;	
		
		for(i=0;result.rows.length>i;i++){
						
			if(result.rows[i].read||result.rows[i].write||result.rows[i].exec){
				showMenuCode.push(result.rows[i].code);
			}
			
		}
		

		if(showAllMenu != true){
			store.clearFilter();
			store.filterBy(function(record, id){
			    return Ext.Array.indexOf(showMenuCode, record.get("code")) !== -1;
			}, this);
		}else{
			store.clearFilter();
		}
		if (selectFirst) {
			var firstRecord = store.getAt(0);
			if (firstRecord) {
				firstRecord.expand(true);
				tree.getSelectionModel().select(firstRecord);
			} else {
				Ext.Msg.alert(_MESSAGE.alertTitle, 'Need rights to use service. Ask to administrator');
			}
		}				
	},
   	login:function(userInfo) {   	
   		var me = this,
			main = me.getMain();
		//로그인 멤버 info 저장.
		me.saveMemberInfo(userInfo);
		
   		var callback = function(result) {
   			
   			me.saveLoginInfo();				  						  				     			
   			var job = main.down('job');
   			if (!job) {
   				job = Ext.widget('job'); 
   				main.add(job);
   			}
	  		main.layout.setActiveItem(job);
	  		me.initMenuNSelectFirst(result, true);
   			
    	};
    	
		var filters = [];
		filters.push({property:'userGroupIdx', value:userInfo.userGroupIdx});
		KJERP.controller.Main.requestService('getMyAuthByUserGroupIdx', {'filters':filters}, callback);
		
   	},
   	/*
   	 * Event Handler
   	 */
    onLogin:function() {
    	var me = this,
    		form = me.getForm(),
    		values = form.down('form').getValues();
    	
    	if (values.MEM_ID =='' || values.MEM_PW =='') {
    		
    		return;
    	}
    	
    	var callback = function(result) {
    		if (KJERP.controller.Main.isInValidResult(result)) return;
    		var row = result.rows[0];
    	
    		// 임시로 할당함..    		
    		row.sessionID = "clq2r83k3sqf125t2atpgm32l6";
			
			me.login(row);
			_SESSION_ID = row.sessionID;
			localStorage.setItem('session_id',row.sessionID);  
    	};
    	
		var data = {email:values.MEM_ID, pw:values.MEM_PW};
		KJERP.controller.Main.requestService('login', data, callback);
    },
    onAutoLogin:function() {    	
    	var me = this;
    	var callback = function(result) {    		
    		if (KJERP.controller.Main.isInValidResult(result)) return;    		
    		me.onLogin();    		
		};
		var filters = [];				
		filters.push({property:'sessionID', value:_SESSION_ID});	
		KJERP.controller.Main.requestService('checkSession', filters, callback);
    },
    
    onRegister:function() {    	
    	var me = this;
    	// 윈도우 팝업     	
//  		Ext.widget('registmember',{						
//		}).show();    	
    	Ext.create('Ext.window.Window',
    			{
					height:340,
                    width:420,
					title:'약관 동의',
					resizable:false,
                    modal : true,
					titleAlign : 'left',
                    layout : 'fit',
                    items : [{
                    	  		xtype: 'agreementform'                          		
                             }]
    			}
    	).show();
    },  	
    
    onAgree:function() {    	
    	var me = this;
    	// 윈도우 팝업     	
//  		Ext.widget('registmember',{						
//		}).show();    	
    	Ext.create('Ext.window.Window',
    			{
					height:600,
                    width:500,
					title:'개인정보 취급 방침',
					resizable:false,
                    modal : true,
					titleAlign : 'left',
                    layout : 'fit',
                    items : [{
                    	  		xtype: 'textarea',
								value:'개인정보보호정책 한국해양대학교가 취급하는 모든 개인정보는 관련법령에 근거하거나 정보주체의 동의에 의하여 수집·보유 및 처리되고 있습니다. 「공공기관의개인정보보호에관한법률」은 이러한 개인정보의 취급에 대한 일반적 규범을 제시하고 있으며, 한국해양대학교는 이러한 법령의 규정에 따라 수집·보유 및 처리하는 개인정보를 공공업무의 적절한 수행과 소속원의 권익을 보호하기 위해 적법하고 적정하게 취급할 것입니다.<br/>'+

									'또한, 한국해양대학교는 관련 법령에서 규정한 바에 따라 우리 대학교에서 보유하고 있는 개인정보에 대한 열람청구권 및 정정청구권 등 여러분의 권익을 존중하며, 여러분은 이러한 법령상 권익의 침해 등에 대하여 행정심판법에서 정하는 바에 따라 행정심판을 청구할 수 있습니다.<br/>'+
									
									'다음은 한국해양대학교의 개인정보보호방침을 설명 드리겠습니다. 우리 대학교의 개인정보보호방침은 한국해양대학교가 운영하는 홈페이지에서 이용자 여러분의 개인정보를 보호하기 위한 「홈페이지 이용자의 개인정보 보호」와 소관업무를 수행하는데 필요한 개인정보 취급에 대한 「컴퓨터에 의해 처리되는 개인정보 보호」 두 가지로 구성되어 있습니다.<br/>'+
									
									'한국해양대학교 홈페이지에서의 개인정보보호<br/>'+
									'여기는 한국해양대학교의 웹사이트입니다. 우리 대학교 홈페이지의 이용에 대해 감사드리며, 홈페이지에서의 개인정보보호방침에 대하여 설명을 드리겠습니다. 이는 현행 「공공기관의개인정보보호에관한법률」 및 「공공기관의 개인정보보호를 위한 기본지침」에 근거를 두고 있습니다.<br/>'+
									
									'우리 대학교에서 운영하고 있는 웹사이트는 다음과 같으며, 이 방침은 별도의 설명이 없는 한 우리 대학교에서 운용하는 모든 웹사이트에 적용됨을 알려드립니다.<br/>'+
									
									'http://www.hhu.ac.krhttp://english.hhu.ac.krhttp://japanese.hhu.ac.kr http://chinese.hhu.ac.kr http://amfuf.hhu.ac.kr http://archives.hhu.ac.kr http://bada.hhu.ac.krhttp://baeri.hhu.ac.kr http://bus.hhu.ac.kr http://ccc.hhu.ac.kr http://cee.hhu.ac.kr http://cgct.hhu.ac.krhttp://cisc.hhu.ac.kr http://cls.hhu.ac.kr http://club.hhu.ac.kr http://ctl.hhu.ac.kr http://cyberweb.hhu.ac.kr http://di.hhu.ac.kr http://dicma.hhu.ac.kr/ http://dorm.hhu.ac.kr/ http://eastasia.hhu.ac.kr http://e-book.hhu.ac.kr http://edu.hhu.ac.kr http://edu-graduate.hhu.ac.kr http://edutech.hhu.ac.kr http://eee.hhu.ac.kr http://eg.hhu.ac.kr http://energy.hhu.ac.kr http://eng.hhu.ac.kr http://europe.hhu.ac.kr http://gfund.hhu.ac.kr http://global.hhu.ac.kr http://graduate.hhu.ac.kr http://gw.hhu.ac.kr http://haksa.hhu.ac.kr http://hhuenglish.hhu.ac.kr http://homepage.hhu.ac.krhttp://ic.hhu.ac.krhttp://iima.hhu.ac.krhttp://imirc.hhu.ac.krhttp://innovation.hhu.ac.krhttp://int.hhu.ac.krhttp://ipsi.hhu.ac.krhttp://ite.hhu.ac.krhttp://jeonpa.hhu.ac.krhttp://kmuc.hhu.ac.krhttp://law.hhu.ac.krhttp://library.hhu.ac.kr<br/>'+
									'http://m.hhu.ac.kr<br/>'+
									'http://maritime.hhu.ac.krhttp://me.hhu.ac.kr http://m-eng.hhu.ac.kr http://miri.hhu.ac.kr http://mis-graduate.hhu.ac.kr http://mmt.hhu.ac.kr http://mmt-graduate.hhu.ac.kr http://mp.hhu.ac.kr http://mts.hhu.ac.kr http://museum.hhu.ac.kr http://myhome.hhu.ac.kr http://nav.hhu.ac.kr http://ob.hhu.ac.kr http://ocean.hhu.ac.kr http://ocean-aos.hhu.ac.kr http://ocean-dos.hhu.ac.kr http://ocean-meb.hhu.ac.kr http://ocean-ope.hhu.ac.kr http://oe.hhu.ac.kr http://onestop.hhu.ac.kr http://research.hhu.ac.kr http://rimst.hhu.ac.kr http://sanhak.hhu.ac.kr http://semi.hhu.ac.kr http://shipping.hhu.ac.kr http://shp.hhu.ac.kr http://smartnet.hhu.ac.kr http://stc.hhu.ac.kr http://uvrc.hhu.ac.kr http://uvrceng.hhu.ac.kr http://wdisk.hhu.ac.kr http://webzine.hhu.ac.kr http://wmail.hhu.ac.kr<br/>'+
									'자동으로 수집·저장되는 개인정보<br/>'+
									
									'여러분이 우리 대학교 홈페이지를 이용할 경우 다음의 정보는 자동적으로 수집·저장됩니다.<br/>'+
									'이용자 여러분의 인터넷서버 도메인과 우리 홈페이지를 방문할 때 거친 웹사이트의 주소<br/>'+
									'이용자의 브라우져 종류 및 OS<br/>'+
									'방문일시 등<br/>'+
									'위와 같이 자동 수집·저장되는 정보는 이용자 여러분에게 보다 나은 서비스를 제공하기 위해 홈페이지의 개선과 보완을 위한 통계분석, 이용자와 웹사이트간의 원활한 의사소통 등을 위해 이용되어질 것입니다. 다만, 법령의 규정에 따라 이러한 정보를 제출하게 되어 있을 경우도 있다는 것을 유념하시기 바랍니다.<br/>'+
									
									'이메일 및 웹 서식 등을 통한 수집정보<br/>'+
									
									'이용자 여러분은 우편, 전화 또는 온라인 전자서식 등을 통한 전자적 방법을 통해 의사를 표시할 수 있습니다. 이러한 방법의 선택에 있어 몇 가지 유의사항을 알려드립니다.<br/>'+
									
									'여러분이 홈페이지에 기재한 사항은 다른 사람들이 조회 또는 열람할 수도 있습니다.<br/>'+
									'여러분이 기재한 사항은 관련 법규에 근거하여 필요한 다른 사람과 공유될 수 있으며, 관련법령의 시행과 정책개발의 자료로도 사용될 수 있습니다.<br/>'+
									'또한, 이러한 정보는 타 부처와 공유되거나, 필요에 의하여 제공될 수도 있습니다.<br/>'+
									'홈페이지 보안을 위해 관리적·기술적 노력을 하고 있으나, 만약의 침해사고 시 문제가 될 수 있는 민감한 정보의 기재는 피하여 주시기 바랍니다.<br/>'+
									
									'웹사이트에서 운영하는 보안조치<br/>'+
									
									'홈페이지의 보안 또는 지속적인 서비스를 위해, 우리 대학교는 네트워크 트래픽의 통제(Monitor)는 물론 불법적으로 정보를 변경하는 등의 시도를 탐지하기 위해 여러가지 프로그램을 운영하고 있습니다.<br/>'+
									
									'링크 사이트·웹 페이지<br/>'+
									
									'한국해양대학교가 운영하는 여러 웹페이지에 포함된 링크 또는 배너를 클릭하여 다른 사이트 또는 웹페이지로 옮겨갈 경우 개인정보보호방침은 그 사이트 운영기관이 게시한 방침이 적용됨으로 새로 방문한 사이트의 방침을 확인하시기 바랍니다.<br/>'+
									
									'웹사이트 이용 중 다른 사람의 개인정보 취득<br/>'+
									
									'한국해양대학교가 운영하는 웹사이트에서 이메일 주소 등 식별할 수 있는 개인정보를 취득하여서는 아니 됩니다. 詐僞 기타 부정한 방법으로 이러한 개인정보를 열람 또는 제공받은 자는 「공공기관의개인정보보호에관한법률」 제23조의 규정에 의하여 처벌을 받을 수 있습니다.<br/>'+
									
									'개인정보 침해사항의 신고<br/>'+
									
									'우리 대학교의 웹사이트 이용 중 개인정보의 유출 가능성 등 정보주체의 권익이 침해될 우려가 있는 사실을 발견하였을 경우는 다음의 연락처로 알려주시기 바랍니다.<br/>'+
									
									'- 한국해양대학교 개인정보보호책임관<br/>'+
									
									'이메일 : mailadm@hhu.ac.kr<br/>'+
									'전화번호 : 410 - 4031 Fax : 405-2475<br/>'+
									'주소 : 우)606-791, 부산광역시 영도구 동삼동 1번지 한국해양대학교<br/>'+
									'컴퓨터에 의해 처리되는 개인정보보호에 대한 우리 대학교의 취급 및 보호방침<br/>'+
									'개인정보의 수집 및 보유<br/>'+
									
									'한국해양대학교는 법령의 규정과 정보주체의 동의에 의해서만 개인정보를 수집·보유합니다.<br/>'+
									
									'- 한국해양대학교가 법령의 규정에 근거하여 수집·보유하고 있는 개인정보화일은 다음과 같습니다.<br/>'+
									
									'학적화일<br/>'+
									'보유근거	학 칙<br/>'+
									'보유목적	각종 증명서 및 학생민원처리<br/>'+
									'주요항목	학번, 성명, 주민등록번호, 소속, 학년, 학적상태 등<br/>'+
									'보유기간	영구<br/>'+
									'입시관리 화일<br/>'+
									'보유근거	학 칙<br/>'+
									'보유목적	입학성적 및 입시현황 처리<br/>'+
									'주요항목	수험번호, 성명, 주민등록번호, 모집구분 및 모집단위, 수능 및 ?내신성적, 합격여부 등<br/>'+
									'보유기간	영구<br/>'+
									'직원 인사화일<br/>'+
									'보유근거	공무원 인사기록 및 인사 사무처리규정<br/>'+
									'보유목적	직원 인사 관리<br/>'+
									'주요항목	교번, 성명, 주민등록번호, 소속, 호봉, 병력사항, 발령사항 등<br/>'+
									'보유기간	영구<br/>'+
									'교원 등 인사화일<br/>'+
									'보유근거	공무원 인사기록 및 인사 사무처리규정<br/>'+
									'보유목적	교원 인사 관리<br/>'+
									'주요항목	교번, 성명, 주민등록번호, 소속, 호봉, 병력사항, 발령사항 등<br/>'+
									'보유기간	영구<br/>'+
									'우리 대학교는 보유하고 있는 소속원 여러분의 개인정보를 관계법령에 따라 적법하고 적정하게 처리하여, 권익이 침해받지 않도록 노력할 것입니다.<br/>'+
									
									'개인정보의 이용 및 제공의 제한<br/>'+
									
									'한국해양대학교가 수집·보유하고 있는 개인정보는 일반 행정정보와 달리 이용 및 제공에 엄격한 제한이 있는 정보입니다. 「공공기관의개인정보보호에관한법률」 제10조(이용 및 제공의 제한)는 이에 관하여 다음과 같이 규정하고 있습니다.<br/>'+
									
									'다른 법률에 의해 보유기관 내부에서 이용하거나 보유기관이외의 자에게 제공하는 경우<br/>'+
									'아래의 경우<br/>'+
									'정보주체의 동의가 있거나 또는 정보주체에게 제공하는 경우<br/>'+
									'다른 법률에서 정하는 소관업무를 수행하기 위해 당해 처리정보를 이용할 상당한 이유가 있는 경우<br/>'+
									'조약 기타 국제협정의 이행을 위해 외국정부 또는 국제기구에 제공하는 경우<br/>'+
									'통계작성 및 학술연구 등의 목적을 위해 특정개인을 식별할 수 없는 형태로 제공하는 경우<br/>'+
									'정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태로 놓여 있거나 주소불명 등으로 동의를 할 수 없는 경우로써 정보주체외의 자에게 제공하는 것이 명백히 정보주체에게 이익이 된다고 인정되는 경우<br/>'+
									'범죄의 수사와 공소의 제기 및 유지에 필요한 경우<br/>'+
									'법원의 재판업무수행을 위하여 필요한 경우<br/>'+
									'기타 대통령령이 정하는 특별한 사유가 있는 경우<br/>'+
									'한국해양대학교가 위 법령 및 기타 개별법에 근거하여 통상적으로 다른기관에 제공하는 개인정보 현황은 다음과 같습니다.<br/>'+
									
									'피제공 기관	개인정보화일명	제공주기	제공방법<br/>'+
									'관할세무서	근로소득자료	년1회	디스켓 송부<br/>'+
									'농협	등록금 대상자 자료	년2회	온라인<br/>'+
									'ARS업체	입시지원자 합격여부	년1회	온라인<br/>'+
									'국민연금관리공단	학적자료	년1회	온라인<br/>'+
									'우리 대학교는 개인정보의 이용 및 제공에 있어 관계법령을 엄수하여 부당하게 이용되지 않도록 노력하겠습니다.<br/>'+
									
									'개인정보화일의 열람 및 정정 청구<br/>'+
									
									'한국해양대학교가 보유하고 있는 개인정보화일은 「공공기관의개인정보보호에관한법률」(다른 법률에 규정이 있는 경우는 해당 법률)의 규정이 정하는 바에 따라 열람을 청구할 수 있습니다.<br/>'+
									
									'열람청구 절차(「공공기관의개인정보보호에관한법률」의 경우)<br/>'+
									'열람청구 절차<br/>'+
									'다음사항은 법 제13조 규정에 의하여 열람을 제한할 수 있습니다.<br/>'+
									'가. 다음 사항에 해당하는 업무로서 당해업무의 수행에 중대한 지장을 초래하는 경우<br/>'+
									
									'조세의 부과·징수 또는 환급에 관한 사항<br/>'+
									'교육법에 의한 각종 학교에서의 성적의 평가 또는 입학자의 선발에 관한 업무<br/>'+
									'학력·기능 및 채용에 관한 시험, 자격의 검사, 보상금·급부금의 산정 등 평가 또는 판단에 관한 업무<br/>'+
									'다른 법률에 의한 감사 및 조사에 관한 업무<br/>'+
									'토지 및 주택 등에 관한 부동산 투기를 방지하기 위한 업무<br/>'+
									'증권거래법에 의한 불공정증권거래를 방지하기 위한 업무<br/>'+
									'나. 개인의 생명·신체를 해할 우려가 있거나 개인의 재산과 기타 이익을 부당하게 침해할 우려가 있는 경우 본인의 개인정보를 열람한 정보주체는 다음의 경우 정정을 청구할 수 있습니다.<br/>'+
									
									'정정 청구의 범위<br/>'+
									'사실과 다르게 기록된 정보의 정정<br/>'+
									'특정항목에 해당사실이 없는 내용에 대한 삭제<br/>'+
									'정정 청구의 절차(「공공기관의개인정보보호에관한법률」의 경우)<br/>'+
									'정정청구 절차<br/>'+
									'권익침해 구제방법(「공공기관의개인정보보호에관한법률」의 경우)<br/>'+
									
									'「공공기관의개인정보보호에관한법률」 제12조(처리정보의 열람) 제1항 및 제14조제1항(처리정보의 정정)의 규정에 의한 청구에 대하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익이 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.<br/>'+
									
									'※ 행정심판에 대한 자세한 사항은 다음의 링크사이트를 참고하시기 바랍니다.<br/>'+
									
									'http://www.moleg.go.kr/judgement/guide/htms/guide00.html<br/>'+
									
									'※ 행정심판위원회 전화번호 안내(법제처 홈페이지 참조)<br/>'+
									
									'서울시 행정심판위(02) 731-6157, 6557	강원도 행정심판위(033) 249-2132, 2478<br/>'+
									'부산시 행정심판위(051) 888-2212	충북도 행정심판위(043) 220-2321∼4<br/>'+
									'대구시 행정심판위(053) 429-2137	충남도 행정심판위(042) 251-2133<br/>'+
									'인천시 행정심판위(032) 440-2292	전북도 행정심판위(063) 280-2132<br/>'+
									'광주시 행정심판위(062) 606-2132	전남도 행정심판위(062) 607-2131<br/>'+
									'대전시 행정심판위(042) 600-2152	경북도 행정심판위(053) 429-2137<br/>'+
									'울산시 행정심판위(053) 229-2132	경남도 행정심판위(055) 279-2133<br/>'+
									'경기도 행정심판위(031) 249-2132, 2881	제주도 행정심판위(064) 710-2272<br/>'+
									'개인정보보호책임관의 이메일 등 연락처<br/>'+
									
									'한국해양대학교는 개인정보의 적법성 및 절차의 적정성을 확보하여 소속원의 권익보호 및 공공업무의 적정한 수행을 도모하기 위해 개인정보보호책임관을 다음과 같이 지정·운영하고 있습니다. 우리 학교가 보유하고 있는 개인정보화일과 우리 학교의 개인정보보호방침 등에 관한 문의·확인 등은 다음의 연락처로 하여 주시기 바랍니다.<br/>'+
									
									'한국해양대학교 개인정보보호책임관<br/>'+
									'이메일 : mailadm@hhu.ac.kr<br/>'+
									'전화번호 : 410 - 4031 Fax : 405-2475<br/>'+
									'주소 : 우)606-791, 부산광역시 영도구 동삼동 1번지 한국해양대학교<br/>'+
									'개인정보화일에 대한 문의<br/>'+
									'보유부서	개인정보화일명	전화번호<br/>'+
									'총무과	직원 인사화일	410-4032~4034,4106<br/>'+
									'교무과	교원 등 인사화일	410-4012~4014<br/>'+
									'학사과	학적화일	410-4018~20<br/>'+
									'입학관리과	입시관리 화일	410-4777~4779<br/>'+
									'대학원	대학원 학사관리화일	410-4172~4173<br/>'+
									'정보전산원	전산자료관리	410-4092~4095,5091~5093<br/>'+
									'법령의 규정 등에 의하여 수집한 개인정보가 수집 및 처리목적에 맞게 이용될 수 있도록 항시 지도·감독하겠습니다.<br/>'+
									
									'한국해양대학교'
                          		
                             }]
    			}
    	).show();
    },  
    
    findID:function() {    	
    	var me = this;					
		Ext.create('KJERP.view.popup.FindID',{  					
		}).show();
    },  	
    findPW:function() {    	
    	var me = this;	    
		Ext.create('KJERP.view.popup.FindPW',{
		}).show();
    },  	
    onPasswordKey:function(cmp, e, opt) {
    	var me = this;
    	if (e.getKey() === Ext.EventObject.ENTER) {
    		me.onLogin();
        }
    },
    init:function() {    	    	
    	var me = this;     	
    	if(_SESSION_ID != ''){ //_SESSION_ID가 null이 아니고 로그 아웃 새로 고침하면 _SESSION_ID은 null이 된다. 
	    	//if(localStorage.getItem('session_id')){ //세션 ID가 있으면 세션 아이디 체크	    		    
	    		me.onAutoLogin();
	    	//}    	
    	}
    	me.control({
			'loginform button[action=login]': {
				click:me.onLogin
    		},
    		'loginform button[action=register]': {
				click:me.onRegister
    		},
    		'loginform button[action=agree]': {
				click:me.onAgree
    		},
			'loginform button[action=reset]': {
				click:me.onReset
    		},
    		'loginform button[action=forgetID]': {
				click:me.findID
    		},
    		'loginform button[action=forgetPW]': {
				click:me.findPW
    		},
    		'loginform textfield[name=MEM_PW]': {
				keyup:me.onPasswordKey
    		},
    		'loginform':{
    			activate:me.onActivate
    		}
    	});	
    }
});
