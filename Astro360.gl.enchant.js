var BgWallCube = enchant.Class.create(enchant.gl.primitive.Cube,{
        initialize: function(scale, color){
            enchant.gl.primitive.Cube.call(this,GL_SCALE_WALLCUBE * scale);
            this.mesh.setBaseColor(color);
            this.mesh.texture.ambient  = [0.4, 0.4, 0.4, 1]; //環境光
            this.mesh.texture.diffuse  = [0.7, 0.7, 0.7, 1]; //
            this.mesh.texture.specular = [0.7, 0.7, 0.7, 1]; //
            this.addEventListener('enterframe', function(){
                this.loop();
            });
        },
        loop: function(){
            this.rotationApply(new Quat(0, 1, 0,  Math.PI/180)); // とりあえず適当に回す
        },
        loopBackPosition: function(){
        }
});
var BgWallCylinder = enchant.Class.create(enchant.gl.primitive.Cylinder,{
        initialize: function(phi,theta,color){
            enchant.gl.primitive.Cylinder.call(this,80,200 ,20); //this, 半径、長さ、メッシュ細かさ
            var core = enchant.Core.instance;
            var camera = Camera360.instance;

            var SURF = 100;
            var sf = new enchant.Surface(SURF, SURF);
            var ctx = sf.context;
            ctx.beginPath();

            var grad  = ctx.createLinearGradient(0,0, 6.9*2, SURF); //グラデーション開始、終了座標
            var len = 30;
            var gradColor;
            for(var i=0;i<len;i++){
                if(i%2 ===0){
                    gradColor = 'rgb(188, 100, 122)';
                }else{
                    gradColor = 'rgb(255, 255, 255)';
                }
                grad.addColorStop(i/len,gradColor);
            }
            //grad.addColorStop(0,'rgb(188, 100, 102)');  // 紫
            //grad.addColorStop(0.5,'rgb(255, 255, 255)'); // 緑
            //grad.addColorStop(1,'rgb(188, 100, 122)');  // 紫
            /* グラデーションをfillStyleプロパティにセット */
            ctx.fillStyle = grad;
            ctx.rect(0,0, SURF, SURF);
            ctx.fill();

            this.mesh.texture.ambient  = [0.4, 0.4, 0.4, 1]; //環境光
            this.mesh.texture.diffuse  = [0.7, 0.7, 0.7, 1]; //
            this.mesh.texture.specular = [0.1, 0.1, 0.1, 1]; //反射光
            //mat4.perspective(80, core.width / core.height, 1.0, 1000.0, this._projMat); 
            ////視野角調整(魚眼化)これはgl.enchant.js本体で設定すること
            this.mesh.texture.src = sf;

            this.mesh.reverse();
            //座標利用以外用いないので多軸変換は想定しない
            this.rotationApply(new Quat(0, 0, 1, Math.PI/180 *phi));
            this.rotationApply(new Quat(1, 0, 0, Math.PI/180 *theta));

            var preTheta = camera.theta;
            this.addEventListener('enterframe', function(){
                    //回転補正
                    var newTheta = camera.theta;
                    var diffTheta = newTheta - preTheta;
                    this.rotationApply(new Quat(0, 1, 0,  diffTheta));
                    preTheta = camera.theta;;
            })
            this.moved = 0;
            this.addEventListener('enterframe' ,function(){
                    this.y += 1;
                    this.moved += 1;
                    if(this.moved > 27){
                        this.y -= 27;
                        this.moved = 0;
                    }

            });
        }
});

