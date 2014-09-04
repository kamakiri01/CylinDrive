var core = enchant.Core.instance;
var PlayScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
        enchant.Scene.call(this);
        PlayScene.instance = this;
        var core = enchant.Core.instance;
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

        var mainBg = new MainBg();
        mainWindow.addChild(mainBg);

        var uiBg = new UiBg();
        uiWindow.addChild(uiBg);

        //タッチ操作用変数
        uiWindow.currentTouchY = 0;

        //プレイヤーを出す
        var p = new PlayerBase();
        p.x = 150;
        p.y = CORE_HEIGHT /2;
        p.targX = 150;
        p.targY = CORE_HEIGHT /2;
        mainWindow.addChild(p);
        //常時マウス位置を取得
        window.document.onmousemove = function(e){
            var e2x = (e.x +0) / enchant.Core.instance.scale;
            var e2y  =e.y / enchant.Core.instance.scale; 
            var obj = {x: e2x, y: e2y};
            p.receiveTouchMove(obj);
        }
        mainBg.addEventListener('enterframe', function(e){
        });
        //メイン画面のタッチイベントを自機に送る
        mainWindow.addEventListener('touchstart', function(e){
                p.receiveTouchStart(e);
        });
        mainWindow.addEventListener('touchmove', function(e){
                p.receiveTouchMove(e);
        });

        //UIタッチ操作で回転させる
        uiWindow.addEventListener('touchstart', function(e){
                uiWindow.currentTouchY = e.y;
        });
        uiWindow.addEventListener('touchmove', function(e){
                var diff = e.y - uiWindow.currentTouchY;
                Camera360.instance.rotX(Math.PI/90 * diff);
                uiWindow.currentTouchY = e.y;
        });
        uiWindow.addEventListener('touchend', function(e){
                uiWindow.currentTouchY = 0;
        });
        //敵を出しまくる TODO:テストコード
        this.addEventListener('enterframe', function(){
                if(enchant.Core.instance.currentScene.age === 1){
//                    for(var i=0;i<4;i++){
//                        var dot = new Dot();
//                        if(i === 0){
//                            dot.x = 10;
//                            dot.y = 10;
//                        }else if(i === 1){
//                            dot.x = 620;
//                            dot.y = 10;
//                        }else if(i === 2){
//                            dot.x = 620;
//                            dot.y = 620;
//                        }else if(i === 3){
//                            dot.x = 10;
//                            dot.y = 620;
//                        }
//                        Sprite360.add360Methods(dot);
//                        mainWindow.addChild(dot);
//                        var pos = Camera360.setReferenceFromViewPosition(dot.x, dot.y);
//                        dot.px = pos.x;
//                        dot.py = pos.y;
//                        dot.pz = pos.z;
//                        dot.accX = 0;
//                        dot.accY = 0;
//                    }
                }
                //適当に敵を出す
                if(enchant.Core.instance.currentScene.age %30 === 0){
                    var pos = {x: 300, y: 100};
                    var vel = {x: -1 , y: 0};
                    var acc = {x: 0,   y: 0};
 //                   gemEnemy(1, 0, pos, vel, acc);
                    var e = new TestEnemyBase360();
                    e.x = CORE_WIDTH;
                    e.y = CORE_HEIGHT * Math.random() / 2;
                    Camera360.setCurrentNormalPosition(e);
                    e.addEventListener('enterframe', function(){
                            this.px -= 0.01;
                            //こまめにふつうのショット
                            if(this.age % 20 === 0){
                                createNormalBullet(e);
                            }
                            //たまに放射状にうつ
                            if(this.age % 30 === 0){
                                createRippleBullet(e, 5, 30, 8);
                            }
                    });
                    e.setMyMotion();
                    mainWindow.addChild(e);
                }
        });
        //キーイベント入力の受付(デバッグ）
        this.addEventListener('enterframe', function(){
                //-----カーソルキーの動作
                //
                if(core.input.up){
                    core.keyEvent[0].inputUp();
                }
                if(core.input.down){
                    core.keyEvent[0].inputDown();
                }
                if(core.input.left){
                    core.keyEvent[0].inputLeft();
                }
                if(core.input.right){
                    core.keyEvent[0].inputRight();
                }
        });
        //ドット生成で座標変換の確認用メソッド
//        this.addEventListener('touchstart', function(){
//                for(var i=0;i<50;i++){
//                    var dot = new Dot();
//                    Sprite360.add360Methods(dot);
//                    mainWindow.addChild(dot);
//                    if(i %2 !== 0){
//                        dot.x = i * enchant.Core.instance.width/50;
//                        dot.y = i * enchant.Core.instance.height/50;
//                    }
//                    var pos = Camera360.setReferenceFromViewPosition(dot.x, dot.y);
//                    dot.px = pos.x;
//                    dot.py = pos.y;
//                    dot.pz = pos.z;
//                    dot.accX = 0;
//                    dot.accY = 0;
//                    dot.addEventListener('enterframe', function(){
//                            this.px += this.accX;
//                            this.py += this.accY;
//                    });
//                }
//        })
        init();
    }
});
//キーイベントからカメラ回転イベントの呼び出し
var init = function(){
    var core = enchant.Core.instance;
    //フラグ0
    core.keyEvent[0] = {
        inputUp: function(){
            Camera360.instance.rotX(Math.PI/45);
        },
        inputDown: function(){
            Camera360.instance.rotX(-Math.PI/45);
        },
        inputLeft: function(){
            Camera360.instance.rotZ(Math.PI/45);
        },
        inputRight: function(){
            Camera360.instance.rotZ(-Math.PI/45);
        }
    };
};

//生成数、弾が直線or扇、初期位置、初期速度、等加速度
var gemEnemy = function(num, bulletType, pos, vel,　acc){
    var num = 1; //あとでPromise実装を作る
    var core = enchant.Core.instance;
    var scene = PlayScene.instance;
    var posObj = Camera360.setReferenceFromViewPosition(pos.x, pos.y);
    var velObj = Camera360.setReferenceFromViewPosition(vel.x, vel.y);
    var accObj = Camera360.setReferenceFromViewPosition(acc.x, acc.y);
    var e = new SimpleEnemy360(posObj, velObj, accObj);
    e.setMyMotion();
    scene.mainWindow.addChild(e);
};
