//ALL ENVIRONMENT

//外部画像読み込み
var IMAGE_PRELOAD = [];
var TITLE_IMG = "./images/cyt.png";
IMAGE_PRELOAD.push(TITLE_IMG);

//astro360
var SPEED_ENEMY0 = 5;
var SPEED_BULLET0 = 11;

//GameClass
var CORE_WIDTH = 640;
var CORE_HEIGHT = 640;
var UI_WIDTH = 70;

//レーザーゲージ
var GAUGE_WIDTH = 50;
var GAUGE_HEIGHT = 20;
var MAX_LAZER_STOCK = 6;

GL_CAMDIST = 90;
GL_SCALE_WALLCUBE = 1;
//configで逆回転設定させる時用
var ROT_INVERT = 1;

//カラーパレット
var ColorSet = {};
//Gameclass
ColorSet.STARTSCENEBG = "#f9f9f9";
ColorSet.STARTSCENE_TEXT_ENABLE = "red";
ColorSet.STARTSCENE_TEXT_DISABLE = "DarkGray";
ColorSet.STARTSCENE_SELECTOR0 = 'rgba(1, 1, 1, 1)';
ColorSet.STARTSCENE_SELECTOR1 = 'rgba(256,256,256,1)';

//Astro360
//PlayerBullet
ColorSet.PLAYERBULLET = "rgb(255, 255, 255)";
ColorSet.PLAYERLAZER0 = 'rgb(128, 100, 162)';
ColorSet.PLAYERLAZER1 = 'rgb(255, 255, 255)';
//Enemy
ColorSet.ENEMY_TRIANGLE = "#3333ff";
ColorSet.ENEMY_ACCENEMY = "#11ff22";
//UI
ColorSet.UIBORDER = "rgba(1, 1, 1, 1)";
ColorSet.UIBG0 = "rgba(1,   128, 100, 162)"; //背景色
ColorSet.UIBG1 = "rgba(126, 191, 176, 162)"; //輝点色
//LazerGauge
ColorSet.LAZERGAUGE = 'rgb(28, 120, 182)';
//LestUnit
ColorSet.LESTUNIT =   'rgba(192, 192, 192, 1)';
//ScoreLabel
ColorSet.SCORELABEL = "red";

//Astro360.gl
//BgWallCylinder
ColorSet.BGWALL0 = 'rgb(18, 106, 202)';
ColorSet.BGWALL1 = 'rgb(205, 205, 255)';

