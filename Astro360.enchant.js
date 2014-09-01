/*
 * this lib need Sprite360.enchant.js
 * for viewing mode
 * Sprite360自体は他のSprite系クラスに360処理を追加するものだが、
 * Astro360で定義されるクラスはSprite360の基本クラスを基にして
 * 実際のクラスを構築する
 */

var IMAGE_PLAYER_BASE = "./images/chara1.png";
var IMAGE_UI_ARROW = "./images/uiArrow.png";
var IMAGE_BULLET = "./images/icon0.png";
IMAGE_PRELOAD.push(IMAGE_PLAYER_BASE);
IMAGE_PRELOAD.push(IMAGE_UI_ARROW);
IMAGE_PRELOAD.push(IMAGE_BULLET);
//PlayerBaseの画像サイズは引数でSpriteと同様に指定する
var PlayerBase = enchant.Class.create(Geo.Circle, {
        initialize: function(){
            Geo.Circle.call(this, 32);
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
        shot: function(e){
            console.log("shot");
        },
        //タッチスタートでショット発射、その座標向けて移動
        receiveTouchStart: function(e){
            this.shot(e);
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
//敵の共通親クラス
var EnemyBase360 = enchant.Class.create(Sprite360, {
        initialize: function(wx, wy){
            Sprite360.call(this, wx, wy);
        },
        //エネミーの挙動を設定する
        setMyMotion: function(){}
});
//適当につくった
var TestEnemyBase360 = enchant.Class.create(EnemyBase360, {
        initialize: function(){
            EnemyBase360.call(this, 32, 32);
            this.image = enchant.Core.instance.assets[IMAGE_PLAYER_BASE];
            this.frame = 7;
            this.scaleX = -1;
        },
        setMyMotion: function(){
            this.addEventListener('enterframe', function(){
                    this.px -=1;
            });
        }
});
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


var BulletBase = enchant.Class.create(EnemyBase360, {
        initialize: function(wx, wy){
            EnemyBase360.call(this, wx, wy);
    }
});

var TestBulletBase = enchant.Class.create(BulletBase, {
        initialize: function(){
            BulletBase.call(this, 16, 16);
            this.image = enchant.Core.instance.assets[IMAGE_BULLET];
            this.frame = 50;
        },
        setMyMotion: function(){
            this.addEventListener('enterframe', function(){
                this.px -= 4;
            });
        }
});
var FanBullet = enchant.Class.create(BulletBase, {
    initialize: function(){
        BulletBase.call(this, 16, 16);
        this.image = enchant.Core.instance.assets[IMAGE_BULLET];
        this.frame = 30;
    },
    setMyMotion: function(){
        this.addEventListener('enterframe' ,function(){
                this.px += this.pax;
                this.py += this.pay;
                this.pz += this.paz;
        });
    }
});

//敵がふつうのショットを撃つ
var createNormalBullet = function(master, spd){
    var b = new TestBulletBase();
    b.px = master.px;
    b.py = master.py;
    b.pz = master.pz;
    b.setMyMotion();
    master.parentNode.addChild(b);
};
//放射状の弾を撃つ
//発射点、発射数、散乱角度、射出速度
var createRippleBullet = function(master, num, rad, spd){
    var c = Camera360.instance;
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
        console.log(bax + ", " + bay);
        var aPos = Camera360.setReferenceFromViewPosition(bax, bay);
        b.pax = - aPos.x;
        b.pay = - aPos.y;// * Math.cos(theta);
        b.paz = - aPos.z; //;* Math.sin(theta);
        b.setMyMotion();
        master.parentNode.addChild(b);
    }
};
