//ステージデータの管理。イベント管理。

var setStageEvent = function(scene, stageNumber){
    stageEventData[stageNumber](scene);
};
stageEventData = [];
stageEventData[0] = function(scene){
    //テストとして扇状の弾を撃つ敵をランダムに出現させる
    scene.addEventListener('enterframe', function(){
            var scene = enchant.Core.instance.currentScene;
            if(scene.age % 30 === 1000000){
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.TestEnemyBase360,  //一般的なエネミークラス
                    {}, //newの引数
                    [{x:CORE_WIDTH, y:Math.random()*CORE_HEIGHT/2}], //右端のどこか 
                    Astro360.EnemyMotion.Simple, //まっすぐ前進
                    {}, //前進に引数なし
                    Astro360.EnemyBullet.FanBullet, //扇状の弾のためのバレットクラス
                    Astro360.EnemyBulletMotion.RippleShot, //扇状に弾を撃つバレットモーション
                    {freq: 20, num: 5, rad: 20, spd: 15} //弾の密度と頻度と投射角度
                );
            }
            //Uターンして帰っていく敵の生成テスト
            if(scene.age === 100){
                Astro360.Methods.Enemy.gemLinearEnemyUnit(
                    Astro360.Enemy.AccEnemy360,  //一般的なエネミークラス
                    {
                        vel:{x:-30,y:10,z:0
                        }, 
                        acc:{x:1,y:0,z:0
                        }
                    }, //エネミークラスのnew引数
                    {x:CORE_WIDTH, y: 30}, //出現初期位置.[]ではない
                    5, //とりあえず3体出す
                    150, //delay
                    Astro360.EnemyMotion.Acceleration, //加速度系に属する(初回1度だけ実行)
                    {}, //エネミーモーションのモーションアーギュメント(使わないと思う)
                    Astro360.EnemyBullet.TestBullet, //まっすぐ飛ぶバレットクラス
                    Astro360.EnemyBulletMotion.StraightShot,
                    {freq: 15, num:1, spd:SPEED_BULLET0}
                );
            }
            if(scene.age % 30 ===100000){
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.AccEnemy360,  //一般的なエネミークラス
                    {
                        vel:{x:-30,y:10,z:0
                        }, 
                        acc:{x:1,y:0,z:0
                        }
                    }, //エネミークラスのnew引数
                    [{x:CORE_WIDTH, y: 30}], //出現初期位置
                    Astro360.EnemyMotion.Acceleration, //加速度系に属する(初回1度だけ実行)
                    {}, //エネミーモーションのモーションアーギュメント(使わないと思う)
                    Astro360.EnemyBullet.TestBullet, //まっすぐ飛ぶバレットクラス
                    Astro360.EnemyBulletMotion.StraightShot,
                    {freq: 15, num:1, spd:SPEED_BULLET0}
                );
            }
    });
};
