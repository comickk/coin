var Global={  

    ver:101,
    //URL:"http://www.hengshengsj.com/",

    //玩家金币数
    coinnum:0,

    //玩家花费的
    cost:1,
    //玩家获得的奖励
    bonus:1,

    //水果分
    score:[0,0,0,0,0,0],

    //中奖率
      //头奖 3小丑  0.1%   
            //头奖 2小丑  0.3%  
            // 头奖 1小丑  0.5%          
            //特殊 双水果+ 小丑  1%
            //幸运 三水果  3%
            //一般 双水果 5%
    probability:[0.001,  0.003,  0.005,  0.01,  0.85,  0.9],
   
    audio:null,
    ui:null,
    

    fun:function(){  
    },    

    setscore:function(type,num){

        this.score[type] += num;
        this.ui.setscore(type,this.score[type]);
    },

    

    //计算一个摇奖结果
    spinresult:function(){
        var p = this.bonus/this.cost;
        var r = [0,0,0,0];
        //玩家赔
        if(p < 0.8){
            //头奖 3小丑  0.1%   
            //头奖 2小丑  0.3%  
            // 头奖 1小丑  0.5%          
            //特殊 双水果+ 小丑  1%
            //幸运 三水果  3%
            //一般 双水果 5%

            let x = Math.random();
            if(x > this.probability[5]){
                 //玩家不可能中奖
                r[0]= Math.round(Math.random()*2);
                r[1]= 3+Math.round(Math.random()*2);
                r[2]= Math.round(Math.random()*5);
            }else{
                if(x >this.probability[4])//一般 双水果 5%
                {
                    r[3] = 11;
                    r[0]=r[1] = Math.round(Math.random()*5);
                    do{
                        r[2] =Math.round(Math.random()*5);
                    }while(r[0]==r[2]);

                }else{

                    if(x > this.probability[3]){//幸运 三水果  3%

                        r[0]=r[1] =r[2]= Math.round(Math.random()*5);
                        r[3] =21;

                    }else{

                        if(x > this.probability[2]){ //特殊 双水果+ 小丑  1%
                            r[0]=r[1] = Math.round(Math.random()*5);                           
                            r[2] =6;
                            r[3] =31

                        }else{

                            if(x > this.probability[2]){// 头奖 1小丑  0.5%     
                                r[0] = 6;
                                r[1] = Math.round(Math.random()*5);    
                                r[2] = Math.round(Math.random()*5);  
                                r[3] =41; 

                            }else{

                                if(x >  this.probability[1]){

                                    r[0] =r[1]= 6;                               
                                    r[2] = Math.round(Math.random()*5);
                                    r[3] =51;  

                                }else{

                                    r[0] =r[1]= r[2]=6;    
                                    r[3] =  61;  
                                }
                            }
                        }
                    }
                }
            }


        }else{
            //玩家赚
            //玩家不可能中奖
            r[0]= Math.round(Math.random()*2);
            r[1]= 3+Math.round(Math.random()*2);
            r[2]= Math.round(Math.random()*5);            
        }

        return r;
    },
} ;
module.exports =  Global;