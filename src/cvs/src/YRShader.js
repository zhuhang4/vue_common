
export default class YRShader {
	constructor() {
		console.log('YRShader初始化完毕')
		YRShader.Dissolve = {
			uniforms: {
				offsetX: 0.0,
				offsetY: 0.0,
				xscale: 15.0,
				yscale: 25.0,
				u_step: 1.0,
				u_step2: 0.5,
				u_time: 0.0,
				u_r: 1250,
				u_color: [1.0,.7,.7]
			},

			vertexShader: [

				// "void main() {",

				// "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				// "}"
				`
				#define GLSLIFY 1
				attribute vec2 aVertexPosition;
				attribute vec2 aTextureCoord;
				uniform mat3 projectionMatrix;
				varying vec2 vTextureCoord;

				void main(void)
				{
					gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
					vTextureCoord = aTextureCoord;
				}

				`

			].join("\n"),

			fragmentShader:
				`
			precision highp float;

			varying vec2 vTextureCoord;
			varying vec4 vColor;
			
			uniform sampler2D uSampler;
			uniform float u_step;
			uniform float u_step2;
			uniform float offsetX;
			uniform float offsetY;
			uniform float xscale;
			uniform float yscale;
			uniform float u_time;
			uniform vec3 u_color;

			float rand(vec2 n) {
				//This is just a compounded expression to simulate a random number based on a seed given as n
				return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
			}
			float rand (float n) {
				return fract(sin(n)*1000000.);
			}

			float hash(float n) {
				return fract(sin(n) * 1e4);
			}
			
			float hash(vec2 p) { 
				return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
			}
			
			
			float noise(vec2 x) {
   				// const vec2 d = vec2(0.0, 1.0);
				// vec2 b = floor(n);
				// vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    			// return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
			
				vec2 i = floor(x);
				vec2 f = fract(x);

				// Four corners in 2D of a tile
				float a = hash(i);
				float b = hash(i + vec2(1.0, 0.0));
				float c = hash(i + vec2(0.0, 1.0));
				float d = hash(i + vec2(1.0, 1.0));

				// Simple 2D lerp using smoothstep envelope between the values.
				// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
				//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
				//			smoothstep(0.0, 1.0, f.y)));

				// Same code, with the clamps in smoothstep and common subexpressions
				// optimized away.
				vec2 u = f * f * (3.0 - 2.0 * f);
				return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;


			}
			  
			  float fbm(vec2 n) {
				//fbm stands for "Fractal Brownian Motion" https://en.wikipedia.org/wiki/Fractional_Brownian_motion
					float total = 0.0, amplitude = 0.5;
					for (int i = 0; i < 6; i++) {
					  total += noise(n) * amplitude;
					  n += n;
					  amplitude *= 0.5;
					}
					return total;

					
			  }
			float fbm2(vec2 n)
			{
				float total = 0.0, amplitude = 0.5;
				for (int i = 0; i < 4; i++) {
					total += amplitude * abs(noise(n));
					n *= 2.;
					amplitude *= .5;
				  }
				  return total;

			}
			  
			void main(void)
			{
				vec2 uv = vTextureCoord;
				vec2 pos = vec2(xscale*uv.x+offsetX,yscale*uv.y+offsetY);
				vec4 texture2 =  texture2D(uSampler,uv);
				
				//rand雪花
				// gl_FragColor.rgba = vec4(vec3(rand(pos)),1.);
				// gl_FragColor = texture2 * rand(uv);
				// float nn=rand(uv);
				// gl_FragColor = texture2 * (1.0-smoothstep(step, step, nn));
				
				//一维noise
				// float i =floor(pos.x);
				// float f =floor(pos.x);
				// float y=mix(rand(i),rand(i+1.),smoothstep(0.,1.,f));
				// gl_FragColor = vec4(vec3(y),1.0);

				//二维noise
				// float nn = noise(pos);
				// gl_FragColor=vec4(vec3(nn),1.);
				
				//应用二维noise到溶解效果
				// float nn = fbm(pos);
				// float nn2 = fbm(pos+vec2(-1.5,-1.5));
				// gl_FragColor=vec4(vec3(nn),1.);
			

				//边缘发光溶解
				float nn = fbm(pos);
				float nn2 = fbm(pos+vec2(-1.5,-1.5));
				if(nn +uv.y - 2.0*u_step > 0.0)
                {
                    discard;
				}
				
				if (nn+uv.y - 2.0*u_step > -0.1)
				{
					if(texture2.rgb!=vec3(0.))
					{
						gl_FragColor = vec4(1.3*vec3(mix(texture2.rgb,u_color,nn)),1.0);
					}
				}
				else
				{
					gl_FragColor=texture2;
				}
			}
		
			`

		};
		YRShader.NoiseCloud = {

			uniforms: {
				offsetX: -0.5,
				offsetY: 0.0,
				u_color: [255, 169, 185],
				u_step: 1.0,
				u_time: 0.0,
			},

			vertexShader: [
				`
				#define GLSLIFY 1
				attribute vec2 aVertexPosition;
				attribute vec2 aTextureCoord;
				uniform mat3 projectionMatrix;
				varying vec2 vTextureCoord;

				void main(void)
				{
					gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
					vTextureCoord = aTextureCoord;
				}

				`
			].join("\n"),

			fragmentShader:
				`
			precision highp float;

			varying vec2 vTextureCoord;
			varying vec4 vColor;
			
			uniform sampler2D uSampler;
			uniform vec3 u_color;
			uniform float u_step;
			uniform float offsetX;
			uniform float offsetY;
			uniform float u_time;

			float rand(vec2 n) {
				//This is just a compounded expression to simulate a random number based on a seed given as n
				return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
			}
			float rand (float n) {
				return fract(sin(n)*1000000.);
			}

			float hash(float n) {
				return fract(sin(n) * 1e4);
			}
			
			float hash(vec2 p) { 
				return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
			}
			
			
			float noise(vec2 x) {
   				// const vec2 d = vec2(0.0, 1.0);
				// vec2 b = floor(n);
				// vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    			// return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
			
				vec2 i = floor(x);
				vec2 f = fract(x);

				// Four corners in 2D of a tile
				float a = hash(i);
				float b = hash(i + vec2(1.0, 0.0));
				float c = hash(i + vec2(0.0, 1.0));
				float d = hash(i + vec2(1.0, 1.0));

				// Simple 2D lerp using smoothstep envelope between the values.
				// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
				//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
				//			smoothstep(0.0, 1.0, f.y)));

				// Same code, with the clamps in smoothstep and common subexpressions
				// optimized away.
				vec2 u = f * f * (3.0 - 2.0 * f);
				return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;


			}

			float fbm(vec2 n) {
				//fbm stands for "Fractal Brownian Motion" https://en.wikipedia.org/wiki/Fractional_Brownian_motion
					float total = 0.0, amplitude = 0.5;
					for (int i = 0; i < 6; i++) {
					  total += noise(n) * amplitude;
					  n += n;
					  amplitude *= 0.5;
					}
					return total;
			}
			float fbm2(vec2 n)
			{
				float total = 0.0, amplitude = 0.5;
				for (int i = 0; i < 4; i++) {
					total += amplitude * abs(noise(n));
					n *= 2.;
					amplitude *= .5;
				  }
				  return total;

			}
			  
			void main(void)
			{
				vec2 uv = vTextureCoord;
				vec2 pos = vec2(2.0*uv.x+offsetX,4.0*uv.y+offsetY);
				vec4 texture2 =  texture2D(uSampler,uv);
				
				//rand雪花
				// gl_FragColor.rgba = vec4(vec3(rand(pos)),1.);
				// gl_FragColor = texture2 * rand(uv);
				// float nn=rand(uv);
				// gl_FragColor = texture2 * (1.0-smoothstep(step, step, nn));
				
				//一维noise
				// float i =floor(pos.x);
				// float f =floor(pos.x);
				// float y=mix(rand(i),rand(i+1.),smoothstep(0.,1.,f));
				// gl_FragColor = vec4(vec3(y),1.0);

				//二维noise
				// float nn = noise(pos);
				// gl_FragColor=vec4(vec3(nn),1.);

				//分形noise
				vec2 q = vec2(0.);
				q.x = fbm( pos + 0.00);
				q.y = fbm( pos + vec2(-5.2,1.690));
				vec2 r = vec2(0.);
				r.x = fbm( pos + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
				r.y = fbm( pos + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);
				//涡流分型
				float nn = fbm(pos+r);
				//颜色线性叠加
				vec3 color=mix((u_color)*0.00392,vec3(1.0,1.0,1.0),nn);

				// vec3 color=vec3(0.);
				// color = mix((u_color)*0.00392,
                // vec3(1.0,1.0,1.0),
                // clamp((nn*nn)*4.0,0.0,1.0));

				// color = mix(color,
				// 			vec3(1.,1.,1.),
				// 			clamp(length(q),0.0,1.0));

				// color = mix(color,
				// 			vec3(0.666667,1,1),
				// 			clamp(length(r.x),0.0,1.0));


				//三次函数使得图像层次更分明
				nn=1.0*nn*nn*nn+0.5*nn*nn+0.1*nn;
				//亮部（第二个颜色）透明显示
				if(nn>u_step)
				{
					gl_FragColor.rgba = vec4(nn*color,0.0);
				}
				else
				{
					gl_FragColor.rgba = vec4(nn*color,1.0);
				}
				// gl_FragColor = texture2*(0.5+nn);
				// gl_FragColor.rgba=vec4(vec3(fbm(pos+fbm(pos+fbm(pos)))),1.0);
				// gl_FragColor.rgba=vec4(vec3(nn),1.0);

			}
			`
		};
		YRShader.Noise = {

			uniforms: {
				offsetX: -0.5,
				offsetY: 0.0,
				u_color: [195, 0, 255],
				u_step: 1.0,
				u_time: 0.0,
			},

			vertexShader: [
				`
				#define GLSLIFY 1
				attribute vec2 aVertexPosition;
				attribute vec2 aTextureCoord;
				uniform mat3 projectionMatrix;
				varying vec2 vTextureCoord;

				void main(void)
				{
					gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
					vTextureCoord = aTextureCoord;
				}

				`
			].join("\n"),

			fragmentShader:
				`
			precision highp float;

			varying vec2 vTextureCoord;
			varying vec4 vColor;
			
			uniform sampler2D uSampler;
			uniform vec3 u_color;
			uniform float u_step;
			uniform float offsetX;
			uniform float offsetY;
			uniform float u_time;

			float rand(vec2 n) {
				//This is just a compounded expression to simulate a random number based on a seed given as n
				return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
			}
			float rand (float n) {
				return fract(sin(n)*1000000.);
			}

			float hash(float n) {
				return fract(sin(n) * 1e4);
			}
			
			float hash(vec2 p) { 
				return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
			}
			
			
			float noise(vec2 x) {
   				// const vec2 d = vec2(0.0, 1.0);
				// vec2 b = floor(n);
				// vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    			// return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
			
				vec2 i = floor(x);
				vec2 f = fract(x);

				// Four corners in 2D of a tile
				float a = hash(i);
				float b = hash(i + vec2(1.0, 0.0));
				float c = hash(i + vec2(0.0, 1.0));
				float d = hash(i + vec2(1.0, 1.0));

				// Simple 2D lerp using smoothstep envelope between the values.
				// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
				//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
				//			smoothstep(0.0, 1.0, f.y)));

				// Same code, with the clamps in smoothstep and common subexpressions
				// optimized away.
				vec2 u = f * f * (3.0 - 2.0 * f);
				return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;


			}

			float fbm(vec2 n) {
				//fbm stands for "Fractal Brownian Motion" https://en.wikipedia.org/wiki/Fractional_Brownian_motion
					float total = 0.0, amplitude = 0.5;
					for (int i = 0; i < 6; i++) {
					  total += noise(n) * amplitude;
					  n += n;
					  amplitude *= 0.5;
					}
					return total;
			}
			float fbm2(vec2 n)
			{
				float total = 0.0, amplitude = 0.5;
				for (int i = 0; i < 4; i++) {
					total += amplitude * abs(noise(n));
					n *= 2.;
					amplitude *= .5;
				  }
				  return total;

			}
			  
			void main(void)
			{
				vec2 uv = vTextureCoord;
				vec2 pos = vec2(2.0*uv.x+offsetX,4.0*uv.y+offsetY);
				vec4 texture2 =  texture2D(uSampler,uv);
				
				//rand雪花

				float nn=rand(uv);
				gl_FragColor = texture2 * (1.0-smoothstep(u_step, u_step, nn));

				// gl_FragColor=vec4(vec3(nn),1.);
				//一维noise
				// float i =floor(pos.x);
				// float f =floor(pos.x);
				// float y=mix(rand(i),rand(i+1.),smoothstep(0.,1.,f));
				// gl_FragColor = vec4(vec3(y),1.0);

				//二维noise
				// float nn = noise(pos);
				// gl_FragColor=vec4(vec3(nn),1.);
			}
			`
		};
		YRShader.Rect = {
			uniforms: {

			},

			vertexShader: [
				`
					attribute vec4 aVertexPosition;
					attribute vec4 aVertexColor;
					attribute vec2 aTextureCoord;
					uniform mat4 uModelViewMatrix;
					uniform mat4 uProjectionMatrix;
					varying lowp vec4 color;
					varying highp vec2 vTextureCoord;
					void main() {
						vTextureCoord=aTextureCoord;
						// gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
						gl_Position = aVertexPosition;
					}
				`
			].join("\n"),

			fragmentShader:
				`
				varying lowp vec4 color;
				varying highp vec2 vTextureCoord;
				uniform sampler2D uSampler;
				void main() {
					gl_FragColor = vec4(1.0);
					// gl_FragColor = texture2D(uSampler, vec2(vTextureCoord));
				}
		
			`
		}
		YRShader.DBlur = {
            uniforms: {
                texture: { type: 't', value: '' },
                centerpos: { value: new THREE.Vector2(0.5, 0.5) },
                GlowRange: { value: 50.0 },
            },
            vertexShader: [
                "precision highp float;",
                "precision highp int;",
                "attribute vec2 uv2;",
                "varying vec2 v_texCoord;",

                "void main() {",
                    "v_texCoord = uv;",
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join('\n'),
            fragmentShader: [
                `
                    precision highp float;
                    // precision highp int;
                    varying vec2 v_texCoord;
                    uniform float GlowRange;
                    uniform sampler2D texture;
                    uniform vec2 centerpos;
                    void main(void) {
                    vec4 clraverge=vec4(0.);
                    float range=GlowRange,count=0.,x1,y1;
                    vec2 cpos=centerpos;
                    for(float j=1.;j<100.;j+=1.0)
                    {
                        if(j>range)
                        {
                            break;
                        }
                        if(cpos.x - v_texCoord.x==0.)
                        {
                            x1=v_texCoord.x;
                            y1=v_texCoord.y+(cpos.y-v_texCoord.y)*j/(6.*range);
                        }
                        else
                        {
                            float k=(cpos.y-v_texCoord.y)/(cpos.x-v_texCoord.x);
                            x1=v_texCoord.x+(cpos.x-v_texCoord.x)*j/200.;
                            if((cpos.x-v_texCoord.x)*(cpos.x-x1)<0.) 
                            {
                                x1=cpos.x;
                            }
                            y1=cpos.y-cpos.x*k+k*x1;
                            if(x1<0.||y1<0.||x1>1.||y1>1.)
                            {
                             continue;
                            }
                        }
                        clraverge+=texture2D( texture, vec2(x1,y1) );
                        count+=1.;
                    }

                    clraverge/=count;
                    gl_FragColor =clraverge;
                    }
                `
            ].join('\n'),
		}
		YRShader.LightLineShader = {
            uniforms: {
                sampler0: { type: 't', value: ''},
                time: { value: 1.0 },
                speed: { value: 1.0 },
                fadeAway: { value: 0.5 },
                alpha: { value: 0.5 },
                color: { value: new THREE.Color(0x111111) },
                mouse: { value: new THREE.Vector2(0.5, 0.5) },
                resolution: { value: new THREE.Vector2(0.5, 0.5) },
                uniformity: { value: 10.0 }
            },
            vertexShader: [
                "precision highp float;",
                "precision highp int;",
                "uniform float time;",
                "attribute vec2 uv2;",
                "varying vec3 vPosition;",
                "varying vec3 vNormal;",
                "varying vec2 vUv;",
                "varying vec2 vUv2;",

                "void main() {",
					"vNormal = normal;",
					"vUv = uv;",
					"vUv2 = uv2;",
					"vPosition = position;",
                	"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join('\n'),
            fragmentShader: [
                `
                    precision highp float;
                    varying vec2 vUv;
                    uniform float time;
                    uniform float speed;
                    uniform float alpha;
                    uniform float fadeAway;
                    uniform vec3 color;
                    uniform vec2 mouse;
                    uniform vec2 resolution;
                    uniform float uniformity;
                    uniform sampler2D sampler0;
                    void main(void) {
                        float t = time * speed;

                        //将坐标映射到-1，1
                        vec2 position = (vUv.xy - resolution.xy ) / resolution.y;
                        //atan(y,x)返回[-PI,PI],atan(y/x)返回[-PI/2,PI/2]；angle为从(-1,0)为起点转一圈，值域（-0.5，0.5）
                        float angle = atan(position.y, position.x) / (2. * 3.14159265359);
                        //从(-0.5,0.5)变成(0.5,-0.5)
                        angle -= floor(angle);
                        float rad = length(position);

                        //将角度变为0-360
                        float angleRnd = floor(angle * 256.)+1. ;
                        //随机角度
                        // float angleRnd1 = fract(angleRnd * fract(angleRnd * .7235) * 45.1);
                        //调整值看发散情况
                        float angleRnd1 =  fract(angleRnd * fract(angleRnd*0.7235) * 45.1) ;
                        float angleRnd2 = fract(angleRnd * fract(angleRnd*0.82657) * 13.724) ;
                        float t2 = t + angleRnd1 * uniformity;
                        float radDist = sqrt(angleRnd2);
                        //中心部分更明亮
                        float adist = radDist / rad * .5;
                        float dist = (t2 * .1 + adist);
                        dist = abs(fract(dist) - 0.1);

                        float outputColor = (1.0 / (dist)) * cos(0.7 * sin(t)) * adist / radDist / 30.0;
                        
                        // float outputColor=t2;
                        angle = fract(angle + .61);
                        // outputColor=dist;
                        gl_FragColor = vec4(outputColor * color, alpha);
                        // gl_FragColor=vec4(texture2D(sampler0,vUv).rgba* outputColor);
                        // if(radDist>0.6)
                        // {
                        //     gl_FragColor = vec4(vec3(1.0,0.,0.), alpha);
                        // }
                    }
                `
            ].join('\n'),
		}
		YRShader.ThreeBasic = {
            uniforms: {
                texture: { type: 't', value: '' },
                centerpos: { value: new THREE.Vector2(0.5, 0.5) },
                start_position: { value: new THREE.Vector2(0.5, 0.5) },
				GlowRange: { value: 50.0 },
				color:{value:new THREE.Vector3(1.0,0.0,0.0)},
				time:{value:0.},
				dis:{value:0.},
            },
            vertexShader: [
				`
					precision highp float;
					precision highp int;
					attribute vec2 uv2;
					varying vec2 v_texCoord;
					varying vec3 v_position;

					void main() {
						v_texCoord = uv;
						v_position=(position);
						gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
					}
				`
            ].join('\n'),
            fragmentShader: [
                `
                    precision highp float;
                    varying vec2 v_texCoord;
                    uniform sampler2D texture;
					uniform vec3 color;
					uniform float time;
					uniform float dis;
					uniform vec3 start_position;
					varying vec3 v_position;
                    void main(void) {
						if(distance(v_position,start_position)>30.)
						{
							// gl_FragColor = vec4(vec3(color.r*2.0,color.g*2.0,color.b*2.0),1.0);
							gl_FragColor = vec4(vec3(0.0,0.0,1.0),1.0);
						}
                    	else{
							// gl_FragColor = vec4(vec3(color),1.0);
							discard;
						}
                    }
                `
            ].join('\n'),
		}
		YRShader.ShineSide={
			uniforms: {
                texture: { type: 't', value: '' },
				color:{value:new THREE.Vector3(1.0,0.0,0.0)},
				time:{value:0.},
            },
            vertexShader: [
				`
					precision highp float;
					precision highp int;
					attribute vec2 uv2;
					varying vec2 vUv;
					varying vec3 v_position;

					void main() {
						vUv = uv;
						v_position=(position);
						gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
					}
				`
            ].join('\n'),
            fragmentShader: [
                `
                    precision highp float;
					varying vec2 v_texCoord;
					varying vec2 vUv;
					uniform float time;
					uniform sampler2D texture;
					uniform vec3 color;

					void main() {
						vec4 col = vec4(0);
						vec4 pixel = vec4(texture2D(texture, vUv));
						
						if(vUv.x>0.05&&vUv.x<0.95&&vUv.y>0.15&&vUv.y<0.85)
						{
							gl_FragColor = pixel;
						}
						else
						{
							vec3 rgb=pixel.rgb*color.xyz;
							gl_FragColor = vec4(rgb,pixel.a)*0.5*(sin(time)+1.);
							// gl_FragColor = pixel*0.5*(sin(time)+1.);
						}


						
					}
                `
            ].join('\n'),
		}
	}
}
new YRShader();

