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
var PlayerBase = enchant.Class.create(enchant.Sprite, {
        initialize: function(){
            enchant.Sprite.call(this, 32, 32);
            this.image = enchant.Core.instance.assets[IMAGE_PLAYER_BASE];
        },
        receiveTouchEvent: function(e, ui_width){
            var hereToTouchX = e.x - this.x;
            var hereToTouchY = e.y - this.y;
            this.moveApplyX(hereToTouchX,  ui_width);
            this.moveApplyY(hereToTouchY);
        },
        moveApplyX: function(n, w){
            this.x += n - w;
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
