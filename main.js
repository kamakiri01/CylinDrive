enchant();
window.onload = function(){
    var core = new Core(CORE_WIDTH, CORE_HEIGHT);
    core.fps = 30;
    core.score = 0;
    core.keyEvent = [];
    initKeyEvents();
    core.preload(IMAGE_PRELOAD);
    core.onload = function(){
        core.pushScene(new StartScene());
    };
    core.endFunc = function(){
        var score = PlayScene.instance.age / core.fps;
        score = Math.round(score);
        core.end(score, score + "秒でトライアルクリア");
    };
    core.start();
};
