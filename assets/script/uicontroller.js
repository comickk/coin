// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var game = require('game'); 
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
        score:{
            default:[],
            type:cc.Node,
        },

        scorenum:{
            default:[],
            type:cc.Label,
        },

        timer:cc.Label,
        _timernum:0,

        //_scoreact:cc.Action,       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        game.ui = this;
        // this._scoreact = cc.repeat(
        // cc.sequence(
        //     cc.scaleTo(0.2,0.8),
        //     cc.scaleTo(0.2,1))
        // ,2);

        this._timernum =60;
    },

    // start () {
    // },

    // update (dt) {},

    setscore(type,num){
        if(!cc.isValid(this.score[type])) return;
        cc.log('--------  score =' + num);
        this.scorenum[type].string = num;
        var act = cc.repeat(
            cc.sequence(
                cc.scaleTo(0.2,0.8),
                cc.scaleTo(0.2,1))
            ,2);
        this.score[type].runAction(act);
    },

    //计时器
    starttimer(){
        this._timernum =60;
        this.timer.node.active = true;
        this.schedule(this.runtimer,1);
    },

    runtimer(){       
        if(this._timernum > -1)
            this.timer.string = this._timernum--; 
        else{
            this.unschedule(this.runtimer);
            this.timer.node.active = false;
        }
    },

    // stoptimer(){
    //     this.timer.node.active = false;
    // },
});
