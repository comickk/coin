
var game = require('game'); 
cc.Class({
    extends: cc.Component,

    properties: {
       
        bgm:{
            default:[],
            type: cc.AudioClip
        },

        clip:{
            default:[],
            type:cc.AudioClip,
        },

        _bgmID:0,
    },


     onLoad () {
         game.audio = this;

        
        this._bgmID = cc.audioEngine.playMusic(this.bgm[0],true);
        cc.audioEngine.setMusicVolume(0.3);


     },

   
});
