var game = require('game');
cc.Class({
	extends: cc.Component,

	properties: {
		spin: cc.Node,
		roller: {
			default: [],
			type: cc.Node,
		},

		bg: {
			default: [],
			type: cc.Node,
		},

		spinlight: {
			default: [],
			type: cc.Sprite,
		},

		lightframe: {
			default: [],
			type: cc.SpriteFrame,
		},

		zhuanpan: cc.Animation,
		feibiao: cc.Animation,

		//游戏模式： 0 正常时 投中spin 开启摇奖， 1 幸运转盘,投中spin 扔飞镖   2 帽子  3  头奖  4 发奖
		_mode: 0,

		_rolling: false,
		_count: 0,

		//三个滚轴预期转到的值
		_expect: [0, 0, 0],

		_rolltime: 0,

		//记录三个滚轴是否己停止，停止时(=1)播放声音
		_isstop: [0, 0, 0],

		_rollaudioID: 0,

		//种奖类型
		_type: 0,
	},

	//-224  32  160

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		game.scroll = this;
		this.node.on('roll', this.addroll, this);
		this._isstop = [0, 0, 0];
	},

	// start () {

	// },

	//计算预期值 并记录奖种
	getexpect() {
		var r = game.spinresult();
		this._type = r[3];
		//cc.log('----spin------'+ r);
		for (let i = 0; i < 3; i++) {
			this._expect[i] = -224 + r[i] * 64;
		}
		//cc.log(this._expect);
	},

	addroll(evnet) {
		if (this._mode == 1) {
			this.stopzhuanpan();
			return;
		}

		if (this._mode != 0 || this._count >= 5) return;

		this._count++;
		this.setspinlight();
		this.roll();
	},

	roll() {
		if (!this._rolling) {
			//cc.log('-------start roll-------');
			this._rollaudioID = cc.audioEngine.play(game.audio.clip[1], true);
			this._rolling = true;
			this._count--;
			this.setspinlight();
			this.getexpect();
			this.schedule(this.runroll, 0.05);
		}
	},

	runroll() {
		if (this._rolltime > 3) {
			var stop = true;
			for (let i = 0; i < 3; i++) {
				// cc.log(i+'  --------------  '+this.roller[i].y);
				if (this.roller[i].y != this._expect[i]) {
					this.roller[i].y -= 16;
					stop = false;
				} else {
					if (this._isstop[i] == 0) {
						this._isstop[i] = 1;
						cc.audioEngine.play(game.audio.clip[2]);
					}
				}
			}

			if (stop) this.stoproll();
		} else {
			for (let i = 0; i < 3; i++) this.roller[i].y -= 16;
		}

		for (let i = 0; i < 3; i++) {
			if (this.roller[i].y <= -240) this.roller[i].y = 176;

			this._rolltime += 0.05;
		}
	},

	stoproll() {
		this.unschedule(this.runroll);
		//cc.log('-------count -------' + this._count);
		this._rolling = false;
		this._rolltime = 0;
		this._isstop = [0, 0, 0];
		cc.audioEngine.stop(this._rollaudioID);

		if (this._type > 0) this.scheduleOnce(this.checkresult, 1);
		else if (this._count > 0) this.scheduleOnce(this.roll, 1);
	},

	//检查 摇奖结果,并开奖
	checkresult() {
		if (this._type < 10) return;

		if (this._type < 20) {
			this.setmode(4, -1, 3, false, false);
			game.main.award(game.score[this._type - 10]);
			return;
		}

		//cc.log('中了  '+ this._type +'  奖! ');
		switch (this._type) {
			// case 11://双水果 奖励对应水果分
			//     this.setmode(4,-1,3,false,false);
			//     game.main.award( game.score[this._type-10]);
			// break;

			case 21: //三水果  转盘飞镖，中多少奖多少   60秒内投中spin
				this.setmode(1, 1, 3, true, false);
				//检查转盘是否开启,并复位飞镖
				this.zhuanpan.resume();
				//this.feibiao.setCurrentTime(0);
				this.feibiao.node.y += 300;
				game.ui.starttimer();
				break;

			case 31: //双水果 + 小丑 ,60秒 投帽子，每中一个帽子加对应水果分,中out清空
				this.setmode(2, 2, 2, false, false);
				game.ui.starttimer();
				game.scoretrigger.allon();

				break;
			case 41: //1小丑 500+
				this.setmode(4, 0, 1, false, false);
				game.main.award(500);

				break;
			case 51: //2小丑 1000+
				this.setmode(4, 0, 1, false, false);
				game.main.award(1000);
				break;
			case 61: //3小丑 2000+
				this.setmode(4, 0, 1, false, false);
				game.main.award(2000);
				break;
		}
	},

	stopzhuanpan() {
		this.feibiao.play();

		this._mode = 4; //发奖模式
		this.spin.emit('pause');

		this.scheduleOnce(function() {
			this.zhuanpan.pause();
			// cc.log(  '--中了--' + this.angle2prize(   this.zhuanpan.node.rotation ));
			var n = this.angle2prize(this.zhuanpan.node.rotation);
			//停表
			game.ui.stoptimer();
			game.main.award(n);
		}, 0.5);
	},
	//将转盘角度转换成 对应的奖励
	angle2prize(ang) {
		if (ang > 16 && ang <= 45) return 1000;
		if (ang > 45 && ang <= 130) return 100;
		if (ang > 130 && ang <= 178) return 800;
		if (ang > 178 && ang <= 247) return 400;
		if (ang > 247 && ang <= 301) return 600;
		if (ang > 301 || ang <= 16) return 200;
		return 0;
	},

	//重置为普通模式
	rest() {
		//cc.log('--scroll  rest--');
		this.setmode(0, -1, 0, true, true);

		//若还有未摇的奖,则继续
		if (this._count > 0) this.scheduleOnce(this.roll, 1);
	},

	setmode(modeID, bgID, bgmID, isspin, istrigger) {
		this._mode = modeID; //

		if (cc.audioEngine.isMusicPlaying()) cc.audioEngine.stopMusic();
		cc.audioEngine.playMusic(game.audio.bgm[bgmID], true);

		if (bgID >= 0) this.bg[bgID].active = true;
		else {
			this.bg[0].active = false;
			this.bg[1].active = false;
			this.bg[2].active = false;
		}

		if (!isspin) this.spin.emit('pause');
		else this.spin.emit('resume');

		if (!istrigger) game.scoretrigger.offtrigger();
		else game.scoretrigger.randomtrigger();
	},

	setspinlight() {
		for (let i = 0; i < 4; i++) {
			if (this._count > i + 1) {
				// cc.log('-- open---' +i);
				this.spinlight[i].spriteFrame = this.lightframe[1];
			} else {
				//cc.log('-- close---' +i);
				this.spinlight[i].spriteFrame = this.lightframe[0];
			}
		}
	},

	// update (dt) {},
});
