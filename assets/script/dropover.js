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
        palletA:cc.Node,
        lay:cc.Node,


        coin:{
            default:[],
            type:cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    //start () {
   // },

    // update (dt) {
       
    // },

    onEndContact(contact, selfCollider, otherCollider) { 

        //cc.log('-------onEndContact-------');
        //先隐藏下落的币
        //var coin = otherCollider.node;
        var coin;
       
        try{
        otherCollider.node.active = false; 
        
        let type=0;
        if(this.palletA.y > -60) type =1;

       
        //再原位置生成新币
        if(game.main._pushcoins.size() >0){
            coin = game.main._pushcoins.get();
            if(type==0) coin.group ='coinA1';
            else coin.group ='coinA2';
            coin.active = true;           
        }else{
            coin = cc.instantiate(this.coin[type]);              
        }      

        //设置新币属性
        let wp = otherCollider.node.convertToWorldSpaceAR(cc.Vec2.ZERO); 
        let np = this.palletA.convertToNodeSpaceAR(wp);
       // coin.position = otherCollider.node.position; 
        coin.position = np;
        coin.parent = this.palletA; 
        coin.children[0].rotation = otherCollider.node.rotation;    

        coin.y -= 13;         

        //回收下落币
        if(otherCollider.node.group =='coin')        
            game.main._dropcoins.put(otherCollider.node);
        else
            otherCollider.node.destroy();   
        }catch(e){
            cc.log(e);               
            cc.log(coin);
        }
    },

    // onPostSolve: function (contact, selfCollider, otherCollider) {
    //     cc.log('--------onPostSolve------');
    // }

    test:function(){
        if(this.coin){
            cc.log('----------');           
            let rig= this.coin.getComponents(cc.RigidBody);
            //rig.active = false;

            rig.gravityScale=0;
            rig.linearVelocity = cc.Vec2(0,100);
            rig.angularVelocity = 0;

            //this.coin =null;
        }
    },
});
