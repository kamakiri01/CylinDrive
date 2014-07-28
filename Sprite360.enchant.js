/*
 * this need gl-matrix 1.3.7 or around bersion.
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
Sprite360.loop = function(){
    var axis = Camera360.worldToScreen(this.px, this.py, this.pz);
    this.x = axis.x;
    this.y = axis.y;
    this.z = axis.z;
};
Sprite360.add360Methods = function(targ){
    targ.px = targ.x;
    targ.py = targ.y;
    targ.pz = 0;
    targ.addEventListener('enterframe', function(){
        Sprite360.loop.call(this);
    });
};
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
Camera360.prototype.rotX = function(rad){
    
}
Camera360.prototype.rotN = function(x, y, z, t){
    var theta = t;
    var mat = [
        [Math.pow(x, 2) * (1 - Math.cos(theta)) + Math.cos(theta),  y * z * (1 - Math.cos(theta)) + z * Math.sin(theta), x * z * (1 - Math.cos(theta)) - y * Math.sin(theta)],
        [x * y * (1 - Math.cos(theta)) - z * Math.sin(theta)]
    ]
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
