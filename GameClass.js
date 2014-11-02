var GameClass = {};

var core = enchant.Core.instance;
GameClass.SceneManager = function(){
        var core = enchant.Core.instance;
        //if(core.rootScene === undefined){
        //    throw new Error('rootScene is not defined, yet.create this after enchant.start()');
        //}
        var currentGroup = undefined;
        var _groups = [];
        var pushGroup = function(group){
            core.currentScene.removeChild(this.currentGroup);
            core.currentScene.addChild(group);
            this.currentGroup = group;
            _groups.push(group);
        }
        var popGroup = function(){
            if(_groups.length <= 1){
                return;
            }
            core.currentScene.removeChild(currentGroup);
            core.currentScene.addChild(_groups[_groups.length - 2]);
            _groups.pop();
        }
        return {
            pushGroup: pushGroup,
            popGroup: popGroup,
            currentGroup: currentGroup
        }
};
var StartScene = enchant.Class.create(enchant.Group, {
    initialize: function(){
        enchant.Group.call(this);
        StartScene.instance = this;
        var core = enchant.Core.instance;
        core.currentScene.backgroundColor = ColorSet.STARTSCENEBG;
        var tit = new Sprite(500, 155);
        tit.image = core.assets[TITLE_IMG];
        tit.y = 100;
        tit.x = core.width/2 - tit.width/2;
        this.addChild(tit);
        var trial = new Label("");
        trial.font = "32px sans bold";
        trial.color = ColorSet.STARTSCENE_TEXT_ENABLE;
        trial.text = "ARCADE MODE";
        trial.y = 300;
        this.addChild(trial);
        trial.x = core.width/2 - trial.width/2;
        trial.addEventListener('enterframe', function(){
                this.x = core.width/2 - this.width/2;
        });
        trial.addEventListener('touchstart', function(){
                core.currentScene.backgroundColor = null;
                core.sceneManager.pushGroup(new PlayScene());
        });

        //セレクタ
    var sor = new Sprite(16, 16);
    sor.x = 135;
    sor.y = 309;
    sor.inputBuf = false;
    sor.image = new Surface(16, 16);
    var ctx = sor.image.context;
    ctx.fillStyle = ColorSet.STARTSCENE_SELECTOR0;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = ColorSet.STARTSCENE_SELECTOR1;
    ctx.rect(2, 2, 12, 12);
    ctx.fill();
    this.addChild(sor);
    sor.addEventListener('enterframe', function(){
            sor.rotation += 8;
    });
        //TODO
        //他のモードはカミングスーンです
        var select = new Label("");
        select.font = "32px sans bold";
        select.color = ColorSet.STARTSCENE_TEXT_DISABLE;
        select.text = "STAGE SELECT";
        select.y = 400;
        this.addChild(select);
        select.x = core.width/2 - select.width/2;
        select.addEventListener('enterframe', function(){
                this.x = core.width/2 - this.width/2;
        });
        var conf = new Label("");
        conf.font = "32px sans bold";
        conf.color = ColorSet.STARTSCENE_TEXT_ENABLE;
        conf.text = "CONFIG:PC MODE";
        conf.y = 500;
        this.addChild(conf);
        conf.x = core.width/2 - conf.width/2;
        conf.addEventListener('enterframe', function(){
                this.x = core.width/2 - this.width/2;
        });
        conf.addEventListener('touchstart', function(){
                if(core.conf.ui === 0){
                    conf.text = "CONFIG:TOUCH MODE";
                    core.conf.ui = 1;
                }else{
                    conf.text = "CONFIG:PC MODE";
                    core.conf.ui = 0;
                }
        });

        //キーイベント入力の受付
        this.addEventListener('enterframe', function(){
                //-----カーソルキーの動作
                //
                if(core.input.up){
                    //core.keyEvent[0].inputUp();
                    if(sor.inputBuf === false){
                        sor.inputBuf = true;
                        sor.y -= 100;
                        if(sor.y < 300){
                            sor.y += 300;
                        }
                    }
                }else if(core.input.down){
                    //core.keyEvent[0].inputDown();
                    if(sor.inputBuf === false){
                        sor.inputBuf = true;
                        sor.y += 100;
                        if(sor.y > 600){
                            sor.y -= 300;
                        }
                    }
                }else if(core.input.left){
                }else if(core.input.right){
                }else{
                    sor.inputBuf = false;
                }
                if(core.input.b){
                    if(sor.y === 309 && conf.inputBuf === false){
                        core.currentScene.backgroundColor = null;
                        core.sceneManager.pushGroup(new PlayScene());
                    }else if(sor.y === 509 && conf.inputBuf === false){
                        conf.inputBuf = true;
                        if(core.conf.ui === 0){
                            conf.text = "CONFIG:TOUCH MODE";
                            core.conf.ui = 1;
                        }else{
                            conf.text = "CONFIG:PC MODE";
                            core.conf.ui = 0;
                        }
                    }else{
                    
                    }
                }else{
                    conf.inputBuf = false;
                }
        });
    }
});

var PlayScene = enchant.Class.create(enchant.Group, {
    initialize: function(){
        enchant.Group.call(this);
        PlayScene.instance = this;
        var core = enchant.Core.instance;
        var scene = core.currentScene;
        scene.addChild(this);
        var cameraConf = {
            x: core.width / 2,
            y: 0,
            z: -core.height * 5,
            centerX: core.width / 2,
            centerY: 0,
            centerZ: 0,
            upVectorX: 0,
            upVectorY: -1,
            upVectorZ: 0
        };
        var camera = new Camera360(cameraConf);
        //メインとUIのグループを定義
        var mainWindow = new enchant.Group();
        var uiWindow = new enchant.Group();
        this.mainWindow = mainWindow;
        this.uiWindow = uiWindow;
        mainWindow.x = UI_WIDTH;
        this.addChild(mainWindow);
        this.addChild(uiWindow);

        var mainBg = new Astro360.UI.MainBg();
        mainWindow.addChild(mainBg);

        //PC操作系の場合
        if(core.conf.ui === 0){
            var uiBg = new Astro360.UI.UiBg();
            uiWindow.addChild(uiBg);
        //スマホ操作系の場合
        }else if(core.conf.ui === 1){
            var uiBg = new Astro360.UI.UiBgSP();
            uiWindow.addChild(uiBg);
        }

        var gage = new Astro360.UI.LazerGauge();
        mainWindow.addChild(gage);

        var lestUnit = new Astro360.UI.LestUnit();
        lestUnit.x = GAUGE_WIDTH * MAX_LAZER_STOCK + 10; 
        mainWindow.addChild(lestUnit);

        var score = new Astro360.UI.ScoreLabel();
        score.x = lestUnit.x + lestUnit.width + 10; 
        mainWindow.addChild(score);

        //シリンダー回転タッチ操作用変数
        uiWindow.currentTouchY = 0;

        //Dot.surface参照が切れる不都合対応
        var d = new Dot();

//------------------------------------------------------
        var p = new Astro360.Player.PlayerBase();
        Astro360.Player.PlayerBase.instance.isShouldNormalShot = true;
        p.x = 150;
        p.y = CORE_HEIGHT /2;
        p.targX = 150;
        p.targY = CORE_HEIGHT /2;
        mainWindow.addChild(p);
//------------------------------------------------------
// プレイヤータッチイベント定義
//------------------------------------------------------
//        p.addEventListener('enterframe', function(e){
//                p.receiveEnterframeEvent[core.conf.ui](e);
//        });
        p.addEventListener('touchstart', function(e){
                p.receiveOwnTouchStart[core.conf.ui](e);
        });
        p.addEventListener('touchmove', function(e){
                p.receiveOwnTouchMove[core.conf.ui](e);
        });
        p.addEventListener('touchend', function(e){
                p.receiveOwnTouchEnd[core.conf.ui](e);
        });
        //常時マウス位置を取得(PCでのみ有効)
        window.document.onmousemove = function(e){
            var e2x = (e.x +0) / enchant.Core.instance.scale;
            var e2y  =e.y / enchant.Core.instance.scale; 
            var obj = {x: e2x, y: e2y};
//            p.receiveFieldTouchMove[core.conf.ui](obj); //マウス自動追従をやめている
        };
//------------------------------------------------------
// MainWindowフィールドタッチイベント定義
//------------------------------------------------------
//メイン画面のタッチイベントを自機に送る
        mainWindow.addEventListener('touchstart', function(e){
                console.log("touchstart");
                p.receiveFieldTouchStart[core.conf.ui](e);
        });
        mainWindow.addEventListener('touchmove', function(e){
                p.receiveFieldTouchMove[core.conf.ui](e);
        });
        mainWindow.addEventListener('touchend', function(e){
                p.receiveFieldTouchEnd[core.conf.ui](e);
        });
//------------------------------------------------------
// UiWindowタッチイベント定義
//------------------------------------------------------
        //PC操作系の場合
        if(core.conf.ui === 0){
            //UIタッチ操作で回転させる
            uiWindow.addEventListener('touchstart', function(e){
                    uiWindow.currentTouchY = e.y;
            });
            uiWindow.addEventListener('touchmove', function(e){
                    var rotScale = 0.2;
                    var diff = e.y - uiWindow.currentTouchY;
                    Camera360.instance.rotX(Math.PI/90 * diff * rotScale);
                    uiWindow.currentTouchY = e.y;
            });
            uiWindow.addEventListener('touchend', function(e){
                    uiWindow.currentTouchY = 0;
            });
        }
        //スマホ操作系はGroup側で別個にイベント定義するのでGameClassからは触れない
//------------------------------------------------------
//ステージ構成
        setStageEvent(this, 0); //StageData.jsからステージデータを読み込む
//------------------------------------------------------
//キーイベント入力の受付
        this.addEventListener('enterframe', function(){
                //-----カーソルキーの動作
                //
                if(core.input.up){
                    core.keyEvent[1].inputUp();
                }
                if(core.input.down){
                    core.keyEvent[1].inputDown();
                }
                if(core.input.left){
                    core.keyEvent[1].inputLeft();
                }
                if(core.input.right){
                    core.keyEvent[1].inputRight();
                }
        });
    }
});
//キーイベントからカメラ回転イベントの呼び出し
var initKeyEvents = function(){
    var core = enchant.Core.instance;
    core.keybind(' '.charCodeAt(0), 'b');//スペースキーの割り当て
    //フラグ0
    //スタート画面
    core.keyEvent[0] = {
        inputUp: function(){
        },
        inputDown: function(){
        },
        inputLeft: function(){
        },
        inputRight: function(){
        }
    };
    //フラグ
    //トライアルステージ
    core.keyEvent[1] = {
        inputUp: function(){
            Camera360.instance.rotX(Math.PI/45);
        },
        inputDown: function(){
            Camera360.instance.rotX(-Math.PI/45);
        },
        inputLeft: function(){
            //Camera360.instance.rotZ(Math.PI/45);
        },
        inputRight: function(){
            //Camera360.instance.rotZ(-Math.PI/45);
        }
    };
};

//------------------------------------------------------
//ホイールイベント入力の受付
//thanks for https://w3g.jp/blog/tools/wheelevent_crossbrowser
var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
try{
	document.addEventListener (mousewheelevent, onWheel, false);
}catch(e){
	//for legacy IE
	document.attachEvent ("onmousewheel", onWheel);
}
function onWheel(e) {
	if(!e) e = window.event; //for legacy IE
	var delta = e.deltaY ? -(e.deltaY) : e.wheelDelta ? e.wheelDelta : -(e.detail);
	if (delta < 0){
		e.preventDefault();
        //下にスクロールした場合の処理
            Camera360.instance.rotX(-Math.PI/45 * 2);
	} else if (delta > 0){
		e.preventDefault();
		//上にスクロールした場合の処理
            Camera360.instance.rotX(Math.PI/45 * 2);
	}
}
