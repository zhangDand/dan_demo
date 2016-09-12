if(!Element.prototype.addEventListener){
  Element.prototype.addEventListener=function(type,callback){
    this.attachEvent('on' + type,callback);
  }
}
if (!Function.prototype.bind){
    Function.prototype.bind=function(thisObj){
       var _func=this,_this=thisObj,
            _params=Array.prototype.slice.call(arguments,1);
        return function(){
            var _localParams=Array.prototype.slice.call(arguments);
            _params=_params.concat(_localParams);
            _func.apply(_this,_params);
        };
    };
};
if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function forEach( callback, thisArg ) {
    var T, k;
    if ( this == null ) {
      throw new TypeError( "this is null or not defined" );
    var O = Object(this);
    var len = O.length >>> 0; 
    if ( typeof callback !== "function" ) {
      throw new TypeError( callback + " is not a function" );
    }
    if ( arguments.length > 1 ) {
      T = thisArg;
    }
    k = 0;
    while( k < len ) {
      var kValue;
      if ( k in O ) {
        kValue = O[ k ];
        callback.call( T, kValue, k, O );
      }
      k++;
    }
    };
  }

};
if(!String.prototype.trim){
  String.prototype.trim = function(){
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
}

//命名空间
var ns=(function(){
  var cache={};
  /**
   * 命名空间创建模块
   * @Author   Zd
   * @DateTime 2016-09-03T15:17:06+0800
   * @param    {[type]} name 模块名
   * @param    {arry} deps 依赖列表
   * @param    {func} definition 模块的内建逻辑
   * @return   {func} 对应模块名的模块
   */
  function createModele(name,deps,definition){

    if(arguments.length===1) return cache[name];

    if([].map){deps=deps.map(function(depName){
      return ns(depName);
    })}else{
      var arr=[];
      for (var i = 0,len=deps.length; i < len; i++) {
        var a=ns(deps[i]);
        arr.push(a);
      }
      deps=arr;
    };

    cache[name] = definition.apply(null,deps)

    return cache[name];

  }
  return createModele;
})();




/**
 *命名空间模块注册
 *
 */

//注册md5模块
ns('md5',[],function(){
  var MD5 = function (string) {

    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }

    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }

    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }

    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

    return temp.toLowerCase();
  };
  return MD5;
});

//注册查询参数序列化函数
ns('util',[],function(){

  return {
    //在cookie中存储和加载退出时的滚动条信息
    log:function(a){console.log(a)},
    $:function(node,selector){
      node=node || document;
      return node.querySelectorAll(selector);
    },
    saveScrollPos:function(){
        var scrollPos;
        if (typeof window.pageYOffset != 'undefined') {
            scrollPos = window.pageYOffset;
        }
        else if (typeof document.compatMode != 'undefined' &&
            document.compatMode != 'BackCompat') {
            scrollPos = document.documentElement.scrollTop;
        }
        else if (typeof document.body != 'undefined') {
            scrollPos = document.body.scrollTop;
        }
        document.cookie="scrollTop="+scrollPos; //存储滚动条位置到cookies中
    },
    loadScrollpos:function(){
      if(document.cookie.match(/scrollTop=([^;]+)(;|$)/)!=null){
          var arr=document.cookie.match(/scrollTop=([^;]+)(;|$)/); //cookies中不为空，则读取滚动条位置
          document.documentElement.scrollTop=parseInt(arr[1]);
          document.body.scrollTop=parseInt(arr[1]);
      }
    },

      //对象拓展函数
      /**
       * 用一个新对象扩展已有对象
       * @Author   Zd
       * @DateTime 2016-08-31T15:48:32+0800
       * @param    {[type]} o1 [被扩展的对象]
       * @param    {[type]} o2 [新增键值对]
       * @return   {[type]} [description]
       */
      extend: function(o1,o2){
        for(var i in o2) if( o1[i] == undefined ){
          o1[i] = o2[i]
        }
      },
      /**
       * 给节点增加类名
       * @Author   Zd
       * @DateTime 2016-08-31T16:01:44+0800
       * @param    {node} node 要添加类名的节点
       * @param    {str} className 要添加的类名
       */
      addClass: function(node,className){
        var current =  node.className || "";
        if((" "+ current + " ").indexOf(" " + className + " ")===-1){
          node.className = current ? (current+" "+className) : className;
        }

      },
      delClass: function(node, className){
        var current = node.className || "";
        node.className = (" " + current + " ").replace(" "+className + " "," ").trim();
      },
      /**
       * 事件mix-in 发射器
       * @type {Object}
       */
      emitter:{
        //注册事件
        on: function(event,fn) {
          var handles =this._handles || (this._handles = {}),
              calls = handles[event] || (handles[event] = []);

              calls.push(fn);

              return this;
        },
        //解绑事件
        off: function(event,fn) {
          if(!event || !this._handles) this._handles ={};
          if(!this._handles) return;

          var handles = this._handles ,calls;

          if (calls = handles[event]) {
            if (!fn) {
              handles[evnet] = [];
              return this;
            }
            //找到对应listener 并移除
            for (var i=0,len = calls.length; i<len;i++){
              if(fn === calls[i]) {
                calls.splice(i,1);
                return this;
              }
            }
          }
        },

        //触发事件
        emit: function(event){
          var args = [].slice.call(arguments,1),
              handles= this._handles, calls;

          if (!handles || !(calls = handles[event])) return this;

          //触发所有对应名字的listeners
          for (var i=0, len = calls.length; i<len; i++){
            calls[i].apply(this,args)
          }
          return this;
        }

      },
      getCookie:function () {
         var cookie = {};
         var all = document.cookie;
         if (all === '')
             return cookie;
         var list = all.split('; ');
         for (var i = 0; i < list.length; i++) {
             var item = list[i];
             var p = item.indexOf('=');
              var name = item.substring(0, p);
              name = decodeURIComponent(name);
              var value = item.substring(p + 1);
              value = decodeURIComponent(value);
              cookie[name] = value;
          }
          return cookie;
      },
      //将html转换为节点
      html2node:function(str){
        var container =document.createElement('div');
        container.innerHTML=str;
        return container.children[0];
      },
      //查询参数序列化
      serialize:function (data){
        if(!data) return '';
        var pairs=[];
        for(var name in data){
          if(!data.hasOwnProperty(name)) continue;
          if(typeof data[name] === 'function') continue;
          var value = data[name].toString();
          // name = encodeURIComponent(name);
          // value = encodeURIComponent(value);
          pairs.push(name + '=' + value) ;
        }
        return pairs.join('&');
      },
      md5:(function(){
        var MD5 = function (string) {

          function RotateLeft(lValue, iShiftBits) {
              return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
          }

          function AddUnsigned(lX,lY) {
              var lX4,lY4,lX8,lY8,lResult;
              lX8 = (lX & 0x80000000);
              lY8 = (lY & 0x80000000);
              lX4 = (lX & 0x40000000);
              lY4 = (lY & 0x40000000);
              lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
              if (lX4 & lY4) {
                  return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
              }
              if (lX4 | lY4) {
                  if (lResult & 0x40000000) {
                      return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                  } else {
                      return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                  }
              } else {
                  return (lResult ^ lX8 ^ lY8);
              }
          }

          function F(x,y,z) { return (x & y) | ((~x) & z); }
          function G(x,y,z) { return (x & z) | (y & (~z)); }
          function H(x,y,z) { return (x ^ y ^ z); }
          function I(x,y,z) { return (y ^ (x | (~z))); }

          function FF(a,b,c,d,x,s,ac) {
              a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
              return AddUnsigned(RotateLeft(a, s), b);
          };

          function GG(a,b,c,d,x,s,ac) {
              a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
              return AddUnsigned(RotateLeft(a, s), b);
          };

          function HH(a,b,c,d,x,s,ac) {
              a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
              return AddUnsigned(RotateLeft(a, s), b);
          };

          function II(a,b,c,d,x,s,ac) {
              a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
              return AddUnsigned(RotateLeft(a, s), b);
          };

          function ConvertToWordArray(string) {
              var lWordCount;
              var lMessageLength = string.length;
              var lNumberOfWords_temp1=lMessageLength + 8;
              var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
              var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
              var lWordArray=Array(lNumberOfWords-1);
              var lBytePosition = 0;
              var lByteCount = 0;
              while ( lByteCount < lMessageLength ) {
                  lWordCount = (lByteCount-(lByteCount % 4))/4;
                  lBytePosition = (lByteCount % 4)*8;
                  lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                  lByteCount++;
              }
              lWordCount = (lByteCount-(lByteCount % 4))/4;
              lBytePosition = (lByteCount % 4)*8;
              lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
              lWordArray[lNumberOfWords-2] = lMessageLength<<3;
              lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
              return lWordArray;
          };

          function WordToHex(lValue) {
              var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
              for (lCount = 0;lCount<=3;lCount++) {
                  lByte = (lValue>>>(lCount*8)) & 255;
                  WordToHexValue_temp = "0" + lByte.toString(16);
                  WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
              }
              return WordToHexValue;
          };

          function Utf8Encode(string) {
              string = string.replace(/\r\n/g,"\n");
              var utftext = "";

              for (var n = 0; n < string.length; n++) {

                  var c = string.charCodeAt(n);

                  if (c < 128) {
                      utftext += String.fromCharCode(c);
                  }
                  else if((c > 127) && (c < 2048)) {
                      utftext += String.fromCharCode((c >> 6) | 192);
                      utftext += String.fromCharCode((c & 63) | 128);
                  }
                  else {
                      utftext += String.fromCharCode((c >> 12) | 224);
                      utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                      utftext += String.fromCharCode((c & 63) | 128);
                  }

              }

              return utftext;
          };

          var x=Array();
          var k,AA,BB,CC,DD,a,b,c,d;
          var S11=7, S12=12, S13=17, S14=22;
          var S21=5, S22=9 , S23=14, S24=20;
          var S31=4, S32=11, S33=16, S34=23;
          var S41=6, S42=10, S43=15, S44=21;

          string = Utf8Encode(string);

          x = ConvertToWordArray(string);

          a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

          for (k=0;k<x.length;k+=16) {
              AA=a; BB=b; CC=c; DD=d;
              a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
              d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
              c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
              b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
              a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
              d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
              c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
              b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
              a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
              d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
              c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
              b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
              a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
              d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
              c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
              b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
              a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
              d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
              c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
              b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
              a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
              d=GG(d,a,b,c,x[k+10],S22,0x2441453);
              c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
              b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
              a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
              d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
              c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
              b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
              a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
              d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
              c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
              b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
              a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
              d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
              c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
              b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
              a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
              d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
              c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
              b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
              a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
              d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
              c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
              b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
              a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
              d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
              c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
              b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
              a=II(a,b,c,d,x[k+0], S41,0xF4292244);
              d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
              c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
              b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
              a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
              d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
              c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
              b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
              a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
              d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
              c=II(c,d,a,b,x[k+6], S43,0xA3014314);
              b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
              a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
              d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
              c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
              b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
              a=AddUnsigned(a,AA);
              b=AddUnsigned(b,BB);
              c=AddUnsigned(c,CC);
              d=AddUnsigned(d,DD);
          }

          var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

          return temp.toLowerCase();
        }
        return MD5;
      })(),
      get:function(url,options,callback){

      var xhr=new XMLHttpRequest();

      function serialize (data){
            if(!data) return '';
            var pairs=[];
            for(var name in data){
              if(!data.hasOwnProperty(name)) continue;
              if(typeof data[name] === 'function') continue;
              var value = data[name].toString();
              // name = encodeURIComponent(name);
              // value = encodeURIComponent(value);
              pairs.push(name + '=' + value) ;
            }
            return pairs.join('&');
          }
      xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
          if((xhr.status>=200 && xhr.status<300) || xhr.status==304){
            var text=xhr.responseText;
            callback(text);
          }else{
            status='当前无法连接：'+xhr.status;
            console.log('err:'+status);
          }
        }
      }
      url=options?url + '?' +serialize(options) : url;
      xhr.open('get',url);
      xhr.send(null);

    },


  }
});

//Slider轮播图注册
ns('Slider',['util'],function(_){
  //将html转换为节点
  function html2node(str){
    var container =document.createElement('div');
    container.innerHTML=str;
    return container.children[0];
  }
  var template =
  '<div class="m-slider" >\
  <a><div class="slide">1</div></a>\
  <a><div class="slide">2</div></a>\
  <a><div class="slide">3</div></a>\
  </div>'

  function Slider(opt){;
    _.extend(this,opt);

    //容器节点以及样式设置
    this.container =this.container || document.body;
    this.container.style.overflow= 'hidden';

    //组件节点
    this.slider = this._layout.cloneNode(true);
    try{
      this.slides=[].slice.call(this.slider.querySelectorAll('.slide'));
    }catch(err){
      this.slides=[].concat.apply([],this.slider.querySelectorAll('.slide'));
    }
    console.log(this.slides)
    //拖曳相关
    this.offsetWidth=this.container.offsetWidth;
    this.breakPoint=this.offsetWidth/4;

    this.pageNum= this.images.length;

    //内部数据结构
    this.slideIndex=1;
    this.pageIndex=this.pageIndex || 0;
    this.offsetAll=this.pageIndex;

    //初始化动作
    this.container.appendChild(this.slider);
    //如果需要拖拽切换
    if(this.drag) this._initDrag();
  };


  //拓展原型
  _.extend(Slider.prototype,_.emitter);
  _.extend(Slider.prototype,{

    _layout:_.html2node(template),

    //直接跳转到指定页
    nav:function(pageIndex){

      this.pageIndex=pageIndex;
      this.slideIndex=typeof this.slideIndex === 'number'?this.slideIndex : (pageIndex+1)%3;
      this.offsetAll=pageIndex;

      this.slider.style.transitionDuration='0s';

      this._calcSlide();
    },
    //跳转下一页
    next: function(){
      this._step(1);
    },
    prev: function(){
      this._step(-1);
    },
    //单步移动
    _step:function(offset){
      this.offsetAll+=offset;
      this.pageIndex+=offset;
      this.slideIndex+=offset;
      this.slider.style.transitionDuration='.5s';

      this._calcSlide();
    },
    //计算Slide
    //每个slide的 left=(offsetAll+ offset(1,-1))*100%;
    //外层容器（.m-slider）的偏移=offsetAll* 宽度
    //
    _calcSlide:function(){

      var slideIndex = this.slideIndex=this._normIndex(this.slideIndex,3);
      var pageIndex=this.pageIndex=this._normIndex(this.pageIndex,this.pageNum);
      var offsetAll=this.offsetAll;
      var pageNum=this.pageNum;

      var preSlideIndex=this._normIndex(slideIndex -1,3);
      var nextSlideIndex=this._normIndex(slideIndex +1,3);

      var slides=this.slides;

      //三个slide的偏移
      slides[slideIndex].style.left=(offsetAll)*100+'%';
      slides[preSlideIndex].style.left=(offsetAll-1)*100+'%';
      slides[nextSlideIndex].style.left=(offsetAll+1)*100+'%';

      //容器偏移
      this.slider.style.transform='translateX(' + (-offsetAll * 100) + '%) translateZ(0)';

      //当前slide 添加 'z-active' 的className

      slides.forEach(function(node){_.delClass(node,'z-active')});
      _.addClass(slides[slideIndex],'z-active');

      this._onNav(this.pageIndex,this.slideIndex);
    },

    //标准化下标
    _normIndex : function(index,len){
      return(len+index)%len
    },

    //跳转时完成的逻辑，这里是设置图片的url
    _onNav: function(pageIndex,slideIndex){
      var slides=this.slides;

      for(var i = -1 ; i <= 1; i++){
        var index = (slideIndex +i+3)%3;
        var img=slides[index].querySelector('img');
        if(!img){
          img=document.createElement('img');
          a=document.createElement('a');
          a.appendChild(img);
          a.target='_blank';


          a.addEventListener('mousemove',function(ev){
            if(!this._dragInfo.start)return;
            console.log('a')
            this.ifdrag=111;
            return false;
          }.bind(this),true);
         a.addEventListener('mouseup',function(ev){
          console.log(this.ifdrag);
          if(this.ifdrag){ev.preventDefault();}
         });

          slides[index].appendChild(a);

        }
        // img.src='./imgs/pic0' + (this._normIndex(pageIndex + i,this.pageNum) + 1)+ '.jpg';
        img.src=this.images[this._normIndex(pageIndex + i,this.pageNum)];
        img.parentNode.href=this.urls[this._normIndex(pageIndex + i,this.pageNum)];

      }
      this.emit('nav',{
        pageIndex:pageIndex,
        slideIndex:slideIndex
      })
    },

    //拖动相关
    ////--------------
    _initDrag: function(){

      this._dragInfo={};
      this.slider.addEventListener('mousedown',this._dragstart.bind(this));
      this.slider.addEventListener('mousemove',this._dragmove.bind(this));
      this.slider.addEventListener('mouseup',this._dragend.bind(this));
      this.slider.addEventListener('mouseleave',this._dragend.bind(this));
    },

    _dragstart:function(ev){
      ev.preventDefault();
      var dragInfo=this._dragInfo;
      dragInfo.start={x:ev.pageX,y:ev.pageY};


    },
    _dragmove:function(ev){

      var dragInfo=this._dragInfo;
      //如果还没有开始拖拽则退出

      if(!dragInfo.start) return;

      ev.preventDefault();
      this.slider.style.transitionDuration='0s';

      var start=dragInfo.start;

      //清除恼人的选区
      if(window.getSelection()){
        window.getSelection().removeAllRanges();
      }else if(window.document.selection){
        window.document.selection.empty();
      }

      //添加translateZ触发硬件加速

      this.slider.style.transform='translateX(' + (-(this.offsetWidth*this.offsetAll-ev.pageX+start.x)) + 'px) translateZ(0)';
      //拖动flag
      this.ifdrag=1;
    },

    _dragend:function(ev){

      var dragInfo=this._dragInfo;

      if(!dragInfo.start) return;

      ev.preventDefault();
      var start=dragInfo.start;
      this._dragInfo={};
      var pageX=ev.pageX;

      //看走了多少距离
      var deltX=pageX-start.x;
      if(Math.abs(deltX)>this.breakPoint){
        this._step(deltX>0?-1:1);
      }else{
        this._step(0);
      }
    }
  });

  return Slider;
});

//Login登陆框注册
ns('Login',['util'],function(_){

  var template='\
  <div class="m-login">\
    <div class="fix"></div>\
    <div class="logbox">\
      <p class="title"></p>\
      <form name="login">\
        <input type="text" class="account" name="account" placeholder="账号" required="" pattern="^[a-zA-Z]{4,}">\
        <input type="password" class="password" name="password" placeholder="密码" >\
        <button name="button">登 录</button>\
        <div class="msg"></div>\
      </form>\
      <span class="close"></span>\
    </div>\
  </div>';

  function Login(opt){
    _.extend(this,opt);

    function $(par,selector){
      var node= par||document;
      return node.querySelectorAll(selector);
    }
    //获取控件节点
    this.login=this._layout.cloneNode(true),
    this.close=$(this.login,'.m-login .close')[0],
    this.loginForm=this.login.getElementsByTagName('form')[0],
    this.account=this.loginForm['account'],
    this.password=this.loginForm['password'],
    this.nmsg=$(this.login,'.m-login .msg')[0],
    this.btn=this.loginForm['button'],
    this.xhr = new XMLHttpRequest();

    this.url = this.url ||'https://study.163.com/webDev/login.htm';
    this.title=this.title || '登陆网易云课堂';
    //初始化
    this.login.style.display='none';
    $(this.login,'p')[0].innerText=this.title;
    this._listen();
    document.body.appendChild(this.login);
  }

  //拓展原型
  _.extend(Login.prototype,{

    _layout:_.html2node(template),

    showBox: function(bol){
      this.login.style.display=bol?'none':'block';
    },

    //表单验证显示方法
    _showMessage: function(className,msg){
        if(!className){
        this.nmsg.innerText='';
        _.delClass(this.nmsg,'nerr');
      }else{
        this.nmsg.innerText = msg;
        _.addClass(this.nmsg,className);
      }
    },
    disableSubmit: function(disabled){ //按钮提交处理
      this.btn.disabled = !!disabled;
      var method =!disabled?
      _.delClass(this.btn,'disable') :
      _.addClass(this.btn,'disable');
    },
    invalidInput: function(node,msg){ //设置验证提示信息
      this._showMessage('nerr',msg);
      _.addClass(node,'err');
      node.focus();
    },
    clearInvalid: function(node){ //清除提示信息
      this._showMessage();
      _.delClass(node,'err');
    },

    //AJAX GET请求
    _get: function(url,data){

      url=url+ '?' +_.serialize(data);
      this.xhr.open('get',url,true);
      this.xhr.send(null);
    },

    //设置登陆状态cookie值
    _setLogin: function(rsp){
      document.cookie='userName='+_.md5(this.account.value);
      document.cookie='loginSuc='+rsp;
    },
    //判断登陆状态执行回调
    loginSuc: function(){
      response=this.xhr.responseText;

      this.showBox(!!(response==1));
      if(response==1){
        this._setLogin('1');
        this.showBox(true);
        this.callback();
      }else{
        this._setLogin('0');
        this.showBox(false);
      }
    },
    //表单验证验证逻辑
    _accountValidate: function(event){
      event.preventDefault();
      invalidInput(this.account,'请输入正确格式的账号');
    },
    _onInput: function(event){
      this.clearInvalid(event.target);
      this.disableSubmit(false);
    },
    _onSubmit: function(event){
      var pswd = this.password.value,
          emsg = '',
          acnt =this.account.value;
      var data={
        userName:_.md5(acnt),
        password:_.md5(pswd)
      };
      // console.log('data='+data+'pswd='+pswd+'acnt='+acnt);
      console.log(data);
      if(pswd.length<6 || pswd.length>18){
        emsg='密码长度必须在6-18位之间';
      }else if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\.]{6,16}$/.test(pswd)){
        emsg='密码必须包含数字和字母';
      }
      //密码验证不通过
      if (!!emsg){
        this.invalidInput(password,emsg);
        event.preventDefault();
        return;
      }

      //禁用提交按钮
      this.disableSubmit(true);
      event.preventDefault();
      //通过后发起ajax请求
      this._get(this.url,data);
    },
    _stateChange: function(){
      if(this.xhr.readyState==4){
        if((this.xhr.status>=200 && this.xhr.status<300) || this.xhr.status==304){
          this.loginSuc();
        }else{
          status='当前无法连接：'+this.xhr.status;
          this._showMessage('lerr',status);
        }
      }
    },
    checkLogin:function(){ //返回存储的登陆状态；
      var cookie=_.getCookie();
      var loginSuc=cookie['loginSuc'];
      return !!loginSuc;
    },
    _remove:function(){
      this.login.parentNode.removeChild(this.login)
    },
    _listen: function(){
      this.account.addEventListener('invalid',this._accountValidate.bind(this));
      this.loginForm.addEventListener('input',this._onInput.bind(this));
      this.loginForm.addEventListener('submit',this._onSubmit.bind(this));
      // this.xhr.addEventListener('readystatechange',this._stateChange.bind(this));
      this.xhr.onreadystatechange=this._stateChange.bind(this)
      this.close.addEventListener('click',this._remove.bind(this))
    }
  });

  return Login;
})

//关注功能按钮关联
/**
 * 通过类名关联
 * .m-follow 父元素
 * .focus-off 关注按钮,未关注的UI
 * .focus-on  已关注UI
 * .cancel    取消关注按钮
 * 传入outer函数，在关注时判断是否登陆，若未登陆调用
 */
ns('follow',['util'],function(_){
  return function(outer){
    var $=function(selector){
      var a;
      try{
        a=[].slice.call(document.querySelectorAll(selector))
      }catch(err){
        a=[].concat.apply([],document.querySelectorAll(selector))
      };
      return a;
    };

    var focusOff=$('.m-follow .focus-off')[0];
    var focusOn=$('.m-follow .focus-on')[0];
    var cancel=$('.m-follow .cancel')[0];
    var onFocus=false;
    var resp='';
    function _focusSwitch(){
      var off=onFocus?'none':'inline-block',
          on=onFocus?'inline-block':'none';

      focusOff.style.display=off;
      focusOn.style.display=on;
      onFocus=!onFocus;

    };
    function _checkLogin(){ // 检查登陆情况
        var cookie=_.getCookie();
        _.log(cookie['loginSuc']);
        var loginSuc=cookie['loginSuc'];
        // return !!loginSuc;
        return loginSuc;
      }


    function _getFollow(){
      var url='http://study.163.com/webDev/attention.htm';
      _get(url,'',_checkResp);
    }
    function _checkResp(a){
      if(a==1){
        document.cookie='followSuc=1';
        onFocus=true;
        _focusSwitch();
      }
    }

    function _follow(){
      !_checkLogin()?outer(_follow):_getFollow();
    }

    function _get(url,data,callback){

      var xhr=new XMLHttpRequest(),msg='';
          url=!data?url:url+'?'+_.serialize(data);

      var _stateChange=function(){
            if(xhr.readyState==4){
                if((xhr.status>=200 && xhr.status<300) || xhr.status==304){
                  msg=xhr.responseText;
                  callback(msg);
                }else{
                  msg= '请求出错：'+ xhr.status;
                  callback(msg);
                }
              }
          };

      // xhr.addEventListener('readystatechange',_stateChange);
      this.xhr.onreadystatechange=_stateChange;
      xhr.open('get',url,true);
      xhr.send(null);
      return msg;
    }

    focusOff.addEventListener('click',_follow);
    cancel.addEventListener('click',_focusSwitch);
    if(_checkLogin()){
      _focusSwitch();
      _focusSwitch();
    }
  }
})

//热点推送轮播
ns('Hot',['util'],function(_){

  template='<li>\
            <a class="link" href="">\
              <img class="img" src="./img/hot.jpg" height="50px" width="50px">\
              <p class="caption"></p>\
            </a>\
            <p class="num clearfix clearfix"><span><i></i><span></span></span></p>\
          </li>';

  function Hot(opt){
  //opt需要传入container
  //           url
  //           options
    _.extend(this,opt);
    container=this.container;
    this.list=[];
    this.jumpNum=1;
    this.keyArr=['name','smallPhotoUrl','id','learnerCount']

    this._get(this.url,this.options,this._callback.bind(this));

  }

  _.extend(Hot.prototype,{

    _layout:_.html2node(template),

    jump:function (num,margin,len){

      num = num || 1;
      margin= margin || 21;
      len = this.list.length || 20;
      for(var i=0,len=this.list.length;i<len;i++){
      var l=this.list[i];
      var hei=l.offsetHeight;
      var flag=(i+this.jumpNum)%len-1;

      l.style.top=(l.offsetHeight+margin)*((i+this.jumpNum)%len-1)+'px';
      if(flag==-1){l.style.transitionDuration='0s';}
      if(flag==0){l.style.transitionDuration='.5s';}


    }
      this.jumpNum=(this.jumpNum+len+num)%len;


    },
    //请求数据并执行回调
    _get:function(url,options,callback){

      var xhr=new XMLHttpRequest();

      function serialize (data){
            if(!data) return '';
            var pairs=[];
            for(var name in data){
              if(!data.hasOwnProperty(name)) continue;
              if(typeof data[name] === 'function') continue;
              var value = data[name].toString();
              // name = encodeURIComponent(name);
              // value = encodeURIComponent(value);
              pairs.push(name + '=' + value) ;
            }
            return pairs.join('&');
          }
      xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
          if((xhr.status>=200 && xhr.status<300) || xhr.status==304){
            var text=xhr.responseText;
            callback(text);
          }else{
            status='当前无法连接：'+xhr.status;
            console.log('err:'+status);
          }
        }
      }
      url=options?url + '?' +serialize(options) : url;
      xhr.open('get',url);
      xhr.send(null);

    },
    //绑定返回的数据
    bindData:function(list,data){
      for(var i=0,len=list.length;i<len;i++){
        var l=list[i],d=data[i];

        var src=l.querySelector('.img'),
            link=l.querySelector('.link'),
            caption=l.querySelector('.caption'),
            num=l.querySelector('.num span>span');
        var host='http://study.163.com/course/introduction/';
        src.src=d['smallPhotoUrl'];
        link.href=host+d['id']+'.htm';
        link.title=d['name'];
        caption.innerText=d['name'];
        num.innerText=d['learnerCount'];
      }
    },
    dataParse:function(textArr,keyArr){
      var arr=[];
      function _getData(data,keyArr){
        var arr=[],obj={};
        for (var i = 0; i < keyArr.length; i++) {
          var key=keyArr[i];
          obj[key]=data[key];

        }
        return obj;
      }
      for (var i = 0; i < textArr.length; i++) {
        var obj;
        data=textArr[i];
        obj=_getData(data,keyArr);
        arr.push(obj);
      }
      return arr;
    },
    _callback:function(data){
      data=eval(data);
      data=this.dataParse(data,this.keyArr);


        _.log(data);


      for(var i=0,len=data.length;i<len;i++){
        var l=this._layout.cloneNode(true);
        this.list.push(l);
        container.appendChild(l);
      };

      this.bindData(this.list,data);

      this.jump();

    }
  })
  return Hot;
})

//tab切换器
ns('Tab',['util'],function(_){
    /**
     * 列表切换tab,存储tab信息，切换tabui
     * @Author   Zd
     * @DateTime 2016-09-09T11:00:55+0800
     * @param    {obj} opt 传入对象{typeList:[type,...type]},以输入tab需要存储的type信息
     */
    function Tab(opt){
      _.extend(this,opt);

      this.tabs=this.tabs||_.$(0,'.m-tab')[0].children;

      this.currentType=this.currentType || 0;
      this.typeList=this.typeList||[];

      this.tabs[0].parentNode.addEventListener('click',this._onclick.bind(this));


      //初始化
      this._init();
    }

    _.extend(Tab.prototype,{

      getType:function(){
        return this.currentType;
      },
      _init:function(){
        for(var i=0,len=this.typeList.length;i<len;i++){
          this.tabs[i].type=this.typeList[i];
        }
        this.currentType=this.typeList[0];
      },
      _onclick:function(event){

        for(var i=0,len=this.tabs.length;i<len;i++){
          _.delClass(this.tabs[i],'active');
        }

        _.addClass(event.target,'active');

        this.currentType=event.target.type;

        if(this.callback)this.callback();
      },
    });
    return Tab;
})

//ImgList
ns('ImgList',['util'],function(_){
    var template2='<div class="floatcard">\
    <a><img width="223px" height="124px" src="./img/course.jpg"></a>\
    <a><p class="title"></p></a>\
      <p class="num"><span><i></i><span class="count">66</span>人在学</span></p>\
      <p>发布者：<span class="pub"></span></p>\
      <p class="clearfix">分类：<span class="category"></span></p>\
      <div class="des"><div></div></div>\
    </div>'

    function FloatCard(opt){
      _.extend(this,opt);
      this.container=this.container || document.body
      this.madeCard();
      this.card.addEventListener('mouseleave',this.mouseout.bind(this))
    }
    _.extend(FloatCard.prototype,{

      _layout:_.html2node(template2),
      madeCard:function(event){
        var fcard=this._layout.cloneNode(true);


        this.card=fcard;
        this.container.appendChild(this.card);

        this.card.style.display='none';
      },
      mouseover:function(event){
        var target=event.currentTarget;
        var info=target.info;
        var fcard=this.card;


        //数据插入
        _.$(fcard,'img')[0].src=info.middlePhotoUrl;
        _.$(fcard,'.title')[0].innerText=info.name;
        _.$(fcard,'.num .count')[0].innerText=info.learnerCount;
        _.$(fcard,'.pub')[0].innerText=info.provider;
        _.$(fcard,'.category')[0].innerText=info.categoryName;
        _.$(fcard,'.des')[0].innerText=info.description;
         var host='http://study.163.com/course/introduction/';
        _.$(fcard,'a')[0].href=host+info.id+'.htm';
        _.$(fcard,'a')[1].href=host+info.id+'.htm';
        //读取并写入位置
        var top=target.offsetTop,
            left=target.offsetLeft;

        fcard.style.top=top+'px';
        fcard.style.left=left+'px';
        //ui 变换
        fcard.style.display='block';
        // target.style.opacity=0;
        //存储target指针
        this.target=target;
      },
      mouseout:function(){
        var target=this.target;
        var fcard=this.card;
        console.log('out ------')

        fcard.style.display='none';
        // target.style.opacity=1;
      }
      })
 var floatCard;


  var template='<div class="card">\
            <a class="link" href="#"><img src="./img/course.jpg" alt=""></a>\
            <a class="link" href=""><p class="title">混音全揭秘 舞曲实战篇 揭秘音乐揭秘揭秘</p></a>\
            <p class="pub">大香蕉</p>\
            <p class="num"><span><i></i><span class="count">66</span></span></p>\
            <em class="price">￥888.00</em>\
          </div>';

  /**
   * 图片列表
   * @Author   Zd
   * @DateTime 2016-09-09T16:40:01+0800
   * @param    {obj} opt ={container:node},容器为必填。
   * pageNo,psize,type为选填,定义请求参数
   * url为选填  定义接口url
   */
  function ImgList(opt){

    _.extend(this,opt);

    this.url=this.url || 'http://study.163.com/webDev/couresByCategory.htm';
    this.pageNo=this.pageNo||1;
    this.psize=this.psize||20;
    this.type=this.type||10;

    this.card=this._layout.cloneNode(true);
    this.container=this.container ||$('.testcon')[0];
    this.list=[];
    this.tab = this.tab ||'';

    this.img=this._layout.getElementsByTagName('img')[0];
    this.img.style.width='223px';
    this.img.style.height='124px';

    //初始化
    this.get();
    //初始化floatCard
    floatCard=new FloatCard({container:this.container});
  }

  _.extend(ImgList.prototype,{

    _layout:_.html2node(template),
    //回文解析
    _dataPrase:function(data){
      data=JSON.parse(data);
      //执行一个回调
      if(this.callback)this.callback();
      //存储总页数
      this.totlePage=data.pagination.totlePageCount;
      this.totleCount=data.pagination.totleCount;
      return data['list'];
    },
    //数据填充
    _fillData:function(data){
      var cards=_.$(this.container,'.card');
      for(var i=0,len=cards.length;i<len;i++){
        var l=cards[i];
        l.parentNode.removeChild(l);
      }
      for(var i=0,len=data.length;i<len;i++){

        var card=this._layout.cloneNode(true),
            info=data[i];
            card.info=info;
        _.$(card,'img')[0].src=info.middlePhotoUrl;
        _.$(card,'.title')[0].innerText=info.name;
        _.$(card,'.pub')[0].innerText=info.provider;
        _.$(card,'.count')[0].innerText=info.learnerCount;
        _.$(card,'.price')[0].innerText=(info.price==0?'免费':'￥'+info.price);

        var host='http://study.163.com/course/introduction/';
        _.$(card,'.link')[0].href=host+info.id+'.htm';
        _.$(card,'.link')[1].href=host+info.id+'.htm';


        this.container.appendChild(card);
        this.list.push(card);

        card.addEventListener('mouseenter',floatCard.mouseover.bind(floatCard))
        // card.addEventListener('mouseleave',floatCard.mouseout.bind(floatCard))
      }
    },
    //卡片填充
    _pushCard:function(text){

      var data=this._dataPrase(text);

      this._fillData(data);
      //补充的回调函数

    },
    //get封装
    get: function(pageIndex,type,psize){
      pageIndex=pageIndex || this.pageNo;
      type=type || this.type;
      psize=psize || this.psize;
      var data={
        pageNo:pageIndex,
        type:type,
        psize:psize
      }
      _.get.call(this,this.url,data,this._pushCard.bind(this));
    }


  });

  return ImgList;
})

//Pager
ns('Pager',['util'],function(_){
  var list=_.$('','.m-pager .num');
  var pre=_.$('','.m-pager .pre')[0];
  var next=_.$('','.m-pager .next')[0];
  var flag1=_.$('','.m-pager .flag1')[0];
  var flag2=_.$('','.m-pager .flag2')[0];
  /**
   * 翻页器
   * @Author   Zd
   * @DateTime 2016-09-09T16:58:42+0800
   * @param    {obj} opt 必填{callback:func,pageIndex:num,totlePage:num}
   */
  function Pager(opt){
    _.extend(this,opt)

    this.pageIndex=this.pageIndex || 1;
    this.totlePage= this.totlePage || 8;
    this.list=list;

    this.goto(1);

    pre.parentNode.addEventListener('click',this._onclick.bind(this));
    next.addEventListener('click',this._next.bind(this));
    pre.addEventListener('click',this._pre.bind(this));
  }
  _.extend(Pager.prototype,{

    goto:function(index){

      if (index<=5){
        for(var i=0,len=this.list.length;i<len;i++){
          var a=this.list[i];
          var num=i+1;

          a.innerText=num;
          a.value=num;
        }
      }else{
        for(var i=1,len=this.list.length;i<len;i++){
          var a=this.list[i];
          var num=i+index-4;
          a.innerText=num;
          a.value=num;
          if(a.value>this.totlePage){
            a.style.display='none';
          }else{
            a.style.display='inline-block';
          }
        }
      }
      //省略号显示切换
      this.list[1].value==2?flag1.style.display='none':flag1.style.display='inline-block';
      //
      if(this.list[7].value>=this.totlePage){
        flag2.style.display='none';
      }else{
        flag2.style.display='inline-block';
      }
      // ui切换
      for(var i=0,len=this.list.length;i<len;i++){
        var a=this.list[i];
        if(a.value==index){
          _.addClass(a,'current');
        }else{
          _.delClass(a,'current');
        }
      }
      //信息切换
      this.pageIndex=index;

      //next pre ui切换
      if(this.pageIndex<this.totlePage){
        _.delClass(next,'disable');
      }else{
        _.addClass(next,'disable');
      };
      if(this.pageIndex==1){
        _.addClass(pre,'disable');
      }else{
        _.delClass(pre,'disable');
      }
      //callback调用
      if(this.callback)this.callback();
    },
    _onclick:function(event){
      var index=event.target.value;
      if(index)this.goto(index);

    },
    _next:function(){
      var newIndex=this.pageIndex+1;
      if(newIndex<=this.totlePage){
        this.goto(newIndex);
      };

    },
    _pre:function(){
      var newIndex=this.pageIndex-1;
      if(newIndex>0){
        this.goto(newIndex);
      };

    },

  });
  return Pager;
})

//Vmodal
ns('Vmodal',['util'],function(_){

  template='<div class="m-v-modal">\
    <div class="helper"></div>\
    <div class="window">\
      <p class="title"></p>\
      <div class="close"></div>\
      <video src="" controls="" width="889px" height="567px"></video>\
    </div>\
  </div>';

  function Vmodal(opt){
    _.extend(this,opt);

    this.modal=this._layout.cloneNode(true);

    var modal=this.modal;
    _.$(modal,'.title')[0].innerText=this.title;
    _.$(modal,'video')[0].src=this.src;
    _.$(modal,'.close')[0].addEventListener('click',this.close.bind(this));
    document.body.appendChild(modal);
  };

  _.extend(Vmodal.prototype,{

    _layout:_.html2node(template),
    close:function(){
      this.modal.parentNode.removeChild(this.modal);
    }
  });
  return Vmodal;
})


