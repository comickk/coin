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

        spin:cc.Node,
        roller:{
            default:[],
            type:cc.Node,
        },

        bg:{
            default:[],
            type:cc.Node
        },              

        zhuanpan:cc.Animation,
        feibiao:cc.Animation,


        //游戏模式： 0 正常时 投中spin 开启摇奖， 1 幸运转盘,投中spin 扔飞镖 
        _mode:0,

        _rolling:false,
        _count:0,

        //三个滚轴预期转到的值
        _expect:[0,0,0],

        _rolltime:0,

        //记录三个滚轴是否己停止，停止时(=1)播放声音
        _isstop:[0,0,0],

        _rollaudioID:0,

        //种奖类型
        _type:0,
    },

    //-224  32  160

    // LIFE-CYCLE CALLBACKS:

     onLoad () {

        this.node.on('roll',this.addroll,this);
        this._isstop =[0,0,0];
        
     },

    // start () {

    // },

    //计算预期值 并记录奖种
    getexpect(){
        var r = game.spinresult();
        this._type = r[3];
        cc.log('----spin------'+ r);
        for(let i=0;i<3;i++){
            this._expect[i] = -224 + r[i]*64;
        }
        //cc.log(this._expect);
    },

    addroll(evnet){
        if(this._mode ==1 ){
            this.stopzhuanpan();           
            return;
        }

        if( this._count >5 )return;
        
        this._count++;
        this.roll();
    },

    roll(){    
        if(!this._rolling) {
            //cc.log('-------start roll-------');
            this._rollaudioID = cc.audioEngine.play(game.audio.clip[1],true);
            this._rolling = true;
            this._count--;
            this.getexpect();
            this.schedule(this.runroll,0.05);
        }
    },

    runroll(){
       if(this._rolltime>3){
           var stop=true;
           for(let i=0;i<3;i++){
              // cc.log(i+'  --------------  '+this.roller[i].y);
                if(this.roller[i].y != this._expect[i]){
                    this.roller[i].y -= 16;
                    stop = false;
                }else{
                    if(this._isstop[i] == 0){
                        this._isstop[i] = 1;
                        cc.audioEngine.play(game.audio.clip[2]);
                    }                   
                }
           }     
           
           if(stop)
                this.stoproll();
       }else{
            for(let i=0;i<3;i++)       
                this.roller[i].y -= 16;   
       }


       for(let i=0;i<3;i++){
            if(this.roller[i].y <= -240)
                this.roller[i].y = 176

       this._rolltime +=0.05;
       }
    },

    stoproll(){       
        this.unschedule(this.runroll);
        cc.log('-------count -------' + this._count);
        this._rolling = false;
        this._rolltime=0;
        this._isstop =[0,0,0];
        cc.audioEngine.stop(this._rollaudioID);

        if(this._type >0)
            this.checkresult();
        else
            if(this._count>0)
                this.scheduleOnce(this.roll,1);
    },

    //检查 摇奖结果,并开奖
    checkresult(){
        if(this._type <11 ) return ;
        
        cc.log('中了  '+ this._type +'  奖! ');
        switch(this._type){
            case 11://双水果 奖励对应水果分
            break;
            case 21://三水果  转盘飞镖，中多少奖多少   60秒内投中spin 
                this._mode =1;//

                if(cc.audioEngine.isMusicPlaying())
                    cc.audioEngine.stopMusic();
                cc.audioEngine.playMusic(game.audio.bgm[3],true);
                this.bg[1].active  = true;
                game.ui.starttimer();
            break;
            case 31://双水果 + 小丑 ,60秒 投帽子，每中一个帽子加对应水果分,中out清空
                if(cc.audioEngine.isMusicPlaying())
                    cc.audioEngine.stopMusic();
                cc.audioEngine.playMusic(game.audio.bgm[2],true);
                this.bg[2].active  = true;
                game.ui.starttimer();
                this.spin.emit('pause');
            break;
            case 41://1小丑 500+
                if(cc.audioEngine.isMusicPlaying())
                    cc.audioEngine.stopMusic();
                cc.audioEngine.playMusic(game.audio.bgm[1]);
                this.bg[0].active  = true;         
                this.spin.emit('pause');       
            break;
            case 51://2小丑 1000+
                if(cc.audioEngine.isMusicPlaying())
                    cc.audioEngine.stopMusic();
                cc.audioEngine.playMusic(game.audio.bgm[1]);
                this.bg[0].active  = true;   
                this.spin.emit('pause');            
            break;
            case 61://3小丑 2000+
                if(cc.audioEngine.isMusicPlaying())
                    cc.audioEngine.stopMusic();
                cc.audioEngine.playMusic(game.audiobgm[1]);
                this.bg[0].active  = true;
                this.spin.emit('pause');
            break;
        }
    },
  
    stopzhuanpan(){
        this.feibiao.play();

        this.scheduleOnce(function(){
            this.zhuanpan.stop();      
             cc.log(  '--中了--' + this.angle2prize(   this.zhuanpan.node.rotation ));
        },0.5);
    },
    //将转盘角度转换成 对应的奖励
    angle2prize(ang){

        if(ang > 16 && ang <=45) return 1000;
        if(ang > 45 && ang <= 130) return 100;
        if(ang > 130 && ang <= 178) return 800;
        if(ang > 178 && ang <= 247) return 400;
        if(ang > 247 && ang <= 301) return 600;
        if(ang > 301 || ang <= 16) return 200;
        return 0;
    },

    // update (dt) {},
});
