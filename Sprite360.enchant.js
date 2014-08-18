/*
 * this need gl-matrix 1.3.7 or around bersion.
 * 単体で動作するクラスではなく、任意のSpriteｇ継承型クラスに対して
 * 3軸自由度のメソッドと空間管理を行えるよう拡張する。
 */
//example
var Sprite360 = enchant.Class.create(enchant.Sprite, {
        initialize: function(wx, wy){
            enchant.Sprite.call(this, wx, wy);
            this.px = null; //3D空間座標系での各座標
            this.py = null;
            this.pz = null;
            this.addEventListener('enterframe', function(){
                this.loop;
            });
        }, loop: function(){
            Sprite360.loop.call(this);
        }
});

//継承されたクラスが毎フレーム呼ぶ処理
//自身のp座標系をカメラ座標に基づいて射影する
Sprite360.loop = function(){
    var axis = Camera360.worldToScreen(this.px, this.py, this.pz);
    this.x = axis.x;
    this.y = axis.y;
    this.z = axis.z;
};
//その時点での座標をp座標系に登録する
//カメラに対して鉛直に射影すべき。
//エンティティ作成時に必要になるので用意すべき。
Sprite360.add360Methods = function(targ){
    targ.px = targ.x;
    targ.py = targ.y;
    targ.pz = 0;
    targ.addEventListener('enterframe', function(){
        Sprite360.loop.call(this);
    });
};
//カメラのシングルトン
var Camera360 = function(conf){
    if(Camera360.instance === undefined){
        Camera360.instance = this;
    }
    this.x = conf.x;
    this.y = conf.y;
    this.z = conf.z;
    this.centerX = conf.centerX;
    this.centerY = conf.centerY;
    this.centerZ = conf.centerZ;
    this.upVectorX = conf.upVectorX;
    this.upVectorY = conf.upVectorY;
    this.upVectorZ = conf.upVectorZ;
};
//カメラをX軸でrad回転する
Camera360.prototype.rotX = function(rad){
    Camera360.instance.rotN(1, 0, 0, rad);
};
//カメラをY軸でrad回転する
Camera360.prototype.rotY = function(rad){
    Camera360.instance.rotN(0, 1, 0, rad);
};
//カメラをZ軸でrad回転する
Camera360.prototype.rotZ = function(rad){
    Camera360.instance.rotN(0, 0, 1, rad);
};

//カメラを任意軸で任意角度回転する
Camera360.prototype.rotN = function(x, y, z, t){
    var theta = t;
    var c = Camera360.instance;
    //任意軸の回転行列
    var mat = [
        Math.pow(x, 2) * (1 - Math.cos(theta)) + Math.cos(theta), x * y * (1 - Math.cos(theta)) + z * Math.sin(theta), x * z * (1 - Math.cos(theta)) - y * Math.sin(theta),
        x * y * (1 - Math.cos(theta)) - z * Math.sin(theta), Math.pow(y, 2) * (1 - Math.cos(theta)) + Math.cos(theta), y * z * (1 - Math.cos(theta)) + x * Math.sin(theta),
        x * z * (1 - Math.cos(theta)) + y * Math.sin(theta), y * z * (1 - Math.cos(theta)) - x * Math.sin(theta), Math.pow(z, 2) * (1 - Math.cos(theta)) + Math.cos(theta)
    ];
    //カメラ位置の回転
    var v = [c.x, c.y, c.z];
    var rv = [0, 0, 0];
    mat3.multiplyVec3(mat, v, rv);
    c.x = rv[0];
    c.y = rv[1];
    c.z = rv[2];
    //カメラ頂点方向の回転
    var v2 = [c.upVectorX, c.upVectorY, c.upVectorZ];
    var rv2 = [0, 0, 0];
    mat3.multiplyVec3(mat, v2, rv2);
    c.upVectorX = rv2[0];
    c.upVectorY = rv2[1];
    c.upVectorZ = rv2[2];
}
Camera360.worldToScreen = function(x, y, z) {
    function mul(m1, m2) {
        return mat4.multiply(m1, m2, mat4.create());
    }
    var core = enchant.Core.instance;
    var camera = Camera360.instance;//core.currentScene3D.getCamera();

    // プロジェクション行列
    var pm = mat4.perspective(20, core.width / core.height, 1.0, 1000.0);

    // ビュー行列
    var vm = mat4.lookAt([ camera.x, camera.y, camera.z ], 
        [camera.centerX, camera.centerY, camera.centerZ ], 
        [camera.upVectorX, camera.upVectorY, camera.upVectorZ ]);

    var v = [ x, y, z, 1 ];
    var sc = mat4.multiplyVec4(mul(pm, vm), [ x, y, z, 1 ]);

    var scX = (1 - (-sc[0] / sc[3])) * (core.width / 2);
    var scY = (1 - (sc[1] / sc[3])) * (core.height / 2);

    return {x:scX, y:scY};
};
