import Preload from "./Preload.js";
import MyData from "@/MyData.js";
import Game from "./Game.js";
import * as YR from "../YR.js";
export default class PixiMain extends PIXI.Container {
    constructor(canvas) {
        super();
        MyData.ratio = this.ratio = window.devicePixelRatio;
        this.direction = MyData.direct;
        this.loadComplete = false;
        this.pageVer;
        this.game;

        this.app = new PIXI.Application({
            width: MyData.stageW,
            height: MyData.stageH,
            transparent: true,
            resolution: this.ratio,
            view: canvas,
            // forceCanvas:true,
        });
        MyData.render = this.pixi_renderer = this.app.renderer;

        YR.Mediator.getInstance().add('PixiMain_LoadComplete', (e) => {
            MyData.resource = e.res;
            this.loadComplete = true;
            YR.Mediator.getInstance().fire('Main_2DLoaded');
        });

        this.pixiStage = new PIXI.Container();
        this.addChild(this.pixiStage);

        this.preload = new Preload();
        this.pixiStage.addChild(this.preload);

        this._resize();
        window.onresize = this._resizeHandlerPIXI.bind(this);
        window.requestAnimationFrame(this._animate.bind(this));
    }

    _resizeHandlerPIXI() {
        setTimeout(() => {
            this._resize();
        }, 200);
    };

    _resize() {
        this.pixi_renderer.resize(window.innerWidth, window.innerHeight);
        this.pixi_renderer.view.style.height = window.innerHeight + 'px';
        this.pixi_renderer.view.style.width = window.innerWidth + 'px';
        let mode = 'noBorder';
        if(window.innerWidth > window.innerHeight)
        {
            mode='showAll';
        }
        switch (mode) {
            case 'exactFit':
                this.pixiStage.scale.x = window.innerWidth / MyData.stageW;
                this.pixiStage.scale.y = window.innerHeight / MyData.stageH;
                break;
            case 'noBorder':
                this.pixiStage.scale.x = (window.innerHeight / MyData.stageH < window.innerWidth / MyData.stageW) ? (window.innerWidth / MyData.stageW) : (window.innerHeight / MyData.stageH);
                this.pixiStage.scale.y = this.pixiStage.scale.x;
                break;
            case 'noScale':
                this.pixiStage.scale.x = 1;
                this.pixiStage.scale.y = 1;
                break;
            case 'showAll':
                this.pixiStage.scale.x = (window.innerHeight / MyData.stageH < window.innerWidth / MyData.stageW) ? (window.innerHeight / MyData.stageH) : (window.innerWidth / MyData.stageW);
                this.pixiStage.scale.y = this.pixiStage.scale.x;
                break;
        }
        this.pixiStage.x = (window.innerWidth - MyData.stageW * this.pixiStage.scale.x) * .5;
        this.pixiStage.y = (window.innerHeight - MyData.stageH * this.pixiStage.scale.y) * .5;
        MyData.offsetX = this.pixiStage.x / this.pixiStage.scale.x;
        MyData.offsetY = this.pixiStage.y / this.pixiStage.scale.x;
        MyData.scale = this.pixiStage.scale.x;
        MyData.stage = this.pixiStage;
        if (this.direction == 'hor') {
            if (window.innerWidth < window.innerHeight) {
                if (this.pageVer && this.loadComplete) {
                    this.pixiStage.addChild(this.pageVer);
                }
            }
            else {
                if (this.pageVer && this.pageVer.parent) {
                    this.pixiStage.removeChild(pageVer);
                }
                if (this.loadComplete && !this.game) {
                    // this.game=Game.create();
                    // this.pixiStage.addChildAt(this.game,0);
                }
            }
        }
        //竖版设计
        else {
            //假横屏
            if (window.innerWidth > window.innerHeight) {
               
            }
            else {
            
            }
            
            if (this.loadComplete && !this.game) {
                this.game = new Game();
                this.pixiStage.addChildAt(this.game, 0);
            }

            // console.log('myVideo:',myVideo);
            // if(myVideo)
            // {
            // myVideo.style.left= pixiStage.x+pixiStage.scale.x*0+'px';
            // myVideo.style.top= pixiStage.y+pixiStage.scale.y*0+'px';
            // myVideo.style.width= 844*pixiStage.scale.x+'px';
            // myVideo.style.height=1496*pixiStage.scale.y+'px';
            // }
        }
        if (this.pageVer) {
            this.pageVer.resize();
        }
        if (this.game) {
            this.game.resize();
        }
    }
    pixiStart() {
        this.preload.out();
        this._resize();
    }

    _animate() {
        window.requestAnimationFrame(this._animate.bind(this));
        this.pixi_renderer.render(this.pixiStage);

        if (this.game && this.game.pd) {
            this.game.pd.emitter.update(0.01);
        }
    }
}

