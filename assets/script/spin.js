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
