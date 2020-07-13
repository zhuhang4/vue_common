import MyData from '@/MyData.js';
import * as YR from "../YR";

export default class Preload extends PIXI.Container {
    constructor() {
        super();

        this.files = require.context('../../../static/images', false, /\.png$|\.jpg$|\.webp$/);
        this.imgModules = {};
        this.files.keys().forEach(key => {
            this.imgModules[key.replace(/(\.\/)/g, '')] = this.files(key);
        });

        this.loader_all = new PIXI.Loader();
        this.loader_pre = new PIXI.Loader();
        this.arr_assetsPre = [
            'logo.png'
        ];
        this.arr_assets = Object.keys(this.imgModules).concat();


        this.graphic_bg = null;
        this.sp_logo = null;
        this.graphic_loading = null;
        this.graphic_loadingBottom = null;
        this.text_progress = null;
        for (let i = 0; i < this.arr_assetsPre.length; i++) {
            this.loader_pre.add(this.arr_assetsPre[i], this.imgModules[this.arr_assetsPre[i]]);
        }
        this.loader_pre.load(this.preloadComplete.bind(this));
        document.addEventListener('3DProgressUpdate', function () {
            // this.text_progress.text=Math.floor(this.loader.progress+threeProgress)/2+"%";
            // this.graphic_loading.scale.x=(this.loader.progress+threeProgress)/2/100;
        });
    }
    preloadComplete(loader, resource) {
        this.sp_logo = YR.Easy.CreateSprite('logo.png', MyData.stageW / 2, MyData.stageH / 2 - 50, 0.5, 0.5, 1, resource);
        this.addChild(this.sp_logo);
        TweenMax.to(this.sp_logo.scale, 1, { x: 2, y: 2 });

        this.graphic_loadingBottom = YR.Easy.CreateRect(MyData.stageW / 2, MyData.stageH / 2 + 40, 300, 2, 0xf000ff);
        // this.addChild(this.graphic_loadingBottom);
        this.graphic_loading = YR.Easy.CreateRect((MyData.stageW - 300) / 2, MyData.stageH / 2 + 40, 300, 2, 0xff6600, 'left');
        this.addChild(this.graphic_loading);
        this.text_progress = YR.Easy.CreateText('0%', MyData.stageW / 2, MyData.stageH / 2 + 80, 20, 200, 0xcccccc, false, 'center');
        this.addChild(this.text_progress);

        if (MyData.stageW > MyData.stageH) {
            this.sp_logo.scale.set(0.5);
            this.text_progress.y = MyData.stageH / 2 + 40;
            this.graphic_loading.width = 150;
            this.graphic_loading.x = (MyData.stageW - graphic_loading.width) / 2;
            this.graphic_loading.y = (MyData.stageH / 2);
            this.graphic_loadingBottom.width = 150;
            this.graphic_loadingBottom.x = (MyData.stageW - graphic_loadingBottom.width) / 2;
            this.graphic_loadingBottom.y = (MyData.stageH / 2);
        }
        for (let i = 0; i < this.arr_assets.length; i++) {
            let bool_exist = false;
            // this.arr_assetsPre.forEach(e => {
            //     if (e == this.arr_assets[i]) {
            //         bool_exist=true;
            //     }
            // });
            this.arr_assetsPre.every(e => {
                if (e == this.arr_assets[i]) {
                    bool_exist = true;
                    return false;
                }
            })

            if (!bool_exist) {
                console.log(this.arr_assets[i])
                this.loader_all.add(this.arr_assets[i], this.imgModules[this.arr_assets[i]]);
            }
        }
        this.loader_all.add('json_ske0','static/db/db0_ske.json?v='+MyData.version);
        this.loader_all.add('json_tex0','static/db/db0_tex.json?v='+MyData.version);
        this.loader_all.add('png_tex0','static/db/db0_tex.png?v='+MyData.version);
        
        // this.loader_all.add('jsonA','assets/aaa.json?v='+MyData.version);
        // this.loader_all.add('bg','static/medias/bg.mp3');

        this.loader_all.onProgress.add(this.loadProgressHandler.bind(this));
        this.loader_all.onComplete.add(this.completeHandler.bind(this));
        this.loader_all.load();
        // this.loader_all.on("progress", this.loadProgressHandler.bind(this))
            // .load(this.completeHandler.bind(this));
    }

    loadProgressHandler(loader, resource) {
        console.log('xxxxxxxxxxxxxx')
        if (MyData.mode == '2d') {
            console.log('2D资源加载:', Math.floor(loader.progress));
            if (this.text_progress) {
                this.text_progress.text = Math.floor(loader.progress) + "%";
                this.graphic_loading.scale.x = loader.progress / 100;
            }
        }
        else {
            // console.log('2D+3Dprogress:',Math.floor(loader_all.progress));
            this.text_progress.text = Math.floor(this.loader_all.progress + MyData.threeProgress) / 2 + "%";
            this.graphic_loading.scale.x = (this.loader_all.progress + MyData.threeProgress) / 2 / 100;
        }
    }

    completeHandler(loader, resources) {
        YR.Mediator.getInstance().fire('PixiMain_LoadComplete', { res: resources });
    }

    out() {
        TweenMax.to(this.sp_logo, 1, { alpha: 0 });
        TweenMax.to(this.graphic_loadingBottom, 1, { alpha: 0 });
        TweenMax.to(this.graphic_loading, 1, { alpha: 0 });
        TweenMax.to(this.text_progress, 1, { alpha: 0 });
        setTimeout(() => {
            this.parent.removeChild(this);
        }, 1000);
    }

}