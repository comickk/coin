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

        light:[cc.Node],

        _triggerA:cc.PhysicsBoxCollider,
        _triggerB:cc.PhysicsBoxCollider,

        _dark:cc.Color,

        _triggerA_id:0,
        _triggerB_id:0,

        //_flash:cc.Action,
       
        //_flash_id:0,
        //_flashend:null,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {

        this._dark = new cc.color(75,75,75,255);
        // 取得两个触发器
        var box = this.node.getComponents(cc.PhysicsBoxCollider);
        this._triggerA = box[0];
        this._triggerB = box[1];
        
        this.randomtrigger();
        
        //设置闪烁动作
        // this._flash =  cc.sequence(
        //        // cc.tintTo(0.3, 75,75,75),
        //         cc.tintTo(0.3, 255,255,255),
        //         cc.tintTo(0.3, 75,75,75),
        //         cc.tintTo(0.3, 255,255,255),
        //         cc.tintTo(0.3, 75,75,75));

        // this._flashend = cc.callFunc( function(){

        // },this)
     },

     ontrigger(A,B){
       
        this._triggerA_id = A;       
        this._triggerB_id = B;

        this.light[A].color = cc.Color.WHITE;
        this.light[B].color = cc.Color.WHITE;

        //this.node.active = false;
        this._triggerA.enabled = true;
        this._triggerB.enabled = true;
        
        this._triggerA.offset = this.light[A].position;
        this._triggerB.offset = this.light[B].position; 

        this.node.active = true;        
     },

     offtrigger(){

        this._triggerA.enabled = false;
        this._triggerB.enabled = false;

        this.light[this._triggerA_id].color = this._dark;
        this.light[this._triggerB_id].color = this._dark;
     },

     randomtrigger(){
        let l1 = Math.round(Math.random()*2);
        let l2 = 3+Math.round(Math.random()*2);

        this.ontrigger(l1,l2);       
     },
     
     // start () {
    // },
    

    onEndContact(contact, selfCollider, otherCollider){

        cc.log(Math.random()+'  !!    '+selfCollider.tag);

         let i = this._triggerB_id;
         if(selfCollider.tag-0 == 0)
             i = this._triggerA_id;
        
        //加1分 该类水果分
        game.setscore(i,1);

        //this.light[i].runAction(this._flash);    
        if(Math.random()< 0.4){
            this.offtrigger();
            this.randomtrigger();
        }        

        cc.log(Math.random()+'------over--------'+ +selfCollider.tag);
    },

    t1(){
        this.offtrigger();
        //var i=this._triggerA_id;
        game.setscore(this._triggerA_id,1);
        //this.light[i].runAction(this._flash);
        this.randomtrigger();
    },

    t2(){
        //this.light[this._triggerA_id].color = this._dark;
        //this.light[this._triggerB_id].color = this._dark;
        
        this.offtrigger();
        game.setscore(this._triggerB_id,1);
        //var i=this._triggerB_id;
        //this.light[i].runAction(this._flash);
        this.randomtrigger();
    }

    // update (dt) {},
});
