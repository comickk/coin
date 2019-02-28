
cc.Class({
    extends: cc.Component,

    properties: {
        
        scroll:cc.Node,

        light:cc.Node,

        trigger:cc.PhysicsBoxCollider,
       
        //_flash:cc.Action,
    },

    // LIFE-CYCLE CALLBACKS:

      onLoad () {

    //     this._flash = cc.repeat(
    //          cc.sequence(
    //             cc.toggleVisibility(),
    //             cc.delayTime(0.3)),4);

        this.node.on('pause',this.pause,this);
        this.node.on('resume',this.resume,this);
    },

     start () {
        this.light.runAction(cc.hide());
        
     },

    // update (dt) {},

    //硬币穿过中心,开启滚轮
    onEndContact(contact, selfCollider, otherCollider){
        this.scroll.emit('roll');
       
        this.flash();
    },

    flash(){
        if(this.light.getNumberOfRunningActions()>=1) return;
        var act = cc.repeat(
            cc.sequence(
               cc.toggleVisibility(),
               cc.delayTime(0.3)),4);
        this.light.runAction(act);
    },

    //停止移动并关闭触发
    pause(event){
        this.node.getComponent(cc.Animation).pause();
       //resume();
       this.trigger.enabled = false;       
    },

    resume(event){
        this.node.getComponent(cc.Animation).resume();
        //resume();
        this.trigger.enabled = true;     
    },

    test(){
        this.scroll.emit('roll');
    }
});
