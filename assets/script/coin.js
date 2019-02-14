
cc.Class({
    extends: cc.Component,

    properties: {
       
        _collider:cc.PhysicsCircleCollider,
        _state:0,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this._collider = this.node.getComponent(cc.PhysicsCircleCollider);

         this.node.once('heave',function(){ this._state = 1;},this);
     },    

     update (dt) {
         if(this._state != 1) return;
         if(this._state == 1 ){
             this._state =2;
             this._collider.density = 50;
            this._collider.apply();
         }
     },
});
