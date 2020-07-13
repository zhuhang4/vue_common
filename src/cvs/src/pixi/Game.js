import * as YR from '../YR';
import MyData from '@/MyData';
import MyVideo from '../MyVideo.js';

import Page0 from './Page0.js';
import PageShader from './PageShader.js';
export default class Game extends PIXI.Container {
  constructor() {
    super();

    // this.p0=new Page0();
    // this.addChild(this.p0);

   
    // this.init();
    // YR.Easy.CreateJSONGroup(json_group0, this);

    this.bt = YR.Easy.CreateSprite('loading.jpg', 0, 0, 0.0, 0.0, 1);
    this.addChild(this.bt);

    // this.addShader(); 
  }
  addShader()
  {
    this.pshader=new PageShader();
    this.addChild(this.pshader);

  }
  downHandler(e) {
    console.log(e)
  }
  longPress() {
    // console.log('长按啊啊啊啊啊啊啊啊啊啊啊')
  }
  init() {

    /* 粒子 */
    // this.pd=new YR.MyParticle();
    // this.addChild(this.pd.emitterContainer);

    /* 滚动容器 */
    // let arr_sc=[];
    // this.p0=new Page0();
    // this.p1=new Page0();
    // this.addChild(this.p0);
    // this.addChild(this.p1);
    // arr_sc.push(this.p0,this.p1);

    // let sc_con=new PIXI.Container();
    // this.addChild(sc_con);
    // let sc=new YR.Scroller(sc_con,844,1496,'ver','AA',arr_sc);

    // YR.Mediator.getInstance().add('AA_ScrollStart',(e)=>
    // {
    //     sc.arrPage[e.idx].Out()
    // });
    // YR.Mediator.getInstance().add('AA_ScrollComplete',(e)=>
    // {
    //     sc.arrPage[e.idx].In()
    // });
    // YR.Mediator.getInstance().add('Game_SCStart',(e)=>
    // {
    //     sc_con.interactive=true;
    // });
    // YR.Mediator.getInstance().add('Game_SCStop',(e)=>
    // {
    //     sc_con.interactive=false;
    // });

    // if(sc.dir=='ver')
    // {
    //     for(var i=0;i<arr_sc.length;i++)
    //     {
    //         sc_con.addChild(arr_sc[i]);
    //         arr_sc[i].y=MyData.stageH*i;
    //     }
    // }
    // else
    // {
    //     for(var i=0;i<arr_sc.length;i++)
    //     {
    //         sc_con.addChild(arr_sc[i]);
    //         arr_sc[i].x=MyData.stageW*i;
    //     }
    // }

    /* 长拉页 */
    // let sclong_con=new PIXI.Container();
    // let _mask=new PIXI.Graphics();

    /* 竖版逻辑 */
    // _mask.beginFill(0xff0000,1);
    // _mask.drawRect(0,0,844,1400);
    // let scLong=new YR.ScrollLong(sclong_con,'ver',844,1496,_mask);
    // for(var i=0;i<5;i++)
    // {
    //     var p=new Page0();
    //     p.y=1496*i;
    //     sclong_con.addChild(p);
    // }
    // this.addChild(sclong_con);
    // this.addChild(_mask);

    /* 横版逻辑 */
    // _mask.beginFill(0xff0000,1);
    // _mask.drawRect(0,0,844,1400);
    // let scLong=new YR.ScrollLong(sclong_con,'hor',844,1496,_mask);
    // for(var i=0;i<5;i++)
    // {
    //     var p=new Page0();
    //     p.x=844*i;
    //     sclong_con.addChild(p);
    // }
    // this.addChild(sclong_con);
    // this.addChild(_mask);
  }
  resize() {
    console.log('game:resize');
  }
}