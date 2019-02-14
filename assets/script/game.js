var Global={  

    ver:101,
    //URL:"http://www.hengshengsj.com/",


    //玩家信息
    openid:'',
    nickname:'',
    headimg:cc.Texture2D,
    wallet:0,


    issaved:0,//用于检测是否存档
    //玩家金币数
    coinnum:100,

    //玩家花费的
    cost:1,
    //玩家获得的奖励
    bonus:1,

    //水果分
    score:[8,8,8,8,8,8],   


    //据上次中奖 摇奖的次数
    spinnum:0,

    //当前奖金
    prize:0,
   
    main:null,
    //spin:null,
    scroll:null,
    scoretrigger:null,
    audio:null,
    ui:null,

    //-----------中奖规则配置--------------
    //中奖率
      //头奖 3小丑  1% 
            //头奖 2小丑  2%
            // 头奖 1小丑  5%   
            //特殊 双水果+ 小丑  5%
            //幸运 三水果  10%
            //一般 双水果 57%
    probability:[0.01,  0.03,  0.08,   0.13,  0.23, 0.7],
                //1200    650     350      250     100    30
    mininterval :3,//低于 不会中奖
    maxinterval :30,//超过 提升中奖率,
    addition:1,   //每次提高中奖率的 加成量   

    mincost:[0,0,0,0,0,0],//中奖最低消耗币量

    lastsavenum:0,//上次存储时的数量


    pushcoin:function(){
        if(this.coinnum <= 0) return false;
        this.coinnum--;

        this.cost++;
        this.mincost[0]++;
        this.mincost[1]++;
        this.mincost[2]++;
        this.mincost[3]++;
        this.mincost[4]++;
        this.mincost[5]++;

        cc.sys.localStorage.setItem('coin_cost', this.cost-0);
        cc.sys.localStorage.setItem('coin_num', this.coinnum-0);

        if(Math.abs( this.lastsavenum - this.coinnum )>20){
            this.lastsavenum = this.coinnum;
            this.savecoin();
        }

        this.ui.setcoinnum(this.coinnum);
        return true;
    },

    getcoin:function(num){
        this.coinnum++;

        this.bonus++;
        cc.sys.localStorage.setItem('coin_bonus', this.bonus-0);

        cc.sys.localStorage.setItem('coin_num', this.coinnum-0);
        if(Math.abs( this.lastsavenum - this.coinnum )>20){
            this.lastsavenum = this.coinnum;
            this.savecoin();
        }

        this.ui.setcoinnum(this.coinnum);
    },

    //钻石兑换金币
    exchange:function(coin,wallet){
        this.coinnum =coin;
        this.wallet = wallet;

        cc.sys.localStorage.setItem('coin_num', this.coinnum-0);
        cc.sys.localStorage.setItem('coin_wallet', this.wallet-0);

        this.ui.setcoinnum(coin);
        this.ui.setwallet(wallet);
    },

    // fun:function(){  
    // },    

    setscore:function(type,num){

        if(this.score[type]>= 100 ) return;

        this.score[type] += num;
        this.ui.setscore(type,this.score[type]);
    },

    clearscore:function(type){
        this.score[type] =0;
        this.ui.setscore(type,this.score[type]);
    },

    //本地存储
    localsave:function(){
      //  if (typeof WeixinJSBridge == "undefined"){//非微信浏览器保存
            
      cc.sys.localStorage.setItem('coin_num', this.coinnum-0);
      cc.sys.localStorage.setItem('coin_wallet', this.wallet-0);
      cc.sys.localStorage.setItem('coin_cost', this.cost-0);
      cc.sys.localStorage.setItem('coin_mincost',JSON.stringify(this.mincost));
      cc.sys.localStorage.setItem('coin_score',JSON.stringify(this.score));
      cc.sys.localStorage.setItem('coin_save', this.issaved);
    },
    //本地读取
    localload:function(){
        if(cc.sys.localStorage.getItem('coin_save')== null) return;

        this.coinnum= cc.sys.localStorage.getItem('coin_num');
        this.wallet = cc.sys.localStorage.getItem('coin_wallet');
        this.cost = cc.sys.localStorage.getItem('coin_cost');
        this.mincost = JSON.parse( cc.sys.localStorage.getItem('coin_mincost'));
        this.score = JSON.parse (cc.sys.localStorage.getItem('coin_score'));

        if(this.coinnum == 0) this.coinnum =50;       
    },

    //保存玩家金币数
    savecoin:function(){       
       
            if(this.openid=='') return;
            let url ='http://weikeo.quantumsystem.com.cn/game/savecoin.php?openid='+this.openid+'&coin='+this.coinnum;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    
                    //console.log(response);
                    if(response != 'error'){
                    // var s = JSON.parse(response);
                    //
                    }                   
                }
            };
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
            xhr.send();               
     },
    

    //计算一个摇奖结果
    spinresult:function(){
        var p = this.bonus/this.cost;
        var r = [0,0,0,0];

        if (p>1)p=0.999;
        
        //玩家赔
        //if(p < 1){       

       // if(this.cost > this.bonus)
       //动态中奖率
        if( Math.random() < 0.5 +Math.cos(p*Math.PI)*0.475 && this.spinnum > this.mininterval){
           
            //头奖 3小丑  0.05%   
            //头奖 2小丑  0.1%  
            // 头奖 1小丑  0.2%          
            //特殊 双水果+ 小丑  0.3%
            //幸运 三水果  0.4%
            //一般 双水果 1%
            
            let x = Math.random();//*this.probability[5]*Math.cos(p*Math.PI/2);

             //计算收益
            //let profit = this.cost -this.bonus ;
            //if(profit <100)    x *= (1-this.addition); 

            //超过最大中奖最隔仍未中奖 增加中奖率10%
            //if(this.spinnum > this.maxinterval)
            //   this.addition -= 0.1;

            // if(x > this.probability[5] || this.spinnum < this.mininterval ){ 
            //     //玩家不可能中奖 未达到随机数要求  或 未超过最小中奖间隔
                
            //     r[0]= Math.round(Math.random()*2);
            //     r[1]= 3+Math.round(Math.random()*2);
            //     r[2]= Math.round(Math.random()*5);
            //     this.spinnum++;
            //}else{

            this.spinnum=0;
            //this.addition =1;
            if(x >this.probability[5]){//不中 
                r[0]= Math.round(Math.random()*2);
                r[1]= 3+Math.round(Math.random()*2);
                r[2]= Math.round(Math.random()*5);  
                this.spinnum++;     
            }else{
                if(x >this.probability[4] && this.mincost[0]> 30 )//一般 双水果 
                {   
                    this.mincost[0]=0;
                    r[0]=r[1] = Math.round(Math.random()*5);
                    do{
                        r[2] =Math.round(Math.random()*5);
                    }while(r[0]==r[2]);

                    r[3] = 10 + r[0];

                }else{

                    if(x > this.probability[3] && this.mincost[1] >= 100){//幸运 三水果  
                        this.mincost[1]=0;
                        r[0]=r[1] =r[2]= Math.round(Math.random()*5);
                        r[3] =21;

                    }else{

                        if(x > this.probability[2] && this.mincost[2] >= 200){ //特殊 双水果+ 小丑  
                            
                            this.mincost[2]=0;
                            r[0]=r[1] = Math.round(Math.random()*5);                           
                            r[2] =6;
                            r[3] =31

                        }else{

                            if(x > this.probability[2] && this.mincost[3] >= 350 ){// 头奖 1小丑      
                                this.mincost[3]=0;
                                r[0] = 6;
                                r[1] = Math.round(Math.random()*5);    
                                r[2] = Math.round(Math.random()*5);  
                                r[3] =41; 

                            }else{

                                if(x >  this.probability[1] && this.mincost[4] >= 650 ){

                                    this.mincost[4]=0;
                                    r[0] =r[1]= 6;                               
                                    r[2] = Math.round(Math.random()*5);
                                    r[3] =51;  

                                }else{

                                    if(this.mincost[5] >= 1200 ){
                                        r[0] =r[1]= r[2]=6;    
                                        r[3] =  61;  
                                    }else{
                                        r[0]= Math.round(Math.random()*2);
                                        r[1]= 3+Math.round(Math.random()*2);
                                        r[2]= Math.round(Math.random()*5);  
                                        this.spinnum++;     
                                    }
                                }
                            }
                        }
                    }
                }
            }

         }else{             
             //玩家不中奖
           
             r[0]= Math.round(Math.random()*2);
             r[1]= 3+Math.round(Math.random()*2);
             r[2]= Math.round(Math.random()*5);  
             this.spinnum++;         
        }

        this.prize = r[3];
       
        return r;
    },

    //摇奖算法B     跟 据 投入 和 回收的差额计算中奖率
    spinresult_B:function(){
         let p = this.bonus/this.cost;
         let profit = this.bonus-this.cost;
         var r = [0,0,0,0];

        

        let x = Math.random();

        let f=1;
        if(profit<0) f=-1;

        let n=0;
        if(Math.abs( profit ) >10000) n=0.5;
        if(Math.abs( profit ) >1000) n=0.05;
        if(Math.abs( profit ) >100) n=0.005;       

       
         //玩家赔         
         //if(this.bonus > this.cost){
        if(p>0.9){
             
             //头奖 3小丑  0.05%   
             //头奖 2小丑  0.1%  
             // 头奖 1小丑  0.2%          
             //特殊 双水果+ 小丑  0.3%
             //幸运 三水果  0.4%
             //一般 双水果 1%                        
 
              //计算收益
            
             //if(profit <100)    x *= (1-this.addition); 
 
             if(this.spinnum > this.maxinterval)
                this.addition -= 0.1;
         }else{

         }
    },
} ;
module.exports =  Global;