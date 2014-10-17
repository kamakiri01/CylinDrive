//ステージデータの管理。イベント管理。

var setStageEvent = function(scene, stageNumber){
    stageEventData[stageNumber](scene);
};
stageEventData = [];
//テストモード
stageEventData[0] = function(scene){
    //ステージの作成
    var scene = enchant.Core.instance.currentScene;
    var speedScale = 10;
    scene.addEventListener('enterframe', function(){
            var age = scene.age * speedScale;

            console.log(age);
            if(age === 600 || age === 800 || age === 1000){
                //扇の弾を撃つ敵をランダムな高度にいくつか出現させる
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.TriangeEnemy,  //三角形エネミー
                    {}, //newの引数
                    [
                        {x:CORE_WIDTH, y:(Math.random())*CORE_HEIGHT*4},
                        {x:CORE_WIDTH, y:(Math.random())*CORE_HEIGHT*4},
                        {x:CORE_WIDTH, y:(Math.random())*CORE_HEIGHT*4},
                        {x:CORE_WIDTH, y:(Math.random())*CORE_HEIGHT*4},
                        {x:CORE_WIDTH, y:(Math.random())*CORE_HEIGHT*4},
                        {x:CORE_WIDTH, y:(Math.random())*CORE_HEIGHT*4},
                        {x:CORE_WIDTH, y:(Math.random())*CORE_HEIGHT*4},
                        {x:CORE_WIDTH, y:(Math.random()-0.5)*CORE_HEIGHT}
                    ], //右端のどこか 
                    Astro360.EnemyMotion.Simple, //まっすぐ前進
                    {spd: SPEED_ENEMY0*2, rot: 4},
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {},
                    true //座標系のリファレンス化処理を行う
                );
            }
            if(age === 1200){
                //上に直線で過ぎ去る編隊を出現させる
                Astro360.Methods.Enemy.gemLinearAccEnemyUnit(
                    Astro360.Enemy.AccEnemy360FixedReference,  //一般的なエネミークラス
                    {
                        vel:{x:-15,y:0 ,z:0
                        }, 
                        acc:{x:0,y:0,z:0
                        }
                    }, //エネミークラスのnew引数
                    {x:CORE_WIDTH+50, y: 0}, //出現初期位置.[]ではない
                    20, //編隊の数
                    100, //delay
                    Astro360.EnemyMotion.Acceleration, //加速度系に属する(初回1度だけ実行)
                    {}, //加速系なので引数に速度値を含める
                    {}, 
                    Astro360.EnemyBulletMotion.NoShot,
                    {},
                    true
                );
            }
            if(age === 2050){
                //下に直線で過ぎ去る編隊を出現させる
                Astro360.Methods.Enemy.gemLinearAccEnemyUnit(
                    Astro360.Enemy.AccEnemy360FixedReference,  //一般的なエネミークラス
                    {
                        vel:{x:-15,y:0 ,z:0
                        }, 
                        acc:{x:0,y:0,z:0
                        }
                    }, //エネミークラスのnew引数
                    {x:CORE_WIDTH+50, y: CORE_HEIGHT}, //出現初期位置.[]ではない
                    20, //編隊の数
                    100, //delay
                    Astro360.EnemyMotion.Acceleration, //加速度系に属する(初回1度だけ実行)
                    {},
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {},
                    true
                );
            }
            if(age === 2850){
                //一発で死なない敵がRippleを連射
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.AccEnemy360,  //三角形エネミー
                    {
                        vel: {x:-4, y:0, z:0
                        }, 
                        acc: {x:0, y:0, z:0
                        }
                    }, //AccEnemy360クラスのnew引数
                    [{x:CORE_WIDTH, y:CORE_HEIGHT/2}], //中央に表示
                    Astro360.EnemyMotion.DoubleAction, 
                    {
                        delay: 30,
                        vel2: {x: 0, y: 0, z: 0},
                        acc2: {x: 0, y: 0, z: 0},
                        func: (function(targ){
                            targ.myBulletFunc = function(){}; //ショット終了
                            //targ.remove(); //100frameで自己消滅
                        })
                    },
                    Astro360.EnemyBullet.FanBullet, //扇状の弾のためのバレットクラス
                    Astro360.EnemyBulletMotion.RippleShot, //扇状に弾を撃つバレットモーション
                    {freq: 5, num: 5, rad: 20, spd: 10}, //弾の密度と頻度と投射角度
                    true //座標系のリファレンス化処理を行う
                );
            }








            if(scene.age > 60 && scene.age % 30 === 150000000){

            }
    });
};
