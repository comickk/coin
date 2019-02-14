var game = require('game'); 
cc.Class({
    extends: cc.Component,

    properties: {
      
      //  headurl:"",
     //   headimg:cc.Sprite,

        label:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

      // this.headurl ="http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eobzficNbEN08ojWOZkkcQeADhHgPlEcAJPCkq3m3G4A0c0TTmHTnicJia2aICqn4wCkm1u746Vkalsw/132"+"?aa=aa.jpg";
     
      this.checkCookie();

        //this.loadgame();
    },

    getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
        }
        return "";
    },
    setCookie(cname,cvalue,min){
        var d = new Date();
        d.setTime(d.getTime()+(min*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
    },

    checkCookie(){
        var openid = this.getCookie("openid");
        if (openid != ""){
            cc.log('cookie name=' + openid);

            game.openid = openid;
       
            this.getinfo(openid);
        
            this.loadgame();
        }
        else {
           alert("读取用户信息失败！");

            // openid ='oeveq1UDdv6z1LMPgCs3IZK4c_qo';
            // game.openid = openid;
            // this.getinfo(openid);
            // this.loadgame();
         }    
    },

    loadgame(){            
        var self =this;
           
        cc.director.preloadScene('main', (completedCount, totalCount, item)=> { //进度回调
            //self.label.string = (completedCount+1 / totalCount).toFixed(2) ;
                var progress ='';
                progress =  ( (completedCount+1) / (totalCount+1) *100).toFixed(2);
                self.label.string= '( '+progress+'% )';
                //console.log( progress);
                //this.progressBar.progress = completedCount / totalCount;
            },
            (error)=>{//预加载结速
                if(error){

                }else{
                    //cc.loader.onProgress = null;
                    //console.log( 'loading over');
                    cc.director.loadScene('main');
                }
        });
    },   

    getinfo(openid){
        //let url ='https://ixnvcd-8080-ygmhen.dev.ide.live/PHP/getinfo.php?openid='+openid;
       
        let url ='http://weikeo.quantumsystem.com.cn/game/getinfo.php?openid='+openid;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                
                //console.log(response);
                if(response != 'error'){
                    var s = JSON.parse(response);
                    
                    //cc.log(s);                    
                    game.cost = cc.sys.localStorage.getItem('coin_cost');
                    game.bonus = cc.sys.localStorage.getItem('coin_bonus');
                    game.coinnum = cc.sys.localStorage.getItem('coin_num');
                    game.wallet = cc.sys.localStorage.getItem('coin_wallet');

                    game.nickname =s.nickname;

                    if( Math.abs(game.coinnum - s.coin)>20)
                        game.coinnum = s.coin;                
                   
                    game.lastsavenum =s.coin;
                    game.wallet = s.wallet;
                    var headurl = s.headimgurl+"?aa=aa.jpg";       

                    cc.loader.load(headurl, function(err, texture){
                        //self.headimg.spriteFrame = new cc.SpriteFrame(texture);
                        game.headimg = texture;
                    });
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
        xhr.send();
    }
    
});
