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
        
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        var manager = cc.director.getPhysicsManager();

        manager.enabled = true;


        var draw = cc.PhysicsManager.DrawBits;
       manager.debugDrawFlags = draw.e_shapeBit|draw.e_jointBit;

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
     },

    start () {

        this._lastP = this.pusher.position;
        
        var act = cc.repeatForever (cc.sequence(
            cc.moveBy(1.2,0,-70),
            cc.moveBy(1.2,0,70)
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

        
    },

     update (dt) {

        this.setPalletAcoin();
     },

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
        var coin = cc.instantiate(this.coin);
        coin.parent = this.lay[0];
        coin.y=850+ (Math.random()-0.5)*25;
        coin.x =270+ (Math.random()-0.5)*25;

        game.cost++;
       // cc.log(coin.position);
     },

     btnarm(){
        if(this._armstop)
            this.arm.resume();
        else
            this.arm.pause();

        this._armstop = !this._armstop;
     },     

    //  test(){
    //      cc.log(this.pusher.children);
    //  },

     dropover(){
        let collider = this.getComponent(cc.PhysicsCircleCollider);

        if(cc.isValid(collider))
            collider.enabled = true;
     },
     test(){
         cc.log('---- cost: '+ game.cost +'  ------ bonus: '+ game.bonus+'  ----- '+game.bonus/game.cost);
     },
});
