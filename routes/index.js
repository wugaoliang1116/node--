var express = require('express');
var router = express.Router();
var process = require('child_process');
const iconv = require('iconv-lite');
var http = require('http');
var fs = require("fs");
const cheerio = require('cheerio');
var url = 'http://www.ting56.com/mp3/1893.html'; //输入任何网址都可以
var length = 0;
var arr = [];
var slideListData;
http.get(url, function (res) {  //发送get请求
  var html = '';
  res.on('data', function (data) {
    arr.push(data);
    length += data.length;
    // html += data  //字符串的拼接
  })
  res.on('end', function () {
    // console.log(decodeURIComponent(html));
    // 通过过滤页面信息获取实际需求的轮播图信息
    slideListData = filterSlideList(arr);
    // router.get('/', function (req, res, next) {
    //   console.log('前台展示',JSON.stringify(slideListData));
    //   res.render('index', { title: '0000' }, function (err, html) {
    //     console.log('html',html)
    //   });
    // })
    console.log('000', slideListData);
    console.log("准备写入文件");
    fs.writeFile('input.txt', JSON.stringify(slideListData), function (err) {
      if (err) {
        return console.error(err);
      }
      console.log("数据写入成功！");
      console.log("--------我是分割线-------------")
      console.log("读取写入的数据！");
      fs.readFile('input.txt', function (err, data) {
        if (err) {
          return console.error(err);
        }
        
        // console.log("异步读取文件数据: " + data.toString());
      });
    });
  })
}).on('error', function () {
  console.log('获取资源出错！')
});
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: JSON.stringify(slideListData)});
  //shell；
  // process.exec('dir',{ encoding: 'buffer' },function (error, stdout, stderr) {
  //   stdout = iconv.decode(stdout, 'gbk');
  //   console.log(stdout);
  //   res.render('index', { title: stdout });
  //   if (error !== null) {
  //     console.log('exec error: ' + error);
  //   }
  // });
});

//生成静态文件
console.log('000', slideListData);
console.log("准备写入文件");
fs.writeFile('input.txt', JSON.stringify(slideListData), function (err) {
  if (err) {
    return console.error(err);
  }
  console.log("数据写入成功！");
  console.log("--------我是分割线-------------")
  console.log("读取写入的数据！");
  fs.readFile('input.txt', function (err, data) {
    if (err) {
      return console.error(err);
    }
    console.log("异步读取文件数据: " + data.toString());
  });
});

module.exports = router;





// /* 过滤页面信息 */
function filterSlideList(html) {
  if (html) {
    // 沿用JQuery风格，定义$
    var data = Buffer.concat(arr, length);
    var change_data = iconv.decode(data, 'gb2312');
    // console.log('编码后的数据',change_data)
    var $ = cheerio.load(change_data.toString());
    // 根据id获取轮播图列表信息
    var slideList = $('#vlink_1');
    console.log('获取资源', slideList.length);
    // 轮播图数据
    var slideListData = [];

    /* 轮播图列表信息遍历 */
    slideList.find('ul').find('li').each(function (item) {
      var pic = $(this);
      // 找到a标签并获取href属性
      var pic_href = pic.find('a').attr('href');
      // 找到a标签的子标签img并获取_src
      // var pic_src = pic.find('a').children('img').attr('_src');
      // 找到a标签的子标签img并获取alt
      var pic_message = pic.find('a').attr('title');
      // 向数组插入数据
      slideListData.push({
        pic_href: 'http://www.ting56.com'+pic_href,
        pic_message: pic_message,
        // pic_src: pic_src
      });
    });
    // 返回轮播图列表信息
    return slideListData;
  } else {
    console.log('无数据传入！');
  }
}











