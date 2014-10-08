/*
 * this lib need preload
 * Astro360.enchant.js, 
 * gl.enchant.js, 
 * primitive.gl.enchant.js.
 */

if(Astro360 !== undefined){
    Astro360.gl = {}; //glを扱うクラス
    Astro360.gl.UI = {}; //UI系クラス
}else{
    throw new Error("preload Astro360 module.");
}

Astro360.gl.UI.BgWallCube = enchant.Class.create(enchant.gl.primitive.Cube,{
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
Astro360.gl.UI.BgWallCylinder = enchant.Class.create(enchant.gl.primitive.Cylinder,{
        initialize: function(phi,theta){
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
                    gradColor = ColorSet.BGWALL0;
                }else{
                    gradColor = ColorSet.BGWALL1;
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
            ////視野角調整(魚眼化)これはgl.enchant.js本体で設定する
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
                    if(this.moved >= 27){
                        this.y -= 27;
                        this.moved = 0;
                    }

            });
        }
});

Astro360.gl.UI.MainBg3D = enchant.Class.create(enchant.gl.Scene3D, {
        initialize: function(){
            enchant.gl.Scene3D.call(this);
            var scene3d = new Scene3D(); //シングルトンなので既存インスタンスが戻る
            var core = enchant.Core.instance;
            var camera = core.currentScene3D.getCamera();
            camera.x = 0;
            camera.y = 0;
            camera.z = 0;
            camera.centerX = 0;
            camera.centerY = 0;
            camera.centerZ = 0;
            camera.upVectorX = 0;
            camera.upVectorY = 1;
            camera.upVectorZ = 0;

            var dLight = new DirectionalLight();
            dLight.color = [1.0, 1.0, 1.0];
            var aLight = new AmbientLight();
            aLight.color = [1.0, 1.0, 1.0];

            var scene3d = enchant.Core.instance.currentScene3D;
            scene3d.backgroundColor = [0.1, 0.2, 0.25, 1];
            scene3d.setDirectionalLight(dLight);
            scene3d.setAmbientLight(aLight);

            //全体の背景となるシリンダーを作成
            var c = new Astro360.gl.UI.BgWallCylinder(0, 0);
            c.x = 0;
            c.y = -10;
            c.z = 0;
            scene3d.addChild(c);

//            //シリンダー内壁にあるブロック
//            var len = 0;
//            var distScale = 0.7;
//            for(var i=0;i<len;i++){
//                var polarT = Math.random() * Math.PI*2;
//                var polarR = GL_CAMDIST;
//
//                var b = new Astro360.gl.UI.BgWallCube(10, "#ff3333");
//                b.x = 0;//Math.random() * 100;
//                b.y = 0;// Math.round(polarR * Math.cos(polarT)) * distScale; 
//                b.z = 0;//Math.round(polarR * Math.sin(polarT)) * distScale;
//                scene3d.addChild(b);
//            }
            
            //3dカメラの回転追従処理
            core.currentScene.addEventListener('enterframe', function() {
                    var theta = Camera360.instance.theta;
                    var camera = core.currentScene3D.getCamera();
                    camera.y = 0;
                    camera.x = Math.cos(theta) * GL_CAMDIST*1;
                    camera.z = Math.sin(theta) * GL_CAMDIST*1;
                    //camera.x = 0;
                    //camera.y = GL_CAMDIST;
                    //camera.z = 0;
                    camera.upVectorY = 0;
                    camera.upVectorX = -Math.cos(theta + Math.PI/2);
                    camera.upVectorZ = -Math.sin(theta + Math.PI/2);
                    dLight.directionY = Math.cos(theta);
                    dLight.directionZ = Math.sin(theta);
                    //aLight.directionY = -Math.sin(theta);
                    //aLight.directionZ = -Math.sin(theta);
            });
        }
});
