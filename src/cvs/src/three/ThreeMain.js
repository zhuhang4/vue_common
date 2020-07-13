import ThreePreload from "./ThreePreload";
import MyProton from "./MyProton";
import ThreeShader from "./ThreeShader.js";
import { Monitor } from "@/lib/GLPerf.js"
import * as dat from 'dat.gui';
import YRShader from "../YRShader";
import { GLTFLoader } from "@/lib/GLTFLoader";
// import { EffectComposer } from '../../../lib/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from '../../../lib/jsm/postprocessing/RenderPass.js';
// import { Zlib } from "../../../lib/jsm/libs/inflate.module.min.js";
// import { UnrealBloomPass } from '../../../lib/jsm/postprocessing/UnrealBloomPass.js';
import MyData from "@/MyData";
import * as YR from "../YR";
export default class ThreeMain {
    constructor(cvs) {
        //镜头旋转
        this.ctha = 0;
        this.bool_render = true;

        this.assets3D = new ThreePreload();

        this.renderer = new THREE.WebGLRenderer({ canvas: cvs, antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2.2;
        // this.renderer.setClearColor(0xffff00, 0.5);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.position.set(3, 2, 3);
        this.camera.rotation.set(-0.57, -0.68, -0.38);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.autoRotate = true;
        this.controls.rotateSpeed = 0.2;
        this.controls.minDistance = 0;
        this.controls.maxDistance = 5000;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.2;
        this.controls.minPolarAngle = 65 * Math.PI / 180;; // radians
        this.controls.maxPolarAngle = 80 * Math.PI / 180; // radians
        this.controls.enableRotate = true;
        // this.scene.fog=

        this.loader = new THREE.TextureLoader();
        this.arr_touch = [];
        this.ob_scene0 = {};
        this.ob_scene1 = {};
        // this.addComposer();
        // this.gui = new dat.GUI();
        // this.gui.domElement.parentElement.style.zIndex=9999;
        // console.log(document.getElementsByClassName('.dg.ac'));
        // document.getElementsByClassName('dg.ac')[0].style.zIndex=9999;
    }
    init() {
        this.addLight();
        // this.addModel(MyData.modelIdx);
        // YR.ThreeEasy.InitClick(this.renderer.domElement, this.camera, this.arr_touch, this.pieceTouchedHandler.bind(this));
     

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();
        this.animate();

        YR.Mediator.getInstance().add('Three_Move', (e) => {

            // console.log(e.dir);
            // console.log(this.camera.rotation.y);
            // let cameraRot=this.camera.rotation.y;
            // let dir;
            if (e.dir == 'r') {
                // this.controls.pan(-20, 0)
                this.controls.dollyIn(1.1);
            }
            else if (e.dir == 'l') {
                // dir=-1;
                // this.controls.pan(20, 0)
                this.controls.dollyOut(1.1);
            }
            // this.scene.position.set(this.scene.position.x+dir*0.2*Math.cos(cameraRot),0,this.scene.position.z+dir*0.2*Math.sin(cameraRot))
            // console.log(this.scene.position)
        });

        YR.Mediator.getInstance().add('Three_PlaneClose', () => {
            this.cameraReset(0.3);
        });
        YR.Mediator.getInstance().add('Three_In', (e) => {
            this.controls.reset();
            this.controls.enableRotate = true;
            if (this.gltf0) {
                this.scene.remove(this.gltf0);
            }
            if (this.gltf1) {
                this.scene.remove(this.gltf1);
            }
            if (this.plane0) {
                this.scene.remove(this.plane0);
            }
            if (this.plane1) {
                this.scene.remove(this.plane1);
            }

            this.addModel(e.idx);
            this.bool_render = true;
            this.camera.updateProjectionMatrix();
            this.animate();
            this.cameraReset(0.3);
            console.log('this.Three_In', this.bool_render);
        });
        YR.Mediator.getInstance().add('Three_Out', () => {
            this.bool_render = false;
            // this.controls.enableRotate=false;
            clearTimeout(this.addPlaneDelay);
            console.log('this.Three_Out', this.bool_render);
        });
    }
    cameraReset(time = 0) {
        if (this.cameraResetPos && this.cameraResetQuaternion) {
            setTimeout(() => {
                TweenMax.to(this.camera.position, time, { x: this.cameraResetPos.x, y: this.cameraResetPos.y, z: this.cameraResetPos.z, ease: Linear.easeNone });
                let ob = { t: 0 };
                if (!isNaN(this.cameraResetQuaternion._x)) {
                    TweenMax.to(ob, time, {
                        t: 1, onUpdate: () => {
                            this.camera.quaternion.slerp(this.cameraResetQuaternion, ob.t);
                        }
                    });
                }

            }, 0);
        }
        setTimeout(() => {
            this.bool_focus = false;
            this.controls.enableRotate = true;
        }, (time + 0.1) * 1000);
    }
    addGLPer() {
        this.glPerf = new Monitor(this.renderer.domElement)
    }
    addShader() {
        this.threeshader = new ThreeShader();
        this.scene.add(this.threeshader.mesh);

        // let folder = this.gui.addFolder('shadertest');        
        // folder.add(this.shaderTest.material.uniforms.speed,'value',0,10);
        // folder.open();

        // let folder2 = this.gui.addFolder('radical blur');        
        // folder2.add(this.shaderTest.material.uniforms.GlowRange,'value',0,100);
        // folder2.open();
    }
    createLine(v1, v2, type) {
        let geo_line = new THREE.Geometry();
        geo_line.vertices.push(v1, v2);
        let _color;
        if (type == 'video') {
            _color = [new THREE.Color(0xffffff), new THREE.Color(0xffffff)];
            // _color=THREE.Color(0,154,151);
        }
        else {
            _color = [new THREE.Color(0xfff441), new THREE.Color(0xffffff)];
            // _color=THREE.Color(0,185,213);
        }
        geo_line.colors.push(..._color);
        let mat = new THREE.LineBasicMaterial({
            vertexColors: true,
            // linewidth: 1,
            // linecap: 'round', //ignored by WebGLRenderer
            // linejoin: 'round' //ignored by WebGLRenderer});
        });
        let mesh = new THREE.LineSegments(geo_line, mat);
        return mesh
    }
    createPlane(pos, w, h, url, linkTarget, info, isbg = false) {
        let geo = new THREE.PlaneGeometry(w, h, 1, 1);
        // let mat=new THREE.MeshBasicMaterial({map:this.loader.load(url)});
        let _color;
        if (info.type == 'video') {
            _color = new THREE.Color(0xffffff);

        }
        else {
            _color = new THREE.Color(0xfff441);
        }
        // let mat = new THREE.ShaderMaterial(YRShader.ShineSide);
        // mat.transparent = true;
        // mat.uniforms = YR.Utils.deepClone(YRShader.ShineSide.uniforms);
        // mat.uniforms.texture.value = this.loader.load(url);
        // mat.uniforms.color.value = new THREE.Vector3(_color.r, _color.g, _color.b);
        // mat.uniforms.time.value = 1;

        // MyData.requestHandler.push(() => {
        //     mat.uniforms.time.value += 0.05;
        // });
        let mat;
        if (isbg) {
            mat = new THREE.MeshBasicMaterial({ map: this.loader.load(url), color: 0xffffff, transparent: true });
            mat.opacity = 0;
            TweenMax.to(mat, 1, { yoyo: true, repeat: -1, opacity: 1, ease: Cubic.easeInOut });
        }
        else {
            mat = new THREE.MeshBasicMaterial({ map: this.loader.load(url), color: 0xffffff, transparent: true });
        }


        let mesh = new THREE.Mesh(geo, mat);
        mesh.scale.set(0.7, 0.7, 0.7);
        mesh.position.add(pos);
        mesh.info = info;
        mesh.linkTarget = linkTarget;
        this.arr_touch.push(mesh);

        return mesh;
    }
    createLine2(v1, v2) {
        var curve = new THREE.CatmullRomCurve3([
            v1, v2
        ], false/*是否闭合*/);
        var geo_line = new THREE.TubeGeometry(curve, 20, 1, 2, false);
        // var geo_line=new THREE.PlaneGeometry(100,100,1,1);
        // let v_center = v1.clone().add(v2).divideScalar(2);

        let distance = v1.distanceTo(v2);
        YRShader.ThreeBasic.uniforms.dis.value = distance;
        YRShader.ThreeBasic.uniforms.start_position.value = v1;
        // let mat = new THREE.ShaderMaterial(YRShader.ThreeBasic);
        // mat.uniforms = { ...YRShader.ThreeBasic.uniforms };

        let mat = new THREE.ShaderMaterial(YRShader.ThreeBloom);
        mat.uniforms = { ...YRShader.ThreeBasic.uniforms };
        mat.uniforms.texture.value = new THREE.TextureLoader().load(MyData.imgModules['logo.png']);
        mat.transparent = true;

        // setInterval(() => {
        //     mat.uniforms.time.value += 0.01;
        // }, 30);
        let mesh = new THREE.Mesh(geo_line, mat);
        return mesh
    }
    addLight() {
        this.dirlight = new THREE.DirectionalLight(0xffffff, 0);
        this.dirlight.position.set(100, 100, 100);
        this.dirlight.castShadow = true;
        this.scene.add(this.dirlight);

        this.alight = new THREE.AmbientLight(0x404040, 0); // soft white light
        this.scene.add(this.alight);
    }
    addModel(idx) {
        let modelurl = ['@static/model/showroom_A_0520.gltf', '@static/model1/untitled.gltf']
        if (!this['gltf' + idx]) {
            YR.Mediator.getInstance().fire('LoadPage_Start');

            let loader = new GLTFLoader();
            // let loader = new THREE.FBXLoader();
            loader.load(
                modelurl[idx],
                // 'assets/bugatii.gltf',
                (gltf) => {
                    // gltf.scene=gltf;
                    // console.log(gltf)
                    if (idx == 0) {
                        // gltf.scene.scale.set(5, 5, 5);
                        gltf.scene.position.y = -0.5;

                        gltf.scene.scale.set(7, 7, 7);
                    }
                    else {
                        gltf.scene.position.y = -0.75;
                        gltf.scene.scale.set(6.05, 6.05, 6.05);
                    }

                    this.scene.add(gltf.scene);
                    gltf.scene.castShadow = true;
                    gltf.scene.receiveShadow = true;
                    let len = gltf.scene.children[0].children.length;
                    let gp = gltf.scene.children[0].children;
                    this.loopidx = 0;
                    for (let i = 0; i < len; i++) {
                        this.loopSceneObject(gp[i], this.loopidx);
                    };
                    this['gltf' + idx] = gltf.scene;
                    this.modelIn(idx);
                    YR.Mediator.getInstance().fire('LoadPage_Complete');
                    YR.Mediator.getInstance().fire('MyCanvas_ArrowIn');
                    
                },
                // called while loading is progressing
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    // YR.Mediator.getInstance().fire('LoadPage_Update',{data:(xhr.loaded / xhr.total * 100)});
                },
                // called when loading has errors
                function (error) {
                    console.error('An error happened：', error);
                }
            );
        }
        else {
            console.log('模型已经加载过');

            this.scene.add(this['gltf' + idx]);
            this.addPlane(idx);


            // this.scene.add(this['plane' + idx]);
        }

    }
    loopSceneObject(ob) {
        this.loopidx++;
        let len = ob.children.length;
        for (let i = 0; i < len; i++) {
            this.loopSceneObject(ob.children[i]);
        }

        if (ob.name.substr(0, 6) == 'button') {
            let idx = ob.name.substr(6, ob.name.length - 6);
            // ob.material.transparent = true;
            // ob.material.opacity = 0.0;
            // ob.parent.remove(ob);
            ob.visible = false;
            this['ob_scene' + MyData.modelIdx.toString()]['bt_' + idx] = ob;
        }
        else if (ob.name.substr(0, 5) == 'model') {
            let idx = ob.name.substr(5, ob.name.length - 5);
            this['ob_scene' + MyData.modelIdx.toString()]['bt_' + idx] = ob;
        }
        else if (ob.name.substr(0, 6) == 'double') {
            if (ob.type == 'Mesh') {
                ob.material.side = THREE.DoubleSide;

                if (ob.name == 'double') {
                    console.log(ob.name);

                    // ob.material.map=;
                    // ob.material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(MyData.imgModules['VIO 100C-50C.jpg']) });
                }
                // else if(ob.name=='doubledeng')
                // {
                //     ob.material=
                // }
            }

        }

        if (ob.type == 'Mesh') {
            let map = ob.material.map;

            if (map) {
                // if (map.image.currentSrc.substr(map.image.currentSrc.length - 3, 3) == 'png') {
                // ob.material.transparent = true;
                // ob.material.opacity = .99;
                // ob.material.depthWrite = false;
                // ob.material.side=THREE.DoubleSide;
                // setInterval(()=>
                // {
                //     ob.rotation.x+=0.1;
                // },30)

                // }
                // else {
                // ob.material.transparent=false;
                // ob.material.opacity=.99;
                // ob.material.depthWrite = false;
                // }

                // ob.material.transparent = true;
                // ob.material.opacity = .99;
                // TweenMax.to(ob.material,1.5,{delay:this.loopidx*0.1,opacity:1,ease:Linear.easeNone});
            }
        }



        // pCube15
    }

    modelIn(idx) {
        this.scene.rotation.y = Math.PI;
        this.scene.scale.set(2, 2, 2);
        TweenMax.to(this.scene.scale, 2, { x: 1, y: 1, z: 1, ease: Cubic.easeInOut });
        TweenMax.to(this.scene.rotation, 2, { y: 0, ease: Cubic.easeInOut });
        TweenMax.to(this.alight, 2.5, { intensity: 1.0, ease: Linear.easeNone });
        TweenMax.to(this.dirlight, 2.5, { intensity: 1.0, ease: Linear.easeNone });

        this.addPlaneDelay = setTimeout(() => {
            console.log('delay!!!');
            this.addPlane(idx);
        }, 2500);
    }

    addPlane(idx) {
        console.log('addPlane:',!this['plane' + idx.toString()]);
        // if(idx==1)
        // {
        //     return//第二个馆面板先不加
        // }
        if (!this['plane' + idx.toString()]) {
            // let arr = MyData.jsondata.scene0;
            let arr = MyData.jsondata['scene'+idx.toString()];
            console.log('arr:',arr)
            this['plane' + idx.toString()] = new THREE.Object3D();
            for (let i in arr) {
                
                if (arr[i].type == 'video') {

                }
                else if (arr[i].type == 'img') {

                }
                // let ob = this['ob_scene'+MyData.modelIdx.toString()][arr[i].name];
                let ob = this['ob_scene' + MyData.modelIdx.toString()]['bt_' + arr[i].idx];
                if (ob) {
                    this.scene.updateMatrixWorld();
                    ob.parent.updateMatrixWorld();
                    let startPos = ob.getWorldPosition();
                    let finalPos = new THREE.Vector3(startPos.x, startPos.y + 0.6, startPos.z);
                    let linkTarget = ob;
                    let mesh_line = this.createLine(startPos, finalPos, arr[i].type);
                    let mesh_planebg = this.createPlane(finalPos, 0.512 * 0.88, 0.128 * 0.88, MyData.imgModules['touchbg.png'], linkTarget, arr[i], true);
                    console.log('touch' + arr[i].idx + '.png');

                    let mesh_plane = this.createPlane(finalPos, 0.512 * 0.88, 0.128 * 0.88, MyData.imgModules['touch' + arr[i].idx + '.png'], linkTarget, arr[i]);
                    this['plane' + idx.toString()].add(mesh_planebg);
                    this['plane' + idx.toString()].add(mesh_line);
                    this['plane' + idx.toString()].add(mesh_plane);


                    mesh_line.scale.set(1, 0, 1);
                    mesh_plane.scale.set(0, .7, .7);
                    mesh_planebg.scale.set(0, .7, .7);
                    TweenMax.to(mesh_line.scale, .3, { delay: 0+ .3 + i * 0.01, y: 1 });
                    TweenMax.to(mesh_plane.scale, .3, { delay: 0 + .3 + i * 0.01, x: .7 });
                    TweenMax.to(mesh_planebg.scale, .3, { delay: 0 + .3 + i * 0.01, x: .7 });
                }

                this.scene.add(this['plane' + idx.toString()]);

                // this.scene.add(mesh_plane);
            }
        }
        else {
            console.log('面板已经生成过');
            this.scene.add(this['plane' + idx.toString()]);
        }

    }

    addStars() {
        let geometry = new THREE.Geometry();
        for (var i = 0; i < 10000; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = THREE.Math.randFloatSpread(2000);
            vertex.y = THREE.Math.randFloatSpread(2000);
            vertex.z = THREE.Math.randFloatSpread(2000);
            geometry.vertices.push(vertex);
        }
        let particles = new THREE.Points(geometry, new THREE.PointsMaterial({
            color: 0x888888
        }));
        this.scene.add(particles);
    }
    addComposer() {
        var composer = new EffectComposer(this.renderer);
        composer.setSize(window.innerWidth, window.innerHeight);
        this.composer = composer;

        var renderScene = new RenderPass(this.scene, this.camera);
        composer.addPass(renderScene);

        var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.1, 0.9);
        composer.addPass(bloomPass);

        bloomPass.renderToScreen = true;
    }
    onWindowResize(event) {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        // plane.rotation.setFromRotationMatrix( camera.matrix );


        if (this.bool_render) {
            requestAnimationFrame(this.animate.bind(this));
            // this.camera.lookAt(this.scene.position);
            this.renderer.render(this.scene, this.camera);
            if (this.glPerf) {
                this.glPerf.update()
            }
            if (this.myProton) {
                this.myProton.update();
            }
            if (this.controls && !this.bool_focus) {
                this.controls.update();
            }

            var q = this.camera.quaternion.clone();
            for (var i = 0; i < this.arr_touch.length; i++) {
                this.arr_touch[i].quaternion.copy(q);
            }

            MyData.requestHandler.forEach((e) => {
                e();
            });
        }
    }
    pieceTouchedHandler(target) {

        

        if (this.bool_focus) {
            return;
        }
        if (target.info.type == 'input') {
            YR.Mediator.getInstance().fire('MyCanvas_RouterChange',{idx:MyData.modelIdx});
            return
        }
        // target=target.linkTarget;
        this.bool_focus = true;
        this.controls.enableRotate = false;

        let cameraResetRot = this.camera.rotation.clone();
        let cameraResetQuaternion = this.cameraResetQuaternion = this.camera.quaternion;

        this.camera.lookAt(target.position);
        let cameraRotLook = this.camera.rotation.clone();
        let cameraLookQuaternion = this.camera.quaternion;
        this.camera.rotation.set(cameraResetRot.x, cameraResetRot.y, cameraResetRot.z);
        let cameraResetPos = this.cameraResetPos = this.camera.position.clone();

        let cameraPos = this.camera.position.clone().lerp(target.position, 0.5);
        // let cameraPos = target.position.clone().sub(this.camera.position.clone());
        // console.log("this.camera.position:",cameraPos);
        // this.camera.translateOnAxis(cameraPos.normalize(),0.5);
        // console.log()
        // cameraPos.setLength(cameraPos.length()-6);
        // this.cameraPos=this.camera.position;

        this.camera.position.set(cameraResetPos.x, cameraResetPos.y, cameraResetPos.z);
        // let v3=new THREE.Vector3(1,0,0);
        // cameraPos.sub(v3);
        TweenMax.to(this.camera.position, .7, { x: cameraPos.x, y: cameraPos.y, z: cameraPos.z });
        // TweenMax.to(this.camera.rotation, 1, { x: cameraRotLook.x, y: cameraRotLook.y, z: cameraRotLook.z });

        let ob = { t: 0 }
        TweenMax.to(ob, .35, {
            t: 1, onUpdate: () => {
                this.camera.quaternion.slerp(cameraLookQuaternion, ob.t);
            }, onComplete: () => {
                console.log("target.info.type:",target.info.type);
                if (target.info.type == 'video') {
                    YR.Mediator.getInstance().fire('PageVideo_In', { info: target.info });
                }
                else if (target.info.type == 'img') {
                    YR.Mediator.getInstance().fire('PageImage_In', { info: target.info });
                }
                


            }
        });
    }
    addHelper() {
        let help = new THREE.AxesHelper(15);
        this.scene.add(help)
    }
}
