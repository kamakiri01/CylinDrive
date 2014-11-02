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

            //console.log(age);//毎時のフレームを表示
            if(age === 600 || age === 800 || age === 1000){
                //ショットしない敵をランダムな高度にいくつか出現させる
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
                        life: 5,
                        vel: {x:-4, y:0, z:0
                        }, 
                        acc: {x:0, y:0, z:0
                        }
                    }, //AccEnemy360クラスのnew引数
                    [{x:CORE_WIDTH, y:CORE_HEIGHT/2 * 1.5},
                        {x:CORE_WIDTH, y:CORE_HEIGHT/2},
                        {x:CORE_WIDTH, y:CORE_HEIGHT/2 * 0.6}], //中央に表示
                    Astro360.EnemyMotion.DoubleAction, 
                    {
                        delay: 30,
                        vel2: {x: 0, y: 0, z: 0},
                        acc2: {x: 1, y: 0, z: 0},
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
            if(age === 3400 || age === 3550 || age == 3600){
                //少し散発的に敵が出る
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.TriangeEnemy,  //三角形エネミー
                    {}, //newの引数
                    [
                        {x:CORE_WIDTH, y:(Math.random()-0.5)*CORE_HEIGHT*1.2},
                        {x:CORE_WIDTH, y:(Math.random()-0.5)*CORE_HEIGHT*1.2},
                        {x:CORE_WIDTH, y:(Math.random()-0.5)*CORE_HEIGHT*1.2},
                        {x:CORE_WIDTH, y:(Math.random()-0.5)*CORE_HEIGHT*1.2},
                        {x:CORE_WIDTH, y:(Math.random()-0.5)*CORE_HEIGHT*1.2},
                        {x:CORE_WIDTH, y:(Math.random()-0.5)*CORE_HEIGHT*1.2},
                        {x:CORE_WIDTH, y:(Math.random()-0.5)*CORE_HEIGHT*1.2},
                        {x:CORE_WIDTH, y:(Math.random()-0.5)*CORE_HEIGHT*1.2}
                    ], //右端のどこか 
                    Astro360.EnemyMotion.Simple, //まっすぐ前進
                    {spd: SPEED_ENEMY0*2, rot: 4},
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {},
                    true //座標系のリファレンス化処理を行う
                );
            }
            if(age === 4000){
                //水平な敵を上から出す
                var posArray = [];
                for(var i=0;i<10;i++){
                    var pos = {};
                    pos.x = i * CORE_WIDTH/10;
                    pos.y = CORE_WIDTH/2;
                    pos.z = 0;
                    posArray.push(pos);
                }
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.AccEnemy360,  //三角形エネミー
                    {
                        vel: {x:0, y:-10
                        }, 
                        acc: {x:0, y:0
                        }
                    }, //AccEnemy360クラスのnew引数
                    posArray, //中央に表示
                    Astro360.EnemyMotion.DoubleAction, 
                    {
                        delay: 50,
                        vel2: {x: 1, y: 0, z: 0},
                        acc2: {x: 1, y: 0, z: 0},
                        func: (function(targ){
                            targ.myBulletFunc = function(){}; //ショット終了
                            //targ.remove(); //100frameで自己消滅
                        })
                    },
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {}, //弾の密度と頻度と投射角度
                    false //座標系のリファレンス化処理を行う
                );
            }
            if(age === 4000){
                //水平な敵を下から出す
                var posArray = [];
                for(var i=0;i<10;i++){
                    var pos = {};
                    pos.x = i * CORE_WIDTH/10;
                    pos.y = -CORE_WIDTH/2;
                    pos.z = 0;
                    posArray.push(pos);
                }
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.AccEnemy360,  //三角形エネミー
                    {
                        vel: {x:0, y:10
                        }, 
                        acc: {x:0, y:0
                        }
                    }, //AccEnemy360クラスのnew引数
                    posArray, //中央に表示
                    Astro360.EnemyMotion.DoubleAction, 
                    {
                        delay: 50,
                        vel2: {x: 1, y: 0, z: 0},
                        acc2: {x: 1, y: 0, z: 0},
                        func: (function(targ){
                            targ.myBulletFunc = function(){}; //ショット終了
                            //targ.remove(); //100frameで自己消滅
                        })
                    },
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {}, //弾の密度と頻度と投射角度
                    false //座標系のリファレンス化処理を行う
                );
            }
            if(age === 4400 || age === 4550 || age == 4600){
                //少し散発的に敵が出る
                var posArray = [];
                for(var i=0;i<8;i++){
                    var a = {x:CORE_WIDTH, y:(Math.random()-0.5)*CORE_HEIGHT*1.5};
                    posArray.push(a);
                }
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.TriangeEnemy,  //三角形エネミー
                    {}, //newの引数
                    posArray,
                    Astro360.EnemyMotion.Simple, //まっすぐ前進
                    {spd: SPEED_ENEMY0*2, rot: 4},
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {},
                    true //座標系のリファレンス化処理を行う
                );
            }
            if(age === 5000){
                //サインウェーブの敵
                Astro360.Methods.Enemy.gemLinearAccEnemyUnit(
                    Astro360.Enemy.AccEnemy360FixedReference,  //一般的なエネミークラス
                    {
                        vel:{x:-15,y:0 ,z:0
                        }, 
                        acc:{x:0,y:0,z:0
                        }
                    }, //エネミークラスのnew引数
                    {x:CORE_WIDTH+50, y: CORE_HEIGHT}, //出現初期位置.[]ではない
                    15, //編隊の数
                    120, //delay
                    Astro360.EnemyMotion.SinWave, //加速度系に属する(初回1度だけ実行)
                    {wavelength: 10, amp: 10},
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {},
                    true
                );
                
            }
            if(age === 5100){
                //サインウェーブの敵
                Astro360.Methods.Enemy.gemLinearAccEnemyUnit(
                    Astro360.Enemy.AccEnemy360FixedReference,  //一般的なエネミークラス
                    {
                        vel:{x:-15,y:0 ,z:0
                        }, 
                        acc:{x:0,y:0,z:0
                        }
                    }, //エネミークラスのnew引数
                    {x:CORE_WIDTH+50, y: 10}, //出現初期位置.[]ではない
                    15, //編隊の数
                    120, //delay
                    Astro360.EnemyMotion.SinWave, //加速度系に属する(初回1度だけ実行)
                    {wavelength: 10, amp: 10},
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {},
                    true
                );
                
            }
            if(age === 5200){
                //サインウェーブの敵
                Astro360.Methods.Enemy.gemLinearAccEnemyUnit(
                    Astro360.Enemy.AccEnemy360FixedReference,  //一般的なエネミークラス
                    {
                        vel:{x:-15,y:0 ,z:0
                        }, 
                        acc:{x:0,y:0,z:0
                        }
                    }, //エネミークラスのnew引数
                    {x:CORE_WIDTH+50, y: CORE_HEIGHT/2}, //出現初期位置.[]ではない
                    15, //編隊の数
                    120, //delay
                    Astro360.EnemyMotion.SinWave, //加速度系に属する(初回1度だけ実行)
                    {wavelength: 10, amp: 10},
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {},
                    true
                );
                
            }
            if(age === 5800){
                //Rippleの軌跡を残す高速な敵
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.AccEnemy360,  //三角形エネミー
                    {
                        life: 1,
                        vel: {x:-15, y:0, z:0
                        }, 
                        acc: {x:0, y:0, z:0
                        }
                    }, //AccEnemy360クラスのnew引数
                    [
                        {x:CORE_WIDTH, y:CORE_HEIGHT/2 * 1.5},
                        {x:CORE_WIDTH, y:CORE_HEIGHT/2},
                        {x:CORE_WIDTH, y:CORE_HEIGHT/2 * 0.6}], //中央に表示
                    Astro360.EnemyMotion.Acceleration,
                    {},
                    Astro360.EnemyBullet.FanBullet, //扇状の弾のためのバレットクラス
                    Astro360.EnemyBulletMotion.RippleShot, //扇状に弾を撃つバレットモーション
                    {freq: 10, num: 5, rad: 40, spd: 10}, //弾の密度と頻度と投射角度
                    true //座標系のリファレンス化処理を行う
                );
            }

            if(age === 6000){
                //Rippleの軌跡を残す曲線軌跡の敵上から
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.AccEnemy360,  //三角形エネミー
                    {
                        life: 1,
                        vel: {x:-4, y:12, z:0
                        }, 
                        acc: {x:-0.6, y:-0.3, z:0
                        }
                    }, //AccEnemy360クラスのnew引数
                    [
                        {x:CORE_WIDTH, y:CORE_HEIGHT/2 * 0.6}],
                    Astro360.EnemyMotion.Acceleration,
                    {},
                    Astro360.EnemyBullet.FanBullet, //扇状の弾のためのバレットクラス
                    Astro360.EnemyBulletMotion.RippleShot, //扇状に弾を撃つバレットモーション
                    {freq: 10, num: 5, rad: 40, spd: 10}, //弾の密度と頻度と投射角度
                    true //座標系のリファレンス化処理を行う
                );
            }

            if(age === 6200){
                //Rippleの軌跡を残す曲線軌跡の敵下から
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.AccEnemy360,  //三角形エネミー
                    {
                        life: 1,
                        vel: {x:-4, y:-12, z:0
                        }, 
                        acc: {x:-0.6, y:0.3, z:0
                        }
                    }, //AccEnemy360クラスのnew引数
                    [
                        {x:CORE_WIDTH, y:CORE_HEIGHT/2 * 1.6}],
                    Astro360.EnemyMotion.Acceleration,
                    {},
                    Astro360.EnemyBullet.FanBullet, //扇状の弾のためのバレットクラス
                    Astro360.EnemyBulletMotion.RippleShot, //扇状に弾を撃つバレットモーション
                    {freq: 10, num: 5, rad: 40, spd: 10}, //弾の密度と頻度と投射角度
                    true //座標系のリファレンス化処理を行う
                );
            }
            if(age === 6600){
                //Rippleの軌跡を残す高速な敵
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.AccEnemy360,  //三角形エネミー
                    {
                        life: 1,
                        vel: {x:-15, y:0, z:0
                        }, 
                        acc: {x:0, y:0, z:0
                        }
                    }, //AccEnemy360クラスのnew引数
                    [
                        {x:CORE_WIDTH, y:CORE_HEIGHT/2 * 1.5},
                        {x:CORE_WIDTH, y:CORE_HEIGHT/2},
                        {x:CORE_WIDTH, y:CORE_HEIGHT/2 * 0.6}], //中央に表示
                    Astro360.EnemyMotion.Acceleration,
                    {},
                    Astro360.EnemyBullet.FanBullet, //扇状の弾のためのバレットクラス
                    Astro360.EnemyBulletMotion.RippleShot, //扇状に弾を撃つバレットモーション
                    {freq: 10, num: 5, rad: 40, spd: 10}, //弾の密度と頻度と投射角度
                    true //座標系のリファレンス化処理を行う
                );
            }

            if(age === 6800){
                //水平な敵を上から出す
                var posArray = [];
                for(var i=0;i<15;i++){
                    var pos = {};
                    pos.x = i * CORE_WIDTH*1.5/10;
                    pos.y = CORE_WIDTH/2;
                    pos.z = 0;
                    posArray.push(pos);
                }
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.AccEnemy360,  //三角形エネミー
                    {
                        vel: {x:0, y:-10
                        }, 
                        acc: {x:0, y:0
                        }
                    }, //AccEnemy360クラスのnew引数
                    posArray, //中央に表示
                    Astro360.EnemyMotion.DoubleAction, 
                    {
                        delay: 50,
                        vel2: {x: 1, y: 0, z: 0},
                        acc2: {x: 1, y: 0, z: 0},
                        func: (function(targ){
                            targ.myBulletFunc = function(){}; //ショット終了
                            //targ.remove(); //100frameで自己消滅
                        })
                    },
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {}, //弾の密度と頻度と投射角度
                    false //座標系のリファレンス化処理を行う
                );
                //水平な敵を下から出す
                var posArray = [];
                for(var i=0;i<15;i++){
                    var pos = {};
                    pos.x = i * CORE_WIDTH*1.5/10;
                    pos.y = -CORE_WIDTH/2;
                    pos.z = 0;
                    posArray.push(pos);
                }
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.AccEnemy360,  //三角形エネミー
                    {
                        vel: {x:0, y:10
                        }, 
                        acc: {x:0, y:0
                        }
                    }, //AccEnemy360クラスのnew引数
                    posArray, //中央に表示
                    Astro360.EnemyMotion.DoubleAction, 
                    {
                        delay: 50,
                        vel2: {x: 1, y: 0, z: 0},
                        acc2: {x: 1, y: 0, z: 0},
                        func: (function(targ){
                            targ.myBulletFunc = function(){}; //ショット終了
                            //targ.remove(); //100frameで自己消滅
                        })
                    },
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {}, //弾の密度と頻度と投射角度
                    false //座標系のリファレンス化処理を行う
                );
            }
            if(age === 7000 || age === 7050 || age == 7100){
                //少し散発的に敵が出る
                var posArray = [];
                for(var i=0;i<8;i++){
                    var a = {x:CORE_WIDTH, y:(Math.random()-0.5)*CORE_HEIGHT*1.5};
                    posArray.push(a);
                }
                Astro360.Methods.Enemy.gemEnemy(
                    Astro360.Enemy.TriangeEnemy,  //三角形エネミー
                    {}, //newの引数
                    posArray,
                    Astro360.EnemyMotion.Simple, //まっすぐ前進
                    {spd: SPEED_ENEMY0*2, rot: 4},
                    {},
                    Astro360.EnemyBulletMotion.NoShot,
                    {},
                    true //座標系のリファレンス化処理を行う
                );
            }
            //この時点でクリア
            if(age === 8000){
                var core = enchant.Core.instance;
                core.endFunc();
            }
    });
};
