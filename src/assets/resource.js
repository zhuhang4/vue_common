//本地所有资源统一放置在assets文件下
let arr_imgs = [
  "images/1.jpg",
  "images/2.jpg",
  "images/3.jpg",
  "images/4.jpg",
  "images/1_0.jpg",
  "images/2_0.jpg",
  "images/2_1.jpg",
  "images/2_2.jpg",
  "images/2_3.jpg",
  "images/2_4.jpg",
  "images/2_5.jpg",
  "images/2_6.jpg",
  "images/2_7.jpg",
  "images/2_8.jpg",
  "images/2_9.jpg",
  "images/2_10.jpg",
  "images/2_11.jpg",
  "images/2_12.jpg",
  "images/tt.png",
  
  "sounds/music_bg.mp3",
  // "videos/video_sprite.mp4",
  // "images/4.jpg",
]
const IMAGE_URLS = {};

async function importAll() { 
  console.log('--------------------开始import资源--------------------');
  let arr=arr_imgs; 
  let len = arr.length;

  for (let i = 0; i < len; i++) {
    //去除路径的图片名（1.jpg）
    //  let file_allname=element.match(/[^\/\\]+\.\w+$/)[0];
    //后缀名
    let suffix = arr[i].match(/\.\w+$/)[0];
    //带路径，不带后缀,且斜杠替换成_
    let name = arr[i].replace(/\.\w+$/, '').replace(/\/|\\/, "_")
    try{
      await import(`@assets/${arr[i]}`).then(result => {
        if(!IMAGE_URLS.hasOwnProperty(name))
        {
          IMAGE_URLS[name] = result.default;
        }
        else
        {
          throw new Error('发现重名图片')
          
        }
      })
    }
    catch(error)
    {
      console.error('发现错误:',error);
      break;
    }
    if(i==len-1)
    {
      console.log('--------------------资源import结束--------------------')
    }
    
  }
}

export {importAll,IMAGE_URLS};
export const MEDIA_URLS = {
  // videoSprite,
  // audioSprite,
  // backgroundAudio
}
export const LOCATIONS = [{
  name: 'namibia',
  coord: [-19.2, 14.11666667], // 19° 12' S, 13° 67' E
  position: [4.6, -1.29, -2.42],
  cameraFarPosition: [-20.03, 13.47, -14.61],
  cameraNearPosition: [-3.54, 2.38, -2.58],
  imageName: 'iNambia',
  coordSpriteIndex: 4,
  videoSprite: [10.80, 19.10],
  soundSprite: [0, 10.057142857142857]
}, {
  name: 'mariana',
  coord: [18.25, 142.81666667], // 17° 75' N, 142° 49' E
  position: [-4.390, 2.660, -2.410],
  cameraFarPosition: [26.46, -6.94, -9.96],
  cameraNearPosition: [4.52, -1.30, -1.63],
  imageName: 'iMariana',
  coordSpriteIndex: 3,
  videoSprite: [2.80, 8.40],
  soundSprite: [24, 34.10938775510204]
}, {
  name: 'greenland',
  coord: [72.16666667, -43], // 71° 70' N, 42° 60' W
  position: [1.880, 5.09, 0.89],
  cameraFarPosition: [7.24, 26.52, 7.06],
  cameraNearPosition: [1.30, 4.66, 1.24],
  imageName: 'iGreenland',
  coordSpriteIndex: 2,
  videoSprite: [40.20, 47.80],
  soundSprite: [48, 58.10938775510204]
}, {
  name: 'galapagos',
  coord: [1.33333333, -91.15], // 01° 20' N, 90° 69' W
  position: [0.550, 0.024, 5.39],
  cameraFarPosition: [-0.60, 0.14, 28.21],
  cameraNearPosition: [-0.10, 0.024, 4.99],
  imageName: 'iGalapagos',
  coordSpriteIndex: 1,
  videoSprite: [22.00, 37.43],
  soundSprite: [12, 22.057142857142857]
}, {
  name: 'antarctica',
  coord: [-77.96666667, -155.63333333], // 77° 58' S, 155° 38' W
  position: [-1.32, -5.05, 0.98],
  cameraFarPosition: [-7.88, -27.00, 1.87],
  cameraNearPosition: [-1.39, -4.75, 0.33],
  imageName: 'iAntarcica',
  coordSpriteIndex: 0,
  videoSprite: [50.90, 69.00],
  soundSprite: [36, 46.05714285714286]
}]
