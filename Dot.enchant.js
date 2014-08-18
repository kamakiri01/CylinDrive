/*
 * this is for Sprite360.enchant.js limited.
 */

var dots = [];
var lastDate;
var framedata;
var DOT_SIZE = 4;

var Dot = enchant.Class.create(enchant.Sprite,{
    initialize: function(){
        enchant.Sprite.call(this,DOT_SIZE, DOT_SIZE);
        var core = enchant.Core.instance;
        var WIDTH = core.width;
        var HEIGHT =core.height;
        //再利用できるSurfaceを生成する(色変更に対応するため)
        if(Dot.surface === undefined){
            Dot.surface = new enchant.Surface(Dot.colors.length * DOT_SIZE, DOT_SIZE);
            for(var i=0;i<Dot.colors.length * DOT_SIZE;i+=DOT_SIZE){
                Dot.surface.context.fillStyle = 'rgb(' + Dot.colors[i/DOT_SIZE] + ')';
                Dot.surface.context.fillRect(i, 0, DOT_SIZE, DOT_SIZE);
            }
        }

        var SPEED_SCALE;
        if(core.isEasyMode === true){
            SPEED_SCALE = 0.2;
        }else{
            SPEED_SCALE = 1;
        }
        var RANDOM_POINTS = false;
        this.x;
        this.y;
        if(RANDOM_POINTS === true){
            this.x = WIDTH / 2;
            this.y = HEIGHT / 2;
        }else{
            this.x = Math.round(Math.random()* WIDTH);
            this.y = Math.round(Math.random()* HEIGHT);
        }

        this.polarR = Math.round(Math.random()* 2)+Math.random();
        this.polarT = Math.round(Math.random()* 2 * Math.PI);

        this.accX = Math.round(this.polarR * Math.cos(this.polarT)) * SPEED_SCALE;
        this.accY = Math.round(this.polarR * Math.sin(this.polarT)) * SPEED_SCALE;
        this.image = Dot.surface;
        this.frame = Math.floor(Math.random() * Dot.colors.length);

        this.opacity = this.polarR/4 * 2;

        this.num  =dots.length;

        dots.push(this);

        //360向け運動最適化処理
        this.addEventListener('enterframe',function(){
            this.px += this.accX;
            this.py += this.accY;

            if(this.px > WIDTH || this.px < 0){
                this.accX = - this.accX;
                this.px += this.accX;
            }
            if(this.py > HEIGHT || this.py < 0){
                this.accY = - this.accY;
                this.py += this.accY;
            }							
        });
        return this;
    },
    destroy: function(){
        this.parentNode.removeChild(this);
        delete dots[this.num];
        this.removeEventListener('enterframe', arguments.callee);
    }
});
//Dot.colors = ['255,255,255', '255,0,0', '255,165,0', '255,255,0', '0,255,0', '0,0,255', '0,0,128', '128,0,128', '255,255,255'];
Dot.colors = ['127,135,143','200,200,203','255,40,0']; //グレー、明るいグレー、赤

//ドットを撒く
var DotWindow = enchant.Class.create(enchant.Group, {
    initialize: function(){
        enchant.Group.call(this);
        var WIDTH = enchant.Core.instance.width;
        var HEIGHT = enchant.Core.instance.height;

        var bg = new Sprite(WIDTH, HEIGHT);
        var sf = new Surface(WIDTH, HEIGHT);
        var ctx = sf.context;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        bg.image = sf;
        this.addChild(bg);

        var param = new Label('');
        param.x = 5;
        param.y = 5;
        param.font = '16px bold sans';
        param.text = '0 fps';
        param.color = 'black';
        this.addChild(param);
        param.addEventListener('enterframe', function(){
            param.text = framedata+'/'+enchant.Core.instance.fps+ ' fps';
        });

        var cbutton = new Label('');
        cbutton.x = 80; cbutton.y = 5;
        cbutton.font = '16px bold sans';
        cbutton.text = '0 dots';
        cbutton.color = '';
        this.addChild(cbutton);

        var dbutton = new Label('');
        dbutton.x = 250;
        dbutton.y = 5;
        dbutton.font = '16px bold sans';
        dbutton.text = 'delete all';
        dbutton.color = '';
        this.addChild(dbutton);

        this.addEventListener('enterframe', function(){
            var thisDate = new Date;
            framedata = Math.round(1000 / (thisDate - lastDate));
            lastDate = thisDate;
            cbutton.text = dots.length  + ' dots';
        });
        this.addEventListener('touchstart', function(e){
            if (e.y > 50){
                this.createDots(500);
            }else{
                console.log('delete start');
                this.deleteAllDots();
            }
        });
        return this;
    },

//Util
    changeDotImage: function(imgNum){
        if(typeof imgNum !== 'number'){
            return;
        }
        if(imgNum <= 8){
            imgNumGen = function(){
                return Math.floor(imgNum);
            };

        }else if(imgNum > 9){
            imgNumGen = function(){
                return Math.floor(Math.random()*9);
            };
        }

        var targetLength = Dot.collection.length;
        for(var i=0;i<targetLength;i++){
//            var sf = new Surface(2, 2);
//            var ctx = sf.context;
//            ctx.fillStyle = 'rgb(' + Dot.colors[ imgNumGen() ] + ')';
//            ctx.fillRect(0, 0, 2, 2);
//            Dot.collection[i].image = sf;            
            Dot.collection[i].frame = imgNumGen();
        }
    },
    createDots: function(num){
        for(var i=0;i<num;i++){
            var dot = new Dot();
            this.addChild(dot);
        }
    },
    deleteAllDots: function(){
        for(var i in dots){
            dots[i].destroy();
        }
        dots = [];
    }
});

