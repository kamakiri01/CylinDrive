var BgWallCube = enchant.Class.create(enchant.gl.primitive.Cube,{
        initialize: function(scale, color){
            enchant.gl.primitive.Cube.call(this,GL_SCALE_WALLCUBE);
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
            enchant.gl.primitive.Cylinder.call(this,30,100 ,8); //this, 半径、長さ、メッシュ細かさ
            var core = enchant.Core.instance;
            var camera = Camera360.instance;

            var SURF = 100;
            var sf = new enchant.Surface(SURF, SURF);
            var ctx = sf.context;
            ctx.beginPath();

            var grad  = ctx.createLinearGradient(0,0, SURF, 0); //グラデーション開始、終了座標
            grad.addColorStop(0,'rgb(188, 100, 102)');  // 紫
            grad.addColorStop(0.5,'rgb(255, 255, 255)'); // 緑
            grad.addColorStop(1,'rgb(188, 100, 122)');  // 紫
            /* グラデーションをfillStyleプロパティにセット */
            ctx.fillStyle = grad;
            ctx.rect(0,0, SURF, SURF);
            ctx.fill();

            this.mesh.texture.ambient  = [0.4, 0.4, 0.4, 1]; //環境光
            this.mesh.texture.diffuse  = [0.7, 0.7, 0.7, 1]; //
            this.mesh.texture.specular = [0.1, 0.1, 0.1, 1]; //反射光
            mat4.perspective(80, core.width / core.height, 1.0, 1000.0, this._projMat); //視野角調整(魚眼化)
            //this.mesh.setBaseColor(color);
            this.mesh.texture.src = sf;
            //this.mesh.texture.src = core.assets['TX_IMG'];

            this.mesh.reverse();
            //for (var i = 0, l = this.mesh.normals.length; i < l; i++) {
            //    this.mesh.normals[i] *= -1;
            //}
            //座標利用以外用いないので多軸変換は想定しない
            this.rotationApply(new Quat(0, 0, 1, Math.PI/180 *phi));
            this.rotationApply(new Quat(1, 0, 0, Math.PI/180 *theta));

            var preTheta = camera.theta;
            this.addEventListener('enterframe', function(){
                    var newTheta = camera.theta;
                    var diffTheta = newTheta - preTheta;
                    this.rotationApply(new Quat(0, 1, 0,  diffTheta));
                    preTheta = camera.theta;;
            })
        }
});

