
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

        pusher:cc.Node,
        arm:cc.Animation,

        coin:cc.Prefab,

        lay:{
            default:[],
            type:cc.Node
        },
        _lastP:cc.p,

        _armstop:false,

        // _drop:cc.Action,
        // _dropcoin:null,

        //投币缓冲
        _pushcoin:0,
        _prizecoin:0,

        _dropcoins:null,
        _pushcoins:null,
        
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        var manager = cc.director.getPhysicsManager();

        manager.enabled = true;


       //var draw = cc.PhysicsManager.DrawBits;
       //manager.debugDrawFlags = draw.e_shapeBit|draw.e_jointBit;

        //    this._drop = cc.sequence(
        //        cc.moveBy(0.1,0,50),
        //        cc.callFunc(function(){
        //             if(Math.random()>0.5)               
        //                 coin.group ='coinB1';
        //             else 
        //                 coin.group = 'coinB2';      
        //            cc.log('-------drop over-------');
        //        })
        //    );

        game.main = this;
        //注册发奖事件
        //this.node.on('award',this.award,this);   

        // cc.Canvas.instance.node.width =window.innerWidth;
        // cc.Canvas.instance.node.height =window.innerHeight;

        // cc.log(cc.Canvas.instance.node);
        //|| document.documentElement.clientHeight
        // document.body.clientHeight;

        // cc.log("----window ----" + window.innerWidth + '   '+ window.innerHeight);
        // cc.log("----documentElement ----" + document.documentElement.clientWidth + '   '+ document.documentElement.clientHeight);
        // cc.log("----body ----" + document.body.clientWidth + '   '+ document.body.clientHeight);
        // cc.log("----screen -----"+ screen.availWidth + '    '+ screen.availHeight);


        // cc.Canvas.instance.node.width = screen.availWidth;
        // cc.Canvas.instance.node.height = screen.availHeight;

        this.checkwxjsbridge();

        this._dropcoins = new cc.NodePool();
        this._pushcoins = new cc.NodePool();
    },

    start () {

        this._lastP = this.pusher.position;
        
        var act = cc.repeatForever (cc.sequence(
            cc.moveBy(1.2,0,-50),
            cc.moveBy(1.2,0,50)
        ));

        this.pusher.runAction(act);
        // // 开启物理步长的设置
        // manager.enabledAccumulator = true;

        // // 物理步长，默认 FIXED_TIME_STEP 是 1/60
        // manager.FIXED_TIME_STEP = 1/30;

        // // 每次更新物理系统处理速度的迭代次数，默认为 10
        // manager.VELOCITY_ITERATIONS = 8;

        // // 每次更新物理系统处理位置的迭代次数，默认为 10
        // manager.POSITION_ITERATIONS = 8;      
        
        // for(let i=0;i<this.pusher.childrenCount;i++){
        //     this.pusher.children[i].zIndex =i;
        //   cc.log(this.pusher.children[i].zIndex);
        // }

        //投币缓冲器,每秒中最快出3个币
        this.schedule(this.pushcoin,0.2);        

        // window.onbeforeunload = onbeforeunload_handler;   
        // //window.onunload = onunload_handler;   

        // function onbeforeunload_handler(){   
        //     var warning="确认关闭";     
        //     game.savecoin();            
        //     return warning;   
        // }  
    },

     update (dt) {

        this.setPalletAcoin();
     },

    //  onDestroy(){        
    //     game.savecoin();
    //  },

     //设置托盘A上的金币随托盘A 一起运动
     setPalletAcoin(){
        var x = this.pusher.x-this._lastP.x;
        var y = this.pusher.y- this._lastP.y;       
        
        for(let i=0;i<this.pusher.childrenCount;i++){
                  
            this.pusher.children[i].x += x;
            this.pusher.children[i].y += y;           

            //if(this.pusher.children[i].name=='pusherB') continue;
            if(this.pusher.children[i].y <= -150){               
                var coin = this.pusher.children[i];
                coin.active=false;
            //    // cc.log('--------------'+this.pusher.children[i]); 
                if(Math.random()>0.5)               
                    coin.group ='coinB1';
                else 
                    coin.group = 'coinB2';

                //coin.getComponent(cc.Animation).play();
                coin.getComponent(cc.PhysicsCircleCollider).enabled = false;
                //coin.getComponent(cc.RigidBody).enabled = false;
                
                var act = cc.sequence(
                    cc.moveBy(0.18,0,-55),
                    cc.callFunc(function(){
                        //cc.log('------drop-------');
                        this.getComponent(cc.PhysicsCircleCollider).enabled = true;
                        //this.getComponent(cc.RigidBody).enabled = true;
                    },coin)
               );

                //coin.y -= 20;
                coin.active=true;

                coin.runAction(act);
                //coin.runAction(this._drop); 
                coin.parent = this.lay[2];
            }
            
        }
        this._lastP = this.pusher.position;        
     },

     btnpushcoin(){     
        if(this._prizecoin>0) return;
        if(!game.pushcoin()) return;       

        this._pushcoin++;
       // cc.log(coin.position);
     },

     //摇臂
     btnarm(){
        if(this._armstop)
            this.arm.resume();
        else
            this.arm.pause();

        this._armstop = !this._armstop;
     },     

    //充值
     btnpay(){
        //向服务端发送 兑换信息
        this.exchange(1);
     },

    //  test(){
    //      cc.log(this.pusher.children);
    //  },

    pushcoin(){       
        if(this._pushcoin <= 0 && this._prizecoin <= 0) return;
        if(this._prizecoin >0){
            this._prizecoin--;
            game.ui.prize.string = this._prizecoin;
            if(this._prizecoin == 0)       
                this.endaward();        
        
        }else
            this._pushcoin--;

        var coin;
        
        if(this._dropcoins.size() >0){            
            coin = this._dropcoins.get();            
        }else{
            coin = cc.instantiate(this.coin);            
        }   
        coin.active = true;
        coin.parent = this.lay[0];
        coin.y=790+ (Math.random()-0.5)*25;
        coin.x =270+ (Math.random()-0.5)*25;
    },

     dropover(){
        let collider = this.getComponent(cc.PhysicsCircleCollider);

        if(cc.isValid(collider))
            collider.enabled = true;
     },

     //发奖金,停止 spin  和 trigger light
     award(prize){
        //cc.log('------ 获奖金币----' + prize);
        if(prize >0)      {
            this._prizecoin = prize;
            game.ui.prize.string = this._prizecoin;
            game.ui.prize.node.active = true;
        }
        else
            this.endaward();
     },

     //发奖结束,恢复正常模式
     endaward(){
       // cc.log('-----end award------');
       game.ui.prize.node.active = false;
        game.scroll.rest();
        game.ui.stoptimer();
        game.scoretrigger.randomtrigger();
     },

     test(){
         cc.log('---- cost: '+ game.cost +'  ------ bonus: '+ game.bonus+'  ----- '+game.bonus/game.cost);
     },

     //兑换
     exchange(num){

        if(game.openid =='') return;

        let url ='http://weikeo.quantumsystem.com.cn/game/exchange.php?openid='+game.openid+'&num='+num+'&coin='+game.coinnum;
        cc.log(url);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                
                console.log(response);
                if(response != 'error'){
                    var s = JSON.parse(response);

                    game.exchange(s.coin-0,s.wallet-0);
                }                   
            }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
        xhr.send();
     },     

     checkwxjsbridge()
     {
        var self =this;
         
        if (typeof WeixinJSBridge == "undefined"){
            //  if( document.addEventListener ){
            //      document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
            //  }else if (document.attachEvent){
            //      document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady); 
            //      document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);                
            //  }    

            //本地读取
            game.localload();
            //非微信浏览器     关闭浏览器时保存
            window.addEventListener("beforeunload", function(e) {        
                game.localsave();  //本地保存
            }, false); 
             
          }else{
            
            self.pushHistory();
 
            //返回时保存
            window.addEventListener("popstate", function(e) {        
                game.savecoin();              

                WeixinJSBridge.invoke('closeWindow',{},function(res){
                         //alert(res.err_msg);
                });            
           
            }, false);    
            
            //关闭时保存
            // window.onbeforeunload=function(){                 
            //     game.savecoin(); 
            // };
            // window.addEventListener("beforeunload", function(e) {        
            //     game.savecoin();  
            // }, false); 
        } 
     },

     pushHistory() {  
         var state = {  
             title: "title",  
             url: "#"  
         };  
         window.history.pushState(state, "title", "#");  
     } ,

});
