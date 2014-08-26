enchant();
window.onload = function(){
    var core = new Core(CORE_WIDTH, CORE_HEIGHT);
    core.fps = 30;
    core.score = 0;
    core.keyEvent = [];
    core.preload(IMAGE_PRELOAD);
    core.onload = function(){
        core.pushScene(new PlayScene());
    };
    core.endFunc = function(){
        core.end(core.score, core.score + "点");
    };
    core.start();
};
