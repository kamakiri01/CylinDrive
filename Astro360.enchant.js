/*
 * this lib need Sprite360.enchant.js
 * for viewing mode
 * Sprite360自体は他のSprite系クラスに360処理を追加するものだが、
 * Astro360で定義されるクラスはSprite360の基本クラスを基にして
 * 実際のクラスを構築する
 */
var Astro360 = {}; //本体オブジェクト
Astro360.Player = {}; //プレイヤークラス
Astro360.PlayerBullet = {}; //プレイヤーバレットクラス
Astro360.Effect = {}; //エフェクト系クラス
Astro360.UI = {}; //UI系クラス
Astro360.Enemy = {}; //エネミークラス
Astro360.EnemyBullet = {}; //エネミーバレットクラス
Astro360.EnemyMotion = {}; //エネミーEntityモーション
Astro360.EnemyBulletMotion = {}; //バレット生成とバレットのモーション定義
Astro360.Methods = {}; //各種メソッド
Astro360.Methods.Player = {}; //プレイヤー関係メソッド
Astro360.Methods.Enemy = {}; //エネミー関係メソッド

//-------------------------------------------------------
// Astro360.Player
//-------------------------------------------------------
//PlayerBaseの画像サイズは引数でSpriteと同様に指定する
Astro360.Player.PlayerBase = enchant.Class.create(Geo.Circle2, {
        initialize: function(){
            Geo.Circle2.call(this, 16);
            Astro360.Player.PlayerBase.instance = this;
            this.targX = this.x;
            this.targY = this.y;
            this.stockLazer = 1;
            this.isShouldNormalShot = false; //レーザー、とショットの切り替え、タッチ操作状態変数
            this.isDuringLazer = false;
            this.lestSafeTime = 0;
            this.lestPlayer = 3;
            this.setTouchEventArray();
            this.addEventListener('enterframe', function(){
                    this.loop();
            });
        },
        loop: function(){
            //次の移動先を指定
            var hereToTouchX = this.targX - this.x;
            var hereToTouchY = this.targY - this.y;
            this.moveApplyX(hereToTouchX/2);
            this.moveApplyY(hereToTouchY/2);
            //ノーマルショット関係
            if(this.isShouldNormalShot === true && this.isDuringLazer === false){
                this.shotN(2);
            }
            //レーザーチャージ
            if(this.stockLazer < MAX_LAZER_STOCK){
                this.stockLazer += 0.01;
            }
            //あたり判定
            if(this.lestSafeTime <= 0 && this.isDuringLazer === false){
                this.checkIntersectWithEnemy();
            }
            //無敵表示
            if(this.lestSafeTime > 0){
                this.opacity = this.lestSafeTime % 2; // 明滅
                this.lestSafeTime -= 1;
            }else{
                this.opacity = 1;
                this.lestSafeTime = 0;// 通常時
            }
        },
        checkIntersectWithEnemy: function(){
            //敵と弾全体に判定を取る
            this._checkIntersectWithEnemy(Astro360.Enemy.EnemyBase360);
        },
        _checkIntersectWithEnemy: function(enemyClassName){
            var il = enemyClassName.collection.length;
            for(var i=0;i<il;i++){
                if(this.intersect(enemyClassName.collection[i])){
                    //破壊処理
                    this.doIntersectWithEnemy();
                    break;
                }
            }
        },
        doIntersectWithEnemy: function(){
            this.lestPlayer -= 1;
            if(this.lestPlayer >= 0){
                this.lestSafeTime += 30;
            }else{
                //ゲーム終了を呼び出す
                enchant.Core.instance.endFunc2();
            }
        },
        shot1: function(){
            var s = new Astro360.PlayerBullet.PlayerNormalBullet();
            var p = Astro360.Player.PlayerBase.instance;
            //出現点を自機より前に取る
            s.x = p.x + p.width;
            s.y = p.y + p.height/2 - s.height/2 - 6;
            PlayScene.instance.mainWindow.addChild(s);
        },
        shotN: function(n){
            this.shot1();
            if(n-1 > 0){
                var that = this.shotN;
                setTimeout("Astro360.Player.PlayerBase.instance.shotN(" + n + "-1)", 100);
            }
        },
        shotLazer: function(){
            var lazer = new Astro360.PlayerBullet.PlayerLazer();
            var p = Astro360.Player.PlayerBase.instance;
            lazer.x = p.x + p.width;
            lazer.y = p.y;
            //出現点を自機より前に取る
            //s.y = p.y + p.height/2 - s.height/2;
            PlayScene.instance.mainWindow.addChild(lazer);
        },
        //タッチイベントの処理をインスタンスにセットする
        setTouchEventArray: function(){
//-------------------------------------------------------
// タッチとイベント処理パターン1
//-------------------------------------------------------
            //自身のタッチスタート
            this.receiveOwnTouchStart[0] = function(e){
                //移動
                Astro360.Player.PlayerBase.instance.receiveToMove(e);
                //残弾があればレーザー発射
                if(Astro360.Player.PlayerBase.instance.stockLazer >= 1){
                    //レーザー中でなければ発射処理開始
                    if(Astro360.Player.PlayerBase.instance.isDuringLazer === false){
                        Astro360.Player.PlayerBase.instance.isDuringLazer = true; //レーザー
                        Astro360.Player.PlayerBase.instance.stockLazer -= 1; //残弾消費
                        Astro360.Player.PlayerBase.instance.shotLazer();
                    }
                }else{
                }
                //レーザー状態に関係なくノーマルショット判定を始める
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = true;
            };
            //自身のタッチムーブ
            this.receiveOwnTouchMove[0] = function(e){
                //レーザー中でなければノーマルショット
                Astro360.Player.PlayerBase.instance.receiveToMove(e);
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = true;
            };
            //自身のタッチエンド
            this.receiveOwnTouchEnd[0] = function(e){
                //ショット停止
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = false;
            };
            //フィールドのタッチスタート
            this.receiveFieldTouchStart[0] = function(e){
                Astro360.Player.PlayerBase.instance.receiveToMove(e);
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = true;
            };//フィールドのタッチムーブ
            this.receiveFieldTouchMove[0] = function(e){
                Astro360.Player.PlayerBase.instance.receiveToMove(e);
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = true;
            };
            //フィールドのタッチエンド
            this.receiveFieldTouchEnd[0] = function(e){
                //ショット停止
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = false;
            };
//-------------------------------------------------------
// タッチとイベント処理パターン2
//-------------------------------------------------------
            //タッチとショットの処理
            this.receiveOwnTouchStart[1] =  function(e){
                console.log("ownStart2");
                //TODO: 相対移動(fieldと同等)
                //移動
                //
                Astro360.Player.PlayerBase.instance.receiveToMove(e);
                //残弾があればレーザー発射
                if(Astro360.Player.PlayerBase.instance.stockLazer >= 1){
                    //レーザー中でなければ発射処理開始
                    if(Astro360.Player.PlayerBase.instance.isDuringLazer === false){
                        Astro360.Player.PlayerBase.instance.isDuringLazer = true; //レーザー
                        Astro360.Player.PlayerBase.instance.stockLazer -= 1; //残弾消費
                        Astro360.Player.PlayerBase.instance.shotLazer();
                    }
                }else{
                }
                //レーザー状態に関係なくノーマルショット判定を始める
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = true;
            };
            this.receiveOwnTouchMove[1] = function(e){
                console.log("ownMove2");
                //レーザー中でなければノーマルショット
                Astro360.Player.PlayerBase.instance.receiveToMove(e);
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = true;
            };
            this.receiveOwnTouchEnd[1] = function(e){
                console.log("ownEnd2");
                //TODO: 相対移動(fieldと同等)
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = false;
            };

            this.receiveFieldTouchStart[1] = function(e){
                console.log("fieldStart2");
                //TODO:レーザー発射開始
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = true;
                //TODO: 相対移動
                var p = Astro360.Player.PlayerBase.instance;
                p.preTargX = p.x - e.x;
                p.preTargY = p.y - e.y;
                console.log(p.preTargX);

            };
            this.receiveFieldTouchMove[1] = function(e){
                console.log("fieldMove2");
                //ショット
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = true;
                //TODO: 相対移動
                var p = Astro360.Player.PlayerBase.instance;
                var px = e.x + p.preTargX + UI_WIDTH;
                var py = e.y + p.preTargY;
                var obj = {x: px, y: py};
                console.log(obj);
                p.targX = px;
                p.targY = py;
            };
            this.receiveFieldTouchEnd[1] = function(e){
                console.log("fieldEnd2");
                //TODO: ショット停止
                Astro360.Player.PlayerBase.instance.isShouldNormalShot = false;
            };
        },
//-------------------------------------------------------
// タッチとイベント処理パターン1
//-------------------------------------------------------
        receiveOwnTouchStart: [],
        receiveOwnTouchMove:  [],
        receiveOwnTouchEnd:   [], 
        receiveFieldTouchStart: [],
        receiveFieldTouchMove:  [],
        receiveFieldTouchEnd:   [], 
//-------------------------------------------------------
// 共有メソッド
//-------------------------------------------------------
        //targ座標を指定する。実モーションはloopからmoveApplyが呼ばれる
        receiveToMove: function(e){
            this.targX = e.x - this.width/2;
            this.targY = e.y - this.height/2;
        },
        moveApplyX: function(n){
            this.x += n - UI_WIDTH / 2;
        },
        moveApplyY: function(n){
            this.y += n;
        }
});
//-------------------------------------------------------
// Astro360.PlayerBullet
//-------------------------------------------------------
//プレイヤーのV文字ショット(ノーマル）
Astro360.PlayerBullet.PlayerNormalBullet = enchant.Class.create(enchant.Sprite, {
        initialize: function(){
            enchant.Sprite.call(this, 32, 32);
            this.opacity = 0.5;
            this.compositeOperation = 'lighter';
            var sf = new enchant.Surface(96, 32);
            var ctx = sf.context;
            //ctx.beginPath();
            ctx.fillStyle = ColorSet.PLAYERBULLET;
            ctx.scale(1.8, 0.6);
            //ctx.arc(30,35,15,0,Math.PI*2,false);
            //ctx.stroke();
                var rad = 16;
                ctx.beginPath();
                ctx.arc(rad, rad, rad, 0, Math.PI*2, true);
                ctx.arc(rad, rad, rad-4, 0, Math.PI*2, false);
                ctx.closePath();
                ctx.fill();
            this.frame = Astro360.PlayerBullet.PlayerNormalBullet.collection.length % 3; 
            //this.frame =  Math.round(Math.random()) % 3;
            //this.scaleY = Math.round(Math.random() + 1) / 2;
            //モーションループ
            this.addEventListener('enterframe', function(){
                    this.loop();
            });
            this.image = sf;
        },
        //バレットのモーション
        loop: function(){
            this.x += 50; //速度
            this.checkIntersect();
            if(this.y > CORE_WIDTH){
                this.remove();
            }
        },
        //敵とのあたり判定取得
        checkIntersect: function(){
            this.checkIntersect_(Astro360.Enemy.EnemyBase360Derivative);
        },
        //敵とのあたり判定実処理
        checkIntersect_: function(enemyClassName){
            var il = enemyClassName.collection.length;
            for(var i=0;i<il;i++){
                if(this.intersect(enemyClassName.collection[i])) {
                    //破壊エフェクト関数
                    Astro360.Methods.Enemy.gemParticle(enemyClassName.collection[i]);
                    enemyClassName.collection[i].addDamage(1);
                    this.remove();
                    break;
                }
            }
        }
});
//プレイヤーのレーザー
Astro360.PlayerBullet.PlayerLazer = enchant.Class.create(enchant.Sprite, {
        initialize: function(){
            enchant.Sprite.call(this, CORE_WIDTH, 32);
            this.opacity = 0.5;
            this.age = 0;
            this.compositeOperation = 'lighter';
            var sf = new enchant.Surface(CORE_WIDTH, 32);
            var ctx = sf.context;
            ctx.beginPath();

            var grad  = ctx.createLinearGradient(0,0, 0, 32);
            grad.addColorStop(0,   ColorSet.PLAYERLAZER0);  // 紫
            grad.addColorStop(0.5, ColorSet.PLAYERLAZER1); // 緑
            grad.addColorStop(1,   ColorSet.PLAYERLAZER0);  // 紫
            /* グラデーションをfillStyleプロパティにセット */
            ctx.fillStyle = grad;
            ctx.rect(0,0, CORE_WIDTH,32);
            ctx.fill();
            //モーションループ
            this.addEventListener('enterframe', function(){
                    this.loop();
            });
            this.image = sf;
            this.scaleY = 0;
        },
        //レーザーのモーション
        loop: function(){
            this.age += 1;
            this.opacity = this.scaleY * 0.6; 
            this.checkIntersectLazer();
            if(this.age > 40){
                this.removeLazer();
                this.remove();
            }
            var p = Astro360.Player.PlayerBase.instance;
            this.x = p.x + p.width;
            this.y = p.y;
            this.scaleY = Math.sin(this.age/40 * Math.PI);
        },
        removeLazer: function(){
            Astro360.Player.PlayerBase.instance.isDuringLazer = false; //レーザー発射判定
        },
        checkIntersectLazer: function(){
            this.checkIntersectLazer_(Astro360.Enemy.EnemyBase360);
        },
        checkIntersectLazer_: function(enemyClassName){
            var il = enemyClassName.collection.length;
            var breakList = [];
            for(var i=0;i<il;i++){
                if(this.intersect(enemyClassName.collection[i])) {
                    breakList.push(enemyClassName.collection[i]);
                }
            }
            var bl = breakList.length;
            for(var j = bl - 1;j>=0;j--){
                Astro360.Methods.Enemy.gemParticle(breakList[j]);
                breakList[j].addDamage(1);
            }
        }
});
//-------------------------------------------------------
// Astro360.Enemy
//-------------------------------------------------------
//敵の共通親クラス(バレットを含む）
Astro360.Enemy.EnemyBase360 = enchant.Class.create(Sprite360, {
        initialize: function(wx, wy){
            Sprite360.call(this, wx, wy);
            this.shotsArray = []; //撃った弾への参照を持っておく
            var core = enchant.Core.instance;
            this.myBulletClass = {};
            this.myMotionFunc = function(){};
            this.myMotionArg = {};
            this.myBulletFunc = function(){};
            this.myBulletArg = {};
            this.life = 1;
            this.addEventListener('enterframe', function(){
                    //2Dマッピングで画面外に出たら消える
                    if(this.x < 0 || this.x > core.width || this.y < 0 || this.y > core.height){
                        this.remove();
                    } 
            });
        },
        addDamage: function(param){
            this.life -= param;
            if(this.life <= 0){
                this.removeAction();
            }
        },
        removeAction: function(){
            enchant.Core.instance.score += 100;
            this.remove();
        }
});
//エネミーバレットを含まない敵の親クラス
Astro360.Enemy.EnemyBase360Derivative = enchant.Class.create(Astro360.Enemy.EnemyBase360, {
        initialize: function(wx, wy){
            Astro360.Enemy.EnemyBase360.call(this, wx, wy);
    }
});
//シンプルな三角形の表示エネミー
//@param
//{}
Astro360.Enemy.TriangeEnemy = enchant.Class.create(Astro360.Enemy.EnemyBase360Derivative, {
        initialize: function(argObj){
            Astro360.Enemy.EnemyBase360Derivative.call(this, 20, 20);
            var sf = new Surface(20, 20);
            this.image = sf;
            this.sCtx = sf.context;
            this.sCtx.beginPath();              
            this.sCtx.strokeStyle= ColorSet.ENEMY_TRIANGLE;
            this.sCtx.moveTo(12, 1);
            this.sCtx.lineTo(20, 15);
            this.sCtx.lineTo(4, 15);
            this.sCtx.closePath();
            //this.sCtx.stroke();
            this.sCtx.fill();
            this.frame = 7;
            //もしlife定義があれば使用
            if(argObj.life !== undefined){
                this.life = argObj.life;
            }
        }
});
//加速度系処理を行う敵クラス(new時点のcore.thetaを参照)
//@param
//{
//  acc:{x: int, y: int},
//  vel:{x: int, y: int}
//}
//
Astro360.Enemy.AccEnemy360 = enchant.Class.create(Astro360.Enemy.EnemyBase360Derivative, {
        initialize: function(argObj){
            Astro360.Enemy.EnemyBase360Derivative.call(this, 20, 20);
            //表示は三角
            var sf = new Surface(20, 20);
            this.image = sf;
            this.sCtx = sf.context;
            this.sCtx.beginPath();              
            this.sCtx.strokeStyle= ColorSet.ENEMY_ACCENEMY;
            this.sCtx.moveTo(12, 1);
            this.sCtx.lineTo(20, 15);
            this.sCtx.lineTo(4, 15);
            this.sCtx.closePath();
            //this.sCtx.stroke();
            this.sCtx.fill();
            this.frame = 7;

            var core = enchant.Core.instance;
            var accObj = Camera360.setReferenceFromViewPosition(
                argObj.acc.x, 
                argObj.acc.y + core.height/2);
            var velObj = Camera360.setReferenceFromViewPosition(
                argObj.vel.x, 
                argObj.vel.y + core.height/2);
            //px系はgemEnemyでのみ設定される
            this.px = 0; //posObj.x;
            this.py = 0; //posObj.y;
            this.pz = 0; //posObj.z;
            this.velX = velObj.x;
            this.velY = velObj.y;
            this.velZ = velObj.z;
            this.accX = accObj.x;
            this.accY = accObj.y;
            this.accZ = accObj.z;

            //もしlife定義があれば使用
            if(argObj.life !== undefined){
                this.life = argObj.life;
            }
        }
});
//加速度系処理を行う敵クラス。ただし、new時点のcore.thetaを参照しない。
//argobjで指定された座標をそのまま利用する)
//TODO:コンストラクタに引き渡すvel, accにはCamera360.setReferenceFromViewPosition{x, y}を通すこと）
//@param
//{
//  acc:{x: int, y: int, z: int},
//  vel:{x: int, y: int, z: int}
//}
//
Astro360.Enemy.AccEnemy360FixedReference = enchant.Class.create(Astro360.Enemy.EnemyBase360Derivative, {
    initialize: function(argObj){
            Astro360.Enemy.EnemyBase360Derivative.call(this, 20, 20);
            //表示は三角
            var sf = new Surface(20, 20);
            this.image = sf;
            this.sCtx = sf.context;
            this.sCtx.beginPath();              
            this.sCtx.strokeStyle= ColorSet.ENEMY_ACCENEMY;
            this.sCtx.moveTo(12, 1);
            this.sCtx.lineTo(20, 15);
            this.sCtx.lineTo(4, 15);
            this.sCtx.closePath();
            this.sCtx.fill();
            this.frame = 7;

            var velObj = argObj.vel;
            var accObj = argObj.acc;
            //px系はgemEnemyでのみ設定される
            this.px = 0; //posObj.x;
            this.py = 0; //posObj.y;
            this.pz = 0; //posObj.z;
            this.velX = velObj.x;
            this.velY = velObj.y;
            this.velZ = velObj.z;
            this.accX = accObj.x;
            this.accY = accObj.y;
            this.accZ = accObj.z;
            //もしlife定義があれば使用
            if(argObj.life !== undefined){
                this.life = argObj.life;
            }
    }
});
//-------------------------------------------------------
// Astro360.Effect
//-------------------------------------------------------
//敵の破壊でばらまかれるパーティクルの個別クラス
Astro360.Effect.breakParticleDot = enchant.Class.create(Dot, {
    initialize: function(e){
        Dot.call(this);
        var scr = 6;
        this.age = 0;
        this.x = e.x;
        this.y = e.y;
        this.polarT = Math.random() * Math.PI;
        this.polarR = Math.round(Math.random()* 2)+Math.random();
        this.accX = Math.round(scr * Math.cos(this.polarT));
        this.accY = Math.round(scr * Math.sin(this.polarT));
        this.addEventListener('enterframe', function(){
                this.x += this.accX;
                this.y += this.accY;
                this.age += 1;
                this.opacity -= 0.1;
                this.scaleX -= 0.05;
                this.scaleY -= 0.05;
                if(this.age > enchant.Core.instance.fps * 1){
                    this.remove();
                }
        });
    }
});
//-------------------------------------------------------
//Astro360.EnemyBullet
//-------------------------------------------------------
//てきのたまベースクラス
Astro360.EnemyBullet.BulletBase = enchant.Class.create(Astro360.Enemy.EnemyBase360, {
        initialize: function(wx, wy){
            Astro360.Enemy.EnemyBase360.call(this, wx, wy);
    }
});
//敵のシングルショット
Astro360.EnemyBullet.TestBullet = enchant.Class.create(Astro360.EnemyBullet.BulletBase, {
        initialize: function(spd){
            Astro360.EnemyBullet.BulletBase.call(this, 8, 8);
            this.image = Dot.surface;
            this.frame = 5;
            this.spd = spd;
        },
        setMyMotion: function(){
            this.addEventListener('enterframe', function(){
                this.px -= this.spd;
            });
        }
});
//敵の扇状に広がる弾
Astro360.EnemyBullet.FanBullet = enchant.Class.create(Astro360.EnemyBullet.BulletBase, {
    initialize: function(){
        Astro360.EnemyBullet.BulletBase.call(this, 8, 8);
        this.image = Dot.surface;
        this.frame = 2;
    },
    setMyMotion: function(){
        this.addEventListener('enterframe' ,function(){
                this.px += this.pax;
                this.py += this.pay;
                this.pz += this.paz;
        });
    }
});
//-------------------------------------------------------
//Astro360.EnemyMotion //敵スプライトの移動モーション管理3D
//-------------------------------------------------------
//ただまっすぐ進むモーション
Astro360.EnemyMotion.Simple = function(enem, argObj){
    enem.addEventListener('enterframe', function(){
            enem.px -= argObj.spd;
            enem.rotation -= argObj.rot;
    });
};
//加速度系を持たせる基本モーション
Astro360.EnemyMotion.Acceleration = function(enem){
    enem.addEventListener('enterframe', function(){
            enem.velX += enem.accX;
            enem.velY += enem.accY;
            enem.velZ += enem.accZ;
            enem.px += enem.velX;
            enem.py += enem.velY;
            enem.pz += enem.velZ;
    });
};
//途中で一度方向転換するモーション
//@param
//motionArg = {delay: int,
//              vx2~az2: int,
//             function: func(enem),
//             }
Astro360.EnemyMotion.DoubleAction = function(enem, motionArg){
    var delay = motionArg.delay;
//    var vx1 = motionArg.vx1;
//    var vy1 = motionArg.vy1;
//    var vz1 = motionArg.vz1;
//    var ax1 = motionArg.ax1;
//    var ay1 = motionArg.ay1;
//    var az1 = motionArg.az1;
    var vx2 = motionArg.vel2.x;
    var vy2 = motionArg.vel2.y;
    var vz2 = motionArg.vel2.z;
    var ax2 = motionArg.acc2.x;
    var ay2 = motionArg.acc2.y;
    var az2 = motionArg.acc2.z;
    var func;
    if(motionArg.func !==undefined){
        func = motionArg.func;
    }
    enem.addEventListener('enterframe', function(){
            if(enem.age === delay){
                enem.velX = vx2;
                enem.velY = vy2;
                enem.velZ = vz2;
                enem.accX = ax2;
                enem.accY = ay2;
                enem.accZ = az2;
                if(func !== undefined){
                    func(enem);
                }
            }
            enem.velX += enem.accX;
            enem.velY += enem.accY;
            enem.velZ += enem.accZ;
            enem.px += enem.velX;
            enem.py += enem.velY;
            enem.pz += enem.velZ;
    });
};
//-------------------------------------------------------
//Astro360.EnemyBulletMotion //敵のショットモーション（タイミング含む）
//-------------------------------------------------------
//何も撃たないモーション
Astro360.EnemyBulletMotion.NoShot= function(){
};
//直進弾を撃つモーション
//argobj = {spd: int, freq: int}
Astro360.EnemyBulletMotion.StraightShot= function(enem, argObj){
    var freq = argObj.freq;
    var spd  = argObj.spd;
    if(enem.age % freq === 0){
        //var b = new Astro360.EnemyBullet.TestBullet(spd);
        var b = new enem.myBulletClass(spd);
        b.px = enem.px;
        b.py = enem.py;
        b.pz = enem.pz;
        b.setMyMotion();
        b.loop();//座標が00になってしまうのを防ぐ
        if(enem.parentNode !== null){
            enem.parentNode.addChild(b);
        }
    }
};
//扇状に撃つモーション
//@param
//argObj = {num: int, 
//          spd: int, 
//          rad: int,
//          freq:int,}
Astro360.EnemyBulletMotion.RippleShot = function(enem, argObj){
    var freq = argObj.freq;
    if(enem.age % freq === 0){
        var c = Camera360.instance;
        var core = enchant.Core.instance;
        var theta = c.theta;
        var mx = enem.x;
        var my = enem.y;
        var num = argObj.num;
        var rad = argObj.rad;
        var spd = argObj.spd;
        for(var i=0;i<num;i++){
            var b = new enem.myBulletClass();
            b.px = enem.px;
            b.py = enem.py;
            b.pz = enem.pz;
            var currentRad = (rad * (i / num - 1/ 2)) * Math.PI/180;
            var bax = Math.cos(currentRad) * spd;
            var bay = Math.sin(currentRad) * spd;
            var aPos = Camera360.setReferenceFromViewPosition(bax, bay + core.height/2); //TODO y座標はmasterが中心なのでリファレンス計算の高さ補正を相殺するために半分足す
            b.pax = - aPos.x;
            b.pay = - aPos.y;// * Math.cos(theta);
            b.paz = - aPos.z; //;* Math.sin(theta);
            b.setMyMotion();
            b.loop(); //座標が00になってしまうのを防ぐ
            if(enem !== null){ //parentNodeだけ存在しなくて落ちる場合がある
                if(enem.parentNode !== null){
                    enem.parentNode.addChild(b);
                }
            }
        }
    }
};
//-------------------------------------------------------
// astro360.Methods.Enemy
//-------------------------------------------------------
//座標を入れて破壊のパーティクルを生成する
Astro360.Methods.Enemy.gemParticle = function(e){
    for(var i=0;i<10;i++){
        var d = new Astro360.Effect.breakParticleDot(e);
        PlayScene.instance.mainWindow.addChild(d);
    }
};
//任意の敵を1つ生成する
//生成エネミークラス、生成初期位置、運動関数、運動引数、
//バレットクラス、バレット関数、バレット引数
//出現座標は固定、加速度・速度に対してgemEnemy内では処理を変えない
//@param
//Enemyclass     Astro360.Enemy             生成エネミークラス
//enemyArg       {}                         生成引数                    エネミークラス依存
//posArray       [{x:int, y:int}]           初期位置配列
//motionfunc     Astro360.EnemyMotion       モーション関数
//motionArg      {}                         モーション引数              モーション関数依存
//BulletClass    Astro360.EnemyBullet       バレットクラス
//bulletFunc     Astro360.EnemyBulletMotion バレットモーション関数
//bulletArg      {}                         バレットモーション引数      バレットモーション関数依存
//normalizeFrag  Bool                       その時点の鉛直平面に揃えるか
Astro360.Methods.Enemy.gemEnemy = function(EnemyClass, enemyArg, posArray, motionFunc, motionArg, BulletClass, bulletFunc, bulletArg, normalizeFrag){
    var core = enchant.Core.instance;
    var scene = PlayScene.instance;
    var len = posArray.length;
    for(var i=0;i<len;i++){
        var e = new EnemyClass(enemyArg);
        //フラグ有効時は2D座標が、falseでは入力されるべきPX座標系が直接渡されている
        if(normalizeFrag === true){
            e.x = posArray[i].x;
            e.y = posArray[i].y;
            Camera360.setCurrentNormalPosition(e);
        }else{
            e.px = posArray[i].x;
            e.py = posArray[i].y;
            e.pz = posArray[i].z;
            e.loop(); //xy座標代入のため
        }
        e.myBulletClass = BulletClass; //バレットEntityクラス
        e.myBulletFunc = bulletFunc; //バレット生成とバレットのモーション(毎フレーム呼ばれる)
        e.myBulletArg = bulletArg; //バレット生成モーションの引数 bulletfunc(bulletarg)
        motionFunc(e, motionArg); //ここで引数を取る
        e.addEventListener('enterframe', function(){
                e.myBulletFunc(e, e.myBulletArg);
        });
        scene.mainWindow.addChild(e);
    }
};
//出現時点の回転状態などを固定して複数の加速系エネミーを生成する。一定間隔で同じposobj座標に生成する
//settimeoutなのでCoreのフレーム対する遅延保証がない。遅い環境だとレイアウト崩れるかも。
//実質的にAstro360.Enemy.AccEnemy360FixedReference 専用の隊列生成メソッド
//@param
//Enemyclass     Astro360.Enemy             生成エネミークラス
//enemyArg       {vel:{x:int, y:int}, acc:{x:int, y:int}}
//posObj         {x:int, y:int} 出現座標
//num            int                        繰り返し数
//delay          int                        遅延
//motionfunc     Astro360.EnemyMotion       モーション関数
//motionArg      {}                         モーション引数              モーション関数依存
//BulletClass    Astro360.EnemyBullet       バレットクラス
//bulletFunc     Astro360.EnemyBulletMotion バレットモーション関数
//bulletArg      {}                         バレットモーション引数      バレットモーション関数依存
//referenceFrag
Astro360.Methods.Enemy.gemLinearAccEnemyUnit = function(EnemyClass, enemyArg, posObj, num, delay, motionFunc, motionArg, BulletClass, bulletFunc, bulletArg, referenceFrag){
    var core = enchant.Core.instance;
    var scene = PlayScene.instance;
    var handOverPosObj = {};
    //初回のみ入力は2D系なので座標生成処理
    if(referenceFrag === true){
        handOverPosObj = Camera360.setReferenceFromViewPosition(posObj.x, posObj.y);
        var velObj = Camera360.setReferenceFromViewPosition(enemyArg.vel.x, enemyArg.vel.y + core.height/2);
        var accObj = Camera360.setReferenceFromViewPosition(enemyArg.acc.x, enemyArg.acc.y + core.height/2);
        enemyArg.vel = velObj;
        enemyArg.acc = accObj;
    }else{
        handOverPosObj = posObj;
    }
    var posArray = [handOverPosObj]; //3D座標
    Astro360.Methods.Enemy.gemEnemy(
        EnemyClass, 
        enemyArg, 
        posArray, 
        motionFunc, 
        motionArg, 
        BulletClass, 
        bulletFunc, 
        bulletArg, false);
    if(num > 0){
        //再帰呼び出し
        setTimeout(function(){
                Astro360.Methods.Enemy.gemLinearAccEnemyUnit(
                    EnemyClass, 
                    enemyArg, 
                    handOverPosObj, 
                    num - 1, 
                    delay, 
                    motionFunc, 
                    motionArg, 
                    BulletClass, 
                    bulletFunc, 
                    bulletArg, false); //2回目以降は3D座標が入力される
        }, 
        delay);
    }
};
//--------------------
//インターフェース回りのクラス定義
//回転のためのスライダー
Astro360.UI.UiBg = enchant.Class.create(enchant.Group, {
        initialize: function(){
            enchant.Group.call(this);
            var bg = new Sprite(UI_WIDTH, CORE_HEIGHT);
            var sf = new Surface(UI_WIDTH, CORE_HEIGHT);
            var ctx = sf.context;
            ctx.beginPath();
            //外枠を黒\塗り
            ctx.fillStyle = ColorSet.UIBORDER;
            ctx.fillRect(0, 0, UI_WIDTH, CORE_HEIGHT);
            //グラデーション
            var grad  = ctx.createLinearGradient(0,0, 0, CORE_HEIGHT);
            grad.addColorStop(0,  ColorSet.UIBG0);  // 紫
            grad.addColorStop(0.5,ColorSet.UIBG1);  // 紫
            grad.addColorStop(1,  ColorSet.UIBG0); // 緑
            /* グラデーションをfillStyleプロパティにセット */
            ctx.fillStyle = grad;
            ctx.rect(3,3, UI_WIDTH-6, CORE_HEIGHT-6);
            ctx.fill();
            bg.image = sf;
            this.addChild(bg);
            this.addEventListener('enterframe', function(e){
                    var core = enchant.Core.instance;
                    var c = Camera360.instance;
                    var theta = c.theta;
                    var theta_height = e.y / CORE_HEIGHT;
                    //前フレームのグラデーションの削除
                    ctx.clearRect(3, 3, UI_WIDTH-6, CORE_HEIGHT-6);
                    //グラデーションの更新
                    var grad  = ctx.createLinearGradient(0,0, 0, CORE_HEIGHT);
                    grad.addColorStop(0,  ColorSet.UIBG0);
                    grad.addColorStop(theta_height, ColorSet.UIBG1);
                    grad.addColorStop(1,  ColorSet.UIBG0);
                    /* グラデーションをfillStyleプロパティにセット */
                    ctx.fillStyle = grad;
                    ctx.rect(3,3, UI_WIDTH-6, CORE_HEIGHT-6);
                    ctx.fill();

            });
        }
});
//スマホ操作系では45度回転ボタン、レーザーボタンをUIに含める
Astro360.UI.UiBgSP = enchant.Class.create(enchant.Group, {
        initialize: function(){
            enchant.Group.call(this);
            var upButton = new Sprite(UI_WIDTH, CORE_HEIGHT/3);
            upButton.x = 0;
            upButton.y = 0;
            var downButton = new Sprite(UI_WIDTH, CORE_HEIGHT/3);
            downButton.x = 0;
            downButton.y = CORE_HEIGHT/3 * 2;
            var lazerButton = new Sprite(UI_WIDTH, CORE_HEIGHT/3);
            lazerButton.x = 0;
            lazerButton.y = CORE_HEIGHT/3;
            var sf = new Surface(UI_WIDTH, CORE_HEIGHT/3);
            var ctx = sf.context;
            //外枠を黒塗り
            ctx.fillStyle = ColorSet.UIBORDER;
            ctx.fillRect(0, 0, UI_WIDTH, CORE_HEIGHT/3);
            ctx.fillStyle = ColorSet.UIBUTTON;
            ctx.fillRect(3,3, UI_WIDTH-6, CORE_HEIGHT/3 - 6);
            upButton.image = sf;
            downButton.image = sf;
            lazerButton.image = sf;
            
            upButton.addEventListener('touchstart', function(e){
                    //45度回転
                    Camera360.instance.delayRot(45, 0, 10);
            });
            downButton.addEventListener('touchstart', function(e){
                //-45度回転
                    Camera360.instance.delayRot(-45, 0, 10);
            });
            lazerButton.addEventListener('touchstart', function(e){
                //レーザー発射
                var p = Astro360.Player.PlayerBase.instance;
                p.receiveOwnTouchStart[1]({x:p.x + UI_WIDTH + 16, y:p.y + 16});

            });



            this.addChild(upButton);
            this.addChild(downButton);
            this.addChild(lazerButton);
        }   
});
//背景でぐるぐる回るやつ
Astro360.UI.MainBg = enchant.Class.create(enchant.Group, {
        initialize: function(){
            enchant.Group.call(this);
            //if(window['gl']){
            if(window['gl']){
                console.log("gl enable");
                var bg3d = Astro360.gl.UI.MainBg3D();
                //Scene3d適用によるGroupのあたり判定作成用の透明背景
                var bg2d = new Sprite(CORE_WIDTH, CORE_HEIGHT);
                bg2d.image = new Surface(CORE_WIDTH, CORE_HEIGHT);
                bg2d.opacity = 0.0001;
                this.addChild(bg2d);
            }else{
                console.log("gl disable");
            }
        }
});
//レーザーチャージゲージ
Astro360.UI.LazerGauge = enchant.Class.create(enchant.Group, {
    initialize: function(){
        enchant.Group.call(this);
        var w = GAUGE_WIDTH * MAX_LAZER_STOCK;

        var gage = new Sprite(w, GAUGE_HEIGHT);
        var sfg = new Surface(w, GAUGE_HEIGHT);
        var ctxg = sfg.context;
        ctxg.beginPath();
        ctxg.fillStyle = ColorSet.LAZERGAUGE;
        ctxg. fillRect(0, 0, w, GAUGE_HEIGHT);
        gage.image = sfg;
        //レーザーの残弾を反映
        gage.addEventListener('enterframe', function(){
            ctxg.clearRect(0, 0, w, GAUGE_HEIGHT);
            ctxg. fillRect(0, 0, GAUGE_WIDTH * Astro360.Player.PlayerBase.instance.stockLazer, GAUGE_HEIGHT);
        });
        this.addChild(gage);

        var grid = new Sprite(w, GAUGE_HEIGHT);
        var sf = new Surface(w, GAUGE_HEIGHT);
        var ctx = sf.context;
        ctx.strokeRect(0, 0, w, GAUGE_HEIGHT);
        ctx.beginPath();
        for(var i=0;i<MAX_LAZER_STOCK;i++){
            ctx.moveTo(GAUGE_WIDTH * i, 0);
            ctx.lineTo(GAUGE_WIDTH * i,  GAUGE_HEIGHT);
        }
        ctx.closePath();
        ctx.stroke();
        grid.image = sf;
        this.addChild(grid);
    }
});

//残機表示スプライト
Astro360.UI.LestUnit = enchant.Class.create(enchant.Sprite, {
    initialize: function(){
        enchant.Sprite.call(this, GAUGE_HEIGHT * 5, GAUGE_HEIGHT);
        var sf = new Surface(GAUGE_HEIGHT, GAUGE_HEIGHT);
        var ctx = sf.context;
        var rad = GAUGE_HEIGHT /2;
        ctx.strokeStyle = ColorSet.LESTUNIT;
        ctx.beginPath();
        ctx.arc(rad, rad, rad, 0, Math.PI*2, true);
        ctx.arc(rad, rad, rad-4, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        this.image = sf;
        this.addEventListener('enterframe', function(){
                var p = Astro360.Player.PlayerBase.instance;
                if(p.lestPlayer >= 0){
                    this.width = GAUGE_HEIGHT * p.lestPlayer;
                };//elseは発生しない
        });
    }
});

//獲得スコア表示ラベル
Astro360.UI.ScoreLabel = enchant.Class.create(enchant.Label, {
    initialize: function(){
        enchant.Label.call(this);
        var core = enchant.Core.instance;
        this.font = "32px sans bold";
        this.color = ColorSet.SCORELABEL;
        this.addEventListener('enterframe', function(){
                this.text = core.score + "Pt";
                if(core.score > 20000){
                    core.endFunc();
                }
        });
    }
});
