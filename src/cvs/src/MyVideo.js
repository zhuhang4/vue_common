export default class MyVideo{
    constructor()
    {
        this.orginW=0;
        this.orginH=0;
        this.myVideo = document.createElement('VIDEO');
        
        this.myVideo.setAttribute("width","1");
        this.myVideo.setAttribute("height","1");
        
        // this.myVideo.setAttribute("poster", "suolue.png");
        // this.myVideo.setAttribute("controls", "controls");
        // this.myVideo.setAttribute("src", "http://www.yixuanhudong.com/video/hf.mp4");
        // this.myVideo.setAttribute("preload", "auto");
        this.myVideo.setAttribute("x5-playsinline",'true');
        //ios not fullscreen
        this.myVideo.setAttribute("playsinline",null);
        this.myVideo.setAttribute("preload", "true");
        this.myVideo.setAttribute("webkit-playsinline", "true");
        //andorid not fullscreen
        this.myVideo.setAttribute("x5-video-player-type", "h5");
        //myVideo.setAttribute("x5-video-orientation", "portraint");
        //myVideo.setAttribute("x5-video-player-fullscreen", "true");
        // myVideo.setAttribute("x-webkit-airplay", "true");

        this.myVideo.style.opacity=1;
        this.myVideo.style.position='absolute';
        this.myVideo.style.zIndex=0;
        document.body.appendChild(this.myVideo);
        this.init();  
        // return this.myVideo;           
    }

    play(src)
    {
        console.log('当前播放:',src);
        this.myVideo.src=src;
        this.myVideo.play();
    }

    setTop(x,y,width,height,zIndex=999,mode='noboard')
    {
        this.myVideo.currentTime=0;
        let scaleW=window.innerWidth/width;
        let scaleH=window.innerHeight/height;
        let scale;
        (scaleW>scaleH)?scale=scaleW:scale=scaleH;
        if(mode=='noboard')
        {
            this.myVideo.width= width;
            this.myVideo.height= height;
            this.myVideo.style.width = width*scale+'px';
            this.myVideo.style.height = height*scale+'px';
            this.myVideo.style.top=(window.innerHeight-height*scale)/2+'px';
            this.myVideo.style.left=(window.innerWidth-width*scale)/2+'px';
        }
        else if(mode=='showAll') 
        {
            this.myVideo.style.width='100%'
            this.myVideo.style.height='100%'
            this.myVideo.style.left='0px';
            this.myVideo.style.top='0px';
        }
        else if (mode=='exactFit') 
        {
            this.myVideo.style.width='100%'
            this.myVideo.style.height='100%'
            this.myVideo.style.left='0px';
            this.myVideo.style.top='0px';
            this.myVideo.style.objectFit='fill';
        }     
        this.myVideo.style.display="absolute";
        this.myVideo.style.zIndex=zIndex;
    }
    init()
    {
        //用来读取原视频尺寸的，但目前逻辑要求在play()中写死视频宽高，所以没有
        this.myVideo.addEventListener('loadeddata', (e)=> {
            this.orginW = e.target.videoWidth;
            this.orginH = e.target.videoHeight;
        }, false)

        this.myVideo.addEventListener('pause',()=>
        {
            
        });
        this.myVideo.addEventListener('ended',()=>
        {
            
        });
        this.myVideo.addEventListener('timeupdate',()=>
        {
            // console.log(this.myVideo.currentTime);
        });
    }
}