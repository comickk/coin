var game = require('game');
var config = require('config');
cc.Class({
    extends: cc.Component,

    properties: {

        num_wallet:cc.Label,
        num_coin:{
            default:[],
            type:cc.Label
        },

        selected:{
            default:[],
            type:cc.Node
        },

        _lock:false,//兑换时锁定

        _exnum:1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.num_wallet.string =game.wallet;//玩家当前拥有的数字币
        //换算1、10、100 个数字币能兑换的游戏数量
        this.num_coin[0].string = game.price; 
        this.num_coin[1].string = game.price*10; 
        this.num_coin[2].string = game.price*100; 
    },

    onEnable(){
        this._lock = false;
        this._exnum=0;
        this.selected[0].active =false;
        this.selected[1].active =false;
        this.selected[2].active =false;
    },

    btn_close(){
        this.node.active = false;        
    },

    btn_exchange(){
        if (!this._lock && this._exnum >0 && game.openid == '') return;

        if(this._exnum > game.wallet){
            alert('你的数字币不足');
            return;
        }
        var self = this;
		let url =config.host +'exchange.php?openid=' +
			game.openid +
			'&num=' +
			this._exnum +
			'&coin=' +
			game.coinnum;
		//cc.log(url);
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
				var response = xhr.responseText;

				console.log(response);
				if (!response.includes('error') ) {
					var s = JSON.parse(response);
                    
                    game.exchange(s.coin - 0, s.wallet - 0);
                    self.num_wallet = s.wallet;
                    self._lock = false;

                    this.node.active = false; 
				}else{
                    alert('兑换失败');
                    self._lock = false;
				}			
            }
		};
		xhr.open('GET', url, true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
        xhr.send();
        this._lock = true;
    },

    btn_select(event, customEventData){
        //cc.log(customEventData)
        switch(customEventData){
            case '1':
                this._exnum = 1;
                this.selected[0].active =true;
                this.selected[1].active =false;
                this.selected[2].active =false;
            break;
            case '10':
                this._exnum = 10;
                this.selected[0].active =false;
                this.selected[1].active =true;
                this.selected[2].active =false;
            break;
            case '100':
                this._exnum = 100;
                this.selected[0].active =false;
                this.selected[1].active =false;
                this.selected[2].active =true;
            break;
        }
    },
    // update (dt) {},
});
