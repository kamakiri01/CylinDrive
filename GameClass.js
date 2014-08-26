var CORE_WIDTH = 640;
var CORE_HEIGHT = 640;
var PLAYWINDOW_HEIGHT = 500;
var UI_WIDTH = 70;

var core = enchant.Core.instance;
var PlayScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
        enchant.Scene.call(this);
        var core = enchant.Core.instance;
        var cameraConf = {
            x: core.width / 2,
            y: core.height / 2,
            z: -core.height * 3,
            centerX: core.width / 2,
            centerY: core.height / 2,
            centerZ: 0,
            upVectorX: 0,
            upVectorY: -1,
            upVectorZ: 0
        };
        var camera = new Camera360(cameraConf);
        var mainWindow = new enchant.Group();
        var uiWindow = new enchant.Group();
        mainWindow.x = UI_WIDTH;
        this.addChild(mainWindow);
        this.addChild(uiWindow);

        var mainBg = new enchant.Sprite(enchant.Core.instance.width, enchant.Core.instance.height *2 /3);
        mainWindow.addChild(mainBg);

        //タッチ操作用変数
        uiWindow.currentTouchY = 0;

        var uiBg = new enchant.Sprite(UI_WIDTH, CORE_HEIGHT);
        uiBg.image = core.assets[IMAGE_UI_ARROW];
        uiWindow.addChild(uiBg);
        var p = new PlayerBase();
        mainWindow.addChild(p);
        
        //メイン画面のタッチイベントを自機に送る
        mainWindow.addEventListener('touchmove', function(e){
                p.receiveTouchEvent(e, UI_WIDTH);
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

        //敵を出しまくる
        this.addEventListener('enterframe', function(){
                //適当に敵を出す
                if(enchant.Core.instance.currentScene.age %30 === 0){
                    var e = new TestEnemyBase360();
                    e.x = CORE_WIDTH;
                    e.y = CORE_HEIGHT * Math.random() / 2;
                    Camera360.setCurrentNormalPosition(e);
                    e.addEventListener('enterframe', function(){
                            this.px -= 0.01;
                            //こまめにふつうのショット
                            if(this.age % 50 === 0){
                                var b = new TestBulletBase();
                                b.px = this.px;
                                b.py = this.py;
                                b.pz = this.pz;
                                b.setMyMotion();
                                this.parentNode.addChild(b);
                            }
                            //たまに放射状にうつ
                            if(this.age % 90 === 0){
                                createRippleBullet(e, 10, 30, 4);
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
//        //ドット生成で座標変換の確認用メソッド
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
