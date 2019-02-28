
var game = require('game'); 
cc.Class({
    extends: cc.Component,

    properties: {
        

        light:[cc.Node],       

        _triggerA_id:0,
        _triggerB_id:0,

        _isspecial:false,//是否为特别奖

        //触发统计,防止刚打开的灯,立即被触发改变
        _count:0,
       
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {    
        
        this.randomtrigger();               

        game.scoretrigger = this;

        this.node.on('trigger',this.trigger,this);
        
     },

     trigger(event){
        //cc.log('---trigger---' + event.id);

        if(!this._isspecial){
              
            if(event.id < 6){
                 this._count++;
                //加1分 该类水果分
                game.setscore(event.id,1);
                if( this._count>=3 && Math.random()< 0.4){
                    //this.offtrigger();
                    this.randomtrigger();
                }     
            } else{
                //触发out 清空对应 帽子分
                let i = Math.min(this._triggerA_id,this._triggerB_id);
                game.clearscore(i);        
                
                //重置触发灯
                //this.offtrigger();
                this.randomtrigger();
            }          
        }else{
            //特别奖模式
            //投中加对应的水果分,中帽子结束
            if(event.id >5){
                //投奖 结束,进入发奖阶段
                this.alloff();
               
            }else{
                //加 对应的 水果分
                game.prize += game.score[event.id];   
            }
        }      
     },

     //全开灯
     allon(){
         this._isspecial = true;
         game.prize =0;
         for(let i=0;i<this.light.length;i++)
            if(!this.light[i].active)
                this.light[i].active = true;
     },

     //全关灯
     alloff(){
        this._isspecial = false;
        for(let i=0;i<this.light.length;i++)
            //this.light[i].active = false;
            this.light[i].emit('sleep');

            game.ui.stoptimer();
            game.main.award(game.prize);
            game.prize =0;
     },

     ontrigger(A,B){
       
        //cc.log('--- on trigger ----'+ A +'   '+ B);
        this._count=0;
        this._triggerA_id = A;       
        this._triggerB_id = B;    
        
        if(!this.light[A].active)
            this.light[A].active = true;

        if(!this.light[B].active)
            this.light[B].active = true;         
     },

     offtrigger(){
        // this.light[this._triggerA_id].active = false;
        // this.light[this._triggerB_id].active = false;
        this.light[this._triggerA_id].emit('sleep');
        this.light[this._triggerB_id].emit('sleep');
     },

     randomtrigger(){
        if(this.light[this._triggerA_id].active)
            this.light[this._triggerA_id].emit('sleep');

        if(this.light[this._triggerB_id].active)
            this.light[this._triggerB_id].emit('sleep');

       
        let l1 =0;// Math.round(Math.random()*2);
        let l2 =3;//3+Math.round(Math.random()*2);

        //随机出和上次不一样的
        do{
            l1= Math.round(Math.random()*2);
        }while( l1 == this._triggerA_id);

        do{
            l2= 3+Math.round(Math.random()*2);
        }while( l2 == this._triggerB_id);

         //机率触发 out
        let r = Math.random();
        if(r<0.1)
            l1 = 6;
        if(r >0.9)
            l2=7;

        this.ontrigger(l1,l2);       
     },
     
     // start () {
    // },
    

    // onEndContact(contact, selfCollider, otherCollider){

    //     cc.log(Math.random()+'  !!    '+selfCollider.tag);

    //      let i = this._triggerB_id;
    //      if(selfCollider.tag-0 == 0)
    //          i = this._triggerA_id;
        
    //     //加1分 该类水果分
    //     game.setscore(i,1);

    //     //this.light[i].runAction(this._flash);    
    //     if(Math.random()< 0.4){
    //         this.offtrigger();
    //         this.randomtrigger();
    //     }        

    //     cc.log(Math.random()+'------over--------'+ +selfCollider.tag);
    // },

     t1(){
    //     this.offtrigger();
    //     //var i=this._triggerA_id;
    //     game.setscore(this._triggerA_id,1);
    //     //this.light[i].runAction(this._flash);
    //     this.randomtrigger();
        this.node.emit('trigger',{id:this._triggerA_id});    
     },

     t2(){
    //     //this.light[this._triggerA_id].color = this._dark;
    //     //this.light[this._triggerB_id].color = this._dark;
        
    //     this.offtrigger();
    //     game.setscore(this._triggerB_id,1);
    //     //var i=this._triggerB_id;
    //     //this.light[i].runAction(this._flash);
    //     this.randomtrigger();
        this.node.emit('trigger',{id:this._triggerB_id});    
    }

    // update (dt) {},
});
