enchant();
window.onload = function(){
    var core = new Core(512, 512);
    core.fps = 30;
    core.score = 0;
    core.preload();
    core.onload = function(){
        init();
        core.pushScene(new PlayScene());
    };
    core.endFunc = function(){
        core.end(core.score, core.score + "点");
    };
    core.start();
};
var init = function(){
    var core = enchant.Core.instance;
    core.keyEvent = [];
    //フラグ0
    core.keyEvent[0] = {
        inputUp: function(){
        },
        inputDown: function(){
        },
        inputLeft: function(){
        },
        inputRight: function(){
        }
    }
}
var PlayScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
        enchant.Scene.call(this);
        var core = enchant.Core.instance;
        var cameraConf = {
            x: core.width / 2,
            y: core.height / 2,
            z: core.height * 3,
            centerX: core.width / 2,
            centerY: core.height / 2,
            centerZ: 0,
            upVectorX: 0,
            upVectorY: 1,
            upVectorZ: 0
        }
        var camera = new Camera360(cameraConf);


        for(var i=0;i<50;i++){
            var dot = new Dot();
            Sprite360.add360Methods(dot);
            this.addChild(dot);
            this.px = this.x;
            this.py = this.y;
            dot.addEventListener('enterframe', function(){
                this.px += this.accX;
                this.py += this.accY;
            })
            dot.z = Math.floor(Math.random() * core.width);
        }
        this.addEventListener('enterframe', function(){
                //-----カーソルキーの動作
                //
                if(core.input.up){
                    core.keyEvent[0].inputUp();
                }else if(core.input.down){
                    core.keyEvent[0].inputDown();
                }else if(core.input.left){
                    core.keyEvent[0].inputLeft();
                }else if(core.input.right){
                    core.keyEvent[0].inputRight();
                }

        });
    }
});
