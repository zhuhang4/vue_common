import MyData from '@/MyData';
import YRShader from '../YRShader';

export default class ThreeShader {
    constructor() {
        let geometry = new THREE.BoxBufferGeometry(200, 200,200,1,1,1);
        let shaderInfo = {};
        // YRShader.DBlur.uniforms.texture.value=new THREE.TextureLoader().load(MyData.imgModules['p0_bg.jpg']);
        YRShader.LightLineShader.uniforms.sampler0.value=new THREE.TextureLoader().load(MyData.imgModules['p0_bg.jpg']);
        shaderInfo.material = this.shaderApply(YRShader.LightLineShader);
        shaderInfo.mesh = new THREE.Mesh(geometry, shaderInfo.material);
        return shaderInfo;
    }
    shaderApply(Shader) {
        if (Shader == YRShader.LightLineShader) {
            let handler = () => {
                YRShader.LightLineShader.uniforms.time.value += 0.01;
            }
            animate(handler);
        }
        return new THREE.ShaderMaterial({
            uniforms: Shader.uniforms,
            fragmentShader: Shader.fragmentShader,
            vertexShader: Shader.vertexShader
        });

        function animate(handler) {
            handler();
            window.requestAnimationFrame(animate.bind(this, handler));

        }

    }
}