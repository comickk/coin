
cc.Class({
    extends: cc.Component,

    properties: {
      
    },
    
    //},
    onBeginContact(contact, selfCollider, otherCollider){
                        //var self = this;
               // cc.log('---------slow---------');
               // otherCollider.node.active = false;
                        //let phy =otherCollider.node.getComponent(cc.PhysicsCircleCollider);//.enabled=false;
                
                //otherCollider.density = 1000;
                otherCollider.node.emit('heave');
                //otherCollider.apply();
                //let rig= otherCollider.node.getComponent(cc.RigidBody);//.active= false;
                //rig.linearVelocity = cc.v2(0,-600);
                        //let rig= otherCollider.node.getComponent(cc.RigidBody);//.active= false;
                        //rig.linearVelocity = cc.v2(0,-300);
        
                        //rig.applyForceToCenter(cc.Vec2(0,-300),true);
                //cc.log(otherCollider);
                //otherCollider.node.active=  true;
           },

    // update (dt) {},
});
