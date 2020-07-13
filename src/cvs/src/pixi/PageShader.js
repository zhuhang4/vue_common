import * as YR from "../YR";
import MyData from '@/MyData';
import YRShader from '../YRShader';
// import * as dat from 'dat.gui';

export default class PageShader extends PIXI.Container {
    constructor() {
        super();

        // this.bg=YR.Easy.CreateSprite('pageverbg.png',844/2,1496/2,0.5,0.5,1);
        // this.addChild(this.bg);


        this.rect = YR.Easy.CreateRect(0, 0, MyData.stageW, MyData.stageH, 0x0, 'left');
        this.addChild(this.rect);
        this.sp = YR.Easy.CreateSprite('p0_bg.jpg', MyData.stageW / 2, MyData.stageH / 2, 0.5, 0.5, 1);
        this.addChild(this.sp);


        // const gui = new dat.GUI();
        // document.getElementsByClassName('dg')[0].style.zIndex=99;
        // gui.add(filter_cloud.uniforms, 'offsetX',-10,10,0.05);
        // gui.add(filter_cloud.uniforms, 'offsetY',-10,10,0.05);
        // gui.add(filter_cloud.uniforms, 'u_step',0,1,0.05);
        // gui.addColor(filter_cloud.uniforms,'u_color')


        // this.shaderApply(this.rect,YRShader.NoiseCloud);
        // this.shaderApply(this.sp, YRShader.Dissolve);
        this.shaderApply(this.rect, YRShader.LightLineShader);

    }
    shaderApply(target, Shader) {

        let f = new PIXI.Filter("", Shader.fragmentShader, Shader.uniforms);
        f.resolution = 1;
        target.filters = [f];
        if (Shader == YRShader.NoiseCloud) {
            let handler = () => {
                f.uniforms.offsetX += 0.001;
                f.uniforms.offsetY += 0.001;
                f.uniforms.u_time += 0.025;
            }
            animate(handler);
        }
        else if (Shader == YRShader.Dissolve) {
            let dir=1;
            let handler = () => {
                f.uniforms.u_step+=dir*0.01;
                if (f.uniforms.u_step > 1) {
                    dir = -1;
                }
                else if (f.uniforms.u_step < 0) {
                    dir = 1;
                }

            }
            animate(handler);
        }

        function animate(handler) {
            handler();
            window.requestAnimationFrame(animate.bind(this, handler));

        }

    }
    Out() {

    }
    In() {

    }
}