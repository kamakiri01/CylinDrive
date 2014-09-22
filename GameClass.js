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
        core.conf = {}; //TODO仮置きオブジェクト
        core.conf.ui = 0;
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

        var uiBg = new Astro360.UI.UiBg();
        uiWindow.addChild(uiBg);

        var gage = new Astro360.UI.LazerGauge();
        mainWindow.addChild(gage);

        //シリンダー回転タッチ操作用変数
        uiWindow.currentTouchY = 0;

//------------------------------------------------------
        var p = new Astro360.Player.PlayerBase();
        p.x = 150;
        p.y = CORE_HEIGHT /2;
        p.targX = 150;
        p.targY = CORE_HEIGHT /2;
        mainWindow.addChild(p);
//------------------------------------------------------
// プレイヤータッチイベント定義
//------------------------------------------------------
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
//            p.receiveFieldTouchMove[core.conf.ui](obj);
        };
//------------------------------------------------------
// MainWindowフィールドタッチイベント定義
//------------------------------------------------------
        //メイン画面のタッチイベントを自機に送る
        mainWindow.addEventListener('touchstart', function(e){
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
                        {}, //newの引数
                        [{x:CORE_WIDTH, y:Math.random()*CORE_HEIGHT/2}], //右端のどこか 
                        Astro360.EnemyMotion.Simple, //まっすぐ前進
                        {}, //前進に引数なし
                        Astro360.EnemyBullet.FanBullet, //扇状の弾のためのバレットクラス
                        Astro360.EnemyBulletMotion.RippleShot, //扇状に弾を撃つバレットモーション
                        {freq: 20, num: 5, rad: 20, spd: 15} //弾の密度と頻度と投射角度
                    );
                }

                //Uターンして帰っていく敵の生成テスト
                if(scene.age % 30 ===10){
                    Astro360.Methods.Enemy.gemEnemy(
                        Astro360.Enemy.AccEnemy360,  //一般的なエネミークラス
                        {
                            vel:{x:-30,y:10,z:0
                            }, 
                            acc:{x:1,y:0,z:0
                            }
                        }, //エネミークラスのnew引数
                        [{x:CORE_WIDTH, y: 30}], //出現初期位置
                        Astro360.EnemyMotion.Acceleration, //加速度系に属する(初回1度だけ実行)
                        {}, //エネミーモーションのモーションアーギュメント(使わないと思う)
                        Astro360.EnemyBullet.TestBullet, //まっすぐ飛ぶバレットクラス
                        Astro360.EnemyBulletMotion.StraightShot,
                        {freq: 15, num:1, spd:SPEED_BULLET0}
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
        console.log(e);
	} else if (delta > 0){
		e.preventDefault();
		//上にスクロールした場合の処理
            Camera360.instance.rotX(Math.PI/45 * 2);
        console.log(e);
	}
}
