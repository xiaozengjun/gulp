# gulp(自动化构建)

## 为什么用gulp

* 主要功能压缩合并js,css等(暂时未使用), 主要使用的gulp-file-include html合并
* 该项目为项目库的c端页面, 后期会越来越多, 而样式比较固定, 经常变动的地方如上传的表单, 列表的表头
* 这样头部导航, 尾部等地方都可以公用, 需要一个封装组件的功能, 方便后期修改,再打包所以都修改了
* 所以打算将共同的部分封装, 通过传值来生成不同的html, 类似vue的组件传值

## 使用方法

* gulpfile.js: gulp.task的第二个参数必须为函数(gulp4.0以上修改的)

* 没有使用less生成css, 而是用的vscode的插件, 需配置settings.json, 自动生成css, 且watch监听less文件, 没有监听css文件,

``` js
    "less.compile": {
        "out": "../css/"
    }
```

* html组件传值:
    1. 引用: @@include('../../common/header.html')
    2. 传值: @@include('../../common/header.html' , {'time':'润色'})
    3. if判断:  @@if (context.index==='active' ) { class="active" } 直接写在如`<div>`标签里面
    4. for循环
    5. 需要注意的地方: for循环里面不行使用if,可使用三元来代替
    6. 使用的时候需要`+ +`里面插入数据

``` html
    // for
    @@for (var i = 0; i < (context.breadcrumb.length); i++) {
        <li><a `+(context.breadcrumb[i].isassign == 'true' ? 'class="assign"' : '')+` href="`+context.breadcrumb[i].url+`">`+context.breadcrumb[i].text+`</a></li>
    }
    // 
```
