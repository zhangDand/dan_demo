
/* ================页内代码===================*/

var $=function(selector){
  return document.querySelectorAll(selector);
};


/* --------------------------------slider相关 */

Slider= ns('Slider');
var slider = new Slider({
  //视口容器
  container: $('.slider')[0],
  images:[
    './img/banner1.jpg',
    './img/banner2.jpg',
    './img/banner3.jpg',
  ],
  urls:[
    'http://open.163.com/',
    'http://study.163.com/',
    'http://www.icourse163.org/'
  ],
  drag:true
});



//给游标添加点击跳转
var cursors =$('.m-cursor .cursor');
cursors=[].concat.apply([],cursors);

function clickCursor(cursor,index){
  cursor.addEventListener('click',function(){
    slider.nav(index);
  })
}

  for (var i = 0; i < cursors.length; i++) {
    cursors[i].addEventListener('click',function(){
    slider.nav(index);
  })}

// cursors.forEach(function(cursor,index){
//   cursor.addEventListener('click',function(){
//     slider.nav(index);
//   })
// })

//通过事件监听完成额外逻辑

slider.on('nav',function(ev){
  var pageIndex = ev.pageIndex;
  cursors.forEach(function(cursor,index){

    if(index===pageIndex){
      cursor.className = 'z-active';
    }else{
      cursor.className='';
    }
  })
})


slider.nav(0);
var intervalId=setInterval(slider.next.bind(slider),5000);

slider.slider.addEventListener('mouseover',function(event){
  clearInterval(intervalId);
});
slider.slider.addEventListener('mouseout',function(event){
  intervalId=setInterval(slider.next.bind(slider),5000);
});

/* ---------------------------------massge相关 */


(function(_){
  var message=$('.m-message')[0].parentNode;

  function checkMessage(){
    // 获取cookie对象
    cookie=_.getCookie();
    if(!(cookie['displayMessage']=='disable')) message.style.display='block';
  }

  function closeMessage(){

    message.style.display='none';
    document.cookie='displayMessage=disable';

  }

  $('.m-message .close')[0].addEventListener('click',closeMessage);
  message.style.display='none';
  checkMessage();
})(ns('util'));




/* --------------------------------login登陆框相关 */
// var getLogin=function(){

//   function getLogin(callb){
//     LoginBox=ns('Login');
//     loginBox=new LoginBox({
//       callback:callb
//     });
//     return loginBox;
//   }
//   return getLogin;
// };
function getLogin(callb){
    LoginBox=ns('Login');
    loginBox=new LoginBox({
      callback:callb
    });
    loginBox.showBox(false);
    console.log(loginBox);
    return loginBox;
  }

/*---------------------------------follow关注相关
 */
ns('follow')(getLogin);
//--------------------------------

/**
 * ---------------------------------------热点推送
 */


(function(){
  var container=$('.m-hot .hot')[0];

  var options={url:'https://study.163.com/webDev/hotcouresByCategory.htm',options:'',container:container};
  var Hot=ns('Hot');
  hot=new Hot(options);

  setInterval(hot.jump.bind(hot),5000);
})();

/**
 * ================================图片列表
 */
(function(){
  var Tab=ns('Tab');
  var ImgList=ns('ImgList');
  var Pager=ns('Pager');


  var tab=new Tab({typeList:[10,20]});
  var type=tab.currentType;

  var container=$('.m-courses .fix')[0];
  




  var pager=new Pager();
  var pagCallb=function(){
    var pageIndex=pager.pageIndex,
        type=tab.currentType;
        pager.totlePage=imgList.totlePage||8;
    return imgList.get.call(imgList,pageIndex,type);
  };
  pager.callback=pagCallb;
  var tabCallb=function(){
    var type=tab.currentType;
    return imgList.get.call(imgList,1,type);
  };
  tab.callback=tabCallb;

  var imgList=new ImgList({
    container:container,
    type:type,
    pageNo:1,psize:20,
  });  
})();

//=======================视频弹窗
(function(_){

  var video=_.$(0,'.u-video a')[0];
  var Vmodal=ns('Vmodal');

  function onclick(event){
    event.preventDefault();
    var opts={
      title:'请观看下面的视频',
      src:'http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4'
    };

    var vmodal=new Vmodal(opts);
    return false;
  }
  video.addEventListener('click',onclick);
})(ns('util'));
