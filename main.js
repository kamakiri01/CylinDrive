enchant();
window.onload = function(){
    var core = new Core(CORE_WIDTH, CORE_HEIGHT);
    core.fps = 30;
    core.score = 0;
        core.conf = {}; //TODO仮置きオブジェクト
        core.conf.ui = 1;
    core.keyEvent = [];
    initKeyEvents();
    core.preload(IMAGE_PRELOAD);
    core.onload = function(){
        core.sceneManager =  new GameClass.SceneManager();
        core.sceneManager.pushGroup(new StartScene());
    };
    core.endFunc = function(){
        var score = core.score;
        var p = Astro360.Player.PlayerBase.instance;
        var lestPlayer = p.lestPlayer
        var scoreLestPlayer = Math.round(lestPlayer * 100);
        var finalScore = score + scoreLestPlayer;
        core.end(score, score + "スコア、残機" + lestPlayer + "機");
    };
    core.endFunc2 = function(){
        var score = PlayScene.instance.age / core.fps;
        score = Math.round(score * 10) / 10;
        core.end(score, score + "秒で撃墜された");
    };
    core.start();
};
