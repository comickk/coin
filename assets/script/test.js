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
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        var manager = cc.director.getPhysicsManager();

        manager.enabled = true;

       // this.myFunction();

        var w=window.innerWidth;

        var h=window.innerHeight;

        cc.Canvas.instance.node.width =w;
        cc.Canvas.instance.node.height =h;

        cc.log(cc.Canvas.instance.node);


        // setTimeout(function(){
        //     //这个可以关闭安卓系统的手机
        //     document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('closeWindow'); }, false);
        //     //这个可以关闭ios系统的手机
        //     WeixinJSBridge.call('closeWindow');
        //   }, 1000)
          
        this.checkwxjsbridge();        
                                    
        // document.addEventListener("visibilitychange", function() {
        //     alert("----------4");  
        // }, false);
        

     },
    //   start(){
     
    //     WeixinJSBridge.invoke('closeWindow',{},function(res){
 
    //         alert('res.err_msg');
         
    //     });
    //   },
    
   
    checkwxjsbridge()
    {
        var self =this;
        //alert("你好，我是一个警告框！");
        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady); 
                document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);                
            }           
            
         }else{             

           this.pushHistory();
        //    if( document.addEventListener ){
        //         document.addEventListener('popstate',self.closeWindow,false);   
        //         window.addEventListener("popstate", self.closeWindow,false);
        //    }else if(document.attachEvent)       {
        //         document.attachEvent('popstate',self.closeWindow);   
        //         window.attachEvent("popstate", self.closeWindow);
        //    }

            window.addEventListener("popstate", function(e) {
         //       //alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
                alert('save and close');
                self.save();
                //alert('save');                

                 WeixinJSBridge.invoke('closeWindow',{},function(res){
                         alert(res.err_msg);
                });
            

                //WeixinJSBridge.call('closeWindow');
    
                // if(typeof(WeixinJSBridge)!="undefined"){
                //         WeixinJSBridge.call('closeWindow');
                //     }else{
                //         if (navigator.userAgent.indexOf("MSIE") > 0) {  
                //             if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {  
                //                 window.opener = null; window.close();  
                //             }  
                //             else {  
                //                 window.open('', '_top'); window.top.close();  
                //             }  
                //         }  
                //         else if (navigator.userAgent.indexOf("Firefox") > 0) {  
                //             window.location.href = 'about:blank ';  
                //             //window.history.go(-2);  
                //         }  
                //         else {  
                //             window.opener = null;   
                //             window.open('', '_self', '');  
                //             window.close();  
                //         }
                //     }
           }, false);

           // document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('closeWindow'); }, false);
            //WeixinJSBridge.call('closeWindow');
           // this.onBridgeReady();


        //    WeixinJSBridge.invoke('closeWindow',{},function(res){
        //     //alert(res.err_msg);
        //     });
         }

    },
    pushHistory() {  
        var state = {  
            title: "title",  
            url: "#"  
        };  
        window.history.pushState(state, "title", "#");  
    } ,
    // closeWindow(error){
    //     // this.save();
    //     // alert("----------3"+error);    
    //     WeixinJSBridge.invoke('closeWindow',{},function(res){
    //              alert(res.err_msg);
    //              });

    //},

    save(){
        let url ='http://weikeo.quantumsystem.com.cn/game/savecoin.php?openid=oeveq1UDdv6z1LMPgCs3IZK4c_qo&coin=666';
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                
                console.log(response);
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

    onBridgeReady(){
        WeixinJSBridge.invoke(
           'getBrandWCPayRequest', {
              "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入     
              "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
              "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
              "package":"prepay_id=u802345jgfjsdfgsdg888",     
              "signType":"MD5",         //微信签名方式：     
              "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
           },
           function(res){
           if(res.err_msg == "get_brand_wcpay_request:ok" ){
           // 使用以上方式判断前端返回,微信团队郑重提示：
                 //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
           } 
        }); 
     }

    // start () {

    // },

    // update (dt) {},
});
