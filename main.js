enchant();
window.onload = function(){
    var core = new Core(CORE_WIDTH, CORE_HEIGHT);
    core.fps = 30;
    core.score = 0;
        core.conf = {}; //TODO仮置きオブジェクト
        core.conf.ui = 0;
    core.keyEvent = [];
    initKeyEvents();
    core.preload(IMAGE_PRELOAD);
    core.onload = function(){
        core.sceneManager = new SceneManager();
        core.sceneManager.pushGroup(new StartScene());
        //core.pushScene(new StartScene());
    };
    core.endFunc = function(){
        var score = PlayScene.instance.age / core.fps;
        score = Math.round(score * 10) / 10;
        core.end(score, score + "秒でトライアルクリア");
    };
    core.endFunc2 = function(){
        var score = PlayScene.instance.age / core.fps;
        score = Math.round(score * 10) / 10;
        core.end(0, score + "秒で撃墜された");
    };
    core.start();
};
