
cc.Class({
    extends: cc.Component,

    properties: {
       
        selfID:0,
        _sleep:false,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.node.on('sleep',function(event){
            this._sleep  = true;
        },this);
     },

    onEndContact(contact, selfCollider, otherCollider){
        this.node.parent.emit('trigger',{id:this.selfID});        
    },

    update(){
       if(this._sleep) this.node.active = false;
    },

    onEnable(){
        this._sleep =false;
    },
});
