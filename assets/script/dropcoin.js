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
        //_act:cc.Action,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

   // start () {
        //this._act = cc.sequence(cc.moveBy(0.5,0,-200),this.desact);
    //},

    //desact(){
        //cc.log('-----------  +1 coin!');
   // },

//    onBeginContact(contact, selfCollider, otherCollider){
//                 //var self = this;
//                 cc.log('---------onBeginContact---------');
//        // otherCollider.node.active = false;
//                 //let phy =otherCollider.node.getComponent(cc.PhysicsCircleCollider);//.enabled=false;
//         otherCollider.density = 100;
//         //let rig= otherCollider.node.getComponent(cc.RigidBody);//.active= false;
//         //rig.linearVelocity = cc.v2(0,-600);
//                 //let rig= otherCollider.node.getComponent(cc.RigidBody);//.active= false;
//                 //rig.linearVelocity = cc.v2(0,-300);

//                 //rig.applyForceToCenter(cc.Vec2(0,-300),true);
//         otherCollider.node.active=  true;
//    },

    onEndContact(contact, selfCollider, otherCollider){

        //var self = this;
        //cc.log('---------onEndContact---------');
        otherCollider.node.active = false;
        // otherCollider.node.getComponent(cc.PhysicsCircleCollider).enabled=false;
        let rig= otherCollider.node.getComponent(cc.RigidBody);//.active= false;
        rig.gravityScale=1;
        rig.linearDamping=0;//linearVelocity = cc.v2(0,-800);

        //rig.applyForceToCenter(cc.Vec2(0,-300),true);
        otherCollider.node.active=  true;

       // otherCollider.node.runAction( self._act);
    }

    // update (dt) {},
});
