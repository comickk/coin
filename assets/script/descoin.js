
var game = require('game'); 
cc.Class({
    extends: cc.Component,

    properties: {
       
        isaddcoin:false,
    },

   

    addcoin(){       
        game.getcoin(1);
        cc.audioEngine.play(game.audio.clip[0]);
    },

    onBeginContact(contact, selfCollider, otherCollider){
        otherCollider.node.active = false;
        //otherCollider.node.destroy();
        let rig= otherCollider.node.getComponent(cc.RigidBody);//.active= false;
        rig.gravityScale=0;
        rig.linearDamping=1;
        otherCollider.density =5;
        
        game.main._pushcoins.put(otherCollider.node);

        if(this.isaddcoin)
            this.addcoin();        
    }
    // update (dt) {},
});
