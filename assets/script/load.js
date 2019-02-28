var game = require('game');
var config = require('config');

cc.Class({
	extends: cc.Component,

	properties: {
		//  headurl:"",
		//   headimg:cc.Sprite,

		label: cc.Label,
	},

	// LIFE-CYCLE CALLBACKS:
	// onLoad () {},

	start() {
		// this.headurl ="http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eobzficNbEN08ojWOZkkcQeADhHgPlEcAJPCkq3m3G4A0c0TTmHTnicJia2aICqn4wCkm1u746Vkalsw/132"+"?aa=aa.jpg";

		//this.checkCookie();

		//取得id
		var id = this.GetQueryString('id');
		if (id != null && id.toString().length > 1) {
			//alert(this.GetQueryString('id'));
			this.getinfo(id);
		}
		//this.loadgame();
	},	

	loadgame() {

		//cc.log('假装进入了游戏');
		//return;
		var self = this;

		cc.director.preloadScene(
			'main',
			(completedCount, totalCount, item) => {
				//进度回调
				//self.label.string = (completedCount+1 / totalCount).toFixed(2) ;
				var progress = '';
				progress = (((completedCount + 1) / (totalCount + 1)) * 100).toFixed(2);
				self.label.string = '( ' + progress + '% )';
				//console.log( progress);
				//this.progressBar.progress = completedCount / totalCount;
			},
			error => {
				//预加载结束
				if (error) {
				} else {
					//cc.loader.onProgress = null;
					//console.log( 'loading over');
					cc.director.loadScene('main');
				}
			}
		);
	},

	//获取用户信息
	getinfo(id) {		

		let url = config.host+'getinfo.php?id=' + id;
		var xhr = new XMLHttpRequest();
		
		var self = this;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
				var response = xhr.responseText;
				
				if (response != 'error') {
					var s = JSON.parse(response);

					cc.log(s);
					
					game.openid = s.id;
					game.nickname =s.username;
					game.coinnum = s.gamecoin-0;
					game.wallet = Math.round(s.coin-0);		
					game.cost = s.cost-0;
					game.bonus =s.bonus-0;
					game.price = s.price-0;
								
					//game.cost = cc.sys.localStorage.getItem('coin_cost');
					// game.bonus = cc.sys.localStorage.getItem('coin_bonus');
					// game.coinnum = cc.sys.localStorage.getItem('coin_num');
					// game.wallet = cc.sys.localStorage.getItem('coin_wallet');

					// game.nickname = s.nickname;

					// if (Math.abs(game.coinnum - s.coin) > 20) game.coinnum = s.coin;

					// game.lastsavenum = s.coin;
					// game.wallet = s.wallet;
					
					// if(s.avatar.length >0){ //头像不为空时加载头像
					// 	var headurl = s.avatar;
					// 	cc.loader.load(headurl, function(err, texture) {
					// 		//self.headimg.spriteFrame = new cc.SpriteFrame(texture);
					// 		game.headimg = texture;
					// 	});
					// }					

					self.loadgame();//读取完用户数据后加载游戏
				}else{
					//错误提示
					alert('用户数据错误');
				}
			}
		};
		xhr.open('GET', url, true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
		xhr.send();
	},

	//取出url后缀字符
	GetQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
		var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
		if (r != null) return unescape(r[2]);
		return null;
	},
});
