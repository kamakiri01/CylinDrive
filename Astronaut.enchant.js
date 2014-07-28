/*
 * this need Sprite360.enchant.js
 */
var Astronaut = enchant.Class.create(enchant.Sprite, {
    initialize: function(){
        enchant.call(this);
        this.px = null;
        this.py = null;
        this.pz = null;
        this.vx = null;
        this.vy = null;
        this.vz = null;
        this.ax = null;
        this.ay = null;
        this.az = null;
        this.addEventListener('enterframe', function(){
            this.loop();
        });
    },
    loop: function(){
        //速度系
        this.applyAccelerator();
        this.applyVelocity();

        //360座標管理系(描画)
        var axis = Camera360.worldToScreen(this.px, this,py, this.pz);
        this.x = axis.x;
        this.y = axis.y;
        this.z = axis.z;
    },
    applyAccelerator: function(){
        this.vx += this.ax;
        this.vy += this.ay;
        this.vz += this.az;
        this.ax = 0;
        this.ay = 0;
        this.az = 0;
    },
    applyVelocity: function(){
        this.px += this.vx;
        this.py += this.vy;
        this.pz += this.vz;
    },
    setAccelerator: function(ax, ay, az){
        this.ax = ax;
        this.ay = ay;
        this.az = az;
    }
});

var Matt = enchant.Class.create(Astronaut, {
    initialize: function(){
        Astronaut.call(this);
        if(Matt.instance === undefined){
            Matt.instance = this;
        }
    }
});
var Ryan = enchant.Class.create(Astronaut, {
    initialize: function(){
        Astronaut.call(this);
        if(Ryan.instance === undefined){
            Ryan.instance = this;
        }
    }
});
