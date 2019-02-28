
cc.Class({
    extends: cc.Component,

    properties: {
       
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
