import * as YR from './YR.js';
import MyData from '@/MyData.js';
export class Scroller {
    constructor(target, pageWidth, pageHeight, pageDir, _name, _arrPage) {
        let sc = { pageIndex: 0, pageMax: _arrPage.length - 1 };
        sc.target = target;
        sc.name = _name;
        sc.arrPage = _arrPage;
        sc.dir = pageDir;
        let bool_down;
        let mouseDownPT = { x: 0, y: 0 };
        let targetStartPT = { x: 0, y: 0 };
        let threhold = 100;
        sc.loop = true;
        sc.moveSpeed = 2

        target.interactive = true;
        target.on('pointerdown', downHandler);
        target.on('pointerup', upHandler);
        target.on('pointerout', upHandler);
        target.on('pointermove', moveHandler);
        YR.Mediator.getInstance().add('Scroller' + target.name.toString() + 'Out', doUp);
        sc.dispose = function () {
            target.off('pointerdown', downHandler);
            target.off('pointerup', upHandler);
            target.off('pointerout', upHandler);
            target.off('pointermove', moveHandler);
            YR.Mediator.getInstance().remove('Scroller' + target.name.toString() + 'Out', doUp)
            sc = null;
        }
        sc.interact = function (bool) {
            sc.target.interactive = bool;
        }
        sc.scrollToPage = function (pageIdx) {
            sc.pageIndex = pageIdx;
            if (sc.dir == 'hor') {
                target.x = -sc.pageIndex * pageWidth;
            }
            else {
                target.y = -sc.pageIndex * pageHeight;
            }

        }

        sc.scrollToPosition = function (x, y) {

        }
        sc.moveLeft = function () {
            target.interactive = false;
            YR.Mediator.getInstance().fire(sc.name + "_ScrollStart", { idx: sc.pageIndex });
            TweenMax.to(target, 0.7, {
                x: -pageWidth * (sc.pageIndex + 1), ease: Back.easeOut, onComplete: () => {
                    if (sc.pageIndex == sc.pageMax - 1) {
                        if (sc.loop) {
                            sc.scrollToPage(1);
                        }
                        else {
                            back();
                        }
                    }
                    else {
                        sc.pageIndex++;
                    }
                    target.interactive = true;
                    YR.Mediator.getInstance().fire(sc.name + "_ScrollComplete", { idx: sc.pageIndex });
                }
            });
        }
        sc.moveRight = function () {
            target.interactive = false;
            YR.Mediator.getInstance().fire(sc.name + "_ScrollStart", { idx: sc.pageIndex });
            TweenMax.to(target, 0.7, {
                x: -pageWidth * (sc.pageIndex - 1), ease: Back.easeOut, onComplete: () => {
                    if (sc.pageIndex == 1) {
                        if (sc.loop) {
                            sc.scrollToPage(sc.pageMax - 1);
                        }
                        else {
                            back();
                        }
                    }
                    else {
                        sc.pageIndex--;
                    }

                    target.interactive = true;
                    YR.Mediator.getInstance().fire(sc.name + "_ScrollComplete", { idx: sc.pageIndex });
                }
            });
            // 传播渠道是
        }
        sc.refresh = function (_arrPage) {
            sc.pageIndex = 1;
            sc.pageMax = _arrPage.length - 1;
            sc.arrPage = _arrPage;
            sc.scrollToPage(1);
        }
        function downHandler(e) {
            Scroller.downname = e.target.name;
            bool_down = true;
            if (MyData.isHor) {
                mouseDownPT.x = e.data.global.x;
                mouseDownPT.y = e.data.global.y;
            }
            else {
                mouseDownPT.x = e.data.global.y;
                mouseDownPT.y = e.data.global.x;
            }

            targetStartPT.x = target.x;
            targetStartPT.y = target.y;
        }
        function upHandler(e) {
            // console.log('upHandler!!',e.target);
            if (!bool_down) {
                return;
            }
            console.log('upHandler!!', e.target.name);
            if (Scroller.downname != e.target.name) {
                YR.Mediator.getInstance().fire('Scroller' + Scroller.downname.toString() + 'Out');
            }
            doUp();
        }
        function doUp() {
            bool_down = false;
            if (pageDir == 'ver') {
                if (target.y < -sc.pageIndex * pageHeight - threhold) {
                    if (sc.pageIndex != sc.pageMax) {
                        target.interactive = false;
                        YR.Mediator.getInstance().fire(sc.name + "_ScrollStart", { idx: sc.pageIndex });
                        TweenMax.to(target, 0.7, {
                            y: -pageHeight * (sc.pageIndex + 1), ease: Back.easeOut, onComplete: function () {
                                console.log('complete!', target.y);
                                sc.pageIndex++;
                                target.interactive = true;
                                YR.Mediator.getInstance().fire(sc.name + "_ScrollComplete", { idx: sc.pageIndex });
                            }
                        });
                    }
                    else {
                        back();
                    }

                }
                else if (target.y > -sc.pageIndex * pageHeight + threhold) {
                    if (sc.pageIndex != 0) {
                        target.interactive = false;
                        YR.Mediator.getInstance().fire(sc.name + "_ScrollStart", { idx: sc.pageIndex });
                        TweenMax.to(target, 0.7, {
                            y: -pageHeight * (sc.pageIndex - 1), ease: Back.easeOut, onComplete: function () {
                                sc.pageIndex--;
                                target.interactive = true;
                                YR.Mediator.getInstance().fire(sc.name + "_ScrollComplete", { idx: sc.pageIndex });
                            }
                        });
                    }
                    else {
                        back();
                    }
                }

                else {
                    back();
                }
            }
            else if (pageDir == 'hor') {

                if (target.x < -sc.pageIndex * pageWidth - threhold) {
                    if (sc.pageIndex < sc.pageMax) {
                        target.interactive = false;
                        YR.Mediator.getInstance().fire(sc.name + "_ScrollStart", { idx: sc.pageIndex });
                        TweenMax.to(target, 0.7, {
                            x: -pageWidth * (sc.pageIndex + 1), ease: Back.easeOut, onComplete: () => {
                                if (sc.pageIndex == sc.pageMax - 1) {
                                    if (sc.loop) {
                                        sc.scrollToPage(1);
                                    }
                                    else {
                                        back();
                                    }
                                }
                                else {
                                    sc.pageIndex++;
                                }
                                target.interactive = true;
                                YR.Mediator.getInstance().fire(sc.name + "_ScrollComplete", { idx: sc.pageIndex });
                            }
                        });
                    }
                    // else {
                    // back();
                    // }

                }
                else if (target.x > -sc.pageIndex * pageWidth + threhold) {
                    if (sc.pageIndex > 0) {
                        target.interactive = false;
                        YR.Mediator.getInstance().fire(sc.name + "_ScrollStart", { idx: sc.pageIndex });
                        TweenMax.to(target, 0.7, {
                            x: -pageWidth * (sc.pageIndex - 1), ease: Back.easeOut, onComplete: () => {
                                if (sc.pageIndex == 1) {
                                    if (sc.loop) {
                                        sc.scrollToPage(sc.pageMax - 1);
                                    }
                                    else {
                                        back();
                                    }
                                }
                                else {
                                    sc.pageIndex--;
                                }

                                target.interactive = true;
                                YR.Mediator.getInstance().fire(sc.name + "_ScrollComplete", { idx: sc.pageIndex });
                            }
                        });
                    }
                    else {
                        back();
                    }
                }

                else {
                    back();
                }
            }
        }
        function moveHandler(e) {
            if (bool_down) {
                if (pageDir == 'ver') {
                    var mouseY = e.data.global.y;
                    if (sc.pageIndex == 0 && mouseY > mouseDownPT.y) {
                        target.y = targetStartPT.y + (mouseY - mouseDownPT.y) / 4;
                    }
                    else if (sc.pageIndex == sc.pageMax && mouseY < mouseDownPT.y) {
                        target.y = targetStartPT.y + (mouseY - mouseDownPT.y) / 4;
                    }
                    else {
                        target.y = targetStartPT.y + (mouseY - mouseDownPT.y) * sc.moveSpeed;
                    }
                }
                else if (pageDir == 'hor') {
                    // console.log("target.x:",target.x);
                    // var mouseX = e.data.global.x;
                    // if (sc.pageIndex == 0 && mouseX > mouseDownPT.x) {
                    //     target.x = targetStartPT.x + (mouseX - mouseDownPT.x) / 4;
                    // }
                    // else if (sc.pageIndex == sc.pageMax && mouseX < mouseDownPT.x) {
                    //     target.x = targetStartPT.x + (mouseX - mouseDownPT.x) / 4;
                    // }
                    // else {
                    //     target.x = targetStartPT.x + (mouseX - mouseDownPT.x);
                    // }
                    var mouseX;
                    if (!MyData.isHor) {
                        mouseX = e.data.global.y;
                    }
                    else {
                        mouseX = e.data.global.x;
                    }
                    if (sc.pageIndex == 0 && mouseX > mouseDownPT.x) {
                        target.x = targetStartPT.x + (mouseX - mouseDownPT.x) / 4;
                    }
                    else if (sc.pageIndex == sc.pageMax && mouseX < mouseDownPT.x) {
                        target.x = targetStartPT.x + (mouseX - mouseDownPT.x) / 4;
                    }
                    else {
                        target.x = targetStartPT.x + (mouseX - mouseDownPT.x) * sc.moveSpeed;
                    }
                }
            }
        }
        function back() {
            if (pageDir == 'ver') {
                var time = 1 * Math.abs(target.y - (sc.pageIndex * -pageHeight)) / 400;
                TweenMax.to(target, time, {
                    y: sc.pageIndex * -pageHeight, ease: Back.easeOut, onComplete: function () {
                        target.interactive = true;
                    }
                });
            }
            else if (pageDir == 'hor') {
                var time = 1 * Math.abs(target.x - (sc.pageIndex * -pageWidth)) / 400;
                console.log('back::', time, sc.pageIndex, pageWidth)
                TweenMax.to(target, time, {
                    x: sc.pageIndex * -pageWidth, ease: Back.easeOut, onComplete: function () {
                        target.interactive = true;
                    }
                });
            }
        }
        return sc;
    }
}
export class ScrollLong {
    constructor(target, _dir, _w = 844, _h = 1496, _mask = null) {
        let sc = {};
        let lastPT = { x: 0, y: 0 };
        let dir = _dir;
        let bool_down;
        let delta = 0;
        let _width = 0;
        let _height = 0;

        target.interactive = true;
        target.on('pointerdown', downHandler);
        target.on('pointerup', upHandler);
        target.on('pointermove', moveHandler);

        if (_mask) {
            target.mask = _mask;
            _mask.x = target.x;
            _mask.y = target.y;
            _width = target.mask.width;
            _height = target.mask.height;

        }
        else {
            _width = _w;
            _height = _h;
        }

        function downHandler(e) {
            TweenMax.killTweensOf(target);
            bool_down = true;
            if (dir == 'hor') {
                lastPT.x = e.data.global.x;
                delta = 0;
            }
            else {
                lastPT.y = e.data.global.y;
                delta = 0;
            }
        }
        function moveHandler(e) {
            if (bool_down) {
                if (dir == 'hor') {
                    delta = e.data.global.x - lastPT.x;
                    target.x += (e.data.global.x - lastPT.x);
                    lastPT.x = e.data.global.x;

                    if (target.x > 0) {
                        target.x = 0;
                    }
                    else if (target.x < -target.width + _width) {
                        target.x = -target.width + _width;
                    }
                }
                else {
                    delta = e.data.global.y - lastPT.y;
                    target.y += (e.data.global.y - lastPT.y);
                    lastPT.y = e.data.global.y;

                    if (target.y > 0) {
                        target.y = 0;
                    }
                    else if (target.y < -target.height + _height) {
                        target.y = -target.height + _height;
                    }
                }
            }
        }
        function upHandler(e) {
            if (bool_down) {
                bool_down = false;
                if (dir == 'hor') {
                    TweenMax.killTweensOf(target);
                    TweenMax.to(target, 0.1, {
                        x: target.x + delta * 10, onUpdate: function () {
                            if (target.x > 0) {
                                target.x = 0;
                            }
                            else if (target.x < -target.width + _width) {
                                target.x = -target.width + _width;
                            }
                        }
                    });
                }
                else {
                    TweenMax.killTweensOf(target);
                    TweenMax.to(target, 0.3, {
                        y: target.y + delta * 10, onUpdate: function () {
                            if (target.y > 0) {
                                target.y = 0;
                            }
                            else if (target.y < -target.height + _height) {
                                target.y = -target.height + _height;
                            }
                        }
                    });
                }
            }
        }
        return sc;
    }
}
export class ScrollLoopH {
    constructor(arr, gap = 5) {

        this.gap = gap;
        if (arr.length < 3) {
            console.log('元素必须大于三个！')
            return;
        }
        this.target = new PIXI.Container();
        this.arr = arr;
        this.arr.forEach((e, i) => {
            this.target.addChild(e);
            e.x = i * (e.width + gap);
        });

        this.target.interactive = true;
        this.target.on('pointerdown', this.downHandler.bind(this));
        this.target.on('pointerup', this.upHandler.bind(this));
        this.target.on('pointermove', this.moveHandler.bind(this));


        this.downPT = { x: 0, y: 0 };
    }
    downHandler(e) {
        this.downPT.x = e.data.global.x;
        this.downPT.y = e.data.global.y;
        this.target.lastPT = {};
        this.target.lastPT.x = this.target.x;
        this.target.lastPT.y = this.target.y;

        this.arr.forEach((ele, i) => {
            ele.lastPT = {};
            ele.lastPT.x = ele.x;
            ele.lastPT.y = ele.y;
        });

    }
    upHandler(e) {

    }
    moveHandler(e) {
        let len = this.arr.length;
        let idx = -1;

        this.target.x = this.target.lastPT.x + (e.data.global.x - this.downPT.x);

        this.arr.forEach((ele, i) => {
            // console.log(ele.lastPT.x);




            // ele.x = ele.lastPT.x + (e.data.global.x - this.downPT.x);
            let pt = ele.toGlobal({ x: 0, y: 0 });
            if (i == 0) {
                console.log(pt);
            }
            if (pt.x < 0) {
                idx = i;
            }
        });
        console.log(idx);
        if (idx != -1) {
            this.arr[idx].x = this.arr[len - 1].x + this.arr[idx].width + this.gap;
            console.log(this.arr[idx].x);
            let p = this.arr.splice(idx, 1)[0];
            console.log(this.arr.length)
            this.arr.push(p);
            console.log(this.arr.length)
            p.lastPT.x = p.x;
            p.lastPT.y = p.y;
        }
    }
}
export class Easy {
    static CreateJSONGroup(_group, _parent) {
        var ob = {};
        for (var name in _group) {
            var sp = Easy.CreateJSONSprite(_group, name, 1);
            ob[name] = sp;
            if (_parent) {
                _parent.addChild(sp);
            }
        }
        return ob;
    }

    static CreateJSONSprite(jsonGroup, name, _alpha) {
        var url = jsonGroup[name].url;
        var _x = jsonGroup[name].x;
        var _y = jsonGroup[name].y;
        // console.log(url)
        var sp = new PIXI.Sprite(MyData.resource[url].texture);
        sp.orginX = sp.x = _x;
        sp.orginY = sp.y = _y;
        sp.anchor.set(0.5, 0.5);
        sp.alpha = _alpha;
        return sp;
    }
    static CreateSprite(url, _x, _y, ax, ay, _alpha, _resource = MyData.resource) {
        let sp;
        if (url == '') {
            sp = new PIXI.Sprite();
        }
        else {
            sp = new PIXI.Sprite(_resource[url].texture);

        }
        sp.x = _x;
        sp.y = _y;
        sp.orginX = sp.x;
        sp.orginY = sp.y;
        sp.anchor.set(ax, ay);
        sp.alpha = _alpha;

        return sp;
    }

    static CreateMC(start, length, zero, head, tail, x, y, width, height, anchorX, anchorY, _resource = MyData.resource) {
        let arr_texture = [];
        for (let i = start; i < length; i++) {
            // console.log(head + strAddZero(zero, i) + tail)
            let texture = _resource[head + strAddZero(zero, i) + tail].texture;
            arr_texture.push(texture);
        }
        let mc = new PIXI.extras.AnimatedSprite(arr_texture);
        mc.anchor.set(anchorX, anchorY);
        mc.width = width;
        mc.height = height;
        mc.x = x;
        mc.y = y;
        mc.orginX = x;
        mc.orginY = y;
        // mc.gotoAndPlay(1);
        return mc;
    }
    static CreateRect(_x = 50, _y = 50, _width = 100, _height = 100, color = 0xff0000, algin = 'center') {
        let gp = new PIXI.Graphics();
        gp.beginFill(color, 1);
        if (algin == 'left') {
            gp.drawRect(0, 0, _width, _height);
            gp.endFill();
            gp.x = _x;
            gp.y = _y;
            gp.orginX = _x;
            gp.orginY = _y;
        }
        else if (algin == 'center') {
            gp.drawRect(-_width / 2, -_height / 2, _width, _height);
            gp.endFill();
            gp.x = _x;
            gp.y = _y;
            gp.orginX = _x;
            gp.orginY = _y;
        }

        return gp;
    }
    static CreateCircle(_x = 0, _y = 0, radius = 50, color = 0xff0000) {
        let gp = new PIXI.Graphics();
        gp.beginFill(color, 1);
        gp.drawCircle(0, 0, radius);
        gp.endFill();
        gp.x = _x;
        gp.y = _y;
        gp.orginX = _x;
        gp.orginY = _y;
        return gp;
    }
    static CreateRoundRect(_x = 50, _y = 50, _width = 100, _height = 100, radius = 15, color = 0xff0000) {
        let gp = new PIXI.Graphics();
        gp.beginFill(color, 1);
        gp.drawRoundedRect(-_width / 2, -_height / 2, _width, _height, radius);
        gp.endFill();
        gp.x = _x;
        gp.y = _y;
        gp.orginX = _x;
        gp.orginY = _y;
        return gp;
    }
    static CreateRing(_x, _y, _r, _resource) {
        //使用方法
        /* let ring =YR.Easy.CreateRing(844/2,1496/2,150,MyData.resource);
        this.addChild(ring.ui);
        ring.update(100); */
        var ring = {};
        ring.ui = new PIXI.Container();
        let circleL = YR.Easy.CreateSprite('assets/images/circleR.png', _x, _y, 0.5, 0.5, 1, _resource);
        circleL.width = circleL.height = _r * 2;
        ring.ui.addChild(circleL);
        let maskL = new PIXI.Graphics();
        maskL.beginFill(0xffffff, 1);

        //因为边框关系，遮罩多点余量
        maskL.drawRect(0, 0, _r + 1, 2 * _r + 20);
        maskL.x = circleL.x - circleL.width / 2;
        maskL.y = circleL.y - circleL.height / 2 - maskL.height;
        ring.ui.addChild(maskL);
        circleL.mask = maskL;

        let circleR = YR.Easy.CreateSprite('assets/images/circleR.png', _x, _y, 0.5, 0.5, 1, _resource);
        circleR.width = circleR.height = _r * 2;
        ring.ui.addChild(circleR);
        let maskR = new PIXI.Graphics();
        maskR.beginFill(0xffff00, 1);
        //因为边框关系，遮罩多点余量
        maskR.drawRect(0, 0, _r + 10, 2 * _r + 20);
        maskR.x = circleR.x;
        maskR.y = circleR.y + circleR.height / 2;
        ring.ui.addChild(maskR);
        circleR.mask = maskR;

        ring.update = function (per) {
            if (per < 50) {
                maskL.y = circleL.y - circleL.height / 2 - maskL.height + per / 50 * maskL.height;
            }
            else {
                maskL.y = circleL.y - circleL.height / 2 - maskL.height + maskL.height;
                maskR.y = circleR.y + circleR.height / 2 - (per - 50) / 50 * +maskR.height;
            }
        }
        return ring;
    }
    //注意字体只有在addChild到舞台后，才会加载
    static CreateText(text, _x, _y, fontSize = 25, color = 0xff0000, _dropShadow = false, _align = 'center', _fontFamily = '') {
        console.log(_fontFamily);
        var style = {
            fontFamily: _fontFamily,
            fontSize: fontSize,
            fill: color,
            dropShadow: _dropShadow,
            dropShadowColor: '#ffffff',
            align: _align
        }
        let myText = new PIXI.Text(text, style);
        myText.x = _x;
        myText.y = _y;
        myText.orginX = myText.x;
        myText.orginY = myText.y;
        if (_align == 'center') {
            myText.anchor.set(0.5);
        }
        else if (_align == 'left') {
            myText.anchor.set(0.0, 0.0);
        }
        // this.text.style.leading = 10;
        // this.text.style.breakWords = true;
        // this.text.style.wordWrap = true;
        // this.text.style.wordWrapWidth = 590;
        // this.text.style.whiteSpace = "pre";
        return myText;
    }
    static CreateTargetRoundMask(target, round = 5, masked = true) {
        let m = {};
        m.maskui = Easy.CreateRoundRect(target.x, target.y, target.width, target.height, 15, 0x0);
        // m.target = target;
        if (masked) {
            target.mask = m.maskui;
        }
        m.refresh = () => {
            m.maskui.x = target.x;
            m.maskui.y = target.y;
            m.maskui.width = target.width;
            m.maskui.height = target.height;
            target.mask = m.maskui;
            console.log('更新mask:', m.maskui.x, m.maskui.y, m.maskui.width, m.maskui.height);
        }
        m.clearmask = () => {
            if (m.maskui.parent) {
                m.maskui.parent.removeChild(m.maskui);
            }
            target.mask = null;
        }
        return m;
    }

    static CreateMaskCircle(target, x, y, raduis) {
        var con = new PIXI.Container();
        var maskhead = new PIXI.Graphics();
        maskhead.beginFill(0xffffff, 1);
        maskhead.drawCircle(raduis, raduis, raduis);
        maskhead.x = x;
        maskhead.y = y;
        Easy.noboradResize(target, maskhead);
        con.addChild(target);
        con.addChild(maskhead);
        target.mask = maskhead;
        return con;

    }
    static CreateMaskRect(target, x, y, w, h, r = 0) {
        var con = new PIXI.Container();
        var maskhead = new PIXI.Graphics();
        maskhead.beginFill(0xffffff, 1);
        maskhead.drawRoundedRect(0, 0, w, h, r);
        maskhead.x = x;
        maskhead.y = y;
        Easy.noboradResize(target, maskhead);
        con.addChild(target);
        con.addChild(maskhead);
        target.mask = maskhead;
        return con;
    }

    static CreateMaskSprite(target, x, y, w, h) {
        var con = new PIXI.Container();
        var maskhead = Easy.CreateSprite('assets/images/headmask.png', x, y, 0, 0, 1);
        Easy.noboradResize(target, maskhead);
        con.addChild(target);
        con.addChild(maskhead);
        target.mask = maskhead;
        return con;
    }
    static CreateSimpleMaskCircle(target, r) {
        let _mask = new PIXI.Graphics();
        _mask.beginFill(0xffffff, 1);
        _mask.drawCircle(0, 0, target.width / 2);
        _mask.x = target.x;
        _mask.y = target.y;
        target.mask = _mask;
        return _mask;
    }
    static BType(target, handler) {
        target.interactive = true;
        target.on('pointerdown', (e) => {
            let _s = target.scale.x;
            target.scale.set(_s * 0.9);
            setTimeout(() => {
                handler(e);
                target.scale.set(_s);
            }, 100);
        });
    }
    static TMove(target, dir = 'left', _delay = 0, time = 0.7, _alpha = 0, _ease = Cubic.easeInOut) {

        if (dir == 'left') {
            target.x = target.orginX + 100;
        }
        else if (dir == 'right') {
            target.x = target.orginX - 100;
        }
        else if (dir == 'top') {
            target.y = target.orginY + 100;
        }
        else if (dir == 'down') {
            target.y = target.orginY - 100;
        }
        target.alpha = _alpha;
        TweenMax.to(target, time, { delay: _delay, x: target.orginX, y: target.orginY, alpha: 1, ease: _ease });
    }
    static TScale(target, _scale, _delay = 0, _alpha = 1, time = 0.7, _ease = Back.easeOut) {
        target.scale.set(_scale);
        TweenMax.to(target.scale, time, { delay: _delay, x: 1, y: 1, ease: _ease });
    }
    static TShine(target, time = 1, type = 'normal') {
        target.alpha = 1;
        if (type == 'normal') {
            TweenMax.to(target, time, { alpha: 0, repeatDelay: time / 2, yoyo: true, repeat: -1, ease: Linear.easeNone });
        }
        else {
            TweenMax.to(target, time, { alpha: 0, repeatDelay: 0, yoyo: true, repeat: -1, ease: Cubic.easeInOut });
        }
    }
    static TMask(target, time = 1, _delay = 0, type = 'circle', dir = 'l', _ease = Cubic.easeOut) {
        // let con=new PIXI.Container();
        let _mask;
        if (type == 'circle') {
            _mask = new PIXI.Graphics();
            _mask.beginFill(0xff0000, 1);
            _mask.drawCircle(0, 0, Math.max(target.width / 2, target.height / 2));
            target.parent.addChild(_mask);
            _mask.x = target.x;
            _mask.y = target.y
            target.mask = _mask;
            _mask.scale.set(0.0);
            TweenMax.to(_mask.scale, time, { delay: _delay, x: 1.2, y: 1.2, ease: _ease });
        }
        else if (type == 'rect') {
            _mask = new PIXI.Graphics();
            _mask.beginFill(0xff0000, 1);
            _mask.drawRect(-target.width / 2, -target.height / 2, target.width, target.height);
            target.parent.addChild(_mask);
            _mask.x = target.x;
            _mask.y = target.y
            target.mask = _mask;
            if (dir == 'l') {
                _mask.x = target.x - _mask.width;
            }
            else if (dir == 'r') {
                _mask.x = target.x + _mask.width;
            }
            else if (dir == 'u') {
                _mask.y = target.y - _mask.height;
            }
            else if (dir == 'd') {
                _mask.y = target.y + _mask.height;
            }
            TweenMax.to(_mask, time, { delay: _delay, x: target.x, y: target.y, ease: _ease });
        }

    }
    static Breath(target, time = 0.7, _scale = 0.95) {
        TweenMax.to(target.scale, time, { x: _scale, y: _scale, repeatDelay: 0, yoyo: true, repeat: -1, ease: Cubic.easeInOut });
    }
    static noboradResize(target, myWindow) {
        target.scale.x = (myWindow.height / target.height < myWindow.width / target.width) ? (myWindow.width / target.width) : (myWindow.height / target.height);
        target.scale.y = target.scale.x;
        target.x = myWindow.x + myWindow.width / 2;
        target.y = myWindow.y + myWindow.height / 2;
    }
    static fixSide(target, dir, gap) {
        if (dir == 't') {
            target.y = -MyData.offsetY + target.height / 2 + gap;
        }
        else if (dir == 'b') {
            target.y = MyData.stageH + MyData.offsetY - target.height / 2 - gap;
        }
        else if (dir == 'l') {
            target.x = target.width / 2 - MyData.offsetX + gap;
        }
        else if (dir == 'r') {
            target.x = MyData.stageW - target.width / 2 + MyData.offsetX - gap;
        }
    }
    static fixAngle(target, dir, gapH, gapV) {
        if (dir == 0) {
            target.x = target.width / 2 - MyData.offsetX + gapH;
            target.y = -MyData.offsetY + target.height / 2 + gapV;
        }
        else if (dir == 1) {
            target.x = MyData.stageW - target.width / 2 + MyData.offsetX - gapH;
            target.y = -MyData.offsetY + target.height / 2 + gapV;
        }
        else if (dir == 2) {
            target.x = target.width / 2 - MyData.offsetX + gapH;
            target.y = MyData.stageH + MyData.offsetY - target.height / 2 - gapV;
        }
        else if (dir == 3) {
            target.x = MyData.stageW - target.width / 2 + MyData.offsetX - gapH;
            target.y = MyData.stageH + MyData.offsetY - target.height / 2 - gapV;
        }
    }

    static CreateInput(placeholder = '请输入...', maxlength = 5, style = {}, _class = 'myinput') {

        let myinput = {};

        let t = document.createElement('textarea');
        t.setAttribute('type', 'text');
        t.setAttribute('class', _class);
        t.setAttribute('maxlength', maxlength);
        t.setAttribute('placeholder', placeholder);
        t.style.position = 'absolute';
        if (style.left) {
            t.style.left = MyData.stage.x + MyData.scale * style.left + 'px';
        }
        if (style.top) {
            t.style.top = MyData.stage.y + MyData.scale * style.top + 'px';
        }
        if (style.width) {
            t.style.width = MyData.scale * style.width + 'px';
        }
        if (style.height) {
            t.style.height = MyData.scale * style.height + 'px';
        }
        document.body.appendChild(t);

        myinput.domElement = t;
        myinput.show = function () {
            t.style.display = 'block';
            t.style.zIndex = 99999;
        }
        myinput.hide = function () {
            t.style.display = 'none';
            t.style.zIndex = 0;
        }

        return myinput;
    }
}
export class ImageSave {
    static inSight(bedraw, longPressHandler = null, info_style = {}) {
        this.prototype.renderTexture = PIXI.RenderTexture.create(MyData.stageW + 2 * MyData.offsetX, MyData.stageH + 2 * MyData.offsetY);
        MyData.render.render(bedraw, this.prototype.renderTexture, false, new PIXI.Matrix(1, 0, 0, 1, MyData.offsetX, MyData.offsetY));
        this.prototype.step2(info_style, longPressHandler);
    }
    static fixSize(bedraw, sizeInfo = null, longPressHandler = null, info_style = {}) {
        let defaultinfo = { w: MyData.stageW, h: MyData.stageH };
        Object.assign(defaultinfo, sizeInfo);
        this.prototype.renderTexture = PIXI.RenderTexture.create(defaultinfo.w, defaultinfo.h);
        MyData.render.render(bedraw, this.prototype.renderTexture);
        this.prototype.step2(info_style, longPressHandler);
    }
    step2(info_style, longPressHandler) {
        console.log(this.renderTexture);
        this.domimg = document.createElement('img');
        document.body.appendChild(this.domimg);
        this.domimg.style.display = 'block';
        this.domimg.src = MyData.render.extract.image(this.renderTexture, 'image/jpeg', 1).src;
        this.domimg.style.position = 'absolute';
        this.domimg.style.zIndex = 2999;
        this.domimg.style.left = '0px';
        this.domimg.style.top = '0px';
        this.domimg.style.width = '100%';
        this.domimg.style.height = '100%';
        this.domimg.style.opacity = 0;
        Object.assign(this.domimg.style, info_style);
        this.domimg.addEventListener('touchstart', () => {
            this.timeInter = setTimeout(() => {
                console.log('长按保存');
                if (longPressHandler) {
                    longPressHandler();
                }
                // tar.hitTag("长按");
                // _hmt.push(['_trackEvent', 'click', "长按"]);
            }, 2000);

        });
        this.domimg.addEventListener('touchend', () => {
            clearTimeout(this.timeInter);
        });
        this.domimg.addEventListener('touchmove', () => {
            clearTimeout(this.timeInter);
        });
    }
}
export class Mediator {
    constructor() {
        this.handleFunc = {}
    }
    static getInstance() {
        if (!Mediator.instance) {
            Mediator.instance = new Mediator();
        }
        return Mediator.instance;
    }

    add(type, func) {
        if (this.handleFunc[type]) {
            if (this.handleFunc[type].indexOf(func) === -1) {
                this.handleFunc[type].push(func);
            }
        } else {
            this.handleFunc[type] = [func];
        }

    };

    fire(type, e) {
        let target = this.handleFunc[type];
        if (target) {
            let count = target.length;
            for (var i = 0; i < count; i++) {
                target[i](e);
            }
        }
        else {
            console.log(type + '事件尚未加入监听');
        }

    };

    remove(type, func) {
        try {
            let target = this.handleFunc[type];
            let index = target.indexOf(func);
            if (index === -1) throw error;
            target.splice(index, 1);
        } catch (e) {
            console.error('别老想删除我有的东西！');
        }

    };

    once(type, func) {
        this.fire(type, func) ? this.remove(type, func) : null;
    }
}
export class MyParticle {
    constructor(json, texture, amount, scale = 0.4) {
        let page = {};
        json.maxParticles = amount;
        json.scale.minimumScaleMultiplier = scale;
        page.emitterContainer = new PIXI.ParticleContainer();
        page.emitterContainer.setProperties({
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            alpha: true
        });
        page.emitterContainer.y = 0;
        page.emitter = new PIXI.particles.Emitter(
            page.emitterContainer,
            [
                texture

                // new PIXI.Texture.fromImage('assets/images/star.png'),
                // new PIXI.Texture.fromImage('assets/images/pd1.png'),
            ],
            json
        );
        page.emitter.emit = true;
        return page;
    }
}
/*  怎么用
    YR.PPP.init(this.sprite); 
    YR.Mediator.getInstance().add('panstart', (e) => {
        console.log(e.detail.detalX);
        e.detail.target.x = e.detail.startX - e.detail.detalX
        e.detail.target.y = e.detail.startY - e.detail.detalY
    });
    YR.Mediator.getInstance().add('pinchmove', (e) => {
        // alert(e.detail.ev.scale);
        let sprite = e.detail.target;
        sprite.scale.x = Math.max(this.minScale, sprite.scale.x * e.detail.ev.scale)
        sprite.scale.y = Math.max(this.minScale, sprite.scale.y * e.detail.ev.scale)
        // ttt.text = this.minScale.toString();
        sprite.rotation = e.detail.ev.startAngle + e.detail.ev.deltaAngle;
    });
*/
export class PPP {
    static init(sprite) {
        sprite.interactive = true
        sprite.on('pointerdown', start);
        sprite.on('pointerup', end);
        sprite.on('pointerupoutside', end);
        // sprite.on('touchmove', move);
        sprite._pinch = null;
        let downPT = { x: 0, y: 0 };
        let startPT = { x: 0, y: 0 };
        function start(e) {
            // startX=
            downPT.x = e.data.global.x;
            downPT.y = e.data.global.y;
            startPT.x = sprite.x;
            startPT.y = sprite.y;
            sprite.on('pointermove', move);
        }

        function move(e) {
            let t = e.data.originalEvent.targetTouches;
            if (!t || t.length < 2) {
                if (t.length == 1) {
                    let _pan = {
                        detalX: downPT.x - e.data.global.x,
                        detalY: downPT.y - e.data.global.y,
                        startX: startPT.x,
                        startY: startPT.y,
                        target: sprite
                    }
                    YR.Mediator.getInstance().fire('panstart', { detail: _pan });
                    let dx = t[0].clientX;
                    let dy = t[0].clientY;
                }
                return
            }

            // console.log(e)
            let dx = t[0].clientX - t[1].clientX;
            let dy = t[0].clientY - t[1].clientY;
            // alert(dx,dy);
            let distance = Math.sqrt(dx * dx + dy * dy)
            // alert(sprite._pinch);
            if (!sprite._pinch) {
                sprite._pinch = {
                    startAngle: sprite.rotation,
                    angle: Math.atan2((t[0].clientY - t[1].clientY), (t[1].clientX - t[0].clientX)),
                    p: { distance: distance, date: new Date() },
                    pp: {}
                }
                YR.Mediator.getInstance().fire('pinchstart', { target: sprite });
                return
            }

            let center = {
                x: (t[0].clientX + t[1].clientX) / 2,
                y: (t[0].clientY + t[1].clientY) / 2
            }
            let angleNew = Math.atan2((t[0].clientY - t[1].clientY), (t[1].clientX - t[0].clientX));
            let now = new Date();
            let interval = now - sprite._pinch.p.date;
            if (interval < 12) {
                return
            }
            let event = {
                deltaAngle: sprite._pinch.angle - angleNew,
                startAngle: sprite._pinch.startAngle,
                scale: distance / sprite._pinch.p.distance,
                velocity: distance / interval,
                center: center,
                data: e.data
            }
            // e.target.emit('pinchmove', event)
            var ob = { target: sprite, ev: event };
            YR.Mediator.getInstance().fire('pinchmove', { detail: ob });
            sprite._pinch.pp = {
                distance: sprite._pinch.p.distance,
                date: sprite._pinch.p.date
            }
            sprite._pinch.p = {
                distance: distance,
                date: now
            }
        }

        // TODO: Inertia Mode
        function end(e) {
            if (sprite._pinch) {
                // sprite.emit('pinchend')
                YR.Mediator.getInstance().fire('pinchend', { target: sprite });
            }
            sprite._pinch = null
            sprite.removeListener('pointermove', move)
        }
    }
}

export class MyDB {
    static initFactroy(json_ske, json_tex, png_tex, resource = MyData.resource) {
        MyData.factory = dragonBones.PixiFactory.factory;
        MyData.factory.parseDragonBonesData(resource[json_ske].data);
        MyData.factory.parseTextureAtlasData(resource[json_tex].data, resource[png_tex].texture);
    }
    static createDisplay(armatureName, json_ske, animateName, speed = 1, resource = MyData.resource) {
        // this.armatureDisplay = MyData.factory.buildArmatureDisplay("Armature", resource['db' + aid.toString() + "_ske.json"].d ata.name);
        let armatureDisplay;
        armatureDisplay = MyData.factory.buildArmatureDisplay(armatureName, resource[json_ske].data.name);
        armatureDisplay.animation.play(animateName);
        armatureDisplay.animation.timeScale = speed;

        return armatureDisplay;
    }
}
export class ThreeEasy{
    static InitClick(dom,camera,objects,handler){
        dom.addEventListener('mousedown',downHandler);
        dom.addEventListener('touchstart',downHandler);

        dom.addEventListener('mouseup',upHandler);
        dom.addEventListener('touchend',upHandler);

        let mouseX;
        let mouseY;

        function downHandler(e)
        {
            mouseX=(e.clientX/window.innerWidth)*2-1;
            mouseY=-(e.clientY / window.innerHeight) * 2 + 1;
        }

        function upHandler(e)
        {
            let _mouseX=(e.clientX/window.innerWidth)*2-1;
            let _mouseY=-(e.clientY / window.innerHeight) * 2 + 1;
            if(Math.abs(_mouseX-mouseX)<5&&Math.abs(_mouseY-_mouseY)<5)
            {
                var vector = new THREE.Vector3(mouseX, mouseY,0.5).unproject(camera);
                var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
                var intersects = raycaster.intersectObjects(objects);
    
                if (intersects.length > 0) {
                    //选中第一个射线相交的物体
                    let intersected = intersects[0].object;
                    handler(intersected);
                    // console.log(intersected)
                }
            }

            
        }

    }
}
export class Utils {
    static deepClone(target) {
        let result;
        if(typeof target=='object')
        {
            if (Object.prototype.toString.call(target)=='[object Array]')
            {
                result=[];
                for(let i=0;i<target.length;i++)
                {
                    result.push(Utils.deepClone(target[i]));
                }
            }
            else if(target==null)
            {
                result=null;
            }
            else
            {
                result={};
                for(let i in target)
                {
                    result[i]=Utils.deepClone(target[i]);
                }
            }
            return result;

        }
        else
        {
            result=target;
            return result
        }
    }
}