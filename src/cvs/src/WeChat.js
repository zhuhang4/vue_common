export default class WeChat {
    constructor() {
        let wxCode = getQueryVariable('code');
        if (wxCode) {
            $.get("main.php?code=" + wxCode, function (data, status) {
                if (status == 'success') {
                    var obj = JSON.parse(data);
                    MyData.wx_openid = obj.openid;
                    MyData.wx_nickname = obj.nickname;
                    MyData.wx_sex = obj.sex;
                    MyData.wx_headimgurl = obj.headimgurl;
                    console.log(MyData.wx_openid, MyData.wx_nickname, MyData.wx_sex, MyData.wx_headimgurl);
                }
            });
        }
        function getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) { return pair[1]; }
            }
            return (false);
        }
        
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: '<?php echo $signPackage["appId"];?>',
            timestamp: '<?php echo $signPackage["timestamp"];?>',
            nonceStr: '<?php echo $signPackage["nonceStr"];?>',
            signature: '<?php echo $signPackage["signature"];?>',
            jsApiList: ['onMenuShareAppMessage'
                ,'onMenuShareTimeline'
    //            ,'startRecord'
    //            ,'stopRecord'
    //            ,'playVoice'
    //            ,'uploadVoice'
    //            ,'downloadVoice'
            ]
        });
        wx.ready(function () {
            
            wx.onMenuShareAppMessage({
                title: wx_title, // 分享标题
                desc: wx_des, // 分享描述
                link: wx_link, // 分享链接
                imgUrl: wx_suolue,
                type: 'link', // 分享类型,music、video或link，不填默认为link
                success: function () {
    
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareTimeline({
                title: wx_title, // 分享标题
                link: wx_link, // 分享链接
                imgUrl: wx_suolue, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
    
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败
            });
        });
    
    }
}