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
//------------------------------------------------------
        //プレイヤーを出す
        var p = new Astro360.Player.PlayerBase();
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
//------------------------------------------------------
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
//------------------------------------------------------
        //テストとして扇状の弾を撃つ敵をランダムに出現させる
        this.addEventListener('enterframe', function(){
                var scene = enchant.Core.instance.currentScene;
                if(scene.age % 30 === 0){
                    Astro360.Methods.Enemy.gemEnemy(
                        Astro360.Enemy.TestEnemyBase360,  //一般的なエネミークラス
                        [{x:CORE_WIDTH, y:Math.random()*CORE_HEIGHT/2}], //右端のどこか 
                        Astro360.EnemyMotion.Simple, //まっすぐ前進
                        {}, //前進に引数なし
                        Astro360.EnemyBullet.FanBullet, //扇状の弾のためのバレットクラス
                        Astro360.EnemyBulletMotion.RippleShot, //扇状に弾を撃つ
                        {freq: 20, num: 5, rad: 20, spd: 15} //弾の密度と頻度と投射角度
                    );
                }
        });
//------------------------------------------------------
//キーイベント入力の受付
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
        initKeyEvents();
    }
});
//キーイベントからカメラ回転イベントの呼び出し
var initKeyEvents = function(){
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

