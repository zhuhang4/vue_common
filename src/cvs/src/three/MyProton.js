export default class MyProton{
    constructor(_scene,_camera,_renderer)
    {
        this.proton = new Proton();
        this.scene=_scene;
        this.camera=_camera;
        this.renderer=_renderer;
        
        this.addLine();
        this.addSnow();
        this.addFireWork();
    }
    addLine()
    {
        //线条像蛇一样转啊转
        this.R = 70;
        let createLineEmitter=(x,y,color1,color2)=>
        {
            let emitter = new Proton.Emitter();
            emitter.rate = new Proton.Rate(new Proton.Span(5, 7), new Proton.Span(.01, .02));
            emitter.addInitialize(new Proton.Mass(1));
            emitter.addInitialize(new Proton.Life(2));

            let map = new THREE.TextureLoader().load("assets/images/dot.png");
            let material = new THREE.SpriteMaterial({
                map: map,
                color: 0xff0000,
                blending: THREE.AdditiveBlending,
                fog: true
            });

            emitter.addInitialize(new Proton.Body(new THREE.Sprite(material)));
            emitter.addInitialize(new Proton.Radius(50));
            emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));
            emitter.addBehaviour(new Proton.Alpha(1, 0));
            emitter.addBehaviour(new Proton.Color(color1, color2));
            emitter.addBehaviour(new Proton.Scale(1, 0.5));
            console.log(this.camera,this.renderer);
            emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(this.camera, this.renderer), 'dead'));
            emitter.addBehaviour(new Proton.Force(0, 0, -20));
            emitter.p.x = x;
            emitter.p.y = y;
            emitter.emit();
            return emitter;
        }
       
        this.line_emitter1 = createLineEmitter(35, 0, '#4F1500', '#0029FF')
        this.proton.addEmitter(this.line_emitter1);
        this.line_emitter2 = createLineEmitter(-35, 0, '#004CFE', '#6600FF')
        this.proton.addEmitter(this.line_emitter2);
        this.proton.addRender(new Proton.SpriteRender(this.scene));
    }
    addFireWork() {
        let emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(14, 18), new Proton.Span(2, 2));
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Radius(10));
        emitter.addInitialize(new Proton.Life(2, 4));
        emitter.addInitialize(new Proton.Velocity(400, new Proton.Vector3D(0, 1, 0), 60));

        // //emitter.addBehaviour(new Proton.RandomDrift(30, 30, 30, .05));
        emitter.addBehaviour(new Proton.Rotate("random", "random"));
        emitter.addBehaviour(new Proton.Scale(1, .1));
        emitter.addBehaviour(new Proton.G(6));

        var zone = new Proton.BoxZone(600);
        zone.friction = 0.95;
        zone.max = 7;
        emitter.addBehaviour(new Proton.CrossZone(zone, "bound"));
        emitter.addBehaviour(new Proton.Color(0xff0000, 'random', Infinity, Proton.easeOutQuart));

        emitter.p.x = 0;
        emitter.p.y = 0;
        emitter.emit();
        
        this.proton.addEmitter(emitter);
    }
    addSnow(){
        this.snow_emitter = new Proton.Emitter();
        this.snow_emitter.rate = new Proton.Rate(new Proton.Span(34, 48), new Proton.Span(.2, .5));
        this.snow_emitter.addInitialize(new Proton.Mass(1));
        this.snow_emitter.addInitialize(new Proton.Radius(new Proton.Span(10, 20)));
        let position = new Proton.Position();
        position.addZone(new Proton.BoxZone(2500, 10, 2500));
        this.snow_emitter.addInitialize(position);
        this.snow_emitter.addInitialize(new Proton.Life(5, 10));
       
        let map = new THREE.TextureLoader().load("assets/images/snow.png");
        let material = new THREE.SpriteMaterial({
            map: map,
            transparent: true,
            opacity: .5,
            color: 0xffffff
        });
        this.snow_emitter.addInitialize(new Proton.Body(new THREE.Sprite(material)));
        this.snow_emitter.addInitialize(new Proton.Velocity(0, new Proton.Vector3D(0, -1, 0), 90));
        this.snow_emitter.addBehaviour(new Proton.RandomDrift(10, 1, 10, .05));
        this.snow_emitter.addBehaviour(new Proton.Rotate("random", "random"));
        this.snow_emitter.addBehaviour(new Proton.Gravity(2));

        // var sceenZone = new Proton.ScreenZone(this.camera, this.renderer, 20, "234");
        // emitter.addBehaviour(new Proton.CrossZone(this.sceenZone, "dead"));

        this.snow_emitter.p.x = 0;
        this.snow_emitter.p.y = 800;
        this.snow_emitter.emit();
        this.proton.addEmitter(this.snow_emitter);
        this.proton.addRender(new Proton.SpriteRender(this.scene));
    }

    createSprite() {
        var map = new THREE.TextureLoader().load("assets/images/dot.png");
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
        });
        return new THREE.Sprite(material);
    }
    createEmitter() {
        let emitter = new Proton.Emitter();
        //出现个数，间隔时间
        emitter.rate = new Proton.Rate(new Proton.Span(40, 80), new Proton.Span(2, 2));
        emitter.addInitialize(new Proton.Mass(1));
        //粒子大小
        emitter.addInitialize(new Proton.Radius(25));
        emitter.addInitialize(new Proton.Life(1, 1));
        emitter.addInitialize(new Proton.Velocity(400, new Proton.Vector3D(0, 1, 0), 90));

        // //emitter.addBehaviour(new Proton.RandomDrift(30, 30, 30, .05));
        emitter.addBehaviour(new Proton.Rotate("random", "random"));
        emitter.addBehaviour(new Proton.Scale(1, .1));
        emitter.addBehaviour(new Proton.G(6));

        let zone = new Proton.BoxZone(500);
        zone.friction = 0.95;
        zone.max = 7;
        //bound能反弹,dead碰到销毁
        emitter.addBehaviour(new Proton.CrossZone(zone, "dead"));
        emitter.addBehaviour(new Proton.Color(0xff0000, 'random', Infinity, Proton.easeOutQuart));

        emitter.p.x = 0;
        emitter.p.y = 0;
        emitter.emit();
        // Proton.Debug.drawZone(proton, scene, zone);

        return emitter;
    }

    update()
    {
        this.proton.update(); 
    }
}