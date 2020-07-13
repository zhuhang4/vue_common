/**
 * Created by Administrator on 2017/3/2 0002.
 */
//自定义事件构造函数
function EventTarget(){
    //事件处理程序数组集合
    this.handlers = {};
}
//自定义事件的原型对象
EventTarget.prototype = {
    //设置原型构造函数链
    constructor: EventTarget,
    //注册给定类型的事件处理程序，
    //type -> 自定义事件类型， handler -> 自定义事件回调函数
    addEvent: function(type, handler){
        //判断事件处理数组是否有该类型事件
        if(typeof this.handlers[type] == 'undefined'){
            this.handlers[type] = [];
        }
        //将处理事件push到事件处理数组里面
        this.handlers[type].push(handler);
    },
    //触发一个事件
    //event -> 为一个js对象，属性中至少包含type属性，
    //因为类型是必须的，其次可以传一些处理函数需要的其他变量参数。（这也是为什么要传js对象的原因）
    fireEvent: function(event){
        //模拟真实事件的event
        if(!event.target){
            event.target = this;
        }
        //判断是否存在该事件类型
        if(this.handlers[event.type] instanceof Array){
            var handlers = this.handlers[event.type];
            //在同一个事件类型下的可能存在多种处理事件，找出本次需要处理的事件
            for(var i = 0; i < handlers.length; i++){
                //执行触发
                handlers[i](event);
            }
        }
    },
    //注销事件
    //type -> 自定义事件类型， handler -> 自定义事件回调函数
    removeEvent: function(type, handler){
        //判断是否存在该事件类型
        if(this.handlers[type] instanceof Array){
            var handlers = this.handlers[type];
            //在同一个事件类型下的可能存在多种处理事件
            for(var i = 0; i < handlers.length; i++){
                //找出本次需要处理的事件下标
                if(handlers[i] == handler){
                    break;
                }
            }
            //从事件处理数组里面删除
            handlers.splice(i, 1);
        }
    }
};