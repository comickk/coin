// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var game = require('game'); 
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        score:{
            default:[],
            type:cc.Node,
        },

        scorenum:{
            default:[],
            type:cc.Label,
        },

        headimg:cc.Sprite,

        adboard:cc.Node,

        //个人金币数
        coinnum:cc.Label,

        //钱包
        wallet:cc.Label,

        //计时器
        timer:cc.Label,

        //奖励数
        prize:cc.Label,

        _timernum:0,        

        _adboard:''
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        game.ui = this;
        // this._scoreact = cc.repeat(
        // cc.sequence(
        //     cc.scaleTo(0.2,0.8),
        //     cc.scaleTo(0.2,1))
        // ,2);

        for(let i=0;i<game.score.length;i++){
            this.scorenum[i].string = game.score[i];
        }

        this._timernum =60;

        this.headimg.spriteFrame = new cc.SpriteFrame(game.headimg);
        this.setcoinnum(game.coinnum);
        this.setwallet( game.wallet);        
    },

     start () {
      //  this.headimg.spriteFrame = new cc.SpriteFrame(game.headimg);

     //   this.wallet.string = game.wallet;



       // this.adboard.active = true;
      //  this.adboard.emit('showad',{msg:'adsflkajsdflkjasdlkfeioruwerjlwerjlwjel'});
        
      //定时取得公告
      this.schedule(  this.getadboard, 180, 5, 10);
    
    },

    getadboard(){
        cc.log('----------get adboard--------------');
        if(this._adboard ==''){
            let url ='http://weikeo.quantumsystem.com.cn/game/adboard.php';
            var xhr = new XMLHttpRequest();

            var self = this;
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;   
                    
                    if(response==''){
                        self.unschedule(self.getadboard);
                    }else{
                        self._adboard =response;
                        self.adboard.active = true;
                        self.adboard.emit('showad',{msg:response});
                    }
                }        
            }

            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
            xhr.send();
        }else{
            this.adboard.active = true;
            this.adboard.emit('showad',{msg:this._adboard});
        }
    },

    // update (dt) {},

    setscore(type,num){
        if(!cc.isValid(this.score[type])) return;
        //cc.log('--------  score =' + num);
        this.scorenum[type].string = num;
        var act = cc.repeat(
            cc.sequence(
                cc.scaleTo(0.2,0.8),
                cc.scaleTo(0.2,1))
            ,2);
        this.score[type].runAction(act);
    },

    //计时器
    starttimer(){
        this._timernum =60;
        this.timer.node.active = true;
        this.schedule(this.runtimer,1);
    },

    runtimer(){       
        if(this._timernum > -1)
            this.timer.string = this._timernum--; 
        else{
            this.unschedule(this.runtimer);
            this.timer.node.active = false;
            //超时,重置
            game.scroll.rest();
            game.scoretrigger.alloff();           
        }
    },

    stoptimer(){        
         this.unschedule(this.runtimer);
         this.timer.node.active = false;
    },

    setcoinnum(num){
        if(num-0 >=0 ){
            this.coinnum.string = num;
        }
    },

    setwallet(num){
        if(num-0 >=0 ){
            this.wallet.string = num;
        }
    },


});
