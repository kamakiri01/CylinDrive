/*
 * this lib need Sprite360.enchant.js
 * for viewing mode
 * Sprite360自体は他のSprite系クラスに360処理を追加するものだが、
 * Astro360で定義されるクラスはSprite360の基本クラスを基にして
 * 実際のクラスを構築する
 */
var Astro360 = {};
Astro360.Player = {};
Astro360.PlayerBullet = {};
Astro360.Enemy = {};
Astro360.EnemyBullet = {};
Astro360.EnemyMotion = {};
Astro360.EnemyBulletMotion = {};
Astro360.Methods = {};
Astro360.Methods.Player = {};
Astro360.Methods.Enemy = {};

//PlayerBaseの画像サイズは引数でSpriteと同様に指定する
Astro360.Player.PlayerBase = enchant.Class.create(Geo.Circle, {
        initialize: function(){
            Geo.Circle.call(this, 32);
            Astro360.Player.PlayerBase.instance = this;
            this.targX = this.x;
            this.targY = this.y;
            this.addEventListener('enterframe', function(){
                    this.loop();
            });
        },
        loop: function(){
            var hereToTouchX = this.targX - this.x;
            var hereToTouchY = this.targY - this.y;
            this.moveApplyX(hereToTouchX/2);
            this.moveApplyY(hereToTouchY/2);
        },
        shotNum:  function(n, func){
            var loopCount = 0;
            return(function(){
                    //init timing
                    var fetchShot = function(){
                        var p = new Promise(function(done){
                                console.log("shot");
                                var f = function(){
                                    func();
                                    done();
                                };
                                window.setTimeout("f()", 30000);
                        });
                        p.then(function(){
                                if(loopCount < n){
                                    loopCount += 1;
                                    var p = fetchShot();
                                    p();
                                }else{
                                    //ending
                                    console.log("end");
                                }
                        })
                    };
                    fetchShot();
            });
        },
        shot1: function(){
            var s = new Astro360.PlayerBullet.PlayerNormalBullet();
            s.x = Astro360.Player.PlayerBase.instance.x;
            s.y = Astro360.Player.PlayerBase.instance.y;
            PlayScene.instance.mainWindow.addChild(s);
        },
        shotN: function(n){
            this.shot1();
            if(n-1 > 0){
                var that = this.shotN;
                setTimeout("Astro360.Player.PlayerBase.instance.shotN(" + n + "-1)", 100);
            }
        },
        //タッチスタートでショット発射、その座標向けて移動
        receiveTouchStart: function(e){
            this.shotN(3);
            this.targX = e.x + this.width/2;
            this.targY = e.y - this.height/2;
        },
        receiveTouchMove: function(e){
            this.targX = e.x + this.width/2;
            this.targY = e.y - this.height/2;
        },
        moveApplyX: function(n){
            this.x += n - UI_WIDTH;
        },
        moveApplyY: function(n){
            this.y += n;
        }
});

//プレイヤーのV文字ショット(ノーマル）
Astro360.PlayerBullet.PlayerNormalBullet = enchant.Class.create(enchant.Sprite, {
        initialize: function(){
            enchant.Sprite.call(this, 32, 32);
            this.opacity = 0.5;
            this.compositeOperation = 'lighter';
            var sf = new enchant.Surface(32, 32);
            var ctx = sf.context;
            ctx.beginPath();
            ctx.scale(1.4, 0.6);
            ctx.arc(30,35,15,0,Math.PI*2,false);
            ctx.stroke();
            //モーションループ
            this.addEventListener('enterframe', function(){
                    this.loop();
            });
            this.image = sf;
        },
        //バレットのモーション
        loop: function(){
            this.x += 40;
            this.checkIntersect();
            if(this.y > CORE_WIDTH){
                this.remove();
            }
        },
        //敵とのあたり判定取得
        checkIntersect: function(){
            this.checkIntersect_(Astro360.Enemy.EnemyBase360);
        },
        //敵とのあたり判定実処理
        checkIntersect_: function(enemyClassName){
            var il = enemyClassName.collection.length;
            for(var i=0;i<il;i++){
                if(this.intersect(enemyClassName.collection[i])) {
                    //破壊エフェクト関数
                    Astro360.Methods.Enemy.gemParticle(enemyClassName.collection[i]);
                    enemyClassName.collection[i].remove();
                    this.remove();
                    break;
                }
            }
        }
});
//------------------------------------------
//敵関係のクラス定義
//------------------------------------------
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
            this.addEventListener('enterframe', function(){
                    //age++
                    this.myMotionFunc(this, this.myMotionArg);
                    this.myBulletFunc(this, this.myBulletArg);
                    //2Dマッピングで画面外に出たら消える
                    if(this.x < 0 || this.x > core.width || this.y < 0 || this.y > core.height){
                        this.remove();
                    } 
            });
        }
//        myBulletClass: { configurable: true, value: {} },
//        myMotionFunc: function(){},
//        myMotionArg: { configurable: true, value: {} },
//        myBulletFunc: function(){},
//        myBulletArg: { configurable: true, value: {configurable: true} }
});

//バレットを含まない敵の親クラス
Astro360.Enemy.EnemyBase360Derivative = enchant.Class.create(Astro360.Enemy.EnemyBase360, {
        initialize: function(wx, wy){
            Astro360.Enemy.EnemyBase360.call(this, wx, wy);
    }
});

Astro360.Enemy.TestEnemyBase360 = enchant.Class.create(Astro360.Enemy.EnemyBase360Derivative, {
        initialize: function(){
            Astro360.Enemy.EnemyBase360Derivative.call(this, 20, 20);
            var sf = new Surface(20, 20);
            this.image = sf;
            this.sCtx = sf.context;
            this.sCtx.beginPath();              
            this.sCtx.strokeStyle='#3333ff';     
            this.sCtx.moveTo(12, 1);
            this.sCtx.lineTo(20, 15);
            this.sCtx.lineTo(4, 15);
            this.sCtx.closePath();
            this.sCtx.stroke();
            this.frame = 7;
        },
        setMyMotion: function(){
            this.addEventListener('enterframe', function(){
                    this.rotation -= 1;
                    this.px -=SPEED_ENEMY0;
            });
        }
});
//実装テストを行う敵クラス
//任意の初期速度、加速度を持つ
Astro360.Enemy.SimpleEnemy360 = enchant.Class.create(Astro360.Enemy.EnemyBase360Derivative, {
        initialize: function(posObj, velObj, accObj){
            EnemyBase360Derivative.call(this, 32, 32);
            this.image = enchant.Core.instance.assets[IMAGE_PLAYER_BASE];
            this.frame = 7;
            this.scaleX = -1;
            this.px = posObj.x;
            this.py = posObj.y;
            this.pz = posObj.z;
            this.velX = velObj.x;
            this.velY = velObj.y;
            this.velZ = velObj.z;
            this.accX = accObj.x;
            this.accY = accObj.y;
            this.accZ = accObj.z;
        },
        setMyMotion: function(){
            this.addEventListener('enterframe', function(){
                    this.velX += this.accX;
                    this.velY += this.accY;
                    this.velZ += this.accZ;
                    this.px += this.velX;
                    this.py += this.velY;
                    this.pz += this.velZ;
            });
        }
});

Astro360.EnemyMotion.Simple = function(enem, argObj){
    enem.px -= SPEED_ENEMY0;
    enem.rotation -= 1;
};

Astro360.EnemyBulletMotion.RippleShot = function(enem, argObj){
    var freq = argObj.freq;
    if(enem.age % freq === 0){
        var c = Camera360.instance;
        var core = enchant.Core.instance;
        var theta = c.theta;
        var mx = enem.x;
        var my = enem.y;
        var num = argObj.num;
        console.log(argObj);
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
            if(enem !== null){
                enem.parentNode.addChild(b);
            }
        }
    }
};


//てきのたまベース
Astro360.EnemyBullet.BulletBase = enchant.Class.create(Astro360.Enemy.EnemyBase360, {
        initialize: function(wx, wy){
            Astro360.Enemy.EnemyBase360.call(this, wx, wy);
    }
});
//敵のシングルショット
Astro360.EnemyBullet.TestBulletBase = enchant.Class.create(Astro360.EnemyBullet.BulletBase, {
        initialize: function(){
            Astro360.EnemyBullet.BulletBase.call(this, 16, 16);
            this.image = Dot.surface;
            this.frame = 5;
        },
        setMyMotion: function(){
            this.addEventListener('enterframe', function(){
                this.px -= SPEED_BULLET0;
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
//--------------------
//インターフェース回りのクラス定義

//回転スライダーのグループ
var UiBg = enchant.Class.create(enchant.Group, {
        initialize: function(){
            enchant.Group.call(this);
            var bg = new Sprite(UI_WIDTH, CORE_HEIGHT);
            var sf = new Surface(UI_WIDTH, CORE_HEIGHT);
            var ctx = sf.context;
            ctx.beginPath();
            ctx.fillStyle = 'rgba(1, 1, 1, 1)';
            ctx.fillRect(0, 0, UI_WIDTH, CORE_HEIGHT);
            ctx.fillStyle = 'rgba(1, 100, 100, 100)';
            ctx. fillRect(3, 3, UI_WIDTH-6, CORE_HEIGHT-6);
            bg.image = sf;
            this.addChild(bg);
        }
});
//背景でぐるぐる回るやつ
var MainBg = enchant.Class.create(enchant.Group, {
        initialize: function(){
            enchant.Group.call(this);
            var bg = new Sprite(CORE_WIDTH*2, CORE_HEIGHT*3);
            bg.image = enchant.Core.instance.assets[MAIN_BG];
            bg.opacity = 0.6;
            bg.addEventListener('enterframe', function(){
                    this.x -= 1;
                    if(this.x < -CORE_WIDTH){
                        this.x += CORE_WIDTH;
                    }
                    var dif = (Camera360.instance.theta % Math.PI)/Math.PI;
                    this.y = (dif * CORE_HEIGHT) - CORE_HEIGHT;
            });
            this.addChild(bg);
            for(var i=0;i<50;i++){
                var dot = new Dot();
                Sprite360.add360Methods(dot);
                var theta = Math.random() * 2 * Math.PI;
                dot.px = (Math.random() * CORE_WIDTH * 1.3 - 100) * 20;
                dot.py = Camera360.instance.z * 10 * Math.cos(theta); //初期値はzなのでこれで良い
                dot.pz = Camera360.instance.z * 10 * Math.sin(theta);
                dot.accX = 0;
                dot.accY = 0;
                dot.opacity = 0.3;
                this.addChild(dot);
            }
        }
});
//敵の破壊でばらまかれるパーティクルの個別クラス
Astro360.Enemy.breakParticleDot = enchant.Class.create(Dot, {
    initialize: function(e){
        Dot.call(this);
        var scr = 4;
        this.age = 0;
        this.x = e.x;
        this.y = e.y;
        this.polarR = Math.round(Math.random()* 2)+Math.random();
        this.accX = Math.round(scr * Math.cos(this.polarT));
        this.accY = Math.round(scr * Math.sin(this.polarT));
        this.addEventListener('enterframe', function(){
                this.x += this.accX;
                this.y += this.accY;
                this.age += 1;
                this.opacity -= 0.1;
                this.scaleX -= 0.1;
                this.scaleY -= 0.1;
                if(this.age > 30){
                    this.remove();
                }
        });
    }
});
//-------------------
//敵の弾発射メソッド

//敵がふつうのショットを撃つ
Astro360.Methods.Enemy.createNormalBullet = function(master, spd){
    var b = new Astro360.EnemyBullet.TestBulletBase();
    b.px = master.px;
    b.py = master.py;
    b.pz = master.pz;
    b.setMyMotion();
    b.loop();//座標が00になってしまうのを防ぐ
    if(master.parentNode !== null){
        master.parentNode.addChild(b);
    }
};
//放射状の弾を撃つ
//発射点、発射数、散乱角度、射出速度
Astro360.Methods.Enemy.createRippleBullet = function(master, num, rad, spd){
    var c = Camera360.instance;
    var core = enchant.Core.instance;
    var theta = c.theta;
    var mx = master.x;
    var my = master.y;
    for(var i=0;i<num;i++){
        var b = new Astro360.EnemyBullet.FanBullet();
        b.px = master.px;
        b.py = master.py;
        b.pz = master.pz;
        var currentRad = (rad * (i / num - 1/ 2)) * Math.PI/180;
        var bax = Math.cos(currentRad) * spd;
        var bay = Math.sin(currentRad) * spd;
        var aPos = Camera360.setReferenceFromViewPosition(bax, bay + core.height/2); //TODO y座標はmasterが中心なのでリファレンス計算の高さ補正を相殺するために半分足す
        b.pax = - aPos.x;
        b.pay = - aPos.y;// * Math.cos(theta);
        b.paz = - aPos.z; //;* Math.sin(theta);
        b.setMyMotion();
        b.loop(); //座標が00になってしまうのを防ぐ
        if(master.parentNode !== null){
            master.parentNode.addChild(b);
        }
    }
};

//座標を入れて破壊のパーティクルを生成する
Astro360.Methods.Enemy.gemParticle = function(e){
    for(var i=0;i<10;i++){
        var d = new Astro360.Enemy.breakParticleDot(e);
        PlayScene.instance.mainWindow.addChild(d);
    }
};
//任意の敵を1つ生成する
//生成エネミークラス、生成初期位置、運動関数、運動引数、
//バレットクラス、バレット関数、バレット引数
//
Astro360.Methods.Enemy.gemEnemy = function(EnemyClass, posArray, motionFunc, motionArg, BulletClass, bulletFunc, bulletArg){
    var core = enchant.Core.instance;
    var scene = PlayScene.instance;
    var len = posArray.length;
    for(var i=0;i<len;i++){
        var e = new EnemyClass();
        e.x = posArray[i].x;
        e.y = posArray[i].y;
        Camera360.setCurrentNormalPosition(e);
        e.myBulletClass = BulletClass;
        e.myMotionFunc = motionFunc;
        e.myBulletFunc = bulletFunc;
        e.myMotionArg = motionArg;
        e.myBulletArg = bulletArg;
        console.log(e.myBulletArg);
        e.addEventListener('enterframe', function(){
                //recommend empty.
        });
        scene.mainWindow.addChild(e);
    }
};


//-------------------------------------------
//エネミーのモーション関数
//-------------------------------------------

