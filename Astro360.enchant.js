/*
 * this lib need Sprite360.enchant.js
 * for viewing mode
 * Sprite360自体は他のSprite系クラスに360処理を追加するものだが、
 * Astro360で定義されるクラスはSprite360の基本クラスを基にして
 * 実際のクラスを構築する
 */


//PlayerBaseの画像サイズは引数でSpriteと同様に指定する
var PlayerBase = enchant.Class.create(Geo.Circle, {
        initialize: function(){
            Geo.Circle.call(this, 32);
            PlayerBase.instance = this;
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
            console.log("gemS");
            var s = new PlayerBullet();
            s.x = PlayerBase.instance.x;
            s.y = PlayerBase.instance.y;
            PlayScene.instance.mainWindow.addChild(s);
        },
        shotN: function(n){
            this.shot1();
            if(n-1 > 0){
                var that = this.shotN;
                //setTimeout(function(){that(n-1)}, 100);
                setTimeout("PlayerBase.instance.shotN(" + n + "-1)", 100);
            }
        },
        //タッチスタートでショット発射、その座標向けて移動
        receiveTouchStart: function(e){
           // var p = this.shotNum(3, this.shot1);
           // p();
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

//プレイヤーの丸いショット
var PlayerBullet = enchant.Class.create(Geo.Circle, {
        initialize: function(){
            Geo.Circle.call(this, 32);
            this.opacity = 0.5;
            this.addEventListener('enterframe', function(){
                    this.loop();
            });
        },
        loop: function(){
            this.x += 15;
            this.checkIntersect();
            if(this.y > CORE_WIDTH){
                this.remove();
            }
        },
        checkIntersect: function(){
            this.checkIntersect_(EnemyBase360);
        },
        checkIntersect_: function(enemyClassName){
            var il = enemyClassName.collection.length;
            for(var i=0;i<il;i++){
                if(this.intersect(enemyClassName.collection[i])) {
                    //破壊エフェクト関数
                    gemParticle(enemyClassName.collection[i]);
                    enemyClassName.collection[i].remove();;
                    this.remove();
                    break;
                }
            }
//            for(var i=0;i<iarray.length;i++){
//                gemParticle(iarray[i]);
//                iarray[i].remove();
//            }
        }
});
var gemParticle = function(e){
    var scr = 5;
    for(var i=0;i<10;i++){
        var d = new Dot();
        d.age = 0;
        d.x = e.x;
        d.y = e.y;
        d.polarR = Math.round(Math.random()* 2)+Math.random();
        d.accX = Math.round(scr * Math.cos(d.polarT));
        d.accY = Math.round(scr * Math.sin(d.polarT));
        d.addEventListener('enterframe', function(){
                this.x += this.accX;
                this.y += this.accY;
                this.age += 1;
                if(this.age > 30){
                    this.remove();
                }
        });
        PlayScene.instance.mainWindow.addChild(d);

    }
};

//------------------------------------------
//敵関係のクラス定義

//敵の共通親クラス
var EnemyBase360 = enchant.Class.create(Sprite360, {
        initialize: function(wx, wy){
            Sprite360.call(this, wx, wy);
            var core = enchant.Core.instance;
            this.addEventListener('enterframe', function(){
                    if(this.x < 0 || this.x > core.width || this.y < 0 || this.y > core.height){
                        this.remove();
                    } 
            });
        },
        //エネミーの挙動を設定する
        setMyMotion: function(){}
});
//くまのてき　
var TestEnemyBase360 = enchant.Class.create(EnemyBase360, {
        initialize: function(){
            EnemyBase360.call(this, 32, 32);
            var sf = new Surface(32, 32);
            this.image = sf;
            this.sCtx = sf.context;
            this.frame = 7;
            this.scaleX = -1;
        },
        setMyMotion: function(){
            this.addEventListener('enterframe', function(){
                    this.sCtx.beginPath();
                    this.sCtx.clearRect(0,0,32, 32);
                    this.sCtx.strokeStyle = this.drawColor;
                    this.sCtx.beginPath();
                    this.sCtx.arc(16, 16, 16, 0, Math.PI*2, true);
                    this.sCtx.arc(16, 16, 15, 0, Math.PI*2, false);
                    this.sCtx.fill();
                    this.sCtx.closePath();
                    this.sCtx.stroke();
                    this.px -=SPEED_ENEMY0;
            });
        }
});

//次世代メインエネミー予定
var SimpleEnemy360 = enchant.Class.create(EnemyBase360, {
        initialize: function(posObj, velObj, accObj){
            EnemyBase360.call(this, 32, 32);
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

//てきのたまベース
var BulletBase = enchant.Class.create(EnemyBase360, {
        initialize: function(wx, wy){
            EnemyBase360.call(this, wx, wy);
    }
});

//テストくまのうつたま
var TestBulletBase = enchant.Class.create(BulletBase, {
        initialize: function(){
            BulletBase.call(this, 16, 16);
            this.image = Dot.surface;
            this.frame = 5;
        },
        setMyMotion: function(){
            this.addEventListener('enterframe', function(){
                this.px -= SPEED_BULLET0;
            });
        }
});

//扇状に広がる弾
var FanBullet = enchant.Class.create(BulletBase, {
    initialize: function(){
        BulletBase.call(this, 8, 8);
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

//-------------------
//敵の弾発射メソッド

//敵がふつうのショットを撃つ
var createNormalBullet = function(master, spd){
    var b = new TestBulletBase();
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
var createRippleBullet = function(master, num, rad, spd){
    var c = Camera360.instance;
    var core = enchant.Core.instance;
    var theta = c.theta;
    var mx = master.x;
    var my = master.y;
    for(var i=0;i<num;i++){
        var b = new FanBullet();
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
            var bg = new Sprite(CORE_WIDTH, CORE_HEIGHT);
            var sf = new Surface(CORE_WIDTH, CORE_HEIGHT);
            sf.context.beginPath();
            sf.context.fillStyle = 'rgba(2, 0, 0, 0.2)';
            sf.context.fillRect(0, 0, CORE_WIDTH, CORE_HEIGHT);
            bg.image = sf;
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
                this.addChild(dot);
            }
        }
});
