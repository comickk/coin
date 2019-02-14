
cc.Class({
    extends: cc.Component,

    properties: {
      adtext:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.node.on('showad',this.showad,this);
     },

    // start () {
       
    // },

  

    showad(event){
        this.adtext.string = event.msg;
        //设置滚动动画
        this.adtext.node.x =300;
        var w = this.adtext.string.length*40;
        var time = w/100;

        var self =this;
        var finished = cc.callFunc(function () {
            self.node.active =false;
        }, this);

        var act =cc.sequence(
                    cc.repeat(
                        cc.sequence(
                            cc.moveBy(time, cc.v2(-600-w,0)),
                            cc.moveBy(0,cc.v2(600+w,0)),
                    ),3),
                    finished
                )
                
        this.adtext.node.runAction(act);
    },    
});
