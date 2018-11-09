// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        otherCollider.node.active = false;        

        //再原位置生成新币
        let type=0;
        if(this.palletA.y > -60) type =1;
        var coin = cc.instantiate(this.coin[type]);       

        //设置新币属性
        let wp = otherCollider.node.convertToWorldSpaceAR(cc.Vec2.ZERO); 
        let np = this.palletA.convertToNodeSpaceAR(wp);
       // coin.position = otherCollider.node.position; 
        coin.position = np;
        coin.parent = this.palletA; 
        coin.children[0].rotation = otherCollider.node.rotation;    

        coin.y -= 13;         

        //销毁下落币
        otherCollider.node.destroy();       
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
