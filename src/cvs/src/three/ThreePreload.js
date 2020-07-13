/**
 * Created by Administrator on 2017/6/2 0002.
 */
import * as YR from '../YR';
import MyData from '@/MyData';
// import static_url from './@'
// import * as THREE from './lib/three.min.js'

export default class ThreePreload{
    constructor()
    {
        this.files = require.context('@static/model', false, /\.png$|\.jpg$|\.webp$/);
        this.imgModules = {};
        this.files.keys().forEach(key => {
            this.imgModules[key.replace(/(\.\/)/g, '')] = this.files(key);
        });

        let assets3D={};
        assets3D.manager = new THREE.LoadingManager();
        assets3D.gp_texture={};
        assets3D.manager.onProgress = function (item, loaded, total) {
            MyData.threeProgress=100*loaded/total;
            YR.Mediator.getInstance().fire('3DProgressUpdate',{data:Math.floor(MyData.threeProgress)});
        };
        assets3D.manager.onLoad = function () {
            YR.Mediator.getInstance().fire('Main_3DLoaded');

        };
        assets3D.manager.onError = function () {
            console.log('there has been an error');
        };

        ThreePreload.imgModules={};
        for(let i in this.imgModules)
        {
            ThreePreload.imgModules[i]= new THREE.TextureLoader(assets3D.manager).load(this.imgModules[i]);
        }

        // for(let i=0;i)
        // assets3D.gp_texture['s3'] = new THREE.TextureLoader(assets3D.manager).load(MyData.imgModules['s3.png']);
        // assets3D.gp_texture['leaf'] = new THREE.TextureLoader(assets3D.manager).load('assets/images/leaf.png');
        // assets3D.gp_texture['earth_bump'] = new THREE.TextureLoader(assets3D.manager).load('assets/images/earth_bump.jpg');
        // assets3D.gp_texture['earth_cloud'] = new THREE.TextureLoader(assets3D.manager).load('assets/images/earth_cloud.png');
        // assets3D.gp_texture['earth_spec'] = new THREE.TextureLoader(assets3D.manager).load('assets/images/earth_spec.jpg');

        return assets3D;
    }
}
